/**
 * Parse free-text date ranges from course inquiry forms into machine-readable
 * date ranges. Used by the inquiry pipeline conflict detector and calendar view.
 *
 * Real examples from the wild:
 *   "between June 10th-14th"        → { start: 2026-06-10, end: 2026-06-14 }
 *   "June 8th to June 11th"          → { start: 2026-06-08, end: 2026-06-11 }
 *   "July 10-12, 2026 (Fri-Sun)"     → { start: 2026-07-10, end: 2026-07-12 }
 *   "weekends only"                  → null  (weekendsOnly: true)
 *   "this weekend"                   → resolved from `now`
 *   "next month"                     → null  (too vague — conflict detector
 *                                              treats null as unknown)
 *
 * If parsing fails or input is ambiguous, returns null. Callers should treat
 * null as "unknown window" rather than an error.
 */

const MONTHS: Record<string, number> = {
  january: 0, jan: 0,
  february: 1, feb: 1,
  march: 2, mar: 2,
  april: 3, apr: 3,
  may: 4,
  june: 5, jun: 5,
  july: 6, jul: 6,
  august: 7, aug: 7,
  september: 8, sep: 8, sept: 8,
  october: 9, oct: 9,
  november: 10, nov: 10,
  december: 11, dec: 11,
};

const MONTHS_RX = Object.keys(MONTHS).join("|");

export interface ParsedDateRange {
  start: Date;
  end: Date;
  weekendsOnly?: boolean;
  /** Free-text label that produced this range, for debugging/UI */
  source: string;
}

/**
 * Strip ordinal suffixes ("10th", "1st") and parenthetical clutter.
 */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/\((?:[^)]*)\)/g, " ") // strip parentheticals e.g. "(Fri-Sun)"
    .replace(/(\d+)(?:st|nd|rd|th)\b/g, "$1")
    .replace(/[–—]/g, "-") // normalize em/en dashes
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pick a year for a date based on `now`. If the month is in the past,
 * roll forward to next year. Used when the input doesn't include a year.
 */
function inferYear(month: number, day: number, now: Date): number {
  const y = now.getFullYear();
  const candidate = new Date(y, month, day);
  // If the candidate end-of-day is more than a week behind `now`, assume next year
  const threshold = new Date(now.getTime() - 7 * 86_400_000);
  return candidate < threshold ? y + 1 : y;
}

function makeDate(year: number, month: number, day: number): Date {
  // Construct as UTC to avoid TZ surprises — these are calendar dates
  return new Date(Date.UTC(year, month, day));
}

/**
 * Compute the upcoming weekend (Sat-Sun) from `now`. If today is Sat or Sun,
 * use the current weekend.
 */
function thisWeekend(now: Date): ParsedDateRange {
  const dow = now.getDay();
  const daysUntilSat = dow <= 6 ? (6 - dow) % 7 : 6;
  const sat = new Date(now);
  sat.setDate(now.getDate() + daysUntilSat);
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  return {
    start: makeDate(sat.getFullYear(), sat.getMonth(), sat.getDate()),
    end: makeDate(sun.getFullYear(), sun.getMonth(), sun.getDate()),
    source: "this weekend",
  };
}

function nextWeekend(now: Date): ParsedDateRange {
  const next = new Date(now);
  next.setDate(now.getDate() + 7);
  return { ...thisWeekend(next), source: "next weekend" };
}

/**
 * Main parser. Pass `now` for testability (defaults to current time).
 */
export function parseDateRange(input: string | null | undefined, now: Date = new Date()): ParsedDateRange | null {
  if (!input || typeof input !== "string") return null;
  const s = normalize(input);
  if (!s) return null;

  // 1. Relative phrases
  if (/^this\s+weekend\b/.test(s)) return thisWeekend(now);
  if (/^next\s+weekend\b/.test(s)) return nextWeekend(now);
  if (/weekends?\s+only\b/.test(s) || /^only\s+weekends?\b/.test(s)) {
    return null; // signaled via separate check — see weekendsOnlyHint
  }

  // 2. Same-month range: "june 10-14" or "june 10 - 14"
  const sameMonth = s.match(
    new RegExp(`\\b(${MONTHS_RX})\\s+(\\d{1,2})\\s*[-to]+\\s*(\\d{1,2})(?:[,\\s]+(\\d{4}))?`),
  );
  if (sameMonth) {
    const month = MONTHS[sameMonth[1]];
    const d1 = parseInt(sameMonth[2], 10);
    const d2 = parseInt(sameMonth[3], 10);
    const year = sameMonth[4] ? parseInt(sameMonth[4], 10) : inferYear(month, d1, now);
    if (d1 >= 1 && d1 <= 31 && d2 >= 1 && d2 <= 31 && d2 >= d1) {
      return {
        start: makeDate(year, month, d1),
        end: makeDate(year, month, d2),
        source: input.trim(),
      };
    }
  }

  // 3. Cross-month range: "may 28 to june 2" or "may 28 - june 2"
  const crossMonth = s.match(
    new RegExp(`\\b(${MONTHS_RX})\\s+(\\d{1,2})\\s*(?:to|-|through|until)\\s*(${MONTHS_RX})\\s+(\\d{1,2})(?:[,\\s]+(\\d{4}))?`),
  );
  if (crossMonth) {
    const m1 = MONTHS[crossMonth[1]];
    const d1 = parseInt(crossMonth[2], 10);
    const m2 = MONTHS[crossMonth[3]];
    const d2 = parseInt(crossMonth[4], 10);
    const explicitYear = crossMonth[5] ? parseInt(crossMonth[5], 10) : null;
    const startYear = explicitYear ?? inferYear(m1, d1, now);
    // If end month is earlier than start month, roll end into next year
    const endYear = m2 < m1 ? startYear + 1 : startYear;
    return {
      start: makeDate(startYear, m1, d1),
      end: makeDate(endYear, m2, d2),
      source: input.trim(),
    };
  }

  // 4. Single date: "june 12" or "june 12, 2026"
  const single = s.match(new RegExp(`\\b(${MONTHS_RX})\\s+(\\d{1,2})(?:[,\\s]+(\\d{4}))?\\b`));
  if (single) {
    const month = MONTHS[single[1]];
    const day = parseInt(single[2], 10);
    const year = single[3] ? parseInt(single[3], 10) : inferYear(month, day, now);
    if (day >= 1 && day <= 31) {
      const d = makeDate(year, month, day);
      return { start: d, end: d, source: input.trim() };
    }
  }

  return null;
}

/**
 * Returns true if the input looks like the student restricted themselves to
 * weekends. Useful as a separate signal alongside parseDateRange — the parser
 * itself returns null for "weekends only" because there's no concrete range.
 */
export function weekendsOnlyHint(input: string | null | undefined): boolean {
  if (!input) return false;
  return /weekends?\s+only\b|only\s+weekends?\b|just\s+weekends\b/i.test(input);
}

/**
 * Format a parsed range as "Jun 10-14" or "May 28 - Jun 2" for compact UI display.
 */
export function formatRange(range: ParsedDateRange): string {
  const startMonth = range.start.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const endMonth = range.end.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const startDay = range.start.getUTCDate();
  const endDay = range.end.getUTCDate();
  if (range.start.getTime() === range.end.getTime()) {
    return `${startMonth} ${startDay}`;
  }
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
}

/**
 * Number of inclusive days in a range.
 */
export function rangeDays(range: ParsedDateRange): number {
  return Math.round((range.end.getTime() - range.start.getTime()) / 86_400_000) + 1;
}
