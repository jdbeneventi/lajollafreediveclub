"use client";

import { useState, useEffect } from "react";

interface Sighting {
  source: string;
  type: string;
  icon: string;
  title: string;
  description: string;
  date: string;
  url?: string;
  image?: string;
}

export function OceanIntel() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/ocean-intel")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setSightings(data.sightings || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (error) return null; // Silently fail — don't break the conditions page

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T12:00:00");
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">Ocean Intel</div>
          <h3 className="font-serif text-xl tracking-tight">Recent sightings</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal/10 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="text-[9px] text-teal font-semibold">LIVE</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 items-start animate-pulse">
              <div className="w-8 h-8 bg-deep/[0.06] rounded-lg shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-deep/[0.06] rounded w-3/4 mb-2" />
                <div className="h-2 bg-deep/[0.04] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : sightings.length === 0 ? (
        <p className="text-sm text-[#5a6a7a]">No recent sightings reported. Check back later.</p>
      ) : (
        <div className="space-y-1">
          {sightings.slice(0, 12).map((s, i) => (
            <a
              key={i}
              href={s.url || "#"}
              target={s.url ? "_blank" : undefined}
              rel={s.url ? "noopener noreferrer" : undefined}
              className="flex gap-3 items-start py-2.5 px-2 -mx-2 rounded-lg no-underline text-deep hover:bg-salt/80 transition-colors group"
            >
              <span className="text-lg shrink-0 mt-0.5">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-snug group-hover:text-teal transition-colors line-clamp-2">
                  {s.title}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-[#5a6a7a]">{formatDate(s.date)}</span>
                  <span className="text-[10px] text-[#5a6a7a]">·</span>
                  <span className="text-[10px] text-[#5a6a7a]">{s.source}</span>
                </div>
              </div>
              {s.image && (
                <img
                  src={s.image}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
              )}
            </a>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-deep/[0.06] text-[10px] text-[#5a6a7a]">
        Aggregated from iNaturalist, Reddit, and CDFW. Community-reported sightings — verify before diving.
      </div>
    </div>
  );
}
