// Shared water-quality truth for the conditions widget, ocean intel, and
// daily email. Everything here is verifiable: observed rainfall from
// Open-Meteo, plus the one advisory the county map itself shows as chronic.
//
// We deliberately do NOT claim per-station advisories or closures. The
// county's live map (sdbeachinfo.com) is an OutSystems app whose data API
// requires per-deploy version tokens, so it can't be read reliably from a
// server — and the old approach (keyword-matching a news page, regexing
// countywide banner counts) invented closures that didn't exist. When we
// can't verify, we link to the county map instead of guessing.

// County DEH practice: a General Rain Advisory follows measurable rain
// (~0.2 inch), warning against ocean contact for 72 hours after rainfall.
const RAIN_ADVISORY_MM = 5.0; // ≈ 0.2 in over the trailing 72 h
const ADVISORY_HOURS = 72;

// La Jolla Shores (Vallecitos station).
const LAT = 32.8555;
const LON = -117.2581;

export interface RainCheck {
  advisory: boolean;
  totalMm: number;
  totalIn: number;
  lastRain: string | null; // ISO hour of the most recent measurable rain
  liftsAt: string | null;  // ISO time the 72 h window ends
}

export async function checkRain72h(): Promise<RainCheck> {
  const none: RainCheck = { advisory: false, totalMm: 0, totalIn: 0, lastRain: null, liftsAt: null };
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&hourly=precipitation&past_days=3&forecast_days=1&timezone=UTC`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000), next: { revalidate: 1800 } });
    if (!res.ok) return none;
    const data = await res.json();
    const times: string[] = data?.hourly?.time || [];
    const precip: number[] = data?.hourly?.precipitation || [];
    if (!times.length || times.length !== precip.length) return none;

    const now = Date.now();
    const windowStart = now - ADVISORY_HOURS * 3600 * 1000;
    let totalMm = 0;
    let lastRainMs: number | null = null;

    for (let i = 0; i < times.length; i++) {
      const t = Date.parse(times[i] + ":00Z");
      if (isNaN(t) || t < windowStart || t > now) continue;
      const mm = precip[i] || 0;
      totalMm += mm;
      if (mm >= 0.2) lastRainMs = Math.max(lastRainMs ?? 0, t);
    }

    const advisory = totalMm >= RAIN_ADVISORY_MM && lastRainMs !== null;
    return {
      advisory,
      totalMm: Math.round(totalMm * 10) / 10,
      totalIn: Math.round((totalMm / 25.4) * 100) / 100,
      lastRain: lastRainMs ? new Date(lastRainMs).toISOString() : null,
      liftsAt: advisory && lastRainMs ? new Date(lastRainMs + ADVISORY_HOURS * 3600 * 1000).toISOString() : null,
    };
  } catch {
    return none;
  }
}

// The only standing La Jolla advisory the county map itself carries
// (verified against sdbeachinfo per-station data, Sep 2026). Chronic and
// localized — listed for completeness, but it doesn't change dive status.
export const CHRONIC_ADVISORIES = [
  {
    station: "Children's Pool",
    since: "1997",
    reason: "Chronic advisory — elevated bacteria from the seal colony. Not a dive entry.",
  },
];

export function formatLifts(liftsAt: string | null): string {
  if (!liftsAt) return "";
  const d = new Date(liftsAt);
  return d.toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    timeZone: "America/Los_Angeles",
  });
}
