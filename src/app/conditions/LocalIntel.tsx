"use client";

import { useEffect, useState } from "react";

interface LocalAlert {
  title: string;
  severity: "info" | "warning" | "critical";
  category: string;
  summary: string;
  source: string;
  url: string;
}

interface LocalIntelData {
  alerts: LocalAlert[];
  sourcesChecked: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  road: "🚧",
  parking: "🅿️",
  water_quality: "🟡",
  weather: "🌊",
  event: "🎪",
  wildlife: "🦈",
  safety: "⚠️",
};

const SEVERITY_STYLES: Record<string, string> = {
  critical: "border-l-coral bg-coral/5",
  warning: "border-l-sun bg-sun/5",
  info: "border-l-slate/30 bg-white/50",
};

export function LocalIntel() {
  const [data, setData] = useState<LocalIntelData | null>(null);

  useEffect(() => {
    fetch("/api/local-intel")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  // Don't render if no alerts or still loading
  if (!data || data.alerts.length === 0) return null;

  return (
    <div className="mt-6 bg-deep rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-white font-semibold text-sm">Local Intel</div>
          <div className="text-white/40 text-[10px]">Alerts affecting La Jolla Shores</div>
        </div>
        <span className="px-2.5 py-1 bg-coral/20 text-coral rounded-full text-[10px] font-semibold">
          {data.alerts.length} alert{data.alerts.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-2">
        {data.alerts.map((alert, i) => (
          <a
            key={i}
            href={alert.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block border-l-[3px] rounded-r-lg px-3 py-2.5 no-underline transition-opacity hover:opacity-80 ${SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info}`}
          >
            <div className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">{CATEGORY_ICONS[alert.category] || "📌"}</span>
              <div>
                <div className="text-white/90 text-xs font-medium leading-snug">{alert.title}</div>
                <div className="text-white/50 text-[11px] mt-0.5">{alert.summary}</div>
                <div className="text-white/25 text-[10px] mt-1">{alert.source}</div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.06] text-[10px] text-white/25">
        Sources: lajolla.ca, sdbeachinfo, NWS, Reddit · {data.sourcesChecked} sources checked · AI-filtered
      </div>
    </div>
  );
}
