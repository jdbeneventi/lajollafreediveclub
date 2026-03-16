import { NextResponse } from "next/server";

interface TideEntry {
  time: string;
  height: string;
  type: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");
    const range = Math.min(days * 24, 168); // max 7 days

    // Get Pacific date for start
    const now = new Date();
    const pacificDate = now.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });

    const res = await fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${pacificDate.replace(/-/g, "")}&range=${range}&station=9410230&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&format=json`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "NOAA API unavailable" }, { status: 502 });
    }

    const data = await res.json();
    if (!data.predictions) {
      return NextResponse.json({ error: "No predictions available" }, { status: 200 });
    }

    // NOAA hilo interval gives us exact high/low times
    const tides: TideEntry[] = data.predictions.map((p: { t: string; v: string; type: string }) => ({
      time: p.t,
      height: parseFloat(p.v).toFixed(1),
      type: p.type === "H" ? "high" : "low",
    }));

    // Group by day
    const dayMap = new Map<string, TideEntry[]>();
    for (const tide of tides) {
      const dateStr = tide.time.split(" ")[0];
      if (!dayMap.has(dateStr)) dayMap.set(dateStr, []);
      dayMap.get(dateStr)!.push(tide);
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dailyTides = Array.from(dayMap.entries()).map(([dateStr, events]) => {
      const d = new Date(dateStr + "T12:00:00");
      const lowestTide = events.reduce((min, t) => parseFloat(t.height) < parseFloat(min.height) ? t : min, events[0]);
      const highestTide = events.reduce((max, t) => parseFloat(t.height) > parseFloat(max.height) ? t : max, events[0]);

      // Best dive window: 1-2 hours into incoming tide (after a low)
      const lowTides = events.filter(t => t.type === "low");
      const bestWindows = lowTides.map((lt: TideEntry) => {
        const [, time] = lt.time.split(" ");
        const [h, m] = time.split(":").map(Number);
        const startMin = h * 60 + m + 60; // 1 hour after low
        const endMin = startMin + 120; // 3 hours after low
        const startH = Math.floor(startMin / 60) % 24;
        const startM = startMin % 60;
        const endH = Math.floor(endMin / 60) % 24;
        const endM = endMin % 60;
        const fmt = (hr: number, mn: number) => {
          const ampm = hr >= 12 ? "PM" : "AM";
          const h12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
          return `${h12}:${mn.toString().padStart(2, "0")} ${ampm}`;
        };
        return `${fmt(startH, startM)} – ${fmt(endH, endM)}`;
      });

      // Dive quality based on tide range
      const range = parseFloat(highestTide.height) - parseFloat(lowestTide.height);
      let tideQuality: string;
      if (range >= 6) tideQuality = "Large swing — strong currents possible";
      else if (range >= 4) tideQuality = "Moderate swing — good movement";
      else tideQuality = "Small swing — gentle conditions";

      return {
        date: dateStr,
        dayName: dayNames[d.getDay()],
        displayDate: `${monthNames[d.getMonth()]} ${d.getDate()}`,
        events,
        lowestTide: { height: lowestTide.height, time: lowestTide.time.split(" ")[1] },
        highestTide: { height: highestTide.height, time: highestTide.time.split(" ")[1] },
        bestDiveWindows: bestWindows,
        tideRange: range.toFixed(1),
        tideQuality,
      };
    });

    return NextResponse.json({
      days: dailyTides,
      station: "NOAA CO-OPS 9410230 (La Jolla)",
      source_url: "https://tidesandcurrents.noaa.gov/stationhome.html?id=9410230",
      updated: new Date().toISOString(),
    }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
