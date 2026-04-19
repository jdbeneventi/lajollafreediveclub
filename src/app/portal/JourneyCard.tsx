"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CERTIFICATIONS,
  CERT_ORDER,
  getNextCert,
  getProgressPercent,
  getCategoryProgress,
  type CertLevel,
  type Requirement,
} from "@/lib/certifications";

interface JourneyCardProps {
  currentCert: CertLevel | null;
  bookedLevel: CertLevel | null;
  completedRequirements: string[];
  hasWaiver: boolean;
  hasMedical: boolean;
  hasLiability: boolean;
}

const CATEGORY_LABELS: Record<Requirement["category"], { label: string; icon: string }> = {
  form: { label: "Forms", icon: "📋" },
  prep: { label: "Preparation", icon: "📖" },
  theory: { label: "Theory", icon: "🧠" },
  pool: { label: "Pool", icon: "🏊" },
  openwater: { label: "Open Water", icon: "🌊" },
};

export function JourneyCard({ currentCert, bookedLevel, completedRequirements, hasWaiver, hasMedical, hasLiability }: JourneyCardProps) {
  const nextLevel = getNextCert(currentCert);
  const workingOn = nextLevel || (currentCert ? null : bookedLevel || null);

  // Build the full completed set including form status from existing tables
  const allCompleted = [...completedRequirements];
  if (hasWaiver) {
    CERT_ORDER.forEach((l) => allCompleted.push(`${l.replace("aida", "a")}-waiver`));
  }
  if (hasMedical) {
    CERT_ORDER.forEach((l) => allCompleted.push(`${l.replace("aida", "a")}-medical`));
  }
  if (hasLiability) {
    CERT_ORDER.forEach((l) => allCompleted.push(`${l.replace("aida", "a")}-liability`));
  }
  const uniqueCompleted = Array.from(new Set(allCompleted));

  // Default expanded to the level the student is working on
  const [expanded, setExpanded] = useState<CertLevel | null>(workingOn);

  function toggleLevel(level: CertLevel) {
    setExpanded(expanded === level ? null : level);
  }

  const expandedCert = expanded ? CERTIFICATIONS[expanded] : null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* Journey path */}
      <div className="bg-gradient-to-r from-deep to-ocean px-6 py-5">
        <h2 className="font-serif text-lg text-white mb-3">Your Journey</h2>
        <div className="flex items-center gap-1">
          {CERT_ORDER.map((level, i) => {
            const cert = CERTIFICATIONS[level];
            const isCurrent = level === currentCert;
            const isTarget = level === workingOn;
            const isPast = currentCert ? CERT_ORDER.indexOf(level) < CERT_ORDER.indexOf(currentCert) : false;
            const isExpanded = level === expanded;
            const progress = isTarget ? getProgressPercent(uniqueCompleted, level) : 0;

            return (
              <div key={level} className="flex items-center flex-1">
                <button onClick={() => toggleLevel(level)} className="flex flex-col items-center flex-1 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                    isPast ? "bg-seafoam border-seafoam text-deep" :
                    isCurrent ? "bg-seafoam border-seafoam text-deep" :
                    isExpanded ? "bg-transparent border-seafoam text-seafoam scale-110" :
                    isTarget ? "bg-transparent border-seafoam/50 text-seafoam" :
                    "bg-transparent border-white/15 text-white/30 group-hover:border-white/30 group-hover:text-white/50"
                  }`}>
                    {isPast || isCurrent ? "✓" : cert.name.replace("AIDA ", "")}
                  </div>
                  <div className={`text-[9px] mt-1 font-medium transition-colors ${
                    isExpanded ? "text-seafoam" :
                    isCurrent || isPast ? "text-seafoam" :
                    isTarget ? "text-seafoam/70" :
                    "text-white/25 group-hover:text-white/40"
                  }`}>
                    {cert.name}
                  </div>
                  {isTarget && (
                    <div className="w-full mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-seafoam rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </button>
                {i < CERT_ORDER.length - 1 && (
                  <div className={`w-4 h-px mt-[-12px] ${isPast || isCurrent ? "bg-seafoam" : "bg-white/10"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded cert details */}
      {expandedCert && (() => {
        const level = expanded!;
        const isCurrent = level === currentCert;
        const isPast = currentCert ? CERT_ORDER.indexOf(level) < CERT_ORDER.indexOf(currentCert) : false;
        const isTarget = level === workingOn;
        const progress = getProgressPercent(uniqueCompleted, level);
        const prereqCert = expandedCert.prereq ? CERTIFICATIONS[expandedCert.prereq] : null;

        return (
          <div className="px-6 py-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase">
                  {isPast || isCurrent ? "Certified" : isTarget ? "Working Toward" : "Preview"}
                </div>
                <div className="font-serif text-xl text-deep">{expandedCert.fullName}</div>
                <div className="text-xs text-slate/50">{expandedCert.subtitle}</div>
              </div>
              {isTarget && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-seafoam">{progress}%</div>
                  <div className="text-[10px] text-slate/40">complete</div>
                </div>
              )}
              {(isPast || isCurrent) && (
                <div className="w-10 h-10 rounded-full bg-seafoam/10 flex items-center justify-center">
                  <span className="text-seafoam text-lg">✓</span>
                </div>
              )}
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-salt rounded-lg px-2.5 py-2 text-center">
                <div className="text-[9px] text-slate/40 uppercase">Depth</div>
                <div className="text-sm font-bold text-deep">{expandedCert.maxDepth}</div>
              </div>
              <div className="bg-salt rounded-lg px-2.5 py-2 text-center">
                <div className="text-[9px] text-slate/40 uppercase">Duration</div>
                <div className="text-sm font-bold text-deep">{expandedCert.duration}</div>
              </div>
              <div className="bg-salt rounded-lg px-2.5 py-2 text-center">
                <div className="text-[9px] text-slate/40 uppercase">Group</div>
                <div className="text-sm font-bold text-deep">${expandedCert.price}</div>
              </div>
              {expandedCert.pricePrivate && (
                <div className="bg-salt rounded-lg px-2.5 py-2 text-center">
                  <div className="text-[9px] text-slate/40 uppercase">Private</div>
                  <div className="text-sm font-bold text-deep">${expandedCert.pricePrivate}</div>
                </div>
              )}
              {!expandedCert.pricePrivate && (
                <div className="bg-salt rounded-lg px-2.5 py-2 text-center">
                  <div className="text-[9px] text-slate/40 uppercase">Prereq</div>
                  <div className="text-sm font-bold text-deep">{prereqCert ? prereqCert.name : "None"}</div>
                </div>
              )}
            </div>

            {prereqCert && (
              <div className="text-[10px] text-slate/40 mb-4">
                Requires: {prereqCert.fullName} ({prereqCert.name})
              </div>
            )}

            {/* Category breakdown — show for any level */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(["form", "prep", "theory", "pool", "openwater"] as const).map((cat) => {
                const { done, total } = getCategoryProgress(uniqueCompleted, level, cat);
                if (total === 0) return null;
                const meta = CATEGORY_LABELS[cat];
                const pct = Math.round((done / total) * 100);
                return (
                  <div key={cat} className="bg-salt rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs">{meta.icon}</span>
                      <span className="text-[11px] font-semibold text-deep">{meta.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-deep/[0.06] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${
                          pct === 100 ? "bg-seafoam" : isTarget ? "bg-teal/50" : "bg-deep/10"
                        }`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-slate/50 font-medium">{done}/{total}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Requirements list */}
            <details className="group">
              <summary className="text-[10px] text-teal/50 font-medium cursor-pointer hover:text-teal transition-colors list-none flex items-center gap-1">
                <span className="group-open:rotate-90 transition-transform text-[8px]">▶</span>
                {expandedCert.requirements.length} requirements
              </summary>
              <div className="mt-2 space-y-1">
                {expandedCert.requirements.map((req) => {
                  const done = uniqueCompleted.includes(req.id);
                  return (
                    <div key={req.id} className="flex items-center gap-2 py-1">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] shrink-0 ${
                        done ? "bg-seafoam text-white" : "border border-deep/15 text-deep/20"
                      }`}>
                        {done ? "✓" : ""}
                      </span>
                      <span className={`text-xs ${done ? "text-deep" : "text-slate/50"}`}>{req.label}</span>
                    </div>
                  );
                })}
              </div>
            </details>

            {/* Prep guide CTA */}
            {expandedCert.prepGuide && (
              <Link href={expandedCert.prepGuide}
                className="mt-4 flex items-center justify-between px-4 py-3 bg-deep rounded-xl no-underline group hover:bg-ocean transition-colors">
                <div>
                  <div className="text-[10px] font-bold text-seafoam uppercase tracking-[1px]">📖 Course Prep Guide</div>
                  <div className="text-sm text-white font-medium">
                    {(() => {
                      const { done, total } = getCategoryProgress(uniqueCompleted, level, "prep");
                      return done >= total ? "Completed ✓" : "Start preparing for Day 1";
                    })()}
                  </div>
                </div>
                <span className="text-seafoam text-lg group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            )}

            {/* Book CTA for levels the student hasn't reached yet */}
            {!isPast && !isCurrent && !isTarget && (
              <Link href={`/contact/courses?course=${encodeURIComponent(expandedCert.fullName)}`}
                className="mt-4 flex items-center justify-center px-4 py-3 border border-teal/20 rounded-xl no-underline text-teal text-sm font-medium hover:bg-teal/5 transition-colors">
                Inquire about {expandedCert.name} →
              </Link>
            )}
          </div>
        );
      })()}

      {/* Completed certs — only if nothing is expanded */}
      {!expanded && currentCert && (
        <div className="px-6 pb-5">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-2">Certifications Held</div>
          <div className="space-y-1.5">
            {CERT_ORDER.filter((l) => {
              const idx = CERT_ORDER.indexOf(l);
              const curIdx = CERT_ORDER.indexOf(currentCert);
              return idx <= curIdx;
            }).map((level) => {
              const cert = CERTIFICATIONS[level];
              return (
                <button key={level} onClick={() => toggleLevel(level)}
                  className="w-full flex items-center gap-3 px-3 py-2 bg-seafoam/[0.06] rounded-lg hover:bg-seafoam/10 transition-colors text-left">
                  <div className="w-6 h-6 rounded-full bg-seafoam/20 flex items-center justify-center">
                    <span className="text-seafoam text-xs">✓</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-deep">{cert.fullName}</div>
                    <div className="text-[10px] text-slate/40">Max depth: {cert.maxDepth}</div>
                  </div>
                  <span className="text-slate/30 text-xs">▸</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
