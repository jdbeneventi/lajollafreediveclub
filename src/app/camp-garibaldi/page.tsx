import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";
import { GaribaldiFish } from "./GaribaldiFish";
import CampScheduleTabs from "./CampScheduleTabs";
import CharterAccordion from "./CharterAccordion";
import FloatingFish from "./FloatingFish";
import "./camp-styles.css";

export const metadata: Metadata = {
  title: "Camp Garibaldi — Ocean Camp for Kids | La Jolla Freedive Club",
  description:
    "The ocean is 20 minutes from every neighborhood in San Diego. Camp Garibaldi exists because being near it isn't the same as belonging to it. Ages 8–14, La Jolla Shores.",
};

export default function CampGaribaldiPage() {
  return (
    <>
      {/* ─── HERO — photo-based ─── */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden bg-deep">
        <img
          src="/images/photos/joshua-teaching-kids.jpg"
          alt="Joshua teaching two kids poolside in wetsuits"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/70 to-transparent" />

        {/* Animated fish — top right */}
        <div className="absolute top-[20%] right-[6%] camp-fish-swim hidden md:block" style={{ filter: "drop-shadow(0 0 24px rgba(249,115,22,0.35))" }}>
          <GaribaldiFish size={100} />
        </div>

        <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 pb-16 md:pb-24">
          <Reveal>
            <div className="section-label text-coral before:bg-coral">Ages 8–14 · La Jolla Shores · Summer 2026</div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] text-white font-normal leading-[1.08] tracking-tight mb-6 max-w-[700px]">
              The ocean camp that starts from the <em className="italic text-[#E8682A]">inside out.</em>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[1.05rem] text-white/55 max-w-[500px] leading-[1.8] mb-8">
              The ocean is 20 minutes from every neighborhood in San Diego. Camp Garibaldi exists because being near it isn&apos;t the same as belonging to it.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex gap-4 flex-wrap items-center">
              <Link href="/camp-garibaldi/register" className="inline-block px-7 py-3.5 bg-[#E8682A] text-white rounded-full font-medium text-[0.88rem] no-underline hover:bg-[#F4894D] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,104,42,0.3)] transition-all camp-glow">
                Reserve a Spot →
              </Link>
              <a href="#how-it-works" className="text-white/50 text-[0.85rem] no-underline border-b border-white/20 pb-px hover:text-white hover:border-white/50 transition-colors">
                How It Works
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── THE GAP ─── */}
      <section className="bg-ocean/20 border-y border-seafoam/[0.06] py-16 sm:py-20 px-6">
        <div className="max-w-[740px] mx-auto">
          <Reveal>
            <p className="font-serif text-[clamp(1.4rem,3.5vw,2.2rem)] text-white leading-[1.35]">
              Most kids in San Diego live 20 minutes from the coast. Most of them have never been <em className="italic text-[#E8682A]">below the surface.</em>
            </p>
            <p className="text-[0.95rem] text-white/40 max-w-[600px] leading-[1.8] mt-5">
              Most ocean programs give kids ocean exposure. Camp Garibaldi gives kids ocean <strong className="text-white/60 font-medium">competence</strong> — the physiological knowledge, breath skills, and water-reading ability to have a safe, lifelong relationship with the coast.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── METHODOLOGY ─── */}
      <section id="how-it-works" className="bg-white py-20 sm:py-28 px-6 scroll-mt-20">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center mb-16">
              <div>
                <div className="section-label">Our Approach</div>
                <h2 className="section-title">
                  We start every session on land
                </h2>
                <p className="section-desc">
                  Breathing drills. Dive reflex experiments. Conditions briefings from real Scripps instruments. By the time kids enter the water, they&apos;re already equipped with the internal tools to handle whatever they find there.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <img src="/images/photos/joshua-kid-beach.jpg" alt="Student in full gear ready for the ocean" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            {[
              { num: "01", title: "Breath & composure first", body: "Diaphragmatic breathing, CO₂ tolerance, the mammalian dive reflex. Kids learn to manage their nervous system before they're asked to trust the ocean." },
              { num: "02", title: "Progressive ocean entry", body: "Pool to shallows to open water. Every step builds on demonstrated competence, not just courage. No one gets pushed past their edge." },
              { num: "03", title: "Read the ocean like a local", body: "Students pull live buoy data from Scripps every morning. Wave height, period, tide, temperature. They make the go/no-go call — not the instructor." },
              { num: "04", title: "Know what lives there", body: "15+ species identified by direct observation. Leopard sharks, garibaldi, bat rays. Logged to iNaturalist with GPS coordinates." },
            ].map((m) => (
              <Reveal key={m.num}>
                <div className="flex gap-5">
                  <span className="font-serif text-2xl text-teal/30 shrink-0">{m.num}</span>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{m.title}</h4>
                    <p className="text-sm text-[#5a6a7a] leading-relaxed">{m.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY THE OCEAN WORKS ─── */}
      <section className="bg-deep py-20 sm:py-28 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <Reveal>
                <div className="section-label">The Science</div>
                <h2 className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] text-white leading-[1.15] mb-6">
                  Water does something to the nervous system that a classroom <em className="italic text-[#E8682A]">can&apos;t replicate.</em>
                </h2>
                <p className="text-[0.92rem] text-white/45 leading-[1.85] mb-4">
                  Marine biologist Wallace J. Nichols documented what ocean communities have always known: proximity to water measurably shifts the brain from a &ldquo;Red Mind&rdquo; state — stress, anxiety, overstimulation — toward a calmer, more receptive one. He called it Blue Mind.
                </p>
                <p className="text-[0.92rem] text-white/45 leading-[1.85] mb-4">
                  Camp Garibaldi&apos;s breath curriculum activates this through the mammalian dive reflex — the most powerful autonomic reflex in the human body. Cold water on the face triggers an immediate drop in heart rate. Students document this themselves on Day 1.
                </p>
                <p className="text-[0.75rem] text-seafoam/35 border-t border-seafoam/[0.08] pt-3 mt-5 leading-relaxed">
                  Nichols, <em>Blue Mind</em>, 2014/2024 · Olive et al., <em>Psychology of Sport and Exercise</em>, 2022 · Baković et al., 2003
                </p>
              </Reveal>
            </div>

            <div className="flex flex-col gap-px bg-seafoam/[0.06] border border-seafoam/[0.08]">
              {[
                { num: "22%", color: "text-[#E8682A]", label: "People living within one mile of the ocean are ~22% less likely to report symptoms of depression and anxiety." },
                { num: "87%", color: "text-seafoam", label: "Completion rate for ocean-based youth program, vs. 28–75% dropout rate for traditional talk therapy in children." },
                { num: "25%", color: "text-sand", label: "Average heart rate reduction from the mammalian dive reflex — measured by Camp Garibaldi students on Day 1." },
              ].map((s) => (
                <Reveal key={s.num}>
                  <div className="bg-ocean/20 p-6">
                    <div className={`font-serif text-4xl leading-none mb-2 ${s.color}`}>{s.num}</div>
                    <p className="text-[0.82rem] text-white/40 leading-[1.6]">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHERE WE OPERATE ─── */}
      <section className="bg-ocean/15 border-y border-seafoam/[0.06] py-20 sm:py-28 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-start">
            <div>
              <Reveal>
                <div className="section-label">The Site</div>
                <h2 className="font-serif text-[clamp(1.4rem,2.5vw,2rem)] text-white leading-[1.25]">
                  Not a pool. Not Mission Bay. The <em className="italic text-seafoam">actual</em> marine reserve.
                </h2>
                <p className="text-[0.85rem] text-white/30 mt-4 leading-[1.75]">
                  The Matlahuayl State Marine Reserve at La Jolla Shores — protected since 1929. The submarine canyon begins 100 yards from shore.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-seafoam/[0.06]">
              {[
                { title: "La Jolla Submarine Canyon", body: "Canyon rim at 35–45ft, walls past 130ft. Gorgonian sea fans, two-spot octopus, sarcastic fringeheads." },
                { title: "Live Scripps Data", body: "Students read NDBC 46254 buoy data, NOAA tide predictions, and NWS marine forecasts every morning." },
                { title: "Sand Dollar Field", body: "Millions of live sand dollars at 20–25ft. Leopard sharks in summer. Sea lion pups in October." },
                { title: "Permanent Lifeguard Station", body: "Sandy bottom, gradual slope, year-round coverage. The safest place to learn the ocean." },
              ].map((f) => (
                <Reveal key={f.title}>
                  <div className="bg-deep p-5">
                    <div className="text-seafoam text-[0.82rem] font-medium mb-1">{f.title}</div>
                    <p className="text-[0.8rem] text-white/35 leading-[1.6]">{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SAFETY ─── */}
      <section className="bg-deep py-20 sm:py-28 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-10">
            <div>
              <Reveal>
                <div className="section-label">Safety</div>
                <h2 className="font-serif text-[clamp(1.4rem,2.5vw,2rem)] text-white leading-[1.3]">
                  Safety isn&apos;t supervision. It&apos;s <em className="italic text-[#E8682A]">knowledge.</em>
                </h2>
              </Reveal>
            </div>
            <div>
              <Reveal>
                <p className="text-[0.9rem] text-white/45 leading-[1.85] mb-3">
                  There&apos;s a difference between a child who won&apos;t drown today and a child who understands the ocean well enough to make good decisions in it for the rest of their life.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {["AIDA Instructor", "AIDA Youth Instructor", "DAN Insured", "ARC First Aid/CPR/AED", "Mandated Reporter"].map((c) => (
                    <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ocean/40 border border-seafoam/10 rounded-full text-[0.75rem] text-white/55">
                      <span className="w-[5px] h-[5px] rounded-full bg-seafoam/60 shrink-0" />
                      {c}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-seafoam/[0.06] border border-seafoam/[0.08]">
            {[
              { num: "4:1", label: "Student / instructor" },
              { num: "8", label: "Max students per session" },
              { num: "2", label: "Certified instructors on water" },
            ].map((s) => (
              <div key={s.label} className="bg-ocean/15 p-6 sm:p-8 text-center">
                <div className="font-serif text-4xl text-[#E8682A] leading-none mb-1">{s.num}</div>
                <div className="text-[0.78rem] text-white/30 uppercase tracking-[0.1em] font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE WEEK ─── */}
      <section id="the-week" className="bg-ocean/10 py-20 sm:py-28 px-6 scroll-mt-20">
        <div className="max-w-[1100px] mx-auto">
          <Reveal>
            <div className="section-label">The Program</div>
            <h2 className="font-serif text-[clamp(1.5rem,2.5vw,2.2rem)] text-white mb-8">
              Five days. One transformation.
            </h2>
          </Reveal>
          <CampScheduleTabs />
        </div>
      </section>

      {/* ─── COMMUNITY ─── */}
      <section className="bg-deep py-20 sm:py-28 px-6">
        <div className="max-w-[1100px] mx-auto">
          <Reveal>
            <div className="section-label">The Community</div>
            <h2 className="font-serif text-[clamp(1.4rem,2.5vw,2rem)] text-white leading-[1.2] max-w-[600px] mb-2">
              Camp Garibaldi isn&apos;t a week-long activity. It&apos;s a door into the <em className="italic text-seafoam">La Jolla ocean community.</em>
            </h2>
            <p className="text-[0.88rem] text-white/35 max-w-[560px] leading-[1.8] mb-10">
              The same kids show up every Saturday. Parents find each other. La Jolla Shores becomes theirs.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Guest Educators", body: "Scripps researchers, Birch Aquarium educators, UCSD marine scientists, and SD lifeguards. Kids meet working ocean professionals." },
              { title: "Saturday Sessions", body: "Weekly open-water training at the canyon — free with Ocean Flow, $25 drop-in. Camp alumni always welcome." },
              { title: "iNaturalist Science", body: "Every species observed is logged with GPS coordinates — publicly visible, scientifically valid. Students become published citizen scientists." },
              { title: "Monthly Immersions", body: "Fall and winter weekends themed to what's happening in the ocean. Sea lion pups in October, squid runs in November, gray whales in February." },
              { title: "The Pipeline", body: "Graduates aged 13–14 are eligible for Discover Freediving (AIDA 1). From ocean camp to international certification — one uninterrupted path deeper." },
              { title: "Scholarship Access", body: "We operate scholarship spots for families who live near the coast but haven't had access to what it offers. The ocean belongs to everyone." },
            ].map((c) => (
              <Reveal key={c.title}>
                <div className="p-5 bg-ocean/20 border border-seafoam/[0.07] rounded-sm">
                  <h4 className="font-serif text-base text-white mb-2">{c.title}</h4>
                  <p className="text-[0.82rem] text-white/35 leading-[1.75]">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DATES & PRICING ─── */}
      <section className="bg-ocean/15 border-t border-seafoam/[0.06] py-20 sm:py-28 px-6" id="reserve">
        <div className="max-w-[1100px] mx-auto">
          <Reveal>
            <div className="section-label text-[#E8682A]/60 before:bg-[#E8682A]/60">Summer 2026</div>
            <h2 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] text-white mb-2">Camp Dates</h2>
            <p className="text-[0.88rem] text-white/30 mb-10">Spots are limited — groups stay small so every student gets real attention.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {[
              { tag: "Session I · June", dates: "Jun 15–17", type: "3-day immersion", price: "$450", charter: "~$50 out of pocket", featured: false },
              { tag: "Session II · July · Peak Season", dates: "Jul 13–17", type: "5-day full week", price: "$750", charter: "~$350 out of pocket", featured: true },
              { tag: "Session III · August", dates: "Aug 10–12", type: "3-day immersion", price: "$450", charter: "~$50 out of pocket", featured: false },
            ].map((s) => (
              <Reveal key={s.tag}>
                <div className={`p-6 sm:p-7 border transition-colors ${
                  s.featured
                    ? "border-[#E8682A]/25 bg-[#E8682A]/[0.04]"
                    : "border-seafoam/10 bg-deep/60 hover:border-[#E8682A]/20"
                }`}>
                  <span className="block text-[9px] uppercase tracking-[0.18em] font-medium text-[#E8682A] mb-3">{s.tag}</span>
                  <div className="font-serif text-xl text-white mb-0.5">{s.dates}</div>
                  <div className="text-[0.78rem] text-white/30 italic mb-4">{s.type}</div>
                  <div className="font-serif text-3xl text-white leading-none mb-1">{s.price}</div>
                  <div className="text-[0.75rem] text-white/25 mb-5 leading-relaxed">
                    <strong className="text-seafoam/60 font-medium">Charter families: {s.charter}</strong>
                  </div>
                  <Link
                    href="/camp-garibaldi/register"
                    className={`block text-center py-2.5 text-[0.78rem] font-medium tracking-[0.05em] no-underline transition-colors ${
                      s.featured
                        ? "bg-[#E8682A] text-white hover:bg-[#F4894D]"
                        : "border border-[#E8682A]/30 text-[#E8682A]/80 hover:bg-[#E8682A]/[0.07]"
                    }`}
                  >
                    Reserve →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="text-[0.78rem] text-white/20 text-center leading-relaxed">
            All sessions 9am–3pm · Ages 8–14 · Gear provided · Max 8 students
          </p>
        </div>
      </section>

      {/* ─── CHARTER DOOR ─── */}
      <section className="bg-deep py-12 px-6">
        <div className="max-w-[740px] mx-auto">
          <CharterAccordion />
        </div>
      </section>

      {/* ─── PARTNERS DOOR ─── */}
      <section className="bg-ocean/10 border-t border-seafoam/[0.06] py-16 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <Reveal>
                <div className="section-label">For Organizations &amp; Partners</div>
                <h3 className="font-serif text-xl text-white mb-4">
                  Built for <em className="italic text-seafoam">institutional partnership.</em>
                </h3>
                <p className="text-[0.88rem] text-white/40 leading-[1.85] mb-4">
                  Camp Garibaldi is designed to operate as a scholarship-accessible program. We seek partnerships with educational nonprofits and grant-funded organizations expanding ocean access for underserved youth.
                </p>
                <Link href="/contact" className="inline-block mt-2 px-5 py-2.5 border border-seafoam/20 text-seafoam/70 text-[0.82rem] font-medium no-underline hover:bg-seafoam/[0.07] hover:text-seafoam transition-colors">
                  Partner inquiry →
                </Link>
              </Reveal>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { title: "NGSS-Aligned Curriculum · Grades 3–8", body: "Full scope and sequence with performance expectation codes for vendor applications and grant reporting." },
                { title: "Measurable Outcomes", body: "Breath-hold progression, species count, conditions literacy — every student generates quantifiable records." },
                { title: "Scholarship Pathway", body: "Partners can sponsor scholarship placements directly for families without access." },
                { title: "Research Infrastructure", body: "Located 100 yards from Scripps Institution of Oceanography. OHPC partnership in development." },
              ].map((e) => (
                <Reveal key={e.title}>
                  <div className="p-4 bg-ocean/20 border-l-2 border-seafoam/15">
                    <div className="text-[0.8rem] text-white/65 font-medium mb-0.5">{e.title}</div>
                    <p className="text-[0.78rem] text-white/35 leading-[1.6]">{e.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="bg-deep border-t border-seafoam/[0.06] py-20 sm:py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(232,104,42,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-[500px] mx-auto">
          <div className="inline-block camp-fish-bob mb-6">
            <GaribaldiFish size={64} />
          </div>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,3rem)] text-white mb-4">
            Ready to <em className="italic text-[#E8682A]">go deeper?</em>
          </h2>
          <p className="text-[0.95rem] text-white/35 leading-[1.8] mb-8">
            Sessions fill quickly. Groups are small by design. Reserve your student&apos;s spot now.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/camp-garibaldi/register" className="inline-block px-7 py-3.5 bg-[#E8682A] text-white rounded-full font-medium text-[0.88rem] no-underline hover:bg-[#F4894D] hover:-translate-y-0.5 transition-all">
              Reserve a Spot →
            </Link>
            <Link href="/contact" className="text-white/45 text-[0.85rem] no-underline border-b border-white/20 pb-px hover:text-white transition-colors">
              Ask a question
            </Link>
          </div>
        </div>
      </section>

      <EmailCapture />

      {/* Floating fish contact button */}
      <FloatingFish />
    </>
  );
}
