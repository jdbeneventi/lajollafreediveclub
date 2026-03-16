"use client";

import { useState } from "react";

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  category: "shark" | "ray" | "fish" | "invertebrate" | "mammal" | "reptile";
  size: string;
  depth: string;
  season: string;
  frequency: "common" | "regular" | "occasional" | "rare";
  habitat: string[];
  locations: string[];
  description: string;
  behavior: string;
  funFact: string;
  dangerLevel: "harmless" | "caution" | "respect distance";
  bestTime?: string;
}

export const SPECIES: Species[] = [
  // ─── Sharks ───
  {
    id: "leopard-shark",
    name: "Leopard Shark",
    scientificName: "Triakis semifasciata",
    category: "shark",
    size: "Up to 5\u20136 ft",
    depth: "2\u201340 ft",
    season: "June\u2013October (peak Aug\u2013Sep)",
    frequency: "common",
    habitat: ["Sand flats", "Seagrass beds", "Shallow reef"],
    locations: ["La Jolla Shores (primary)", "La Jolla Cove shallows"],
    description: "Silvery-bronze with dark oval saddle markings. One of the most iconic La Jolla encounters. Thousands migrate here annually to mate in the warm shallow water \u2014 the only known mating site in the world for this species.",
    behavior: "Bottom feeder, cruises the sandy shallows in large aggregations. Sensitive to vibration \u2014 move slowly and calmly. Often visible in knee-deep water during peak season. Mostly pregnant females using the warm water to gestate.",
    funFact: "La Jolla is the only place in the world where leopard sharks have been observed mating. The same individuals return year after year.",
    dangerLevel: "harmless",
    bestTime: "Sunny midday during summer, when warm water concentrates them in the shallows",
  },
  {
    id: "sevengill-shark",
    name: "Broadnose Sevengill Shark",
    scientificName: "Notorynchus cepedianus",
    category: "shark",
    size: "Up to 10 ft",
    depth: "30\u201390 ft",
    season: "Spring (Mar\u2013Jun)",
    frequency: "regular",
    habitat: ["Kelp forest", "Rocky reef", "Canyon edge"],
    locations: ["Boomers Kelp", "La Jolla Cove outer reef", "Rock Pile"],
    description: "Reddish-brown to silver-gray with small black spots and seven gill slits (most sharks have five). A prehistoric-looking shark that cruises the kelp forests in spring. One of La Jolla's most thrilling encounters.",
    behavior: "Cruises slowly through kelp canopy, often at mid-water depth. Generally calm around divers but large and powerful \u2014 maintain respectful distance. More common on overcast days and early morning.",
    funFact: "Sevengill sharks are considered \u201cliving fossils\u201d \u2014 their body plan has remained largely unchanged for over 150 million years, predating the dinosaurs.",
    dangerLevel: "respect distance",
    bestTime: "Early morning on overcast spring days, in the kelp forest",
  },
  {
    id: "horn-shark",
    name: "Horn Shark",
    scientificName: "Heterodontus francisci",
    category: "shark",
    size: "Up to 4 ft",
    depth: "10\u201360 ft",
    season: "Year-round",
    frequency: "regular",
    habitat: ["Rocky reef", "Kelp holdfast", "Caves"],
    locations: ["La Jolla Cove reef", "Rock Pile", "Boomers"],
    description: "Short, broad head with a blunt snout and prominent ridges over the eyes. Tan to brown with dark spots. Nocturnal predator that hides in crevices during the day.",
    behavior: "Slow-moving and solitary. Uses muscular pectoral fins to \"walk\" along the bottom. Hunts at night for sea urchins, crabs, and mollusks. Often wedged into rocky crevices during day dives.",
    funFact: "Horn sharks lay spiral-shaped egg cases (\"mermaid's purses\") that they wedge into rock crevices for protection. The distinctive shape keeps them from being dislodged by surge.",
    dangerLevel: "harmless",
  },
  {
    id: "swell-shark",
    name: "Swell Shark",
    scientificName: "Cephaloscyllium ventriosum",
    category: "shark",
    size: "Up to 3.5 ft",
    depth: "40\u2013100 ft",
    season: "Year-round",
    frequency: "occasional",
    habitat: ["Canyon walls", "Rocky ledges"],
    locations: ["Scripps Canyon", "La Jolla Canyon wall"],
    description: "Yellowish-brown with dark and light blotches. Named for its ability to inflate its body with water when threatened, wedging itself into crevices so predators can\u2019t extract it.",
    behavior: "Nocturnal and very reclusive. Found in holes eroded into the sediment walls of the canyons. If you spot one during a day dive, it will likely be sleeping in a crevice.",
    funFact: "When removed from water, a swell shark will gulp air and inflate to nearly double its size, making it almost impossible for a predator to swallow.",
    dangerLevel: "harmless",
  },
  {
    id: "soupfin-shark",
    name: "Soupfin (Tope) Shark",
    scientificName: "Galeorhinus galeus",
    category: "shark",
    size: "Up to 6.5 ft",
    depth: "15\u201360 ft",
    season: "Summer (every 3 years)",
    frequency: "occasional",
    habitat: ["Sand flats", "Kelp edge"],
    locations: ["La Jolla Shores", "La Jolla Cove"],
    description: "Slender, gray shark with a long pointed snout. Scripps researchers discovered that the same pregnant females return to La Jolla every three years, carrying 40\u201350 pups each.",
    behavior: "A 7-year acoustic tagging study by Dr. Andrew Nosal at Scripps confirmed individual site fidelity. Females use the warm shallow waters as a nursery.",
    funFact: "Nearly eradicated in the 1940s\u201350s for their vitamin A-rich livers before synthetic vitamin A was developed. The population is still recovering.",
    dangerLevel: "harmless",
  },

  // ─── Rays ───
  {
    id: "bat-ray",
    name: "Bat Ray",
    scientificName: "Myliobatis californica",
    category: "ray",
    size: "Up to 6 ft wingspan",
    depth: "5\u201350 ft",
    season: "Year-round (peak summer)",
    frequency: "regular",
    habitat: ["Sand flats", "Kelp forest floor", "Seagrass"],
    locations: ["La Jolla Shores", "La Jolla Cove", "Rock Pile"],
    description: "Diamond-shaped with a distinctive raised head and long whip-like tail. Dark brown to olive on top, white underneath. Often partially buried in sand, creating a silhouette that\u2019s unmistakable once you spot it.",
    behavior: "Bottom dweller that crushes clams and crustaceans with plate-like teeth. Often found resting on sandy bottom, sometimes in groups. Will glide away gracefully when approached slowly.",
    funFact: "Bat rays can crush clam shells with their powerful jaws, generating a biting force exceeding 200 pounds per square inch \u2014 one of the strongest of any ray species.",
    dangerLevel: "caution",
    bestTime: "Morning dives on sandy bottom near the kelp edge",
  },
  {
    id: "round-stingray",
    name: "Round Stingray",
    scientificName: "Urobatis halleri",
    category: "ray",
    size: "Up to 12 in disc",
    depth: "1\u201330 ft",
    season: "Year-round (peak summer)",
    frequency: "common",
    habitat: ["Sand flats", "Shallow surf zone"],
    locations: ["La Jolla Shores (very common)", "La Jolla Cove shallows"],
    description: "Small, nearly circular ray with a short tail and venomous barb. Brown to gray, well-camouflaged against sand. The most common cause of stingray injuries at La Jolla Shores.",
    behavior: "Buries itself in shallow sand. Stings when accidentally stepped on. Always shuffle your feet when wading (the \"stingray shuffle\") to warn them of your approach.",
    funFact: "Round stingrays give birth to live young \u2014 typically 1\u20136 pups, each a perfect miniature of the adult, complete with a functional venomous barb.",
    dangerLevel: "caution",
  },
  {
    id: "guitarfish",
    name: "Shovelnose Guitarfish",
    scientificName: "Pseudobatos productus",
    category: "ray",
    size: "Up to 5.5 ft",
    depth: "3\u201340 ft",
    season: "Summer\u2013Fall",
    frequency: "regular",
    habitat: ["Sand flats", "Seagrass beds"],
    locations: ["La Jolla Shores"],
    description: "Guitar-shaped body \u2014 half shark, half ray. Long pointed snout, olive to sandy brown on top. Despite the name, it\u2019s actually a ray, not a shark. Cruises the sandy bottom in shallow water.",
    behavior: "Bottom dweller that uses its snout to probe sand for invertebrates. Often found resting on the bottom, partially camouflaged. Generally very calm around snorkelers.",
    funFact: "Guitarfish are sometimes called \"shovelnose sharks\" but they\u2019re actually rays. Their flat body is adapted to life on the sandy seafloor, and they\u2019re considered one of the most ancient living ray lineages.",
    dangerLevel: "harmless",
  },
  {
    id: "diamond-stingray",
    name: "Diamond Stingray",
    scientificName: "Hypanus dipterurus",
    category: "ray",
    size: "Up to 5.5 ft (including tail)",
    depth: "5\u201360 ft",
    season: "Summer\u2013Fall",
    frequency: "regular",
    habitat: ["Sand flats", "Kelp edge"],
    locations: ["La Jolla Shores", "La Jolla Cove"],
    description: "Diamond-shaped disc with a long whip tail bearing a venomous barb. Gray-brown on top, white below. Larger and more angular than the round stingray.",
    behavior: "Rests on sandy bottom, sometimes in small groups. More wary of divers than round stingrays. Will swim away when approached but can sting if cornered.",
    funFact: "Female diamond stingrays often return to the same nursery areas year after year to give birth, similar to the leopard sharks.",
    dangerLevel: "caution",
  },

  // ─── Fish ───
  {
    id: "garibaldi",
    name: "Garibaldi",
    scientificName: "Hypsypops rubicundus",
    category: "fish",
    size: "Up to 15 in",
    depth: "5\u201330 ft (up to 100 ft)",
    season: "Year-round",
    frequency: "common",
    habitat: ["Rocky reef", "Kelp forest", "Seagrass"],
    locations: ["La Jolla Cove (everywhere)", "Boomers", "Rock Pile"],
    description: "Brilliant orange \u2014 impossible to miss. California\u2019s official state marine fish. Juveniles are even more spectacular: orange with iridescent blue-purple spots that fade as they mature.",
    behavior: "Highly territorial. Males maintain and guard nesting areas in the reef, aggressively chasing away intruders (including divers). They tend their nest of red algae carefully, sometimes for months.",
    funFact: "It\u2019s illegal to take or harm a Garibaldi in California \u2014 they\u2019ve been protected since 1995. Named after Giuseppe Garibaldi, the Italian revolutionary, because of their vivid orange color resembling his followers\u2019 shirts.",
    dangerLevel: "harmless",
  },
  {
    id: "sheephead",
    name: "California Sheephead",
    scientificName: "Semicossyphus pulcher",
    category: "fish",
    size: "Up to 3 ft",
    depth: "10\u201360 ft",
    season: "Year-round",
    frequency: "regular",
    habitat: ["Kelp forest", "Rocky reef"],
    locations: ["Boomers Kelp", "Rock Pile", "La Jolla Cove"],
    description: "Males are striking: black head and tail, bright red-pink midsection, white chin. Females are uniform pink-red. Large, distinctive teeth for crushing shellfish.",
    behavior: "All sheephead are born female. At around 7\u20138 years, the dominant females transform into males \u2014 complete with a color change and growth of the characteristic bony forehead bump.",
    funFact: "Every sheephead starts life as a female. They\u2019re protogynous hermaphrodites \u2014 when the dominant male in a group dies, the largest female changes sex and takes over within weeks.",
    dangerLevel: "harmless",
  },
  {
    id: "giant-sea-bass",
    name: "Giant Sea Bass",
    scientificName: "Stereolepis gigas",
    category: "fish",
    size: "Up to 7.5 ft, 560 lbs",
    depth: "30\u201390 ft",
    season: "Summer\u2013Fall",
    frequency: "occasional",
    habitat: ["Kelp forest", "Rocky reef"],
    locations: ["Boomers Kelp", "La Jolla Cove outer reef"],
    description: "Massive, dark-bodied fish that can weigh over 500 pounds. Once nearly extinct from overfishing, they\u2019re making a slow comeback in Southern California\u2019s kelp forests.",
    behavior: "Surprisingly curious and will sometimes approach divers. Moves slowly through the kelp, feeding on small fish, crustaceans, and squid. Aggregates during summer spawning season.",
    funFact: "Giant sea bass can live over 75 years. They were fished nearly to extinction by the 1980s \u2014 the population dropped to just a few hundred individuals. Protected since 1982, they\u2019re slowly recovering.",
    dangerLevel: "harmless",
  },

  // ─── Invertebrates ───
  {
    id: "lobster",
    name: "California Spiny Lobster",
    scientificName: "Panulirus interruptus",
    category: "invertebrate",
    size: "Up to 24 in",
    depth: "10\u2013100 ft",
    season: "Year-round (visible). Season: Oct\u2013Mar",
    frequency: "common",
    habitat: ["Rocky reef crevices", "Kelp holdfast", "Canyon ledges"],
    locations: ["Rock Pile", "Scripps Canyon ledges", "Boomers", "La Jolla Cove"],
    description: "Dark reddish-brown with long antennae that often extend from crevices, giving away their hiding spots. Unlike Atlantic lobsters, California spiny lobsters have no claws.",
    behavior: "Nocturnal \u2014 hides in crevices during the day with antennae protruding. Emerges at night to forage on the reef. Look for the telltale antenna movement in dark crevices.",
    funFact: "Within the Matlahuayl Marine Reserve (La Jolla Cove), all take is prohibited \u2014 the lobsters here can grow to enormous sizes because they\u2019re protected. Some individuals in the reserve are estimated to be over 50 years old.",
    dangerLevel: "harmless",
  },
  {
    id: "octopus",
    name: "California Two-Spot Octopus",
    scientificName: "Octopus bimaculoides",
    category: "invertebrate",
    size: "Up to 23 in (mantle 7 in)",
    depth: "10\u201360 ft",
    season: "Year-round",
    frequency: "regular",
    habitat: ["Rocky reef", "Canyon walls", "Sand with shell debris"],
    locations: ["La Jolla Canyon wall", "Rock Pile", "La Jolla Cove reef"],
    description: "Named for the distinctive blue eyespots (ocelli) below each eye. Master of camouflage \u2014 can change color and texture in an instant to match its surroundings.",
    behavior: "Intelligent and curious. Hunts at night, hides in dens during the day. Often identifiable by the pile of discarded shells (a \"midden\") outside its den entrance. Will sometimes extend a tentacle to investigate a diver.",
    funFact: "Octopuses have three hearts, blue blood, and can taste with their suckers. The California two-spot is one of the most studied octopus species due to its proximity to research institutions like Scripps.",
    dangerLevel: "harmless",
  },
  {
    id: "nudibranch",
    name: "Nudibranchs (various species)",
    scientificName: "Order Nudibranchia",
    category: "invertebrate",
    size: "0.5\u20136 in",
    depth: "5\u201360 ft",
    season: "Year-round (most diverse in spring)",
    frequency: "common",
    habitat: ["Rocky reef", "Kelp", "Seagrass", "Canyon walls"],
    locations: ["La Jolla Cove (everywhere)", "Rock Pile", "Canyon wall"],
    description: "\"Sea slugs\" in dazzling colors \u2014 purple, orange, electric blue, white with gold tips. Over 30 species found in La Jolla waters. They\u2019re tiny, so slow down and look carefully.",
    behavior: "Slow-moving grazers on sponges, hydroids, and algae. Many species are toxic (their bright colors are a warning). The Spanish shawl nudibranch (vivid purple and orange) is the most photographed species in La Jolla.",
    funFact: "\"Nudibranch\" means \"naked gill\" \u2014 their gills are exposed on their backs. Some species can incorporate the stinging cells from their prey (like anemones) into their own skin for defense.",
    dangerLevel: "harmless",
  },
  {
    id: "market-squid",
    name: "Market Squid",
    scientificName: "Doryteuthis opalescens",
    category: "invertebrate",
    size: "Up to 12 in",
    depth: "30\u2013100 ft",
    season: "Winter (Dec\u2013Feb)",
    frequency: "occasional",
    habitat: ["Canyon edge", "Sand flats"],
    locations: ["La Jolla Canyon", "La Jolla Shores (night)"],
    description: "Translucent white with iridescent spots. During winter spawning events (\"squid runs\"), thousands gather on the sandy bottom near the canyon to mate, lay eggs, and die.",
    behavior: "The squid run is one of La Jolla\u2019s most spectacular underwater events. Males flash color patterns to attract females. After mating, females deposit egg capsules on the sandy bottom. The event attracts predators from all around.",
    funFact: "A squid run night dive at La Jolla Canyon is considered one of the top night dives in California. Thousands of squid create a swirling, bioluminescent spectacle that attracts bat rays, angel sharks, and sevengills.",
    dangerLevel: "harmless",
    bestTime: "Night dives in the canyon during December\u2013February",
  },

  // ─── Marine Mammals ───
  {
    id: "sea-lion",
    name: "California Sea Lion",
    scientificName: "Zalophus californianus",
    category: "mammal",
    size: "Males up to 7.25 ft, 850 lbs. Females 5.5 ft, 250 lbs",
    depth: "Surface\u201390 ft",
    season: "Year-round",
    frequency: "common",
    habitat: ["Rocky cliffs", "Kelp forest", "Open water"],
    locations: ["La Jolla Cove (main colony)", "Boomers", "Sea caves"],
    description: "The most iconic residents of La Jolla Cove. Brown, with external ear flaps (unlike seals). Males are much larger with a prominent forehead bump (sagittal crest). The La Jolla colony is almost all female with one large alpha male, locally known as \u201cBruno.\u201d",
    behavior: "Juveniles are extremely curious and playful \u2014 they\u2019ll zoom past you underwater, blow bubbles, and circle back for another look. Adults can be territorial. Early morning dives offer the best sea lion encounters before tourists arrive.",
    funFact: "A group of sea lions is called a \u201craft.\u201d Sea lions can dive to over 900 feet and hold their breath for up to 10 minutes, making them natural freedivers.",
    dangerLevel: "respect distance",
    bestTime: "Early morning at the Cove \u2014 juveniles are most playful before the crowds",
  },
  {
    id: "harbor-seal",
    name: "Harbor Seal",
    scientificName: "Phoca vitulina",
    category: "mammal",
    size: "Up to 6 ft, 300 lbs",
    depth: "Surface\u2013150 ft",
    season: "Year-round (pupping Feb\u2013Apr)",
    frequency: "common",
    habitat: ["Sandy beach", "Rocky shore", "Open water"],
    locations: ["Children\u2019s Pool (main colony)", "Boomers (in water)"],
    description: "Spotted gray-brown coat, no visible ear flaps, large dark eyes. More streamlined than sea lions and better adapted to swimming. The Children\u2019s Pool colony is one of the most accessible harbor seal viewing sites in California.",
    behavior: "More shy than sea lions. In water, they\u2019re graceful and curious but keep more distance. On land, they\u2019re awkward \u2014 they can\u2019t walk on their flippers like sea lions. Pupping season (Feb\u2013Apr) closes Children\u2019s Pool beach.",
    funFact: "Harbor seal pups can swim within hours of birth. Their mother\u2019s milk is 45% fat (vs 4% for human milk), allowing pups to double their birth weight in just one month.",
    dangerLevel: "respect distance",
  },
  {
    id: "dolphin",
    name: "Common Dolphin",
    scientificName: "Delphinus delphis",
    category: "mammal",
    size: "Up to 8 ft",
    depth: "Surface",
    season: "Year-round",
    frequency: "regular",
    habitat: ["Open water", "Offshore"],
    locations: ["Offshore from the Cove", "Visible from Goldfish Point"],
    description: "Sleek, fast-moving dolphins with a distinctive hourglass pattern on their sides (tan and gray). Often seen in large pods of 50\u2013200+ individuals, sometimes mixed with bottlenose dolphins.",
    behavior: "Frequently seen from shore leaping and bow-riding. Pods sometimes come close to shore at the Cove, especially when chasing baitballs. An extraordinary sight from underwater if you\u2019re lucky enough to be in the right place.",
    funFact: "Common dolphins can reach speeds of 37 mph and dive to 900 feet. Superpods of over 1,000 individuals have been documented off San Diego.",
    dangerLevel: "harmless",
  },

  // ─── Reptiles ───
  {
    id: "green-sea-turtle",
    name: "Green Sea Turtle",
    scientificName: "Chelonia mydas",
    category: "reptile",
    size: "Up to 4 ft, 350 lbs",
    depth: "10\u201360 ft",
    season: "Year-round (more common in warm months)",
    frequency: "rare",
    habitat: ["Kelp forest", "Seagrass beds", "Reef"],
    locations: ["La Jolla Shores (occasionally)", "La Jolla Cove kelp"],
    description: "Large, graceful sea turtle with an olive-brown shell. An endangered species that\u2019s been increasingly spotted in La Jolla waters as San Diego\u2019s resident population grows.",
    behavior: "Feeds on seagrass and algae. Moves slowly and deliberately through the kelp. If you encounter one, stay calm and still \u2014 they\u2019ll sometimes continue feeding nearby.",
    funFact: "San Diego Bay has a small resident population of green sea turtles that lives near the warm water outflow from a power plant. Some individuals have been tracked making trips to La Jolla to feed in the kelp forests.",
    dangerLevel: "harmless",
  },
];

const CATEGORY_INFO = {
  shark: { label: "Sharks", icon: "\u{1F988}", color: "#163B4E" },
  ray: { label: "Rays", icon: "\u{1F41F}", color: "#1B6B6B" },
  fish: { label: "Fish", icon: "\u{1F41F}", color: "#D4A574" },
  invertebrate: { label: "Invertebrates", icon: "\u{1F419}", color: "#C75B3A" },
  mammal: { label: "Marine Mammals", icon: "\u{1F42C}", color: "#0B1D2C" },
  reptile: { label: "Reptiles", icon: "\u{1F422}", color: "#3A4A56" },
};

const FREQUENCY_LABEL = {
  common: { label: "Common", color: "#1B6B6B" },
  regular: { label: "Regular", color: "#D4A574" },
  occasional: { label: "Occasional", color: "#C75B3A" },
  rare: { label: "Rare", color: "#163B4E" },
};

export function MarineLifeGuide() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedSpecies, setExpandedSpecies] = useState<string | null>(null);

  const filtered = selectedCategory
    ? SPECIES.filter((s) => s.category === selectedCategory)
    : SPECIES;

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedCategory ? "bg-deep text-white" : "bg-white text-[#5a6a7a] hover:bg-deep/5"}`}
        >
          All species ({SPECIES.length})
        </button>
        {Object.entries(CATEGORY_INFO).map(([key, cat]) => {
          const count = SPECIES.filter((s) => s.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === key ? "text-white" : "bg-white text-[#5a6a7a] hover:bg-deep/5"}`}
              style={selectedCategory === key ? { background: cat.color } : {}}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Species cards */}
      <div className="space-y-3">
        {filtered.map((species) => {
          const isExpanded = expandedSpecies === species.id;
          const freq = FREQUENCY_LABEL[species.frequency];
          const cat = CATEGORY_INFO[species.category];

          return (
            <div key={species.id} className="bg-white rounded-2xl overflow-hidden">
              {/* Header — always visible */}
              <button
                onClick={() => setExpandedSpecies(isExpanded ? null : species.id)}
                className="w-full text-left p-5 flex items-start gap-4"
              >
                <div className="text-2xl mt-0.5">{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-base text-deep">{species.name}</span>
                    <span className="text-[10px] italic text-[#5a6a7a]">{species.scientificName}</span>
                  </div>
                  <p className="text-xs text-[#5a6a7a] mt-1 line-clamp-2">{species.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: freq.color + "15", color: freq.color }}>{freq.label}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-deep/5 text-[#5a6a7a]">{species.depth}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-deep/5 text-[#5a6a7a]">{species.season}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-deep/5 text-[#5a6a7a]">{species.size}</span>
                  </div>
                </div>
                <span className={`text-[#5a6a7a] transition-transform ${isExpanded ? "rotate-180" : ""}`}>&#9662;</span>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-deep/[0.04] pt-4 space-y-4">
                  {/* Behavior */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-1.5">Behavior</div>
                    <p className="text-xs text-[#5a6a7a] leading-relaxed">{species.behavior}</p>
                  </div>

                  {/* Where to find */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-1.5">Where to find</div>
                    <div className="flex flex-wrap gap-1.5">
                      {species.locations.map((loc) => (
                        <span key={loc} className="px-2 py-1 bg-teal/10 rounded-full text-[10px] text-teal">{loc}</span>
                      ))}
                    </div>
                  </div>

                  {/* Habitat */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-1.5">Habitat</div>
                    <div className="flex flex-wrap gap-1.5">
                      {species.habitat.map((h) => (
                        <span key={h} className="px-2 py-1 bg-deep/5 rounded-full text-[10px] text-[#5a6a7a]">{h}</span>
                      ))}
                    </div>
                  </div>

                  {/* Best time */}
                  {species.bestTime && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#5a6a7a] font-semibold mb-1.5">Best time</div>
                      <p className="text-xs text-[#5a6a7a]">{species.bestTime}</p>
                    </div>
                  )}

                  {/* Danger level */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${species.dangerLevel === "harmless" ? "bg-[#1B6B6B15] text-[#1B6B6B]" : species.dangerLevel === "caution" ? "bg-[#D4A57430] text-[#8B6840]" : "bg-[#C75B3A15] text-[#C75B3A]"}`}>
                      {species.dangerLevel === "harmless" ? "\u2714 Harmless" : species.dangerLevel === "caution" ? "\u26A0 Caution (stingers/barbs)" : "\u26A0 Respect distance"}
                    </span>
                  </div>

                  {/* Fun fact */}
                  <div className="p-4 bg-salt rounded-xl">
                    <div className="text-[10px] uppercase tracking-wider text-teal font-semibold mb-1">Did you know</div>
                    <p className="text-xs text-deep leading-relaxed">{species.funFact}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
