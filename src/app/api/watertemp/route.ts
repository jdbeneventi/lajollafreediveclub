import { NextResponse } from "next/server";

// Seasonal averages (°F) from Scripps Pier 100+ year record
const SEASONAL_TEMPS: Record<number, number> = {
  0: 58, 1: 58, 2: 59, 3: 60, 4: 62, 5: 64,
  6: 67, 7: 69, 8: 70, 9: 67, 10: 63, 11: 59,
};

// PRIMARY: NDBC Station 46254 real-time text file
// Scripps Nearshore Waverider Buoy — sea temp at 0.46m depth, 46m water depth
// Updates every 30 minutes, columns are space-separated
// Header: #YY MM DD hh mm WDIR WSPD GST WVHT DPD APD MWD PRES ATMP WTMP DEWP VIS PTDY TIDE
async function fetchFrom46254Realtime(): Promise<{ temp: number; waveHt: number | null; wavePd: number | null; updated: string } | null> {
  try {
    const res = await fetch("https://www.ndbc.noaa.gov/data/realtime2/46254.txt", {
      next: { revalidate: 600 },
      headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.trim().split("\n");

    // Skip header lines (start with #)
    for (const line of lines) {
      if (line.startsWith("#")) continue;
      const cols = line.trim().split(/\s+/);
      if (cols.length < 15) continue;

      // WTMP is column index 14 (0-based)
      const wtmp = cols[14];
      if (wtmp === "MM") continue; // MM = missing

      const tempC = parseFloat(wtmp);
      if (isNaN(tempC) || tempC < 5 || tempC > 35) continue;

      const tempF = Math.round(tempC * 9 / 5 + 32);
      const year = cols[0], month = cols[1], day = cols[2], hour = cols[3], min = cols[4];
      const updated = `${year}-${month}-${day}T${hour}:${min}:00Z`;

      // Also grab wave data if available
      const wvht = cols[8] !== "MM" ? parseFloat(cols[8]) : null;
      const dpd = cols[9] !== "MM" ? parseFloat(cols[9]) : null;

      // Convert wave height from meters to feet
      const waveHtFt = wvht !== null ? Math.round(wvht * 3.281 * 10) / 10 : null;

      return { temp: tempF, waveHt: waveHtFt, wavePd: dpd, updated };
    }
    return null;
  } catch {
    return null;
  }
}

// FALLBACK: seatemperature.net (satellite-derived, updated daily)
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

    // Only match Celsius values — Fahrenheit values on the page appear in unrelated text
    const p1 = html.match(/Current Water Temperature[\s\S]{0,300}?([\d]+\.[\d]+)\s*°C/i);
    if (p1) {
      const c = parseFloat(p1[1]);
      if (!isNaN(c) && c > 5 && c < 35) return Math.round(c * 9 / 5 + 32);
    }
    const p2 = html.match(/([\d]+\.[\d]+)\s*°C[\s\S]{0,50}?Today/i);
    if (p2) {
      const c = parseFloat(p2[1]);
      if (!isNaN(c) && c > 5 && c < 35) return Math.round(c * 9 / 5 + 32);
    }
    const p3 = html.match(/today is\s*([\d]+)\s*°C/i);
    if (p3) {
      const c = parseFloat(p3[1]);
      if (!isNaN(c) && c > 5 && c < 35) return Math.round(c * 9 / 5 + 32);
    }
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
    let buoyWaveHt: number | null = null;
    let buoyWavePd: number | null = null;
    let buoyUpdated: string | null = null;

    // Source 1: NDBC 46254 real-time text file (best source — actual buoy at Scripps, 30min updates)
    const buoyData = await fetchFrom46254Realtime();
    if (buoyData) {
      waterTemp = buoyData.temp;
      tempSource = "Scripps Nearshore Buoy (46254)";
      buoyWaveHt = buoyData.waveHt;
      buoyWavePd = buoyData.wavePd;
      buoyUpdated = buoyData.updated;
    }

    // Source 2: seatemperature.net (satellite, daily)
    if (!waterTemp) {
      waterTemp = await fetchFromSeaTempNet();
      if (waterTemp) tempSource = "NOAA satellite (seatemperature.net)";
    }

    // Source 3: Seasonal estimate
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
            if (preds[i].height > preds[i - 1].height && preds[i].height > preds[i + 1].height)
              tides.push({ time: preds[i].time, height: preds[i].height.toFixed(1), type: "high" });
            else if (preds[i].height < preds[i - 1].height && preds[i].height < preds[i + 1].height)
              tides.push({ time: preds[i].time, height: preds[i].height.toFixed(1), type: "low" });
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
        buoy_wave_ht: buoyWaveHt,
        buoy_wave_pd: buoyWavePd,
        buoy_updated: buoyUpdated,
        tides,
        tide_state: tideState,
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
      { water_temp: 59, temp_source: "Seasonal fallback", is_estimate: true, tides: [], tide_state: "unknown" },
      { status: 200 }
    );
  }
}
