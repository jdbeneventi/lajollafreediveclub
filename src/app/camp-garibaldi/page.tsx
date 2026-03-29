import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "Camp Garibaldi — Ocean Competence for Kids | La Jolla Freedive Club",
  description:
    "The ocean is 20 minutes from every neighborhood in San Diego. Camp Garibaldi exists because being near it isn't the same as belonging to it. Ages 8–14, La Jolla Shores.",
};

export default function CampGaribaldiPage() {
  return (
    <>
      {/* ────────────────────────────────────────────────────────
          1. HERO
      ──────────────────────────────────────────────────────── */}
      <section className="relative bg-deep min-h-[80vh] flex items-end overflow-hidden">
        <img
          src="/images/photos/joshua-teaching-kids.jpg"
          alt="Joshua teaching two kids poolside in wetsuits"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/70 to-transparent" />

        <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 pb-16 md:pb-24">
          <Reveal>
            <div className="section-label text-coral before:bg-coral">Ages 8–14 · La Jolla Shores</div>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] text-white font-normal leading-[1.08] tracking-tight mb-6 max-w-[700px]">
              Camp <em className="italic text-coral">Garibaldi</em>
            </h1>
            <p className="text-[1.1rem] text-white/60 max-w-[560px] leading-[1.8] mb-10">
              The ocean is 20 minutes from every neighborhood in San Diego. Camp Garibaldi exists because being near it isn&apos;t the same as belonging to it.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/camp-garibaldi/register" className="btn btn-primary no-underline">
                Reserve a Spot →
              </Link>
              <a href="#how-it-works" className="btn btn-ghost no-underline">
                How It Works
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          2. THE GAP — why this matters
      ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-[700px] mx-auto">
          <Reveal>
            <p className="text-[1.15rem] text-[#3A4A56] leading-[1.9]">
              Most kids in San Diego live close to the coast. Most of them have never been below the surface. They&apos;ve watched the ocean from the shore, maybe waded in on a warm day — but they don&apos;t <em>know</em> it. They can&apos;t read the conditions, can&apos;t name what lives at 20 feet, don&apos;t understand what the tide is doing or why the water is cold in July.
            </p>
            <p className="text-[1.15rem] text-[#3A4A56] leading-[1.9] mt-6">
              Camp Garibaldi changes that. Not just for a week — for life.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          3. THE METHODOLOGY — inside out
      ──────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-salt py-20 md:py-28 px-6 scroll-mt-20">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label">The Method</div>
            <h2 className="section-title mb-4 max-w-[500px]">We start every session on land</h2>
            <p className="section-desc mb-14 max-w-[600px]">
              Breathing drills. Dive reflex experiments. Conditions briefings from real Scripps instruments. By the time kids enter the water, they&apos;re already equipped with the internal tools to handle whatever they find there.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center mb-20">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
              <img src="/images/photos/joshua-kid-beach.jpg" alt="Student in full gear ready for the ocean" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="space-y-8">
              {[
                {
                  title: "Breath & composure first",
                  desc: "Diaphragmatic breathing, static holds, CO₂ tolerance. Kids learn to manage their nervous system before they're asked to trust the ocean.",
                },
                {
                  title: "Progressive ocean entry",
                  desc: "Pool to shallows to open water. Every step builds on real competence, not just courage. No one gets pushed past their edge.",
                },
                {
                  title: "Read the ocean like a local",
                  desc: "Students pull live buoy data from Scripps every morning. Wave height, period, tide, temperature. They make the go/no-go call — not the instructor.",
                },
                {
                  title: "Know what lives there",
                  desc: "15+ species identified by direct observation. Leopard sharks in the shallows, garibaldi on the reef, bat rays in the sand. Logged to iNaturalist with GPS coordinates.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h4 className="font-semibold text-sm mb-1.5 text-deep">{item.title}</h4>
                  <p className="text-sm text-[#5a6a7a] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The 5-day arc */}
          <Reveal>
            <h3 className="font-serif text-2xl text-deep mb-8">The week</h3>
          </Reveal>
          <div className="space-y-3">
            {[
              { day: "1", title: "Foundations", desc: "Breathing drills, dive reflex experiment, pool session — static holds, underwater swimming, basic equalization." },
              { day: "2", title: "Ocean Entry", desc: "Beach safety, wave dynamics, controlled ocean swims, snorkel skills, and first open water breath holds." },
              { day: "3", title: "Surf Survival", desc: "Hold-down simulation, underwater navigation, rescue awareness, buddy protocols." },
              { day: "4", title: "Freediving", desc: "Duck dives, depth progression, marine life ID, guided freedives at the Cove — depth appropriate to each kid." },
              { day: "5", title: "Challenge Day", desc: "Skills showcase, personal bests, ocean exploration, graduation with families." },
            ].map((d, i) => (
              <Reveal key={d.day} delay={i * 50}>
                <div className="bg-white rounded-xl p-5 md:p-6 flex gap-5 items-start">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-coral to-sun flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {d.day}
                  </span>
                  <div>
                    <div className="font-semibold text-sm text-deep">{d.title}</div>
                    <p className="text-xs text-[#5a6a7a] leading-relaxed mt-1">{d.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          4. WHY THE OCEAN WORKS + WHERE WE OPERATE
      ──────────────────────────────────────────────────────── */}
      <section className="bg-deep py-20 md:py-28 px-6">
        <div className="max-w-[700px] mx-auto">
          <Reveal>
            <h2 className="font-serif text-3xl text-white font-normal mb-6">
              Water does something a classroom can&apos;t
            </h2>
            <p className="text-white/50 text-[0.95rem] leading-[1.9] mb-6">
              The research has a name for it. Marine biologist Wallace J. Nichols called it &ldquo;Blue Mind&rdquo; — the measurable shift in the nervous system that happens near, in, or under water. Heart rate drops. Stress hormones decrease. Attention widens.
            </p>
            <p className="text-white/50 text-[0.95rem] leading-[1.9] mb-6">
              Camp Garibaldi&apos;s breath curriculum activates this deliberately. On Day 1, students measure their own mammalian dive reflex — cold water on the face, heart rate drops 15-25%. They see the data. They feel the shift. Then they learn to access it on command.
            </p>
            <p className="text-white/50 text-[0.95rem] leading-[1.9] mb-12">
              The classroom is the Matlahuayl State Marine Reserve — one of the most biodiverse protected ecosystems on the California coast. Ninety years of conservation history. The canyon drops to 600 feet a quarter mile from shore. Everything students learn, they learn in the actual environment, from the actual data, with the actual species around them.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { title: "AIDA-Certified Instruction", desc: "San Diego's only AIDA-certified youth instructor. DAN insured. Red Cross First Aid/CPR/AED." },
                { title: "4:1 Ratio", desc: "Max four kids per instructor. Every child gets individual attention in and out of the water." },
                { title: "La Jolla Marine Reserve", desc: "Matlahuayl SMR — 90+ years of protection. The living ecosystem is the curriculum." },
                { title: "Real Data, Real Science", desc: "Live Scripps buoy data. NOAA tides. iNaturalist species logging. Not a simulation." },
              ].map((item) => (
                <div key={item.title} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-5">
                  <h4 className="text-white font-semibold text-sm mb-1.5">{item.title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          5. SAFETY — confident, not defensive
      ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-[700px] mx-auto">
          <Reveal>
            <div className="section-label text-teal before:bg-teal">Safety</div>
            <h2 className="section-title mb-6">Knowledge, not just supervision</h2>
            <p className="text-[0.95rem] text-[#3A4A56] leading-[1.9] mb-6">
              Safety at Camp Garibaldi isn&apos;t about keeping kids on a leash in calm water. It&apos;s about teaching them what the ocean actually is — so they can make good decisions in it for the rest of their lives.
            </p>
            <p className="text-[0.95rem] text-[#3A4A56] leading-[1.9]">
              By the end of the week, every student can read the conditions from real instruments, assess whether the ocean is safe for entry, explain why the water temperature matters, identify rip currents and surge, execute a rescue breath sequence, and make a go/no-go call independently. That&apos;s not a kid who won&apos;t drown today. That&apos;s a kid who can navigate the coast for life.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          6. DATES, PRICING & ENROLLMENT
      ──────────────────────────────────────────────────────── */}
      <section className="bg-salt py-20 md:py-28 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label text-coral before:bg-coral">Summer 2026</div>
            <h2 className="section-title mb-4">Sessions</h2>
            <p className="section-desc mb-12">
              Three sessions. Small groups. Spots are limited.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { session: "Session I", dates: "June 15–17", days: "3 days", price: "$450", featured: false },
              { session: "Session II", dates: "July 13–17", days: "5 days", price: "$750", featured: true },
              { session: "Session III", dates: "Aug 10–12", days: "3 days", price: "$450", featured: false },
            ].map((s) => (
              <Reveal key={s.session}>
                <div className={`relative rounded-2xl p-7 text-center flex flex-col items-center ${
                  s.featured ? "bg-deep text-white ring-2 ring-coral/20" : "bg-white border border-deep/8"
                }`}>
                  {s.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-coral text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Full Week
                    </span>
                  )}
                  <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${s.featured ? "text-coral" : "text-teal"}`}>
                    {s.session}
                  </div>
                  <div className={`font-serif text-2xl mb-1 ${s.featured ? "text-white" : "text-deep"}`}>
                    {s.dates}
                  </div>
                  <div className={`text-sm mb-3 ${s.featured ? "text-white/40" : "text-[#5a6a7a]"}`}>
                    {s.days} · 9am–3pm · All gear provided
                  </div>
                  <div className={`font-serif text-2xl mb-4 ${s.featured ? "text-coral" : "text-deep"}`}>
                    {s.price}
                  </div>
                  <Link
                    href="/camp-garibaldi/register"
                    className={`inline-block text-sm font-semibold no-underline px-6 py-2.5 rounded-full transition-all ${
                      s.featured ? "bg-coral text-white hover:bg-coral/90" : "bg-deep text-white hover:bg-deep/90"
                    }`}
                  >
                    Reserve →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Charter callout */}
          <Reveal>
            <div className="bg-white border border-teal/15 rounded-xl p-6 md:p-8 max-w-[700px] mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-teal text-lg">$</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-deep mb-2">Homeschool charter families</h4>
                  <p className="text-sm text-[#5a6a7a] leading-relaxed mb-3">
                    If your family is enrolled in a California homeschool charter (PCA, Sage Oak, etc.), a significant portion of camp tuition can be covered by enrichment funds. Most families pay well under $100 out of pocket for the 3-day session.
                  </p>
                  <Link href="/camp-garibaldi/charter-funding" className="text-teal text-sm font-medium no-underline hover:text-teal/80 transition-colors">
                    How charter funding works →
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          7. COMMUNITY — the pipeline
      ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-[700px] mx-auto">
          <Reveal>
            <div className="section-label text-teal before:bg-teal">Beyond Camp</div>
            <h2 className="section-title mb-6">Camp is the beginning, not the end</h2>
            <p className="text-[0.95rem] text-[#3A4A56] leading-[1.9] mb-6">
              Camp Garibaldi isn&apos;t a one-week activity. It&apos;s an entry point into the La Jolla ocean community. The same kids come back for fall immersions, Saturday sessions, and monthly ocean days. Parents find each other. Kids become regulars. The Shores becomes theirs.
            </p>
            <p className="text-[0.95rem] text-[#3A4A56] leading-[1.9] mb-10">
              Guest educators from Scripps, Birch Aquarium, UCSD, and San Diego Marine Safety rotate through our programs — kids meet working scientists, lifeguards, and researchers in the field they&apos;re studying. By February, a student who joined in June will have personally documented 50+ species observations in the La Jolla marine reserve.
            </p>
          </Reveal>

          <Reveal>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/camp-garibaldi/register" className="btn btn-primary no-underline text-center">
                Reserve a Spot →
              </Link>
              <Link href="/contact" className="btn btn-ghost no-underline text-center">
                Questions? Get in Touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          PARTNER DOOR — for institutional audiences
      ──────────────────────────────────────────────────────── */}
      <section className="bg-salt py-12 px-6 border-t border-deep/5">
        <div className="max-w-[700px] mx-auto">
          <Reveal>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div>
                  <div className="text-xs text-teal font-semibold uppercase tracking-wide mb-1">For Organizations & Partners</div>
                  <p className="text-sm text-[#5a6a7a]">Grant funders, nonprofits, schools, and research partners</p>
                </div>
                <span className="text-teal text-xl group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <div className="mt-6 pt-6 border-t border-deep/5">
                <p className="text-sm text-[#5a6a7a] leading-relaxed mb-4">
                  Camp Garibaldi is designed to operate as a scholarship-accessible program. We actively seek partnerships with educational nonprofits and grant-funded organizations looking to expand ocean access for underserved youth in San Diego.
                </p>
                <p className="text-sm text-[#5a6a7a] leading-relaxed mb-4">
                  The program is NGSS-aligned (Grades 3-8), addresses all five California Environmental Principles &amp; Concepts, and produces measurable outcomes in species identification, data literacy, and physiological self-regulation.
                </p>
                <p className="text-sm text-[#5a6a7a] leading-relaxed mb-6">
                  Documentation available: NGSS alignment matrix, scope &amp; sequence, safety plan, instructor credentials, and curriculum framework.
                </p>
                <Link href="/contact" className="text-teal text-sm font-medium no-underline hover:text-teal/80 transition-colors">
                  Partner inquiry →
                </Link>
              </div>
            </details>
          </Reveal>
        </div>
      </section>

      <EmailCapture />
    </>
  );
}
