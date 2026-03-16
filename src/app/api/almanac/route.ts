import { NextResponse } from "next/server";
import { getMoonPhase, getNextFullMoon, getNextNewMoon } from "@/lib/moon";
import { getTopEvents, isGrunionNight } from "@/lib/seasonal";

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
