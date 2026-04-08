import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getMoonPhase } from "@/lib/moon";
import { getTopEvents, isGrunionNight } from "@/lib/seasonal";
import { getLocalIntel, LocalAlert } from "@/lib/local-intel";

const KIT_API_SECRET = process.env.KIT_API_SECRET;
const KIT_API_KEY = process.env.KIT_API_KEY;
const DAILY_CONDITIONS_TAG_ID = 17696327;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

interface ConditionsData {
  waveHeight?: string;
  wavePeriod?: string;
  windSpeed?: string;
  windDir?: string;
  windGust?: string;
  waterTemp?: number;
}

interface VisData {
  visibility_ft_low: number | null;
  visibility_ft_high: number | null;
  grade: string;
  summary: string;
}

// ─── Fetch directly from NDBC 46254 realtime text file ───
async function fetchBuoyDirect(): Promise<Partial<ConditionsData>> {
  const data: Partial<ConditionsData> = {};
  try {
    const res = await fetch("https://www.ndbc.noaa.gov/data/realtime2/46254.txt", {
      headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
    });
    if (!res.ok) return data;
    const text = await res.text();
    const lines = text.split("\n");
    if (lines.length < 3) return data;

    const headers = lines[0].trim().split(/\s+/);
    const values = lines[2].trim().split(/\s+/);

    const get = (col: string) => {
      const idx = headers.indexOf(col);
      if (idx === -1) return undefined;
      const val = values[idx];
      return val === "MM" || val === "99.00" || val === "999" || val === "9999.0" ? undefined : val;
    };

    const wvht = get("WVHT");
    if (wvht) {
      const meters = parseFloat(wvht);
      data.waveHeight = (meters * 3.281).toFixed(1) + "ft";
    }
    const dpd = get("DPD");
    if (dpd) data.wavePeriod = parseFloat(dpd).toFixed(0) + "s";

    const wtmp = get("WTMP");
    if (wtmp) {
      const c = parseFloat(wtmp);
      data.waterTemp = Math.round(c * 9 / 5 + 32);
    }
  } catch {}
  return data;
}

// ─── Fetch wind from LJPC1 RSS (with LJAC1 fallback) ───
async function fetchWindDirect(): Promise<Partial<ConditionsData>> {
  const data: Partial<ConditionsData> = {};

  const tryRSS = async (url: string) => {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) return false;
      const xml = await res.text();

      const extract = (label: string) => {
        const re = new RegExp(`<strong>${label}:</strong>\\s*([^<]+)`, "i");
        const descs = xml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/g);
        if (!descs || descs.length < 2) return undefined;
        const m = descs[1].match(re);
        return m ? m[1].trim() : undefined;
      };

      data.windSpeed = extract("Wind Speed");
      data.windDir = extract("Wind Direction");
      data.windGust = extract("Wind Gust");
      return !!data.windSpeed;
    } catch { return false; }
  };

  // Try LJPC1 first, fall back to LJAC1
  const gotData = await tryRSS("https://www.ndbc.noaa.gov/data/latest_obs/ljpc1.rss");
  if (!gotData) await tryRSS("https://www.ndbc.noaa.gov/data/latest_obs/ljac1.rss");

  return data;
}

// ─── Water temp fallback chain ───
const SEASONAL_TEMPS: Record<number, number> = {
  0: 58, 1: 58, 2: 59, 3: 60, 4: 62, 5: 64,
  6: 67, 7: 69, 8: 70, 9: 67, 10: 63, 11: 59,
};

async function fetchWaterTempFallback(): Promise<number | null> {
  // Try seatemperature.net as fallback
  try {
    const res = await fetch(
      "https://seatemperature.net/current/united-states/san-diego-california-united-states-sea-temperature",
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; LaJollaFreediveClub/1.0)" }, signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/Current Water Temperature[\s\S]{0,300}?([\d]+\.[\d]+)\s*°C/i);
    if (m) {
      const c = parseFloat(m[1]);
      if (!isNaN(c) && c > 5 && c < 35) return Math.round(c * 9 / 5 + 32);
    }
  } catch {}
  // Last resort: seasonal average
  return SEASONAL_TEMPS[new Date().getMonth()] || 63;
}

// ─── Fetch tide predictions from NOAA ───
async function fetchTideData(): Promise<{ note: string; state: string }> {
  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
    const res = await fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr.replace(/-/g, "")}&range=24&station=9410230&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&format=json`
    );
    if (!res.ok) return { note: "Check tides page", state: "unknown" };
    const data = await res.json();
    if (!data.predictions || data.predictions.length === 0) return { note: "Check tides page", state: "unknown" };

    // Determine current tide state
    const nowHour = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", hour12: false });
    const currentHour = parseInt(nowHour);
    let tideState = "unknown";

    for (let i = 0; i < data.predictions.length - 1; i++) {
      const thisTime = parseInt(data.predictions[i].t.split(" ")[1].split(":")[0]);
      const nextTime = parseInt(data.predictions[i + 1].t.split(" ")[1].split(":")[0]);
      if (currentHour >= thisTime && currentHour < nextTime) {
        tideState = data.predictions[i].type === "L" ? "incoming" : "outgoing";
        break;
      }
    }

    const lows = data.predictions
      .filter((p: { type: string }) => p.type === "L")
      .map((p: { t: string; v: string }) => {
        const time = p.t.split(" ")[1];
        const [h, m] = time.split(":").map(Number);
        const startH = (h + 1) % 24;
        const endH = (h + 3) % 24;
        const fmt = (hr: number) => {
          const ampm = hr >= 12 ? "PM" : "AM";
          const h12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
          return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
        };
        return `${fmt(startH)}–${fmt(endH)}`;
      });

    return {
      note: lows.length > 0 ? `Best window: ${lows[0]}` : "Check tides page",
      state: tideState,
    };
  } catch {
    return { note: "Check tides page", state: "unknown" };
  }
}

// ─── Check for recent rain / water quality ───
// Returns: "none" | "advisory" | "closure"
// Only triggers if La Jolla area is specifically mentioned,
// or if there are widespread closures (5+) suggesting a major event
async function checkWaterQuality(): Promise<"none" | "advisory" | "closure"> {
  try {
    const res = await fetch("https://www.sdbeachinfo.com/", {
      headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
    });
    if (!res.ok) return "none";
    const html = await res.text();

    // Check for La Jolla specific mentions near advisory/closure context
    const hasLaJollaIssue = /la jolla.*(?:advisory|closure|warning)|(?:advisory|closure|warning).*la jolla/i.test(html);

    // Check county-wide numbers
    const cm = html.match(/Closures\s*\((\d+)\)/i);
    const cc = cm ? parseInt(cm[1]) : 0;

    // La Jolla specifically flagged → closure
    if (hasLaJollaIssue) return "closure";

    // Widespread closures (5+) suggest a major rain event affecting the whole coast
    if (cc >= 5) return "closure";

    // Some closures but not widespread — advisory level, don't hard-fail
    if (cc > 0) return "advisory";

    return "none";
  } catch {
    return "none";
  }
}

// ─── Predictive visibility (same as ConditionsWidget) ───
function predictVisibility(conditions: ConditionsData, tideState: string): { low: number; high: number } {
  let baseVis = 14;

  const ht = conditions.waveHeight ? parseFloat(conditions.waveHeight) : 0;
  if (ht <= 1) baseVis += 5;
  else if (ht <= 2) baseVis += 2;
  else if (ht <= 3) baseVis -= 2;
  else if (ht <= 5) baseVis -= 5;
  else baseVis -= 8;

  const pd = conditions.wavePeriod ? parseFloat(conditions.wavePeriod) : 8;
  if (pd >= 14) baseVis += 3;
  else if (pd >= 10) baseVis += 1;
  else if (pd < 6) baseVis -= 3;

  const ws = parseFloat(conditions.windSpeed || "0");
  const wd = conditions.windDir || "";
  if (ws <= 5) baseVis += 2;
  else if (ws > 12) baseVis -= 3;
  if (wd.includes("E") && !wd.includes("SE") && ws > 3) baseVis += 2;
  if (wd.includes("W") && ws > 8) baseVis -= 2;

  if (tideState === "incoming") baseVis += 2;
  else if (tideState === "outgoing") baseVis -= 1;

  if (conditions.waterTemp) {
    if (conditions.waterTemp >= 68) baseVis += 2;
    else if (conditions.waterTemp <= 57) baseVis += 1;
  }

  const month = new Date().getMonth();
  if (month >= 7 && month <= 9) baseVis += 3;
  else if (month >= 0 && month <= 2) baseVis -= 2;

  baseVis = Math.max(4, Math.min(35, baseVis));
  return { low: Math.max(3, baseVis - 3), high: baseVis + 3 };
}

// ─── Weighted scoring (matches ConditionsWidget exactly) ───
function scoreConditions(
  conditions: ConditionsData,
  vis: VisData | null,
  tideState: string,
  waterQuality: "none" | "advisory" | "closure",
): { grade: string; score: number; summary: string; visLabel: string } {

  // Water quality no longer overrides the score — it's a notice, not a grade killer

  // Visibility score (weight: 30)
  let visScore: number;
  let visLabel: string;
  if (vis && vis.visibility_ft_low !== null) {
    const avg = ((vis.visibility_ft_low || 0) + (vis.visibility_ft_high || 0)) / 2;
    if (avg >= 25) { visScore = 95; visLabel = `${vis.visibility_ft_low}–${vis.visibility_ft_high}ft · Exceptional`; }
    else if (avg >= 20) { visScore = 85; visLabel = `${vis.visibility_ft_low}–${vis.visibility_ft_high}ft · Excellent`; }
    else if (avg >= 15) { visScore = 70; visLabel = `${vis.visibility_ft_low}–${vis.visibility_ft_high}ft · Good`; }
    else if (avg >= 10) { visScore = 55; visLabel = `${vis.visibility_ft_low}–${vis.visibility_ft_high}ft · Fair`; }
    else if (avg >= 6) { visScore = 35; visLabel = `${vis.visibility_ft_low}–${vis.visibility_ft_high}ft · Poor`; }
    else { visScore = 15; visLabel = `${vis.visibility_ft_low}–${vis.visibility_ft_high}ft · Very poor`; }
  } else {
    const pred = predictVisibility(conditions, tideState);
    const avg = (pred.low + pred.high) / 2;
    if (avg >= 25) { visScore = 90; visLabel = `~${pred.low}–${pred.high}ft · Likely excellent`; }
    else if (avg >= 20) { visScore = 80; visLabel = `~${pred.low}–${pred.high}ft · Likely very good`; }
    else if (avg >= 15) { visScore = 65; visLabel = `~${pred.low}–${pred.high}ft · Likely good`; }
    else if (avg >= 10) { visScore = 50; visLabel = `~${pred.low}–${pred.high}ft · Likely fair`; }
    else if (avg >= 6) { visScore = 30; visLabel = `~${pred.low}–${pred.high}ft · Likely poor`; }
    else { visScore = 15; visLabel = `~${pred.low}–${pred.high}ft · Likely very poor`; }
  }

  // Swell score (weight: 25)
  let swellScore = 50;
  if (conditions.waveHeight) {
    const h = parseFloat(conditions.waveHeight);
    const p = conditions.wavePeriod ? parseFloat(conditions.wavePeriod) : 0;
    if (h <= 1 && p >= 10) swellScore = 95;
    else if (h <= 2) swellScore = 80;
    else if (h <= 3) swellScore = 60;
    else if (h <= 5) swellScore = 35;
    else swellScore = 15;
    if (p >= 12) swellScore = Math.min(100, swellScore + 10);
    else if (p < 6) swellScore = Math.max(0, swellScore - 15);
  }

  // Wind score (weight: 20)
  let windScore = 50;
  if (conditions.windSpeed) {
    const w = parseFloat(conditions.windSpeed);
    const dir = conditions.windDir || "";
    if (w <= 3) windScore = 95;
    else if (w <= 7) windScore = 75;
    else if (w <= 12) windScore = 50;
    else if (w <= 18) windScore = 25;
    else windScore = 10;
    if (dir.includes("E") && !dir.includes("SE")) windScore = Math.min(100, windScore + 10);
    if (dir.includes("W") && w > 8) windScore = Math.max(0, windScore - 10);
  }

  // Temp score (weight: 10)
  let tempScore = 60;
  if (conditions.waterTemp) {
    const t = conditions.waterTemp;
    if (t >= 72) tempScore = 90;
    else if (t >= 68) tempScore = 80;
    else if (t >= 63) tempScore = 65;
    else if (t >= 58) tempScore = 40;
    else tempScore = 20;
  }

  // Safety score (weight: 15) — water quality reduces but never overrides
  const safetyScore = waterQuality === "closure" ? 20 : waterQuality === "advisory" ? 50 : 90;

  // Weighted average
  const weighted =
    (visScore * 30 + swellScore * 25 + windScore * 20 + tempScore * 10 + safetyScore * 15) / 100;

  let grade: string, summary: string;
  if (weighted >= 88) { grade = "A"; summary = "Epic conditions. This is what you wait for — get in the water."; }
  else if (weighted >= 78) { grade = "B+"; summary = "Very good conditions. Great day for a dive."; }
  else if (weighted >= 68) { grade = "B"; summary = "Good conditions. Solid diving at protected spots."; }
  else if (weighted >= 58) { grade = "C+"; summary = "Fair conditions. Diveable but pick your spot."; }
  else if (weighted >= 45) { grade = "C"; summary = "Below average. Consider a pool session."; }
  else if (weighted >= 30) { grade = "D"; summary = "Poor conditions. Dry training day."; }
  else { grade = "F"; summary = "Not recommended today."; }

  return { grade, score: Math.round(weighted), summary, visLabel };
}

// ─── Email HTML ───
interface WaterQualityEmail {
  hasAlert: boolean;
  alertText: string;
  color: string;
}

function buildEmailHtml(
  conditions: ConditionsData,
  grade: { grade: string; score: number; summary: string; visLabel: string },
  moon: ReturnType<typeof getMoonPhase>,
  events: ReturnType<typeof getTopEvents>,
  grunion: boolean,
  tideNote: string,
  waterQuality?: WaterQualityEmail,
  localAlerts?: LocalAlert[],
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

  const linkStyle = 'style="display:inline-block;padding:6px 14px;background:#FAF3EC;border-radius:20px;color:#1B6B6B;text-decoration:none;font-size:11px;font-weight:600;margin:3px;"';

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
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Visibility</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${grade.visLabel}</td>
      </tr>
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
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Moon</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${moon.emoji} ${moon.phase} · ${moon.illumination}%</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Tides</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${tideNote}${moon.isSpringTide ? " · Spring tide" : ""}${moon.isNeapTide ? " · Neap tide" : ""}</td>
      </tr>
    </table>
  </div>

  ${waterQuality?.hasAlert ? `
  <!-- Water Quality Alert -->
  <div style="background:${waterQuality.color};border-radius:16px;padding:14px 20px;margin-bottom:16px;color:white;font-size:13px;">
    <strong>⚠️ Water Quality Alert</strong> — ${waterQuality.alertText}
    <a href="https://www.sdbeachinfo.com/" style="color:white;margin-left:4px;">Details →</a>
  </div>
  ` : ""}

  ${localAlerts && localAlerts.length > 0 ? `
  <!-- Local Intel -->
  <div style="background:white;border-radius:16px;padding:16px 20px;margin-bottom:16px;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">Local Intel</div>
    ${localAlerts.map((a) => {
      const bgColor = a.severity === "critical" ? "#C75B3A" : a.severity === "warning" ? "#D4A574" : "#f5f5f5";
      const textColor = a.severity === "info" ? "#2a2a2a" : "white";
      const icons: Record<string, string> = { road: "🚧", parking: "🅿️", water_quality: "🟡", weather: "🌊", event: "🎪", wildlife: "🦈", safety: "⚠️" };
      const icon = icons[a.category] || "📌";
      return `<div style="background:${bgColor};color:${textColor};border-radius:8px;padding:10px 14px;margin-bottom:6px;font-size:12px;">
        ${icon} <strong>${a.title}</strong><br><span style="opacity:0.8;">${a.summary}</span>
      </div>`;
    }).join("")}
  </div>
  ` : ""}

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

  <!-- Quick Links -->
  <div style="background:white;border-radius:16px;padding:16px 20px;margin-bottom:16px;text-align:center;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">Quick links</div>
    <div>
      <a href="https://coollab.ucsd.edu/pierviz/" ${linkStyle}>Underwater cam</a>
      <a href="https://scripps.ucsd.edu/piercam" ${linkStyle}>Surface cam</a>
      <a href="https://lajollafreediveclub.com/tides" ${linkStyle}>Tide chart</a>
      <a href="https://www.ndbc.noaa.gov/station_page.php?station=46254" ${linkStyle}>Buoy data</a>
      <a href="https://lajollafreediveclub.com/map" ${linkStyle}>Field guide</a>
      <a href="https://lajollafreediveclub.com/gear" ${linkStyle}>Gear guide</a>
      <a href="https://kelpwatch.org" ${linkStyle}>Kelp satellite</a>
    </div>
  </div>

  <!-- CTA -->
  <div style="text-align:center;margin-bottom:24px;">
    <a href="https://lajollafreediveclub.com/conditions" style="display:inline-block;background:#C75B3A;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">
      Full conditions dashboard →
    </a>
  </div>

  <!-- Support -->
  <div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;text-align:center;">
    <div style="font-size:13px;color:#0B1D2C;font-weight:600;margin-bottom:6px;">Enjoying the daily report?</div>
    <div style="font-size:12px;color:#5a6a7a;margin-bottom:12px;line-height:1.6;">This tool is free and always will be. If it helps you plan your dives, consider supporting the project.</div>
    <a href="https://buymeacoffee.com/lajollafreediveclub" style="display:inline-block;background:#1B6B6B;color:white;padding:8px 20px;border-radius:50px;text-decoration:none;font-weight:600;font-size:12px;">Support LJFC ☕</a>
    <div style="margin-top:10px;">
      <a href="mailto:joshuabeneventi@gmail.com?subject=Daily%20Conditions%20Feedback" style="font-size:11px;color:#5a6a7a;text-decoration:underline;">Send feedback or suggestions</a>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;font-size:11px;color:#5a6a7a;line-height:1.8;">
    <a href="https://lajollafreediveclub.com" style="color:#1B6B6B;text-decoration:none;">lajollafreediveclub.com</a><br>
    La Jolla Freedive Club · San Diego, CA<br>
    AIDA Certified · DAN Insured<br>
    <a href="{{ unsubscribe_url }}" style="color:#5a6a7a;">Unsubscribe</a>
  </div>

</div>
</body>
</html>`;
}

// ─── Handler ───
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const preview = searchParams.get("preview") === "true";
  const testMode = searchParams.get("test") === "true";

  const validSecret = secret === "ljfc" || (process.env.CRON_SECRET && secret === process.env.CRON_SECRET);
  if (!validSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [buoyData, windData, tideData, waterQuality, localIntel] = await Promise.all([
      fetchBuoyDirect().catch(() => ({})),
      fetchWindDirect().catch(() => ({})),
      fetchTideData().catch(() => ({ note: "Check tides page", state: "unknown" })),
      checkWaterQuality().catch(() => "none" as const),
      getLocalIntel().catch(() => null),
    ]);

    const conditions: ConditionsData = {
      ...buoyData,
      ...windData,
    };

    // Water temp fallback: if buoy didn't return temp, try other sources
    if (!conditions.waterTemp) {
      conditions.waterTemp = await fetchWaterTempFallback().catch(() => null) || undefined;
    }

    // No self-call to /api/visibility — use predictive model only
    // This avoids Vercel function-to-function timeout issues
    const grade = scoreConditions(conditions, null, tideData.state, waterQuality);
    const moon = getMoonPhase();
    const events = getTopEvents(new Date(), 4);
    const grunion = isGrunionNight(new Date(), moon.age);

    // Water quality alert for email display
    let waterQualityAlert: WaterQualityEmail | undefined;
    if (waterQuality === "closure") {
      waterQualityAlert = {
        hasAlert: true,
        alertText: "Water quality closure affecting La Jolla area. Avoid ocean contact until cleared.",
        color: "#C75B3A",
      };
    } else if (waterQuality === "advisory") {
      waterQualityAlert = {
        hasAlert: true,
        alertText: "Water quality advisories active in San Diego County. Check sdbeachinfo.com for La Jolla status.",
        color: "#D4A574",
      };
    }

    const html = buildEmailHtml(conditions, grade, moon, events, grunion, tideData.note, waterQualityAlert, localIntel?.alerts);

    // Preview mode
    if (preview) {
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Test mode — send via Resend to Joshua only
    if (testMode) {
      if (!RESEND_API_KEY) {
        return NextResponse.json({ status: "error", message: "RESEND_API_KEY not configured" }, { status: 500 });
      }
      const resend = new Resend(RESEND_API_KEY);
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric" });
      const { error } = await resend.emails.send({
        from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
        to: [OWNER_EMAIL],
        subject: `[TEST] ${grade.grade} — La Jolla Dive Conditions · ${dateStr}`,
        html,
      });
      return NextResponse.json({
        status: error ? "error" : "sent_to_owner",
        error: error?.message,
        grade: grade.grade,
        score: grade.score,
        summary: grade.summary,
        visibility: grade.visLabel,
      });
    }

    // Send via Kit V4 broadcast API with tag targeting
    const dateStr = new Date().toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric" });
    if (KIT_API_KEY) {
      const createRes = await fetch("https://api.kit.com/v4/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Kit-Api-Key": KIT_API_KEY },
        body: JSON.stringify({
          subject: `${grade.grade} — La Jolla Dive Conditions · ${dateStr}`,
          content: html,
          description: `Daily conditions email — ${dateStr}`,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.text();
        return NextResponse.json({ status: "error", message: "Failed to create Kit broadcast (v4)", detail: err }, { status: 502 });
      }

      const createData = await createRes.json();
      const broadcastId = createData.broadcast?.id;

      if (!broadcastId) {
        return NextResponse.json({ status: "error", message: "No broadcast ID returned", detail: JSON.stringify(createData) }, { status: 502 });
      }

      const filterRes = await fetch(`https://api.kit.com/v4/broadcasts/${broadcastId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Kit-Api-Key": KIT_API_KEY },
        body: JSON.stringify({
          subscriber_filter: [{ all: [{ type: "tag", ids: [DAILY_CONDITIONS_TAG_ID] }] }],
        }),
      });

      if (!filterRes.ok) {
        const err = await filterRes.text();
        return NextResponse.json({ status: "error", message: "Failed to set tag filter", broadcast_id: broadcastId, detail: err }, { status: 502 });
      }

      const sendAt = new Date(Date.now() + 60_000).toISOString();
      const updateRes = await fetch(`https://api.kit.com/v4/broadcasts/${broadcastId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Kit-Api-Key": KIT_API_KEY },
        body: JSON.stringify({
          public: true,
          send_at: sendAt,
        }),
      });

      if (!updateRes.ok) {
        const err = await updateRes.text();
        return NextResponse.json({ status: "error", message: "Broadcast filtered but failed to schedule", broadcast_id: broadcastId, detail: err }, { status: 502 });
      }

      return NextResponse.json({
        status: "scheduled",
        broadcast_id: broadcastId,
        send_at: sendAt,
        tag: "LJFC: Daily Conditions",
        grade: grade.grade,
        score: grade.score,
        summary: grade.summary,
        visibility: grade.visLabel,
        data: { swell: conditions.waveHeight, wind: conditions.windSpeed, temp: conditions.waterTemp },
      });
    }

    // Fallback to V3
    if (KIT_API_SECRET) {
      const createRes = await fetch("https://api.convertkit.com/v3/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_secret: KIT_API_SECRET,
          subject: `${grade.grade} — La Jolla Dive Conditions · ${dateStr}`,
          content: html,
          description: `Daily conditions email — ${dateStr}`,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.text();
        return NextResponse.json({ status: "error", message: "Failed to create Kit broadcast", detail: err }, { status: 502 });
      }

      const createData = await createRes.json();
      const broadcastId = createData.broadcast?.id;

      if (!broadcastId) {
        return NextResponse.json({ status: "error", message: "No broadcast ID returned", detail: JSON.stringify(createData) }, { status: 502 });
      }

      const sendAt = new Date(Date.now() + 60_000).toISOString();
      const updateRes = await fetch(`https://api.convertkit.com/v3/broadcasts/${broadcastId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_secret: KIT_API_SECRET,
          published: true,
          send_at: sendAt,
        }),
      });

      if (!updateRes.ok) {
        const err = await updateRes.text();
        return NextResponse.json({ status: "error", message: "Broadcast created but failed to schedule send", broadcast_id: broadcastId, detail: err }, { status: 502 });
      }

      return NextResponse.json({
        status: "scheduled",
        broadcast_id: broadcastId,
        send_at: sendAt,
        grade: grade.grade,
        score: grade.score,
        summary: grade.summary,
        visibility: grade.visLabel,
        data: { swell: conditions.waveHeight, wind: conditions.windSpeed, temp: conditions.waterTemp },
      });
    }

    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });

  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to generate email",
    }, { status: 500 });
  }
}
