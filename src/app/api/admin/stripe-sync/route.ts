import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { isStripeSyncConfigured, syncStripe } from "@/lib/stripeSync";

/**
 * /api/admin/stripe-sync — on-demand payment reconciliation against the
 * Viriditas LLC Stripe account (read-only restricted key).
 *
 *   GET /api/admin/stripe-sync            → status only
 *   GET /api/admin/stripe-sync?run=true   → run a sync now (default 90-day
 *                                           window; ?days=N to widen once)
 *
 * The daily digest runs the same sync automatically before composing, so
 * this endpoint exists for the first backfill and for checking config.
 * Auth: same admin gate as the rest of /api/admin.
 */

// Each active inquiry costs a couple of Stripe API calls — give it headroom.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  if (req.nextUrl.searchParams.get("run") !== "true") {
    return NextResponse.json({
      configured: isStripeSyncConfigured(),
      hint: "add ?run=true to sync now (?days=365 to widen the first run)",
    });
  }

  const days = Math.min(
    Math.max(Number(req.nextUrl.searchParams.get("days")) || 90, 1),
    730,
  );
  const summary = await syncStripe(days);
  return NextResponse.json({ windowDays: days, ...summary });
}
