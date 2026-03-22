import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ConditionsWidget } from "./ConditionsWidget";
import { AlmanacWidget } from "./AlmanacWidget";
import { ConditionsEmailForm } from "./ConditionsEmailForm";


export const metadata: Metadata = {
  title: "La Jolla Dive Conditions Today — Live Ocean Data",
  description:
    "Live La Jolla dive conditions: AI visibility, swell, wind, water temp, tides, moon phase, seasonal species, and what's in the water right now. Updated every 10 minutes from Scripps Pier.",
  keywords: [
    "La Jolla dive conditions",
    "Scripps Pier wave data",
    "La Jolla water temperature",
    "freediving conditions San Diego",
    "La Jolla Cove visibility",
    "La Jolla tide chart",
    "La Jolla moon phase diving",
  ],
};

const spots = [
  {
    name: "La Jolla Cove",
    depth: "5–30 ft",
    best: "Small swell, light wind, morning",
    notes: "Protected from south swell. Best vis on incoming tide with NW wind or calm. Avoid after rain.",
  },
  {
    name: "La Jolla Shores",
    depth: "10–40 ft",
    best: "Low swell, calm wind",
    notes: "Sandy entry, gradual depth. Gets surge on south swells. Best on flat days or with north wind.",
  },
  {
    name: "La Jolla Canyon",
    depth: "30–80+ ft",
    best: "Calm conditions only",
    notes: "Current can rip along the rim. Only dive with experienced buddies on good days. Check for upwelling.",
  },
  {
    name: "Cardiff Reef",
    depth: "10–25 ft",
    best: "Low swell, incoming tide",
    notes: "Warmer water than La Jolla. Leopard sharks in summer. Best vis on incoming tide, calm mornings.",
  },
];

const resources = [
  {
    name: "Scripps Pier Cam (Surface)",
    url: "https://scripps.ucsd.edu/piercam",
    desc: "Live view of La Jolla Shores from Scripps Pier. Best way to check surface conditions visually.",
  },
  {
    name: "Scripps Pier Cam (Underwater)",
    url: "https://coollab.ucsd.edu/pierviz/",
    desc: "Live underwater camera at ~13ft depth on a pier piling. Shows vis, marine life, and water clarity.",
  },
  {
    name: "CDIP La Jolla Forecast",
    url: "https://cdip.ucsd.edu/themes/?d2=p70:s:073:st:1",
    desc: "Wave model forecast from Scripps' Coastal Data Information Program. The most accurate local source.",
  },
  {
    name: "Surf Forecast — San Diego",
    url: "https://www.surf-forecast.com/regions/San-Diego-County",
    desc: "Swell forecast by break. Check La Jolla Cove, La Jolla Shores, and Scripps Pier specifically.",
  },
  {
    name: "NDBC Buoy LJPC1",
    url: "https://www.ndbc.noaa.gov/station_page.php?station=ljpc1",
    desc: "Raw buoy data from Scripps Pier — wave height, period, wind, updated every 30 minutes.",
  },
  {
    name: "2026 Tide Calendar (PDF)",
    url: "https://scripps.ucsd.edu/system/files/2025-12/Tides2026.pdf",
    desc: "Scripps tide predictions for the year. Incoming tide generally means better vis for freediving.",
  },
  {
    name: "Sea Surface Temperature",
    url: "https://data.caloos.org/#dashboards/sensors/6f6e75db-710c-491a-87d6-af4a4d065537/by-station?selected=120738",
    desc: "Real-time SST from CalOOS. Helps decide between your 3mm and 5mm wetsuit.",
  },
];

export default function ConditionsPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Dive Conditions
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            Know before you go
          </h1>
          <p className="text-lg text-white/60 max-w-[560px] mx-auto leading-relaxed">
            Real-time ocean data from Scripps Pier, live cameras, and
            freediving-specific guidance for La Jolla dive spots.
          </p>
        </Reveal>
      </section>

      {/* Live Data Widget */}
      <section className="bg-salt py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <ConditionsWidget />
          </Reveal>
          <Reveal>
            <AlmanacWidget />
          </Reveal>
          {/* Kelp Status */}
          {(() => {
            const month = new Date().getMonth();
            const kelp = month >= 11 || month <= 1
              ? { icon: "⚠️", status: "Winter storms thin the canopy. Kelp regrowing.", season: "Winter" }
              : month <= 4
              ? { icon: "🌿", status: "Spring growth — canopy rebuilding rapidly. Up to 2ft/day.", season: "Spring" }
              : month <= 7
              ? { icon: "🌿", status: "Peak canopy. Densest kelp of the year.", season: "Summer" }
              : { icon: "🌿", status: "Healthy canopy. Best diving conditions.", season: "Fall" };
            return (
              <div className="mt-6 bg-deep rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl shrink-0">{kelp.icon}</span>
                  <div>
                    <div className="text-white font-semibold text-sm">Kelp Status — {kelp.season}</div>
                    <div className="text-white/50 text-xs leading-relaxed mt-0.5">{kelp.status}</div>
                  </div>
                </div>
                <a
                  href="https://kelpwatch.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-teal/20 text-seafoam rounded-full text-xs font-semibold no-underline hover:bg-teal/30 transition-colors shrink-0"
                >
                  Satellite view ↗
                </a>
              </div>
            );
          })()}

          {/* Subscribe + Support */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-ocean to-deep rounded-2xl p-6 text-center">
              <h3 className="font-serif text-lg text-white mb-2">Get this in your inbox</h3>
              <p className="text-white/50 text-xs leading-relaxed mb-4">
                Daily conditions at 6am. Swell, wind, water temp, dive grade, and tides — before you even check the surf cam.
              </p>
              <ConditionsEmailForm />
            </div>
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-2xl mb-2">☕</div>
              <h3 className="font-serif text-lg mb-2">Support this tool</h3>
              <p className="text-xs text-[#5a6a7a] leading-relaxed mb-4">
                Free and always will be. If it helps you plan better dives, consider supporting the project.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://buymeacoffee.com/lajollafreediveclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal text-white rounded-full font-semibold text-sm no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(27,107,107,0.4)] transition-all"
                >
                  Buy me a coffee →
                </a>
                <a
                  href="mailto:joshuabeneventi@gmail.com?subject=Conditions%20Dashboard%20Feedback"
                  className="text-xs text-[#5a6a7a] underline hover:text-teal transition-colors"
                >
                  Send feedback or suggestions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pier Cams */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label">Live cameras</div>
            <h2 className="section-title mb-8">Eyes on the water</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <a
                href="https://scripps.ucsd.edu/piercam"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-salt rounded-2xl overflow-hidden no-underline text-deep hover:-translate-y-1 hover:shadow-lg transition-all group"
              >
                <div className="h-[180px] bg-gradient-to-br from-ocean to-teal flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="font-serif text-2xl mb-1">Surface Cam</div>
                    <div className="text-sm opacity-60">Scripps Pier → La Jolla Shores</div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-[#5a6a7a] leading-relaxed">
                    Live view of La Jolla Shores from Scripps Pier. Check surface
                    conditions, swell size, and wind chop before heading out.
                  </p>
                  <span className="text-teal text-sm font-medium mt-3 block group-hover:underline">
                    View live cam →
                  </span>
                </div>
              </a>
              <a
                href="https://coollab.ucsd.edu/pierviz/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-salt rounded-2xl overflow-hidden no-underline text-deep hover:-translate-y-1 hover:shadow-lg transition-all group"
              >
                <div className="h-[180px] bg-gradient-to-br from-deep to-ocean flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="font-serif text-2xl mb-1">Underwater Cam</div>
                    <div className="text-sm opacity-60">~13ft depth at Scripps Pier</div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-[#5a6a7a] leading-relaxed">
                    Live underwater camera on a pier piling. See actual visibility,
                    marine life, and water clarity in real time.
                  </p>
                  <span className="text-teal text-sm font-medium mt-3 block group-hover:underline">
                    View underwater cam →
                  </span>
                </div>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Spot Guide */}
      <section className="bg-salt py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label">Spot guide</div>
            <h2 className="section-title mb-4">Reading the conditions</h2>
            <p className="section-desc mb-10">
              Every spot responds differently to swell, wind, and tide. Here&apos;s
              what to look for at each of our regular dive sites.
            </p>
          </Reveal>
          <div className="space-y-4">
            {spots.map((spot, i) => (
              <Reveal key={spot.name} delay={i * 60}>
                <div className="bg-white rounded-xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                    <div className="md:w-48 shrink-0">
                      <h3 className="font-serif text-xl mb-1">{spot.name}</h3>
                      <span className="text-xs text-[#5a6a7a]">{spot.depth}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm mb-2">
                        <span className="font-semibold text-teal">Best conditions: </span>
                        <span className="text-[#2a2a2a]">{spot.best}</span>
                      </div>
                      <p className="text-sm text-[#5a6a7a] leading-relaxed">{spot.notes}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label">Resources</div>
            <h2 className="section-title mb-4">The full toolkit</h2>
            <p className="section-desc mb-10">
              These are the same sources we check every morning before deciding
              where to dive. Bookmark the ones that matter to you.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {resources.map((r, i) => (
              <Reveal key={r.name} delay={i * 40}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-salt rounded-xl p-5 no-underline text-deep hover:-translate-y-0.5 hover:shadow-md transition-all group"
                >
                  <h3 className="text-sm font-semibold mb-2 group-hover:text-teal transition-colors">
                    {r.name} <span className="opacity-40">↗</span>
                  </h3>
                  <p className="text-xs text-[#5a6a7a] leading-relaxed">{r.desc}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-salt py-16 px-6 text-center">
        <Reveal>
          <div className="max-w-[500px] mx-auto">
            <h2 className="font-serif text-2xl text-deep mb-4">
              Conditions look good?
            </h2>
            <p className="text-[#5a6a7a] text-sm mb-6 leading-relaxed">
              Join our Saturday sessions — morning yoga with Lena at 7am,
              group ocean dive at 8:30am. We check conditions every morning
              and pick the best spot for the day.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/contact/courses"
                className="inline-flex px-6 py-3 bg-coral text-white rounded-full font-semibold text-sm no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all"
              >
                Join the Saturday crew →
              </Link>
              <Link
                href="/contact/courses"
                className="inline-flex px-6 py-3 border border-deep/10 text-deep rounded-full font-semibold text-sm no-underline hover:bg-deep/5 transition-all"
              >
                View courses
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
