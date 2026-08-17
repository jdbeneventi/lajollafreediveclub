/**
 * /api/inquiry-digest
 *
 * Daily summary email to Joshua: what needs attention in the inquiries
 * pipeline right now. Intended to be fired by a scheduled-tasks runner
 * (not Vercel cron — keeps us off the Pro plan requirement).
 *
 * Sections:
 *   1. New inquiries in the last 24h
 *   2. Inquiries awaiting reply >24h (status='new' or 'replied' with no
 *      forward motion — flag the stale ones)
 *   3. Deposits pending >48h (sent Stripe link, no payment yet)
 *   4. Suggested groupings — auto-detected overlapping inquiries that could
 *      combine for the group rate
 *   5. Upcoming courses in the next 7 days with per-student readiness
 *
 * Auth: ?secret=ljfc-daily-2026 (matches existing daily-email auth pattern)
 *       or X-Cron-Secret header with CRON_SECRET env var
 *
 * Returns JSON { sent: true, sections: {...} } so the scheduled task can
 * log what went out.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { buildConflictReport, type InquiryLite, type CalendarEventLite } from "@/lib/inquiryConflicts";
import { enrichInquiry } from "@/lib/extractInquiryFacts";
import { isCron } from "@/lib/adminAuth";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

// The intel sweep adds a few sequential LLM calls before composing.
export const maxDuration = 60;

function authed(req: NextRequest): boolean {
  return isCron(req);
}

export async function GET(req: NextRequest) {
  return runDigest(req);
}

export async function POST(req: NextRequest) {
  return runDigest(req);
}

async function runDigest(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const preview = req.nextUrl.searchParams.get("preview") === "true";

  // ─── Intel sweep: extract facts for a few unprocessed inquiries ──────
  // Self-healing catch-up for the insert-time extraction: rows created
  // before the feature, or missed during a deploy/API blip, converge a
  // few per day. Skipped in preview so the HTML check stays instant, and
  // a no-op until the inquiry-intel migration + ANTHROPIC_API_KEY exist.
  let swept = 0;
  if (!preview && process.env.ANTHROPIC_API_KEY) {
    const { data: unprocessed } = await supabase
      .from("course_inquiries")
      .select(
        "id, created_at, course, experience, preferred_dates, group_size, message, parsed_start_date, parsed_end_date",
      )
      .eq("archived", false)
      .is("ai_facts", null)
      .order("created_at", { ascending: false })
      .limit(3);
    for (const row of unprocessed || []) {
      if ((await enrichInquiry(row, "digest")) === "enriched") swept++;
    }
  }

  // ─── Pull everything we need ─────────────────────────────────────────
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    { data: allInquiries },
    { data: upcomingEvents },
  ] = await Promise.all([
    supabase
      .from("course_inquiries")
      .select("*")
      .eq("archived", false)
      .order("created_at", { ascending: false }),
    supabase
      .from("calendar_events")
      .select("*")
      .eq("active", true)
      .gte("date", now.toISOString().slice(0, 10))
      .lte("date", sevenDaysFromNow.toISOString().slice(0, 10))
      .in("category", ["course", "camp"])
      .order("date", { ascending: true }),
  ]);

  const inquiries = allInquiries || [];
  const events = upcomingEvents || [];

  // 1. New in last 24h
  const newToday = inquiries.filter(
    (i) => i.status === "new" && new Date(i.created_at) >= oneDayAgo,
  );

  // 2. Stale "new" — >24h old
  const staleNew = inquiries.filter(
    (i) => i.status === "new" && new Date(i.created_at) < oneDayAgo,
  );

  // 3. Quoted but no deposit >48h
  const stalledQuotes = inquiries.filter((i) => {
    if (i.status !== "quoted" && i.status !== "deposit_sent") return false;
    return new Date(i.status_updated_at) < twoDaysAgo;
  });

  // 4. Grouping opportunities
  const liteInquiries: InquiryLite[] = inquiries.map((i) => ({
    id: i.id,
    first_name: i.first_name,
    last_name: i.last_name,
    email: i.email,
    course: i.course,
    parsed_start_date: i.parsed_start_date,
    parsed_end_date: i.parsed_end_date,
    group_size: i.group_size,
    parsed_headcount: i.parsed_headcount ?? null,
    status: i.status,
  }));
  const liteEvents: CalendarEventLite[] = events.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    date: e.date,
    end_date: e.end_date,
  }));
  const conflicts = buildConflictReport(liteInquiries, liteEvents, { minOverlapDays: 2 });

  // 5. Upcoming courses → readiness per booked student
  const upcomingCourseDetails = await Promise.all(
    events.map(async (e) => {
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id, email, status, payment_status, course")
        .eq("event_id", e.id);
      const studentEmails = (bookings || []).map((b) => b.email).filter(Boolean);
      const { data: onboarding } = studentEmails.length
        ? await supabase
            .from("student_onboarding")
            .select("email, completed_at")
            .in("email", studentEmails)
        : { data: [] as Array<{ email: string; completed_at: string | null }> };
      const onboardingMap = new Map((onboarding || []).map((o) => [o.email, o.completed_at]));
      return {
        event: e,
        students: (bookings || []).map((b) => ({
          email: b.email,
          paymentStatus: b.payment_status,
          onboarded: !!onboardingMap.get(b.email),
        })),
      };
    }),
  );

  // ─── Compose email HTML ───────────────────────────────────────────────
  const totalActive = newToday.length + staleNew.length + stalledQuotes.length;
  const subject =
    totalActive === 0
      ? `LJFC inquiries — all clear (${now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })})`
      : `LJFC inquiries — ${totalActive} need attention (${now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })})`;

  const html = composeDigestHtml({
    newToday,
    staleNew,
    stalledQuotes,
    groupings: conflicts.groupings,
    upcomingCourseDetails,
  });

  if (preview) {
    return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html" } });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
    to: [OWNER_EMAIL],
    subject,
    html,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    sent: true,
    counts: {
      newToday: newToday.length,
      staleNew: staleNew.length,
      stalledQuotes: stalledQuotes.length,
      groupings: conflicts.groupings.length,
      upcomingCourses: upcomingCourseDetails.length,
      intelSwept: swept,
    },
  });
}

// ─── HTML composer ─────────────────────────────────────────────────────────

type AnyRow = Record<string, unknown>;

function composeDigestHtml(d: {
  newToday: AnyRow[];
  staleNew: AnyRow[];
  stalledQuotes: AnyRow[];
  groupings: ReturnType<typeof buildConflictReport>["groupings"];
  upcomingCourseDetails: Array<{
    event: AnyRow;
    students: Array<{ email: string; paymentStatus: string | null; onboarded: boolean }>;
  }>;
}): string {
  const sections: string[] = [];
  const pipelineLink = "https://lajollafreediveclub.com/admin/inquiries?key=ljfc";

  const section = (title: string, badge: number, body: string, color: string) => `
    <div style="margin:24px 0;">
      <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px;">
        <span style="font-size:11px;color:${color};font-weight:600;letter-spacing:0.15em;text-transform:uppercase;">${title}</span>
        <span style="font-size:11px;color:#5a6a7a;">(${badge})</span>
      </div>
      ${body}
    </div>
  `;

  // Prefer the LLM-extracted headcount over the raw group_size text.
  const people = (i: AnyRow) =>
    typeof i.parsed_headcount === "number"
      ? `${i.parsed_headcount} ${i.parsed_headcount === 1 ? "person" : "people"}`
      : String(i.group_size || "—");

  const renderRow = (i: AnyRow) => {
    const name = `${i.first_name} ${i.last_name || ""}`.trim();
    const course = String(i.course || "").split("—")[0].trim();
    return `
      <div style="border-left:2px solid #1B6B6B;padding:8px 12px;margin-bottom:6px;background:#f7f9f9;">
        <div style="font-size:13px;color:#0B1D2C;font-weight:600;">${name} <span style="font-weight:400;color:#5a6a7a;">· ${course}</span></div>
        <div style="font-size:12px;color:#5a6a7a;margin-top:2px;">${i.preferred_dates || "no dates given"} · ${people(i)} · ${i.experience || "no exp info"}</div>
      </div>
    `;
  };

  if (d.newToday.length > 0) {
    sections.push(section("New today", d.newToday.length, d.newToday.map(renderRow).join(""), "#3db8a4"));
  }

  if (d.staleNew.length > 0) {
    sections.push(section("Awaiting reply >24h", d.staleNew.length, d.staleNew.map(renderRow).join(""), "#C75B3A"));
  }

  if (d.stalledQuotes.length > 0) {
    sections.push(section("Quotes/deposits stalled >48h", d.stalledQuotes.length, d.stalledQuotes.map(renderRow).join(""), "#f0b429"));
  }

  if (d.groupings.length > 0) {
    const body = d.groupings
      .map((g) => {
        const names = g.inquiries.map((i) => i.first_name).join(" + ");
        const start = g.windowStart.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
        const end = g.windowEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
        const window = g.windowStart.getTime() === g.windowEnd.getTime() ? start : `${start} – ${end}`;
        // Combined headcount across the grouping; an inquiry with no
        // extracted count is at least the writer, so the total shows "≥".
        const combined = g.inquiries.reduce((sum, i) => sum + (i.parsed_headcount ?? 1), 0);
        const exact = g.inquiries.every((i) => i.parsed_headcount != null);
        const peopleLabel = `${exact ? "" : "≥"}${combined} people`;
        return `
          <div style="border-left:2px solid #3db8a4;padding:8px 12px;margin-bottom:6px;background:#f7f9f9;">
            <div style="font-size:13px;color:#0B1D2C;font-weight:600;">${names}</div>
            <div style="font-size:12px;color:#5a6a7a;margin-top:2px;">${window} · ${g.overlapDays}d overlap · ${peopleLabel} · ${g.course} — group rate ($575/person)</div>
          </div>
        `;
      })
      .join("");
    sections.push(section("Suggested groupings", d.groupings.length, body, "#3db8a4"));
  }

  if (d.upcomingCourseDetails.length > 0) {
    const body = d.upcomingCourseDetails
      .map((c) => {
        const date = String(c.event.date || "");
        const endDate = c.event.end_date ? ` – ${c.event.end_date}` : "";
        const studentList =
          c.students.length === 0
            ? "<span style=\"color:#5a6a7a;font-style:italic;\">no enrolled students yet</span>"
            : c.students
                .map(
                  (s) =>
                    `<div style="font-size:12px;color:#5a6a7a;margin:2px 0;">${s.email} · ${s.paymentStatus || "pending"} · ${s.onboarded ? "<strong style=\"color:#1B6B6B;\">onboarded ✓</strong>" : "<span style=\"color:#C75B3A;\">not onboarded</span>"}</div>`,
                )
                .join("");
        return `
          <div style="border-left:2px solid #163B4E;padding:8px 12px;margin-bottom:8px;background:#f7f9f9;">
            <div style="font-size:13px;color:#0B1D2C;font-weight:600;">${c.event.title} <span style="font-weight:400;color:#5a6a7a;">· ${date}${endDate}</span></div>
            ${studentList}
          </div>
        `;
      })
      .join("");
    sections.push(section("Upcoming courses (next 7 days)", d.upcomingCourseDetails.length, body, "#163B4E"));
  }

  if (sections.length === 0) {
    sections.push(
      `<div style="padding:16px;text-align:center;color:#5a6a7a;font-style:italic;">Nothing to flag today. Inbox is clean.</div>`,
    );
  }

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:640px;padding:24px;color:#0B1D2C;">
      <div style="text-align:center;margin-bottom:8px;">
        <span style="font-size:10px;color:#1B6B6B;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;">Daily inquiry digest</span>
      </div>
      <h1 style="font-size:22px;color:#0B1D2C;text-align:center;margin:0 0 24px 0;font-weight:600;">La Jolla Freedive Club</h1>

      ${sections.join("")}

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e6e9ea;text-align:center;">
        <a href="${pipelineLink}" style="display:inline-block;padding:10px 24px;background:#3db8a4;color:#0B1D2C;border-radius:50px;text-decoration:none;font-weight:600;font-size:13px;">
          Open inquiries pipeline →
        </a>
      </div>
    </div>
  `;
}
