import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";
import {
  draftInquiryReply,
  sendInquiryReply,
  getInquiry,
} from "@/lib/inquiryReply";
import { getScheduledCourses, type ScheduledCourse } from "@/lib/schedule";

/**
 * /api/admin/blast — roster-confirmation blast over the active pipeline.
 *
 *   GET  → matches every active inquiry to a published course date and
 *          drafts a personalized confirmation email for each (nothing is
 *          sent). ?ids=a,b,c re-drafts a subset.
 *   POST → { items: [{ id, subject, body }] } sends the (possibly edited)
 *          drafts. The human review on /admin/blast IS the authorization —
 *          this endpoint never composes on its own.
 *
 * After a send: sendInquiryReply marks the row replied, then this bumps
 * new/replied → quoted (a dates-and-price ask is a quote) and stamps
 * admin_notes, so the digest stops nagging about them.
 */

export const maxDuration = 60;

const ACTIVE_STATUSES = ["new", "replied", "quoted", "deposit_sent"];
const DRAFT_CHUNK = 8; // parallel LLM drafts per wave — polite to rate limits
const SEND_CAP = 30;

interface Candidate {
  id: string;
  name: string;
  email: string;
  status: string;
  course: string;
  target: { title: string; range: string; seatsLeft: number | null } | null;
  subject?: string;
  body?: string;
  error?: string;
}

function fmtRange(c: ScheduledCourse): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const s = new Date(c.date + "T12:00:00");
  if (!c.end_date || c.end_date === c.date)
    return s.toLocaleDateString("en-US", opts);
  const e = new Date(c.end_date + "T12:00:00");
  return `${s.toLocaleDateString("en-US", opts)}–${
    s.getMonth() === e.getMonth()
      ? e.getDate()
      : e.toLocaleDateString("en-US", opts)
  }`;
}

function overlaps(
  row: Record<string, unknown>,
  course: ScheduledCourse,
): boolean {
  const rs = row.parsed_start_date as string | null;
  const re = (row.parsed_end_date as string | null) || rs;
  if (!rs) return false;
  const ce = course.end_date || course.date;
  return rs <= ce && (re as string) >= course.date;
}

/**
 * Pick the course date to confirm for this inquiry. AIDA 1 interest → the
 * nearest AIDA 1 date with seats; AIDA 2 → a date they overlap (even a full
 * one — quoted people ARE its seats) or the next open AIDA 2. Anything else
 * (coaching, camp, unclear) → null; the page leaves those unchecked.
 */
function pickTarget(
  row: Record<string, unknown>,
  courses: ScheduledCourse[],
): ScheduledCourse | null {
  const want = `${row.course || ""}`.toLowerCase();
  const a1 = courses.filter((c) => /aida\s*1/i.test(c.title));
  const a2 = courses.filter((c) => /aida\s*2/i.test(c.title));
  const pool = /aida\s*1|discover|intro/.test(want)
    ? a1
    : /aida\s*2/.test(want)
      ? a2
      : [];
  if (pool.length === 0) return null;

  const held = pool.find(
    (c) =>
      overlaps(row, c) &&
      ["quoted", "deposit_sent"].includes(`${row.status}`),
  );
  if (held) return held;
  const overlap = pool.find(
    (c) => overlaps(row, c) && (c.seatsLeft === null || c.seatsLeft > 0),
  );
  if (overlap) return overlap;
  return (
    pool.find((c) => c.seatsLeft === null || c.seatsLeft > 0) || null
  );
}

function directiveFor(
  row: Record<string, unknown>,
  target: ScheduledCourse | null,
): string {
  if (!target) {
    return "ROSTER CONFIRMATION BLAST: We've just published the new course dates (in the schedule above). This inquiry didn't match a specific date automatically — invite them to pick from the published dates and ask which works. Keep it under 100 words, warm, no fluff.";
  }
  const range = fmtRange(target);
  const full = target.seatsLeft !== null && target.seatsLeft <= 0;
  const heldSeat =
    full && ["quoted", "deposit_sent"].includes(`${row.status}`);
  if (heldSeat) {
    return `SEAT CONFIRMATION: We're holding this student a seat on ${target.title}, ${range}. Confirm the date is locked, ask them to reply and confirm they're set, and note the deposit invoice + onboarding forms are the next step if they haven't received them. Keep it under 110 words.`;
  }
  return `ROSTER CONFIRMATION BLAST: We've just published new course dates. Offer ${target.title} on ${range}${
    target.seatsLeft !== null ? ` (${target.seatsLeft} seats open)` : ""
  } as their date and ask for a simple yes to lock the seat — deposit invoice + onboarding forms follow on their yes. If that date can't work, point briefly at the other published dates. Keep it under 120 words, warm, no fluff.`;
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const idsParam = req.nextUrl.searchParams.get("ids");
  let query = supabase
    .from("course_inquiries")
    .select("*")
    .eq("archived", false)
    .in("status", ACTIVE_STATUSES)
    .order("created_at", { ascending: true });
  if (idsParam) query = query.in("id", idsParam.split(","));
  const [{ data: rows, error }, courses] = await Promise.all([
    query,
    getScheduledCourses(120).catch(() => [] as ScheduledCourse[]),
  ]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const candidates: Candidate[] = [];
  const list = rows || [];
  for (let i = 0; i < list.length; i += DRAFT_CHUNK) {
    const chunk = list.slice(i, i + DRAFT_CHUNK);
    const drafted = await Promise.all(
      chunk.map(async (row): Promise<Candidate> => {
        const target = pickTarget(row, courses);
        const base: Candidate = {
          id: row.id,
          name: `${row.first_name} ${row.last_name || ""}`.trim(),
          email: row.email,
          status: row.status,
          course: row.course,
          target: target
            ? {
                title: target.title,
                range: fmtRange(target),
                seatsLeft: target.seatsLeft,
              }
            : null,
        };
        const draft = await draftInquiryReply(row, directiveFor(row, target));
        return draft.ok
          ? { ...base, subject: draft.subject, body: draft.body }
          : { ...base, error: draft.error };
      }),
    );
    candidates.push(...drafted);
  }

  return NextResponse.json({
    candidates,
    schedule: courses.map((c) => ({
      title: c.title,
      range: fmtRange(c),
      seatsLeft: c.seatsLeft,
    })),
  });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let items: Array<{ id: string; subject: string; body: string }>;
  try {
    const parsed = await req.json();
    items = parsed.items;
    if (!Array.isArray(items) || items.length === 0) throw new Error();
  } catch {
    return NextResponse.json(
      { error: "items[] of {id, subject, body} required" },
      { status: 400 },
    );
  }
  if (items.length > SEND_CAP) {
    return NextResponse.json(
      { error: `max ${SEND_CAP} sends per request` },
      { status: 400 },
    );
  }

  const results: Array<{ id: string; sent: boolean; error?: string }> = [];
  for (const item of items) {
    const inquiry = await getInquiry(item.id);
    if (!inquiry) {
      results.push({ id: item.id, sent: false, error: "inquiry not found" });
      continue;
    }
    const sent = await sendInquiryReply(inquiry, item.subject, item.body);
    if (!sent.ok) {
      results.push({ id: item.id, sent: false, error: sent.error });
      continue;
    }
    // sendInquiryReply just stamped the row "replied" — always follow up:
    // new/replied advance to quoted (a dates+price ask IS a quote), while
    // quoted/deposit_sent get their original status restored.
    const note = `blast ${new Date().toISOString().slice(0, 10)}: confirmation sent`;
    const finalStatus = ["new", "replied"].includes(`${inquiry.status}`)
      ? "quoted"
      : (inquiry.status as string);
    await supabase
      .from("course_inquiries")
      .update({
        status: finalStatus,
        admin_notes: inquiry.admin_notes
          ? `${inquiry.admin_notes} | ${note}`
          : note,
      })
      .eq("id", item.id);
    results.push({ id: item.id, sent: true });
  }

  return NextResponse.json({
    sent: results.filter((r) => r.sent).length,
    results,
  });
}
