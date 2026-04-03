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
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-end overflow-hidden">
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

        <div className="relative z-10 w-full px-6 md:px-12 pb-10 md:pb-20 max-w-[1200px] mx-auto">
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
              <a href="#the-morning" className="text-white/50 text-sm no-underline border-b border-white/20 pb-px hover:text-white transition-colors">
                See the morning
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THREE PHASES ── */}
      <section id="the-morning" className="bg-salt py-20 md:py-28 px-6 relative scroll-mt-20">
        <div className="absolute inset-0 opacity-[0.02]" style={grain} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <Reveal>
            <div className="section-label">The Morning</div>
            <h2 className="section-title mb-16">Three phases, one flow</h2>
          </Reveal>

          {/* Phase 1 */}
          <Reveal>
            <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-center mb-20 md:mb-28">
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="/images/photos/joshua-lena-shores.jpg"
                  alt="Joshua and Lena at La Jolla Shores"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-serif text-3xl md:text-4xl text-teal/30">1</span>
                  <span className="text-[11px] text-teal font-medium tracking-[0.15em] uppercase">7:00 – 7:45 AM</span>
                </div>
                <h3 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight mb-3">
                  Ocean Flow with Lena
                </h3>
                <p className="text-[#5a6a7a] text-[0.95rem] leading-relaxed mb-4">
                  Pre-dive stretching and breathing exercises on the beach.
                  Guided by Lena &mdash; RYT yoga teacher and freediver.
                  Prepares the body and calms the mind before you touch the water.
                </p>
                <span className="px-3 py-1.5 bg-seafoam/10 text-teal rounded-full font-medium text-xs">
                  Open to all
                </span>
              </div>
            </div>
          </Reveal>

          {/* Phase 2 */}
          <Reveal>
            <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 items-center mb-20 md:mb-28">
              <div className="order-2 md:order-1">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-serif text-3xl md:text-4xl text-teal/30">2</span>
                  <span className="text-[11px] text-teal font-medium tracking-[0.15em] uppercase">7:45 – 8:15 AM</span>
                </div>
                <h3 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight mb-3">
                  Dry Training
                </h3>
                <p className="text-[#5a6a7a] text-[0.95rem] leading-relaxed mb-4">
                  Breathing exercises and CO&#8322; tolerance drills on the
                  beach. Controlled breath holds, diaphragmatic work, and
                  composure training. Extends your capacity and settles your
                  nervous system before you touch the water.
                </p>
                <span className="px-3 py-1.5 bg-seafoam/10 text-teal rounded-full font-medium text-xs">
                  Open to all
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] order-1 md:order-2">
                <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                  <source src="/videos/descending-line.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </Reveal>

          {/* Phase 3 */}
          <Reveal>
            <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-center">
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                  <source src="/videos/joshua-blue-hole-monofin.mp4" type="video/mp4" />
                </video>
              </div>
              <div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-serif text-3xl md:text-4xl text-teal/30">3</span>
                  <span className="text-[11px] text-teal font-medium tracking-[0.15em] uppercase">8:30 – 10:00 AM</span>
                </div>
                <h3 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight mb-3">
                  Line Diving
                </h3>
                <p className="text-[#5a6a7a] text-[0.95rem] leading-relaxed mb-4">
                  Group freedive at the LJFC mooring line. Canyon edge,
                  ~50m depth, ~500m offshore from Kellogg Park.
                  One up, one down. Always a buddy. Always a plan.
                </p>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-3 py-1.5 bg-coral/10 text-coral rounded-full font-medium text-xs">
                    Certification required
                  </span>
                  <span className="px-3 py-1.5 bg-seafoam/10 text-teal rounded-full font-medium text-xs">
                    All agencies welcome
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THREE OPTIONS ── */}
      <section className="bg-deep py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] text-white">Three ways to join</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-6">
              <div className="bg-white/[0.04] border border-seafoam/15 rounded-2xl p-7 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-seafoam text-deep text-[10px] font-semibold tracking-wide uppercase rounded-full whitespace-nowrap">The Complete Morning</div>
                <h3 className="font-serif text-xl text-white mt-3 mb-4">Everything</h3>
                <div className="space-y-3 text-left">
                  <div className="flex gap-3 items-start"><span className="text-seafoam/60 text-xs mt-0.5 shrink-0">7:00</span><span className="text-white/60 text-sm">Ocean Flow — yoga on the beach</span></div>
                  <div className="flex gap-3 items-start"><span className="text-seafoam/60 text-xs mt-0.5 shrink-0">7:45</span><span className="text-white/60 text-sm">Dry Training — breathing drills + CO₂ work</span></div>
                  <div className="flex gap-3 items-start"><span className="text-seafoam/60 text-xs mt-0.5 shrink-0">8:30</span><span className="text-white/60 text-sm">Line Diving — canyon edge, buddied</span></div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/[0.06]"><p className="text-white/30 text-xs">Cert required for diving (any agency)</p></div>
              </div>

              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 text-white/60 text-[10px] font-semibold tracking-wide uppercase rounded-full whitespace-nowrap">Skip the beach session</div>
                <h3 className="font-serif text-xl text-white mt-3 mb-4">Just Dive</h3>
                <div className="space-y-3 text-left">
                  <div className="flex gap-3 items-start"><span className="text-white/30 text-xs mt-0.5 shrink-0">8:30</span><span className="text-white/60 text-sm">Line Diving — show up at Kellogg Park ready to go</span></div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/[0.06]"><p className="text-white/30 text-xs">Cert required · own gear + lanyard</p></div>
              </div>

              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 text-white/60 text-[10px] font-semibold tracking-wide uppercase rounded-full whitespace-nowrap">No cert needed</div>
                <h3 className="font-serif text-xl text-white mt-3 mb-4">Just Beach</h3>
                <div className="space-y-3 text-left">
                  <div className="flex gap-3 items-start"><span className="text-white/30 text-xs mt-0.5 shrink-0">7:00</span><span className="text-white/60 text-sm">Ocean Flow — yoga on the beach</span></div>
                  <div className="flex gap-3 items-start"><span className="text-white/30 text-xs mt-0.5 shrink-0">7:45</span><span className="text-white/60 text-sm">Dry Training — breathing drills + CO₂ work</span></div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/[0.06]"><p className="text-white/30 text-xs">Open to everyone · bring a towel + water</p></div>
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

      {/* ── LOCATION ── */}
      <section className="bg-ocean py-12 md:py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[700px] mx-auto relative z-10">
          <Reveal>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-3">Meeting Spot</div>
                <h3 className="font-serif text-2xl text-white mb-2">Kellogg Park</h3>
                <p className="text-white/50 text-sm leading-relaxed">Near the picnic tables. La Jolla Shores.</p>
              </div>
              <div>
                <div className="text-[11px] text-sand/60 font-medium tracking-[0.2em] uppercase mb-3">Parking</div>
                <p className="text-white/50 text-sm leading-relaxed">Summer lot fills by 7:30am. Arrive early or park on Camino del Oro / Vallecitos.</p>
              </div>
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
    </>
  );
}
