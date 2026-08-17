import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import {
  findGroupings,
  findOverlaps,
  type InquiryLite,
} from "@/lib/inquiryConflicts";
import { getScheduleContext, describeScheduleForPrompt } from "@/lib/schedule";

/**
 * The inquiry reply engine — drafting in Joshua's voice and sending with
 * status side-effects — extracted from the reply route so two surfaces can
 * share it: /api/admin/inquiries/reply (the pipeline UI) and the signed
 * one-tap links in the daily digest (/admin/act).
 *
 * Changes from the route-embedded version, deliberate:
 *   - Model claude-sonnet-4-20250514 → claude-opus-5. The old model was
 *     RETIRED on 2026-06-15; every draft call since then has errored.
 *   - Drafts now receive live schedule context (scheduled courses with
 *     seats left, open weekends) so proposed dates are real, plus the
 *     extracted inquiry facts (headcount, window, flexibility).
 *   - Response parsing finds the text block instead of assuming
 *     content[0] — adaptive-thinking models emit a thinking block first.
 *
 * Functions return plain result objects; routes adapt them to HTTP.
 */

const OWNER_EMAIL = "joshuabeneventi@gmail.com";
// Replies thread into the business mailbox when it's configured, so the
// Gmail sync sees the whole conversation; personal account is the fallback.
const INQUIRY_INBOX = process.env.BUSINESS_EMAIL?.trim() || OWNER_EMAIL;
const DRAFT_MODEL = "claude-opus-5";

export type ReplyResult<T> =
  | ({ ok: true } & T)
  | { ok: false; error: string; status: number };

// ─── Joshua's voice + LJFC source-of-truth prompt ──────────────────────────

const SYSTEM_PROMPT = `You are drafting an email reply from Joshua Beneventi, AIDA Instructor at La Jolla Freedive Club (LJFC) in San Diego, California. The reply is to a student who submitted a course inquiry form.

== JOSHUA'S VOICE ==
- Athletic, grounded, editorial. NOT wellness culture.
- Use "breathing drills" not "breathwork." Use "stretching & breathing exercises" not "yoga."
- Direct, warm, but never gushing. He's a real teacher running a real business.
- Sentence rhythm: short and clear, with occasional longer sentences for context.
- No emojis. Minimal exclamation marks (max 1).
- No corporate-speak ("circle back", "touch base", "team here at"). Talk like a person.
- Sign off as "Joshua" with the LJFC website below.

== AIDA 2 STANDARDS (verified May 2026 from aidainternational.org) ==
- Depth requirement: 12 meters (~39 ft) Constant Weight Bi-fins (CWTB)
- Pool: 2:00 minute static breath-hold + 40m dynamic with fins (DYNB)
- 75% passing score on written theory exam
- 5 total water sessions minimum (2 pool + 3 ocean over 2+ days)
- Course minimum 2.5 days
- Prereq: swim 200m non-stop without fins OR 300m with mask/fins/snorkel
- Partial cert: "AIDA 2 Pool Freediver" if pool reqs met but not depth — student can complete depth later

== AIDA 1 — HOW LJFC RUNS IT (from Joshua's course package) ==
- OCEAN course — everything happens at La Jolla Shores. There is NO pool:
  swim assessment, Static Apnea in the shallows, breath-hold technique,
  recovery breathing, rescue demo, then duck dives and descents along a
  line (max 10m, set by instructor). Never describe AIDA 1 as pool-only.
- Format: 1-hour Zoom theory the evening before, then in the water at
  La Jolla Shores ~7:00–10/11am the next morning.
- Prereq: able to swim 100m non-stop (assessed at the Shores on the day)
  + the medical questionnaire.
- Price $200; full upfront or 50% deposit ($100), remainder after.
- Next step: AIDA 2 (no prerequisite cert required — AIDA 1 is a great
  foundation, and AIDA 2 goes to 20m and adds the written exam).

== REQUIREMENTS & EXPECTATIONS (EVERY course email must cover these) ==
Every email offering or confirming a course seat must make three things
unmissable, in Joshua's plain voice (2-4 short lines, not a legal block):
1. PREREQUISITES — AIDA 2: the swim test (200m non-stop without fins, or
   300m with mask/fins/snorkel — no time limit) + medical questionnaire
   (physician sign-off if anything is flagged). AIDA 1: swim 100m
   non-stop (assessed on the day) + the same medical questionnaire.
2. WHAT THEY'RE SIGNING UP FOR — one honest line so nobody is surprised.
   AIDA 2: a real 2+ day commitment — theory, pool, and ocean sessions at
   La Jolla Shores; cool Pacific water, surface swims, breath-hold work;
   come rested. AIDA 1: an evening Zoom then a real morning in the ocean
   at La Jolla Shores — breath holds, duck dives, first descents to 10m;
   relaxed pace, but it is training in open water.
3. GEAR — students bring their OWN wetsuit and fins for every course (or
   rent them from a local shop). LJFC can lend/rent masks, snorkels, and
   weight belts. Point to the gear guide: lajollafreediveclub.com/gear.
   Never imply LJFC supplies suits or fins; sizing questions are for
   advice, not for lending.

== ONGOING CONVERSATIONS ==
If the inquiry status is replied, quoted, or deposit_sent, Joshua has
ALREADY been in contact (the admin notes usually say what happened).
Write as the next message in an ongoing exchange — reference where things
stand, answer anything the notes say is outstanding, and never open with
first-contact framing like "Thanks for reaching out."

== LJFC PRICING ==
- AIDA 1 / Discover Freediving: $200 (half day)
- AIDA 2 group (2+ people): $575/person
- AIDA 2 private (1 person): $800
- AIDA 3 group: $700, private: $950
- Saturday ocean session: Free with Ocean Flow, $25 drop-in (requires cert + own gear + lanyard + computer)
- Private coaching: $150 (2-3 hrs, certified freedivers only)

== STANDARD REPLY STRUCTURE FOR AIDA 2 INQUIRIES ==
1. Quick welcome + acknowledge their background
2. Propose specific dates (use the dates the admin provides; default to the student's stated window if none)
3. Cover the REQUIREMENTS & EXPECTATIONS block above (prereqs, honest
   expectations, own wetsuit + fins minimum with the gear-guide link)
4. Ask about medical conditions — only if not already provided
5. Mention partial-cert safety net if depth concern is raised
6. Mention group-rate opportunity if relevant
7. Close with "Looking forward to getting you in the water." or similar
8. Sign-off: Joshua / La Jolla Freedive Club / lajollafreediveclub.com

== TONE EXAMPLES (good) ==
- "Thanks for reaching out — AIDA 2 fits perfectly with your background."
- "If you hit the pool requirements but not depth (which is normal — depth comes down to relaxation and equalization, not fitness), you'll get a Pool Freediver cert and can complete the depth portion later."
- "Looking forward to getting you in the water."

== TONE TO AVOID ==
- "I hope this email finds you well"
- "We here at La Jolla Freedive Club"
- "Your freediving journey awaits!"
- Excessive bullet points (use prose for warmth; bullets only for clear lists like dates or requirements)

== FORMATTING ==
- Plain text or simple markdown only. No HTML.
- Subject line on the first line as "Subject: ..."
- Then blank line, then body.
- Use simple dashes "-" for list items, not asterisks or bullets.
- Bold only sparingly using **markdown** for clarity (date proposals, key requirements).

Output ONLY the email — subject line + body. Nothing else, no commentary.`;

// ─── Per-inquiry context builders ──────────────────────────────────────────

function describeGroupingOpportunities(
  thisInquiryId: string,
  allInquiries: InquiryLite[],
): string {
  const groupings = findGroupings(allInquiries, 2).filter((g) =>
    g.inquiries.some((i) => i.id === thisInquiryId),
  );
  if (groupings.length === 0) return "";

  const lines: string[] = ["", "== GROUPING OPPORTUNITIES =="];
  for (const g of groupings) {
    const otherStudents = g.inquiries
      .filter((i) => i.id !== thisInquiryId)
      .map((i) => `${i.first_name} (${i.group_size || "1 person"})`);
    const start = g.windowStart.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
    const end = g.windowEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
    const window = g.windowStart.getTime() === g.windowEnd.getTime() ? start : `${start} – ${end}`;
    lines.push(
      `- Could combine with ${otherStudents.join(", ")} on ${window} (${g.overlapDays} overlap day${g.overlapDays === 1 ? "" : "s"}). This unlocks the $575/person group rate.`,
    );
  }
  return lines.join("\n");
}

function describeOverlaps(thisInquiryId: string, allInquiries: InquiryLite[]): string {
  const overlaps = findOverlaps(allInquiries).filter(
    (o) => o.a.id === thisInquiryId || o.b.id === thisInquiryId,
  );
  if (overlaps.length === 0) return "";
  const lines: string[] = ["", "== OTHER INQUIRIES WITH SAME-WINDOW DATES =="];
  for (const o of overlaps) {
    const other = o.a.id === thisInquiryId ? o.b : o.a;
    lines.push(
      `- ${other.first_name} (${other.course.split("—")[0].trim()}, ${other.group_size || "1 person"}) has ${o.overlapDays} overlap day${o.overlapDays === 1 ? "" : "s"} with this inquiry`,
    );
  }
  return lines.join("\n");
}

/** Extracted intel (inquiry-intel columns), when present. */
function describeExtractedFacts(inquiry: Record<string, unknown>): string {
  const facts = (inquiry.ai_facts as { facts?: Record<string, unknown> } | null)
    ?.facts;
  if (!facts) return "";
  const lines: string[] = ["", "== EXTRACTED FACTS (from their text) =="];
  if (inquiry.parsed_headcount != null)
    lines.push(`- Party size: ${inquiry.parsed_headcount}`);
  if (inquiry.parsed_start_date)
    lines.push(
      `- Their window: ${inquiry.parsed_start_date} to ${inquiry.parsed_end_date}`,
    );
  if (inquiry.date_flexibility)
    lines.push(`- Date flexibility: ${inquiry.date_flexibility}`);
  if (facts.availability_note)
    lines.push(`- Availability note: ${facts.availability_note}`);
  return lines.length > 1 ? lines.join("\n") : "";
}

// ─── Fetch ────────────────────────────────────────────────────────────────

export async function getInquiry(
  id: string,
): Promise<Record<string, unknown> | null> {
  const { data } = await supabase
    .from("course_inquiries")
    .select("*")
    .eq("id", id)
    .single();
  return data || null;
}

// ─── Draft ────────────────────────────────────────────────────────────────

export async function draftInquiryReply(
  inquiry: Record<string, unknown>,
  directive?: string,
): Promise<ReplyResult<{ subject: string; body: string }>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "ANTHROPIC_API_KEY not configured", status: 500 };
  }

  // Grouping/overlap context from the active pipeline + the live schedule.
  const [{ data: allRows }, scheduleCtx] = await Promise.all([
    supabase
      .from("course_inquiries")
      .select(
        "id, first_name, last_name, email, course, parsed_start_date, parsed_end_date, group_size, parsed_headcount, status",
      )
      .eq("archived", false),
    getScheduleContext(90).catch(() => null),
  ]);

  const allInquiries: InquiryLite[] = (allRows || []) as InquiryLite[];
  const groupingCtx = describeGroupingOpportunities(inquiry.id as string, allInquiries);
  const overlapCtx = describeOverlaps(inquiry.id as string, allInquiries);
  const factsCtx = describeExtractedFacts(inquiry);
  const scheduleBlock = scheduleCtx
    ? `\n${describeScheduleForPrompt(scheduleCtx)}\n`
    : "";

  const fullName = `${inquiry.first_name} ${inquiry.last_name || ""}`.trim();
  const userMessage = `Draft a reply to this course inquiry.

== THIS INQUIRY ==
- Name: ${fullName}
- Email: ${inquiry.email}
- Pipeline status: ${inquiry.status} (submitted ${String(inquiry.created_at).slice(0, 10)})
- Course they want: ${inquiry.course}
- Their experience: ${inquiry.experience || "not stated"}
- Preferred dates: ${inquiry.preferred_dates || "not stated"}
- Group size: ${inquiry.group_size || "not stated"}
- Their message: ${inquiry.message || "(none)"}
- Admin notes (private context from Joshua): ${inquiry.admin_notes || "(none)"}
${factsCtx}${groupingCtx}${overlapCtx}
${scheduleBlock}${directive ? `== SPECIAL INSTRUCTION FOR THIS DRAFT ==\n${directive}\n\n` : ""}Write the reply now. Keep it focused — propose dates if reasonable, ask only the questions you don't already have answers to, and don't add unnecessary boilerplate.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: DRAFT_MODEL,
        // Cap covers adaptive thinking + the email itself.
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `Anthropic API error: ${err}`, status: 500 };
    }
    const data = await res.json();
    if (data.stop_reason === "refusal") {
      return { ok: false, error: "Model declined to draft this reply", status: 500 };
    }
    const text: string =
      (data.content as Array<{ type: string; text?: string }>)?.find(
        (b) => b.type === "text",
      )?.text || "";
    const subjectMatch = text.match(/^Subject:\s*(.+?)\s*$/m);
    const subject = subjectMatch
      ? subjectMatch[1].trim()
      : `Re: ${(inquiry.course as string).split("—")[0].trim()} inquiry`;
    const body = text.replace(/^Subject:.+?$/m, "").trim();
    return { ok: true, subject, body };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Draft failed",
      status: 500,
    };
  }
}

// ─── Send ─────────────────────────────────────────────────────────────────

export async function sendInquiryReply(
  inquiry: Record<string, unknown>,
  subject: string,
  emailBody: string,
): Promise<ReplyResult<{ sent: true }>> {
  if (!subject || !emailBody) {
    return { ok: false, error: "subject and body required", status: 400 };
  }
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return { ok: false, error: "RESEND_API_KEY not configured", status: 500 };
  }
  const resend = new Resend(RESEND_API_KEY);

  // Render plain text as simple HTML — preserve line breaks, render markdown bold + links lightly
  const htmlBody = emailBody
    .split("\n\n")
    .map(
      (para) =>
        `<p style="margin:0 0 12px 0;color:#0B1D2C;font-size:14px;line-height:1.6;">${para
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n/g, "<br>")
          .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" style="color:#1B6B6B;">$1</a>')}</p>`,
    )
    .join("");
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;padding:20px;color:#0B1D2C;">${htmlBody}</div>`;

  const { error } = await resend.emails.send({
    from: "Joshua Beneventi <noreply@lajollafreediveclub.com>",
    to: [inquiry.email as string],
    replyTo: INQUIRY_INBOX,
    bcc: [INQUIRY_INBOX],
    subject,
    html,
    text: emailBody,
  });
  if (error) {
    return { ok: false, error: error.message, status: 500 };
  }

  // Mark replied
  await supabase
    .from("course_inquiries")
    .update({ status: "replied" })
    .eq("id", inquiry.id as string);

  return { ok: true, sent: true };
}
