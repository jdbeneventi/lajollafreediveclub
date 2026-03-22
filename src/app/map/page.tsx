import Link from "next/link";
import { UnderwaterMap } from "./UnderwaterMap";
import { MarineLifeGuide } from "./MarineLifeGuide";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata = {
  title: "La Jolla Underwater Guide | La Jolla Freedive Club",
  description: "Interactive guide to La Jolla's underwater world — dive sites, submarine canyons, kelp forests, marine life field guide, and live data sources.",
};

export default function MapPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Underwater Field Guide
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            10 dive sites. 50+ species.<br className="hidden sm:block" /> One marine reserve.
          </h1>
          <p className="text-lg text-white/60 max-w-[560px] mx-auto leading-relaxed">
            The Matlahuayl State Marine Conservation Area protects one of the richest underwater
            ecosystems on the California coast. This is your freediver&apos;s guide to all of it.
          </p>
        </Reveal>
      </section>

      {/* Dive Sites & Map Section */}
      <section className="bg-salt py-20 px-6">
        <Reveal>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-deep/10 flex items-center justify-center text-lg">🗺️</div>
              <div>
                <h2 className="font-serif text-2xl text-deep">Dive sites &amp; data sources</h2>
                <p className="text-xs text-[#5a6a7a]">Every spot worth diving, plus the buoys and cameras feeding our conditions dashboard</p>
              </div>
            </div>
            <UnderwaterMap />
          </div>
        </Reveal>
      </section>

      {/* Stats Strip */}
      <section className="bg-deep py-16 px-6">
        <Reveal>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10", label: "Dive sites" },
              { number: "8", label: "Depth zones" },
              { number: "50+", label: "Species" },
              { number: "1929", label: "Reserve established" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-3xl md:text-4xl text-white mb-1">{stat.number}</div>
                <div className="text-xs text-white/40 tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Marine Life Field Guide */}
      <section className="bg-white py-20 px-6">
        <Reveal>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-deep/10 flex items-center justify-center text-lg">🐠</div>
              <div>
                <h2 className="font-serif text-2xl text-deep">Marine life field guide</h2>
                <p className="text-xs text-[#5a6a7a]">What you&apos;ll find in the water — species profiles, seasonality, behavior, and where to look</p>
              </div>
            </div>
            <MarineLifeGuide />
          </div>
        </Reveal>
      </section>

      {/* Bottom CTA */}
      <section className="bg-salt py-20 px-6">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-deep mb-4">
              Ready to see it for yourself?
            </h2>
            <p className="text-[#5a6a7a] leading-relaxed mb-8">
              Join us for a guided ocean session. We&apos;ll show you these sites firsthand
              and teach you the skills to dive them safely on your own.
            </p>
            <Link
              href="/programs"
              className="inline-block px-8 py-3.5 bg-coral text-white rounded-full font-medium text-sm no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all"
            >
              View our programs &rarr;
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
