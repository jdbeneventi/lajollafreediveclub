import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";
import { ExpandableCourse } from "@/components/ExpandableCourse";
import { ExpandableYouthLevel } from "@/components/ExpandableYouthLevel";

export const metadata: Metadata = {
  title: "Programs — AIDA Freediving Courses & Training in San Diego",
  description:
    "AIDA 1, 2, and 3 certification courses, beginner freediving experiences, weekly group ocean sessions, private coaching, and dry training in La Jolla, San Diego. Full course details, requirements, and certification standards.",
  keywords: [
    "AIDA certification San Diego",
    "AIDA 2 course La Jolla",
    "AIDA 3 advanced freediving",
    "learn to freedive San Diego",
    "freediving course California",
  ],
};

const aidaCourses = [
  {
    id: "aida1",
    title: "AIDA 1 — Introduction to Freediving",
    subtitle: "A one-day door into the sport",
    price: "$200",
    priceNote: "Half day · All equipment guidance included",
    duration: "1 day (3–6 hours)",
    level: "Complete beginners",
    maxDepth: "10m",
    gradient: "from-[#14566a] to-seafoam",
    description:
      "AIDA 1 is a half-day to full-day introduction designed for confident swimmers who are brand new to breath-hold diving. You'll learn the fundamentals of relaxation, basic static apnea, introductory finning and duck dive technique, and buddy safety. No performance minimums — just demonstrate correct technique, relaxation, and safe behavior.",
    skills: [
      "Relaxation techniques for body and mind",
      "Introduction to static apnea (STA)",
      "Basic finning and duck dive techniques",
      "Snorkel breathing and recovery breathing",
      "Equalization awareness",
      "Buddy supervision and surface rescue",
      "Equipment basics and freediver code of conduct",
    ],
    requirements: {
      age: "18+ (or 16+ with guardian consent)",
      swim: "100m non-stop",
      prerequisites: "None — no previous certification required",
      certification: "Demonstration of correct technique and safe behavior",
    },
    format: {
      duration: "1 day minimum (6 hours)",
      theory: "Optional classroom session (90 min) or self-study",
      water: "At least 1 water session (pool or open water)",
      ratios: "8:1 confined water · 4:1 open water",
    },
  },
  {
    id: "aida2",
    title: "AIDA 2 — Freediver Certification",
    subtitle: "The first full certification — your entry into real freediving",
    price: "$575",
    priceNote: "Group (max 4) · Private 1-on-1 available for $800",
    duration: "2.5 days minimum",
    level: "Beginners with strong swim skills",
    maxDepth: "20m",
    gradient: "from-ocean to-teal",
    description:
      "AIDA 2 is the international standard for beginner freediving certification and the most popular course we run. Over 2.5+ days, you'll cover theory, pool skills, and open water diving. You'll learn the full freediving breathing cycle, equalization, rescue procedures, and complete dives to 12–20 meters. This is the certification that opens the door to independent buddy diving worldwide.",
    skills: [
      "Full freediving breathing cycle (relaxation, full breath, recovery)",
      "STA, DYNB, CWTB, and FIM training",
      "Effective finning and streamlining techniques",
      "Proper duck dives, turns, and equalization",
      "Rescue from 5–10m (blackout and LMC)",
      "Weighting and buoyancy awareness",
      "Freediving physics, physiology, and safety protocols",
    ],
    requirements: {
      age: "18+ (or 16+ with guardian consent)",
      swim: "200m non-stop (or 300m with mask, fins, snorkel)",
      prerequisites: "None — no previous certification required",
      certification: "STA: 2:00 min · DYNB: 40m · CWTB: 12–20m · Theory exam: 75%",
    },
    format: {
      duration: "2.5 days minimum",
      theory: "At least 2 classroom sessions (or 90-min review with self-study)",
      water: "2 confined water sessions + 3 open water sessions over 2 days",
      ratios: "8:1 confined water · 4:1 open water",
    },
  },
  {
    id: "aida3",
    title: "AIDA 3 — Advanced Freediver",
    subtitle: "Go deeper with precision and autonomy",
    price: "$700",
    priceNote: "Group (max 4) · Private 1-on-1 available for $950",
    duration: "3 days minimum",
    level: "AIDA 2 certified (or crossover)",
    maxDepth: "30m",
    gradient: "from-deep to-ocean",
    description:
      "AIDA 3 is for certified freedivers who want to develop depth skills, deepen their physiological understanding, and train toward autonomy. You'll learn advanced Frenzel equalization, free-fall technique, CO₂ and O₂ tables, deep-water rescue protocols, and the physiology of diving beyond 20 meters. Lanyards required beyond 20m. This course enables you to plan and execute your own training with a qualified buddy.",
    skills: [
      "Advanced Frenzel equalization",
      "Free-fall technique and fine-tuned weighting",
      "CO₂ and O₂ tables for performance training",
      "Deep-water rescue techniques",
      "STA, DYNB, FIM, CWTB mastery",
      "Physiology: barotrauma, lung function at depth, blood shift",
      "Decompression theory, blackout prevention, and surface intervals",
    ],
    requirements: {
      age: "18+ (or 16+ with guardian consent)",
      swim: "AIDA 2 certification (or successful crossover evaluation)",
      prerequisites: "AIDA 2 certified or equivalent from another agency (SSI, PADI, Molchanovs)",
      certification: "STA: 2:45 min · DYNB: 55m · CWTB: 24m · Theory exam: 75%",
    },
    format: {
      duration: "3 days minimum",
      theory: "At least 3 hours (or 90-min review + self-study)",
      water: "2 confined water sessions + 4 open water sessions over 2 days",
      ratios: "8:1 confined water · 4:1 open water",
    },
  },
];

const otherPrograms = [
  {
    id: "group",
    title: "Group Ocean Sessions",
    subtitle: "Weekly guided dives with your crew",
    price: "Free / $25",
    priceNote: "Free with Ocean Flow · $25 drop-in · Own gear + lanyard",
    duration: "Every Saturday",
    level: "AIDA 2+ certified",
    gradient: "from-ocean to-[#14566a]",
    description:
      "The heart of the club. Every Saturday, we meet at one of La Jolla's best dive spots — the Cove, the Canyon, Shores, or beyond — based on conditions. Sessions include a warm-up, skills focus, free diving time, and full safety coverage. It's training, community, and ocean exploration in one morning.",
    includes: [
      "Guided dives at La Jolla Cove, Canyon, Shores, and beyond",
      "Safety divers on every session",
      "Buddy matching for new members",
      "Conditions briefing and site selection",
    ],
  },
  {
    id: "coaching",
    title: "Private Coaching",
    subtitle: "Focused training for your specific goals",
    price: "$150 / session",
    priceNote: "2–3 hours · Certified freedivers only",
    duration: "Flexible schedule",
    level: "Any level",
    gradient: "from-teal to-sun",
    description:
      "One-on-one training tailored to what you need. Whether you're working through an equalization plateau, preparing for competition, overcoming depth anxiety, or want to accelerate your certification — private coaching is the fastest path forward.",
    includes: [
      "Video analysis of your diving technique",
      "Personalized training plans",
      "Equalization troubleshooting (Frenzel, mouthfill)",
      "Mental game and relaxation coaching",
      "Pool and/or ocean sessions based on your goals",
    ],
  },
  {
    id: "dry",
    title: "Dry Training & Community Collabs",
    subtitle: "Build your base on land",
    price: "Free / varies",
    priceNote: "Community events · Open to everyone",
    duration: "Various dates",
    level: "Everyone welcome",
    gradient: "from-coral to-sun",
    description:
      "Not everything happens in the water. Dry training sessions focus on breathing drills, stretching, mobility, CO₂/O₂ tables, and the land-based work that makes you a better diver. We also partner with local fitness communities, surf crews, and movement studios for cross-training.",
    includes: [
      "Diaphragmatic breathing and breath hold tables",
      "Stretching and thoracic mobility for deeper breathing",
      "CO₂ tolerance training",
      "Partner sessions with local studios and gyms",
      "Open to non-members — bring a friend",
    ],
  },
];

export default function ProgramsPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Our Programs
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            Courses, community &amp; training
          </h1>
          <p className="text-lg text-white/60 max-w-[600px] mx-auto leading-relaxed">
            AIDA-certified freediving courses for all levels. Weekly ocean sessions.
            Private coaching. And a community that shows up every Saturday.
          </p>
        </Reveal>
      </section>

      {/* AIDA Courses */}
      <section className="py-20 px-6 bg-salt">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label">AIDA Certification</div>
            <h2 className="section-title mb-4">The international standard</h2>
            <p className="section-desc mb-12">
              AIDA (International Association for the Development of Apnea) has been
              the global authority in freediving education and safety since 1992.
              Their certification system is recognized worldwide — your card works
              at any dive center on the planet.
            </p>
          </Reveal>

          <div className="space-y-4">
            {aidaCourses.map((course, i) => (
              <Reveal key={course.id} delay={i * 50}>
                <ExpandableCourse course={course} isAida={true} />
              </Reveal>
            ))}
          </div>

          {/* Comparison table */}
          <Reveal>
            <div className="mt-16 bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="p-8 md:p-12">
                <h3 className="font-serif text-2xl mb-2 tracking-tight">Which course should I take?</h3>
                <p className="text-sm text-[#5a6a7a] mb-8">A quick comparison of the three AIDA levels we offer.</p>

                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="border-b border-deep/10">
                        <th className="text-left py-3 pr-4 font-semibold text-[#5a6a7a] text-xs uppercase tracking-wide w-[120px]"></th>
                        <th className="text-left py-3 px-3 font-semibold text-xs uppercase tracking-wide text-teal">AIDA 1</th>
                        <th className="text-left py-3 px-3 font-semibold text-xs uppercase tracking-wide text-teal">AIDA 2</th>
                        <th className="text-left py-3 px-3 font-semibold text-xs uppercase tracking-wide text-teal">AIDA 3</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#2a2a2a]">
                      {[
                        { label: "Price", a1: "$200", a2: "$575", a3: "$700" },
                        { label: "Duration", a1: "1 day", a2: "2.5 days", a3: "3 days" },
                        { label: "Max depth", a1: "10m", a2: "20m", a3: "30m" },
                        { label: "STA", a1: "None", a2: "2:00 min", a3: "2:45 min" },
                        { label: "Dynamic", a1: "None", a2: "40m", a3: "55m" },
                        { label: "Depth", a1: "None", a2: "12–20m", a3: "24m" },
                        { label: "Prerequisites", a1: "None", a2: "None", a3: "AIDA 2" },
                        { label: "Swim test", a1: "100m", a2: "200m", a3: "AIDA 2 cert" },
                        { label: "Best for", a1: "Curious beginners", a2: "Committed beginners", a3: "Depth-focused divers" },
                      ].map((row) => (
                        <tr key={row.label} className="border-b border-deep/[0.05]">
                          <td className="py-3 pr-4 font-medium text-[#5a6a7a] text-xs uppercase tracking-wide whitespace-nowrap">{row.label}</td>
                          <td className="py-3 px-3">{row.a1}</td>
                          <td className="py-3 px-3">{row.a2}</td>
                          <td className="py-3 px-3">{row.a3}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AIDA Youth */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label text-coral before:bg-coral">Youth Program</div>
            <h2 className="section-title mb-4">AIDA Youth Certification</h2>
            <p className="section-desc mb-12">
              Four progressive levels designed specifically for kids ages 6–15. Water safety first, freediving skills second.
              Each level builds confidence, breath control, and ocean competence — never competition or max performance.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                level: "Bronze Dolphin",
                emoji: "🥉",
                age: "Ages 6+",
                maxDepth: "2m max",
                description: "Water confidence and safety fundamentals. Survival strokes, floating, basic finning, recovery breathing, and collecting objects from the bottom. No prior swimming skills required beyond basic comfort.",
                skills: ["Survival stroke & floating", "Mask, snorkel & fin basics", "Underwater swimming & direction changes", "Signal for help", "Recovery breathing"],
              },
              {
                level: "Silver Dolphin",
                emoji: "🥈",
                age: "Ages 6+",
                maxDepth: "Age-appropriate",
                description: "Introduction to equalization, duck dives, and buddy awareness. Kids learn to dive pulling a rope with proper head position, equalize at least once, and take turns watching their dive partner.",
                skills: ["Dry & wet equalization", "Duck dive from surface", "Rope diving with head position", "Partnering & buddy awareness", "Deeper object retrieval"],
              },
              {
                level: "Gold Dolphin",
                emoji: "🥇",
                age: "Ages 6+",
                maxDepth: "Age-appropriate",
                description: "Repetitive equalization, finned diving with proper technique, and using positive buoyancy on ascent. Kids learn relaxation before dives and recovery breathing after — the full freedive cycle.",
                skills: ["Repetitive equalization (2+ per dive)", "Finned diving with duck dive", "Positive buoyancy on ascent", "Pre-dive relaxation (45s+)", "Recovery breathing protocol"],
              },
              {
                level: "AIDA Junior",
                emoji: "🤿",
                age: "Ages 12+",
                maxDepth: "Age-appropriate",
                description: "The bridge to adult certification. Open water sessions, weight belt skills, advanced equalization, and the foundation for an AIDA 2 crossover at age 16. Requires 50m swim with mask and snorkel.",
                skills: ["Open water diving (4 sessions)", "Weight belt use & dump", "Advanced rope & fin diving", "2-min relaxed floating", "Pathway to AIDA 2 crossover at 16"],
              },
            ].map((course) => (
              <ExpandableYouthLevel key={course.level} course={course} />
            ))}
          </div>

          <Reveal>
            <div className="bg-gradient-to-br from-ocean to-deep rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl text-white mb-1">Depth recommendations by age</h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-[480px]">
                    AIDA Youth guidelines set age-based depth limits. Progress happens naturally — kids are never pushed to go deeper, longer, or farther.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 shrink-0">
                  {[
                    { age: "6–8", depth: "Age ÷ 4" },
                    { age: "8–10", depth: "Age ÷ 2" },
                    { age: "11–13", depth: "Age ÷ 2 + 2m" },
                    { age: "14–15", depth: "= Age in meters" },
                  ].map((r) => (
                    <div key={r.age} className="bg-white/[0.08] rounded-lg px-3 py-2 text-center">
                      <div className="text-white text-xs font-semibold">{r.age} yrs</div>
                      <div className="text-seafoam text-[11px]">{r.depth}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <p className="text-white/40 text-xs">4:1 max in-water ratio · Parent knowledge objectives required · No competitive elements</p>
                <Link href="/education#camp-garibaldi" className="inline-flex items-center gap-2 px-5 py-2 bg-coral text-white rounded-full font-medium text-sm no-underline hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all shrink-0">
                  Camp Garibaldi →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Other Programs */}
      <section className="py-16 md:py-20 px-6 bg-salt">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label">More ways to dive</div>
            <h2 className="section-title mb-12">Beyond certification</h2>
          </Reveal>

          <div className="space-y-4">
            {otherPrograms.map((p, i) => (
              <Reveal key={p.id} delay={i * 50}>
                <ExpandableCourse course={p} isAida={false} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="bg-deep py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="shrink-0 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3db8a4" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-serif text-xl">Safety first. Always.</div>
                  <div className="text-white/40 text-xs">DAN insured · AIDA certified · Red Cross First Aid/CPR/AED · Rescue trained</div>
                </div>
              </div>
              <div className="flex-1 text-white/60 text-sm leading-relaxed">
                Every session has trained safety divers. Every student learns rescue protocols.
                Joshua is fully insured through the Divers Alert Network (DAN), holds both
                AIDA Instructor and Youth Instructor certifications, and is American Red Cross
                certified in Adult and Pediatric First Aid, CPR, and AED. We don&apos;t cut corners —
                because the ocean doesn&apos;t forgive shortcuts.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Upcoming Courses */}
      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="section-label justify-center">Schedule</div>
              <h2 className="section-title">Upcoming courses &amp; events</h2>
              <p className="section-desc max-w-[560px] mx-auto">
                Dates fill up fast — inquire early to reserve your spot.
              </p>
            </div>
          </Reveal>

          <div className="space-y-4">
            {[
              {
                date: "Apr 5–6",
                day: "Sat–Sun",
                title: "AIDA 2 Certification",
                detail: "2-day course. Theory, pool session, open water dives at La Jolla Shores.",
                spots: "4 spots",
                href: "/contact/courses?course=aida2",
              },
              {
                date: "Apr 12",
                day: "Saturday",
                title: "AIDA 1 — Introduction",
                detail: "One-day intro to freediving fundamentals. No experience needed.",
                spots: "6 spots",
                href: "/contact/courses?course=aida1",
              },
              {
                date: "Apr 19–20",
                day: "Sat–Sun",
                title: "AIDA 2 Certification",
                detail: "2-day course. Theory, pool session, open water dives at La Jolla Shores.",
                spots: "4 spots",
                href: "/contact/courses?course=aida2",
              },
              {
                date: "Apr 26",
                day: "Saturday",
                title: "AIDA 1 — Introduction",
                detail: "One-day intro to freediving fundamentals. No experience needed.",
                spots: "6 spots",
                href: "/contact/courses?course=aida1",
              },
              {
                date: "May 3–4",
                day: "Sat–Sun",
                title: "AIDA 3 — Advanced",
                detail: "Advanced certification. Must hold AIDA 2. Deep training in the canyon.",
                spots: "3 spots",
                href: "/contact/courses?course=aida3",
              },
            ].map((event, i) => (
              <Reveal key={i} delay={i * 40}>
                <Link
                  href={event.href}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-salt rounded-xl p-4 sm:p-5 no-underline text-deep hover:-translate-y-0.5 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 sm:block sm:text-center shrink-0 sm:w-16">
                    <div className="font-serif text-lg text-deep leading-tight">{event.date}</div>
                    <div className="text-[10px] text-[#5a6a7a]">{event.day}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-between sm:justify-start">
                      <div className="text-sm font-semibold group-hover:text-teal transition-colors">{event.title}</div>
                      <span className="px-2 py-1 bg-teal/10 text-teal text-[10px] font-semibold rounded-full sm:hidden">{event.spots}</span>
                    </div>
                    <div className="text-xs text-[#5a6a7a]">{event.detail}</div>
                  </div>
                  <div className="shrink-0 text-right hidden sm:block">
                    <span className="px-2 py-1 bg-teal/10 text-teal text-[10px] font-semibold rounded-full">{event.spots}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="text-center mt-8">
              <p className="text-xs text-[#5a6a7a] mb-4">Don&apos;t see a date that works? We run courses on demand for groups of 2+.</p>
              <Link href="/contact/courses" className="btn btn-outline no-underline">
                Request custom dates →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Community Events */}
      <section className="bg-salt py-16 md:py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="section-label justify-center">Community</div>
              <h2 className="section-title">Weekly sessions</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="h-[180px] md:h-[240px] overflow-hidden">
                  <img src="/images/photos/joshua-lena-shores.jpg" alt="Joshua and Lena at La Jolla Shores" className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="text-[10px] text-[#5a6a7a] uppercase tracking-wider font-semibold mb-1">Saturdays · 7:00 AM · La Jolla Shores</div>
                  <h3 className="font-serif text-xl mb-1">Ocean Flow — yoga for freedivers</h3>
                  <div className="font-serif text-lg text-teal mb-2">$20 <span className="text-xs text-[#5a6a7a] font-sans">drop-in · includes free group dive after</span></div>
                  <p className="text-xs text-[#5a6a7a] leading-relaxed mb-3">
                    A pre-dive flow designed specifically for ocean people. Led by Lena — RYT yoga
                    teacher, freediver, and artist — this session blends gentle mobility, intercostal
                    opening, breath awareness, and deep relaxation to prepare your body and mind
                    for the water. Vinyasa meets apnea. The perfect warmup before we hit the canyon.
                  </p>
                  <p className="text-xs text-[#5a6a7a] leading-relaxed mb-4">
                    Open to all levels — you don&apos;t need to be a freediver or a yogi. Just show up.
                  </p>
                  <Link href="/contact" className="text-teal text-sm font-medium no-underline hover:underline">
                    Join the Saturday crew →
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="h-[180px] md:h-[240px] overflow-hidden relative">
                  <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                    <source src="/videos/group-freedive.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="p-6">
                  <div className="text-[10px] text-[#5a6a7a] uppercase tracking-wider font-semibold mb-1">Saturdays · 8:30 AM</div>
                  <h3 className="font-serif text-xl mb-1">Group ocean session</h3>
                  <div className="font-serif text-lg text-teal mb-2">Free with Ocean Flow <span className="text-xs text-[#5a6a7a] font-sans">/ $25 drop-in</span></div>
                  <p className="text-xs text-[#5a6a7a] leading-relaxed mb-4">
                    Guided dive from our mooring line at the canyon edge. Safety divers,
                    structured training, and a crew that knows these waters. Certified freedivers only (any agency).
                    Must bring own gear: wetsuit, fins, mask, snorkel, weight belt, and lanyard.
                    <a href="/documents/ljfc-waiver.pdf" className="text-teal hover:underline ml-1">Signed waiver required →</a>
                  </p>
                  <Link href="/contact/courses" className="text-teal text-sm font-medium no-underline hover:underline">
                    Get certified to join →
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <EmailCapture />
    </>
  );
}
