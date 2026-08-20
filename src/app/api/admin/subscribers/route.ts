import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

/**
 * /api/admin/subscribers — live Kit (ConvertKit) subscriber counts.
 *
 * The KIT_API_KEY lives only in Vercel env (the daily-email broadcast uses
 * it); this endpoint turns it into an at-a-glance answer for "how many
 * subscribers do we have?" — total list plus every tag's count, with the
 * daily-conditions tag (the audience the 6am email actually reaches)
 * called out. Read-only against Kit's V4 API.
 */

const DAILY_CONDITIONS_TAG_ID = 17696327;

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const key = process.env.KIT_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "KIT_API_KEY not configured" }, { status: 500 });
  }
  const H = { "X-Kit-Api-Key": key };

  try {
    const [subsRes, tagsRes] = await Promise.all([
      fetch(
        "https://api.kit.com/v4/subscribers?per_page=1&include_total_count=true",
        { headers: H, signal: AbortSignal.timeout(10_000) },
      ),
      fetch("https://api.kit.com/v4/tags?include_total_count=true", {
        headers: H,
        signal: AbortSignal.timeout(10_000),
      }),
    ]);
    const subs = await subsRes.json();
    const tags = await tagsRes.json();

    // Per-tag subscriber counts (small tag list — a request per tag is fine).
    const tagList: Array<{ id: number; name: string }> = tags.tags || [];
    const tagCounts = await Promise.all(
      tagList.map(async (t) => {
        try {
          const r = await fetch(
            `https://api.kit.com/v4/tags/${t.id}/subscribers?per_page=1&include_total_count=true`,
            { headers: H, signal: AbortSignal.timeout(10_000) },
          );
          const d = await r.json();
          return {
            id: t.id,
            name: t.name,
            subscribers: d.pagination?.total_count ?? null,
            isDailyConditions: t.id === DAILY_CONDITIONS_TAG_ID,
          };
        } catch {
          return { id: t.id, name: t.name, subscribers: null, isDailyConditions: t.id === DAILY_CONDITIONS_TAG_ID };
        }
      }),
    );

    return NextResponse.json({
      totalSubscribers: subs.pagination?.total_count ?? null,
      tags: tagCounts.sort((a, b) => (b.subscribers || 0) - (a.subscribers || 0)),
      raw: subs.pagination ? undefined : { subs, tags }, // surfaces shape drift
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Kit API failed" },
      { status: 502 },
    );
  }
}
