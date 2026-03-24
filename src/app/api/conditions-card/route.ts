import { NextResponse } from "next/server";
import { getMoonPhase } from "@/lib/moon";

interface ConditionsData {
  waveHeight?: string;
  wavePeriod?: string;
  windSpeed?: string;
  windDir?: string;
  windGust?: string;
  waterTemp?: number;
}

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
    if (wvht) data.waveHeight = (parseFloat(wvht) * 3.281).toFixed(1) + "ft";
    const dpd = get("DPD");
    if (dpd) data.wavePeriod = parseFloat(dpd).toFixed(0) + "s";
    const wtmp = get("WTMP");
    if (wtmp) data.waterTemp = Math.round(parseFloat(wtmp) * 9 / 5 + 32);
  } catch {}
  return data;
}

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

function getGrade(data: ConditionsData): { grade: string; summary: string; color: string } {
  let score = 50;
  if (data.waveHeight) {
    const h = parseFloat(data.waveHeight);
    if (h <= 1) score += 20; else if (h <= 2) score += 12; else if (h <= 3) score += 0; else if (h <= 5) score -= 15; else score -= 25;
  }
  if (data.windSpeed) {
    const w = parseFloat(data.windSpeed);
    if (w <= 3) score += 15; else if (w <= 7) score += 8; else if (w <= 12) score -= 5; else score -= 15;
  }
  if (data.waterTemp) { if (data.waterTemp >= 65) score += 5; else if (data.waterTemp < 58) score -= 5; }
  score = Math.max(0, Math.min(100, score));

  if (score >= 85) return { grade: "A", summary: "Epic conditions", color: "#3db8a4" };
  if (score >= 75) return { grade: "B+", summary: "Very good conditions", color: "#3db8a4" };
  if (score >= 65) return { grade: "B", summary: "Good conditions", color: "#1B6B6B" };
  if (score >= 55) return { grade: "C+", summary: "Fair conditions", color: "#D4A574" };
  if (score >= 40) return { grade: "C", summary: "Below average", color: "#C75B3A" };
  return { grade: "D", summary: "Poor conditions", color: "#C75B3A" };
}

export async function GET() {
  const [buoy, wind] = await Promise.all([fetchBuoyDirect(), fetchWindDirect()]);
  const data: ConditionsData = { ...buoy, ...wind };
  const { grade, summary, color } = getGrade(data);
  const moon = getMoonPhase(new Date());

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0B1D2C"/>
      <stop offset="50%" stop-color="#163B4E"/>
      <stop offset="100%" stop-color="#0B1D2C"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feBlend in="SourceGraphic" mode="multiply"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bg)"/>

  <!-- Top label -->
  <text x="540" y="280" text-anchor="middle" fill="rgba(61,184,164,0.5)" font-family="system-ui, sans-serif" font-size="24" letter-spacing="6" font-weight="500">LA JOLLA DIVE CONDITIONS</text>

  <!-- Date -->
  <text x="540" y="340" text-anchor="middle" fill="rgba(250,243,236,0.4)" font-family="system-ui, sans-serif" font-size="32">${dateStr}</text>

  <!-- Grade circle -->
  <circle cx="540" cy="560" r="140" fill="none" stroke="${color}" stroke-width="4" opacity="0.3"/>
  <circle cx="540" cy="560" r="120" fill="none" stroke="${color}" stroke-width="2" opacity="0.15"/>
  <text x="540" y="590" text-anchor="middle" fill="${color}" font-family="Georgia, serif" font-size="140" font-weight="400">${grade}</text>

  <!-- Summary -->
  <text x="540" y="750" text-anchor="middle" fill="rgba(250,243,236,0.6)" font-family="system-ui, sans-serif" font-size="36">${summary}</text>

  <!-- Divider -->
  <line x1="390" y1="820" x2="690" y2="820" stroke="rgba(61,184,164,0.15)" stroke-width="1"/>

  <!-- Stats grid -->
  <!-- Swell -->
  <text x="320" y="920" text-anchor="end" fill="rgba(250,243,236,0.35)" font-family="system-ui, sans-serif" font-size="28">Swell</text>
  <text x="760" y="920" text-anchor="end" fill="rgba(250,243,236,0.8)" font-family="system-ui, sans-serif" font-size="32" font-weight="500">${data.waveHeight || "—"} @ ${data.wavePeriod || "—"}</text>

  <!-- Wind -->
  <text x="320" y="1000" text-anchor="end" fill="rgba(250,243,236,0.35)" font-family="system-ui, sans-serif" font-size="28">Wind</text>
  <text x="760" y="1000" text-anchor="end" fill="rgba(250,243,236,0.8)" font-family="system-ui, sans-serif" font-size="32" font-weight="500">${data.windSpeed || "—"} ${data.windDir || ""}</text>

  <!-- Gust -->
  <text x="320" y="1080" text-anchor="end" fill="rgba(250,243,236,0.35)" font-family="system-ui, sans-serif" font-size="28">Gust</text>
  <text x="760" y="1080" text-anchor="end" fill="rgba(250,243,236,0.8)" font-family="system-ui, sans-serif" font-size="32" font-weight="500">${data.windGust || "—"}</text>

  <!-- Water Temp -->
  <text x="320" y="1160" text-anchor="end" fill="rgba(250,243,236,0.35)" font-family="system-ui, sans-serif" font-size="28">Water</text>
  <text x="760" y="1160" text-anchor="end" fill="rgba(250,243,236,0.8)" font-family="system-ui, sans-serif" font-size="32" font-weight="500">${data.waterTemp ? data.waterTemp + "°F" : "—"}</text>

  <!-- Moon -->
  <text x="320" y="1240" text-anchor="end" fill="rgba(250,243,236,0.35)" font-family="system-ui, sans-serif" font-size="28">Moon</text>
  <text x="760" y="1240" text-anchor="end" fill="rgba(250,243,236,0.8)" font-family="system-ui, sans-serif" font-size="32" font-weight="500">${moon.emoji} ${moon.phase} (${moon.illumination}%)</text>

  <!-- Divider -->
  <line x1="390" y1="1320" x2="690" y2="1320" stroke="rgba(61,184,164,0.15)" stroke-width="1"/>

  <!-- Saturday banner -->
  <rect x="240" y="1380" width="600" height="80" rx="40" fill="rgba(61,184,164,0.12)" stroke="rgba(61,184,164,0.2)" stroke-width="1"/>
  <text x="540" y="1430" text-anchor="middle" fill="#3db8a4" font-family="system-ui, sans-serif" font-size="26" font-weight="500">Every Saturday · La Jolla Shores</text>

  <!-- CTA -->
  <text x="540" y="1540" text-anchor="middle" fill="rgba(250,243,236,0.25)" font-family="system-ui, sans-serif" font-size="24">lajollafreediveclub.com/conditions</text>

  <!-- Footer -->
  <text x="540" y="1700" text-anchor="middle" fill="rgba(250,243,236,0.15)" font-family="system-ui, sans-serif" font-size="22">La Jolla Freedive Club</text>
  <text x="540" y="1740" text-anchor="middle" fill="rgba(250,243,236,0.1)" font-family="system-ui, sans-serif" font-size="20">@lajollafreedive · Updated ${timeStr}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=600",
    },
  });
}
