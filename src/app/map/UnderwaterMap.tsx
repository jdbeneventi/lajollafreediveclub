"use client";

import { useState } from "react";

interface MapPoint {
  id: string;
  name: string;
  category: "dive-site" | "data-source" | "landmark" | "habitat";
  icon: string;
  depth?: string;
  gradient: string;
  description: string;
  details: string[];
  marineLife?: string[];
  tips?: string[];
  sourceUrl?: string;
}

const POINTS: MapPoint[] = [
  {
    id: "cove", name: "La Jolla Cove", category: "dive-site", icon: "\u{1F3CA}", depth: "10\u201360 ft",
    gradient: "from-[#0B1D2C] to-[#1B6B6B]",
    description: "The crown jewel. Protected marine reserve with kelp forests, sea lions, rocky reefs, and sea caves. Enter from the steps at the cove.",
    details: ["Part of the Matlahuayl State Marine Reserve (protected since 1929)", "Four habitats: rocky reef, kelp bed, sand flats, submarine canyon", "Enter from steps \u2014 head 300 yards straight out to reach kelp forest", "Seagrass meadow in the shallows with nudibranchs, sea stars, juvenile fish", "Freedivers enter from Boomer Beach (no flotation devices allowed at the Cove)"],
    marineLife: ["Sea lions", "Harbor seals", "Garibaldi", "Leopard sharks", "Sevengill sharks", "Bat rays", "Moray eels", "Lobsters", "Horn sharks", "Nudibranchs", "Giant sea bass"],
    tips: ["Best on calm days with sub-3ft swell", "Watch for submerged rocks on the kick-out", "Morning offers best vis before afternoon wind"],
  },
  {
    id: "boomers", name: "Boomers Kelp Forest", category: "dive-site", icon: "\u{1F333}", depth: "25\u201360 ft",
    gradient: "from-[#163B4E] to-[#1B6B6B]",
    description: "The healthiest kelp forest in the area. Giant kelp forms cathedral-like canopies with dramatic light filtering through.",
    details: ["Densest kelp within 200 yards of shore in 25\u201360ft of water", "Enter from La Jolla Cove, head around the point west to Boomers", "Harbor seals frequent the rocky channels \u2014 they'll grab your fins", "The kelp canopy creates stunning underwater photography conditions", "Hazardous in large surf \u2014 check conditions first"],
    marineLife: ["Harbor seals", "Lobster", "Sea cucumbers", "Sea fans", "Giant-spined sea stars", "Sheep crabs", "Tope sharks", "Sevengill sharks"],
    tips: ["Best freediving kelp in La Jolla", "Look into crevices for lobster and eels", "Know your exit \u2014 kelp canopy can be thick"],
  },
  {
    id: "rock-pile", name: "The Rock Pile", category: "dive-site", icon: "\u{1FAA8}", depth: "30\u201360 ft",
    gradient: "from-[#163B4E] to-[#3A4A56]",
    description: "Large boulder formation a few hundred yards offshore. Every crevice holds something \u2014 lobster, eels, urchins, nudibranchs, abalone.",
    details: ["Enter at the Cove, swim ~50 yards out, drop down and head NE", "West end of the La Jolla Ecological Reserve", "Even if you don't reach the pile, plenty to see along the way", "Boulders create a maze of crevices \u2014 macro photography heaven"],
    marineLife: ["Lobster", "Moray eels", "Sea urchins", "Nudibranchs", "Sponges", "Abalone", "Octopus"],
  },
  {
    id: "sea-caves", name: "Seven Sea Caves", category: "dive-site", icon: "\u{1F573}\uFE0F", depth: "5\u201325 ft",
    gradient: "from-[#3A4A56] to-[#0B1D2C]",
    description: "Seven caves carved into 75-million-year-old sandstone. Clam's Cave is the most popular. Sea lion pups swim the grottos.",
    details: ["Sculpted from Cretaceous sandstone over millions of years", "Clam's Cave \u2014 head straight out from Cove, follow kayakers ~200 yards right", "Sunny Jim's Cave accessible from land via The Cave Store tunnel", "Swim-throughs connect some caves \u2014 sea lion pups love these", "ONLY enter in calm conditions \u2014 surge makes caves dangerous"],
    marineLife: ["Sea lion pups", "Garibaldi", "Calico bass"],
    tips: ["Low tide exposes more cave structure", "Only calm days", "Great starting point before heading to Rock Pile"],
  },
  {
    id: "pinnacles", name: "The Pinnacles", category: "dive-site", icon: "\u26F0\uFE0F", depth: "30\u201390 ft",
    gradient: "from-[#0B1D2C] to-[#163B4E]",
    description: "God's Rock, T-Rock, and Quast Rock \u2014 three pinnacles along a ridge outside La Jolla Point. Nutrient-rich currents bring the big life.",
    details: ["Three pinnacles along the same ridge, hundreds of yards apart", "Tops rise to 30\u201340ft, bases reach 90ft", "Receive more nutrient-rich currents than inner sites", "Advanced site \u2014 longer swim, deeper water, potential current"],
    marineLife: ["Schooling fish", "Barracuda", "Yellowtail", "Sheephead", "Calico bass"],
  },
  {
    id: "canyon", name: "La Jolla Canyon", category: "dive-site", icon: "\u{1F30A}", depth: "35\u2013600+ ft",
    gradient: "from-[#0B1D2C] to-[#000]",
    description: "Submarine canyon starting ~100 yards from the beach, dropping from 35ft to over 600ft. World-class freediving \u2014 deep blue water minutes from sand.",
    details: ["Canyon edge at ~35ft, wall slopes steeply to 130ft+ (recreational limit)", "True bottom exceeds 600ft \u2014 merges with Scripps Canyon at 900ft", "Sandy shallows between canyon and beach hold leopard sharks and baitballs", "Silty wall with holes full of octopus and nudibranchs", "One of San Diego's best night dive sites \u2014 winter squid runs", "Buoy markers indicate approximate canyon edge"],
    marineLife: ["Octopus", "Nudibranchs", "Leopard sharks", "Bat rays", "Market squid (winter)", "Swell sharks", "Baitballs"],
    tips: ["Enter at La Jolla Shores \u2014 easy sandy entry", "Follow the buoys to find the canyon edge", "Excellent buoyancy control required \u2014 the wall keeps going"],
  },
  {
    id: "scripps-canyon", name: "Scripps Canyon", category: "dive-site", icon: "\u{1F30A}", depth: "70\u2013900+ ft",
    gradient: "from-[#0B1D2C] to-[#000]",
    description: "Narrow gorge north of Scripps Pier. Sheer vertical walls, stair-stepping ledges packed with lobster. Joins La Jolla Canyon at 900ft.",
    details: ["Just north of Scripps Pier", "Steep wall at ~70ft \u2014 both sides visible in good vis", "Canyon heads close to shore in just 40ft of water", "Merges with La Jolla Canyon at ~980ft depth, 1.3 miles from head"],
    marineLife: ["Spiny lobster", "Swell sharks", "Nudibranchs", "Wall invertebrates"],
    tips: ["Advanced site \u2014 depth sneaks up fast", "Cold upwelling water = better vis but stronger currents"],
  },
  {
    id: "shores", name: "La Jolla Shores", category: "dive-site", icon: "\u{1F3D6}\uFE0F", depth: "0\u201335 ft",
    gradient: "from-[#87CEEB] to-[#1B6B6B]",
    description: "Easiest entry in La Jolla. Sandy bottom, gentle slope, perfect for training, AIDA courses, and beginner freediving.",
    details: ["Sandy beach entry \u2014 no rocks, no surge, walk straight in", "Gentle slope to the canyon edge (~100 yards)", "Southern end rich with wildlife in summer/fall", "Home base for LJFC group dives and AIDA courses"],
    marineLife: ["Leopard sharks (summer)", "Diamond stingrays", "Round stingrays", "Guitarfish", "Green sea turtles (rare)", "Halibut"],
    tips: ["Shuffle your feet to avoid stingrays", "Walk past the Marine Room to the widest beach section", "Best beginner entry point in San Diego"],
  },
  {
    id: "buoy", name: "Scripps Nearshore Buoy (46254)", category: "data-source", icon: "\u{1F6DF}", depth: "46m water depth",
    gradient: "from-[#C75B3A] to-[#D4A574]",
    description: "Our primary data source. Sea surface temperature, wave height, period, and direction. Updates every 30 minutes.",
    details: ["Scripps Institution of Oceanography Waverider Buoy", "Sea temp at 0.46m below water line", "Reports swell height, period, direction, and sea surface temp", "Most accurate nearshore data for La Jolla conditions"],
    sourceUrl: "https://www.ndbc.noaa.gov/station_page.php?station=46254",
  },
  {
    id: "cam", name: "Scripps Pier Underwater Camera", category: "data-source", icon: "\u{1F4F7}", depth: "4m (13ft)",
    gradient: "from-[#C75B3A] to-[#D4A574]",
    description: "HD live camera on a pier piling. Our AI analyzes frames to estimate visibility using piling distances as references.",
    details: ["Camera at ~4m depth on pier piling", "Reference pilings: 4ft, 11ft, 14ft, 30ft from camera", "AI analyzes snapshots for vis, water color, marine life", "Live 24/7 at coollab.ucsd.edu/pierviz"],
    sourceUrl: "https://coollab.ucsd.edu/pierviz/",
  },
  {
    id: "kelp", name: "Giant Kelp Forest", category: "habitat", icon: "\u{1F33F}", depth: "20\u201360 ft",
    gradient: "from-[#163B4E] to-[#1B6B6B]",
    description: "One of the largest remaining kelp forests in Southern California. Giant kelp grows 2ft per day, forming cathedral-like canopies filtering sunlight.",
    details: ["Macrocystis pyrifera \u2014 world's largest, fastest-growing marine algae", "Supports 800+ species", "La Jolla bed is among the largest and healthiest remaining in SoCal", "Kelp health varies seasonally \u2014 strongest spring/summer"],
    marineLife: ["Garibaldi", "Kelp bass", "Sheephead", "Sea lions", "Leopard sharks", "Nudibranchs", "Lobster", "Sea urchins", "Bat rays"],
  },
  {
    id: "sand", name: "Sand Flats & Leopard Shark Zone", category: "habitat", icon: "\u{1F3DD}\uFE0F", depth: "10\u201335 ft",
    gradient: "from-[#D4A574] to-[#163B4E]",
    description: "Don't overlook the sand. Summer brings the famous leopard shark aggregation. Winter nights bring squid runs. Baitballs year-round.",
    details: ["Seemingly barren but full of buried and camouflaged life", "Summer leopard shark aggregation \u2014 one of La Jolla's most famous encounters", "Night diving reveals a completely different ecosystem", "Winter squid runs attract predators from the deep"],
    marineLife: ["Leopard sharks", "Bat rays", "Round stingrays", "Diamond stingrays", "Guitarfish", "Halibut", "Market squid (winter)"],
  },
];

const CATEGORIES = {
  "dive-site": { label: "Dive sites", color: "#1B6B6B" },
  "habitat": { label: "Habitats", color: "#163B4E" },
  "data-source": { label: "Data sources", color: "#C75B3A" },
  "landmark": { label: "Landmarks", color: "#D4A574" },
};

export function UnderwaterMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter ? POINTS.filter((p) => p.category === filter) : POINTS;

  return (
    <div className="space-y-8">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter(null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!filter ? "bg-deep text-white" : "bg-white text-[#5a6a7a] hover:bg-deep/5"}`}>
          All ({POINTS.length})
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button key={key} onClick={() => setFilter(filter === key ? null : key)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === key ? "text-white" : "bg-white text-[#5a6a7a] hover:bg-deep/5"}`} style={filter === key ? { background: cat.color } : {}}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((point) => (
          <div key={point.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelected(selected === point.id ? null : point.id)}>
            {/* Photo placeholder with gradient */}
            <div className={`h-36 bg-gradient-to-br ${point.gradient} relative flex items-end p-5`}>
              <div className="absolute top-4 left-4 text-2xl">{point.icon}</div>
              {point.depth && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] text-white font-medium">
                  {point.depth}
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
              <h3 className="font-serif text-lg text-white relative z-10">{point.name}</h3>
            </div>

            {/* Description */}
            <div className="p-5">
              <p className="text-xs text-[#5a6a7a] leading-relaxed mb-3">{point.description}</p>

              {/* Marine life tags */}
              {point.marineLife && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {point.marineLife.slice(0, 6).map((m) => (
                    <span key={m} className="px-2 py-0.5 bg-deep/5 rounded-full text-[10px] text-deep">{m}</span>
                  ))}
                  {point.marineLife.length > 6 && (
                    <span className="px-2 py-0.5 bg-deep/5 rounded-full text-[10px] text-[#5a6a7a]">+{point.marineLife.length - 6} more</span>
                  )}
                </div>
              )}

              {/* Source link for data sources */}
              {point.sourceUrl && (
                <a href={point.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-teal/60 hover:text-teal no-underline" onClick={(e) => e.stopPropagation()}>
                  View live data ↗
                </a>
              )}
            </div>

            {/* Expanded details */}
            {selected === point.id && (
              <div className="border-t border-deep/[0.06]">
                <div className="p-5 space-y-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-2">Details</div>
                    <ul className="space-y-1.5">
                      {point.details.map((d, i) => (
                        <li key={i} className="text-xs text-[#5a6a7a] leading-relaxed flex gap-2">
                          <span className="text-teal shrink-0 mt-0.5">&bull;</span>{d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {point.marineLife && point.marineLife.length > 6 && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-2">All marine life</div>
                      <div className="flex flex-wrap gap-1.5">
                        {point.marineLife.map((m) => (
                          <span key={m} className="px-2 py-0.5 bg-deep/5 rounded-full text-[10px] text-deep">{m}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {point.tips && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-2">Tips</div>
                      <ul className="space-y-1.5">
                        {point.tips.map((t, i) => (
                          <li key={i} className="text-xs text-[#5a6a7a] leading-relaxed flex gap-2">
                            <span className="text-coral shrink-0">*</span>{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Depth profile */}
      <div className="bg-white rounded-2xl p-8">
        <h3 className="font-serif text-lg mb-2">Depth profile: Shore to Canyon</h3>
        <p className="text-xs text-[#5a6a7a] mb-6">Cross-section from La Jolla Shores beach to the submarine canyon</p>
        <div className="relative h-56 rounded-xl overflow-hidden" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #1B6B6B 30%, #163B4E 50%, #0B1D2C 75%, #000 100%)" }}>
          {[
            { depth: "0 ft", label: "Beach entry", pct: 2, left: 3 },
            { depth: "10\u201315 ft", label: "Sand flats \u2014 leopard sharks, rays", pct: 12, left: 12 },
            { depth: "20\u201330 ft", label: "Seagrass meadow \u2014 juvenile fish, nudibranchs", pct: 20, left: 8 },
            { depth: "35 ft", label: "Canyon edge \u2014 buoy markers", pct: 30, left: 35 },
            { depth: "50\u201370 ft", label: "Kelp forest canopy \u2014 sea lions, garibaldi", pct: 42, left: 25 },
            { depth: "70 ft", label: "Scripps Canyon wall begins", pct: 52, left: 55 },
            { depth: "90 ft", label: "Pinnacle tops \u2014 schooling fish", pct: 62, left: 65 },
            { depth: "130 ft", label: "Recreational scuba limit", pct: 72, left: 72 },
            { depth: "300+ ft", label: "Freediving deep blue zone", pct: 82, left: 60 },
            { depth: "600\u2013900 ft", label: "Canyon floor \u2014 La Jolla meets Scripps", pct: 95, left: 78 },
          ].map((d) => (
            <div key={d.depth} className="absolute flex items-center gap-2" style={{ top: `${d.pct}%`, left: `${d.left}%` }}>
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
              <div className="whitespace-nowrap">
                <span className="text-[10px] font-bold text-white/90">{d.depth}</span>
                <span className="text-[9px] text-white/50 ml-2">{d.label}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#5a6a7a] mt-3">La Jolla Canyon starts ~100 yards from the beach and drops to 600+ ft. It merges with Scripps Canyon at ~900ft, continuing as a rock-walled gorge to 1,600ft before opening into the San Diego Trough. Source: USGS multibeam bathymetry.</p>
      </div>

      {/* Seasonal guide */}
      <div className="bg-white rounded-2xl p-8">
        <h3 className="font-serif text-lg mb-2">When to dive</h3>
        <p className="text-xs text-[#5a6a7a] mb-6">Seasonal guide to what you&apos;ll find in the water</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { season: "Winter", months: "Dec\u2013Feb", temp: "56\u201360\u00B0F", highlight: "Squid runs", animals: "Market squid (night), gray whale migration, lobster season peak", vis: "Variable \u2014 8\u201320ft", note: "Best night diving of the year. Dress warm: 7mm or drysuit territory." },
            { season: "Spring", months: "Mar\u2013May", temp: "59\u201364\u00B0F", highlight: "Upwelling season", animals: "Harbor seal pupping, garibaldi nesting, nutrient upwelling events", vis: "Improving \u2014 10\u201325ft", note: "Cold upwelling events bring dramatically clear water from the Canyon. Watch for sudden temp drops." },
            { season: "Summer", months: "Jun\u2013Aug", temp: "64\u201370\u00B0F", highlight: "Leopard sharks", animals: "Leopard shark aggregation (Shores), bat rays, sea turtles, baitballs", vis: "Best season \u2014 15\u201340ft", note: "Warmest water, best vis, longest days. The Shores leopard shark gathering is world-famous." },
            { season: "Fall", months: "Sep\u2013Nov", temp: "67\u201372\u00B0F", highlight: "Peak conditions", animals: "Sevengill sharks, giant sea bass, massive baitballs, blue water days", vis: "Peak \u2014 20\u201340ft+", note: "Often the absolute best diving of the year. Warm water, clear vis, big animal encounters." },
          ].map((s) => (
            <div key={s.season} className="rounded-xl overflow-hidden bg-salt/50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif text-base text-deep">{s.season}</span>
                </div>
                <div className="text-[10px] text-[#5a6a7a] mb-1">{s.months}</div>
                <div className="text-[10px] text-[#5a6a7a] mb-3">{s.temp}</div>
                <div className="px-2 py-1 bg-teal/10 rounded-full text-[10px] text-teal font-medium inline-block mb-3">{s.highlight}</div>
                <p className="text-xs text-[#5a6a7a] leading-relaxed mb-2">{s.animals}</p>
                <div className="text-[10px] text-[#5a6a7a] font-medium mb-1">Visibility: {s.vis}</div>
                <p className="text-[10px] text-teal/80 italic leading-relaxed">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo CTA */}
      <div className="bg-deep rounded-2xl p-8 text-center">
        <div className="text-seafoam text-xs font-semibold uppercase tracking-wider mb-2">Got underwater photos?</div>
        <h3 className="font-serif text-xl text-white mb-2">Help us build this guide</h3>
        <p className="text-white/50 text-sm leading-relaxed max-w-md mx-auto mb-4">
          We&apos;re collecting underwater photos from La Jolla divers to make this guide come alive. Share your shots of the kelp forest, canyon, marine life, or dive sites.
        </p>
        <a href="/contact" className="inline-block px-6 py-3 bg-coral text-white rounded-full font-medium text-sm no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all">
          Share your photos →
        </a>
      </div>
    </div>
  );
}
