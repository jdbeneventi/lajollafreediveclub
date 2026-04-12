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

export function JourneyCard({ currentCert, completedRequirements, hasWaiver, hasMedical, hasLiability }: JourneyCardProps) {
  const nextLevel = getNextCert(currentCert);
  const workingOn = nextLevel || (currentCert ? null : "aida2" as CertLevel);

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
            const progress = isTarget ? getProgressPercent(uniqueCompleted, level) : 0;

            return (
              <div key={level} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                    isPast ? "bg-seafoam border-seafoam text-deep" :
                    isCurrent ? "bg-seafoam border-seafoam text-deep" :
                    isTarget ? "bg-transparent border-seafoam/50 text-seafoam" :
                    "bg-transparent border-white/15 text-white/30"
                  }`}>
                    {isPast || isCurrent ? "✓" : cert.name.replace("AIDA ", "")}
                  </div>
                  <div className={`text-[9px] mt-1 font-medium ${
                    isCurrent || isPast ? "text-seafoam" :
                    isTarget ? "text-seafoam/70" :
                    "text-white/25"
                  }`}>
                    {cert.name}
                  </div>
                  {isTarget && (
                    <div className="w-full mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-seafoam rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </div>
                {i < CERT_ORDER.length - 1 && (
                  <div className={`w-4 h-px mt-[-12px] ${isPast || isCurrent ? "bg-seafoam" : "bg-white/10"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active cert details */}
      {workingOn && (
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase">
                {currentCert ? "Next Certification" : "Working Toward"}
              </div>
              <div className="font-serif text-xl text-deep">{CERTIFICATIONS[workingOn].fullName}</div>
              <div className="text-xs text-slate/50">{CERTIFICATIONS[workingOn].subtitle}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-seafoam">{getProgressPercent(uniqueCompleted, workingOn)}%</div>
              <div className="text-[10px] text-slate/40">complete</div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="grid grid-cols-2 gap-2">
            {(["form", "prep", "theory", "pool", "openwater"] as const).map((cat) => {
              const { done, total } = getCategoryProgress(uniqueCompleted, workingOn, cat);
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
                        pct === 100 ? "bg-seafoam" : "bg-teal/50"
                      }`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-slate/50 font-medium">{done}/{total}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prep guide CTA */}
          {CERTIFICATIONS[workingOn].prepGuide && (
            <Link href={CERTIFICATIONS[workingOn].prepGuide!}
              className="mt-4 flex items-center justify-between px-4 py-3 bg-deep rounded-xl no-underline group hover:bg-ocean transition-colors">
              <div>
                <div className="text-[10px] font-bold text-seafoam uppercase tracking-[1px]">📖 Course Prep Guide</div>
                <div className="text-sm text-white font-medium">
                  {(() => {
                    const { done, total } = getCategoryProgress(uniqueCompleted, workingOn, "prep");
                    return done >= total ? "Completed ✓" : "Start preparing for Day 1";
                  })()}
                </div>
              </div>
              <span className="text-seafoam text-lg group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          )}
        </div>
      )}

      {/* Completed certs */}
      {currentCert && (
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
                <div key={level} className="flex items-center gap-3 px-3 py-2 bg-seafoam/[0.06] rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-seafoam/20 flex items-center justify-center">
                    <span className="text-seafoam text-xs">✓</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-deep">{cert.fullName}</div>
                    <div className="text-[10px] text-slate/40">Max depth: {cert.maxDepth}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {!workingOn && (
            <div className="mt-4 text-center">
              <div className="font-serif text-lg text-deep mb-1">Master Freediver</div>
              <p className="text-xs text-slate/50">You&apos;ve completed the highest AIDA recreational certification.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
