"use client";

import { useState } from "react";

const FIVE_DAY = [
  { day: "Day 1", name: "Breath & Conditions", ecosystem: "Foundations", theme: "The ocean starts before you enter it.", items: ["Dive reflex experiment — measure your own heart rate response", "Diaphragmatic breathing mechanics", "Baseline breath-hold (timed, buddied)", "Live conditions briefing from Scripps buoy", "Orientation swim at the sand dollar field"] },
  { day: "Day 2", name: "Equalization & Shallows", ecosystem: "Marine Mammals", theme: "Pressure is information.", items: ["Frenzel equalization — dry practice + in-water", "Duck dives, first breath-holds to 10–15 ft", "Mammalian dive reflex — how seals, whales, and humans share the same physiology", "Species: leopard sharks, garibaldi, bat rays"] },
  { day: "Day 3", name: "Kelp Forest", ecosystem: "Tidepools & Kelp", theme: "The forest underwater.", items: ["Tidepool exploration at low tide", "Kelp anatomy from wrack line specimens", "Food web modeling in journal", "Kelp forest freedives to 15–25 ft", "Species: sheephead, nudibranchs, sea stars"] },
  { day: "Day 4", name: "The Canyon", ecosystem: "Big Water", theme: "Where the ocean gets serious.", items: ["Canyon geology and upwelling", "Canyon rim dives to 20–35 ft", "Octopus, fringeheads, gorgonians", "Feel and describe the thermocline"] },
  { day: "Day 5", name: "Independent Survey", ecosystem: "Stewardship", theme: "You are the scientist now.", items: ["Final breath-hold vs. Day 1", "Independent conditions assessment", "Buddy-paired species survey", "Guided beach cleanup", "iNaturalist contributions + graduation"] },
];

const THREE_DAY = [
  { day: "Day 1", name: "Breath & Conditions", ecosystem: "Foundations", theme: "The ocean starts before you enter it.", items: ["Dive reflex experiment — heart rate documented", "Breathing mechanics + baseline breath-hold", "Live conditions briefing from Scripps + NOAA", "Orientation swim, first species IDs"] },
  { day: "Day 2", name: "Equalization & Shallows", ecosystem: "Marine Life", theme: "Pressure is information.", items: ["Frenzel equalization dry and in-water", "Open-water breath-holds to 10–15 ft", "5+ species survey in the sand flat zone", "Marine reserve — protection, history, regulations"] },
  { day: "Day 3", name: "Independent Survey", ecosystem: "Stewardship", theme: "You are the scientist now.", items: ["Final breath-hold — improvement vs. Day 1", "Independent conditions assessment + dive grade", "Species survey across visited zones", "Journal completion, iNaturalist, graduation"] },
];

export default function CampScheduleTabsLight() {
  const [tab, setTab] = useState<"5day" | "3day">("5day");
  const schedule = tab === "5day" ? FIVE_DAY : THREE_DAY;

  return (
    <div>
      <div className="camp-week-tabs">
        <button
          onClick={() => setTab("5day")}
          className={`camp-week-tab ${tab === "5day" ? "active" : ""}`}
        >
          5-Day
        </button>
        <button
          onClick={() => setTab("3day")}
          className={`camp-week-tab ${tab === "3day" ? "active" : ""}`}
        >
          3-Day
        </button>
      </div>

      <div className="camp-schedule-grid" data-cols={tab === "5day" ? "5" : "3"}>
        {schedule.map((d) => (
          <div key={d.day + d.name} className="camp-day-card">
            <div className="camp-day-tag">{d.day}</div>
            <div className="camp-day-name">{d.name}</div>
            <div className="camp-day-ecosystem">{d.ecosystem}</div>
            <div className="camp-day-theme">{d.theme}</div>
            <ul className="camp-day-list">
              {d.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
