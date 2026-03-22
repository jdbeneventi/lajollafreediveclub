"use client";

import { useEffect, useState } from "react";

interface WaterQualityData {
  status: "green" | "yellow" | "red";
  advisoryCount: number;
  closureCount: number;
  rainWarning: boolean;
  alerts: { icon: string; station: string; detail: string }[];
}

const STATUS_CONFIG = {
  green: { label: "All Clear", color: "text-seafoam", bg: "bg-seafoam/10", border: "border-seafoam/20", dot: "bg-seafoam" },
  yellow: { label: "Advisories Active", color: "text-sun", bg: "bg-sun/10", border: "border-sun/20", dot: "bg-sun" },
  red: { label: "Closures Active", color: "text-coral", bg: "bg-coral/10", border: "border-coral/20", dot: "bg-coral" },
};

export function WaterQualityCard() {
  const [data, setData] = useState<WaterQualityData | null>(null);

  useEffect(() => {
    fetch("/api/water-quality")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return null;

  const config = STATUS_CONFIG[data.status];

  return (
    <div className="mt-6 bg-deep rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${config.dot} animate-pulse`} />
          <div>
            <div className="text-white font-semibold text-sm">Water Quality</div>
            <div className={`text-xs font-medium ${config.color}`}>{config.label}</div>
          </div>
        </div>
        <a
          href="https://www.sdbeachinfo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/[0.08] text-white/60 rounded-full text-[10px] font-semibold no-underline hover:bg-white/[0.12] transition-colors"
        >
          sdbeachinfo.com ↗
        </a>
      </div>

      {data.rainWarning && (
        <div className="bg-sun/10 border border-sun/20 rounded-lg px-4 py-2.5 mb-3 flex items-start gap-2">
          <span className="shrink-0">🌧️</span>
          <div className="text-xs text-white/70 leading-relaxed">
            <strong className="text-sun">Rain runoff warning</strong> — recent or forecasted rain increases bacteria at beach entries. Avoid storm drains and river mouths.
          </div>
        </div>
      )}

      <div className="space-y-2">
        {data.alerts.map((alert, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs">
            <span className="shrink-0 mt-0.5">{alert.icon}</span>
            <div>
              <span className="text-white/80 font-medium">{alert.station}</span>
              <span className="text-white/40 ml-1">— {alert.detail}</span>
            </div>
          </div>
        ))}
      </div>

      {data.advisoryCount > 0 && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] text-[10px] text-white/30">
          {data.advisoryCount} advisories, {data.closureCount} closures active countywide · Source: SD County DEH
        </div>
      )}
    </div>
  );
}
