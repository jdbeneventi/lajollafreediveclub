import { NextResponse } from "next/server";
import { getMoonPhase, getNextFullMoon, getNextNewMoon } from "@/lib/moon";
import { getTopEvents, isGrunionNight } from "@/lib/seasonal";

/**
 * Regenerate hourly.
 *
 * This route derives everything from `new Date()` and makes no fetch() call,
 * so without this Next prerenders it at build time and serves that same body
 * forever — the Cache-Control header below never gets a chance to apply. That
 * is exactly what happened: it served build-day moon data for 61 days.
 *
 * Matches the s-maxage=3600 already set below. Any new data route that has no
 * revalidating fetch() needs this too.
 */
export const revalidate = 3600;

export async function GET() {
  const now = new Date();
  const moon = getMoonPhase(now);
  const events = getTopEvents(now, 8);
  const grunionTonight = isGrunionNight(now, moon.age);
  const nextFull = getNextFullMoon(now);
  const nextNew = getNextNewMoon(now);

  const fmt = (d: Date) => d.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
  });

  return NextResponse.json({
    moon: {
      ...moon,
      nextFullMoon: fmt(nextFull),
      nextNewMoon: fmt(nextNew),
    },
    seasonal: events,
    grunionTonight,
    updated: now.toISOString(),
  }, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
  });
}
