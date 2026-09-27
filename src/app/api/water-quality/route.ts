import { NextResponse } from "next/server";
import { checkRain72h, CHRONIC_ADVISORIES, formatLifts } from "@/lib/waterQuality";

// Matches the s-maxage=600 this route already sets. Without it Next prerenders
// at build time and never revalidates — see /api/almanac for the full note.
// This one carries beach advisories, so staleness is a safety issue.
export const revalidate = 600;

// Reports only what we can verify: observed 72-hour rainfall (the county's
// General Rain Advisory rule) plus the county's one chronic La Jolla
// advisory. We never synthesize closures — sdbeachinfo.com is linked as the
// authority for live per-station status. History: the previous version
// keyword-matched a news page and regexed countywide banner counts, which
// invented La Jolla closures that didn't exist (reported by a subscriber
// Sep 26, 2026).
export async function GET() {
  const alerts: { icon: string; station: string; detail: string; persistent?: boolean }[] = [];

  const rain = await checkRain72h();
  if (rain.advisory) {
    const lifts = formatLifts(rain.liftsAt);
    alerts.push({
      icon: "🌧️",
      station: "All entries",
      detail:
        `Rain advisory — ${rain.totalIn}" of rain in the last 72 hours. County guidance: avoid ocean contact ` +
        `for 72 hours after rainfall${lifts ? ` (clears ~${lifts})` : ""}. Runoff raises bacteria near storm drains.`,
    });
  }

  for (const pa of CHRONIC_ADVISORIES) {
    alerts.push({ icon: "🟡", station: pa.station, detail: pa.reason + " (since " + pa.since + ")", persistent: true });
  }

  // Chronic advisories are informational — only an active (rain) advisory
  // changes status. Closures come from the county map, not from us.
  const status = rain.advisory ? "yellow" : "green";

  return NextResponse.json({
    status,
    advisoryCount: rain.advisory ? 1 : 0,
    closureCount: 0,
    rainWarning: rain.advisory,
    rain: { totalIn: rain.totalIn, lastRain: rain.lastRain, liftsAt: rain.liftsAt },
    alerts,
    updated: new Date().toISOString(),
  }, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
  });
}
