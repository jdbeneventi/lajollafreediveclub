"use client";

import { useState } from "react";

const FIVE_DAY = [
  { day: "Day 1", name: "Breath & Conditions", theme: "The ocean starts before you enter it.", items: ["Mammalian dive reflex experiment — students measure their own heart rate", "Diaphragmatic breathing mechanics and dry practice", "Baseline breath-hold (timed, buddied, documented)", "Live conditions briefing — Scripps buoy, NOAA tides, NWS forecast", "Orientation swim at the sand dollar field"] },
  { day: "Day 2", name: "Equalization & The Shallows", theme: "Pressure is information.", items: ["Frenzel equalization technique — dry and in-water checkpoints", "Duck dive mechanics and first open-water breath-holds to 10–15ft", "Marine reserve orientation — what's protected and why", "5+ species identification in sand flat and shallows", "Leopard sharks, garibaldi, bat rays, horn sharks"] },
  { day: "Day 3", name: "Kelp Forest", theme: "The forest underwater.", items: ["Kelp anatomy from wrack line specimens", "Food web modeling exercise in the student journal", "Kelp forest freedives to 15–25ft", "5 new species: sheephead, nudibranchs, sea stars, lobster", "Guest educator (when scheduled)"] },
  { day: "Day 4", name: "The Canyon", theme: "Where the ocean gets serious.", items: ["Submarine canyon geology and upwelling mechanics", "Canyon rim dives to 20–35ft (depth-appropriate)", "Wall species: red octopus, sarcastic fringeheads, gorgonians", "Thermocline experience — students feel and describe the transition", "Guest educator: San Diego Marine Safety / lifeguard"] },
  { day: "Day 5", name: "Independent Survey", theme: "You are the scientist now.", items: ["Final breath-hold — improvement vs. Day 1 documented", "Independent conditions assessment — each student writes their own dive grade", "Buddy-paired species survey across all depth zones", "15+ cumulative species target across the week", "iNaturalist contributions + journal completion + graduation"] },
];

const THREE_DAY = [
  { day: "Day 1", name: "Breath & Conditions", theme: "The ocean starts before you enter it.", items: ["Mammalian dive reflex experiment — heart rate documented", "Diaphragmatic breathing mechanics and baseline breath-hold", "Live conditions briefing from Scripps buoy and NOAA data", "Orientation swim at the sand dollar field", "First species identifications in the shallows"] },
  { day: "Day 2", name: "Equalization & The Shallows", theme: "Pressure is information.", items: ["Frenzel equalization — dry and in-water", "First open-water breath-holds to 10–15ft", "5+ species survey in sand flat zone", "Marine reserve — protection, history, regulations", "Duck dive technique refinement"] },
  { day: "Day 3", name: "Independent Survey", theme: "You are the scientist now.", items: ["Final breath-hold — improvement vs. Day 1 documented", "Independent conditions assessment with dive grade recommendation", "Species survey across visited zones", "Journal completion and iNaturalist contributions", "Graduation"] },
];

export default function CampScheduleTabs() {
  const [tab, setTab] = useState<"5day" | "3day">("5day");
  const schedule = tab === "5day" ? FIVE_DAY : THREE_DAY;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-0 mb-8 border-b border-white/[0.06]">
        <button
          onClick={() => setTab("5day")}
          className={`px-5 py-3 text-[9px] uppercase tracking-[0.18em] font-medium border-b-2 -mb-px transition-colors bg-transparent cursor-pointer ${
            tab === "5day"
              ? "text-[#E8682A] border-[#E8682A]"
              : "text-white/30 border-transparent hover:text-white/50"
          }`}
        >
          5-Day Full Week
        </button>
        <button
          onClick={() => setTab("3day")}
          className={`px-5 py-3 text-[9px] uppercase tracking-[0.18em] font-medium border-b-2 -mb-px transition-colors bg-transparent cursor-pointer ${
            tab === "3day"
              ? "text-[#E8682A] border-[#E8682A]"
              : "text-white/30 border-transparent hover:text-white/50"
          }`}
        >
          3-Day Immersion
        </button>
      </div>

      {/* Day cards */}
      <div className={`grid gap-px bg-seafoam/[0.06] border border-seafoam/[0.06] ${
        tab === "5day" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-3"
      }`}>
        {schedule.map((d) => (
          <div key={d.day + d.name} className="bg-deep p-5 sm:p-6">
            <div className="text-[9px] uppercase tracking-[0.18em] text-seafoam/35 font-medium mb-1">
              {d.day}
            </div>
            <div className="font-serif text-base text-white mb-0.5">{d.name}</div>
            <div className="font-serif italic text-xs text-[#E8682A]/70 mb-4">{d.theme}</div>
            <ul className="space-y-1.5">
              {d.items.map((item, i) => (
                <li key={i} className="text-[11px] text-white/35 leading-[1.5] pl-3 relative">
                  <span className="absolute left-0 top-[0.45em] w-[3px] h-[3px] rounded-full bg-[#E8682A]/40" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-white/20 mt-4 leading-relaxed">
        All sessions 9am–3pm · Ages 8–14 · Gear provided · Student observation journal included
      </p>
    </div>
  );
}
