import { NextResponse } from "next/server";

interface ForecastPeriod {
  name: string;       // e.g. "TONIGHT", "MON", "MON NIGHT", "TUE"
  wind: string;       // e.g. "Wind NW 10 kt"
  seas: string;       // e.g. "Seas 3 to 4 ft"
  waveDetail: string; // e.g. "NW 2 ft at 4 seconds, W 3 ft at 12 seconds"
}

interface DayForecast {
  day: string;        // e.g. "Mon", "Tue"
  date: string;       // e.g. "Mar 17"
  windSpeed: number;  // knots
  windDir: string;
  seaHeight: number;  // ft (max)
  swellPeriod: number | null; // seconds (longest)
  grade: string;      // A through F
  score: number;      // 0-100
  summary: string;
  color: string;
}

function parseForecast(text: string): ForecastPeriod[] {
  const periods: ForecastPeriod[] = [];

  // Split by period markers like .TONIGHT..., .MON..., .MON NIGHT..., .TUE...
  const periodRegex = /\.([A-Z][A-Z ]+?)\.\.\.([\s\S]*?)(?=\.[A-Z][A-Z ]+?\.\.\.|$$)/g;
  let match;

  while ((match = periodRegex.exec(text)) !== null) {
    const name = match[1].trim();
    const body = match[2].trim();

    const windMatch = body.match(/Wind\s+([A-Z]+)\s+(\d+)(?:\s+to\s+\d+)?\s+kt/i);
    const seasMatch = body.match(/Seas\s+(\d+)\s+to\s+(\d+)\s+ft/i) || body.match(/Seas\s+(\d+)\s+ft/i);
    const waveMatch = body.match(/Wave Detail:\s*(.*?)(?:\.|$)/i);

    periods.push({
      name,
      wind: windMatch ? `${windMatch[1]} ${windMatch[2]} kt` : "variable",
      seas: seasMatch ? `${seasMatch[1]}${seasMatch[2] ? `-${seasMatch[2]}` : ""} ft` : "unknown",
      waveDetail: waveMatch ? waveMatch[1].trim() : "",
    });
  }

  return periods;
}

function scorePeriod(period: ForecastPeriod): { score: number; windSpeed: number; windDir: string; seaHeight: number; swellPeriod: number | null } {
  let score = 70; // baseline

  // Parse wind speed
  const windSpeedMatch = period.wind.match(/(\d+)/);
  const windSpeed = windSpeedMatch ? parseInt(windSpeedMatch[1]) : 0;
  const windDirMatch = period.wind.match(/([A-Z]+)/);
  const windDir = windDirMatch ? windDirMatch[1] : "";

  // Parse sea height (take max value)
  const seaMatch = period.seas.match(/(\d+)/g);
  const seaHeight = seaMatch ? Math.max(...seaMatch.map(Number)) : 0;

  // Parse swell period (take longest)
  const periodMatches = period.waveDetail.match(/at\s+(\d+)\s+seconds/g);
  let swellPeriod: number | null = null;
  if (periodMatches) {
    const periods = periodMatches.map(m => parseInt(m.match(/(\d+)/)![1]));
    swellPeriod = Math.max(...periods);
  }

  // Score wind (0-25 pts)
  if (windSpeed <= 5) score += 25;
  else if (windSpeed <= 10) score += 15;
  else if (windSpeed <= 15) score += 5;
  else if (windSpeed <= 20) score -= 10;
  else score -= 25;

  // Offshore wind bonus
  if (windDir.includes("E") && !windDir.includes("SE")) score += 5;
  if (windDir.includes("W") && windSpeed > 10) score -= 5;

  // Score seas (0-30 pts)
  if (seaHeight <= 2) score += 20;
  else if (seaHeight <= 3) score += 10;
  else if (seaHeight <= 4) score += 0;
  else if (seaHeight <= 6) score -= 15;
  else score -= 30;

  // Swell period bonus
  if (swellPeriod && swellPeriod >= 12) score += 10;
  else if (swellPeriod && swellPeriod < 6) score -= 10;

  return { score: Math.max(0, Math.min(100, score)), windSpeed, windDir, seaHeight, swellPeriod };
}

function gradeFromScore(score: number): { grade: string; color: string; summary: string } {
  if (score >= 88) return { grade: "A", color: "#1B6B6B", summary: "Epic day — get in the water" };
  if (score >= 78) return { grade: "B+", color: "#1B6B6B", summary: "Very good conditions" };
  if (score >= 68) return { grade: "B", color: "#1B6B6B", summary: "Good diving at protected spots" };
  if (score >= 58) return { grade: "C+", color: "#D4A574", summary: "Fair — pick your spot" };
  if (score >= 45) return { grade: "C", color: "#D4A574", summary: "Below average" };
  if (score >= 30) return { grade: "D", color: "#C75B3A", summary: "Poor conditions" };
  return { grade: "F", color: "#C75B3A", summary: "Not recommended" };
}

export async function GET() {
  try {
    // Fetch NWS coastal marine forecast for San Diego zone PZZ750
    const res = await fetch(
      "https://tgftp.nws.noaa.gov/data/forecasts/marine/coastal/pz/pzz750.txt",
      {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Forecast unavailable", days: [] }, { status: 502 });
    }

    const text = await res.text();
    const periods = parseForecast(text);

    if (periods.length === 0) {
      return NextResponse.json({ error: "Could not parse forecast", days: [], raw: text.slice(0, 500) }, { status: 200 });
    }

    // Map day names to dates
    const today = new Date();
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Group periods by day (combine day + night into one score)
    const dayScores = new Map<string, { scores: number[]; windSpeed: number; windDir: string; seaHeight: number; swellPeriod: number | null }>();

    for (const period of periods) {
      // Determine which day this period belongs to
      let dayKey = period.name.replace(" NIGHT", "").replace("TONIGHT", "TONIGHT");

      if (dayKey === "TONIGHT" || dayKey === "TODAY" || dayKey === "REST OF TODAY" || dayKey === "THIS AFTERNOON") {
        dayKey = dayNames[today.getDay()];
      }

      const result = scorePeriod(period);

      const existing = dayScores.get(dayKey);
      if (existing) {
        existing.scores.push(result.score);
        // Use daytime values for display (not night)
        if (!period.name.includes("NIGHT") && !period.name.includes("TONIGHT")) {
          existing.windSpeed = result.windSpeed;
          existing.windDir = result.windDir;
          existing.seaHeight = result.seaHeight;
          existing.swellPeriod = result.swellPeriod;
        }
      } else {
        dayScores.set(dayKey, {
          scores: [result.score],
          windSpeed: result.windSpeed,
          windDir: result.windDir,
          seaHeight: result.seaHeight,
          swellPeriod: result.swellPeriod,
        });
      }
    }

    // Convert to DayForecast array
    const days: DayForecast[] = [];
    const todayIdx = today.getDay();

    for (const [dayName, data] of Array.from(dayScores)) {
      // Calculate average score for the day
      const avgScore = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length);
      const { grade, color, summary } = gradeFromScore(avgScore);

      // Calculate the actual date for this day name
      const dayIdx = dayNames.indexOf(dayName);
      if (dayIdx === -1) continue; // Skip unrecognized

      let daysFromNow = dayIdx - todayIdx;
      if (daysFromNow < 0) daysFromNow += 7;

      const date = new Date(today);
      date.setDate(date.getDate() + daysFromNow);

      days.push({
        day: shortDayNames[dayIdx],
        date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
        windSpeed: data.windSpeed,
        windDir: data.windDir,
        seaHeight: data.seaHeight,
        swellPeriod: data.swellPeriod,
        grade,
        score: avgScore,
        summary,
        color,
      });
    }

    // Sort by date
    days.sort((a, b) => {
      const aIdx = shortDayNames.indexOf(a.day);
      const bIdx = shortDayNames.indexOf(b.day);
      let aDiff = aIdx - todayIdx; if (aDiff < 0) aDiff += 7;
      let bDiff = bIdx - todayIdx; if (bDiff < 0) bDiff += 7;
      return aDiff - bDiff;
    });

    return NextResponse.json(
      {
        days,
        source: "NWS Coastal Waters Forecast PZZ750",
        source_url: "https://forecast.weather.gov/shmrn.php?mz=pzz750&syn=pzz700",
        updated: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Forecast fetch failed", days: [] },
      { status: 500 }
    );
  }
}
