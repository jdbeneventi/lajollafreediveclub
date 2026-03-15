import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Use NOAA CO-OPS API directly for water temp and tide predictions
    // Station 9410230 = La Jolla, CA
    const [tempRes, tidesRes] = await Promise.allSettled([
      fetch(
        "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=9410230&product=water_temperature&units=english&time_zone=lst_ldt&format=json",
        { next: { revalidate: 900 } }
      ),
      fetch(
        "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=9410230&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=h&units=english&format=json",
        { next: { revalidate: 3600 } }
      ),
    ]);

    // Parse water temperature
    let waterTemp: number | null = null;
    let tempTime: string | null = null;
    if (tempRes.status === "fulfilled" && tempRes.value.ok) {
      try {
        const data = await tempRes.value.json();
        if (data.data && data.data.length > 0) {
          waterTemp = parseFloat(data.data[0].v);
          tempTime = data.data[0].t;
        }
      } catch { /* parsing failed */ }
    }

    // Parse tide predictions — find highs and lows
    const tides: { time: string; height: string; type: string }[] = [];
    if (tidesRes.status === "fulfilled" && tidesRes.value.ok) {
      try {
        const data = await tidesRes.value.json();
        if (data.predictions && data.predictions.length > 2) {
          const preds = data.predictions.map((p: { t: string; v: string }) => ({
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
      } catch { /* parsing failed */ }
    }

    // Determine current tide state
    let tideState = "unknown";
    if (tides.length >= 2) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      for (let i = 0; i < tides.length - 1; i++) {
        const timeParts = tides[i].time.split(" ")[1]?.split(":") || ["0", "0"];
        const tideMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
        const nextTimeParts = tides[i + 1].time.split(" ")[1]?.split(":") || ["0", "0"];
        const nextTideMinutes = parseInt(nextTimeParts[0]) * 60 + parseInt(nextTimeParts[1]);

        if (currentMinutes >= tideMinutes && currentMinutes < nextTideMinutes) {
          tideState = tides[i].type === "low" ? "incoming" : "outgoing";
          break;
        }
      }
    }

    return NextResponse.json(
      {
        water_temp: waterTemp,
        water_temp_time: tempTime,
        tides,
        tide_state: tideState,
        updated: new Date().toISOString(),
        sources: ["NOAA CO-OPS Station 9410230 (La Jolla)"],
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch water data", water_temp: null, tides: [], tide_state: "unknown" },
      { status: 502 }
    );
  }
}
