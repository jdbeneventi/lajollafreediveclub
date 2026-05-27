/**
 * /api/admin/inquiries/reply
 *
 * POST with body { action: "draft" | "send", id, ... }
 *
 *   action=draft  → returns a Claude-drafted reply for the inquiry, factoring
 *                   in current AIDA standards, LJFC pricing, and any same-
 *                   window inquiries that could form a group.
 *
 *   action=send   → sends the (possibly admin-edited) draft via Resend, marks
 *                   the inquiry status=replied, sets replied_at.
 *
 * Auth: ?key=ljfc query param.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { findGroupings, findOverlaps, type InquiryLite } from "@/lib/inquiryConflicts";

const SECRET = "ljfc";
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

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

== AIDA 1 STANDARDS ==
- No swim test minimum stated (some comfort in water needed)
- Half-day course, pool only, no depth requirement
- Introduction to relaxation, finning, duck dives, equalization

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
3. Mention the swim test requirement
4. Ask about gear (needed for sizing) — only if not already provided
5. Ask about medical conditions — only if not already provided
6. Mention partial-cert safety net if depth concern is raised
7. Mention group-rate opportunity if relevant
8. Close with "Looking forward to getting you in the water." or similar
9. Sign-off: Joshua / La Jolla Freedive Club / lajollafreediveclub.com

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

// ─── Helper: build per-inquiry context ─────────────────────────────────────

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

// ─── Route ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, id } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Fetch the inquiry
  const { data: inquiry, error } = await supabase
    .from("course_inquiries")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !inquiry) {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }

  if (action === "draft") {
    return draftReply(inquiry);
  }
  if (action === "send") {
    const { subject, body: emailBody } = body;
    return sendReply(inquiry, subject, emailBody);
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

async function draftReply(inquiry: Record<string, unknown>) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  // Pull all active inquiries for grouping/overlap context
  const { data: allRows } = await supabase
    .from("course_inquiries")
    .select("id, first_name, last_name, email, course, parsed_start_date, parsed_end_date, group_size, status")
    .eq("archived", false);

  const allInquiries: InquiryLite[] = (allRows || []) as InquiryLite[];
  const groupingCtx = describeGroupingOpportunities(inquiry.id as string, allInquiries);
  const overlapCtx = describeOverlaps(inquiry.id as string, allInquiries);

  const fullName = `${inquiry.first_name} ${inquiry.last_name || ""}`.trim();
  const userMessage = `Draft a reply to this course inquiry.

== THIS INQUIRY ==
- Name: ${fullName}
- Email: ${inquiry.email}
- Course they want: ${inquiry.course}
- Their experience: ${inquiry.experience || "not stated"}
- Preferred dates: ${inquiry.preferred_dates || "not stated"}
- Group size: ${inquiry.group_size || "not stated"}
- Their message: ${inquiry.message || "(none)"}
- Admin notes (private context from Joshua): ${inquiry.admin_notes || "(none)"}
${groupingCtx}${overlapCtx}

Write the reply now. Keep it focused — propose dates if reasonable, ask only the questions you don't already have answers to, and don't add unnecessary boilerplate.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Anthropic API error: ${err}` }, { status: 500 });
    }
    const data = await res.json();
    const text: string = data.content?.[0]?.text || "";
    // Split subject/body
    const subjectMatch = text.match(/^Subject:\s*(.+?)\s*$/m);
    const subject = subjectMatch ? subjectMatch[1].trim() : `Re: ${(inquiry.course as string).split("—")[0].trim()} inquiry`;
    const body = text.replace(/^Subject:.+?$/m, "").trim();
    return NextResponse.json({ subject, body });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Draft failed" }, { status: 500 });
  }
}

async function sendReply(inquiry: Record<string, unknown>, subject: string, emailBody: string) {
  if (!subject || !emailBody) {
    return NextResponse.json({ error: "subject and body required" }, { status: 400 });
  }
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
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
    replyTo: OWNER_EMAIL,
    bcc: [OWNER_EMAIL],
    subject,
    html,
    text: emailBody,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Mark replied
  await supabase
    .from("course_inquiries")
    .update({ status: "replied" })
    .eq("id", inquiry.id as string);

  return NextResponse.json({ sent: true });
}
