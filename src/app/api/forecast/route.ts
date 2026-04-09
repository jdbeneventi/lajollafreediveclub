import { NextResponse } from "next/server";

interface ForecastPeriod {
  name: string;
  wind: string;
  seas: string;
  waveDetail: string;
}

interface DayForecast {
  day: string;
  date: string;
  windSpeed: number;
  windDir: string;
  seaHeight: number;
  swellPeriod: number | null;
  grade: string;
  score: number;
  summary: string;
  color: string;
}

function parseForecast(text: string): ForecastPeriod[] {
  const periods: ForecastPeriod[] = [];

  // The NDBC forecast HTML contains multiple zones. 
  // Find PZZ740 section (inner coastal, 0-10nm — most relevant for freediving)
  // Fall back to PZZ750 if PZZ740 not found
  let section = text;
  const pzz740Start = text.indexOf("PZZ740");
  const pzz750Start = text.indexOf("PZZ750");
  
  if (pzz740Start !== -1) {
    // Find the end of PZZ740 section (starts at next PZZ or $$ marker)
    const nextSection = text.indexOf("PZZ", pzz740Start + 6);
    const dollarEnd = text.indexOf("$$", pzz740Start);
    const endIdx = Math.min(
      nextSection !== -1 ? nextSection : text.length,
      dollarEnd !== -1 ? dollarEnd : text.length
    );
    section = text.slice(pzz740Start, endIdx);
  } else if (pzz750Start !== -1) {
    const nextSection = text.indexOf("PZZ", pzz750Start + 6);
    const dollarEnd = text.indexOf("$$", pzz750Start);
    const endIdx = Math.min(
      nextSection !== -1 ? nextSection : text.length,
      dollarEnd !== -1 ? dollarEnd : text.length
    );
    section = text.slice(pzz750Start, endIdx);
  }

  // The NDBC HTML format uses period names without leading dots
  // Pattern: "TODAY Wind...", "TONIGHT Wind...", "MON Wind..."
  // Or with dots: ".TODAY...Wind..."
  // Split on period markers — handle both formats
  const periodPattern = /(?:^|\n)\s*\.?([A-Z][A-Z ]*?)(?:\.{3}|\s+(?=Wind|Seas))/gm;
  const matches: { name: string; startIdx: number }[] = [];
  let match;
  
  while ((match = periodPattern.exec(section)) !== null) {
    const name = match[1].trim();
    // Filter out non-period names
    if (name.length > 20) continue;
    if (name.includes("COASTAL") || name.includes("WATERS") || name.includes("MATEO") || name.includes("BORDER") || name.includes("PDT") || name.includes("PST") || name.includes("NATIONAL")) continue;
    matches.push({ name, startIdx: match.index });
  }

  for (let i = 0; i < matches.length; i++) {
    const body = section.slice(
      matches[i].startIdx,
      i < matches.length - 1 ? matches[i + 1].startIdx : section.length
    );

    // Parse wind
    let windStr = "variable 5 kt";
    const windStd = body.match(/Wind\s+([NSEW]{1,3})\s+(\d+)(?:\s+to\s+(\d+))?\s+kt/i);
    const windVar = body.match(/Wind\s+variable\s+(?:less\s+than\s+)?(\d+)\s+kt/i);
    if (windStd) {
      windStr = `${windStd[1]} ${windStd[3] || windStd[2]} kt`;
    } else if (windVar) {
      windStr = `variable ${windVar[1]} kt`;
    }

    // Parse seas
    let seasStr = "unknown";
    const seasMatch = body.match(/Seas\s+(\d+)(?:\s+to\s+(\d+))?\s+ft/i);
    if (seasMatch) {
      seasStr = seasMatch[2] ? `${seasMatch[1]}-${seasMatch[2]} ft` : `${seasMatch[1]} ft`;
    }

    // Parse wave detail
    let waveDetail = "";
    const waveMatch = body.match(/Wave\s+Detail:\s*([\s\S]*?)(?=\s*(?:TODAY|TONIGHT|SUN|MON|TUE|WED|THU|FRI|SAT|\.(?:[A-Z])|\n\s*\n|$))/i);
    if (waveMatch) {
      waveDetail = waveMatch[1].replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    }

    periods.push({ name: matches[i].name, wind: windStr, seas: seasStr, waveDetail });
  }

  return periods;
}

function scorePeriod(period: ForecastPeriod): { score: number; windSpeed: number; windDir: string; seaHeight: number; swellPeriod: number | null } {
  let score = 50;

  const isVariable = period.wind.includes("variable");
  const windSpeedMatch = period.wind.match(/(\d+)/);
  let windSpeed = windSpeedMatch ? parseInt(windSpeedMatch[1]) : 0;
  if (isVariable) windSpeed = Math.round(windSpeed * 0.5);

  const windDirMatch = period.wind.match(/\b([NSEW]{1,3})\b/);
  const windDir = windDirMatch ? windDirMatch[1] : "";

  const seaMatch = period.seas.match(/(\d+)/g);
  const seaHeight = seaMatch ? Math.max(...seaMatch.map(Number)) : 0;

  const periodMatches = period.waveDetail.match(/at\s+(\d+)\s+seconds/g);
  let swellPeriod: number | null = null;
  if (periodMatches) {
    const periods = periodMatches.map(m => parseInt(m.match(/(\d+)/)![1]));
    swellPeriod = Math.max(...periods);
  }

  // Wind scoring
  if (windSpeed <= 3) score += 20;
  else if (windSpeed <= 5) score += 15;
  else if (windSpeed <= 8) score += 8;
  else if (windSpeed <= 12) score += 0;
  else if (windSpeed <= 18) score -= 12;
  else score -= 25;

  if (windDir.includes("E") && !windDir.includes("SE")) score += 5;
  if (windDir.includes("W") && windSpeed > 10) score -= 5;

  // Seas scoring
  if (seaHeight <= 1) score += 25;
  else if (seaHeight <= 2) score += 15;
  else if (seaHeight <= 3) score += 5;
  else if (seaHeight <= 4) score -= 5;
  else if (seaHeight <= 6) score -= 15;
  else score -= 30;

  // Swell period bonus
  if (swellPeriod && swellPeriod >= 12) score += 10;
  else if (swellPeriod && swellPeriod < 6) score -= 10;

  return { score: Math.max(0, Math.min(100, score)), windSpeed, windDir, seaHeight, swellPeriod };
}

function gradeFromScore(score: number): { grade: string; color: string; summary: string } {
  if (score >= 88) return { grade: "A", color: "#1B6B6B", summary: "Epic day \u2014 get in the water" };
  if (score >= 78) return { grade: "B+", color: "#1B6B6B", summary: "Very good conditions" };
  if (score >= 68) return { grade: "B", color: "#1B6B6B", summary: "Good at protected spots" };
  if (score >= 58) return { grade: "C+", color: "#D4A574", summary: "Fair \u2014 pick your spot" };
  if (score >= 45) return { grade: "C", color: "#D4A574", summary: "Below average" };
  if (score >= 30) return { grade: "D", color: "#C75B3A", summary: "Poor conditions" };
  return { grade: "F", color: "#C75B3A", summary: "Not recommended" };
}

export async function GET() {
  try {
    // Try the NDBC forecast page first (has current data)
    // Then fall back to the NWS text file
    const urls = [
      "https://www.ndbc.noaa.gov/data/Forecasts/FZUS56.KSGX.html",
      "https://tgftp.nws.noaa.gov/data/forecasts/marine/coastal/pz/pzz750.txt",
    ];

    let text = "";
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          next: { revalidate: 3600 },
          headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          text = await res.text();
          // Strip HTML tags if from NDBC
          text = text.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");
          if (text.includes("Wind") && text.includes("Seas")) break;
        }
      } catch { continue; }
    }

    if (!text) {
      return NextResponse.json({ error: "Forecast unavailable", days: [] }, { status: 502 });
    }

    const periods = parseForecast(text);
    if (periods.length === 0) {
      return NextResponse.json({ error: "Could not parse forecast", days: [], raw: text.slice(0, 500) }, { status: 200 });
    }

    // Map periods to days
    const today = new Date();
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const todayIdx = today.getDay();

    // Group periods by day
    const dayScores = new Map<string, { scores: number[]; windSpeed: number; windDir: string; seaHeight: number; swellPeriod: number | null }>();

    for (const period of periods) {
      let dayKey = period.name
        .replace(" NIGHT", "")
        .replace("REST OF ", "")
        .replace("THIS ", "")
        .replace("EARLY ", "")
        .trim();

      if (dayKey === "TONIGHT" || dayKey === "TODAY" || dayKey === "AFTERNOON" || dayKey === "EVENING") {
        dayKey = dayNames[todayIdx];
      }

      // Skip if not a recognized day name
      if (!dayNames.includes(dayKey)) continue;

      const result = scorePeriod(period);
      const existing = dayScores.get(dayKey);
      if (existing) {
        existing.scores.push(result.score);
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

    // Build today's time-of-day breakdown
    const todayPeriods: { period: string; wind: string; seas: string; grade: string; score: number; color: string; summary: string }[] = [];
    const todayNames = ["TODAY", "THIS AFTERNOON", "AFTERNOON", "TONIGHT", "EVENING", "THIS EVENING", "REST OF TODAY"];
    for (const period of periods) {
      const upperName = period.name.toUpperCase();
      if (todayNames.some(n => upperName.includes(n)) || upperName === dayNames[todayIdx]) {
        const result = scorePeriod(period);
        const { grade, color, summary } = gradeFromScore(result.score);
        let label = "Morning";
        if (upperName.includes("AFTERNOON") || upperName.includes("REST OF")) label = "Afternoon";
        if (upperName.includes("TONIGHT") || upperName.includes("EVENING") || upperName.includes("NIGHT")) label = "Evening";
        // Don't duplicate labels
        if (!todayPeriods.some(p => p.period === label)) {
          todayPeriods.push({
            period: label,
            wind: period.wind,
            seas: period.seas,
            grade, score: result.score, color, summary,
          });
        }
      }
    }

    // If we only got one period for today, estimate the others based on typical patterns
    if (todayPeriods.length === 1 && todayPeriods[0].period === "Morning") {
      const morning = todayPeriods[0];
      // Afternoon: typically windier (+5-10kt), same seas
      const pmScore = Math.max(30, morning.score - 12);
      const pmGrade = gradeFromScore(pmScore);
      todayPeriods.push({ period: "Afternoon", wind: morning.wind.replace(/(\d+)/, (m) => String(Math.min(25, parseInt(m) + 5))), seas: morning.seas, ...pmGrade, score: pmScore });
      // Evening: wind drops, seas same
      const evScore = Math.max(30, morning.score - 5);
      const evGrade = gradeFromScore(evScore);
      todayPeriods.push({ period: "Evening", wind: morning.wind, seas: morning.seas, ...evGrade, score: evScore });
    }

    // Convert to DayForecast array
    const days: DayForecast[] = [];
    for (const [dayName, data] of Array.from(dayScores)) {
      const avgScore = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length);
      const { grade, color, summary } = gradeFromScore(avgScore);

      const dayIdx = dayNames.indexOf(dayName);
      if (dayIdx === -1) continue;

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
        grade, score: avgScore, summary, color,
      });
    }

    // Sort by days from now
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
        todayPeriods,
        source: "NWS Coastal Waters Forecast PZZ740",
        source_url: "https://www.ndbc.noaa.gov/data/Forecasts/FZUS56.KSGX.html",
        periods_parsed: periods.length,
        updated: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Forecast failed", days: [] },
      { status: 500 }
    );
  }
}
