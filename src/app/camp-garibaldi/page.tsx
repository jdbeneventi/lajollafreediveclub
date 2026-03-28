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
    day: "Day 1",
    title: "Foundations",
    desc: "Morning warmup, breathing drills, pool session — static holds, underwater swimming, basic equalization.",
  },
  {
    day: "Day 2",
    title: "Ocean Entry",
    desc: "Beach safety, wave dynamics, controlled ocean swims, snorkel skills, and first open water breath holds.",
  },
  {
    day: "Day 3",
    title: "Surf Survival",
    desc: "Hold-down simulation, underwater navigation, rescue awareness, buddy protocols, and confidence building.",
  },
  {
    day: "Day 4",
    title: "Freediving Skills",
    desc: "Duck dives, depth progression, marine life ID, and guided freedives at La Jolla Cove (depth appropriate to age/skill).",
  },
  {
    day: "Day 5",
    title: "Challenge Day",
    desc: "Skills showcase, personal bests, ocean exploration, awards ceremony, and graduation with families.",
  },
];

const threeDay = [
  {
    day: "Day 1",
    title: "Foundations & Ocean Entry",
    desc: "Breathing drills and composure training on land, followed by beach safety, controlled ocean swims, snorkel skills, and first open water breath holds.",
  },
  {
    day: "Day 2",
    title: "Surf Survival & Freediving",
    desc: "Hold-down simulation, underwater navigation, buddy protocols, duck dives, depth progression, and guided freedives at La Jolla Cove.",
  },
  {
    day: "Day 3",
    title: "Challenge Day",
    desc: "Marine life ID, skills showcase, personal bests, ocean exploration, and graduation with families.",
  },
];

export default function CampGaribaldiPage() {
  return (
    <>
      {/* Education Banner */}
      <div className="bg-ocean/60 border-b border-seafoam/15 text-center py-3 px-6 mt-[72px]">
        <p className="text-sm text-salt/70">
          Camp Garibaldi is the flagship program in our Ocean Education series.{" "}
          <Link href="/education" className="text-seafoam font-medium underline underline-offset-2 hover:text-seafoam/80 transition-colors">
            See all programs &rarr;
          </Link>
        </p>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-deep via-ocean to-coral/20 pt-20 pb-24 px-6 text-center overflow-hidden">
        <img src="/images/photos/joshua-hank-youth.jpg" alt="Joshua with young student at the ocean" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/60 via-ocean/70 to-coral/20" />
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
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
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

      {/* Schedule */}
      <section id="schedule" className="bg-salt py-24 px-6 scroll-mt-20">
        <div className="max-w-[900px] mx-auto">
          {/* 5-Day Schedule */}
          <Reveal>
            <div className="section-label">Full Week (5 Days)</div>
            <h2 className="section-title mb-4">The complete experience</h2>
            <p className="section-desc mb-12">
              Five days of progressive skill building — from breathing drills on land to freediving at the Cove. This is Session II (July 13–17).
            </p>
          </Reveal>

          <div className="space-y-4 mb-20">
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

          {/* 3-Day Schedule */}
          <Reveal>
            <div className="section-label">Intensive (3 Days)</div>
            <h2 className="section-title mb-4">Same skills, compressed</h2>
            <p className="section-desc mb-12">
              The core curriculum distilled into three focused days. Sessions I (June 15–17) and III (Aug 10–12).
            </p>
          </Reveal>

          <div className="space-y-4">
            {threeDay.map((day, i) => (
              <Reveal key={day.day} delay={i * 60}>
                <div className="bg-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <div className="flex items-center gap-4 md:w-48 shrink-0">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-seafoam flex items-center justify-center text-white font-bold text-sm">
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
                { label: "Ratio", value: "4:1", detail: "Max 4 campers per instructor" },
                { label: "Sessions", value: "3 or 5", detail: "3-day or full-week, 9am–3pm" },
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

      {/* Summer 2026 Dates */}
      <section className="bg-gradient-to-b from-salt to-white py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label text-coral before:bg-coral">Summer 2026</div>
            <h2 className="section-title mb-4">Camp Dates</h2>
            <p className="section-desc mb-12">
              Three sessions this summer. Spots are limited — we keep groups small so every kid gets real attention.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                session: "Session I",
                dates: "June 15–17",
                days: "3 days",
                note: "Sun–Tue",
                price: "$450",
                status: "Open",
              },
              {
                session: "Session II",
                dates: "July 13–17",
                days: "5 days",
                note: "Sun–Thu",
                price: "$750",
                status: "Open",
                featured: true,
              },
              {
                session: "Session III",
                dates: "August 10–12",
                days: "3 days",
                note: "Sun–Tue",
                price: "$450",
                status: "Open",
              },
            ].map((s) => (
              <Reveal key={s.session}>
                <div
                  className={`relative rounded-2xl p-8 text-center flex flex-col items-center ${
                    s.featured
                      ? "bg-deep text-white ring-2 ring-coral/30"
                      : "bg-white border border-deep/10"
                  }`}
                >
                  {s.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-coral text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Full Week
                    </span>
                  )}
                  <div
                    className={`text-xs font-semibold uppercase tracking-wide mb-3 ${
                      s.featured ? "text-coral" : "text-teal"
                    }`}
                  >
                    {s.session}
                  </div>
                  <div
                    className={`font-serif text-3xl mb-1 ${
                      s.featured ? "text-white" : "text-deep"
                    }`}
                  >
                    {s.dates}
                  </div>
                  <div
                    className={`text-sm mb-1 ${
                      s.featured ? "text-white/50" : "text-[#5a6a7a]"
                    }`}
                  >
                    {s.days} · {s.note}
                  </div>
                  <div
                    className={`font-serif text-2xl mt-3 ${
                      s.featured ? "text-coral" : "text-deep"
                    }`}
                  >
                    {s.price}
                  </div>
                  <div
                    className={`text-xs font-semibold uppercase tracking-wide mt-2 ${
                      s.featured ? "text-seafoam" : "text-teal"
                    }`}
                  >
                    {s.status}
                  </div>
                  <Link
                    href="/contact/camp"
                    className={`mt-4 inline-block text-sm font-semibold no-underline px-6 py-2.5 rounded-full transition-all ${
                      s.featured
                        ? "bg-coral text-white hover:bg-coral/90"
                        : "bg-deep text-white hover:bg-deep/90"
                    }`}
                  >
                    Reserve a Spot →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-center text-sm text-[#5a6a7a] mt-8">
              All sessions run 9am–3pm daily. Gear provided. Ages 8–16.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why Camp Garibaldi */}
      <section className="bg-deep py-20 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <Reveal>
            <div className="section-label text-seafoam before:bg-seafoam justify-center">
              Why This Camp
            </div>
            <h2 className="font-serif text-3xl text-white font-normal mb-8">
              What makes this different
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              {[
                {
                  title: "AIDA-Certified Instruction",
                  desc: "Taught by San Diego's only AIDA-certified youth instructor. Real credentials, not just lifeguard training.",
                },
                {
                  title: "4:1 Ratio",
                  desc: "Max four kids per instructor. Every child gets individual attention in and out of the water.",
                },
                {
                  title: "Breath-First Methodology",
                  desc: "Kids learn composure and breath control before entering the ocean — so they arrive in the water already equipped.",
                },
                {
                  title: "La Jolla Marine Reserve",
                  desc: "We train in Matlahuayl SMR — one of the most biodiverse marine protected areas in Southern California.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-6">
                  <h4 className="text-white font-semibold text-sm mb-2">{item.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <EmailCapture />
    </>
  );
}
