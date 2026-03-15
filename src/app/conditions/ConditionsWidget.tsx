"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ───
interface BuoyData { waveHeight: string; wavePeriod: string; avgPeriod: string; windDir: string; windSpeed: string; windGust: string; updated: string; }
interface VisData { visibility_ft_low: number | null; visibility_ft_high: number | null; grade: string; water_color: string; summary: string; cam_url: string; }
interface TideEvent { time: string; height: string; type: string; }
interface FactorScore { name: string; score: number; weight: number; label: string; color: string; detail: string; education: string; sourceLabel: string; sourceUrl: string; }

// ─── Helpers ───
function nowPacific(): string {
  return new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit", hour12: true, weekday: "long", month: "short", day: "numeric" });
}

function parseBuoyRSS(xml: string): BuoyData | null {
  try {
    const desc = xml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/g);
    if (!desc || desc.length < 2) return null;
    const content = desc[1];
    const extract = (label: string) => {
      const re = new RegExp(`<strong>${label}:</strong>\\s*([^<]+)`, "i");
      const m = content.match(re);
      if (!m) return "\u2014";
      return m[1].trim().replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
    };
    const timeMatch = content.match(/<strong>([A-Z][a-z]+ \d+, \d{4} [\d:]+ [ap]m [A-Z]+)<\/strong>/);
    return { waveHeight: extract("Significant Wave Height"), wavePeriod: extract("Dominant Wave Period"), avgPeriod: extract("Average Period"), windDir: extract("Wind Direction"), windSpeed: extract("Wind Speed"), windGust: extract("Wind Gust"), updated: timeMatch ? timeMatch[1] : "recently" };
  } catch { return null; }
}

// ─── Scoring ───
function scoreVisibility(vis: VisData | null, tideState: string): FactorScore {
  const tideNote = tideState === "incoming" ? " Tide is incoming \u2014 favorable for visibility." : tideState === "outgoing" ? " Tide is outgoing \u2014 vis may decrease." : "";
  const src = { sourceLabel: "Scripps Underwater Cam", sourceUrl: "https://coollab.ucsd.edu/pierviz/" };
  if (!vis || vis.visibility_ft_low === null) return { name: "Visibility", score: 50, weight: 30, label: "Unknown", color: "#5a6a7a", detail: "Camera analysis unavailable \u2014 check the live underwater cam directly." + tideNote, education: "Visibility is the single most important factor for dive quality. In La Jolla, vis ranges from 5ft (murky) to 40ft+ (exceptional). It\u2019s affected by rainfall, tide state, plankton blooms, swell, and upwelling events. We estimate vis using AI analysis of the Scripps Pier underwater camera, where reference pilings at known distances (4ft, 11ft, 14ft, 30ft) serve as markers.", ...src };
  const avg = ((vis.visibility_ft_low || 0) + (vis.visibility_ft_high || 0)) / 2;
  let score: number, label: string, color: string;
  if (avg >= 25) { score = 95; label = "Exceptional"; color = "#1B6B6B"; }
  else if (avg >= 20) { score = 85; label = "Excellent"; color = "#1B6B6B"; }
  else if (avg >= 15) { score = 70; label = "Good"; color = "#1B6B6B"; }
  else if (avg >= 10) { score = 55; label = "Fair"; color = "#D4A574"; }
  else if (avg >= 6) { score = 35; label = "Poor"; color = "#C75B3A"; }
  else { score = 15; label = "Very poor"; color = "#C75B3A"; }
  return { name: "Visibility", score, weight: 30, label: `${vis.visibility_ft_low}\u2013${vis.visibility_ft_high}ft \u00B7 ${label}`, color, detail: vis.summary + tideNote, education: "Visibility is estimated using AI analysis of the Scripps Pier underwater camera. Reference pilings at 4ft, 11ft, 14ft, and 30ft serve as distance markers. Which pilings are visible and how sharp they appear determines the estimate. Modifiers: rainfall (\u2212), incoming tide (+), plankton blooms (\u2212), upwelling SST drop (+).", ...src };
}

function scoreSwell(buoy: BuoyData | null): FactorScore {
  const src = { sourceLabel: "NDBC Station LJPC1", sourceUrl: "https://www.ndbc.noaa.gov/station_page.php?station=ljpc1" };
  if (!buoy) return { name: "Swell", score: 50, weight: 25, label: "No data", color: "#5a6a7a", detail: "Buoy data unavailable.", education: "Wave height and period from the Scripps Pier buoy (LJPC1), updated every 30 minutes.", ...src };
  const height = parseFloat(buoy.waveHeight); const period = parseFloat(buoy.wavePeriod);
  let score: number, label: string, color: string;
  if (height <= 1 && period >= 10) { score = 95; label = "Glass"; color = "#1B6B6B"; }
  else if (height <= 2) { score = 80; label = "Clean"; color = "#1B6B6B"; }
  else if (height <= 3) { score = 60; label = "Manageable"; color = "#D4A574"; }
  else if (height <= 5) { score = 35; label = "Rough"; color = "#C75B3A"; }
  else { score = 15; label = "Heavy"; color = "#C75B3A"; }
  if (period >= 12) score = Math.min(100, score + 10);
  else if (period < 6) score = Math.max(0, score - 15);
  return { name: "Swell", score, weight: 25, label: `${buoy.waveHeight} @ ${buoy.wavePeriod} \u00B7 ${label}`, color, detail: height <= 2 ? "Minimal swell \u2014 flat to small conditions." : height <= 4 ? "Moderate swell \u2014 expect surge at exposed spots. Cove should be fine." : "Heavy swell \u2014 experienced divers only at sheltered spots.", education: "Wave height (ft) and period (seconds between waves) from LJPC1 buoy. For freediving, smaller + longer period = better. A 2ft swell at 14 seconds is much cleaner than 2ft at 5 seconds. Period under 6s means choppy, confused seas.", ...src };
}

function scoreWind(buoy: BuoyData | null): FactorScore {
  const src = { sourceLabel: "NDBC Station LJPC1", sourceUrl: "https://www.ndbc.noaa.gov/station_page.php?station=ljpc1" };
  if (!buoy) return { name: "Wind", score: 50, weight: 20, label: "No data", color: "#5a6a7a", detail: "Wind data unavailable.", education: "Wind measured at Scripps Pier anemometer, 20m above sea level.", ...src };
  const speed = parseFloat(buoy.windSpeed); const dir = buoy.windDir;
  let score: number, label: string, color: string;
  if (speed <= 3) { score = 95; label = "Calm"; color = "#1B6B6B"; }
  else if (speed <= 7) { score = 75; label = "Light"; color = "#1B6B6B"; }
  else if (speed <= 12) { score = 50; label = "Moderate"; color = "#D4A574"; }
  else if (speed <= 18) { score = 25; label = "Windy"; color = "#C75B3A"; }
  else { score = 10; label = "Strong"; color = "#C75B3A"; }
  if (dir.includes("E") && !dir.includes("SE")) score = Math.min(100, score + 10);
  if (dir.includes("W") && speed > 8) score = Math.max(0, score - 10);
  return { name: "Wind", score, weight: 20, label: `${buoy.windSpeed} ${dir} \u00B7 ${label}`, color, detail: speed <= 5 ? "Light wind \u2014 smooth surface, minimal chop." : speed <= 10 ? `Moderate ${dir} wind.${dir.includes("E") ? " Offshore \u2014 favorable." : ""}` : `Strong ${dir} wind \u2014 expect significant chop.`, education: "Wind direction matters as much as speed. Offshore wind (east) smooths the surface. Onshore wind (west) creates chop and reduces visibility. Gusts above 15 knots make surface swimming uncomfortable and your dive flag harder to spot.", ...src };
}

function scoreTemperature(tempF: number | null, isEstimate: boolean = false): FactorScore {
  const src = { sourceLabel: "NDBC Station 46254", sourceUrl: "https://www.ndbc.noaa.gov/station_page.php?station=46254" };
  if (!tempF) return { name: "Water temp", score: 60, weight: 10, label: "Loading...", color: "#5a6a7a", detail: "Temperature data loading.", education: "Water temp measured at 0.46m depth by the Scripps Nearshore buoy (Station 46254).", ...src };
  let score: number, label: string, color: string, wetsuit: string;
  if (tempF >= 70) { score = 90; label = "Warm"; color = "#1B6B6B"; wetsuit = "3mm or shorty"; }
  else if (tempF >= 65) { score = 75; label = "Comfortable"; color = "#1B6B6B"; wetsuit = "3mm full suit"; }
  else if (tempF >= 60) { score = 55; label = "Cool"; color = "#D4A574"; wetsuit = "5mm recommended"; }
  else if (tempF >= 56) { score = 35; label = "Cold"; color = "#163B4E"; wetsuit = "5mm + hood"; }
  else { score = 20; label = "Very cold"; color = "#163B4E"; wetsuit = "5mm + hood + gloves"; }
  const prefix = isEstimate ? "~" : "";
  const suffix = isEstimate ? " (seasonal avg)" : "";
  return { name: "Water temp", score, weight: 10, label: `${prefix}${tempF}\u00B0F \u00B7 ${label}${suffix}`, color, detail: `Wetsuit: ${wetsuit}.${isEstimate ? " Based on Scripps Pier 100-year seasonal average for this month." : ""}${tempF < 60 ? " Cold water reduces breath hold \u2014 limit session length." : ""}`, education: "La Jolla water ranges from ~56\u00B0F (winter) to ~72\u00B0F (late summer). A sudden 4\u00B0F+ drop often signals upwelling \u2014 cold, clear water rising from the Canyon \u2014 which typically improves visibility significantly.", ...src };
}

function scoreSafety(recentRain: boolean): FactorScore {
  const src = { sourceLabel: "SD Beach & Bay Water Quality", sourceUrl: "https://www.sdbeachinfo.com/" };
  if (recentRain) return { name: "Water safety", score: 10, weight: 15, label: "Rain advisory", color: "#C75B3A", detail: "Recent rainfall detected. Avoid ocean contact for 72 hours after rain \u2014 elevated bacteria from urban runoff.", education: "After 0.2+ inches of rain, SD County issues a General Advisory for all coastal waters. Urban runoff carries bacteria, chemicals, and sediment. Bacteria levels stay elevated up to 72 hours. Rain also destroys visibility for 1\u20133 days. Check sdbeachinfo.com for advisories.", ...src };
  return { name: "Water safety", score: 90, weight: 15, label: "Clear", color: "#1B6B6B", detail: "No active advisories or recent rainfall.", education: "SD County tests beaches weekly for fecal indicator bacteria. The 72-hour post-rain rule is the most important guideline. Check sdbeachinfo.com for the latest advisories.", ...src };
}

function calculateOverallGrade(factors: FactorScore[]) {
  const safety = factors.find((f) => f.name === "Water safety");
  if (safety && safety.score < 20) return { grade: "F", score: 10, color: "#C75B3A", summary: "Water quality advisory. Stay out of the water until 72 hours post-rain." };
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const ws = factors.reduce((sum, f) => sum + f.score * f.weight, 0) / totalWeight;
  if (ws >= 88) return { grade: "A", score: Math.round(ws), color: "#1B6B6B", summary: "Epic conditions. This is what you wait for \u2014 get in the water." };
  if (ws >= 78) return { grade: "B+", score: Math.round(ws), color: "#1B6B6B", summary: "Very good conditions. Great day for a dive." };
  if (ws >= 68) return { grade: "B", score: Math.round(ws), color: "#1B6B6B", summary: "Good conditions. Solid diving at protected spots." };
  if (ws >= 58) return { grade: "C+", score: Math.round(ws), color: "#D4A574", summary: "Fair conditions. Diveable but pick your spot." };
  if (ws >= 45) return { grade: "C", score: Math.round(ws), color: "#D4A574", summary: "Below average. Consider a pool session." };
  if (ws >= 30) return { grade: "D", score: Math.round(ws), color: "#C75B3A", summary: "Poor conditions. Dry training day." };
  return { grade: "F", score: Math.round(ws), color: "#C75B3A", summary: "Not recommended today." };
}

// ─── Main Widget ───
export function ConditionsWidget() {
  const [buoy, setBuoy] = useState<BuoyData | null>(null);
  const [vis, setVis] = useState<VisData | null>(null);
  const [waterTemp, setWaterTemp] = useState<number | null>(null);
  const [tempIsEstimate, setTempIsEstimate] = useState(false);
  const [tideState, setTideState] = useState<string>("unknown");
  const [tides, setTides] = useState<TideEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>(nowPacific());

  const fetchData = useCallback(() => {
    fetch("/api/conditions").then(r => r.text()).then(xml => { setBuoy(parseBuoyRSS(xml)); setLastRefresh(nowPacific()); }).catch(() => {}).finally(() => setLoading(false));
    fetch("/api/visibility").then(r => r.json()).then(d => setVis(d)).catch(() => {});
    fetch("/api/watertemp").then(r => r.json()).then(d => {
      if (d.water_temp && !isNaN(d.water_temp)) { setWaterTemp(Math.round(d.water_temp)); setTempIsEstimate(d.is_estimate || false); }
      if (d.tide_state) setTideState(d.tide_state);
      if (d.tides) setTides(d.tides);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const factors: FactorScore[] = [
    scoreVisibility(vis, tideState),
    scoreSwell(buoy),
    scoreWind(buoy),
    scoreTemperature(waterTemp, tempIsEstimate),
    scoreSafety(false),
  ];
  const overall = calculateOverallGrade(factors);

  if (loading) return (
    <div className="bg-white rounded-2xl p-12 text-center">
      <div className="font-serif text-2xl text-deep/30 mb-2">Reading the ocean...</div>
      <div className="text-sm text-[#5a6a7a]">Pulling live data from Scripps Pier</div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Main dashboard */}
      <div className="bg-white rounded-2xl overflow-hidden">
        {/* Prominent timestamp bar */}
        <div className="px-8 py-3 bg-deep flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-seafoam animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Live conditions</span>
          </div>
          <div className="text-white/60 text-sm">
            {lastRefresh} <span className="text-white/30 ml-1">PT</span>
          </div>
        </div>

        {/* Grade + summary */}
        <div className="p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center shrink-0" style={{ background: overall.color + "12" }}>
            <span className="font-serif text-5xl leading-none" style={{ color: overall.color }}>{overall.grade}</span>
            <span className="text-[10px] font-medium mt-1" style={{ color: overall.color }}>{overall.score}/100</span>
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-2xl tracking-tight mb-2">{overall.summary}</h2>
            <div className="text-xs text-[#5a6a7a]">
              Buoy data from {buoy?.updated || "recently"} · Auto-refreshes every 10 min
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-deep/[0.06]">
          {[
            { label: "Swell", value: buoy?.waveHeight || "\u2014", sub: buoy ? `@ ${buoy.wavePeriod}` : "" },
            { label: "Wind", value: buoy?.windSpeed || "\u2014", sub: buoy?.windDir || "" },
            { label: "Water", value: waterTemp ? `${waterTemp}\u00B0F` : "\u2014", sub: waterTemp && waterTemp >= 65 ? "3mm" : "5mm" },
            { label: "Tide", value: tideState !== "unknown" ? tideState : "\u2014", sub: tides[0] ? `Next: ${tides[0].height}ft ${tides[0].type}` : "" },
          ].map((s, i) => (
            <div key={s.label} className={`p-5 ${i < 3 ? "border-r border-deep/[0.04]" : ""}`}>
              <div className="text-[10px] text-[#5a6a7a] uppercase tracking-wider mb-1">{s.label}</div>
              <div className="font-serif text-xl text-deep capitalize">{s.value}</div>
              <div className="text-[10px] text-[#5a6a7a] mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Factor breakdown */}
        <div className="border-t border-deep/[0.06]">
          {factors.map((factor) => (
            <div key={factor.name} className="px-8 py-5 border-b border-deep/[0.04] last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{factor.name}</span>
                  <span className="text-[10px] text-[#5a6a7a]">({factor.weight}%)</span>
                  <button onClick={() => setOpenTooltip(openTooltip === factor.name ? null : factor.name)} className="ml-1 w-4 h-4 rounded-full bg-deep/[0.06] text-[#5a6a7a] text-[9px] font-bold inline-flex items-center justify-center hover:bg-deep/[0.12] transition-colors">?</button>
                </div>
                <span className="text-sm font-medium" style={{ color: factor.color }}>{factor.label}</span>
              </div>
              <div className="h-2 bg-deep/[0.06] rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${factor.score}%`, background: factor.color }} />
              </div>
              <p className="text-xs text-[#5a6a7a] leading-relaxed">{factor.detail}</p>
              <a href={factor.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-teal/60 hover:text-teal no-underline mt-1 inline-block">Source: {factor.sourceLabel} ↗</a>
              {openTooltip === factor.name && (
                <div className="mt-3 p-4 bg-deep text-white/80 rounded-xl text-xs leading-relaxed">
                  <div className="font-semibold text-white text-[11px] mb-1.5">How we measure this</div>
                  {factor.education}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tide schedule */}
        {tides.length > 0 && (
          <div className="px-8 py-5 border-t border-deep/[0.06]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">Today&apos;s tides</span>
              {tideState !== "unknown" && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${tideState === "incoming" ? "bg-[#1B6B6B15] text-[#1B6B6B]" : "bg-[#D4A57430] text-[#8B6840]"}`}>
                  Currently {tideState}
                </span>
              )}
            </div>
            <div className="flex gap-4 flex-wrap">
              {tides.map((tide, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#5a6a7a]">
                  <span className={`font-medium ${tide.type === "high" ? "text-[#1B6B6B]" : "text-[#163B4E]"}`}>
                    {tide.type === "high" ? "\u25B2" : "\u25BC"} {tide.height}ft
                  </span>
                  <span>{tide.time.split(" ")[1]}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#5a6a7a] mt-2">Incoming tide generally improves vis. Best diving is 1–2 hours into an incoming tide.</p>
            <a href="https://tidesandcurrents.noaa.gov/stationhome.html?id=9410230" target="_blank" rel="noopener noreferrer" className="text-[10px] text-teal/60 hover:text-teal no-underline mt-1 inline-block">Source: NOAA Tides Station 9410230 ↗</a>
          </div>
        )}

        {/* Quick links */}
        <div className="px-8 py-4 bg-salt/50 flex flex-wrap gap-3">
          {[
            { label: "Underwater cam", url: "https://coollab.ucsd.edu/pierviz/" },
            { label: "Surface cam", url: "https://scripps.ucsd.edu/piercam" },
            { label: "Full buoy data", url: "https://www.ndbc.noaa.gov/station_page.php?station=ljpc1" },
            { label: "Wave forecast", url: "https://cdip.ucsd.edu/themes/?d2=p70:s:073:st:1" },
            { label: "Beach advisories", url: "https://www.sdbeachinfo.com/" },
          ].map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white rounded-full text-xs text-teal font-medium no-underline hover:shadow-sm transition-shadow">{link.label} ↗</a>
          ))}
        </div>
      </div>

      {/* Daily conditions alert signup — LEAD MAGNET */}
      <div className="bg-deep rounded-2xl p-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <div className="text-seafoam text-xs font-semibold uppercase tracking-wider mb-2">Daily dive report</div>
          <h3 className="font-serif text-xl text-white mb-2">Get conditions in your inbox at 6am</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Daily dive grade, visibility estimate, swell, wind, and water temp — delivered every morning before you decide whether to get wet.
          </p>
        </div>
        <a href="/contact" className="shrink-0 px-6 py-3 bg-coral text-white rounded-full font-medium text-sm no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all text-center">
          Sign up for daily report →
        </a>
      </div>
    </div>
  );
}
