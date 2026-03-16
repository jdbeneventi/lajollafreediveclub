import { UnderwaterMap } from "./UnderwaterMap";
import { MarineLifeGuide } from "./MarineLifeGuide";

export const metadata = {
  title: "La Jolla Underwater Guide | La Jolla Freedive Club",
  description: "Interactive guide to La Jolla's underwater world — dive sites, submarine canyons, kelp forests, marine life field guide, and live data sources.",
};

export default function MapPage() {
  return (
    <main className="min-h-screen bg-salt">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="section-label">Field guide</div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-deep mb-4">
          The underwater world of La Jolla
        </h1>
        <p className="text-[#5a6a7a] text-lg leading-relaxed max-w-2xl mb-16">
          From the kelp forests of the Cove to the 900-foot walls of the submarine canyon &mdash;
          a freediver&apos;s guide to every dive site, depth zone, habitat, and species
          along the La Jolla coast.
        </p>

        {/* Dive Sites & Map Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-deep/10 flex items-center justify-center text-lg">🗺️</div>
            <div>
              <h2 className="font-serif text-2xl text-deep">Dive sites &amp; data sources</h2>
              <p className="text-xs text-[#5a6a7a]">Every spot worth diving, plus the buoys and cameras feeding our conditions dashboard</p>
            </div>
          </div>
          <UnderwaterMap />
        </section>

        {/* Marine Life Field Guide */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-deep/10 flex items-center justify-center text-lg">🐠</div>
            <div>
              <h2 className="font-serif text-2xl text-deep">Marine life field guide</h2>
              <p className="text-xs text-[#5a6a7a]">What you&apos;ll find in the water — species profiles, seasonality, behavior, and where to look</p>
            </div>
          </div>
          <MarineLifeGuide />
        </section>

        {/* Bottom CTA */}
        <div className="bg-deep rounded-2xl p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h3 className="font-serif text-xl text-white mb-2">Ready to explore?</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Join us for a guided ocean session. We&apos;ll show you these sites firsthand
              and teach you the skills to dive them safely on your own.
            </p>
          </div>
          <a href="/programs" className="shrink-0 px-6 py-3 bg-coral text-white rounded-full font-medium text-sm no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all text-center">
            View our programs &rarr;
          </a>
        </div>
      </div>
    </main>
  );
}
