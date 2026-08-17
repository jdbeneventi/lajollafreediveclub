/**
 * /api/admin/inquiries/reply
 *
 * POST with body { action: "draft" | "send", id, ... }
 *
 *   action=draft  → returns a Claude-drafted reply for the inquiry, factoring
 *                   in current AIDA standards, LJFC pricing, extracted facts,
 *                   same-window inquiries that could form a group, and the
 *                   live course schedule (seats left, open weekends).
 *
 *   action=send   → sends the (possibly admin-edited) draft via Resend, marks
 *                   the inquiry status=replied, sets replied_at.
 *
 * The drafting/sending engine lives in src/lib/inquiryReply.ts, shared with
 * the one-tap digest links (/admin/act). This route is the cookie/key-authed
 * adapter for the pipeline UI.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  getInquiry,
  draftInquiryReply,
  sendInquiryReply,
} from "@/lib/inquiryReply";

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json();
  const { action, id } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const inquiry = await getInquiry(id);
  if (!inquiry) {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }

  if (action === "draft") {
    const result = await draftInquiryReply(inquiry);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ subject: result.subject, body: result.body });
  }

  if (action === "send") {
    const result = await sendInquiryReply(inquiry, body.subject, body.body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ sent: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
