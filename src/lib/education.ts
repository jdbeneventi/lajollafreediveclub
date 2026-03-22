// Education programs and seasonal calendar data

export interface Program {
  id: string;
  name: string;
  price: number;
  priceUnit: string;
  description: string;
  philosophy?: string;
  ages: string;
  duration: string;
  schedule?: string;
  groupSize: string;
  includes: string[];
  location: string;
  season: string;
  charterEligible: boolean;
  militaryRate?: number;
  subscriberRate?: number;
  smallGroupRate?: string;
  prerequisites?: string;
  dropInRate?: string;
}

export interface SeasonalTheme {
  month: string;
  months: string;
  theme: string;
  guestOrg: string;
  description: string;
  species: string[];
}

export interface MonthlyEvent {
  month: string;
  theme: string;
  guestOrg: string;
  description: string;
}

// ─── PROGRAMS ───────────────────────────────────────────────────

const programs: Program[] = [
  {
    id: "camp-garibaldi",
    name: "Camp Garibaldi",
    price: 750,
    priceUnit: "week",
    description:
      "The flagship. Five days at La Jolla Shores. Your child learns breath-hold physiology, equalization, freediving technique, marine species identification, ocean conditions reading, canyon geology, kelp forest ecology, and surf survival — all in the field, all hands-on. They start the week holding their breath for 30 seconds and end it at over a minute. They start knowing zero species and end with 15+ documented in their personal field journal.",
    philosophy:
      "The ocean camp that starts from the inside out. Internal composure before external skills.",
    ages: "8–16",
    duration: "Monday–Friday, 8am–12:30pm",
    groupSize: "Max 8–10 students",
    includes: [
      "All gear (wetsuit, mask, fins, snorkel)",
      "AIDA Youth Instructor-led instruction",
      "2–3 guest educator modules per week",
      "Student observation journal",
      "Daily conditions data collection",
      "Species identification field guide",
    ],
    location: "La Jolla Shores, Kellogg Park",
    season: "Year-round by request. Summer & fall primary season.",
    charterEligible: true,
    militaryRate: 625,
    prerequisites: "Basic swimming ability. No ocean experience needed.",
  },
  {
    id: "field-trip",
    name: "Ocean Science Field Trip",
    price: 50,
    priceUnit: "student",
    description:
      "A single-day guided experience for school groups and homeschool co-ops. Tide reading from real NOAA data, marine species identification in the field, breath-hold science (kids measure their own dive reflex), and a guided snorkel or freedive in the marine reserve.",
    ages: "8–16 (tide pool version ages 5–10)",
    duration: "3–4 hours",
    groupSize: "6–12 students",
    includes: ["All gear", "Instruction", "Field journal pages"],
    location: "La Jolla Shores",
    season: "Any weekday, year-round",
    charterEligible: true,
    smallGroupRate: "$75/student for groups under 6",
  },
  {
    id: "series",
    name: "Ocean Science Series",
    price: 400,
    priceUnit: "student / semester",
    description:
      "Recurring monthly or biweekly sessions for homeschool co-ops and school groups. Each session covers a different seasonal topic with a rotating guest educator. The curriculum never repeats because the ocean never repeats.",
    ages: "8–16",
    duration: "3 hours per session",
    schedule: "Monthly or biweekly (8 sessions/semester typical)",
    groupSize: "6–12 students",
    includes: [
      "Cumulative observation journal across the year",
      "Rotating guest educators",
      "All gear and instruction",
    ],
    location: "La Jolla Shores",
    season: "Year-round",
    charterEligible: true,
    dropInRate: "$50/student per individual session",
  },
  {
    id: "community-day",
    name: "Community Ocean Day",
    price: 35,
    priceUnit: "person",
    description:
      "One Saturday morning per month. Open to everyone — families, kids, adults, visitors. A guided snorkel or freedive with a different theme and guest educator every month. Low commitment, high quality, and different every time.",
    ages: "8+ (kids) or any age (adults)",
    duration: "8:30am–11:30am",
    schedule: "One Saturday per month",
    groupSize: "16–20 per event",
    includes: [
      "All gear",
      "Themed instruction",
      "Guest educator session",
    ],
    location: "La Jolla Shores",
    season: "Year-round, monthly",
    charterEligible: false,
    subscriberRate: 25,
  },
];

// ─── MONTHLY EVENTS ─────────────────────────────────────────────

const monthlyEvents: MonthlyEvent[] = [
  {
    month: "January",
    theme: "Squid Run",
    guestOrg: "Marine Room Restaurant",
    description:
      "Winter squid spawning, night ocean biology, bioluminescence",
  },
  {
    month: "February",
    theme: "Gray Whale Migration",
    guestOrg: "Birch Aquarium",
    description:
      "Gray whale watching from the bluffs, marine mammal biology",
  },
  {
    month: "March",
    theme: "Upwelling Season",
    guestOrg: "EPARC / UCSD",
    description:
      "Cold clear water, nutrient upwelling, spring bloom",
  },
  {
    month: "April",
    theme: "Kelp Forest Recovery",
    guestOrg: "Scripps / Kelpwatch",
    description:
      "Kelp canopy monitoring, satellite data, spring growth",
  },
  {
    month: "May",
    theme: "Citizen Science Day",
    guestOrg: "SD Natural History Museum / iNaturalist",
    description:
      "Species survey, data collection, community science",
  },
  {
    month: "June",
    theme: "Summer Kickoff",
    guestOrg: "Birch Aquarium",
    description:
      "Warm water, peak conditions, beginner-friendly",
  },
  {
    month: "July",
    theme: "Leopard Shark Season",
    guestOrg: "Scripps grad student",
    description:
      "Leopard shark aggregation, shark biology, acoustic tagging",
  },
  {
    month: "August",
    theme: "The Canyon",
    guestOrg: "UCSD marine bio student",
    description:
      "Canyon geology, deep diving, upwelling dynamics",
  },
  {
    month: "September",
    theme: "Fall Blue Water",
    guestOrg: "SeaWorld Animal Rescue",
    description:
      "Best visibility, sea lion pups, giant sea bass",
  },
  {
    month: "October",
    theme: "Sea Lion Pup Season",
    guestOrg: "SD Lifeguard",
    description:
      "Sea lion biology, ocean safety, rescue demonstration",
  },
  {
    month: "November",
    theme: "Lobster Season / Night Ocean",
    guestOrg: "Local spearfisherman",
    description:
      "Sustainable harvest, regulations, night diving",
  },
  {
    month: "December",
    theme: "Winter Bioluminescence",
    guestOrg: "Scripps grad student",
    description:
      "Bioluminescence, plankton biology, night ocean",
  },
];

// ─── SEASONAL THEMES ────────────────────────────────────────────

const seasonalThemes: SeasonalTheme[] = [
  {
    month: "Summer",
    months: "Jun – Aug",
    theme: "Peak Season",
    guestOrg: "Multiple",
    description:
      "Leopard sharks. Warmest water. Best visibility. Baitballs. Peak conditions for beginners.",
    species: ["leopard sharks", "garibaldi", "bat rays", "yellowtail"],
  },
  {
    month: "Fall",
    months: "Sep – Nov",
    theme: "Blue Water",
    guestOrg: "Multiple",
    description:
      "Blue water days. Sea lion pups enter the water. Giant sea bass. Often the best diving of the year.",
    species: ["sea lions", "giant sea bass", "lobster", "octopus"],
  },
  {
    month: "Winter",
    months: "Dec – Feb",
    theme: "Night Ocean",
    guestOrg: "Multiple",
    description:
      "Squid runs. Gray whale migration. Horn shark breeding. Night ocean comes alive. Bioluminescence.",
    species: [
      "market squid",
      "gray whales",
      "horn sharks",
      "bioluminescent plankton",
    ],
  },
  {
    month: "Spring",
    months: "Mar – May",
    theme: "Upwelling",
    guestOrg: "Multiple",
    description:
      "Upwelling brings cold, crystal-clear water. Sevengill sharks. Kelp bloom. Nutrient explosion feeds the food web.",
    species: ["sevengill sharks", "kelp canopy", "nudibranchs", "bat rays"],
  },
];

// ─── HELPER FUNCTIONS ───────────────────────────────────────────

export function getAllPrograms(): Program[] {
  return programs;
}

export function getProgram(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}

export function getMonthlyEvents(): MonthlyEvent[] {
  return monthlyEvents;
}

export function getSeasonalThemes(): SeasonalTheme[] {
  return seasonalThemes;
}
