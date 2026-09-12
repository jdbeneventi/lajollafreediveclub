import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { readThread, isGmailReadConfigured } from "@/lib/gmailRead";

/**
 * /api/admin/inbox — read the actual email exchange with one student,
 * agent-natively (IMAP bodies, no browser).
 *
 *   GET /api/admin/inbox?email=student@x.com          → last 45 days
 *   GET /api/admin/inbox?email=student@x.com&days=90  → wider window
 *
 * Targeted per-address search only; bodies truncated and reply-tails
 * trimmed. Auth: admin gate.
 */

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const email = req.nextUrl.searchParams.get("email")?.trim();
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "?email=student@example.com required", configured: isGmailReadConfigured() },
      { status: email ? 400 : 200 },
    );
  }
  const days = Math.min(
    Math.max(Number(req.nextUrl.searchParams.get("days")) || 45, 1),
    365,
  );
  const messages = await readThread(email, days);
  return NextResponse.json({ email, windowDays: days, count: messages.length, messages });
}
