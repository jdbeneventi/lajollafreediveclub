import { courseKey } from "@/lib/inquiryConflicts";
import type { ScheduledCourse, OpenWeekend } from "@/lib/schedule";

/**
 * Demand clustering — turns the enriched inquiry pipeline into decisions.
 *
 * Where inquiryConflicts.ts answers "which pairs overlap", this answers the
 * operator's question: "what course should I run, when, and for whom?"
 * It leans on the inquiry-intel columns (parsed_headcount, date_flexibility)
 * so demand is measured in PEOPLE, and it cross-references the live schedule
 * so a cluster points at an existing course with seats left before it
 * suggests opening a new date.
 *
 * Everything here is advisory text for the digest and drafter — it never
 * writes anything.
 */

export interface DemandInquiry {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  course: string;
  status: string;
  parsed_start_date: string | null;
  parsed_end_date: string | null;
  parsed_headcount?: number | null;
  date_flexibility?: string | null;
  created_at: string;
}

export interface DemandCluster {
  course: string; // normalized key, e.g. "aida 2"
  members: DemandInquiry[]; // dated inquiries whose windows all intersect
  windowStart: string;
  windowEnd: string;
  people: number; // summed headcount (unknown counts as 1)
  peopleExact: boolean; // false when any member lacks a headcount
  matchedEvent: ScheduledCourse | null; // scheduled course inside the window
  suggestedWeekend: OpenWeekend | null; // when no event matches
}

export interface FlexiblePool {
  course: string;
  count: number;
  people: number;
  names: string[];
}

export interface DemandReport {
  clusters: DemandCluster[];
  flexiblePools: FlexiblePool[]; // "announce a date and email these"
  staleActive: DemandInquiry[]; // window entirely in the past, status never moved
  duplicateEmails: Array<{ email: string; inquiries: DemandInquiry[] }>;
}

const ACTIVE = new Set(["new", "replied", "quoted"]);

const people = (i: DemandInquiry) => i.parsed_headcount ?? 1;

function overlaps(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export function buildDemandReport(
  inquiries: DemandInquiry[],
  courses: ScheduledCourse[],
  openWeekends: OpenWeekend[],
  today: string,
): DemandReport {
  const active = inquiries.filter((i) => ACTIVE.has(i.status));

  // ── Stale: their window has fully passed but the status never moved. ──
  const staleActive = active
    .filter((i) => i.parsed_end_date && i.parsed_end_date < today)
    .sort((a, b) => (a.parsed_end_date || "").localeCompare(b.parsed_end_date || ""));

  // ── Duplicates: same person inquiring more than once, still active. ──
  const byEmail = new Map<string, DemandInquiry[]>();
  for (const i of active) {
    const key = i.email.toLowerCase();
    if (!byEmail.has(key)) byEmail.set(key, []);
    byEmail.get(key)!.push(i);
  }
  const duplicateEmails = Array.from(byEmail.entries())
    .filter(([, list]) => list.length > 1)
    .map(([email, list]) => ({ email, inquiries: list }));

  // ── Cluster future-dated inquiries per course by window intersection. ──
  const staleIds = new Set(staleActive.map((i) => i.id));
  const dated = active.filter(
    (i) =>
      i.parsed_start_date &&
      i.parsed_end_date &&
      !staleIds.has(i.id) &&
      i.parsed_end_date >= today,
  );

  const byCourse = new Map<string, DemandInquiry[]>();
  for (const i of dated) {
    const key = courseKey(i.course);
    if (!byCourse.has(key)) byCourse.set(key, []);
    byCourse.get(key)!.push(i);
  }

  const clusters: DemandCluster[] = [];
  for (const [course, entries] of byCourse.entries()) {
    // Greedy: seed with each entry, absorb every other entry that still
    // intersects the running window. Same shape as findGroupings but
    // singletons are kept — one dated person is still a schedulable fact.
    const seen = new Set<string>();
    for (let s = 0; s < entries.length; s++) {
      let runStart = entries[s].parsed_start_date!;
      let runEnd = entries[s].parsed_end_date!;
      const members = [entries[s]];
      for (let j = 0; j < entries.length; j++) {
        if (j === s) continue;
        const c = entries[j];
        if (overlaps(runStart, runEnd, c.parsed_start_date!, c.parsed_end_date!)) {
          members.push(c);
          if (c.parsed_start_date! > runStart) runStart = c.parsed_start_date!;
          if (c.parsed_end_date! < runEnd) runEnd = c.parsed_end_date!;
        }
      }
      const ids = members.map((m) => m.id).sort().join(",");
      if (seen.has(ids)) continue;
      seen.add(ids);

      const matchedEvent =
        courses.find(
          (ev) =>
            courseKey(ev.title) === course &&
            overlaps(ev.date, ev.end_date || ev.date, runStart, runEnd),
        ) || null;
      const suggestedWeekend = matchedEvent
        ? null
        : openWeekends.find((w) => overlaps(w.friday, w.sunday, runStart, runEnd)) ||
          null;

      clusters.push({
        course,
        members,
        windowStart: runStart,
        windowEnd: runEnd,
        people: members.reduce((sum, m) => sum + people(m), 0),
        peopleExact: members.every((m) => m.parsed_headcount != null),
        matchedEvent,
        suggestedWeekend,
      });
    }
  }

  // Drop clusters fully contained in a larger one (same course), then rank
  // by people, largest first.
  const ranked = clusters
    .filter(
      (c) =>
        !clusters.some(
          (other) =>
            other !== c &&
            other.course === c.course &&
            other.members.length > c.members.length &&
            c.members.every((m) => other.members.some((om) => om.id === m.id)),
        ),
    )
    .sort((a, b) => b.people - a.people);

  // ── Flexible pool per course: no window, but said "any time". ──
  const poolMap = new Map<string, DemandInquiry[]>();
  for (const i of active) {
    if (i.parsed_start_date || staleIds.has(i.id)) continue;
    if (i.date_flexibility !== "flexible") continue;
    const key = courseKey(i.course);
    if (!poolMap.has(key)) poolMap.set(key, []);
    poolMap.get(key)!.push(i);
  }
  const flexiblePools = Array.from(poolMap.entries())
    .map(([course, list]) => ({
      course,
      count: list.length,
      people: list.reduce((s, i) => s + people(i), 0),
      names: list.map((i) => i.first_name),
    }))
    .sort((a, b) => b.people - a.people);

  return { clusters: ranked, flexiblePools, staleActive, duplicateEmails };
}
