import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

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
    id: "discover",
    title: "Discover Freediving",
    subtitle: "Try it with zero commitment",
    duration: "Half day (4 hours)",
    level: "Complete beginners",
    gradient: "from-teal to-seafoam",
    description:
      "Not sure if freediving is for you? This half-day experience gives you a taste without the commitment of a full certification. You'll learn basic breathing technique, try your first guided breath holds in a pool, and get a feel for what freediving is all about. Most people are shocked by how long they can actually hold their breath with proper guidance — typically 2–3 minutes on the first session.",
    includes: [
      "Introduction to breathing technique and relaxation",
      "Guided static breath holds",
      "Basic pool skills and underwater swimming",
      "All equipment provided",
      "Applies toward AIDA 1 or 2 if you decide to continue",
    ],
  },
  {
    id: "group",
    title: "Group Ocean Sessions",
    subtitle: "Weekly guided dives with your crew",
    duration: "Every Saturday, 2–3 hours",
    level: "AIDA 2 certified or equivalent",
    gradient: "from-ocean to-[#14566a]",
    description:
      "The heart of the club. Every Saturday, we meet at one of La Jolla's best dive spots — the Cove, the Canyon, Shores, or beyond — based on conditions. Sessions include a warm-up, skills focus, free diving time, and full safety coverage. It's training, community, and ocean exploration in one morning.",
    includes: [
      "Guided dives at La Jolla Cove, Canyon, Shores, and beyond",
      "Safety divers on every session",
      "Skills coaching and technique feedback",
      "Buddy matching for new members",
      "Conditions briefing and site selection",
    ],
  },
  {
    id: "coaching",
    title: "Private Coaching",
    subtitle: "Focused training for your specific goals",
    duration: "Flexible — single session or ongoing",
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
    duration: "Various — check schedule",
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

function Check() {
  return (
    <svg className="w-5 h-5 text-seafoam shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

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

          <div className="space-y-12">
            {aidaCourses.map((course, i) => (
              <Reveal key={course.id} delay={i * 50}>
                <div id={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm scroll-mt-28">
                  <div className={`h-3 bg-gradient-to-r ${course.gradient}`} />

                  <div className="p-8 md:p-12">
                    {/* Header */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="px-3 py-1 bg-teal/10 text-teal rounded-full text-xs font-semibold">
                        {course.duration}
                      </span>
                      <span className="px-3 py-1 bg-deep/[0.06] text-[#5a6a7a] rounded-full text-xs font-semibold">
                        {course.level}
                      </span>
                      <span className="px-3 py-1 bg-coral/10 text-coral rounded-full text-xs font-semibold">
                        Max depth: {course.maxDepth}
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl mb-2 tracking-tight">{course.title}</h2>
                    <p className="text-[#5a6a7a] text-lg mb-6">{course.subtitle}</p>
                    <p className="text-[1.02rem] leading-relaxed text-[#2a2a2a] mb-8">{course.description}</p>

                    {/* Two-column: Skills + Requirements */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-teal mb-4">
                          What you&apos;ll learn
                        </h3>
                        <ul className="space-y-2.5">
                          {course.skills.map((skill) => (
                            <li key={skill} className="flex gap-3 items-start text-sm text-[#2a2a2a]">
                              <Check />
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-teal mb-4">
                          Requirements
                        </h3>
                        <div className="space-y-4">
                          {[
                            { label: "Age", value: course.requirements.age },
                            { label: "Swim test", value: course.requirements.swim },
                            { label: "Prerequisites", value: course.requirements.prerequisites },
                            { label: "Certification standards", value: course.requirements.certification },
                          ].map((req) => (
                            <div key={req.label}>
                              <div className="text-xs font-semibold text-[#5a6a7a] uppercase tracking-wide mb-1">
                                {req.label}
                              </div>
                              <div className="text-sm text-[#2a2a2a]">{req.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Course format */}
                    <div className="bg-salt rounded-xl p-6 mb-8">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-teal mb-4">
                        Course format
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Duration", value: course.format.duration },
                          { label: "Theory", value: course.format.theory },
                          { label: "Water sessions", value: course.format.water },
                          { label: "Ratios", value: course.format.ratios },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="text-xs font-semibold text-[#5a6a7a] uppercase tracking-wide mb-1">
                              {item.label}
                            </div>
                            <div className="text-sm text-[#2a2a2a] leading-relaxed">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href="/contact/courses" className="btn btn-primary no-underline">
                      Get started →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Comparison table */}
          <Reveal>
            <div className="mt-16 bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="p-8 md:p-12">
                <h3 className="font-serif text-2xl mb-2 tracking-tight">Which course should I take?</h3>
                <p className="text-sm text-[#5a6a7a] mb-8">A quick comparison of the three AIDA levels we offer.</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-deep/10">
                        <th className="text-left py-3 pr-4 font-semibold text-[#5a6a7a] text-xs uppercase tracking-wide"></th>
                        <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-teal">AIDA 1</th>
                        <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-teal">AIDA 2</th>
                        <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-teal">AIDA 3</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#2a2a2a]">
                      {[
                        { label: "Duration", a1: "1 day", a2: "2.5 days", a3: "3 days" },
                        { label: "Max depth", a1: "10m", a2: "20m", a3: "30m" },
                        { label: "STA requirement", a1: "None", a2: "2:00 min", a3: "2:45 min" },
                        { label: "Dynamic requirement", a1: "None", a2: "40m", a3: "55m" },
                        { label: "Depth requirement", a1: "None", a2: "12–20m", a3: "24m" },
                        { label: "Prerequisites", a1: "None", a2: "None", a3: "AIDA 2" },
                        { label: "Swim test", a1: "100m", a2: "200m", a3: "AIDA 2 cert" },
                        { label: "Best for", a1: "Curious beginners", a2: "Committed beginners", a3: "Depth-focused divers" },
                      ].map((row) => (
                        <tr key={row.label} className="border-b border-deep/[0.05]">
                          <td className="py-3 pr-4 font-medium text-[#5a6a7a] text-xs uppercase tracking-wide">{row.label}</td>
                          <td className="py-3 px-4">{row.a1}</td>
                          <td className="py-3 px-4">{row.a2}</td>
                          <td className="py-3 px-4">{row.a3}</td>
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

      {/* Other Programs */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label">More ways to dive</div>
            <h2 className="section-title mb-12">Beyond certification</h2>
          </Reveal>

          <div className="space-y-10">
            {otherPrograms.map((p, i) => (
              <Reveal key={p.id} delay={i * 50}>
                <div id={p.id} className="bg-salt rounded-2xl overflow-hidden scroll-mt-28">
                  <div className={`h-2 bg-gradient-to-r ${p.gradient}`} />
                  <div className="p-8 md:p-10">
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="px-3 py-1 bg-teal/10 text-teal rounded-full text-xs font-semibold">
                        {p.duration}
                      </span>
                      <span className="px-3 py-1 bg-deep/[0.06] text-[#5a6a7a] rounded-full text-xs font-semibold">
                        {p.level}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl mb-2 tracking-tight">{p.title}</h3>
                    <p className="text-[#5a6a7a] mb-4">{p.subtitle}</p>
                    <p className="text-[0.95rem] leading-relaxed text-[#2a2a2a] mb-6">{p.description}</p>

                    <ul className="space-y-2.5 mb-6">
                      {p.includes.map((item) => (
                        <li key={item} className="flex gap-3 items-start text-sm text-[#2a2a2a]">
                          <Check />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <Link href="/contact/courses" className="btn btn-primary no-underline">
                      Get started →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Courses */}
      <section className="bg-white py-24 px-6">
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
                title: "Discover Freediving",
                detail: "Half-day intro. Perfect for first-timers. Pool session + beach dive.",
                spots: "6 spots",
                href: "/contact/courses?course=discover",
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
                  className="flex items-center gap-6 bg-salt rounded-xl p-5 no-underline text-deep hover:-translate-y-0.5 hover:shadow-md transition-all group"
                >
                  <div className="text-center shrink-0 w-16">
                    <div className="font-serif text-lg text-deep leading-tight">{event.date}</div>
                    <div className="text-[10px] text-[#5a6a7a]">{event.day}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold group-hover:text-teal transition-colors">{event.title}</div>
                    <div className="text-xs text-[#5a6a7a]">{event.detail}</div>
                  </div>
                  <div className="shrink-0 text-right">
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
      <section className="bg-salt py-24 px-6">
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
                <div className="h-[240px] overflow-hidden">
                  <img src="/images/photos/joshua-lena-shores.jpg" alt="Joshua and Lena at La Jolla Shores" className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="text-[10px] text-[#5a6a7a] uppercase tracking-wider font-semibold mb-1">Saturdays · 7:00 AM</div>
                  <h3 className="font-serif text-xl mb-2">Morning stretch &amp; breathe</h3>
                  <p className="text-xs text-[#5a6a7a] leading-relaxed mb-4">
                    Start your Saturday with a yoga and stretching session on the beach before
                    we hit the water. Intercostal mobility, diaphragm work, and breathing
                    drills — everything that makes your dive better. Open to all levels.
                  </p>
                  <Link href="/contact" className="text-teal text-sm font-medium no-underline hover:underline">
                    Join the Saturday crew →
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="h-[240px] overflow-hidden bg-gradient-to-br from-deep to-ocean flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="font-serif text-3xl mb-1">Group Dive</div>
                    <div className="text-sm opacity-60">La Jolla Canyon</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[10px] text-[#5a6a7a] uppercase tracking-wider font-semibold mb-1">Saturdays · 8:30 AM</div>
                  <h3 className="font-serif text-xl mb-2">Group ocean session</h3>
                  <p className="text-xs text-[#5a6a7a] leading-relaxed mb-4">
                    Guided dive from our mooring line at the canyon edge. Safety divers,
                    structured training, and a crew that knows these waters. AIDA 2
                    certification (or equivalent) required.
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
