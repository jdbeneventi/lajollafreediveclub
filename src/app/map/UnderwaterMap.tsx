"use client";

import { useState } from "react";

interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: "dive-site" | "data-source" | "landmark" | "habitat";
  icon: string;
  depth?: string;
  description: string;
  details: string[];
  marineLife?: string[];
  tips?: string[];
  sourceUrl?: string;
}

const POINTS: MapPoint[] = [
  // ─── Dive Sites ───
  {
    id: "cove",
    name: "La Jolla Cove",
    lat: 32.8504,
    lng: -117.2729,
    category: "dive-site",
    icon: "\u{1F3CA}",
    depth: "10\u201360 ft",
    description: "The crown jewel. Protected marine reserve with kelp forests, sea lions, rocky reefs, and sea caves. Enter from the steps at the cove.",
    details: [
      "Part of the Matlahuayl State Marine Reserve (protected since 1929)",
      "Four distinct habitats: rocky reef, kelp bed, sand flats, submarine canyon",
      "Enter from steps at the cove \u2014 head 300 yards straight out to reach kelp forest",
      "Seagrass meadow in the shallows with nudibranchs, sea stars, juvenile fish",
      "Lifeguards don't allow flotation devices at the Cove \u2014 freedivers should enter from Boomer Beach",
    ],
    marineLife: ["Sea lions", "Harbor seals", "Garibaldi", "Leopard sharks", "Sevengill sharks", "Bat rays", "Moray eels", "Lobsters", "Horn sharks", "Nudibranchs", "Giant sea bass"],
    tips: ["Best on calm days with sub-3ft swell", "Watch for submerged rocks on the kick-out", "Morning typically offers best vis before afternoon wind picks up"],
  },
  {
    id: "boomers",
    name: "Boomers Kelp Forest",
    lat: 32.8498,
    lng: -117.2755,
    category: "dive-site",
    icon: "\u{1F333}",
    depth: "25\u201360 ft",
    description: "The healthiest kelp forest in the area. Giant kelp dominates this zone south of the marine reserve, with dense canopy and rich biodiversity.",
    details: [
      "Densest kelp areas are within 200 yards of shore in 25\u201360ft of water",
      "Enter from La Jolla Cove beach, head around the point west to Boomers",
      "Rocky channels are favorite habitat for harbor seals \u2014 they'll grab your fins",
      "The kelp canopy creates dramatic light and shadow for underwater photography",
      "Can be hazardous in large surf \u2014 check conditions before committing",
    ],
    marineLife: ["Harbor seals", "Lobster (in holdfasts)", "Warty sea cucumbers", "Sea fans", "Giant-spined sea stars", "Sheep crabs", "Tope sharks", "Sevengill sharks"],
    tips: ["Best freediving kelp forest in La Jolla", "Look into crevices for lobster and eels", "The kelp canopy can be thick \u2014 know your exit route"],
  },
  {
    id: "rock-pile",
    name: "The Rock Pile",
    lat: 32.8515,
    lng: -117.2695,
    category: "dive-site",
    icon: "\u{1FAA8}",
    depth: "30\u201360 ft",
    description: "Large boulder formation a few hundred yards offshore, teeming with life in every crevice. Lobster, eels, urchins, nudibranchs, abalone.",
    details: [
      "Enter water at the Cove, swim out ~50 yards, drop down and head NE",
      "Located at the west end of the La Jolla Ecological Reserve",
      "Even if you don't reach the pile, there's plenty to see along the way",
      "Boulders create a maze of crevices \u2014 every gap holds something",
      "One of the best sites for macro photography",
    ],
    marineLife: ["Lobster", "Moray eels", "Sea urchins", "Nudibranchs", "Sponges", "Abalone", "Octopus"],
  },
  {
    id: "sea-caves",
    name: "Seven Sea Caves",
    lat: 32.851,
    lng: -117.274,
    category: "dive-site",
    icon: "\u{1F573}\uFE0F",
    depth: "5\u201325 ft",
    description: "Seven caves carved into 75-million-year-old sandstone cliffs. Clam's Cave is the most popular \u2014 kayakers and freedivers share the space.",
    details: [
      "Naturally sculpted from Cretaceous-era sandstone over millions of years",
      "Clam's Cave \u2014 head straight out from the Cove, follow kayakers ~200 yards right",
      "Sunny Jim's Cave is the only one accessible from land (via The Cave Store tunnel)",
      "Swim-throughs connect some caves \u2014 sea lion pups love these grottos",
      "Only enter in calm conditions \u2014 surge makes caves extremely dangerous",
    ],
    marineLife: ["Sea lion pups", "Garibaldi", "Calico bass"],
    tips: ["Low tide exposes more cave structure", "ONLY enter on calm days", "Great starting or ending point before heading to Rock Pile"],
  },
  {
    id: "pinnacles",
    name: "Pinnacles (God's Rock, T-Rock, Quast Rock)",
    lat: 32.8485,
    lng: -117.278,
    category: "dive-site",
    icon: "\u26F0\uFE0F",
    depth: "30\u201390 ft",
    description: "Three main pinnacles along a ridge outside La Jolla Point. Tops rise to 30\u201340ft, bases reach 90ft. Nutrient-rich currents bring diverse fish life.",
    details: [
      "God's Rock, T-Rock, and Quast Rock sit along the same ridge, hundreds of yards apart",
      "Far outside La Jolla Point \u2014 receive more nutrient-rich currents than inner sites",
      "Advanced site \u2014 longer swim, deeper water, potential current",
      "Home to species not commonly found at nearshore sites",
    ],
    marineLife: ["Schooling fish", "Barracuda", "Yellowtail", "Sheephead", "Calico bass"],
  },
  {
    id: "canyon",
    name: "La Jolla Canyon",
    lat: 32.856,
    lng: -117.264,
    category: "dive-site",
    icon: "\u{1F30A}",
    depth: "35\u2013600+ ft",
    description: "Submarine canyon starting ~100 yards from La Jolla Shores beach, dropping from 35ft to over 600ft. Wall dives, night dives, and deep blue freediving.",
    details: [
      "Canyon edge begins at ~35ft, wall slopes steeply to 130ft+ (recreational limit)",
      "True bottom exceeds 600ft \u2014 the canyon continues to 900ft where it meets Scripps Canyon",
      "Sandy shallows between canyon and beach hold leopard sharks and baitballs",
      "The wall is silty with holes full of octopus and nudibranchs",
      "One of San Diego's best night dive sites \u2014 the canyon comes alive after dark",
      "Buoy markers indicate approximate canyon edge location",
      "World-class freediving \u2014 deep blue water minutes from the beach",
    ],
    marineLife: ["Octopus", "Nudibranchs", "Leopard sharks", "Bat rays", "Squid (winter night runs)", "Swell sharks", "Market squid", "Baitballs"],
    tips: ["Enter at La Jolla Shores beach \u2014 easy sandy entry", "Follow the buoys out to find the canyon edge", "Excellent buoyancy control required \u2014 the wall keeps going down"],
  },
  {
    id: "scripps-canyon",
    name: "Scripps Canyon",
    lat: 32.867,
    lng: -117.264,
    category: "dive-site",
    icon: "\u{1F30A}",
    depth: "70\u2013900+ ft",
    description: "Narrow gorge north of Scripps Pier with sheer vertical walls on both sides. Joins La Jolla Canyon at 900ft depth. Stair-stepping ledges with lobster.",
    details: [
      "Located just north of Scripps Pier",
      "Steep wall encounter at ~70ft with both canyon sides visible in good vis",
      "Stair-stepping ledges filled with spiny lobster",
      "One of few La Jolla sites where swell sharks are occasionally found",
      "Canyon heads very close to shore in just 40ft of water",
      "Merges with La Jolla Canyon at ~980ft depth, 1.3 miles from the head",
    ],
    marineLife: ["Spiny lobster", "Swell sharks", "Nudibranchs", "Wall-dwelling invertebrates"],
    tips: ["Advanced site \u2014 the depth sneaks up on you", "Vis varies \u2014 upwelling brings cold clear water but also strong currents"],
  },
  {
    id: "shores-entry",
    name: "La Jolla Shores Beach Entry",
    lat: 32.857,
    lng: -117.2575,
    category: "dive-site",
    icon: "\u{1F3D6}\uFE0F",
    depth: "0\u201335 ft",
    description: "The easiest ocean entry in La Jolla. Sandy bottom, gentle slope, perfect for training, AIDA courses, and beginner freediving experiences.",
    details: [
      "Sandy beach entry \u2014 no rocks, no surge, walk straight in",
      "Gentle slope to the canyon edge (~100 yards out)",
      "Southern end rich with wildlife: leopard sharks, stingrays, guitarfish",
      "Summer/fall: leopard shark aggregation in the shallows",
      "Home base for LJFC group dives and AIDA certification courses",
    ],
    marineLife: ["Leopard sharks (summer)", "Diamond stingrays", "Round stingrays", "Guitarfish", "Green sea turtles (rare)", "Halibut"],
    tips: ["Best entry point for beginners", "Shuffle your feet to avoid stingrays", "Walk past the Marine Room restaurant to the widest section of beach"],
  },

  // ─── Data Sources ───
  {
    id: "buoy-46254",
    name: "NDBC 46254 \u2014 Scripps Nearshore Buoy",
    lat: 32.868,
    lng: -117.267,
    category: "data-source",
    icon: "\u{1F6DF}",
    depth: "46m water depth",
    description: "Our primary data buoy. Sea surface temperature at 0.46m depth, wave height, dominant period, average period, and wave direction.",
    details: [
      "Scripps Institution of Oceanography Waverider Buoy",
      "Updates every 30 minutes via NDBC real-time text file",
      "Sea temp sensor at 0.46m below water line",
      "Also reports swell height, period, and direction",
      "Most accurate nearshore data for La Jolla dive conditions",
    ],
    sourceUrl: "https://www.ndbc.noaa.gov/station_page.php?station=46254",
  },
  {
    id: "pier-cam",
    name: "Scripps Pier Underwater Camera",
    lat: 32.8665,
    lng: -117.2555,
    category: "data-source",
    icon: "\u{1F4F7}",
    depth: "4m (13ft)",
    description: "HD live streaming underwater camera on a pier piling. AI-analyzed for visibility estimates using piling distances (4ft, 11ft, 14ft, 30ft) as markers.",
    details: [
      "Donated by DeepSea Power & Light, hosted by HDOnTap",
      "Camera mounted on pier piling at ~4m depth",
      "Reference pilings: 4ft (nearest), 11ft (right back), 14ft (left back), 30ft (far left, rarely visible)",
      "Our AI analyzes snapshots to estimate water visibility, color, and marine life presence",
      "Live stream available 24/7 at coollab.ucsd.edu/pierviz",
    ],
    sourceUrl: "https://coollab.ucsd.edu/pierviz/",
  },
  {
    id: "ljpc1",
    name: "NDBC LJPC1 \u2014 Scripps Pier Station",
    lat: 32.867,
    lng: -117.257,
    category: "data-source",
    icon: "\u{1F4E1}",
    description: "C-MAN station on Scripps Pier reporting wind speed, direction, gusts, atmospheric pressure, and wave data.",
    details: [
      "Anemometer at 20m above sea level",
      "Wind speed, direction, and gust data",
      "Also reports barometric pressure",
      "Data feeds into our wind scoring and overall dive grade",
    ],
    sourceUrl: "https://www.ndbc.noaa.gov/station_page.php?station=ljpc1",
  },
  {
    id: "tide-station",
    name: "NOAA Tide Station 9410230",
    lat: 32.867,
    lng: -117.2572,
    category: "data-source",
    icon: "\u{1F30A}",
    description: "Tide predictions, water level, and current tide state (incoming/outgoing) for La Jolla.",
    details: [
      "Hourly tide predictions from NOAA CO-OPS",
      "Incoming tide generally improves vis \u2014 best diving 1-2 hours into incoming",
      "Outgoing tide can reduce vis as sediment is pulled offshore",
    ],
    sourceUrl: "https://tidesandcurrents.noaa.gov/stationhome.html?id=9410230",
  },

  // ─── Landmarks ───
  {
    id: "childrens-pool",
    name: "Children's Pool / Seal Rock",
    lat: 32.8475,
    lng: -117.2785,
    category: "landmark",
    icon: "\u{1F9AD}",
    description: "Harbor seal colony behind the seawall. Good landmark \u2014 if you can see the wall clearly from the water, vis is decent.",
    details: [
      "Protected pupping beach for harbor seals",
      "The seawall creates a sheltered area that seals have claimed",
      "Visible from the water as a navigation reference point",
    ],
  },
  {
    id: "goldfish-point",
    name: "Goldfish Point",
    lat: 32.8501,
    lng: -117.2702,
    category: "landmark",
    icon: "\u{1F426}",
    description: "Lookout point between the Cove and Shores. Great for checking surface conditions before committing to a dive. Huge heron and pelican colony.",
    details: [
      "Clifftop vantage point to assess surface conditions",
      "Large population of herons, pelicans, and gulls nesting in cliff holes",
      "Smuggler's Sea Cave accessible below the roosting area",
    ],
  },

  // ─── Habitats ───
  {
    id: "kelp-forest",
    name: "Giant Kelp Forest",
    lat: 32.8505,
    lng: -117.274,
    category: "habitat",
    icon: "\u{1F33F}",
    depth: "20\u201360 ft",
    description: "One of the largest and healthiest kelp forests in Southern California. Giant kelp grows up to 2ft per day, forming cathedral-like canopies.",
    details: [
      "Giant kelp (Macrocystis pyrifera) \u2014 the world's largest, fastest-growing marine algae",
      "Canopy filters sunlight creating dramatic underwater light",
      "Supports 800+ species from tiny nudibranchs to sevengill sharks",
      "Kelp health varies seasonally \u2014 strongest in spring/summer",
      "The La Jolla kelp bed is among the largest remaining in Southern California",
      "El Ni\u00f1o events and ocean warming have caused significant kelp decline statewide",
    ],
    marineLife: ["Garibaldi (CA state fish)", "Kelp bass", "Sheephead", "Sea lions", "Leopard sharks", "Nudibranchs", "Lobster", "Sea urchins", "Bat rays"],
  },
  {
    id: "seagrass",
    name: "Seagrass Meadow",
    lat: 32.8508,
    lng: -117.272,
    category: "habitat",
    icon: "\u{1F33E}",
    depth: "5\u201320 ft",
    description: "Shallow beds of surfgrass and eelgrass in the inner cove. Nursery habitat for juvenile fish, invertebrates, and nudibranchs.",
    details: [
      "Surfgrass clings to rock; eelgrass grows in sand/mud",
      "Critical nursery habitat \u2014 juvenile fish shelter here until large enough for reefs",
      "Beautiful billowing motion in the surge",
      "Look carefully for tiny, camouflaged creatures",
    ],
    marineLife: ["Juvenile fish", "Nudibranchs", "Sea stars", "Pipefish", "Decorator crabs"],
  },
  {
    id: "sand-flats",
    name: "Sand Flats",
    lat: 32.858,
    lng: -117.261,
    category: "habitat",
    icon: "\u{1F3DD}\uFE0F",
    depth: "10\u201335 ft",
    description: "Sandy bottom between La Jolla Shores and the canyon edge. Don't overlook it \u2014 this is where leopard sharks, rays, and halibut hunt.",
    details: [
      "Seemingly barren but full of buried and camouflaged life",
      "Summer leopard shark aggregation is one of La Jolla's most famous encounters",
      "Round stingrays common \u2014 shuffle your feet",
      "Baitballs form here attracting larger predators",
      "Night diving reveals a completely different ecosystem \u2014 squid runs in winter",
    ],
    marineLife: ["Leopard sharks", "Bat rays", "Round stingrays", "Diamond stingrays", "Guitarfish", "Halibut", "Market squid (winter nights)"],
  },
];

const CATEGORIES = {
  "dive-site": { label: "Dive sites", color: "#1B6B6B" },
  "data-source": { label: "Data sources", color: "#C75B3A" },
  "landmark": { label: "Landmarks", color: "#D4A574" },
  "habitat": { label: "Habitats", color: "#163B4E" },
};

export function UnderwaterMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const point = POINTS.find((p) => p.id === selected);
  const filtered = filter ? POINTS.filter((p) => p.category === filter) : POINTS;

  return (
    <div className="space-y-6">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !filter ? "bg-deep text-white" : "bg-white text-[#5a6a7a] hover:bg-deep/5"
          }`}
        >
          All ({POINTS.length})
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setFilter(filter === key ? null : key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === key ? "text-white" : "bg-white text-[#5a6a7a] hover:bg-deep/5"
            }`}
            style={filter === key ? { background: cat.color } : {}}
          >
            {cat.label} ({POINTS.filter((p) => p.category === key).length})
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr,380px] gap-6">
        {/* Point list */}
        <div className="space-y-2 order-2 md:order-1">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(selected === p.id ? null : p.id)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                selected === p.id ? "bg-deep text-white" : "bg-white hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${selected === p.id ? "text-white" : "text-deep"}`}>{p.name}</span>
                    {p.depth && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${selected === p.id ? "bg-white/20 text-white/80" : "bg-deep/5 text-[#5a6a7a]"}`}>
                        {p.depth}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 line-clamp-1 ${selected === p.id ? "text-white/70" : "text-[#5a6a7a]"}`}>
                    {p.description}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CATEGORIES[p.category]?.color || "#999" }} />
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="order-1 md:order-2 md:sticky md:top-24 md:self-start">
          {point ? (
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="p-6 border-b border-deep/[0.06]" style={{ borderLeft: `4px solid ${CATEGORIES[point.category]?.color || "#999"}` }}>
                <div className="text-2xl mb-2">{point.icon}</div>
                <h3 className="font-serif text-xl text-deep">{point.name}</h3>
                {point.depth && <div className="text-xs text-[#5a6a7a] mt-1">{point.depth}</div>}
                <p className="text-sm text-[#5a6a7a] mt-3 leading-relaxed">{point.description}</p>
              </div>

              {/* Details */}
              <div className="p-6 border-b border-deep/[0.06]">
                <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-2">Details</div>
                <ul className="space-y-2">
                  {point.details.map((d, i) => (
                    <li key={i} className="text-xs text-[#5a6a7a] leading-relaxed flex gap-2">
                      <span className="text-teal shrink-0 mt-0.5">&bull;</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Marine life */}
              {point.marineLife && (
                <div className="p-6 border-b border-deep/[0.06]">
                  <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-2">Marine life</div>
                  <div className="flex flex-wrap gap-1.5">
                    {point.marineLife.map((m) => (
                      <span key={m} className="px-2 py-1 bg-deep/5 rounded-full text-[10px] text-deep">{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {point.tips && (
                <div className="p-6 border-b border-deep/[0.06]">
                  <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-2">Tips</div>
                  <ul className="space-y-1.5">
                    {point.tips.map((t, i) => (
                      <li key={i} className="text-xs text-[#5a6a7a] leading-relaxed flex gap-2">
                        <span className="text-coral shrink-0">*</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Source link */}
              {point.sourceUrl && (
                <div className="p-4">
                  <a href={point.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-teal/60 hover:text-teal no-underline">
                    View live data source ↗
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="text-3xl mb-3">🤿</div>
              <p className="text-sm text-[#5a6a7a]">Select a site to explore its underwater world</p>
            </div>
          )}
        </div>
      </div>

      {/* Depth profile */}
      <div className="bg-white rounded-2xl p-8">
        <h3 className="font-serif text-lg mb-2">Depth profile: La Jolla Shores to Canyon</h3>
        <p className="text-xs text-[#5a6a7a] mb-6">Cross-section from the beach entry at La Jolla Shores to the La Jolla submarine canyon</p>
        <div className="relative h-48 bg-gradient-to-b from-[#87CEEB20] via-[#1B6B6B20] to-[#0B1D2C40] rounded-xl overflow-hidden">
          {/* Depth markers */}
          {[
            { depth: "0 ft", label: "Beach", pct: 0, left: "2%" },
            { depth: "15 ft", label: "Sand flats / Leopard sharks", pct: 15, left: "15%" },
            { depth: "35 ft", label: "Canyon edge / Buoy markers", pct: 25, left: "35%" },
            { depth: "70 ft", label: "Scripps Canyon wall begins", pct: 45, left: "55%" },
            { depth: "130 ft", label: "Recreational limit", pct: 65, left: "70%" },
            { depth: "600+ ft", label: "Canyon floor", pct: 90, left: "88%" },
          ].map((d) => (
            <div
              key={d.depth}
              className="absolute flex items-center gap-2"
              style={{ top: `${d.pct}%`, left: d.left }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-deep/40" />
              <div>
                <span className="text-[10px] font-semibold text-deep/70">{d.depth}</span>
                <span className="text-[9px] text-[#5a6a7a] ml-2">{d.label}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#5a6a7a] mt-3">
          La Jolla Canyon starts ~100 yards from the beach and drops to over 600ft. It merges with Scripps Canyon at ~900ft depth.
          The combined canyon system continues seaward as a rock-walled gorge to ~1,600ft before opening into the San Diego Trough.
          Source: USGS multibeam bathymetry, Scripps Institution of Oceanography.
        </p>
      </div>

      {/* Seasonal guide */}
      <div className="bg-white rounded-2xl p-8">
        <h3 className="font-serif text-lg mb-2">Seasonal wildlife calendar</h3>
        <p className="text-xs text-[#5a6a7a] mb-6">What to expect in the water throughout the year</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { season: "Winter", months: "Dec\u2013Feb", temp: "56\u201360\u00B0F", animals: "Squid runs (night), gray whale migration, lobster season", vis: "Variable, 8\u201320ft", note: "Best night diving of the year" },
            { season: "Spring", months: "Mar\u2013May", temp: "59\u201364\u00B0F", animals: "Harbor seal pupping, garibaldi nesting, nutrient upwelling", vis: "Improving, 10\u201325ft", note: "Upwelling events bring cold, clear water" },
            { season: "Summer", months: "Jun\u2013Aug", temp: "64\u201370\u00B0F", animals: "Leopard shark aggregation (Shores), bat rays, sea turtles", vis: "Best season, 15\u201340ft", note: "Warmest water, best vis, longest days" },
            { season: "Fall", months: "Sep\u2013Nov", temp: "67\u201372\u00B0F", animals: "Sevengill sharks, giant sea bass, baitballs, blue water", vis: "Peak vis, 20\u201340ft+", note: "Often the absolute best diving of the year" },
          ].map((s) => (
            <div key={s.season} className="p-4 rounded-xl bg-salt/50">
              <div className="font-serif text-base text-deep">{s.season}</div>
              <div className="text-[10px] text-[#5a6a7a] mb-3">{s.months} &bull; {s.temp}</div>
              <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-1">Wildlife</div>
              <p className="text-xs text-[#5a6a7a] mb-3">{s.animals}</p>
              <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-1">Visibility</div>
              <p className="text-xs text-[#5a6a7a] mb-3">{s.vis}</p>
              <p className="text-[10px] text-teal italic">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
