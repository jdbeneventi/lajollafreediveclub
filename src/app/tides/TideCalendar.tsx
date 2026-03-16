"use client";

import { useEffect, useState } from "react";

interface TideEvent { time: string; height: string; type: string; }
interface DayTide {
  date: string;
  dayName: string;
  displayDate: string;
  events: TideEvent[];
  lowestTide: { height: string; time: string };
  highestTide: { height: string; time: string };
  bestDiveWindows: string[];
  tideRange: string;
  tideQuality: string;
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function TideCalendar() {
  const [days, setDays] = useState<DayTide[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceUrl, setSourceUrl] = useState("");

  useEffect(() => {
    fetch("/api/tides?days=7")
      .then(r => r.json())
      .then(d => { if (d.days) setDays(d.days); if (d.source_url) setSourceUrl(d.source_url); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-white rounded-2xl p-12 text-center">
      <div className="font-serif text-2xl text-deep/30 mb-2">Loading tides...</div>
      <div className="text-sm text-[#5a6a7a]">Fetching predictions from NOAA</div>
    </div>
  );

  if (days.length === 0) return (
    <div className="bg-white rounded-2xl p-12 text-center">
      <div className="text-sm text-[#5a6a7a]">Tide data temporarily unavailable. Check back soon.</div>
    </div>
  );

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });

  return (
    <div className="space-y-6">
      {/* 7-day cards */}
      <div className="space-y-3">
        {days.map((day) => {
          const isToday = day.date === today;
          return (
            <div key={day.date} className={`bg-white rounded-xl overflow-hidden ${isToday ? "ring-2 ring-teal" : ""}`}>
              {/* Day header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-deep/[0.06]">
                <div className="flex items-center gap-3">
                  <div className={`font-serif text-lg ${isToday ? "text-teal" : "text-deep"}`}>{day.dayName}</div>
                  <div className="text-sm text-[#5a6a7a]">{day.displayDate}</div>
                  {isToday && <span className="px-2 py-0.5 bg-teal/10 text-teal text-[10px] font-semibold rounded-full">Today</span>}
                </div>
                <div className="text-xs text-[#5a6a7a]">
                  Range: {day.tideRange}ft
                </div>
              </div>

              <div className="p-6">
                {/* Tide events row */}
                <div className="flex gap-4 flex-wrap mb-4">
                  {day.events.map((event, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${event.type === "high" ? "bg-[#1B6B6B]" : "bg-[#163B4E]"}`}>
                        {event.type === "high" ? "H" : "L"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-deep">{parseFloat(event.height) > 0 ? "+" : ""}{event.height}ft</div>
                        <div className="text-[10px] text-[#5a6a7a]">{formatTime(event.time.split(" ")[1])}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Best dive windows */}
                {day.bestDiveWindows.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold shrink-0 mt-0.5">Best dive window:</span>
                    <div className="flex flex-wrap gap-2">
                      {day.bestDiveWindows.map((w, i) => (
                        <span key={i} className="px-2 py-0.5 bg-teal/10 text-teal text-xs font-medium rounded-full">{w}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tide tips */}
      <div className="bg-white rounded-2xl p-8">
        <h3 className="font-serif text-lg mb-4">How tides affect your freedive</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Incoming tide = better vis", detail: "As the tide comes in, cleaner ocean water pushes toward shore, replacing the murkier water that sits in the shallows. Best vis is usually 1-3 hours after a low tide." },
            { title: "Outgoing tide = more current", detail: "Water pulling back offshore can create current and pull sediment off the bottom, reducing visibility. Strong outgoing tides make surface swimming harder." },
            { title: "Low tide = exposed features", detail: "At very low tides (negative values), more of the reef and rocky structure is exposed or very shallow. Good for exploring tide pools before your dive." },
            { title: "Big swings = stronger movement", detail: "Days with large tidal range (5ft+) have stronger currents. Small tidal range days are generally calmer and easier for beginners." },
            { title: "Negative tides", detail: "When tide height goes below 0ft (MLLW datum), the water is lower than average low. These are the best days for tide pooling and can create excellent vis on the incoming." },
            { title: "Spring vs neap tides", detail: "Around full and new moons, tidal swings are larger (spring tides). Around quarter moons, swings are smaller (neap tides). Neap tides = gentler conditions." },
          ].map((tip) => (
            <div key={tip.title}>
              <div className="text-sm font-medium text-deep mb-1">{tip.title}</div>
              <p className="text-xs text-[#5a6a7a] leading-relaxed">{tip.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Source */}
      <div className="text-center">
        <a href={sourceUrl || "https://tidesandcurrents.noaa.gov/stationhome.html?id=9410230"} target="_blank" rel="noopener noreferrer" className="text-[10px] text-teal/60 hover:text-teal no-underline">
          Source: NOAA CO-OPS Station 9410230 (La Jolla) ↗
        </a>
      </div>
    </div>
  );
}
