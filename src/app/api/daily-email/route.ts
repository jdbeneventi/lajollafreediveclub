import { NextResponse } from "next/server";
import { getMoonPhase } from "@/lib/moon";
import { getTopEvents, isGrunionNight } from "@/lib/seasonal";

// Kit (ConvertKit) API
const KIT_API_SECRET = process.env.KIT_API_SECRET;

// Cron secret to prevent unauthorized triggers
const CRON_SECRET = process.env.CRON_SECRET;

interface ConditionsData {
  waveHeight?: string;
  wavePeriod?: string;
  windSpeed?: string;
  windDir?: string;
  waterTemp?: number;
  visibility?: { low: number; high: number; grade: string };
  overallGrade?: string;
  overallScore?: number;
}

async function fetchConditions(baseUrl: string): Promise<ConditionsData> {
  const data: ConditionsData = {};

  try {
    // Buoy data
    const buoyRes = await fetch(`${baseUrl}/api/conditions`);
    if (buoyRes.ok) {
      const xml = await buoyRes.text();
      const extract = (label: string) => {
        const re = new RegExp(`<strong>${label}:</strong>\\s*([^<]+)`, "i");
        const descs = xml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/g);
        if (!descs || descs.length < 2) return undefined;
        const m = descs[1].match(re);
        return m ? m[1].trim() : undefined;
      };
      data.waveHeight = extract("Significant Wave Height");
      data.wavePeriod = extract("Dominant Wave Period");
      data.windSpeed = extract("Wind Speed");
      data.windDir = extract("Wind Direction");
    }
  } catch {}

  try {
    // Water temp
    const tempRes = await fetch(`${baseUrl}/api/watertemp`);
    if (tempRes.ok) {
      const tempData = await tempRes.json();
      if (tempData.water_temp) {
        const num = parseFloat(tempData.water_temp);
        data.waterTemp = !isNaN(num) ? (num < 40 ? Math.round(num * 9/5 + 32) : Math.round(num)) : undefined;
      }
    }
  } catch {}

  try {
    // Visibility
    const visRes = await fetch(`${baseUrl}/api/visibility`);
    if (visRes.ok) {
      const visData = await visRes.json();
      if (visData.visibility_ft_low !== null) {
        data.visibility = {
          low: visData.visibility_ft_low,
          high: visData.visibility_ft_high,
          grade: visData.grade,
        };
      }
    }
  } catch {}

  return data;
}

function getOverallGrade(data: ConditionsData): { grade: string; score: number; summary: string } {
  // Simplified scoring for email
  let score = 50; // baseline

  if (data.waveHeight) {
    const h = parseFloat(data.waveHeight);
    if (h <= 1) score += 20;
    else if (h <= 2) score += 12;
    else if (h <= 3) score += 0;
    else if (h <= 5) score -= 15;
    else score -= 25;
  }

  if (data.windSpeed) {
    const w = parseFloat(data.windSpeed);
    if (w <= 3) score += 15;
    else if (w <= 7) score += 8;
    else if (w <= 12) score -= 5;
    else score -= 15;
  }

  if (data.visibility) {
    const avg = (data.visibility.low + data.visibility.high) / 2;
    if (avg >= 25) score += 15;
    else if (avg >= 15) score += 8;
    else if (avg >= 10) score += 0;
    else score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  let grade: string, summary: string;
  if (score >= 85) { grade = "A"; summary = "Epic conditions — get in the water."; }
  else if (score >= 75) { grade = "B+"; summary = "Very good conditions. Great day for a dive."; }
  else if (score >= 65) { grade = "B"; summary = "Good conditions. Solid diving at protected spots."; }
  else if (score >= 55) { grade = "C+"; summary = "Fair conditions. Pick your spot carefully."; }
  else if (score >= 40) { grade = "C"; summary = "Below average. Consider a pool session."; }
  else { grade = "D"; summary = "Poor conditions. Dry training day."; }

  return { grade, score, summary };
}

function buildEmailHtml(
  conditions: ConditionsData,
  grade: { grade: string; score: number; summary: string },
  moon: ReturnType<typeof getMoonPhase>,
  events: ReturnType<typeof getTopEvents>,
  grunion: boolean,
  tideNote: string,
): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const eventsHtml = events.slice(0, 4).map(e =>
    `<tr><td style="padding:4px 8px 4px 0;font-size:13px;">${e.icon}</td><td style="padding:4px 0;font-size:13px;color:#2a2a2a;">${e.title}</td></tr>`
  ).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF3EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 20px;">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:24px;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">La Jolla Freedive Club</div>
    <div style="font-size:14px;color:#5a6a7a;">${dateStr}</div>
  </div>

  <!-- Grade Card -->
  <div style="background:white;border-radius:16px;padding:24px;text-align:center;margin-bottom:16px;">
    <div style="font-size:48px;font-weight:bold;color:#1B6B6B;margin-bottom:8px;">${grade.grade}</div>
    <div style="font-size:16px;color:#0B1D2C;font-weight:600;margin-bottom:4px;">${grade.summary}</div>
    <div style="font-size:12px;color:#5a6a7a;">Score: ${grade.score}/100</div>
  </div>

  <!-- Quick Stats -->
  <div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Swell</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${conditions.waveHeight || "—"} @ ${conditions.wavePeriod || "—"}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Wind</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${conditions.windSpeed || "—"} ${conditions.windDir || ""}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Water temp</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${conditions.waterTemp ? conditions.waterTemp + "°F" : "—"}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Visibility</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${conditions.visibility ? conditions.visibility.low + "–" + conditions.visibility.high + "ft" : "—"}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Moon</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${moon.emoji} ${moon.phase} · ${moon.illumination}%</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Tides</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${tideNote}${moon.isSpringTide ? " · Spring tide" : ""}${moon.isNeapTide ? " · Neap tide" : ""}</td>
      </tr>
    </table>
  </div>

  ${grunion ? `
  <!-- Grunion Alert -->
  <div style="background:#D4A574;border-radius:16px;padding:16px 20px;margin-bottom:16px;color:white;">
    <strong>🐟 Grunion run tonight</strong> — check La Jolla Shores beach 1-3 hours after high tide.
  </div>
  ` : ""}

  <!-- What's in the Water -->
  <div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">What's in the water</div>
    <table style="width:100%;border-collapse:collapse;">
      ${eventsHtml}
    </table>
  </div>

  <!-- CTA -->
  <div style="text-align:center;margin-bottom:24px;">
    <a href="https://lajollafreediveclub.com/conditions" style="display:inline-block;background:#C75B3A;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">
      Full conditions →
    </a>
  </div>

  <!-- Footer -->
  <div style="text-align:center;font-size:11px;color:#5a6a7a;line-height:1.6;">
    <a href="https://lajollafreediveclub.com" style="color:#1B6B6B;text-decoration:none;">lajollafreediveclub.com</a><br>
    La Jolla Freedive Club · San Diego, CA<br>
    <a href="{{ unsubscribe_url }}" style="color:#5a6a7a;">Unsubscribe</a>
  </div>

</div>
</body>
</html>`;
}

export async function GET(request: Request) {
  // Verify cron secret
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (CRON_SECRET && secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Determine base URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://lajollafreediveclub.com";

    // Fetch all data
    const conditions = await fetchConditions(baseUrl);
    const grade = getOverallGrade(conditions);
    const moon = getMoonPhase();
    const events = getTopEvents(new Date(), 4);
    const grunion = isGrunionNight(new Date(), moon.age);

    // Get tide info
    let tideNote = "Check tides page";
    try {
      const tideRes = await fetch(`${baseUrl}/api/tides?days=1`);
      if (tideRes.ok) {
        const tideData = await tideRes.json();
        if (tideData.days && tideData.days[0]) {
          const day = tideData.days[0];
          if (day.bestDiveWindows && day.bestDiveWindows.length > 0) {
            tideNote = `Best window: ${day.bestDiveWindows[0]}`;
          }
        }
      }
    } catch {}

    const html = buildEmailHtml(conditions, grade, moon, events, grunion, tideNote);

    // If Kit API keys are configured, send the broadcast
    if (KIT_API_SECRET) {
      try {
        const now = new Date();
        const dateStr = now.toLocaleDateString("en-US", {
          timeZone: "America/Los_Angeles",
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        // Create and send broadcast via Kit API v3
        const broadcastRes = await fetch("https://api.convertkit.com/v3/broadcasts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_secret: KIT_API_SECRET,
            subject: `${grade.grade} — La Jolla Dive Conditions · ${dateStr}`,
            content: html,
            published: true,
          }),
        });

        if (!broadcastRes.ok) {
          const err = await broadcastRes.text();
          return NextResponse.json({
            status: "error",
            message: "Failed to create Kit broadcast",
            detail: err,
            grade: grade.grade,
            preview: true,
          }, { status: 502 });
        }

        const broadcast = await broadcastRes.json();
        return NextResponse.json({
          status: "sent",
          broadcast_id: broadcast.broadcast?.id,
          grade: grade.grade,
          score: grade.score,
          summary: grade.summary,
        });
      } catch (err) {
        return NextResponse.json({
          status: "error",
          message: err instanceof Error ? err.message : "Kit API error",
          grade: grade.grade,
        }, { status: 500 });
      }
    }

    // No Kit keys — return preview
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });

  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to generate email",
    }, { status: 500 });
  }
}
