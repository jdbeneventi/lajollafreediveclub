"use client";

import { useState } from "react";

// ─── Data ───

const SWIM_OUT_ZONES = [
  {
    depth: "0–10 ft", name: "The Stingray Flats", gradient: "from-[#87CEEB] to-[#5BA3C9]",
    description: "Gentle sandy slope right off the beach. Shuffle your feet — round stingrays hide in the sand.",
    species: ["Round stingrays", "Leopard sharks (summer, knee-deep!)", "Sand crabs"],
    tip: "The 'stingray shuffle' is real. Drag your feet and they'll move out of the way.",
  },
  {
    depth: "6–15 ft", name: "The Moonscape", gradient: "from-[#5BA3C9] to-[#3A8BB0]",
    description: "Looks barren from above but the sandy bottom is full of life. Sea pens, sea pansies, and anemones dot the sand. Pipefish hover vertically — often mistaken for seahorses.",
    species: ["Sea pens", "Sea pansies", "Pipefish", "Anemones", "Sea stars", "Small crabs"],
    tip: "Look closely at the 'empty' sand. The moonscape rewards patient eyes.",
  },
  {
    depth: "~20–25 ft", name: "The Sand Dollar Field", gradient: "from-[#3A8BB0] to-[#2A7A9E]",
    description: "Millions of live sand dollars carpeting a quarter-mile of ocean floor. Deep purple, standing on end, all facing the same direction — perpendicular to the current. One of La Jolla's hidden wonders.",
    species: ["Sand dollars (Dendraster excentricus)", "Pipe cleaner worms", "Angel sharks", "Swimming crabs"],
    tip: "They're alive — purple with moving spines. Do not touch or remove. Protected by law with significant fines.",
  },
  {
    depth: "20–35 ft", name: "The Shallows", gradient: "from-[#2A7A9E] to-[#1B6B6B]",
    description: "Where most scuba classes are taught, and for good reason — plenty of light and surprising diversity. Horn sharks tuck under ledges by day. Halibut lie half-buried in sand. Angel sharks rest perfectly camouflaged.",
    species: ["Horn sharks", "Angel sharks", "Halibut", "Bat rays", "Guitarfish (shovelnose & banded)", "Sheep crabs", "Pipefish"],
    tip: "Night diving here almost guarantees horn shark sightings. They cruise openly after dark.",
  },
  {
    depth: "35–45 ft", name: "The Canyon Rim", gradient: "from-[#1B6B6B] to-[#163B4E]",
    description: "The water darkens and cools. The canyon edge approaches — buoy markers indicate the approximate location. A muddy 3-4ft wall near the rim is home to bizarre blennies, octopi, and nudibranchs.",
    species: ["Sarcastic fringeheads", "Two-spot octopi", "Sheep crabs", "Nudibranchs (multiple species)", "Blennies", "Gobies"],
    tip: "Watch your kicks — one misplaced fin stroke stirs up the sand and kills visibility. The canyon rim is 250 yards from the Vallecitos St entry.",
  },
  {
    depth: "45–75 ft", name: "The Canyon Walls", gradient: "from-[#163B4E] to-[#0B1D2C]",
    description: "Where the real diving begins. Named wall sites (Vallecitos Point, North Wall, South Wall) offer stair-stepping ledges packed with lobster, nudibranchs, and octopus. Giant sea bass patrol in summer.",
    species: ["Spiny lobster", "Spanish shawl nudibranchs", "Red octopus", "Giant sea bass", "Moray eels", "Painted greenlings", "Rockfish", "Sheephead"],
    tip: "Most interesting features are between 45-75 ft. The walls keep going — maintain excellent depth awareness.",
  },
  {
    depth: "75–130 ft", name: "The Deep Walls", gradient: "from-[#0B1D2C] to-[#050E15]",
    description: "Red gorgonian sea fans on the ledges. Lobster stacked in crevices. The Amphitheatre — a sheer semicircle wall — is one of the most dramatic formations. For advanced/technical divers and deep freedivers only.",
    species: ["Red gorgonian sea fans", "Yellow & white gorgonians", "Lobster (dense populations)", "Crab", "Octopus", "Swell sharks"],
    tip: "South Wall is dangerously steep with sharp 4-ft ledge drops. Geological striations visible in the sandstone — grey and white horizontal stripes.",
  },
  {
    depth: "130–600+ ft", name: "The Abyss", gradient: "from-[#050E15] to-[#000]",
    description: "Beyond recreational limits. La Jolla Canyon drops to 600+ ft before merging with Scripps Canyon at 900 ft. The combined canyon continues to 1,600 ft before opening into the San Diego Trough. World-class deep freediving territory.",
    species: ["Deep-water species", "Detrital mat communities (density unmatched globally)"],
    tip: "You could set a world record in any freediving discipline from La Jolla Shores — the depth is right there.",
  },
];

const NAMED_SITES = [
  {
    name: "Vallecitos Point / Main Wall", depth: "45–75 ft", difficulty: "Intermediate",
    gradient: "from-[#163B4E] to-[#1B6B6B]",
    description: "The most-dived site at La Jolla Shores. Sloping wall runs north-south with the point running east-west. Every crevice holds life.",
    details: [
      "Enter from Vallecitos St, swim west ~250 yards, drop at 40-45 ft",
      "Lobster in crevices, Spanish shawl nudibranchs (vivid purple/orange)",
      "Sheep crabs and large halibut on top of the point",
      "Giant sea bass sightings in summer/fall",
      "When kelp grows on top: bizarre Melibe leonina nudibranchs on the leaves",
      "Sarcastic fringeheads in the holes — comical oval-mouthed blennies",
    ],
    species: ["Lobster", "Spanish shawl nudibranchs", "Giant sea bass", "Halibut", "Sheep crabs", "Painted greenlings", "Rockfish", "Melibe nudibranchs"],
  },
  {
    name: "North Wall", depth: "50–75 ft", difficulty: "Advanced",
    gradient: "from-[#163B4E] to-[#0B1D2C]",
    description: "Curves off the Main Wall toward the west. Longer swim but less traffic and arguably better diving. Large sand flat at 50 ft on top.",
    details: [
      "Curves west off the Main Wall — requires good air management",
      "Topped by a large sand plateau at 50 ft depth",
      "Tube anemones and gorgonians on the wall face",
      "Known resident moray eel",
      "Shovelnose guitarfish commonly seen on the sandy plateau",
      "Less dived = less disturbed = better encounters",
    ],
    species: ["Moray eels", "Shovelnose guitarfish", "Tube anemones", "Gorgonians", "Lobster", "Nudibranchs"],
  },
  {
    name: "South Wall", depth: "60–110+ ft", difficulty: "Advanced/Technical",
    gradient: "from-[#0B1D2C] to-[#000]",
    description: "Dangerously steep with well-defined walls and sharp ledge drops. The most dramatic canyon architecture at La Jolla Shores. Not for beginners.",
    details: [
      "Steeper and deeper than North Wall — exercise extreme caution",
      "Well-defined canyon walls with visible geological striations",
      "Grey and white horizontal stripes in sandstone — millions of years of history",
      "Walls drop in sharp 4-ft increments — defined, dramatic ledges",
      "Red octopus, lobster stacked deep in crevices",
      "Yellow and white gorgonian sea fans on deeper ledges",
      "Horn sharks almost guaranteed at night",
    ],
    species: ["Red octopus", "Lobster (dense)", "Yellow gorgonians", "White gorgonians", "Horn sharks (night)"],
  },
  {
    name: "The Amphitheatre", depth: "60–110 ft", difficulty: "Advanced",
    gradient: "from-[#0B1D2C] to-[#163B4E]",
    description: "A sheer semicircle wall — one of the most dramatic underwater formations in the canyon. Named for its curved, theater-like shape.",
    details: [
      "Semi-circular wall descending from ~60 ft to ~110 ft",
      "Dramatic vertical structure unlike the stair-stepping elsewhere",
      "Location varies depending on entry point and current",
    ],
    species: ["Wall invertebrates", "Rockfish", "Nudibranchs"],
  },
  {
    name: "The Detritus Field", depth: "60–80 ft", difficulty: "Intermediate",
    gradient: "from-[#3A4A56] to-[#163B4E]",
    description: "Locals call it the 'Crap Patch.' Looks like a tangle of dead kelp from above. Below, it's a macro photographer's paradise with more nudibranch species per dive than anywhere else in La Jolla.",
    details: [
      "Deposited tangle of kelp and plant matter from local currents",
      "10+ nudibranch species on a single dive (cold water is best)",
      "Horn sharks tucked into the kelp tangles",
      "Octopus, shrimp, kelpfish hiding throughout",
      "\"Few dive sites look as uninspired from above, but this place is truly a macro paradise\" — California Diver Magazine",
      "Best with macro lens: 100mm + diopter for tiny critters",
    ],
    species: ["10+ nudibranch species", "Horn sharks", "Octopus", "Shrimp", "Kelpfish"],
  },
  {
    name: "La Jolla Cove Kelp Forest", depth: "20–60 ft", difficulty: "Intermediate",
    gradient: "from-[#1B6B6B] to-[#163B4E]",
    description: "Cathedral-like canopy of giant kelp filtering sunlight. Sea lions twist through the fronds. Among the largest and healthiest kelp forests remaining in Southern California.",
    details: [
      "Enter from Cove steps, head 300 yards straight out, or enter from Boomer Beach heading west",
      "Giant kelp (Macrocystis pyrifera) grows up to 2 ft per day",
      "Supports 800+ species in the overall ecosystem",
      "Sea lion pups most interactive in October when they first enter the water",
      "Giant black sea bass in summer/fall — best chance at the Cove",
      "Sevengill sharks peak in spring",
      "Dozens of horn sharks in shallows near the caves during breeding season",
    ],
    species: ["Sea lions", "Garibaldi", "Sevengill sharks", "Giant sea bass", "Horn sharks", "Kelp bass", "Sheephead", "Bat rays", "Nudibranchs", "Lobster"],
  },
  {
    name: "Seven Sea Caves", depth: "5–25 ft", difficulty: "Beginner (calm days only)",
    gradient: "from-[#3A4A56] to-[#0B1D2C]",
    description: "Seven caves carved into 75-million-year-old sandstone cliffs. Sea lion pups play in the grottos. Swim-throughs connect some caves. Only enter in calm conditions.",
    details: [
      "Clam's Cave — head straight out from Cove, follow kayakers ~200 yards right",
      "Sunny Jim's Cave — only one accessible from land (via The Cave Store tunnel)",
      "Sea lion pups love the grotto swim-throughs",
      "ONLY enter in calm conditions — surge makes caves extremely dangerous",
      "Low tide exposes more cave structure",
      "Great starting/ending point before heading to Rock Pile",
    ],
    species: ["Sea lion pups", "Garibaldi", "Calico bass"],
  },
  {
    name: "The Rock Pile", depth: "30–60 ft", difficulty: "Intermediate",
    gradient: "from-[#163B4E] to-[#1B6B6B]",
    description: "Large boulder formation at the west end of the Ecological Reserve. A maze of crevices where every gap holds lobster, eels, octopus, or nudibranchs.",
    details: [
      "Enter at Cove, swim ~50 yards out, drop down, head NE",
      "A few hundred yards offshore from the Cove",
      "Macro photography heaven — every crevice has something",
      "Even the swim out has plenty to see along the way",
    ],
    species: ["Lobster", "Moray eels", "Sea urchins", "Nudibranchs", "Sponges", "Abalone", "Octopus"],
  },
  {
    name: "The Pinnacles", depth: "30–90 ft", difficulty: "Advanced",
    gradient: "from-[#0B1D2C] to-[#163B4E]",
    description: "God's Rock, T-Rock, and Quast Rock — three pinnacles on a ridge outside La Jolla Point. Nutrient-rich currents bring schooling fish, barracuda, and bigger pelagics.",
    details: [
      "Three pinnacles along the same ridge, hundreds of yards apart",
      "Tops at 30-40 ft, bases at 90 ft where rock meets seafloor",
      "More nutrient-rich currents than inner sites",
      "Upper areas: diverse fish. Mid-depth: strawberry anemones, large gorgonians. Deep: rocky rubble with eels and octopus",
      "Advanced site — long swim, deep water, current possible",
    ],
    species: ["Schooling fish", "Barracuda", "Yellowtail", "Sheephead", "Calico bass", "Strawberry anemones", "Gorgonians", "Moray eels"],
  },
  {
    name: "Marine Room", depth: "10–50 ft", difficulty: "Beginner",
    gradient: "from-[#87CEEB] to-[#1B6B6B]",
    description: "Southern La Jolla Shores entry via the alleyway next to The Marine Room restaurant. Grassy shallow reef with leopard sharks, tope sharks, and surprisingly rich life.",
    details: [
      "Entry via alleyway next to the restaurant — careful at high tide, water washes onto steps",
      "Sandy bottom stays 10-15 ft deep for 100m+ out",
      "Eel grass and boa kelp create a healthy shallow ecosystem",
      "Best spot for leopard sharks — stay shallow (~20 ft) in summer",
      "At the canyon wall: sea hare, sculpin, red octopus",
    ],
    species: ["Leopard sharks", "Tope sharks", "Kelp bass", "Angel sharks", "Sea turtles (rare)", "Sand dabs", "Blue crab", "Nudibranchs", "Sea hare", "Red octopus"],
  },
];

const NIGHT_HIGHLIGHTS = [
  { creature: "Horn sharks", note: "Almost guaranteed. They cruise openly after dark, especially on the South Wall and in the Detritus Field." },
  { creature: "Octopus", note: "Hunting across the sand and walls. Two-spot and red octopus emerge from daytime hiding spots." },
  { creature: "Crabs", note: "Spider crabs, sheep crabs, swimming crabs — everywhere. The canyon floor comes alive." },
  { creature: "Market squid (winter)", note: "Thousands gather to spawn in winter months. One of the most spectacular underwater events in California." },
  { creature: "Angel sharks", note: "Active feeders at night, rising from their sand camouflage to hunt." },
  { creature: "Nudibranchs", note: "More active and visible after dark. The Detritus Field yields 10+ species per night dive." },
  { creature: "Bioluminescence", note: "On good nights, every movement triggers blue sparks in the water." },
];

const DATA_SOURCES = [
  { name: "NDBC 46254 — Scripps Nearshore Buoy", description: "Sea temp (0.46m), wave height, period, direction. Updates every 30 min.", url: "https://www.ndbc.noaa.gov/station_page.php?station=46254" },
  { name: "Scripps Pier Underwater Cam", description: "HD camera at 4m depth. AI-analyzed for visibility using piling distances.", url: "https://coollab.ucsd.edu/pierviz/" },
  { name: "NDBC LJPC1 — Scripps Pier", description: "Wind speed, direction, gusts from pier anemometer.", url: "https://www.ndbc.noaa.gov/station_page.php?station=ljpc1" },
  { name: "NOAA Tides 9410230", description: "Tide predictions and current tide state.", url: "https://tidesandcurrents.noaa.gov/stationhome.html?id=9410230" },
  { name: "NWS Marine Forecast PZZ740", description: "5-7 day coastal waters forecast for San Diego.", url: "https://www.ndbc.noaa.gov/data/Forecasts/FZUS56.KSGX.html" },
  { name: "SD Beach Water Quality", description: "Weekly bacteria testing. 72-hour post-rain advisory.", url: "https://www.sdbeachinfo.com/" },
];

// ─── Components ───

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="font-serif text-2xl text-deep mb-1">{title}</h2>
      {subtitle && <p className="text-xs text-[#5a6a7a] mb-6">{subtitle}</p>}
      {children}
    </div>
  );
}

export function UnderwaterMap() {
  const [expandedSite, setExpandedSite] = useState<string | null>(null);

  return (
    <div>
      {/* ─── The Swim Out ─── */}
      <Section title="The swim out" subtitle="What you'll pass over as you kick west from La Jolla Shores toward the canyon (Vallecitos St entry, heading ~270°)">
        <div className="space-y-3">
          {SWIM_OUT_ZONES.map((zone) => (
            <div key={zone.depth} className="bg-white rounded-xl overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${zone.gradient}`} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="font-serif text-base text-deep">{zone.name}</span>
                    <span className="text-[10px] text-[#5a6a7a] ml-2 bg-deep/5 px-2 py-0.5 rounded-full">{zone.depth}</span>
                  </div>
                </div>
                <p className="text-xs text-[#5a6a7a] leading-relaxed mb-3">{zone.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {zone.species.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-deep/5 rounded-full text-[10px] text-deep">{s}</span>
                  ))}
                </div>
                <p className="text-[10px] text-teal italic">{zone.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Named Dive Sites ─── */}
      <Section title="Named dive sites" subtitle="The specific locations that local divers know by name — from forums, dive reports, and years of shared knowledge">
        <div className="grid md:grid-cols-2 gap-4">
          {NAMED_SITES.map((site) => {
            const isExpanded = expandedSite === site.name;
            return (
              <div key={site.name} className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setExpandedSite(isExpanded ? null : site.name)}>
                <div className={`h-28 bg-gradient-to-br ${site.gradient} relative flex items-end p-5`}>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] text-white">{site.depth}</span>
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] text-white">{site.difficulty}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                  <h3 className="font-serif text-base text-white relative z-10">{site.name}</h3>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#5a6a7a] leading-relaxed mb-3">{site.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {site.species.slice(0, isExpanded ? 999 : 5).map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-deep/5 rounded-full text-[10px] text-deep">{s}</span>
                    ))}
                    {!isExpanded && site.species.length > 5 && (
                      <span className="px-2 py-0.5 bg-deep/5 rounded-full text-[10px] text-[#5a6a7a]">+{site.species.length - 5}</span>
                    )}
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-deep/[0.06] p-5">
                    <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-2">Local knowledge</div>
                    <ul className="space-y-1.5">
                      {site.details.map((d, i) => (
                        <li key={i} className="text-xs text-[#5a6a7a] leading-relaxed flex gap-2">
                          <span className="text-teal shrink-0 mt-0.5">&bull;</span>{d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ─── Night Diving ─── */}
      <Section title="After dark" subtitle="La Jolla Canyon is one of San Diego's premier night dive sites. The canyon comes alive.">
        <div className="bg-deep rounded-2xl p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {NIGHT_HIGHLIGHTS.map((h) => (
              <div key={h.creature} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-seafoam shrink-0 mt-1.5" />
                <div>
                  <span className="text-sm text-white font-medium">{h.creature}</span>
                  <p className="text-xs text-white/50 leading-relaxed mt-0.5">{h.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/30 mt-6">Enter from La Jolla Shores — sandy, easy even in the dark. Compass navigation essential. Powerful dive light recommended.</p>
        </div>
      </Section>

      {/* ─── Depth Profile ─── */}
      <Section title="Depth profile" subtitle="Cross-section from La Jolla Shores beach to the submarine canyon">
        <div className="bg-white rounded-2xl p-6">
          <div className="relative h-64 rounded-xl overflow-hidden" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #3A8BB0 15%, #1B6B6B 30%, #163B4E 50%, #0B1D2C 75%, #000 100%)" }}>
            {[
              { depth: "0 ft", label: "Beach — stingrays, shuffle your feet", pct: 2, left: 2 },
              { depth: "10 ft", label: "Moonscape — sea pens, pipefish", pct: 8, left: 8 },
              { depth: "25 ft", label: "Sand dollar field — millions, quarter-mile wide", pct: 16, left: 5 },
              { depth: "35 ft", label: "Horn sharks, angel sharks, halibut", pct: 22, left: 15 },
              { depth: "40 ft", label: "Canyon rim — buoy markers", pct: 28, left: 35 },
              { depth: "50 ft", label: "Vallecitos Point — lobster, nudibranchs", pct: 36, left: 22 },
              { depth: "60 ft", label: "Detritus Field — macro paradise", pct: 44, left: 48 },
              { depth: "70 ft", label: "North Wall — guitarfish, gorgonians", pct: 50, left: 35 },
              { depth: "90 ft", label: "Pinnacle tops — schooling fish", pct: 58, left: 60 },
              { depth: "110 ft", label: "Amphitheatre — sheer semicircle wall", pct: 66, left: 50 },
              { depth: "130 ft", label: "Recreational scuba limit", pct: 74, left: 68 },
              { depth: "300 ft", label: "Deep freediving zone", pct: 84, left: 58 },
              { depth: "600–900 ft", label: "Canyon floor — La Jolla meets Scripps", pct: 95, left: 72 },
            ].map((d) => (
              <div key={d.depth} className="absolute flex items-center gap-2" style={{ top: `${d.pct}%`, left: `${d.left}%` }}>
                <div className="w-1 h-1 rounded-full bg-white/70 shrink-0" />
                <div className="whitespace-nowrap">
                  <span className="text-[9px] font-bold text-white/90">{d.depth}</span>
                  <span className="text-[8px] text-white/40 ml-1.5">{d.label}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#5a6a7a] mt-3">La Jolla Canyon starts ~100 yards from the beach. It merges with Scripps Canyon at ~900 ft, continuing to 1,600 ft before opening into the San Diego Trough. Both canyons have detrital mats with &quot;combined density an order of magnitude larger than reported anywhere else in the world.&quot; Source: USGS multibeam bathymetry, Scripps Institution.</p>
        </div>
      </Section>

      {/* ─── Seasonal Guide ─── */}
      <Section title="When to dive" subtitle="Seasonal guide to what you&apos;ll encounter">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { season: "Winter", months: "Dec–Feb", temp: "56–60°F", suit: "7mm / drysuit", highlight: "Squid runs", vis: "8–20 ft", animals: "Market squid (night), gray whale migration, lobster season peak, horn shark breeding", note: "Best night diving of the year. Canyon water can drop to 49°F at depth." },
            { season: "Spring", months: "Mar–May", temp: "59–64°F", suit: "5mm + hood", highlight: "Upwelling", vis: "10–25 ft", animals: "Harbor seal pupping, garibaldi nesting, sevengill shark peak, nutrient upwelling events", note: "Cold upwelling from the Canyon brings dramatically clear water. Watch for sudden temp drops." },
            { season: "Summer", months: "Jun–Aug", temp: "64–70°F", suit: "3–5mm", highlight: "Leopard sharks", vis: "15–40 ft", animals: "Leopard shark aggregation (Shores), bat rays, sea turtles, baitballs, giant sea bass", note: "Warmest water, best vis, longest days. The Shores shark gathering is world-famous." },
            { season: "Fall", months: "Sep–Nov", temp: "67–72°F", suit: "3mm / shorty", highlight: "Peak conditions", vis: "20–40+ ft", animals: "Sevengill sharks, giant sea bass, massive baitballs, blue water days, sea lion pups (Oct)", note: "Often the absolute best diving of the year. Sea lion pups enter the water in October — most interactive." },
          ].map((s) => (
            <div key={s.season} className="bg-white rounded-xl p-5">
              <div className="font-serif text-lg text-deep mb-0.5">{s.season}</div>
              <div className="text-[10px] text-[#5a6a7a] mb-1">{s.months} · {s.temp}</div>
              <div className="text-[10px] text-[#5a6a7a] mb-3">Wetsuit: {s.suit}</div>
              <div className="px-2 py-1 bg-teal/10 rounded-full text-[10px] text-teal font-medium inline-block mb-3">{s.highlight}</div>
              <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-1">Visibility</div>
              <p className="text-xs text-[#5a6a7a] mb-2">{s.vis}</p>
              <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-1">Wildlife</div>
              <p className="text-xs text-[#5a6a7a] mb-2">{s.animals}</p>
              <p className="text-[10px] text-teal/70 italic leading-relaxed">{s.note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Data Sources ─── */}
      <Section title="Our data sources" subtitle="Every reading on the conditions dashboard comes from these instruments">
        <div className="grid md:grid-cols-2 gap-3">
          {DATA_SOURCES.map((src) => (
            <a key={src.name} href={src.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-4 no-underline hover:shadow-md transition-shadow flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-coral shrink-0 mt-1.5" />
              <div>
                <div className="text-sm font-medium text-deep">{src.name}</div>
                <p className="text-[10px] text-[#5a6a7a] mt-0.5">{src.description}</p>
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* ─── Regulations ─── */}
      <Section title="Know before you go">
        <div className="bg-white rounded-2xl p-6 space-y-3">
          {[
            "Matlahuayl State Marine Reserve: It is unlawful to injure, damage, take, or possess any living, geological, or cultural marine resource.",
            "Float, flag, anchor, and descent line are required for beach diving at all La Jolla sites.",
            "No spearfishing or lobster take within the reserve boundaries.",
            "Removing anything — including sand, shells, rocks, sand dollars — results in significant fines.",
            "72-hour rule: Stay out of the water for 72 hours after rainfall. Urban runoff carries bacteria and destroys visibility.",
            "Check with lifeguards before diving: 619-221-8824 for daily conditions.",
          ].map((rule, i) => (
            <div key={i} className="flex gap-3 text-xs text-[#5a6a7a] leading-relaxed">
              <span className="text-coral shrink-0 mt-0.5 font-bold">{i + 1}</span>
              {rule}
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Photo CTA ─── */}
      <div className="bg-deep rounded-2xl p-8 text-center">
        <div className="text-seafoam text-xs font-semibold uppercase tracking-wider mb-2">Got underwater photos?</div>
        <h3 className="font-serif text-xl text-white mb-2">Help us build this guide</h3>
        <p className="text-white/50 text-sm leading-relaxed max-w-md mx-auto mb-4">
          We&apos;re building the most complete underwater guide to La Jolla. Share your shots of the kelp forest, canyon walls, marine life, or dive sites — we&apos;ll credit you.
        </p>
        <a href="/contact" className="inline-block px-6 py-3 bg-coral text-white rounded-full font-medium text-sm no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all">
          Share your photos →
        </a>
      </div>
    </div>
  );
}
