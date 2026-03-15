import { NextResponse } from "next/server";

// Seasonal average water temps for La Jolla (Scripps Pier historical data, °F)
const SEASONAL_TEMPS: Record<number, number> = {
  0: 58, 1: 58, 2: 59, 3: 60, 4: 62, 5: 64,
  6: 67, 7: 69, 8: 70, 9: 67, 10: 63, 11: 59,
};

// Source 1: seatemperature.net — reliable, updated daily, satellite-derived
async function fetchFromSeaTempNet(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://seatemperature.net/current/united-states/san-diego-california-united-states-sea-temperature",
      {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LaJollaFreediveClub/1.0)" },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return null;
    const html = await res.text();

    // Look for the current temperature in Celsius — shown prominently on the page
    // Pattern: "Current Water Temperature" section followed by a temp value
    // The page shows temp like "14.7°C"
    const celsiusMatch = html.match(/Current Water Temperature[\s\S]{0,200}?([\d.]+)\s*°C/i);
    if (celsiusMatch) {
      const celsius = parseFloat(celsiusMatch[1]);
      if (!isNaN(celsius) && celsius > 5 && celsius < 35) {
        return Math.round(celsius * 9 / 5 + 32);
      }
    }

    // Also try matching Fahrenheit directly
    const fahrenheitMatch = html.match(/([\d.]+)\s*°F/i);
    if (fahrenheitMatch) {
      const f = parseFloat(fahrenheitMatch[1]);
      if (!isNaN(f) && f > 40 && f < 90) return Math.round(f);
    }

    return null;
  } catch {
    return null;
  }
}

// Source 2: NDBC station RSS feeds
async function fetchFromNDBC(stationId: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://www.ndbc.noaa.gov/data/latest_obs/${stationId}.rss`,
      {
        next: { revalidate: 600 },
        headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return null;
    const xml = await res.text();
    const descs = xml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/g);
    if (!descs || descs.length < 2) return null;

    for (const label of ["Sea Temperature", "Water Temperature", "Sea Surface Temperature"]) {
      const re = new RegExp(`<strong>${label}:</strong>\\s*([\\d.]+)`, "i");
      const m = descs[1].match(re);
      if (m) {
        const temp = parseFloat(m[1]);
        if (!isNaN(temp)) return temp < 40 ? Math.round(temp * 9 / 5 + 32) : Math.round(temp);
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Source 3: NDBC mobile page
async function fetchFromNDBCMobile(stationId: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://www.ndbc.noaa.gov/mobile/station.php?station=${stationId}`,
      {
        next: { revalidate: 600 },
        headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/Water Temp:\s*(\d+)\s*°F/i);
    if (m) return parseInt(m[1]);
    const mc = html.match(/Water Temp:\s*(\d+)\s*°C/i);
    if (mc) return Math.round(parseInt(mc[1]) * 9 / 5 + 32);
    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    let waterTemp: number | null = null;
    let tempSource = "";
    let isEstimate = false;

    // Try sources in order of reliability
    waterTemp = await fetchFromSeaTempNet();
    if (waterTemp) { tempSource = "NOAA satellite (seatemperature.net)"; }

    if (!waterTemp) {
      waterTemp = await fetchFromNDBC("46254");
      if (waterTemp) tempSource = "NDBC Scripps Nearshore Buoy";
    }

    if (!waterTemp) {
      waterTemp = await fetchFromNDBC("ljpc1");
      if (waterTemp) tempSource = "NDBC Scripps Pier";
    }

    if (!waterTemp) {
      waterTemp = await fetchFromNDBCMobile("46254");
      if (waterTemp) tempSource = "NDBC Scripps Nearshore (mobile)";
    }

    // Seasonal fallback
    if (!waterTemp) {
      const month = new Date().getMonth();
      waterTemp = SEASONAL_TEMPS[month] || 62;
      tempSource = "Seasonal estimate (Scripps Pier 100yr avg)";
      isEstimate = true;
    }

    // Fetch tide predictions
    const tides: { time: string; height: string; type: string }[] = [];
    let tideState = "unknown";

    try {
      const now = new Date();
      const pacificDate = now.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });

      const tidesRes = await fetch(
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${pacificDate.replace(/-/g, "")}&range=24&station=9410230&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=h&units=english&format=json`,
        { next: { revalidate: 3600 } }
      );

      if (tidesRes.ok) {
        const data = await tidesRes.json();
        if (data.predictions && data.predictions.length > 2) {
          const preds = data.predictions.map((p: { t: string; v: string }) => ({
            time: p.t,
            height: parseFloat(p.v),
          }));

          for (let i = 1; i < preds.length - 1; i++) {
            if (preds[i].height > preds[i - 1].height && preds[i].height > preds[i + 1].height) {
              tides.push({ time: preds[i].time, height: preds[i].height.toFixed(1), type: "high" });
            } else if (preds[i].height < preds[i - 1].height && preds[i].height < preds[i + 1].height) {
              tides.push({ time: preds[i].time, height: preds[i].height.toFixed(1), type: "low" });
            }
          }

          if (tides.length >= 2) {
            const pacificNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
            const currentMinutes = pacificNow.getHours() * 60 + pacificNow.getMinutes();
            for (let i = 0; i < tides.length - 1; i++) {
              const parts = tides[i].time.split(" ")[1]?.split(":") || ["0", "0"];
              const tideMin = parseInt(parts[0]) * 60 + parseInt(parts[1]);
              const nextParts = tides[i + 1].time.split(" ")[1]?.split(":") || ["0", "0"];
              const nextTideMin = parseInt(nextParts[0]) * 60 + parseInt(nextParts[1]);
              if (currentMinutes >= tideMin && currentMinutes < nextTideMin) {
                tideState = tides[i].type === "low" ? "incoming" : "outgoing";
                break;
              }
            }
          }
        }
      }
    } catch { /* tides failed */ }

    return NextResponse.json(
      {
        water_temp: waterTemp,
        temp_source: tempSource,
        is_estimate: isEstimate,
        tides,
        tide_state: tideState,
        updated: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { water_temp: 59, temp_source: "Seasonal fallback", is_estimate: true, tides: [], tide_state: "unknown" },
      { status: 200 }
    );
  }
}
