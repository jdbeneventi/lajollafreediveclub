"use client";

import { useEffect, useState } from "react";

interface MoonData {
  phase: string;
  emoji: string;
  illumination: number;
  age: number;
  isSpringTide: boolean;
  isNeapTide: boolean;
  diveTip: string;
  nightDiveTip: string;
  nextFullMoon: string;
  nextNewMoon: string;
}

interface SeasonalEvent {
  title: string;
  detail: string;
  category: string;
  icon: string;
  priority: number;
}

interface AlmanacData {
  moon: MoonData;
  seasonal: SeasonalEvent[];
  grunionTonight: boolean;
}

export function AlmanacWidget() {
  const [data, setData] = useState<AlmanacData | null>(null);

  useEffect(() => {
    fetch("/api/almanac")
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  if (!data) return null;

  const { moon, seasonal, grunionTonight } = data;

  return (
    <div className="space-y-4">
      {/* Grunion alert */}
      {grunionTonight && (
        <div className="bg-[#D4A574]/10 border border-[#D4A574]/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🐟</span>
            <span className="font-serif text-base text-deep">Grunion run tonight</span>
          </div>
          <p className="text-xs text-[#5a6a7a] leading-relaxed">
            Grunion spawn on the beach 1–3 hours after high tide on full and new moon nights.
            Head to La Jolla Shores after dark — they ride the waves onto the sand.
            {moon.age < 5 || moon.age > 25
              ? " April–May is look-only (closed season). June–March you can take by hand with a fishing license."
              : ""}
          </p>
        </div>
      )}

      {/* Moon phase + tide card */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{moon.emoji}</span>
              <div>
                <div className="font-serif text-lg text-deep">{moon.phase}</div>
                <div className="text-xs text-[#5a6a7a]">{moon.illumination}% illuminated</div>
              </div>
            </div>
            <div className="text-right">
              {moon.isSpringTide && (
                <span className="px-2 py-1 bg-[#C75B3A]/10 text-[#C75B3A] text-[10px] font-semibold rounded-full">
                  Spring Tide
                </span>
              )}
              {moon.isNeapTide && (
                <span className="px-2 py-1 bg-teal/10 text-teal text-[10px] font-semibold rounded-full">
                  Neap Tide
                </span>
              )}
            </div>
          </div>

          {/* Dive implications */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 bg-salt rounded-lg">
              <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-1">Tides</div>
              <p className="text-xs text-deep leading-relaxed">{moon.diveTip}</p>
            </div>
            <div className="p-3 bg-salt rounded-lg">
              <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-1">Night diving</div>
              <p className="text-xs text-deep leading-relaxed">{moon.nightDiveTip}</p>
            </div>
          </div>

          {/* Next phases */}
          <div className="mt-3 flex gap-4 text-[10px] text-[#5a6a7a]">
            <span>Next full moon: {moon.nextFullMoon}</span>
            <span>Next new moon: {moon.nextNewMoon}</span>
          </div>
        </div>
      </div>

      {/* What's in the water right now */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="section-label">Right now in La Jolla</div>
          <h3 className="font-serif text-xl text-deep mb-4">What&apos;s in the water</h3>

          <div className="space-y-3">
            {seasonal.map((event, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-lg shrink-0 mt-0.5">{event.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-deep">{event.title}</span>
                    <span className="px-1.5 py-0.5 bg-deep/5 rounded text-[9px] text-[#5a6a7a] capitalize">{event.category}</span>
                  </div>
                  <p className="text-xs text-[#5a6a7a] leading-relaxed">{event.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Links to tides and gear pages */}
        <div className="px-6 py-4 bg-salt/50 flex flex-wrap gap-3 border-t border-deep/[0.04]">
          <a href="/tides" className="px-3 py-1.5 bg-white rounded-full text-xs text-teal font-medium no-underline hover:shadow-sm transition-shadow">
            7-day tide calendar →
          </a>
          <a href="/gear" className="px-3 py-1.5 bg-white rounded-full text-xs text-teal font-medium no-underline hover:shadow-sm transition-shadow">
            Gear guide →
          </a>
          <a href="/map" className="px-3 py-1.5 bg-white rounded-full text-xs text-teal font-medium no-underline hover:shadow-sm transition-shadow">
            Underwater field guide →
          </a>
        </div>
      </div>
    </div>
  );
}
