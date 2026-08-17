import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { isGmailSyncConfigured, syncGmail } from "@/lib/gmailSync";

/**
 * /api/admin/email-sync — on-demand Gmail ⇄ pipeline reconciliation.
 *
 *   GET /api/admin/email-sync            → status only
 *   GET /api/admin/email-sync?run=true   → run a sync now (default 30-day
 *                                          window; ?days=N to widen once,
 *                                          e.g. 365 for the first run)
 *
 * The daily digest runs the same sync automatically before composing, so
 * this endpoint exists for the first backfill and for checking config.
 * Auth: same admin gate as the rest of /api/admin.
 */

// A wide first-run window means many IMAP searches — give it headroom.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  if (req.nextUrl.searchParams.get("run") !== "true") {
    return NextResponse.json({
      configured: isGmailSyncConfigured(),
      hint: "add ?run=true to sync now (?days=365 for the first backfill)",
    });
  }

  const days = Math.min(
    Math.max(Number(req.nextUrl.searchParams.get("days")) || 30, 1),
    730,
  );
  const summary = await syncGmail(days);
  return NextResponse.json({ windowDays: days, ...summary });
}
