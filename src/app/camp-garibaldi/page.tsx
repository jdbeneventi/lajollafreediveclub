import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "Camp Garibaldi — Kids Ocean Camp",
  description:
    "Week-long ocean camp for kids ages 8–16 in La Jolla. Freediving, surf survival, and water confidence through breath-first training. The ocean camp that starts from the inside out.",
};

const weekSchedule = [
  {
    day: "Monday",
    title: "Foundations",
    desc: "Morning warmup, breathing drills, pool session — static holds, underwater swimming, basic equalization.",
  },
  {
    day: "Tuesday",
    title: "Ocean Entry",
    desc: "Beach safety, wave dynamics, controlled ocean swims, snorkel skills, and first open water breath holds.",
  },
  {
    day: "Wednesday",
    title: "Surf Survival",
    desc: "Hold-down simulation, underwater navigation, rescue awareness, buddy protocols, and confidence building.",
  },
  {
    day: "Thursday",
    title: "Freediving Skills",
    desc: "Duck dives, depth progression, marine life ID, and guided freedives at La Jolla Cove (depth appropriate to age/skill).",
  },
  {
    day: "Friday",
    title: "Challenge Day",
    desc: "Skills showcase, personal bests, ocean exploration, awards ceremony, and graduation with families.",
  },
];

export default function CampGaribaldiPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-deep via-ocean to-coral/20 pt-36 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_80%,rgba(232,115,74,0.2)_0%,transparent_70%)]" />

        <Reveal>
          <div className="relative z-10">
            <div className="section-label text-coral before:bg-coral justify-center">
              Summer Program
            </div>
            <h1 className="font-serif text-[clamp(3rem,6vw,5rem)] text-white font-normal leading-tight tracking-tight mb-6">
              Camp <em className="italic text-coral">Garibaldi</em>
            </h1>
            <p className="text-lg text-white/60 max-w-[600px] mx-auto leading-relaxed mb-10">
              The ocean camp that starts from the inside out. A week-long program
              teaching kids real water skills — freediving, surf survival, and
              ocean confidence — through breath-first training.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact/camp" className="btn btn-primary no-underline">
                Reserve a Spot →
              </Link>
              <a href="#schedule" className="btn btn-ghost no-underline">
                See the Week
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Philosophy */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <div className="section-label">Our Approach</div>
                <h2 className="section-title">
                  Skills that start from the inside out
                </h2>
                <p className="section-desc">
                  Most ocean programs start in the water and hope kids figure out how
                  to stay calm. We flip that. Camp Garibaldi begins with breathing
                  drills and composure training on land — so when kids enter the ocean,
                  they&apos;re already equipped with the internal tools to handle it.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  {
                    num: "01",
                    title: "Breath Control",
                    desc: "Kids learn diaphragmatic breathing and basic breath holds in a controlled environment before the ocean.",
                  },
                  {
                    num: "02",
                    title: "Water Confidence",
                    desc: "Progressive exposure — pool to shallows to open water. Every step builds on real competence, not just courage.",
                  },
                  {
                    num: "03",
                    title: "Practical Skills",
                    desc: "Freediving technique, surf survival, rescue awareness, and marine ecology. Skills they'll carry for life.",
                  },
                ].map((item) => (
                  <div key={item.num} className="flex gap-4">
                    <span className="font-serif text-2xl text-teal/30">{item.num}</span>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-sm text-[#5a6a7a] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Week Schedule */}
      <section id="schedule" className="bg-salt py-24 px-6 scroll-mt-20">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label">The Week</div>
            <h2 className="section-title mb-12">Five days, one transformation</h2>
          </Reveal>

          <div className="space-y-4">
            {weekSchedule.map((day, i) => (
              <Reveal key={day.day} delay={i * 60}>
                <div className="bg-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <div className="flex items-center gap-4 md:w-48 shrink-0">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-sun flex items-center justify-center text-white font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-xs text-[#5a6a7a] uppercase tracking-wide">
                        {day.day}
                      </div>
                      <div className="font-semibold">{day.title}</div>
                    </div>
                  </div>
                  <p className="text-sm text-[#5a6a7a] leading-relaxed">{day.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: "Ages", value: "8–16", detail: "Grouped by age and ability" },
                { label: "Ratio", value: "8:1", detail: "Campers to instructor" },
                { label: "Duration", value: "5 days", detail: "Monday–Friday, 9am–3pm" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-8 bg-salt rounded-2xl">
                  <div className="text-xs text-teal font-semibold uppercase tracking-wide mb-2">
                    {stat.label}
                  </div>
                  <div className="font-serif text-5xl text-deep mb-2">{stat.value}</div>
                  <p className="text-sm text-[#5a6a7a]">{stat.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Parent Testimonial */}
      <section className="bg-deep py-20 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <Reveal>
            <span className="font-serif text-6xl text-white/10">&ldquo;</span>
            <p className="text-xl text-white/80 leading-relaxed mb-8 font-light">
              My son did Camp Garibaldi last summer and came back a different kid in
              the water. He went from nervous about waves to body surfing and holding
              his breath underwater for fun. Worth every penny.
            </p>
            <div className="text-white/50 text-sm">
              <span className="font-semibold text-white/70">Jennifer T.</span> · Camp Garibaldi Parent
            </div>
          </Reveal>
        </div>
      </section>

      <EmailCapture />
    </>
  );
}
