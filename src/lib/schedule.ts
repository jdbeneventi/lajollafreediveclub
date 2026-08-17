import { supabase } from "@/lib/supabase";

/**
 * Schedule intelligence — one place that knows what's on the calendar.
 *
 * Three sources merged into one picture:
 *
 *   1. Scheduled courses/camps — the calendar_events table (the live source
 *      behind /api/calendar and /admin/calendar; src/lib/calendar.ts is a
 *      static legacy list and is NOT read here), joined to bookings by
 *      event_id for an enrolled count. Capacity comes from the free-text
 *      `spots` column ("4 spots" → 4); rows without a parseable number get
 *      capacity null and seats-left unknown.
 *
 *   2. Joshua's personal calendars — optional PERSONAL_ICS_URLS env var,
 *      comma-separated Google Calendar "secret address in iCal format"
 *      URLs. Read-only, no OAuth, revocable from Google settings. Without
 *      the env var this source is silently empty.
 *
 *   3. Open weekends — Fri–Sun blocks in the horizon with no scheduled
 *      course/camp. Personal busy events are listed against each weekend
 *      but do NOT disqualify it: a one-hour Saturday commitment shouldn't
 *      hide the weekend, and every suggestion downstream is advisory —
 *      Joshua confirms before anything is scheduled.
 *
 * ICS parsing is deliberately small: DTSTART/DTEND/SUMMARY plus a basic
 * RRULE expansion (DAILY/WEEKLY with INTERVAL, BYDAY, UNTIL). MONTHLY/
 * YEARLY/COUNT rules fall back to their first instance inside the horizon.
 * Good enough for "am I already committed that weekend" — not a full
 * RFC 5545 implementation.
 *
 * Fail-soft throughout: a dead ICS URL, a malformed feed, or a DB error
 * degrades to an empty list and a console.error, never a throw.
 */

export interface ScheduledCourse {
  id: string;
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
  end_date: string | null;
  time: string | null;
  capacity: number | null; // parsed from spots text
  enrolled: number; // bookings linked by event_id, not cancelled
  seatsLeft: number | null; // capacity - enrolled, when capacity known
}

export interface BusyBlock {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD inclusive
  summary: string;
  calendar: string; // label derived from the feed (X-WR-CALNAME or index)
}

export interface OpenWeekend {
  friday: string; // YYYY-MM-DD
  sunday: string; // YYYY-MM-DD
  personalNotes: string[]; // busy summaries that touch it, if any
}

export interface ScheduleContext {
  courses: ScheduledCourse[];
  busy: BusyBlock[];
  openWeekends: OpenWeekend[];
}

const DAY_MS = 86_400_000;

function todayPacific(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Los_Angeles",
  });
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + days * DAY_MS)
    .toISOString()
    .slice(0, 10);
}

function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

// ─── Scheduled courses ────────────────────────────────────────────────────

export async function getScheduledCourses(
  horizonDays = 90,
): Promise<ScheduledCourse[]> {
  const start = todayPacific();
  const end = addDays(start, horizonDays);

  const { data: events, error } = await supabase
    .from("calendar_events")
    .select("id, title, category, date, end_date, time, spots")
    .eq("active", true)
    .in("category", ["course", "camp"])
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true });

  if (error || !events) {
    if (error) console.error("[schedule] events query failed:", error.message);
    return [];
  }
  if (events.length === 0) return [];

  const { data: bookings } = await supabase
    .from("bookings")
    .select("event_id, status")
    .in(
      "event_id",
      events.map((e) => e.id),
    );

  const enrolledByEvent = new Map<string, number>();
  for (const b of bookings || []) {
    if (!b.event_id || b.status === "cancelled") continue;
    enrolledByEvent.set(b.event_id, (enrolledByEvent.get(b.event_id) || 0) + 1);
  }

  return events.map((e) => {
    const capMatch = String(e.spots || "").match(/\d+/);
    const capacity = capMatch ? Number(capMatch[0]) : null;
    const enrolled = enrolledByEvent.get(e.id) || 0;
    return {
      id: e.id,
      title: e.title,
      category: e.category,
      date: e.date,
      end_date: e.end_date,
      time: e.time,
      capacity,
      enrolled,
      seatsLeft: capacity != null ? Math.max(capacity - enrolled, 0) : null,
    };
  });
}

// ─── Personal calendars (ICS) ─────────────────────────────────────────────

/** Unfold RFC 5545 continuation lines and split into raw VEVENT blocks. */
function icsEvents(ics: string): string[] {
  const unfolded = ics.replace(/\r?\n[ \t]/g, "");
  const out: string[] = [];
  const re = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
  let m;
  while ((m = re.exec(unfolded))) out.push(m[1]);
  return out;
}

function icsProp(block: string, name: string): string | null {
  // Property may carry params: DTSTART;VALUE=DATE:20260905
  const m = block.match(new RegExp(`^${name}[;:]([^\\n]*)`, "m"));
  if (!m) return null;
  const raw = m[1];
  const colon = raw.indexOf(":");
  return colon >= 0 && raw.slice(0, colon).includes("=")
    ? raw.slice(colon + 1).trim()
    : raw.replace(/^.*?:/, "").trim() || raw.trim();
}

/** 20260905 / 20260905T160000Z / 20260905T090000 → YYYY-MM-DD (local day). */
function icsDate(value: string | null): string | null {
  if (!value) return null;
  const m = value.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!m) return null;
  // For timed UTC values the calendar day in La Jolla can differ; convert.
  const timed = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?Z$/);
  if (timed) {
    const dt = new Date(
      Date.UTC(
        Number(timed[1]),
        Number(timed[2]) - 1,
        Number(timed[3]),
        Number(timed[4]),
        Number(timed[5]),
        Number(timed[6] || 0),
      ),
    );
    return dt.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  }
  return `${m[1]}-${m[2]}-${m[3]}`;
}

const WEEKDAYS: Record<string, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

/**
 * Expand one VEVENT into busy blocks inside [horizonStart, horizonEnd].
 * Non-recurring: one block. DAILY/WEEKLY RRULE: expanded. Anything else:
 * first instance only (approximation, see module comment).
 */
function expandEvent(
  block: string,
  calendar: string,
  horizonStart: string,
  horizonEnd: string,
): BusyBlock[] {
  const start = icsDate(icsProp(block, "DTSTART"));
  if (!start) return [];
  const rawEnd = icsDate(icsProp(block, "DTEND"));
  // DTEND on all-day events is exclusive; make inclusive. Timed events on
  // one day resolve to the same date either way.
  const isAllDay = /DTSTART;VALUE=DATE[:;]/.test(block);
  let end = rawEnd || start;
  if (isAllDay && rawEnd && rawEnd > start) end = addDays(rawEnd, -1);
  if (end < start) end = start;

  const summary = (icsProp(block, "SUMMARY") || "busy").slice(0, 80);
  const durationDays = Math.round(
    (Date.parse(end) - Date.parse(start)) / DAY_MS,
  );

  const rrule = icsProp(block, "RRULE");
  if (!rrule) {
    return rangesOverlap(start, end, horizonStart, horizonEnd)
      ? [{ start, end, summary, calendar }]
      : [];
  }

  const freq = /FREQ=(\w+)/.exec(rrule)?.[1];
  const interval = Number(/INTERVAL=(\d+)/.exec(rrule)?.[1] || 1);
  const until = icsDate(/UNTIL=([\dTZ]+)/.exec(rrule)?.[1] || null);
  const cap = until && until < horizonEnd ? until : horizonEnd;

  if (freq !== "DAILY" && freq !== "WEEKLY") {
    // MONTHLY/YEARLY/COUNT etc. — first instance only.
    return rangesOverlap(start, end, horizonStart, horizonEnd)
      ? [{ start, end, summary, calendar }]
      : [];
  }

  const byday = /BYDAY=([\w,]+)/.exec(rrule)?.[1];
  const days =
    freq === "WEEKLY" && byday
      ? byday
          .split(",")
          .map((d) => WEEKDAYS[d.slice(-2)])
          .filter((n) => n !== undefined)
      : null;

  const out: BusyBlock[] = [];
  const stepDays = freq === "DAILY" ? interval : 1;
  // Walk day by day from the series start; for WEEKLY honor the interval by
  // whole weeks from the start date.
  for (
    let cursor = start;
    cursor <= cap && out.length < 200;
    cursor = addDays(cursor, stepDays)
  ) {
    if (freq === "WEEKLY") {
      const weeksFromStart = Math.floor(
        (Date.parse(cursor) - Date.parse(start)) / (7 * DAY_MS),
      );
      if (weeksFromStart % interval !== 0) continue;
      const dow = new Date(cursor + "T12:00:00Z").getUTCDay();
      if (days ? !days.includes(dow) : cursor !== addDays(start, weeksFromStart * 7)) {
        continue;
      }
    }
    const blockEnd = addDays(cursor, durationDays);
    if (rangesOverlap(cursor, blockEnd, horizonStart, horizonEnd)) {
      out.push({ start: cursor, end: blockEnd, summary, calendar });
    }
  }
  return out;
}

export async function getPersonalBusy(horizonDays = 90): Promise<BusyBlock[]> {
  const urls = (process.env.PERSONAL_ICS_URLS || "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  if (urls.length === 0) return [];

  const horizonStart = todayPacific();
  const horizonEnd = addDays(horizonStart, horizonDays);
  const out: BusyBlock[] = [];

  await Promise.all(
    urls.map(async (url, idx) => {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "ljfc-schedule/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) {
          console.error(`[schedule] ICS feed ${idx + 1} returned ${res.status}`);
          return;
        }
        const ics = await res.text();
        const label =
          /X-WR-CALNAME:([^\n]*)/.exec(ics)?.[1]?.trim() || `calendar ${idx + 1}`;
        for (const block of icsEvents(ics)) {
          // Declined/cancelled entries aren't commitments.
          if (/^STATUS:CANCELLED/m.test(block)) continue;
          out.push(...expandEvent(block, label, horizonStart, horizonEnd));
        }
      } catch (e) {
        console.error(
          `[schedule] ICS feed ${idx + 1} failed:`,
          e instanceof Error ? e.message : e,
        );
      }
    }),
  );

  return out.sort((a, b) => a.start.localeCompare(b.start));
}

// ─── Open weekends ────────────────────────────────────────────────────────

export function findOpenWeekends(
  courses: ScheduledCourse[],
  busy: BusyBlock[],
  weeks = 8,
): OpenWeekend[] {
  const today = todayPacific();
  const dow = new Date(today + "T12:00:00Z").getUTCDay();
  // Next Friday (today counts if it's Thu or earlier — a Friday weekend
  // already underway isn't schedulable).
  let friday = addDays(today, (5 - dow + 7) % 7 || 7);
  const out: OpenWeekend[] = [];

  for (let i = 0; i < weeks; i++) {
    const sunday = addDays(friday, 2);
    const hasCourse = courses.some((c) =>
      rangesOverlap(c.date, c.end_date || c.date, friday, sunday),
    );
    if (!hasCourse) {
      const personalNotes = busy
        .filter((b) => rangesOverlap(b.start, b.end, friday, sunday))
        .map((b) => `${b.summary} (${b.start === b.end ? b.start : `${b.start}→${b.end}`})`)
        .slice(0, 4);
      out.push({ friday, sunday, personalNotes });
    }
    friday = addDays(friday, 7);
  }
  return out;
}

// ─── One call for everything ──────────────────────────────────────────────

export async function getScheduleContext(
  horizonDays = 90,
): Promise<ScheduleContext> {
  const [courses, busy] = await Promise.all([
    getScheduledCourses(horizonDays),
    getPersonalBusy(horizonDays),
  ]);
  return { courses, busy, openWeekends: findOpenWeekends(courses, busy) };
}

/**
 * Compact plain-text description for LLM prompts (the reply drafter).
 * Says what is scheduled, what has room, and which weekends are open, so
 * drafts propose dates that actually exist.
 */
export function describeScheduleForPrompt(ctx: ScheduleContext): string {
  const lines: string[] = [];

  if (ctx.courses.length > 0) {
    lines.push("== SCHEDULED COURSES (live calendar) ==");
    for (const c of ctx.courses) {
      const range = c.end_date ? `${c.date} to ${c.end_date}` : c.date;
      const seats =
        c.seatsLeft != null
          ? `${c.seatsLeft} of ${c.capacity} seats left`
          : `enrolled: ${c.enrolled}`;
      lines.push(`- ${c.title}: ${range} (${seats})`);
    }
  } else {
    lines.push("== SCHEDULED COURSES: none currently on the calendar ==");
  }

  if (ctx.openWeekends.length > 0) {
    lines.push("== OPEN WEEKENDS (no course scheduled; good slots to propose) ==");
    for (const w of ctx.openWeekends.slice(0, 5)) {
      const note =
        w.personalNotes.length > 0
          ? ` — note, Joshua has: ${w.personalNotes.join("; ")}`
          : "";
      lines.push(`- Fri ${w.friday} to Sun ${w.sunday}${note}`);
    }
  }

  lines.push(
    "Prefer inviting students into a scheduled course with seats left over proposing a new date. Never promise a new date outright — propose it as an option Joshua will confirm.",
  );
  return lines.join("\n");
}
