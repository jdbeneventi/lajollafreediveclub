import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SaturdayRSVP } from "./SaturdayRSVP";

const grain = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
};

export default function SaturdaySessionsPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/group-freedive.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/60 to-deep/20" />
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24 max-w-[1200px] mx-auto">
          <Reveal>
            <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4">
              Every Saturday · La Jolla Shores · 7:00–10:00 AM
            </div>
            <h1 className="font-serif text-[clamp(2.8rem,7vw,5rem)] text-white font-normal leading-[1.05] tracking-tight max-w-[700px]">
              Saturday at{" "}
              <em className="italic text-seafoam">the Shores</em>
            </h1>
            <p className="text-white/45 text-lg mt-4 max-w-[520px] leading-relaxed">
              Ocean Flow. Breathing drills. Line diving.
              <br />
              Three phases. One morning. Register so we can plan.
            </p>
            <div className="flex gap-4 flex-wrap items-center mt-6">
              <a href="#register" className="inline-flex px-8 py-3.5 bg-coral text-white rounded-full font-semibold no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all">
                Register for Saturday →
              </a>
              <a href="#options" className="text-white/50 text-sm no-underline border-b border-white/20 pb-px hover:text-white transition-colors">
                See the morning
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THREE OPTIONS ── */}
      <section id="options" className="bg-deep py-16 md:py-20 px-6 relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] text-white">Three ways to join</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-6">
              {/* Full Morning */}
              <div className="bg-white/[0.04] border border-seafoam/15 rounded-2xl p-7 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-seafoam text-deep text-[10px] font-semibold tracking-wide uppercase rounded-full whitespace-nowrap">
                  The Complete Morning
                </div>
                <h3 className="font-serif text-xl text-white mt-3 mb-4">Everything</h3>
                <div className="space-y-3 text-left">
                  <div className="flex gap-3 items-start">
                    <span className="text-seafoam/60 text-xs mt-0.5 shrink-0">7:00</span>
                    <span className="text-white/60 text-sm">Ocean Flow — yoga on the beach</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="text-seafoam/60 text-xs mt-0.5 shrink-0">7:45</span>
                    <span className="text-white/60 text-sm">Dry Training — breathing drills + CO₂ work</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="text-seafoam/60 text-xs mt-0.5 shrink-0">8:30</span>
                    <span className="text-white/60 text-sm">Line Diving — canyon edge, buddied</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <p className="text-white/30 text-xs">Cert required for diving (any agency)</p>
                </div>
              </div>

              {/* Just Dive */}
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 text-white/60 text-[10px] font-semibold tracking-wide uppercase rounded-full whitespace-nowrap">
                  Skip the beach session
                </div>
                <h3 className="font-serif text-xl text-white mt-3 mb-4">Just Dive</h3>
                <div className="space-y-3 text-left">
                  <div className="flex gap-3 items-start">
                    <span className="text-white/30 text-xs mt-0.5 shrink-0">8:30</span>
                    <span className="text-white/60 text-sm">Line Diving — show up at Kellogg Park ready to go</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <p className="text-white/30 text-xs">Cert required · own gear + lanyard</p>
                </div>
              </div>

              {/* Just Beach */}
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 text-white/60 text-[10px] font-semibold tracking-wide uppercase rounded-full whitespace-nowrap">
                  No cert needed
                </div>
                <h3 className="font-serif text-xl text-white mt-3 mb-4">Just Beach</h3>
                <div className="space-y-3 text-left">
                  <div className="flex gap-3 items-start">
                    <span className="text-white/30 text-xs mt-0.5 shrink-0">7:00</span>
                    <span className="text-white/60 text-sm">Ocean Flow — yoga on the beach</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="text-white/30 text-xs mt-0.5 shrink-0">7:45</span>
                    <span className="text-white/60 text-sm">Dry Training — breathing drills + CO₂ work</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <p className="text-white/30 text-xs">Open to everyone · bring a towel + water</p>
                </div>
              </div>
            </div>

            <div className="bg-seafoam/[0.08] border border-seafoam/15 rounded-xl p-5 text-center">
              <p className="text-seafoam text-sm font-medium mb-1">Not certified yet?</p>
              <p className="text-white/35 text-xs leading-relaxed">
                Start with a course and join us on Saturdays. <Link href="/contact/courses?course=aida2" className="text-seafoam/80 underline">View courses →</Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── REGISTER ── */}
      <section id="register" className="bg-gradient-to-br from-ocean to-teal py-16 md:py-24 px-6 relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[520px] mx-auto relative z-10">
          <SaturdayRSVP />
        </div>
      </section>

      {/* ── UPCOMING EVENT ── */}
      <section className="bg-deep py-14 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Reveal>
            <Link href="/events/big-blue-night" className="block no-underline group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8 hover:bg-white/[0.05] transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-seafoam/15 border border-seafoam/25 rounded-full text-seafoam text-[10px] font-medium tracking-[0.15em] uppercase">
                  Free Event
                </span>
                <span className="text-white/25 text-xs">Friday, April 25</span>
              </div>
              <h3 className="font-serif text-xl text-white italic group-hover:text-seafoam transition-colors">
                &ldquo;The Big Blue&rdquo; — Movie Night at the Beach
              </h3>
              <p className="text-white/40 text-sm mt-2 leading-relaxed">
                Sunset session + the film that started it all. Kellogg Park.
              </p>
              <span className="inline-block text-seafoam text-xs font-medium mt-3 group-hover:text-white transition-colors">
                RSVP &rarr;
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
