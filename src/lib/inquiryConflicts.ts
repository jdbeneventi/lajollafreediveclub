/**
 * Conflict & opportunity detection across inquiry date windows.
 *
 * Inputs: inquiries with parsed_start_date/parsed_end_date (DATE strings from
 * Supabase) and an optional list of busy calendar events. Outputs:
 *
 *   - overlaps: pairs of inquiries with overlapping date windows
 *   - groupings: suggested combinations (2+ inquiries that share enough days
 *     to run as one course at group rate)
 *   - calendarConflicts: inquiry windows that collide with existing scheduled
 *     courses on /admin/calendar
 *
 * Treats inquiries with null parsed dates as "unknown window" — they're not
 * matched and not flagged.
 */

export interface InquiryLite {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  course: string;
  parsed_start_date: string | null;
  parsed_end_date: string | null;
  group_size: string | null;
  /** LLM-extracted people count (inquiry-intel). Optional — null/absent = unknown, treat as at least 1. */
  parsed_headcount?: number | null;
  status: string;
}

export interface CalendarEventLite {
  id: string;
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
  end_date: string | null;
}

export interface OverlapPair {
  a: InquiryLite;
  b: InquiryLite;
  overlapStart: Date;
  overlapEnd: Date;
  overlapDays: number;
  sameCourse: boolean;
}

export interface GroupingSuggestion {
  inquiries: InquiryLite[];
  windowStart: Date;
  windowEnd: Date;
  overlapDays: number;
  course: string;
}

export interface CalendarConflict {
  inquiry: InquiryLite;
  event: CalendarEventLite;
  overlapDays: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

const MS_PER_DAY = 86_400_000;

function parseISO(d: string | null | undefined): Date | null {
  if (!d) return null;
  // Supabase DATE columns come back as "YYYY-MM-DD"
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return null;
  return new Date(Date.UTC(y, m - 1, day));
}

function inclusiveDays(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
}

function intersect(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): { start: Date; end: Date; days: number } | null {
  const start = aStart > bStart ? aStart : bStart;
  const end = aEnd < bEnd ? aEnd : bEnd;
  if (start > end) return null;
  return { start, end, days: inclusiveDays(start, end) };
}

/**
 * Normalize a course string for grouping. "AIDA 2 — Open Water Certification"
 * → "aida 2". Used to detect when two inquiries want the same course.
 * Exported so demandClusters.ts groups by the same key.
 */
export function courseKey(course: string): string {
  return course.toLowerCase().split("—")[0].split("(")[0].trim();
}

// Status states where it's still useful to suggest pairings.
const ACTIVE_STATUSES = new Set(["new", "replied", "quoted"]);

// ─── Main entry points ────────────────────────────────────────────────────

/**
 * Find every pair of inquiries with overlapping date windows.
 */
export function findOverlaps(inquiries: InquiryLite[]): OverlapPair[] {
  const eligible = inquiries
    .filter((i) => ACTIVE_STATUSES.has(i.status))
    .map((i) => ({
      i,
      start: parseISO(i.parsed_start_date),
      end: parseISO(i.parsed_end_date),
    }))
    .filter((x): x is { i: InquiryLite; start: Date; end: Date } => !!x.start && !!x.end);

  const out: OverlapPair[] = [];
  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      const a = eligible[i];
      const b = eligible[j];
      const ix = intersect(a.start, a.end, b.start, b.end);
      if (ix) {
        out.push({
          a: a.i,
          b: b.i,
          overlapStart: ix.start,
          overlapEnd: ix.end,
          overlapDays: ix.days,
          sameCourse: courseKey(a.i.course) === courseKey(b.i.course),
        });
      }
    }
  }
  // Most useful overlaps first: same course + most overlap days
  return out.sort((x, y) => {
    if (x.sameCourse !== y.sameCourse) return x.sameCourse ? -1 : 1;
    return y.overlapDays - x.overlapDays;
  });
}

/**
 * Build group suggestions: cliques of 2+ same-course inquiries whose date
 * windows all overlap. Returns one suggestion per maximal clique.
 *
 * Threshold: AIDA 2 needs 2.5 days minimum, so by default we require 3+
 * overlapping days. Pass `minOverlapDays = 2` to relax for shorter formats
 * (e.g., AIDA 1 half-day).
 */
export function findGroupings(
  inquiries: InquiryLite[],
  minOverlapDays: number = 3,
): GroupingSuggestion[] {
  // Bucket eligible inquiries by course
  const byCourse = new Map<string, { i: InquiryLite; start: Date; end: Date }[]>();
  for (const inq of inquiries) {
    if (!ACTIVE_STATUSES.has(inq.status)) continue;
    const start = parseISO(inq.parsed_start_date);
    const end = parseISO(inq.parsed_end_date);
    if (!start || !end) continue;
    const key = courseKey(inq.course);
    if (!byCourse.has(key)) byCourse.set(key, []);
    byCourse.get(key)!.push({ i: inq, start, end });
  }

  const out: GroupingSuggestion[] = [];

  Array.from(byCourse.entries()).forEach(([course, entries]) => {
    if (entries.length < 2) return;

    // Greedy clique-finding: sort by start, try to extend the running intersection.
    // For each starting entry, accumulate any later entry whose window still
    // overlaps the running window with at least `minOverlapDays`.
    for (let i = 0; i < entries.length; i++) {
      let runStart = entries[i].start;
      let runEnd = entries[i].end;
      const members = [entries[i]];

      for (let j = 0; j < entries.length; j++) {
        if (j === i) continue;
        const candidate = entries[j];
        const ix = intersect(runStart, runEnd, candidate.start, candidate.end);
        if (ix && ix.days >= minOverlapDays) {
          members.push(candidate);
          runStart = ix.start;
          runEnd = ix.end;
        }
      }

      if (members.length >= 2) {
        const days = inclusiveDays(runStart, runEnd);
        const grouping: GroupingSuggestion = {
          inquiries: members.map((m) => m.i),
          windowStart: runStart,
          windowEnd: runEnd,
          overlapDays: days,
          course,
        };
        // Deduplicate: only add if we don't already have a grouping with the same set of inquiry IDs
        const ids = grouping.inquiries.map((x) => x.id).sort().join(",");
        if (!out.some((g) => g.inquiries.map((x) => x.id).sort().join(",") === ids)) {
          out.push(grouping);
        }
      }
    }
  });

  // Largest cliques first, then biggest windows
  return out.sort((a, b) => {
    if (a.inquiries.length !== b.inquiries.length) {
      return b.inquiries.length - a.inquiries.length;
    }
    return b.overlapDays - a.overlapDays;
  });
}

/**
 * Find inquiry windows that overlap with existing scheduled course dates.
 * These are signals that the student needs to be told the date is already
 * blocked or fits into an upcoming course.
 */
export function findCalendarConflicts(
  inquiries: InquiryLite[],
  events: CalendarEventLite[],
  categoryFilter: string[] = ["course", "camp"],
): CalendarConflict[] {
  const out: CalendarConflict[] = [];
  const eligibleEvents = events.filter((e) => categoryFilter.includes(e.category));

  for (const inq of inquiries) {
    if (!ACTIVE_STATUSES.has(inq.status)) continue;
    const inqStart = parseISO(inq.parsed_start_date);
    const inqEnd = parseISO(inq.parsed_end_date);
    if (!inqStart || !inqEnd) continue;

    for (const ev of eligibleEvents) {
      const evStart = parseISO(ev.date);
      const evEnd = parseISO(ev.end_date || ev.date);
      if (!evStart || !evEnd) continue;
      const ix = intersect(inqStart, inqEnd, evStart, evEnd);
      if (ix) {
        out.push({ inquiry: inq, event: ev, overlapDays: ix.days });
      }
    }
  }

  return out.sort((a, b) => b.overlapDays - a.overlapDays);
}

/**
 * Convenience: one call returns everything.
 */
export interface ConflictReport {
  overlaps: OverlapPair[];
  groupings: GroupingSuggestion[];
  calendarConflicts: CalendarConflict[];
}

export function buildConflictReport(
  inquiries: InquiryLite[],
  events: CalendarEventLite[] = [],
  options: { minOverlapDays?: number } = {},
): ConflictReport {
  return {
    overlaps: findOverlaps(inquiries),
    groupings: findGroupings(inquiries, options.minOverlapDays ?? 3),
    calendarConflicts: findCalendarConflicts(inquiries, events),
  };
}
