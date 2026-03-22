import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getMoonPhase } from "@/lib/moon";
import { getTopEvents, isGrunionNight } from "@/lib/seasonal";

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

// ─── Fetch wind from LJPC1 RSS ───
async function fetchWindDirect(): Promise<Partial<ConditionsData>> {
  const data: Partial<ConditionsData> = {};
  try {
    const res = await fetch("https://www.ndbc.noaa.gov/data/latest_obs/ljpc1.rss", {
      headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
    });
    if (!res.ok) return data;
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
  } catch {}
  return data;
}

// ─── Fetch tide predictions from NOAA ───
async function fetchTideNote(): Promise<string> {
  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
    const res = await fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr.replace(/-/g, "")}&range=24&station=9410230&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&format=json`
    );
    if (!res.ok) return "Check tides page";
    const data = await res.json();
    if (!data.predictions || data.predictions.length === 0) return "Check tides page";

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

    return lows.length > 0 ? `Best window: ${lows[0]}` : "Check tides page";
  } catch {
    return "Check tides page";
  }
}

// ─── Scoring ───
function getOverallGrade(data: ConditionsData): { grade: string; score: number; summary: string } {
  let score = 50;

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

  if (data.waterTemp) {
    if (data.waterTemp >= 65) score += 5;
    else if (data.waterTemp < 58) score -= 5;
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

// ─── Email HTML ───
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

  // Allow access with the hardcoded secret or the env CRON_SECRET
  const validSecret = secret === "ljfc-daily-2026" || (process.env.CRON_SECRET && secret === process.env.CRON_SECRET);
  if (!validSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [buoyData, windData, tideNote] = await Promise.all([
      fetchBuoyDirect(),
      fetchWindDirect(),
      fetchTideNote(),
    ]);

    const conditions: ConditionsData = {
      ...buoyData,
      ...windData,
    };

    const grade = getOverallGrade(conditions);
    const moon = getMoonPhase();
    const events = getTopEvents(new Date(), 4);
    const grunion = isGrunionNight(new Date(), moon.age);

    const html = buildEmailHtml(conditions, grade, moon, events, grunion, tideNote);

    // Preview mode — just return the HTML
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

      // Step 2: Set tag filter first
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

      // Step 3: Now schedule to send
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
        data: { swell: conditions.waveHeight, wind: conditions.windSpeed, temp: conditions.waterTemp },
      });
    }

    // Fallback to V3 (no tag targeting — warns in response)
    if (KIT_API_SECRET) {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        timeZone: "America/Los_Angeles",
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      // Step 1: Create the broadcast as a draft
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
        return NextResponse.json({
          status: "error",
          message: "Failed to create Kit broadcast",
          detail: err,
        }, { status: 502 });
      }

      const createData = await createRes.json();
      const broadcastId = createData.broadcast?.id;

      if (!broadcastId) {
        return NextResponse.json({
          status: "error",
          message: "No broadcast ID returned",
          detail: JSON.stringify(createData),
        }, { status: 502 });
      }

      // Step 2: Schedule the broadcast to send now
      // Kit v3 requires send_at to actually send — without it, it stays as a draft
      const sendAt = new Date(Date.now() + 60_000).toISOString(); // 1 minute from now

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
        return NextResponse.json({
          status: "error",
          message: "Broadcast created but failed to schedule send",
          broadcast_id: broadcastId,
          detail: err,
        }, { status: 502 });
      }

      return NextResponse.json({
        status: "scheduled",
        broadcast_id: broadcastId,
        send_at: sendAt,
        grade: grade.grade,
        score: grade.score,
        summary: grade.summary,
        data: {
          swell: conditions.waveHeight,
          wind: conditions.windSpeed,
          temp: conditions.waterTemp,
        },
      });
    }

    // No Kit configured — return HTML
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });

  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to generate email",
    }, { status: 500 });
  }
}
