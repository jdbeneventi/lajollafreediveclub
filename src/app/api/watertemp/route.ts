import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch from both LJAC1 (water temp) and NOAA Tides API
    const [buoyRes, tidesRes] = await Promise.allSettled([
      fetch("https://www.ndbc.noaa.gov/data/latest_obs/ljac1.rss", {
        next: { revalidate: 900 },
        headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
      }),
      fetch(
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=9410230&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=h&units=english&format=json`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    let waterTemp: string | null = null;
    let airTemp: string | null = null;
    let waterLevel: string | null = null;

    // Parse LJAC1 RSS for temps
    if (buoyRes.status === "fulfilled" && buoyRes.value.ok) {
      const xml = await buoyRes.value.text();
      const extractValue = (label: string) => {
        const re = new RegExp(`<strong>${label}:</strong>\\s*([^<]+)`, "i");
        const descs = xml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/g);
        if (!descs || descs.length < 2) return null;
        const m = descs[1].match(re);
        return m ? m[1].trim().replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code))) : null;
      };
      waterTemp = extractValue("Water Temperature");
      airTemp = extractValue("Air Temperature");
      waterLevel = extractValue("Water Level");
    }

    // Parse tide predictions
    const tides: { time: string; height: string; type: string }[] = [];
    if (tidesRes.status === "fulfilled" && tidesRes.value.ok) {
      try {
        const tidesData = await tidesRes.value.json();
        if (tidesData.predictions) {
          // Find high/low tides by looking for local maxima/minima
          const preds = tidesData.predictions.map((p: { t: string; v: string }) => ({
            time: p.t,
            height: parseFloat(p.v),
          }));

          for (let i = 1; i < preds.length - 1; i++) {
            const prev = preds[i - 1].height;
            const curr = preds[i].height;
            const next = preds[i + 1].height;
            if (curr > prev && curr > next) {
              tides.push({ time: preds[i].time, height: curr.toFixed(1), type: "high" });
            } else if (curr < prev && curr < next) {
              tides.push({ time: preds[i].time, height: curr.toFixed(1), type: "low" });
            }
          }
        }
      } catch {
        // tides parsing failed
      }
    }

    // Determine current tide state
    const now = new Date();
    const currentHour = now.getHours();
    let tideState = "unknown";
    if (tides.length >= 2) {
      // Find the nearest past and future tide events
      for (let i = 0; i < tides.length - 1; i++) {
        const tideHour = parseInt(tides[i].time.split(" ")[1]?.split(":")[0] || "0");
        const nextTideHour = parseInt(tides[i + 1].time.split(" ")[1]?.split(":")[0] || "0");
        if (currentHour >= tideHour && currentHour < nextTideHour) {
          tideState = tides[i].type === "low" ? "incoming" : "outgoing";
          break;
        }
      }
    }

    return NextResponse.json(
      {
        water_temp: waterTemp,
        air_temp: airTemp,
        water_level: waterLevel,
        tides,
        tide_state: tideState,
        updated: new Date().toISOString(),
        sources: ["NDBC LJAC1", "NOAA Tides Station 9410230"],
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch water data", water_temp: null, tides: [] },
      { status: 502 }
    );
  }
}
