import { NextResponse } from "next/server";
import { getLocalIntel, LocalIntelResult } from "@/lib/local-intel";

// Simple in-memory cache (resets on cold start, which is fine)
let cache: { data: LocalIntelResult; timestamp: number } | null = null;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

export async function GET() {
  // Return cached result if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800" },
    });
  }

  try {
    const result = await getLocalIntel();
    cache = { data: result, timestamp: Date.now() };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800" },
    });
  } catch {
    return NextResponse.json(
      { alerts: [], waterQuality: { advisories: 0, closures: 0, warnings: 0 }, persistentAdvisories: [], lastUpdated: new Date().toISOString(), sourcesChecked: 0 },
      { status: 500 }
    );
  }
}
