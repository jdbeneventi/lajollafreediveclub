// Seasonal intelligence engine for La Jolla waters
// Compiled from ScubaBoard, DeeperBlue, California Diver Magazine, iNaturalist,
// CDFW regulations, Scripps Institution, and local knowledge

export interface SeasonalEvent {
  title: string;
  detail: string;
  category: "species" | "event" | "regulation" | "conditions" | "grunion";
  icon: string;
  months: number[]; // 1-12
  priority: number; // 1 = highest
}

const SEASONAL_EVENTS: SeasonalEvent[] = [
  // === SPECIES ===
  {
    title: "Leopard shark aggregation",
    detail: "World-famous gathering in knee-deep water at La Jolla Shores. Hundreds of sharks in the shallows — visible from shore. Warmest, shallowest water draws pregnant females. Peak is July-August.",
    category: "species", icon: "🦈", months: [6, 7, 8, 9], priority: 1,
  },
  {
    title: "Sevengill sharks at the Cove",
    detail: "Broadnose sevengill sharks patrol the La Jolla Cove kelp forest. Population has grown significantly over the past 20 years. Best spotted on deeper reef dives, 40-80ft.",
    category: "species", icon: "🦈", months: [3, 4, 5, 9, 10, 11], priority: 2,
  },
  {
    title: "Giant black sea bass",
    detail: "The largest bony fish in California waters — up to 7ft and 500+ lbs. Spotted at the Cove and Vallecitos Point. Protected species. Encounters are unforgettable.",
    category: "species", icon: "🐟", months: [7, 8, 9, 10], priority: 2,
  },
  {
    title: "Sea lion pups in the water",
    detail: "Sea lion pups enter the water for the first time in October. The most playful, curious month — they'll swim right up to you, grab your fins, and do barrel rolls. Best marine interaction of the year.",
    category: "species", icon: "🦭", months: [10, 11], priority: 1,
  },
  {
    title: "Harbor seal pupping season",
    detail: "Harbor seals haul out on rocks to give birth. Keep distance from mothers and pups on shore. In the water, pups get curious — gentle encounters.",
    category: "species", icon: "🦭", months: [3, 4, 5], priority: 3,
  },
  {
    title: "Gray whale migration",
    detail: "Gray whales pass La Jolla on their 10,000-mile round trip between Alaska and Baja. Southbound December-February, northbound March-April. Occasionally spotted from shore or the canyon.",
    category: "species", icon: "🐋", months: [12, 1, 2, 3, 4], priority: 2,
  },
  {
    title: "Market squid spawning runs",
    detail: "Thousands of market squid gather over the sandy canyon floor to mate and spawn. The canyon lights up with bioluminescence. Attracts predators from all directions. Night dives only.",
    category: "species", icon: "🦑", months: [12, 1, 2, 3], priority: 1,
  },
  {
    title: "Bat rays everywhere",
    detail: "Bat rays are common on the sand flats and over the canyon. Watch for them flying past on the swim out. They can be 4-5ft across.",
    category: "species", icon: "🪽", months: [6, 7, 8, 9, 10], priority: 3,
  },
  {
    title: "Horn shark breeding season",
    detail: "Horn sharks are laying eggs in the canyon. Night dives almost guarantee sightings — they cruise openly after dark. Look for their distinctive spiral egg cases wedged in rocky crevices.",
    category: "species", icon: "🦈", months: [12, 1, 2], priority: 3,
  },
  {
    title: "Garibaldi nesting",
    detail: "Male garibaldi — California's state fish — are actively defending nests on the reef. They'll charge at anything that gets close, including you. Bright orange and fearless.",
    category: "species", icon: "🐠", months: [3, 4, 5, 6], priority: 4,
  },
  {
    title: "Massive baitballs",
    detail: "Schools of anchovies and sardines form dense balls near the surface and along the canyon. Draws everything: sea lions, dolphins, yellowtail, barracuda. One of the most electric things you'll see underwater.",
    category: "species", icon: "🐟", months: [8, 9, 10, 11], priority: 2,
  },

  // === EVENTS ===
  {
    title: "Grunion runs",
    detail: "California grunion ride waves onto the beach to spawn on full and new moon nights, March through September. Females bury in the sand, males wrap around them. One of nature's strangest spectacles — happens right at La Jolla Shores.",
    category: "grunion", icon: "🐟", months: [3, 4, 5, 6, 7, 8, 9], priority: 2,
  },
  {
    title: "Bioluminescence season",
    detail: "Dinoflagellate blooms make the water glow electric blue when disturbed. Every kick, every wave, every dolphin trail lights up. Dark moon nights are best. Can happen anytime but peaks in spring-summer.",
    category: "event", icon: "✨", months: [4, 5, 6, 7, 8], priority: 1,
  },
  {
    title: "Upwelling events",
    detail: "Northwest winds push surface water offshore, drawing cold, nutrient-rich water up from the canyon depths. Water temp can drop 10°F overnight. Vis goes crystal clear within days as the bloom feeds the entire food chain.",
    category: "conditions", icon: "🌊", months: [3, 4, 5, 6], priority: 3,
  },
  {
    title: "Peak kelp growth",
    detail: "Giant kelp (Macrocystis pyrifera) growing up to 2ft per day. The canopy is thickest now — cathedral-like light filtering through. Best time to see the kelp forest at full glory.",
    category: "conditions", icon: "🌿", months: [4, 5, 6, 7], priority: 4,
  },
  {
    title: "Blue water season",
    detail: "The clearest, warmest water of the year. Visibility can exceed 40ft. Water temp peaks. Best time to introduce new divers to the ocean. This is what we wait for.",
    category: "conditions", icon: "💎", months: [9, 10, 11], priority: 1,
  },
  {
    title: "Best night diving of the year",
    detail: "Winter night dives in the canyon are legendary. Horn sharks cruising, squid spawning, octopus hunting, crabs everywhere. Cold water keeps the crowds away — you'll have the canyon to yourself.",
    category: "event", icon: "🔦", months: [12, 1, 2], priority: 2,
  },

  // === REGULATIONS ===
  {
    title: "Lobster season is open",
    detail: "Recreational lobster season runs October through March. NOT in the Matlahuayl Marine Reserve (no take). But outside the reserve boundaries, game on. Check CDFW regs for size and bag limits.",
    category: "regulation", icon: "🦞", months: [10, 11, 12, 1, 2, 3], priority: 3,
  },
  {
    title: "Grunion closure — look but don't touch",
    detail: "April and May are closed season for grunion. You can watch the runs but cannot take any fish. June through March: take by hand only (no nets, pits, or holes). Fishing license required.",
    category: "regulation", icon: "🚫", months: [4, 5], priority: 4,
  },
];

export function getSeasonalEvents(date: Date = new Date()): SeasonalEvent[] {
  const month = date.getMonth() + 1; // 1-12
  return SEASONAL_EVENTS
    .filter(e => e.months.includes(month))
    .sort((a, b) => a.priority - b.priority);
}

export function getTopEvents(date: Date = new Date(), count: number = 5): SeasonalEvent[] {
  return getSeasonalEvents(date).slice(0, count);
}

// Get the "headline" event — the single most exciting thing happening right now
export function getHeadlineEvent(date: Date = new Date()): SeasonalEvent | null {
  const events = getSeasonalEvents(date);
  return events.length > 0 ? events[0] : null;
}

// Check if it's a grunion run night (full or new moon, March-September)
export function isGrunionNight(date: Date, moonAge: number): boolean {
  const month = date.getMonth() + 1;
  if (month < 3 || month > 9) return false;
  // Grunion run 2-6 nights after full and new moons
  const daysAfterNew = moonAge;
  const daysAfterFull = Math.abs(moonAge - 14.77);
  return (daysAfterNew >= 1 && daysAfterNew <= 4) || (daysAfterFull >= 1 && daysAfterFull <= 4);
}
