import { supabase } from "@/lib/supabase";

/**
 * LLM extraction of structured facts from a course inquiry's free text.
 *
 * The form fields `preferred_dates`, `group_size`, and `message` are raw
 * strings ("Any weekend in March", "me and my girlfriend", …). The regex
 * parser (parseDateRange.ts) only handles explicit date formats — at the time
 * this was built it parsed 16 of 60 real inquiries, so the grouping engine
 * was blind to most of the pipeline, and nothing parsed headcount at all.
 *
 * This module asks Claude to read those three fields and return:
 *   - headcount           how many people the inquiry covers
 *   - date_start/date_end concrete window, resolved against the date the
 *                         inquiry was RECEIVED ("next weekend" means
 *                         something different in March than in July)
 *   - date_flexibility    fixed | flexible | unknown
 *   - availability_note   constraints that aren't a window ("weekends only")
 *   - summary             one line for digests
 *
 * Persistence rules (enrichInquiry):
 *   - parsed_start_date / parsed_end_date are the EXISTING pipeline columns
 *     consumed by inquiryConflicts, the calendar panel, and the digest. The
 *     extraction fills them only where both are NULL — values from the regex
 *     parser or set by hand in the admin UI are never overwritten.
 *   - parsed_headcount, date_flexibility, ai_facts are new nullable columns
 *     (supabase/inquiry-intel.sql). ai_facts doubles as the "has this row
 *     been processed" marker for the backfill endpoint and digest sweep.
 *
 * Fail-soft by design: this runs inside after() on the public inquiry route
 * and inside the digest cron. No ANTHROPIC_API_KEY, an API error, unparseable
 * output, or a missing column (migration not yet run) all log and return a
 * status string — nothing here ever throws into a caller.
 */

const MODEL = "claude-opus-5";

export interface InquiryFacts {
  headcount: number | null;
  date_start: string | null; // YYYY-MM-DD
  date_end: string | null; // YYYY-MM-DD
  date_flexibility: "fixed" | "flexible" | "unknown";
  availability_note: string | null;
  summary: string;
}

/** The subset of a course_inquiries row the extraction needs. */
export interface InquiryRowLite {
  id: string;
  created_at?: string | null;
  course?: string | null;
  experience?: string | null;
  preferred_dates?: string | null;
  group_size?: string | null;
  message?: string | null;
  parsed_start_date?: string | null;
  parsed_end_date?: string | null;
}

export type EnrichResult =
  | "enriched"
  | "skipped_no_key"
  | "extract_failed"
  | "persist_failed";

// Structured output schema — the API guarantees the response validates.
const FACTS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "headcount",
    "date_start",
    "date_end",
    "date_flexibility",
    "availability_note",
    "summary",
  ],
  properties: {
    headcount: {
      type: ["integer", "null"],
      description:
        "Total people this inquiry covers, including the writer. 'Just me' = 1, 'me and my partner' = 2. null only if genuinely unstated.",
    },
    date_start: {
      type: ["string", "null"],
      description:
        "YYYY-MM-DD. Earliest day of the window they describe. A bare month = first of that month. null if no concrete window is given.",
    },
    date_end: {
      type: ["string", "null"],
      description:
        "YYYY-MM-DD. Last day of the window. A bare month = last of that month; a single day = same as date_start. null if no concrete window.",
    },
    date_flexibility: {
      type: "string",
      enum: ["fixed", "flexible", "unknown"],
      description:
        "'fixed' = specific dates they need. 'flexible' = open or 'any weekend' style. 'unknown' = they said nothing about timing.",
    },
    availability_note: {
      type: ["string", "null"],
      description:
        "Timing constraints that aren't a window, verbatim-ish: 'weekends only', 'after June 10', 'visiting San Diego that week'. null if none.",
    },
    summary: {
      type: "string",
      description:
        "One plain sentence: who, how many, what course, when. For a human skimming a digest.",
    },
  },
} as const;

const SYSTEM_PROMPT = `You extract booking facts from freediving course inquiries for a small school in La Jolla. You are given the raw form fields and the date the inquiry was received. Resolve relative dates ("next weekend", "in two weeks", "this summer") against the received date. Only state a date window the text actually supports — a vague "sometime soon" is null dates with flexibility "flexible", not a guess. Never invent facts.`;

/**
 * Call Claude and return validated facts, or null on any failure.
 * Pure — does not touch the database.
 */
export async function extractInquiryFacts(
  row: InquiryRowLite,
): Promise<InquiryFacts | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const received = row.created_at ? new Date(row.created_at) : new Date();
  const receivedDate = received.toLocaleDateString("en-CA", {
    timeZone: "America/Los_Angeles",
  });
  const receivedWeekday = received.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "America/Los_Angeles",
  });

  const userMessage = `Inquiry received on ${receivedWeekday}, ${receivedDate}.

Course requested: ${row.course || "(not given)"}
Experience: ${row.experience || "(not given)"}
Preferred dates (raw): ${row.preferred_dates || "(not given)"}
Group size (raw): ${row.group_size || "(not given)"}
Message: ${row.message || "(none)"}

Extract the facts.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        // Cap covers thinking + output; the JSON itself is ~100 tokens.
        max_tokens: 2048,
        // Trivial extraction — low effort keeps it fast and cheap.
        output_config: {
          effort: "low",
          format: { type: "json_schema", schema: FACTS_SCHEMA },
        },
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!res.ok) {
      console.error("[inquiry-intel] Anthropic API error:", await res.text());
      return null;
    }

    const data = await res.json();
    if (data.stop_reason === "refusal") return null;
    // Adaptive thinking can put a thinking block before the text block —
    // never assume content[0] is the text.
    const text = (data.content as Array<{ type: string; text?: string }>)?.find(
      (b) => b.type === "text",
    )?.text;
    if (!text) return null;

    return sanitizeFacts(JSON.parse(text), received);
  } catch (e) {
    console.error("[inquiry-intel] extraction failed:", e);
    return null;
  }
}

/** Trust but verify — the schema constrains shape, this constrains sense. */
function sanitizeFacts(raw: InquiryFacts, received: Date): InquiryFacts | null {
  if (!raw || typeof raw !== "object") return null;

  const headcount =
    typeof raw.headcount === "number" &&
    Number.isInteger(raw.headcount) &&
    raw.headcount >= 1 &&
    raw.headcount <= 30
      ? raw.headcount
      : null;

  let start = validDate(raw.date_start, received);
  let end = validDate(raw.date_end, received);
  // A one-sided window becomes a single day; an inverted one gets swapped.
  if (start && !end) end = start;
  if (end && !start) start = end;
  if (start && end && end < start) [start, end] = [end, start];

  const flexibility = ["fixed", "flexible", "unknown"].includes(
    raw.date_flexibility,
  )
    ? raw.date_flexibility
    : "unknown";

  return {
    headcount,
    date_start: start,
    date_end: end,
    date_flexibility: flexibility,
    availability_note:
      typeof raw.availability_note === "string" && raw.availability_note.trim()
        ? raw.availability_note.trim().slice(0, 300)
        : null,
    summary:
      typeof raw.summary === "string" ? raw.summary.trim().slice(0, 300) : "",
  };
}

/** YYYY-MM-DD, real calendar date, within a year back / two years out. */
function validDate(value: unknown, received: Date): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }
  const year = received.getUTCFullYear();
  if (y < year - 1 || y > year + 2) return null;
  return value;
}

/**
 * Extract facts for one inquiry and persist them. Safe to call from
 * anywhere — returns a status string instead of throwing.
 */
export async function enrichInquiry(
  row: InquiryRowLite,
  source: "insert" | "backfill" | "digest",
): Promise<EnrichResult> {
  if (!process.env.ANTHROPIC_API_KEY) return "skipped_no_key";

  const facts = await extractInquiryFacts(row);
  if (!facts) return "extract_failed";

  const update: Record<string, unknown> = {
    parsed_headcount: facts.headcount,
    date_flexibility: facts.date_flexibility,
    ai_facts: {
      facts,
      model: MODEL,
      extracted_at: new Date().toISOString(),
      source,
    },
  };
  // Dates fill in only where nothing (regex, admin) has set them already.
  if (
    !row.parsed_start_date &&
    !row.parsed_end_date &&
    facts.date_start &&
    facts.date_end
  ) {
    update.parsed_start_date = facts.date_start;
    update.parsed_end_date = facts.date_end;
  }

  const { error } = await supabase
    .from("course_inquiries")
    .update(update)
    .eq("id", row.id);

  if (error) {
    // Most likely cause pre-migration: unknown column. Log and move on —
    // the row stays ai_facts=NULL, so the backfill picks it up later.
    console.error("[inquiry-intel] persist failed:", error.message);
    return "persist_failed";
  }
  return "enriched";
}
