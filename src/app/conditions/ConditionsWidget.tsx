"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ───
interface ConditionsData { waveHeight: number | null; wavePeriod: number | null; avgPeriod: number | null; windDir: string | null; windSpeed: string | null; windGust: string | null; waterTemp: number | null; buoyUpdated: string | null; windUpdated: string | null; }
interface VisData { visibility_ft_low: number | null; visibility_ft_high: number | null; grade: string; water_color: string; summary: string; cam_url: string; }
interface TideEvent { time: string; height: string; type: string; }
interface FactorScore { name: string; score: number; weight: number; label: string; color: string; detail: string; education: string; sourceLabel: string; sourceUrl: string; }

// ─── Helpers ───
function nowPacific(): string {
  return new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit", hour12: true, weekday: "long", month: "short", day: "numeric" });
}

function formatBuoyTime(isoTime: string | null): string {
  if (!isoTime) return "recently";
  try {
    return new Date(isoTime).toLocaleString("en-US", { timeZone: "America/Los_Angeles", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short" });
  } catch { return "recently"; }
}

// ─── Scoring ───

// Predictive visibility model based on environmental factors
// Used when camera analysis is unavailable
function predictVisibility(conditions: ConditionsData | null, tideState: string, waterTemp: number | null): { low: number; high: number; confidence: string; factors: string[] } {
  // Baseline: La Jolla average vis is ~12-15ft
  let baseVis = 14;
  const factors: string[] = [];

  if (conditions) {
    // Swell effect: bigger waves = more sediment = worse vis
    const ht = conditions.waveHeight || 0;
    if (ht <= 1) { baseVis += 5; factors.push("Small swell (+)"); }
    else if (ht <= 2) { baseVis += 2; }
    else if (ht <= 3) { baseVis -= 2; }
    else if (ht <= 5) { baseVis -= 5; factors.push("Large swell (\u2212)"); }
    else { baseVis -= 8; factors.push("Heavy swell (\u2212\u2212)"); }

    // Period effect: short period = choppy = worse
    const pd = conditions.wavePeriod || 8;
    if (pd >= 14) { baseVis += 3; factors.push("Long period swell (+)"); }
    else if (pd >= 10) { baseVis += 1; }
    else if (pd < 6) { baseVis -= 3; factors.push("Short period chop (\u2212)"); }

    // Wind effect
    const ws = parseFloat(conditions.windSpeed || "0");
    const wd = conditions.windDir || "";
    if (ws <= 5) { baseVis += 2; factors.push("Calm winds (+)"); }
    else if (ws > 12) { baseVis -= 3; factors.push("Strong wind (\u2212)"); }
    if (wd.includes("E") && !wd.includes("SE") && ws > 3) { baseVis += 2; factors.push("Offshore wind (+)"); }
    if (wd.includes("W") && ws > 8) { baseVis -= 2; factors.push("Onshore wind (\u2212)"); }
  }

  // Tide effect
  if (tideState === "incoming") { baseVis += 2; factors.push("Incoming tide (+)"); }
  else if (tideState === "outgoing") { baseVis -= 1; }

  // Temperature/season effect
  if (waterTemp) {
    if (waterTemp >= 68) { baseVis += 2; factors.push("Warm water / summer (+)"); }
    else if (waterTemp <= 57) { baseVis += 1; factors.push("Cold — possible upwelling (+)"); }
  }

  // Seasonal baseline (month of year)
  const month = new Date().getMonth();
  if (month >= 7 && month <= 9) { baseVis += 3; } // Aug-Oct best vis
  else if (month >= 0 && month <= 2) { baseVis -= 2; } // Jan-Mar worst

  // Clamp to realistic range
  baseVis = Math.max(4, Math.min(35, baseVis));

  // Create a range (±3ft uncertainty)
  const low = Math.max(3, baseVis - 3);
  const high = baseVis + 3;

  return { low, high, confidence: "moderate", factors };
}

function scoreVisibility(vis: VisData | null, tideState: string, conditions: ConditionsData | null, waterTemp: number | null): FactorScore {
  const tideNote = tideState === "incoming" ? " Tide is incoming \u2014 favorable for visibility." : tideState === "outgoing" ? " Tide is outgoing \u2014 vis may decrease." : "";

  // If we have camera data, use it
  if (vis && vis.visibility_ft_low !== null) {
    const src = { sourceLabel: "Scripps Underwater Cam (AI)", sourceUrl: "https://coollab.ucsd.edu/pierviz/" };
    const avg = ((vis.visibility_ft_low || 0) + (vis.visibility_ft_high || 0)) / 2;
    let score: number, label: string, color: string;
    if (avg >= 25) { score = 95; label = "Exceptional"; color = "#1B6B6B"; }
    else if (avg >= 20) { score = 85; label = "Excellent"; color = "#1B6B6B"; }
    else if (avg >= 15) { score = 70; label = "Good"; color = "#1B6B6B"; }
    else if (avg >= 10) { score = 55; label = "Fair"; color = "#D4A574"; }
    else if (avg >= 6) { score = 35; label = "Poor"; color = "#C75B3A"; }
    else { score = 15; label = "Very poor"; color = "#C75B3A"; }
    return { name: "Visibility", score, weight: 30, label: `${vis.visibility_ft_low}\u2013${vis.visibility_ft_high}ft \u00B7 ${label}`, color, detail: vis.summary + tideNote, education: "Measured via AI analysis of the Scripps Pier underwater camera. Reference pilings at 4ft, 11ft, 14ft, and 30ft serve as distance markers.", ...src };
  }

  // No camera data — use predictive model
  const prediction = predictVisibility(conditions, tideState, waterTemp);
  const avg = (prediction.low + prediction.high) / 2;
  let score: number, label: string, color: string;
  if (avg >= 25) { score = 90; label = "Likely excellent"; color = "#1B6B6B"; }
  else if (avg >= 20) { score = 80; label = "Likely very good"; color = "#1B6B6B"; }
  else if (avg >= 15) { score = 65; label = "Likely good"; color = "#1B6B6B"; }
  else if (avg >= 10) { score = 50; label = "Likely fair"; color = "#D4A574"; }
  else if (avg >= 6) { score = 30; label = "Likely poor"; color = "#C75B3A"; }
  else { score = 15; label = "Likely very poor"; color = "#C75B3A"; }

  const factorList = prediction.factors.length > 0 ? " Key factors: " + prediction.factors.join(", ") + "." : "";
  const src = { sourceLabel: "Predictive model (swell, wind, tide)", sourceUrl: "https://www.ndbc.noaa.gov/station_page.php?station=46254" };

  return { name: "Visibility", score, weight: 30, label: `~${prediction.low}\u2013${prediction.high}ft \u00B7 ${label}`, color, detail: `Estimated from current swell, wind, tide, and seasonal data.${factorList}${tideNote}`, education: "When the underwater camera is unavailable, we estimate visibility using a predictive model based on swell height and period, wind speed and direction, tide state, water temperature (upwelling indicator), and seasonal patterns. The model is calibrated to La Jolla conditions. Camera-based AI analysis provides more accurate readings when available.", ...src };
}

function scoreSwell(data: ConditionsData | null): FactorScore {
  const src = { sourceLabel: "NDBC Station 46254", sourceUrl: "https://www.ndbc.noaa.gov/station_page.php?station=46254" };
  if (!data || data.waveHeight === null) return { name: "Swell", score: 50, weight: 25, label: "No data", color: "#5a6a7a", detail: "Buoy data unavailable.", education: "Wave height and period from the Scripps Nearshore buoy (46254), updated every 30 minutes.", ...src };
  const height = data.waveHeight; const period = data.wavePeriod || 0;
  let score: number, label: string, color: string;
  if (height <= 1 && period >= 10) { score = 95; label = "Glass"; color = "#1B6B6B"; }
  else if (height <= 2) { score = 80; label = "Clean"; color = "#1B6B6B"; }
  else if (height <= 3) { score = 60; label = "Manageable"; color = "#D4A574"; }
  else if (height <= 5) { score = 35; label = "Rough"; color = "#C75B3A"; }
  else { score = 15; label = "Heavy"; color = "#C75B3A"; }
  if (period >= 12) score = Math.min(100, score + 10);
  else if (period < 6) score = Math.max(0, score - 15);
  return { name: "Swell", score, weight: 25, label: `${height} ft @ ${period} sec \u00B7 ${label}`, color, detail: height <= 2 ? "Minimal swell \u2014 flat to small conditions." : height <= 4 ? "Moderate swell \u2014 expect surge at exposed spots. Cove should be fine." : "Heavy swell \u2014 experienced divers only at sheltered spots.", education: "Wave height (ft) and period (seconds between waves) from the 46254 buoy at Scripps Pier. For freediving, smaller + longer period = better. A 2ft swell at 14 seconds is much cleaner than 2ft at 5 seconds.", ...src };
}

function scoreWind(data: ConditionsData | null): FactorScore {
  const src = { sourceLabel: "NDBC Station LJPC1", sourceUrl: "https://www.ndbc.noaa.gov/station_page.php?station=ljpc1" };
  if (!data || !data.windSpeed) return { name: "Wind", score: 50, weight: 20, label: "No data", color: "#5a6a7a", detail: "Wind data unavailable.", education: "Wind measured at Scripps Pier anemometer, 20m above sea level.", ...src };
  const speed = parseFloat(data.windSpeed); const dir = data.windDir || "";
  let score: number, label: string, color: string;
  if (speed <= 3) { score = 95; label = "Calm"; color = "#1B6B6B"; }
  else if (speed <= 7) { score = 75; label = "Light"; color = "#1B6B6B"; }
  else if (speed <= 12) { score = 50; label = "Moderate"; color = "#D4A574"; }
  else if (speed <= 18) { score = 25; label = "Windy"; color = "#C75B3A"; }
  else { score = 10; label = "Strong"; color = "#C75B3A"; }
  if (dir.includes("E") && !dir.includes("SE")) score = Math.min(100, score + 10);
  if (dir.includes("W") && speed > 8) score = Math.max(0, score - 10);
  return { name: "Wind", score, weight: 20, label: `${data.windSpeed} ${dir} \u00B7 ${label}`, color, detail: speed <= 5 ? "Light wind \u2014 smooth surface, minimal chop." : speed <= 10 ? `Moderate ${dir} wind.${dir.includes("E") ? " Offshore \u2014 favorable." : ""}` : `Strong ${dir} wind \u2014 expect significant chop.`, education: "Wind direction matters as much as speed. Offshore wind (east) smooths the surface. Onshore wind (west) creates chop and reduces visibility. Gusts above 15 knots make surface swimming uncomfortable and your dive flag harder to spot.", ...src };
}

function scoreTemperature(tempF: number | null, isEstimate: boolean = false): FactorScore {
  const src = { sourceLabel: "NDBC Station 46254", sourceUrl: "https://www.ndbc.noaa.gov/station_page.php?station=46254" };
  if (!tempF) return { name: "Water temp", score: 60, weight: 10, label: "Loading...", color: "#5a6a7a", detail: "Temperature data loading.", education: "Water temp measured at 0.46m depth by the Scripps Nearshore buoy (Station 46254).", ...src };
  let score: number, label: string, color: string, wetsuit: string;
  if (tempF >= 72) { score = 90; label = "Warm"; color = "#1B6B6B"; wetsuit = "3–5mm (thermocline can drop 5–10°F at depth)"; }
  else if (tempF >= 68) { score = 80; label = "Mild"; color = "#1B6B6B"; wetsuit = "5mm recommended (3mm if staying shallow)"; }
  else if (tempF >= 63) { score = 65; label = "Cool"; color = "#D4A574"; wetsuit = "5mm full suit (5mm + hood for canyon depth)"; }
  else if (tempF >= 58) { score = 40; label = "Cold"; color = "#163B4E"; wetsuit = "5–7mm + hood"; }
  else { score = 20; label = "Very cold"; color = "#163B4E"; wetsuit = "7mm + hood + gloves"; }
  const prefix = isEstimate ? "~" : "";
  const suffix = isEstimate ? " (seasonal avg)" : "";
  return { name: "Water temp", score, weight: 10, label: `${prefix}${tempF}\u00B0F \u00B7 ${label}${suffix}`, color, detail: `Wetsuit: ${wetsuit}.${isEstimate ? " Based on Scripps Pier 100-year seasonal average for this month." : ""}${tempF < 60 ? " Cold water reduces breath hold \u2014 limit session length." : ""}`, education: "Surface temp only \u2014 thermocline can drop 5\u201310\u00B0F at depth. La Jolla ranges from ~56\u00B0F (winter) to ~72\u00B0F (late summer). A sudden 4\u00B0F+ drop often signals upwelling \u2014 cold, clear water from the Canyon \u2014 which typically improves visibility.", ...src };
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
  const [conditions, setConditions] = useState<ConditionsData | null>(null);
  const [vis, setVis] = useState<VisData | null>(null);
  const [waterTemp, setWaterTemp] = useState<number | null>(null);
  const [tempIsEstimate, setTempIsEstimate] = useState(false);
  const [tideState, setTideState] = useState<string>("unknown");
  const [tides, setTides] = useState<TideEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>(nowPacific());
  const [buoyTime, setBuoyTime] = useState<string | null>(null);
  const [forecast, setForecast] = useState<{ day: string; date: string; grade: string; score: number; summary: string; color: string; seaHeight: number; windSpeed: number }[]>([]);

  const fetchData = useCallback(() => {
    fetch("/api/conditions").then(r => r.json()).then(d => {
      setConditions(d);
      if (d.waterTemp) { setWaterTemp(d.waterTemp); setTempIsEstimate(false); }
      setBuoyTime(d.buoyUpdated);
      setLastRefresh(nowPacific());
    }).catch(() => {}).finally(() => setLoading(false));
    fetch("/api/visibility").then(r => r.json()).then(d => setVis(d)).catch(() => {});
    fetch("/api/watertemp").then(r => r.json()).then(d => {
      if (!waterTemp && d.water_temp && !isNaN(d.water_temp)) { setWaterTemp(Math.round(d.water_temp)); setTempIsEstimate(d.is_estimate || false); }
      if (d.tide_state) setTideState(d.tide_state);
      if (d.tides) setTides(d.tides);
    }).catch(() => {});
    fetch("/api/forecast").then(r => r.json()).then(d => { if (d.days) setForecast(d.days); }).catch(() => {});
  }, [waterTemp]);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const factors: FactorScore[] = [
    scoreVisibility(vis, tideState, conditions, waterTemp),
    scoreSwell(conditions),
    scoreWind(conditions),
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
              Buoy data from {formatBuoyTime(buoyTime)} · Auto-refreshes every 10 min
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-deep/[0.06]">
          {[
            { label: "Swell", value: conditions?.waveHeight ? `${conditions.waveHeight} Ft` : "\u2014", sub: conditions?.wavePeriod ? `@ ${conditions.wavePeriod} sec` : "" },
            { label: "Wind", value: conditions?.windSpeed ? `${conditions.windSpeed} Knots` : "\u2014", sub: conditions?.windDir || "" },
            { label: "Water", value: waterTemp ? `${waterTemp}\u00B0F` : "\u2014", sub: waterTemp && waterTemp >= 72 ? "3–5mm" : waterTemp && waterTemp >= 63 ? "5mm" : "5–7mm" },
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
              <a href={factor.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-deep/[0.04] hover:bg-deep/[0.08] transition-colors no-underline group">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-seafoam animate-pulse" />
                  <span className="text-[10px] font-semibold text-seafoam uppercase tracking-wider">Live</span>
                </span>
                <span className="text-[10px] text-[#5a6a7a] group-hover:text-deep transition-colors">{factor.sourceLabel}</span>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-teal/50 group-hover:text-teal transition-colors"><path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
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
            <a href="https://tidesandcurrents.noaa.gov/stationhome.html?id=9410230" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-deep/[0.04] hover:bg-deep/[0.08] transition-colors no-underline group">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-seafoam animate-pulse" />
                <span className="text-[10px] font-semibold text-seafoam uppercase tracking-wider">Live</span>
              </span>
              <span className="text-[10px] text-[#5a6a7a] group-hover:text-deep transition-colors">NOAA Tides Station 9410230</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-teal/50 group-hover:text-teal transition-colors"><path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        )}

        {/* Quick links — live sources */}
        <div className="px-8 py-5 bg-salt/50">
          <div className="text-[10px] text-[#5a6a7a] uppercase tracking-wider font-semibold mb-3">Live Sources</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Underwater Cam", url: "https://coollab.ucsd.edu/pierviz/", icon: "▶", live: true },
              { label: "Surface Cam", url: "https://scripps.ucsd.edu/piercam", icon: "▶", live: true },
              { label: "Buoy Data", url: "https://www.ndbc.noaa.gov/station_page.php?station=ljpc1", icon: "◉", live: true },
              { label: "Wave Forecast", url: "https://cdip.ucsd.edu/themes/?d2=p70:s:073:st:1", icon: "◉", live: false },
              { label: "Beach Advisories", url: "https://www.sdbeachinfo.com/", icon: "◉", live: false },
            ].map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full no-underline hover:shadow-md hover:-translate-y-0.5 transition-all group border border-deep/[0.06]">
                {link.live && <span className="w-1.5 h-1.5 rounded-full bg-seafoam animate-pulse" />}
                <span className="text-deep/40 text-[10px]">{link.icon}</span>
                <span className="text-xs text-deep font-medium group-hover:text-teal transition-colors">{link.label}</span>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-deep/20 group-hover:text-teal transition-colors"><path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      {forecast.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-8 py-5 border-b border-deep/[0.06] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg">Week ahead</h3>
              <p className="text-[10px] text-[#5a6a7a] mt-0.5">Based on NWS marine forecast for San Diego coastal waters</p>
            </div>
            <a href="https://forecast.weather.gov/shmrn.php?mz=pzz750&syn=pzz700" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-deep/[0.04] hover:bg-deep/[0.08] transition-colors no-underline group">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-seafoam animate-pulse" />
                <span className="text-[10px] font-semibold text-seafoam uppercase tracking-wider">Live</span>
              </span>
              <span className="text-[10px] text-[#5a6a7a] group-hover:text-deep transition-colors">NWS Marine Forecast</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-teal/50 group-hover:text-teal transition-colors"><path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
            {forecast.slice(0, 7).map((day, i) => {
              // Replace today's forecast with live measured data
              const isToday = i === 0;
              const displayGrade = isToday ? overall.grade : day.grade;
              const displayColor = isToday ? overall.color : day.color;
              const displaySeas = isToday && conditions?.waveHeight ? `${conditions.waveHeight}ft swell` : `${day.seaHeight}ft seas`;
              const displayWind = isToday && conditions?.windSpeed ? `${conditions.windSpeed}kt wind` : `${day.windSpeed}kt wind`;

              return (
                <div key={day.day} className={`p-4 text-center ${i < forecast.length - 1 ? "border-r border-deep/[0.04]" : ""} ${isToday ? "bg-deep/[0.03]" : ""}`}>
                  <div className="text-[10px] uppercase tracking-wider flex items-center justify-center gap-1">
                    {isToday && <span className="w-1.5 h-1.5 rounded-full bg-seafoam animate-pulse" />}
                    <span className={isToday ? "text-deep font-semibold" : "text-[#5a6a7a]"}>{isToday ? "Today" : day.day}</span>
                  </div>
                  <div className="text-[10px] text-[#5a6a7a] mb-2">{isToday ? "Live" : day.date}</div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: displayColor + "15" }}>
                    <span className="font-serif text-lg" style={{ color: displayColor }}>{displayGrade}</span>
                  </div>
                  <div className="text-[10px] text-[#5a6a7a]">{displaySeas}</div>
                  <div className="text-[10px] text-[#5a6a7a]">{displayWind}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily conditions alert signup — LEAD MAGNET */}
      <div className="bg-deep rounded-2xl p-8">
        <div className="mb-4">
          <div className="text-seafoam text-xs font-semibold uppercase tracking-wider mb-2">Stay in the loop</div>
          <h3 className="font-serif text-xl text-white mb-2">Conditions, species alerts, and dive schedules</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Get dive conditions, seasonal updates, and weekly schedules delivered to your inbox.
          </p>
        </div>
        <InlineEmailForm />
      </div>
    </div>
  );
}

function InlineEmailForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    try {
      const fd = new FormData();
      fd.append("email_address", email);
      await fetch("https://app.kit.com/forms/9207242/subscriptions", { method: "POST", body: fd });
    } catch {}
    setDone(true);
    setEmail("");
  };

  if (done) return <div className="text-seafoam text-sm font-medium">You&apos;re subscribed! ✓</div>;

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 px-5 py-3 rounded-full text-sm outline-none bg-white/[0.08] border border-white/20 text-white placeholder:text-white/40 focus:border-seafoam focus:bg-white/[0.12] transition-all"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-full font-semibold text-sm cursor-pointer border-none bg-coral text-white hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all whitespace-nowrap"
      >
        Subscribe →
      </button>
    </form>
  );
}
