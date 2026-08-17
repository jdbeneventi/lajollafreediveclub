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
import { getScheduleContext, type ScheduleContext } from "@/lib/schedule";
import {
  buildDemandReport,
  type DemandInquiry,
  type DemandReport,
} from "@/lib/demandClusters";
import { actionLink, type ActAction } from "@/lib/actionTokens";
import { enrichInquiry } from "@/lib/extractInquiryFacts";
import { syncGmail, isGmailSyncConfigured } from "@/lib/gmailSync";
import { isCron } from "@/lib/adminAuth";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";
// During the business-mailbox transition the digest goes to BOTH inboxes;
// drop OWNER_EMAIL from this list once the new account is home base.
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL?.trim();
const DIGEST_RECIPIENTS = BUSINESS_EMAIL
  ? [OWNER_EMAIL, BUSINESS_EMAIL]
  : [OWNER_EMAIL];

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
    const sweepResults = await Promise.all(
      (unprocessed || []).map((row) => enrichInquiry(row, "digest")),
    );
    swept = sweepResults.filter((r) => r === "enriched").length;
  }

  // ─── Gmail sync: reconcile with what happened in Joshua's inbox ──────
  // Runs BEFORE the pull so today's digest reflects reality — inquiries he
  // already answered from his personal account flip to "replied" here
  // instead of nagging him. Fail-soft; skipped in preview and when the
  // GMAIL_* env vars are absent.
  const gmail = !preview && isGmailSyncConfigured() ? await syncGmail(30) : null;

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

  // 4. Demand + schedule intelligence: clusters of people who can share a
  //    course, matched against the live calendar (seats left) and open
  //    weekends, plus the triage lists (lapsed windows, duplicates).
  const todayPT = now.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  const scheduleCtx = await getScheduleContext(90).catch((): ScheduleContext => ({
    courses: [],
    busy: [],
    openWeekends: [],
  }));
  const demand = buildDemandReport(
    inquiries as unknown as DemandInquiry[],
    scheduleCtx.courses,
    scheduleCtx.openWeekends,
    todayPT,
  );

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
  const dateLabel = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const groupable = demand.clusters.filter((c) => c.people >= 2).length;
  const subject =
    totalActive === 0
      ? `LJFC inquiries — all clear (${dateLabel})`
      : `LJFC inquiries — ${totalActive} need attention${groupable > 0 ? `, ${groupable} groupable` : ""} (${dateLabel})`;

  const html = composeDigestHtml({
    newToday,
    staleNew,
    stalledQuotes,
    demand,
    schedule: scheduleCtx,
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
    to: DIGEST_RECIPIENTS,
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
      clusters: demand.clusters.length,
      staleWindows: demand.staleActive.length,
      scheduledCourses: scheduleCtx.courses.length,
      upcomingCourses: upcomingCourseDetails.length,
      intelSwept: swept,
      gmailSync: gmail,
    },
  });
}

// ─── HTML composer ─────────────────────────────────────────────────────────

type AnyRow = Record<string, unknown>;

function composeDigestHtml(d: {
  newToday: AnyRow[];
  staleNew: AnyRow[];
  stalledQuotes: AnyRow[];
  demand: DemandReport;
  schedule: ScheduleContext;
  upcomingCourseDetails: Array<{
    event: AnyRow;
    students: Array<{ email: string; paymentStatus: string | null; onboarded: boolean }>;
  }>;
}): string {
  const sections: string[] = [];
  const BASE = "https://lajollafreediveclub.com";
  const pipelineLink = `${BASE}/admin/inquiries`;

  const fmtDay = (iso: string) =>
    new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });

  // Student-typed strings (names, courses, free-text dates, notes) render
  // into this HTML — escape them so markup in a form field stays text.
  const esc = (v: unknown): string =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Signed one-tap links (src/lib/actionTokens.ts). Silently omitted if
  // ADMIN_KEY is unset — the digest must never fail over its buttons.
  const ACT_LABELS: Record<ActAction, string> = {
    draft: "Draft reply",
    replied: "Mark replied",
    archive: "Archive",
  };
  const actLinks = (id: unknown, actions: ActAction[]): string => {
    const parts = actions
      .map((a) => {
        const url = actionLink(BASE, String(id), a);
        return url
          ? `<a href="${url}" style="display:inline-block;padding:3px 10px;border:1px solid #1B6B6B;border-radius:50px;color:#1B6B6B;text-decoration:none;font-size:11px;font-weight:600;margin:4px 6px 0 0;">${ACT_LABELS[a]}</a>`
          : null;
      })
      .filter(Boolean);
    return parts.length ? `<div>${parts.join("")}</div>` : "";
  };

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

  // Gmail-thread state, when the sync has data for this row.
  const mailChip = (i: AnyRow): string => {
    const inAt = i.last_email_in_at ? new Date(String(i.last_email_in_at)) : null;
    const outAt = i.last_email_out_at ? new Date(String(i.last_email_out_at)) : null;
    if (inAt && (!outAt || inAt > outAt)) {
      return ` <span style="color:#C75B3A;font-weight:600;">· they emailed ${inAt.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Los_Angeles" })} — waiting on you</span>`;
    }
    if (outAt) {
      return ` <span style="color:#1B6B6B;">· you replied ${outAt.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Los_Angeles" })} (Gmail)</span>`;
    }
    return "";
  };

  const renderRow = (i: AnyRow, actions: ActAction[] = []) => {
    const name = `${i.first_name} ${i.last_name || ""}`.trim();
    const course = String(i.course || "").split("—")[0].trim();
    return `
      <div style="border-left:2px solid #1B6B6B;padding:8px 12px;margin-bottom:6px;background:#f7f9f9;">
        <div style="font-size:13px;color:#0B1D2C;font-weight:600;">${esc(name)} <span style="font-weight:400;color:#5a6a7a;">· ${esc(course)}</span></div>
        <div style="font-size:12px;color:#5a6a7a;margin-top:2px;">${esc(i.preferred_dates || "no dates given")} · ${esc(people(i))} · ${esc(i.experience || "no exp info")}${mailChip(i)}</div>
        ${actLinks(i.id, actions)}
      </div>
    `;
  };

  const moreNote = (shown: number, total: number) =>
    total > shown
      ? `<div style="font-size:12px;color:#5a6a7a;padding:4px 12px;">+ ${total - shown} more in <a href="${pipelineLink}" style="color:#1B6B6B;">the pipeline</a></div>`
      : "";

  if (d.newToday.length > 0) {
    sections.push(section("New today", d.newToday.length, d.newToday.map((i) => renderRow(i, ["draft", "replied"])).join(""), "#3db8a4"));
  }

  if (d.staleNew.length > 0) {
    const shown = d.staleNew.slice(0, 12);
    sections.push(
      section(
        "Awaiting reply >24h",
        d.staleNew.length,
        shown.map((i) => renderRow(i, ["draft", "replied"])).join("") + moreNote(shown.length, d.staleNew.length),
        "#C75B3A",
      ),
    );
  }

  if (d.stalledQuotes.length > 0) {
    sections.push(section("Quotes/deposits stalled >48h", d.stalledQuotes.length, d.stalledQuotes.map((i) => renderRow(i)).join(""), "#f0b429"));
  }

  // ── Demand clusters: who can share a course, and where it fits ──
  if (d.demand.clusters.length > 0) {
    const body = d.demand.clusters
      .slice(0, 6)
      .map((c) => {
        const names = c.members
          .slice(0, 5)
          .map((m) => (m.parsed_headcount && m.parsed_headcount > 1 ? `${esc(m.first_name)} (${m.parsed_headcount})` : esc(m.first_name)))
          .join(" + ");
        const window =
          c.windowStart === c.windowEnd
            ? fmtDay(c.windowStart)
            : `${fmtDay(c.windowStart)} – ${fmtDay(c.windowEnd)}`;
        const peopleLabel = `${c.peopleExact ? "" : "≥"}${c.people} ${c.people === 1 ? "person" : "people"}`;
        const fit = c.matchedEvent
          ? `fits <strong>${esc(c.matchedEvent.title)}</strong> ${fmtDay(c.matchedEvent.date)}${c.matchedEvent.end_date ? `–${fmtDay(c.matchedEvent.end_date)}` : ""}${c.matchedEvent.seatsLeft != null ? ` (${c.matchedEvent.seatsLeft} seats left)` : ""}`
          : c.suggestedWeekend
            ? `no course scheduled — open weekend <strong>${fmtDay(c.suggestedWeekend.friday)}–${fmtDay(c.suggestedWeekend.sunday)}</strong>${c.suggestedWeekend.personalNotes.length ? ` (you have: ${esc(c.suggestedWeekend.personalNotes[0])})` : ""}`
            : "no open weekend inside their window";
        const draftLinks = c.members
          .slice(0, 5)
          .map((m) => actLinks(m.id, ["draft"]).replace("Draft reply", `Draft ${esc(m.first_name)}`))
          .join("");
        return `
          <div style="border-left:2px solid #3db8a4;padding:8px 12px;margin-bottom:6px;background:#f7f9f9;">
            <div style="font-size:13px;color:#0B1D2C;font-weight:600;">${names} <span style="font-weight:400;color:#5a6a7a;">— ${peopleLabel}</span></div>
            <div style="font-size:12px;color:#5a6a7a;margin-top:2px;">${window} · ${esc(c.course)}${c.people >= 2 ? " · group rate unlocked" : ""} · ${fit}</div>
            ${draftLinks}
          </div>
        `;
      })
      .join("");
    sections.push(section("Demand clusters", d.demand.clusters.length, body, "#3db8a4"));
  }

  // ── Flexible pool: said "any time" — fills whatever date is announced ──
  if (d.demand.flexiblePools.length > 0) {
    const body = d.demand.flexiblePools
      .map(
        (p) => `
          <div style="border-left:2px solid #1B6B6B;padding:8px 12px;margin-bottom:6px;background:#f7f9f9;">
            <div style="font-size:13px;color:#0B1D2C;font-weight:600;">${esc(p.course)} <span style="font-weight:400;color:#5a6a7a;">— ${p.people} people, any date</span></div>
            <div style="font-size:12px;color:#5a6a7a;margin-top:2px;">${esc(p.names.join(", "))}</div>
          </div>
        `,
      )
      .join("");
    sections.push(section("Flexible — will take an announced date", d.demand.flexiblePools.reduce((s, p) => s + p.count, 0), body, "#1B6B6B"));
  }

  // ── Schedule snapshot: what's on the calendar, what's open ──
  {
    const courseLines =
      d.schedule.courses.length > 0
        ? d.schedule.courses
            .map((c) => {
              const range = c.end_date ? `${fmtDay(c.date)}–${fmtDay(c.end_date)}` : fmtDay(c.date);
              const seats = c.seatsLeft != null ? `${c.seatsLeft} of ${c.capacity} seats left` : `${c.enrolled} enrolled`;
              return `<div style="font-size:12px;color:#5a6a7a;margin:2px 0;"><strong style="color:#0B1D2C;">${esc(c.title)}</strong> · ${range} · ${seats}</div>`;
            })
            .join("")
        : `<div style="font-size:12px;color:#C75B3A;margin:2px 0;">No courses on the calendar in the next 90 days.</div>`;
    const weekends = d.schedule.openWeekends
      .slice(0, 4)
      .map((w) => `${fmtDay(w.friday)}–${fmtDay(w.sunday)}${w.personalNotes.length ? "*" : ""}`)
      .join(" · ");
    const icsNote = process.env.PERSONAL_ICS_URLS
      ? `<div style="font-size:11px;color:#5a6a7a;margin-top:4px;">* has a personal-calendar entry</div>`
      : `<div style="font-size:11px;color:#5a6a7a;margin-top:4px;">Personal calendars not connected — set PERSONAL_ICS_URLS to overlay your own commitments.</div>`;
    const body = `
      <div style="border-left:2px solid #163B4E;padding:8px 12px;margin-bottom:6px;background:#f7f9f9;">
        ${courseLines}
        <div style="font-size:12px;color:#5a6a7a;margin-top:6px;"><strong style="color:#0B1D2C;">Open weekends:</strong> ${weekends || "none in the next 8 weeks"}</div>
        ${icsNote}
      </div>
    `;
    sections.push(section("Schedule", d.schedule.courses.length, body, "#163B4E"));
  }

  // ── Triage: their window has passed but the status never moved ──
  if (d.demand.staleActive.length > 0) {
    const shown = d.demand.staleActive.slice(0, 12);
    const body =
      shown
        .map(
          (i) => `
            <div style="border-left:2px solid #C75B3A;padding:8px 12px;margin-bottom:6px;background:#f7f9f9;">
              <div style="font-size:13px;color:#0B1D2C;font-weight:600;">${esc(i.first_name)} ${esc(i.last_name || "")} <span style="font-weight:400;color:#5a6a7a;">· ${esc(i.course.split("—")[0].trim())}</span></div>
              <div style="font-size:12px;color:#5a6a7a;margin-top:2px;">window ended ${fmtDay(i.parsed_end_date!)} · still "${esc(i.status)}" — handled in Gmail, or missed?</div>
              ${actLinks(i.id, ["replied", "archive"])}
            </div>
          `,
        )
        .join("") + moreNote(shown.length, d.demand.staleActive.length);
    sections.push(section("Window passed — mark or archive", d.demand.staleActive.length, body, "#C75B3A"));
  }

  // ── Duplicates ──
  if (d.demand.duplicateEmails.length > 0) {
    const body = d.demand.duplicateEmails
      .map(
        (dup) => `
          <div style="font-size:12px;color:#5a6a7a;padding:4px 12px;">${esc(dup.inquiries[0].first_name)} (${esc(dup.email)}) has ${dup.inquiries.length} active inquiries — worth merging</div>
        `,
      )
      .join("");
    sections.push(section("Duplicates", d.demand.duplicateEmails.length, body, "#f0b429"));
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
                    `<div style="font-size:12px;color:#5a6a7a;margin:2px 0;">${esc(s.email)} · ${s.paymentStatus || "pending"} · ${s.onboarded ? "<strong style=\"color:#1B6B6B;\">onboarded ✓</strong>" : "<span style=\"color:#C75B3A;\">not onboarded</span>"}</div>`,
                )
                .join("");
        return `
          <div style="border-left:2px solid #163B4E;padding:8px 12px;margin-bottom:8px;background:#f7f9f9;">
            <div style="font-size:13px;color:#0B1D2C;font-weight:600;">${esc(c.event.title)} <span style="font-weight:400;color:#5a6a7a;">· ${date}${endDate}</span></div>
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
