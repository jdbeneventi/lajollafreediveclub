import { NextResponse } from "next/server";

// Try multiple stations for water temp — some may be offline
const TEMP_SOURCES = [
  { id: "46254", name: "Scripps Nearshore Buoy", label: "Sea Temperature" },
  { id: "ljpc1", name: "Scripps Pier", label: "Sea Temperature" },
  { id: "ljac1", name: "La Jolla NOS", label: "Water Temperature" },
];

async function fetchTempFromRSS(stationId: string, tempLabel: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://www.ndbc.noaa.gov/data/latest_obs/${stationId}.rss`,
      {
        next: { revalidate: 900 },
        headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return null;
    const xml = await res.text();
    
    // Try to find temperature in the RSS description
    const re = new RegExp(`<strong>${tempLabel}:</strong>\\s*([\\d.]+)`, "i");
    const descs = xml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/g);
    if (!descs || descs.length < 2) return null;
    
    const m = descs[1].match(re);
    if (!m) return null;
    
    const temp = parseFloat(m[1]);
    if (isNaN(temp)) return null;
    
    // NDBC reports in Fahrenheit for US stations
    // If value seems to be Celsius (below 40), convert
    return temp < 40 ? Math.round(temp * 9 / 5 + 32) : Math.round(temp);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    // Try each station until we get a temp reading
    let waterTemp: number | null = null;
    let tempSource = "";

    for (const source of TEMP_SOURCES) {
      waterTemp = await fetchTempFromRSS(source.id, source.label);
      if (waterTemp !== null) {
        tempSource = source.name;
        break;
      }
    }

    // Fetch tide predictions from NOAA CO-OPS
    const tides: { time: string; height: string; type: string }[] = [];
    let tideState = "unknown";

    try {
      const tidesRes = await fetch(
        "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=9410230&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=h&units=english&format=json",
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

          // Determine tide state
          if (tides.length >= 2) {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
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
        tides,
        tide_state: tideState,
        updated: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { water_temp: null, tides: [], tide_state: "unknown" },
      { status: 502 }
    );
  }
}
