"use client";

import { useEffect, useState } from "react";

interface BuoyData {
  waveHeight: string;
  wavePeriod: string;
  avgPeriod: string;
  windDir: string;
  windSpeed: string;
  windGust: string;
  updated: string;
}

interface VisData {
  visibility_ft_low: number | null;
  visibility_ft_high: number | null;
  grade: string;
  water_color: string;
  summary: string;
  cam_url: string;
}

interface FactorScore {
  name: string;
  score: number;
  weight: number;
  label: string;
  color: string;
  detail: string;
  education: string;
}

function parseBuoyRSS(xml: string): BuoyData | null {
  try {
    const desc = xml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/g);
    if (!desc || desc.length < 2) return null;
    const content = desc[1];
    const extract = (label: string) => {
      const re = new RegExp(`<strong>${label}:</strong>\\s*([^<]+)`, "i");
      const m = content.match(re);
      return m ? m[1].trim() : "\u2014";
    };
    const timeMatch = content.match(/<strong>([A-Z][a-z]+ \d+, \d{4} [\d:]+ [ap]m [A-Z]+)<\/strong>/);
    return {
      waveHeight: extract("Significant Wave Height"),
      wavePeriod: extract("Dominant Wave Period"),
      avgPeriod: extract("Average Period"),
      windDir: extract("Wind Direction"),
      windSpeed: extract("Wind Speed"),
      windGust: extract("Wind Gust"),
      updated: timeMatch ? timeMatch[1] : "recently",
    };
  } catch {
    return null;
  }
}

function scoreVisibility(vis: VisData | null): FactorScore {
  if (!vis || vis.visibility_ft_low === null) {
    return { name: "Visibility", score: 50, weight: 30, label: "Unknown", color: "#5a6a7a", detail: "Camera analysis unavailable \u2014 check the live underwater cam directly.", education: "Visibility is the single most important factor for dive quality. It\u2019s measured by how far you can see underwater in feet. In La Jolla, vis ranges from 5ft (murky) to 40ft+ (exceptional). It\u2019s affected by rainfall, tide, plankton blooms, swell, and upwelling events." };
  }
  const avg = ((vis.visibility_ft_low || 0) + (vis.visibility_ft_high || 0)) / 2;
  let score: number, label: string, color: string;
  if (avg >= 25) { score = 95; label = "Exceptional"; color = "#1B6B6B"; }
  else if (avg >= 20) { score = 85; label = "Excellent"; color = "#1B6B6B"; }
  else if (avg >= 15) { score = 70; label = "Good"; color = "#1B6B6B"; }
  else if (avg >= 10) { score = 55; label = "Fair"; color = "#D4A574"; }
  else if (avg >= 6) { score = 35; label = "Poor"; color = "#C75B3A"; }
  else { score = 15; label = "Very poor"; color = "#C75B3A"; }
  return { name: "Visibility", score, weight: 30, label: `${vis.visibility_ft_low}\u2013${vis.visibility_ft_high}ft \u00B7 ${label}`, color, detail: vis.summary, education: "Visibility is estimated using AI analysis of the Scripps Pier underwater camera. Reference pilings at 4ft, 11ft, 14ft, and 30ft from the camera serve as distance markers. Which pilings are visible \u2014 and how sharp they appear \u2014 determines the vis estimate. Modifiers like recent rain, tide state, and plankton blooms affect the prediction." };
}

function scoreSwell(buoy: BuoyData | null): FactorScore {
  if (!buoy) return { name: "Swell", score: 50, weight: 25, label: "No data", color: "#5a6a7a", detail: "Buoy data unavailable.", education: "Swell height and period determine surface conditions. Smaller waves with longer periods create calmer, cleaner conditions for freediving." };
  const height = parseFloat(buoy.waveHeight);
  const period = parseFloat(buoy.wavePeriod);
  let score: number, label: string, color: string;
  if (height <= 1 && period >= 10) { score = 95; label = "Glass"; color = "#1B6B6B"; }
  else if (height <= 2) { score = 80; label = "Clean"; color = "#1B6B6B"; }
  else if (height <= 3) { score = 60; label = "Manageable"; color = "#D4A574"; }
  else if (height <= 5) { score = 35; label = "Rough"; color = "#C75B3A"; }
  else { score = 15; label = "Heavy"; color = "#C75B3A"; }
  if (period >= 12) score = Math.min(100, score + 10);
  else if (period < 6) score = Math.max(0, score - 15);
  return { name: "Swell", score, weight: 25, label: `${buoy.waveHeight} @ ${buoy.wavePeriod} \u00B7 ${label}`, color, detail: height <= 2 ? "Minimal swell \u2014 flat to small conditions at most dive spots." : height <= 4 ? "Moderate swell \u2014 expect some surge at exposed spots. Protected areas like the Cove should be fine." : "Significant swell \u2014 challenging entry/exit. Experienced divers only at sheltered spots.", education: "Wave height is measured in feet at the Scripps Pier buoy (LJPC1), updated every 30 minutes. For freediving, smaller is better \u2014 calm surface means safe entry/exit and minimal surge at depth. Period (seconds between waves) matters too: longer period (12s+) means cleaner, organized swell. Short period (<6s) means choppy, confused seas even if height is low. A 2ft swell at 14 seconds is much cleaner than 2ft at 5 seconds." };
}

function scoreWind(buoy: BuoyData | null): FactorScore {
  if (!buoy) return { name: "Wind", score: 50, weight: 20, label: "No data", color: "#5a6a7a", detail: "Wind data unavailable.", education: "Wind creates surface chop and reduces visibility." };
  const speed = parseFloat(buoy.windSpeed);
  const dir = buoy.windDir;
  let score: number, label: string, color: string;
  if (speed <= 3) { score = 95; label = "Calm"; color = "#1B6B6B"; }
  else if (speed <= 7) { score = 75; label = "Light"; color = "#1B6B6B"; }
  else if (speed <= 12) { score = 50; label = "Moderate"; color = "#D4A574"; }
  else if (speed <= 18) { score = 25; label = "Windy"; color = "#C75B3A"; }
  else { score = 10; label = "Strong"; color = "#C75B3A"; }
  if (dir.includes("E") && !dir.includes("SE")) score = Math.min(100, score + 10);
  if (dir.includes("W") && speed > 8) score = Math.max(0, score - 10);
  return { name: "Wind", score, weight: 20, label: `${buoy.windSpeed} ${dir} \u00B7 ${label}`, color, detail: speed <= 5 ? "Light wind \u2014 smooth surface, minimal chop." : speed <= 10 ? `Moderate ${dir} wind \u2014 some surface texture. ${dir.includes("E") ? "Offshore direction is favorable." : ""}` : `Strong ${dir} wind \u2014 significant chop and reduced vis likely.`, education: "Wind is measured at the Scripps Pier anemometer at 20m above sea level. Direction matters: offshore (east) wind smooths the surface and can actually improve conditions, while onshore (west) wind creates chop and pushes surface debris toward shore. For freediving, calm is ideal \u2014 your dive flag needs to be visible and surface swimming between dives should be comfortable. Gusts matter too: steady 8-knot wind is more manageable than 5 knots gusting to 15." };
}

function scoreTemperature(): FactorScore {
  const tempF = 62;
  let score: number, label: string, color: string, wetsuit: string;
  if (tempF >= 70) { score = 90; label = "Warm"; color = "#1B6B6B"; wetsuit = "3mm or shorty"; }
  else if (tempF >= 65) { score = 75; label = "Comfortable"; color = "#1B6B6B"; wetsuit = "3mm full suit"; }
  else if (tempF >= 60) { score = 55; label = "Cool"; color = "#D4A574"; wetsuit = "5mm recommended"; }
  else if (tempF >= 56) { score = 35; label = "Cold"; color = "#163B4E"; wetsuit = "5mm + hood"; }
  else { score = 20; label = "Very cold"; color = "#163B4E"; wetsuit = "5mm + hood + gloves"; }
  return { name: "Water temp", score, weight: 10, label: `~${tempF}\u00B0F \u00B7 ${label}`, color, detail: `Wetsuit recommendation: ${wetsuit}.`, education: "Water temperature is measured at 3.4m depth at the La Jolla NOS station. La Jolla ranges from ~56\u00B0F in winter to ~72\u00B0F in late summer. Cold water reduces breath hold capacity and increases calorie burn. A sudden temperature drop (4\u00B0F+ in a day) often signals upwelling \u2014 cold, nutrient-rich water rising from the La Jolla Canyon \u2014 which typically brings significantly clearer visibility." };
}

function scoreSafety(): FactorScore {
  return { name: "Water safety", score: 90, weight: 15, label: "Clear", color: "#1B6B6B", detail: "No active advisories or recent rainfall detected.", education: "SD County Dept of Environmental Health tests beaches weekly for fecal indicator bacteria. After 0.2+ inches of rain, a General Advisory is issued for all coastal waters \u2014 avoid ocean contact for 72 hours. Rain destroys visibility (runoff carries sediment) and poses health risk (bacteria, urban pollutants). Check sdbeachinfo.com for latest advisories." };
}

function calculateOverallGrade(factors: FactorScore[]) {
  const safety = factors.find((f) => f.name === "Water safety");
  if (safety && safety.score < 20) return { grade: "F", score: 10, color: "#C75B3A", summary: "Water quality advisory in effect. Stay out of the water until 72 hours after rain." };
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const weightedScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0) / totalWeight;
  let grade: string, color: string, summary: string;
  if (weightedScore >= 88) { grade = "A"; color = "#1B6B6B"; summary = "Epic conditions. This is what you wait for \u2014 get in the water."; }
  else if (weightedScore >= 78) { grade = "B+"; color = "#1B6B6B"; summary = "Very good conditions. Great day for a dive at most spots."; }
  else if (weightedScore >= 68) { grade = "B"; color = "#1B6B6B"; summary = "Good conditions. Solid diving at protected spots."; }
  else if (weightedScore >= 58) { grade = "C+"; color = "#D4A574"; summary = "Fair conditions. Diveable but pick your spot carefully."; }
  else if (weightedScore >= 45) { grade = "C"; color = "#D4A574"; summary = "Below average. Consider a pool session or wait for improvement."; }
  else if (weightedScore >= 30) { grade = "D"; color = "#C75B3A"; summary = "Poor conditions. Dry training or pool day."; }
  else { grade = "F"; color = "#C75B3A"; summary = "Not recommended. Stay dry today."; }
  return { grade, score: Math.round(weightedScore), color, summary };
}

export function ConditionsWidget() {
  const [buoy, setBuoy] = useState<BuoyData | null>(null);
  const [vis, setVis] = useState<VisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/conditions").then((r) => r.text()).then((xml) => setBuoy(parseBuoyRSS(xml))).catch(() => {}).finally(() => setLoading(false));
    fetch("/api/visibility").then((r) => r.json()).then((data) => setVis(data)).catch(() => {});
  }, []);

  const factors: FactorScore[] = [scoreVisibility(vis), scoreSwell(buoy), scoreWind(buoy), scoreTemperature(), scoreSafety()];
  const overall = calculateOverallGrade(factors);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center">
        <div className="font-serif text-2xl text-deep/30 mb-2">Reading the ocean...</div>
        <div className="text-sm text-[#5a6a7a]">Pulling data from Scripps Pier buoy and underwater camera</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="p-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center shrink-0" style={{ background: overall.color + "15" }}>
          <span className="font-serif text-5xl" style={{ color: overall.color }}>{overall.grade}</span>
        </div>
        <div className="flex-1">
          <div className="section-label">La Jolla dive conditions</div>
          <h2 className="font-serif text-2xl tracking-tight mb-2">{overall.summary}</h2>
          <div className="text-xs text-[#5a6a7a]">Score: {overall.score}/100 · Updated {buoy?.updated || "recently"} · Sources: NDBC LJPC1, Scripps Pier Cam, NOAA</div>
        </div>
      </div>

      <div className="border-t border-deep/[0.06]">
        {factors.map((factor) => (
          <div key={factor.name} className="px-8 py-5 border-b border-deep/[0.04] last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{factor.name}</span>
                <span className="text-[10px] text-[#5a6a7a]">({factor.weight}%)</span>
                <button onClick={() => setOpenTooltip(openTooltip === factor.name ? null : factor.name)} className="ml-1 w-4 h-4 rounded-full bg-deep/[0.06] text-[#5a6a7a] text-[9px] font-bold inline-flex items-center justify-center hover:bg-deep/[0.12] transition-colors" aria-label={`Learn about ${factor.name}`}>?</button>
              </div>
              <span className="text-sm font-medium" style={{ color: factor.color }}>{factor.label}</span>
            </div>
            <div className="h-2 bg-deep/[0.06] rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${factor.score}%`, background: factor.color }} />
            </div>
            <p className="text-xs text-[#5a6a7a] leading-relaxed">{factor.detail}</p>
            {openTooltip === factor.name && (
              <div className="mt-3 p-4 bg-deep text-white/80 rounded-xl text-xs leading-relaxed">
                <div className="font-semibold text-white text-[11px] mb-1.5">How we measure this</div>
                {factor.education}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-8 py-4 bg-salt/50 flex flex-wrap gap-3">
        {[
          { label: "Underwater cam", url: "https://coollab.ucsd.edu/pierviz/" },
          { label: "Surface cam", url: "https://scripps.ucsd.edu/piercam" },
          { label: "Full buoy data", url: "https://www.ndbc.noaa.gov/station_page.php?station=ljpc1" },
          { label: "Wave forecast", url: "https://cdip.ucsd.edu/themes/?d2=p70:s:073:st:1" },
          { label: "Beach advisories", url: "https://www.sdbeachinfo.com/" },
        ].map((link) => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white rounded-full text-xs text-teal font-medium no-underline hover:shadow-sm transition-shadow">
            {link.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}
