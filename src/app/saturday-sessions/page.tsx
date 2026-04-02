import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SaturdayRSVP } from "./SaturdayRSVP";

const grain = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
};

const faqs = [
  {
    q: "Do I need to be certified?",
    a: "Only for line diving. Ocean Flow and Dry Training are open to everyone. For diving: AIDA 3+ get the full morning free. AIDA 1–2 pay $30 for the full morning (Flow + Dry Training + diving) or $25 dive-only. Monthly passes available.",
  },
  {
    q: "What if conditions are bad?",
    a: "We confirm Friday based on conditions and availability. If we call it off, you'll get an email.",
  },
  {
    q: "Can I just come watch?",
    a: "Yes. Come hang at Kellogg Park and see what we do. No pressure.",
  },
  {
    q: "First time?",
    a: "Sign your waiver at lajollafreediveclub.com/waiver before you come. Show up at 7am for Ocean Flow — it's the best way to start.",
  },
];

export default function SaturdaySessionsPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden">
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
              Every Saturday Morning
            </div>
            <h1 className="font-serif text-[clamp(2.8rem,7vw,5rem)] text-white font-normal leading-[1.05] tracking-tight max-w-[700px]">
              Saturday at{" "}
              <em className="italic text-seafoam">the Shores</em>
            </h1>
            <p className="text-white/45 text-lg mt-4 max-w-[520px] leading-relaxed">
              Ocean Flow. Breathing drills. Line diving.
              <br />
              Three phases. One morning. La Jolla Shores.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── THREE PHASES ── */}
      <section className="bg-salt py-20 md:py-28 px-6 relative">
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
                  <span className="font-serif text-3xl md:text-4xl text-teal/30">
                    1
                  </span>
                  <span className="text-[11px] text-teal font-medium tracking-[0.15em] uppercase">
                    7:00 AM
                  </span>
                </div>
                <h3 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight mb-3">
                  Ocean Flow with Lena
                </h3>
                <p className="text-[#5a6a7a] text-[0.95rem] leading-relaxed mb-4">
                  Pre-dive stretching and breathing exercises on the beach.
                  Guided by Lena &mdash; RYT yoga teacher and freediver.
                  Prepares the body and calms the mind before you touch the
                  water.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1.5 bg-seafoam/10 text-teal rounded-full font-medium text-xs">
                    Open to all
                  </span>
                  <span className="text-[#5a6a7a]">$20 drop-in</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Phase 2 */}
          <Reveal>
            <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 items-center mb-20 md:mb-28">
              <div className="order-2 md:order-1">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-serif text-3xl md:text-4xl text-teal/30">
                    2
                  </span>
                  <span className="text-[11px] text-teal font-medium tracking-[0.15em] uppercase">
                    7:30 AM
                  </span>
                </div>
                <h3 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight mb-3">
                  Dry Training
                </h3>
                <p className="text-[#5a6a7a] text-[0.95rem] leading-relaxed mb-4">
                  Breathing exercises and CO&#8322; tolerance drills on the
                  beach. Controlled breath holds, diaphragmatic work, and
                  composure training. Extends your capacity and settles your
                  nervous system before you touch the water (or carries into
                  the rest of your day, if you&apos;re not diving).
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1.5 bg-seafoam/10 text-teal rounded-full font-medium text-xs">
                    Open to all
                  </span>
                  <Link
                    href="/science"
                    className="text-teal text-xs font-medium no-underline hover:underline"
                  >
                    Read the science &rarr;
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] order-1 md:order-2">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source
                    src="/videos/descending-line.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </Reveal>

          {/* Phase 3 */}
          <Reveal>
            <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-center">
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source
                    src="/videos/joshua-blue-hole-monofin.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-serif text-3xl md:text-4xl text-teal/30">
                    3
                  </span>
                  <span className="text-[11px] text-teal font-medium tracking-[0.15em] uppercase">
                    8:30 AM
                  </span>
                </div>
                <h3 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight mb-3">
                  Line Diving
                </h3>
                <p className="text-[#5a6a7a] text-[0.95rem] leading-relaxed mb-4">
                  Group freedive at the LJFC mooring line. Canyon edge,
                  ~50m depth, ~500m offshore from Kellogg Park.
                  One up, one down. Always a buddy. Always a plan.
                </p>
                <p className="text-coral/80 text-[0.82rem] leading-relaxed mb-4 font-medium">
                  Registration required — we need a headcount to plan safety coverage.
                </p>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <span className="px-3 py-1.5 bg-coral/10 text-coral rounded-full font-medium text-xs">
                    Certification required
                  </span>
                  <span className="px-3 py-1.5 bg-seafoam/10 text-teal rounded-full font-medium text-xs">
                    Free for AIDA 3+
                  </span>
                  <span className="text-[#5a6a7a]">Own gear required</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="bg-deep py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[700px] mx-auto relative z-10">
          <Reveal>
            {/* Drop-in pricing */}
            <div className="text-[11px] text-white/30 font-medium tracking-[0.15em] uppercase text-center mb-5">Drop-in</div>
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {/* Advanced — full morning free */}
              <div className="bg-white/[0.04] border border-seafoam/15 rounded-2xl p-7 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-seafoam text-deep text-[10px] font-semibold tracking-wide uppercase rounded-full whitespace-nowrap">
                  AIDA 3+ / Molchanovs W3+
                </div>
                <div className="font-serif text-3xl text-white mt-2 mb-2">Free</div>
                <p className="text-white/50 text-sm leading-relaxed mb-3">
                  Full morning — Ocean Flow, Dry Training, and line diving. Everything.
                </p>
                <p className="text-seafoam/60 text-xs leading-relaxed">
                  You&apos;re the backbone of this community. Show up, dive, set the standard.
                </p>
              </div>

              {/* Beginner — full morning bundle */}
              <div className="bg-white/[0.04] border border-coral/20 rounded-2xl p-7 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-coral text-white text-[10px] font-semibold tracking-wide uppercase rounded-full whitespace-nowrap">
                  AIDA 1–2 · Full morning
                </div>
                <div className="font-serif text-3xl text-white mt-2 mb-2">$30</div>
                <p className="text-white/50 text-sm leading-relaxed mb-3">
                  Ocean Flow + Dry Training + line diving. The complete Saturday.
                </p>
                <p className="text-white/30 text-xs leading-relaxed">
                  <span className="line-through">$45 if bought separately</span>
                </p>
              </div>

              {/* Beach only */}
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-7 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 text-white/60 text-[10px] font-semibold tracking-wide uppercase rounded-full whitespace-nowrap">
                  No cert needed
                </div>
                <div className="font-serif text-3xl text-white mt-2 mb-2">$20</div>
                <p className="text-white/50 text-sm leading-relaxed mb-3">
                  Ocean Flow + Dry Training. Beach only — no diving.
                </p>
                <p className="text-white/30 text-xs leading-relaxed">
                  Open to everyone. The perfect intro.
                </p>
              </div>
            </div>

            {/* Monthly passes */}
            <div className="text-[11px] text-white/30 font-medium tracking-[0.15em] uppercase text-center mb-5">Monthly Pass</div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/[0.04] border border-seafoam/15 rounded-2xl p-6 text-center">
                <div className="font-serif text-3xl text-white mb-1">$80<span className="text-lg text-white/30">/mo</span></div>
                <p className="text-white/50 text-sm mb-2">Full morning pass</p>
                <p className="text-white/30 text-xs leading-relaxed">
                  Ocean Flow + Dry Training + line diving, every Saturday. ~$20/session.
                </p>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 text-center">
                <div className="font-serif text-3xl text-white mb-1">$60<span className="text-lg text-white/30">/mo</span></div>
                <p className="text-white/50 text-sm mb-2">Beach pass</p>
                <p className="text-white/30 text-xs leading-relaxed">
                  Ocean Flow + Dry Training every Saturday. ~$15/session.
                </p>
              </div>
            </div>

            {/* Incentive callout */}
            <div className="bg-seafoam/[0.08] border border-seafoam/15 rounded-xl p-5 text-center">
              <p className="text-seafoam text-sm font-medium mb-1">Get your AIDA 3 — dive free forever.</p>
              <p className="text-white/35 text-xs leading-relaxed">
                Advanced certification means free access to every Saturday line session. <Link href="/contact/courses?course=aida3" className="text-seafoam/80 underline">AIDA 3 courses →</Link>
              </p>
            </div>

            <p className="text-white/20 text-xs text-center mt-6">
              Dive-only drop-in (AIDA 1–2, no beach session): $25. Bring your cert card.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── REQUIREMENTS ── */}
      <section className="bg-white py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.015]" style={grain} />
        <div className="max-w-[800px] mx-auto relative z-10">
          <Reveal>
            <div className="section-label">What to Know</div>
            <h2 className="section-title mb-12">Before you come</h2>
          </Reveal>

          <Reveal delay={40}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-salt rounded-2xl p-8">
                <div className="text-[11px] text-seafoam font-medium tracking-[0.15em] uppercase mb-4">
                  Ocean Flow + Dry Training
                </div>
                <h3 className="font-serif text-xl tracking-tight mb-4">
                  Open to everyone
                </h3>
                <ul className="space-y-3 text-sm text-[#5a6a7a]">
                  <li className="flex gap-2">
                    <span className="text-seafoam shrink-0">&bull;</span>
                    No certification needed
                  </li>
                  <li className="flex gap-2">
                    <span className="text-seafoam shrink-0">&bull;</span>
                    No experience needed
                  </li>
                  <li className="flex gap-2">
                    <span className="text-seafoam shrink-0">&bull;</span>
                    Bring a towel and water
                  </li>
                  <li className="flex gap-2">
                    <span className="text-seafoam shrink-0">&bull;</span>
                    Just show up at 7am
                  </li>
                </ul>
              </div>

              <div className="bg-salt rounded-2xl p-8">
                <div className="text-[11px] text-coral font-medium tracking-[0.15em] uppercase mb-4">
                  Line Diving
                </div>
                <h3 className="font-serif text-xl tracking-tight mb-4">
                  Certified divers only
                </h3>
                <ul className="space-y-3 text-sm text-[#5a6a7a]">
                  <li className="flex gap-2">
                    <span className="text-seafoam shrink-0">&bull;</span>
                    <span><strong className="text-deep">AIDA 3+:</strong> Full morning free</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-coral shrink-0">&bull;</span>
                    <span><strong className="text-deep">AIDA 1–2:</strong> $30 full morning / $25 dive-only</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-coral shrink-0">&bull;</span>
                    Valid freediving cert (any agency)
                  </li>
                  <li className="flex gap-2">
                    <span className="text-coral shrink-0">&bull;</span>
                    Wetsuit, fins, mask, snorkel
                  </li>
                  <li className="flex gap-2">
                    <span className="text-coral shrink-0">&bull;</span>
                    Weight belt + lanyard
                  </li>
                  <li className="flex gap-2">
                    <span className="text-coral shrink-0">&bull;</span>
                    <Link
                      href="/waiver"
                      className="text-teal no-underline hover:underline"
                    >
                      Signed waiver
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MEETING SPOT + PARKING ── */}
      <section className="bg-ocean py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[700px] mx-auto relative z-10">
          <Reveal>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-3">
                  Meeting Spot
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">
                  Kellogg Park
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Near the picnic tables. La Jolla Shores.
                </p>
              </div>
              <div>
                <div className="text-[11px] text-sand/60 font-medium tracking-[0.2em] uppercase mb-3">
                  Parking
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  Summer lot fills by 7:30am. Arrive early or park on
                  Camino del Oro / Vallecitos.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={40}>
            <div className="mt-10 pt-8 border-t border-white/[0.06] text-center">
              <Link
                href="/conditions"
                className="text-seafoam text-sm font-medium no-underline hover:text-white transition-colors"
              >
                Check today&apos;s conditions before you come &rarr;
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── RSVP ── */}
      <section className="bg-gradient-to-br from-ocean to-teal py-16 md:py-24 px-6 relative overflow-hidden">
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

      {/* ── FAQ ── */}
      <section className="bg-white py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.015]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Reveal>
            <div className="section-label">FAQ</div>
            <h2 className="section-title mb-12">Common questions</h2>
          </Reveal>

          <div className="space-y-8">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="border-b border-deep/[0.06] pb-8">
                  <h3 className="font-semibold text-[1.02rem] mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-[#5a6a7a] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="bg-salt py-16 px-6 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={grain} />
        <div className="max-w-[600px] mx-auto relative z-10 text-center">
          <Reveal>
            <p className="text-[#5a6a7a] text-sm mb-5 leading-relaxed">
              Not certified yet? Start with an AIDA course and join us on
              Saturdays.
            </p>
            <Link
              href="/contact/courses"
              className="inline-flex px-8 py-3 bg-coral text-white rounded-full font-semibold no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all"
            >
              View Courses &rarr;
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
