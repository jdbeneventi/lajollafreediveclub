import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyActionToken } from "@/lib/actionTokens";
import {
  getInquiry,
  draftInquiryReply,
  sendInquiryReply,
} from "@/lib/inquiryReply";

/**
 * /api/admin/inquiries/act — mutation half of the one-tap digest links.
 *
 * POST { id, action, exp, sig, op, subject?, body? }
 *
 * The (id, action, exp, sig) tuple is the signed token from the digest link
 * (src/lib/actionTokens.ts); `op` is what to do now:
 *
 *   token action "replied" → op "replied"          mark status=replied
 *   token action "archive" → op "archive"          set archived=true
 *   token action "draft"   → op "draft"            generate a draft
 *                          → op "send"             send edited draft,
 *                                                  mark replied
 *
 * The draft token deliberately authorizes the send — reviewing and sending
 * the draft is the entire flow the link exists for. Nothing here auto-sends:
 * a human tapped the link, saw the draft, and tapped send.
 *
 * GET always 401s (token or not) — this endpoint renders nothing, and the
 * uniform response keeps it in the same smoke auth-gate family as the rest
 * of /api/admin.
 */

// Drafting calls Claude; give it the same headroom as the reply route.
export const maxDuration = 60;

export async function GET() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const token = verifyActionToken(body);
  if (!token.valid) {
    return NextResponse.json(
      { error: "Invalid or expired link" },
      { status: 401 },
    );
  }

  const op: string = body.op || token.action;

  // The op must match the signed capability.
  const allowed =
    (token.action === "replied" && op === "replied") ||
    (token.action === "archive" && op === "archive") ||
    (token.action === "draft" && (op === "draft" || op === "send"));
  if (!allowed) {
    return NextResponse.json(
      { error: "Link does not authorize this action" },
      { status: 403 },
    );
  }

  const inquiry = await getInquiry(token.id);
  if (!inquiry) {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }

  if (op === "replied") {
    const { error } = await supabase
      .from("course_inquiries")
      .update({ status: "replied" })
      .eq("id", token.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ done: true, status: "replied" });
  }

  if (op === "archive") {
    const { error } = await supabase
      .from("course_inquiries")
      .update({ archived: true })
      .eq("id", token.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ done: true, archived: true });
  }

  if (op === "draft") {
    const result = await draftInquiryReply(inquiry);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ subject: result.subject, body: result.body });
  }

  // op === "send"
  const result = await sendInquiryReply(inquiry, body.subject, body.body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ done: true, sent: true });
}
