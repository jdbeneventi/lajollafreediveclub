import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "Programs — Freediving Courses & Training",
  description:
    "AIDA certification courses, beginner freediving experiences, weekly group ocean sessions, private coaching, and dry training in La Jolla, San Diego.",
};

const programs = [
  {
    id: "aida",
    title: "AIDA 2 Certification",
    subtitle: "The international standard for beginner freediving",
    duration: "2–3 days",
    level: "All levels welcome",
    gradient: "from-ocean to-teal",
    description:
      "The AIDA 2 Star course is the most recognized entry-level freediving certification in the world. Over 2–3 days, you'll learn freediving theory, breathing techniques, equalization, safety protocols, and complete both pool and open water sessions. You'll graduate certified to freedive to 20 meters with a buddy — and you'll have a community of divers to do it with.",
    includes: [
      "Theory: physiology, equalization, safety, dive planning",
      "Pool session: static breath holds, dynamic swimming",
      "Open water dives: technique, depth, and buddy protocols",
      "All gear included (mask, fins, wetsuit, weight belt)",
      "AIDA 2 Star international certification card",
      "Club membership for your first month",
    ],
  },
  {
    id: "discover",
    title: "Discover Freediving",
    subtitle: "Try freediving with zero commitment",
    duration: "Half day (4 hours)",
    level: "Complete beginners",
    gradient: "from-[#14566a] to-seafoam",
    description:
      "Not sure if freediving is for you? This half-day experience gives you a taste without the commitment of a full certification. You'll learn basic breathing technique, try your first guided breath holds in a pool, and get a feel for what freediving is all about. Most people are shocked by how long they can actually hold their breath with proper guidance.",
    includes: [
      "Introduction to breathing technique and relaxation",
      "Guided static breath holds (most hit 2+ minutes!)",
      "Basic pool skills and underwater swimming",
      "All equipment provided",
      "Applies toward AIDA 2 if you decide to continue",
    ],
  },
  {
    id: "group",
    title: "Group Ocean Sessions",
    subtitle: "Weekly guided dives with your crew",
    duration: "Every Saturday, 2–3 hours",
    level: "AIDA 2 certified or equivalent",
    gradient: "from-deep to-ocean",
    description:
      "This is the heart of the club. Every Saturday, we meet at one of La Jolla's best dive spots (conditions-dependent) for structured group freediving. Sessions include a warm-up, skills focus, free diving time, and safety coverage. It's training, community, and ocean exploration all in one morning.",
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
    duration: "Flexible — 1 session or ongoing",
    level: "Any level",
    gradient: "from-teal to-sun",
    description:
      "One-on-one training tailored to exactly what you need. Whether you're working through an equalization plateau, preparing for a competition, overcoming depth anxiety, or want to accelerate your certification — private coaching is the fastest path forward.",
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
    level: "Everyone",
    gradient: "from-coral to-sun",
    description:
      "Not everything happens in the water. Our dry training sessions focus on breathing drills, stretching, mobility, and CO2/O2 tables — the land-based work that makes you a better diver. We also partner with local fitness communities, surf crews, and movement studios for cross-training sessions.",
    includes: [
      "Diaphragmatic breathing and breath hold tables",
      "Stretching and thoracic mobility for deeper breathing",
      "CO2 tolerance training",
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
            Find your entry point
          </h1>
          <p className="text-lg text-white/60 max-w-[560px] mx-auto leading-relaxed">
            Whether you&apos;re ocean-curious or chasing depth records, there&apos;s a
            clear path for you here.
          </p>
        </Reveal>
      </section>

      {/* Programs */}
      <section className="py-20 px-6 bg-salt">
        <div className="max-w-[900px] mx-auto space-y-16">
          {programs.map((p, i) => (
            <Reveal key={p.id} delay={i * 50}>
              <div
                id={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm scroll-mt-28"
              >
                {/* Color bar */}
                <div className={`h-3 bg-gradient-to-r ${p.gradient}`} />

                <div className="p-8 md:p-12">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="px-3 py-1 bg-teal/10 text-teal rounded-full text-xs font-semibold">
                      {p.duration}
                    </span>
                    <span className="px-3 py-1 bg-deep/[0.06] text-[#5a6a7a] rounded-full text-xs font-semibold">
                      {p.level}
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl mb-2 tracking-tight">{p.title}</h2>
                  <p className="text-[#5a6a7a] text-lg mb-6">{p.subtitle}</p>

                  <p className="text-[1.02rem] leading-relaxed text-[#2a2a2a] mb-8">
                    {p.description}
                  </p>

                  <h3 className="text-sm font-semibold uppercase tracking-wide text-teal mb-4">
                    What&apos;s Included
                  </h3>
                  <ul className="space-y-3 mb-8">
                    {p.includes.map((item) => (
                      <li key={item} className="flex gap-3 items-start text-sm text-[#2a2a2a]">
                        <svg
                          className="w-5 h-5 text-seafoam shrink-0 mt-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact" className="btn btn-primary no-underline">
                    Get Started →
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <EmailCapture />
    </>
  );
}
