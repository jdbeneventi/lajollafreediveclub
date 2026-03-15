import { NextResponse } from "next/server";

// Parse NDBC 46254 real-time text file for waves and temp
// Header: #YY MM DD hh mm WDIR WSPD GST WVHT DPD APD MWD PRES ATMP WTMP DEWP VIS PTDY TIDE
async function fetch46254(): Promise<{
  waveHeight: number | null;
  wavePeriod: number | null;
  avgPeriod: number | null;
  waveDir: number | null;
  waterTemp: number | null;
  updated: string;
} | null> {
  try {
    const res = await fetch("https://www.ndbc.noaa.gov/data/realtime2/46254.txt", {
      next: { revalidate: 600 },
      headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.trim().split("\n");

    for (const line of lines) {
      if (line.startsWith("#")) continue;
      const c = line.trim().split(/\s+/);
      if (c.length < 15) continue;

      const wvht = c[8] !== "MM" ? parseFloat(c[8]) : null;
      const dpd = c[9] !== "MM" ? parseFloat(c[9]) : null;
      const apd = c[10] !== "MM" ? parseFloat(c[10]) : null;
      const mwd = c[11] !== "MM" ? parseFloat(c[11]) : null;
      const wtmp = c[14] !== "MM" ? parseFloat(c[14]) : null;

      return {
        waveHeight: wvht !== null ? Math.round(wvht * 3.281 * 10) / 10 : null, // m to ft
        wavePeriod: dpd,
        avgPeriod: apd,
        waveDir: mwd,
        waterTemp: wtmp !== null ? Math.round(wtmp * 9 / 5 + 32) : null, // C to F
        updated: `${c[0]}-${c[1]}-${c[2]}T${c[3]}:${c[4]}:00Z`,
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Parse NDBC RSS for wind data (try LJPC1 first, then LJAC1)
async function fetchWindFromRSS(): Promise<{
  windDir: string;
  windSpeed: string;
  windGust: string;
  updated: string;
} | null> {
  const stations = ["ljpc1", "ljac1"];

  for (const station of stations) {
    try {
      const res = await fetch(`https://www.ndbc.noaa.gov/data/latest_obs/${station}.rss`, {
        next: { revalidate: 600 },
        headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const descs = xml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/g);
      if (!descs || descs.length < 2) continue;
      const content = descs[1];

      const extract = (label: string) => {
        const re = new RegExp(`<strong>${label}:</strong>\\s*([^<]+)`, "i");
        const m = content.match(re);
        if (!m) return null;
        return m[1].trim().replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
      };

      const windDir = extract("Wind Direction");
      const windSpeed = extract("Wind Speed");
      const windGust = extract("Wind Gust");

      if (!windDir || !windSpeed) continue;

      // Check if data is stale (more than 3 hours old)
      const timeMatch = content.match(/<strong>([A-Z][a-z]+ \d+, \d{4} [\d:]+ [ap]m [A-Z]+)<\/strong>/);
      const updated = timeMatch ? timeMatch[1] : "recently";

      return { windDir, windSpeed, windGust: windGust || "\u2014", updated };
    } catch {
      continue;
    }
  }
  return null;
}

export async function GET() {
  try {
    const [buoyData, windData] = await Promise.all([
      fetch46254(),
      fetchWindFromRSS(),
    ]);

    return NextResponse.json(
      {
        // Wave data from 46254
        waveHeight: buoyData?.waveHeight ?? null,
        wavePeriod: buoyData?.wavePeriod ?? null,
        avgPeriod: buoyData?.avgPeriod ?? null,
        waveDir: buoyData?.waveDir ?? null,
        waterTemp: buoyData?.waterTemp ?? null,
        buoyUpdated: buoyData?.updated ?? null,
        buoySource: buoyData ? "46254" : null,

        // Wind data from LJPC1 or LJAC1
        windDir: windData?.windDir ?? null,
        windSpeed: windData?.windSpeed ?? null,
        windGust: windData?.windGust ?? null,
        windUpdated: windData?.updated ?? null,

        updated: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch conditions data" },
      { status: 502 }
    );
  }
}
