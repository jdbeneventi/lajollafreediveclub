import { Metadata } from "next";
import { UnderwaterMap } from "./UnderwaterMap";

export const metadata: Metadata = {
  title: "La Jolla Underwater Guide | La Jolla Freedive Club",
  description: "Interactive map of La Jolla's underwater world — dive sites, submarine canyons, kelp forests, marine life zones, and live data sources.",
};

export default function MapPage() {
  return (
    <main className="min-h-screen bg-salt">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="section-label">Field guide</div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-deep mb-4">
          The underwater world of La Jolla
        </h1>
        <p className="text-[#5a6a7a] text-lg leading-relaxed max-w-2xl mb-12">
          From the kelp forests of the Cove to the 900-foot walls of the submarine canyon — 
          a freediver&apos;s guide to every dive site, depth zone, and marine habitat along the La Jolla coast. 
          Plus the buoys, cameras, and tide stations that feed our live conditions dashboard.
        </p>

        <UnderwaterMap />
      </div>
    </main>
  );
}
