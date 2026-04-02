import Link from "next/link";

export function SaturdayBanner() {
  return (
    <div className="bg-deep border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-seafoam animate-pulse-slow" />
          <span className="text-white/60 text-sm">
            <strong className="text-white/80 font-medium">Every Saturday</strong>
            {" "}&middot; Flow + Dry Training 7–8:15am &middot; Line Diving 8:30–10am &middot; La Jolla Shores
          </span>
        </div>
        <Link
          href="/saturday-sessions"
          className="text-seafoam text-xs font-medium tracking-wide no-underline hover:text-white transition-colors shrink-0"
        >
          Register this week &rarr;
        </Link>
      </div>
    </div>
  );
}
