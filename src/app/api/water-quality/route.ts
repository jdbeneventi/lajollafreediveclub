import { NextResponse } from "next/server";

const LA_JOLLA_STATIONS = [
  "Vallecitos - La Jolla Shores",
  "Avenida De La Playa - La Jolla Shores",
  "La Jolla Cove",
  "El Paseo Grande - La Jolla Shores",
  "Children's Pool - La Jolla",
  "Scripps Pier",
];

const PERSISTENT_ADVISORIES = [
  { station: "Children's Pool", since: "1997", reason: "Seal colony — elevated bacteria from marine mammal waste." },
  { station: "La Jolla Cove", since: "Jan 2026", reason: "Ongoing water quality advisory." },
];

export async function GET() {
  const alerts: { icon: string; station: string; detail: string }[] = [];
  let advisoryCount = 0;
  let closureCount = 0;
  let rainWarning = false;

  try {
    const [sdRes, ljRes, nwsRes] = await Promise.all([
      fetch("https://www.sdbeachinfo.com/", { headers: { "User-Agent": "LaJollaFreediveClub/1.0" } }).catch(() => null),
      fetch("https://lajolla.ca/news/local-impact/", { headers: { "User-Agent": "LaJollaFreediveClub/1.0" } }).catch(() => null),
      fetch("https://forecast.weather.gov/MapClick.php?lat=32.8328&lon=-117.2713&FcstType=json", { headers: { "User-Agent": "LaJollaFreediveClub/1.0" } }).catch(() => null),
    ]);

    if (sdRes && sdRes.ok) {
      const html = await sdRes.text();
      const am = html.match(/Advisories\s*\((\d+)\)/i);
      const cm = html.match(/Closures\s*\((\d+)\)/i);
      advisoryCount = am ? parseInt(am[1]) : 0;
      closureCount = cm ? parseInt(cm[1]) : 0;
    }

    if (ljRes && ljRes.ok) {
      const ljLower = (await ljRes.text()).toLowerCase();
      for (const station of LA_JOLLA_STATIONS) {
        const shortName = station.split(" - ")[0] || station;
        if (ljLower.includes(shortName.toLowerCase()) &&
            (ljLower.includes("advisory") || ljLower.includes("closure") || ljLower.includes("bacteria"))) {
          const isClosure = ljLower.includes("closure") || ljLower.includes("closed");
          alerts.push({
            icon: isClosure ? "🔴" : "🟡",
            station: shortName,
            detail: isClosure ? "Closed — bacteria exceeds health standards" : "Advisory — elevated bacteria levels",
          });
        }
      }
    }

    if (nwsRes && nwsRes.ok) {
      try {
        const nwsData = await nwsRes.json();
        const periods = nwsData?.data?.text || [];
        const recent = periods.slice(0, 4).join(" ").toLowerCase();
        if (recent.includes("rain") || recent.includes("showers") || recent.includes("precipitation")) {
          rainWarning = true;
        }
      } catch {}
    }
  } catch {}

  // Always add persistent advisories
  for (const pa of PERSISTENT_ADVISORIES) {
    if (!alerts.some((a) => a.station === pa.station)) {
      alerts.push({ icon: "🟡", station: pa.station, detail: pa.reason + " (since " + pa.since + ")" });
    }
  }

  const hasClosure = alerts.some((a) => a.icon === "🔴");
  const hasAdvisory = alerts.length > 0;
  const status = hasClosure ? "red" : hasAdvisory ? "yellow" : "green";

  return NextResponse.json({
    status,
    advisoryCount,
    closureCount,
    rainWarning,
    alerts,
    updated: new Date().toISOString(),
  }, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
  });
}
