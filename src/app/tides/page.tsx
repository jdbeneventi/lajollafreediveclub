import { Metadata } from "next";
import Link from "next/link";
import { TideCalendar } from "./TideCalendar";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "La Jolla Tide Calendar | La Jolla Freedive Club",
  description: "7-day tide calendar for La Jolla with best dive windows, tide heights, and freediving tips. Updated daily from NOAA.",
};

export default function TidesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Tides &amp; Moon
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            Know your windows.
          </h1>
          <p className="text-lg text-white/60 max-w-[560px] mx-auto leading-relaxed">
            Tides shape everything underwater — visibility, current, access.
            Plan your dives around the cycle and you&apos;ll have the ocean at its best.
          </p>
        </Reveal>
      </section>

      {/* Tide Calendar */}
      <section className="bg-salt py-20 px-6">
        <Reveal>
          <div className="max-w-5xl mx-auto">
            <TideCalendar />
          </div>
        </Reveal>
      </section>

      {/* Why Tides Matter — Educational Strip */}
      <section className="bg-deep py-20 px-6">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="section-label text-seafoam before:bg-seafoam justify-center text-center">
              Why It Matters
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-12">
              Why tides matter for freediving
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="font-serif text-xl text-seafoam mb-3">Incoming tide</div>
                <p className="text-sm text-white/50 leading-relaxed">
                  Fresh ocean water pushes in from offshore, bringing cleaner, clearer water.
                  Incoming tide generally means better visibility — the best conditions
                  for exploring reefs and the canyon edge.
                </p>
              </div>
              <div className="text-center">
                <div className="font-serif text-xl text-seafoam mb-3">The best window</div>
                <p className="text-sm text-white/50 leading-relaxed">
                  1-3 hours after low tide is the sweet spot. The tide has turned,
                  fresh water is flooding in, and you catch the cleanest visibility
                  before the current gets too strong at peak flow.
                </p>
              </div>
              <div className="text-center">
                <div className="font-serif text-xl text-seafoam mb-3">Spring vs. neap</div>
                <p className="text-sm text-white/50 leading-relaxed">
                  Spring tides (full/new moon) have bigger swings — stronger currents,
                  more water movement. Neap tides (quarter moons) are mellower.
                  Both have tradeoffs: spring tides flush more clean water in, but the current is real.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="bg-salt py-20 px-6">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-deep mb-4">
              Check today&apos;s full conditions
            </h2>
            <p className="text-[#5a6a7a] leading-relaxed mb-8">
              Tides are one piece of the puzzle. See the full picture — swell, wind,
              water temperature, visibility, and more — on the conditions dashboard.
            </p>
            <Link
              href="/conditions"
              className="inline-block px-8 py-3.5 bg-coral text-white rounded-full font-medium text-sm no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all"
            >
              Full conditions dashboard &rarr;
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Email Capture */}
      <section className="bg-white py-20 px-6">
        <Reveal>
          <div className="max-w-xl mx-auto">
            <EmailCapture />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
