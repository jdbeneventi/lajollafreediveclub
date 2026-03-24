export type EventCategory = "course" | "camp" | "community" | "weekly" | "seasonal" | "guest";

export interface CalendarEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // ISO date or "recurring"
  endDate?: string; // for multi-day events
  time?: string;
  description: string;
  price?: string;
  spots?: string;
  href?: string;
  recurring?: "weekly" | "monthly";
  guestOrg?: string;
  seasonal?: boolean;
}

export const events: CalendarEvent[] = [
  // ─── Recurring ───
  {
    id: "saturday-session",
    title: "Saturday Group Ocean Session",
    category: "weekly",
    date: "recurring",
    time: "8:30 AM – 10:30 AM",
    description: "Weekly guided freedive at La Jolla Shores. Meet at Kellogg Park. Certified freedivers only, own gear + lanyard required.",
    price: "Free with Ocean Flow / $25 drop-in",
    recurring: "weekly",
    href: "/programs#group",
  },
  {
    id: "ocean-flow",
    title: "Ocean Flow with Lena",
    category: "weekly",
    date: "recurring",
    time: "7:00 AM – 8:15 AM",
    description: "Pre-dive yoga flow at La Jolla Shores. Mobility, intercostal opening, breath awareness, deep relaxation. Open to all levels.",
    price: "$20 drop-in",
    recurring: "weekly",
    href: "/programs",
  },

  // ─── April 2026 ───
  {
    id: "aida2-apr5",
    title: "AIDA 2 Certification",
    category: "course",
    date: "2026-04-05",
    endDate: "2026-04-06",
    time: "8:00 AM – 4:00 PM",
    description: "2-day course. Theory, pool session, open water dives at La Jolla Shores. Internationally recognized certification.",
    price: "$575 (group) / $800 (private)",
    spots: "4 spots",
    href: "/contact/courses?course=aida2",
  },
  {
    id: "aida1-apr12",
    title: "AIDA 1 — Introduction to Freediving",
    category: "course",
    date: "2026-04-12",
    time: "8:00 AM – 2:00 PM",
    description: "One-day introduction to freediving fundamentals. No experience needed.",
    price: "$200",
    spots: "6 spots",
    href: "/contact/courses?course=aida1",
  },
  {
    id: "aida2-apr19",
    title: "AIDA 2 Certification",
    category: "course",
    date: "2026-04-19",
    endDate: "2026-04-20",
    time: "8:00 AM – 4:00 PM",
    description: "2-day course. Theory, pool session, open water dives at La Jolla Shores.",
    price: "$575 (group) / $800 (private)",
    spots: "4 spots",
    href: "/contact/courses?course=aida2",
  },
  {
    id: "big-blue-night-apr25",
    title: "The Big Blue — Movie Night at the Beach",
    category: "community",
    date: "2026-04-25",
    time: "6:30 PM – 10:00 PM",
    description: "Free outdoor screening of The Big Blue (1988). Sunset Ocean Flow, ORIGIN Protocol, then the film that made a generation want to freedive. Blankets, layers, snacks. Open to everyone.",
    price: "Free",
    href: "/events/big-blue-night",
  },
  {
    id: "ocean-day-apr26",
    title: "Community Ocean Day — Spring Kelp",
    category: "community",
    date: "2026-04-26",
    time: "8:30 AM – 11:30 AM",
    description: "Monthly guided ocean experience. This month: spring kelp forest exploration and species identification. Open to everyone.",
    price: "$35 / $25 subscribers",
    spots: "16 spots",
    guestOrg: "Scripps / Kelpwatch",
    href: "/contact/courses",
  },
  {
    id: "aida1-apr26",
    title: "AIDA 1 — Introduction",
    category: "course",
    date: "2026-04-26",
    time: "8:00 AM – 2:00 PM",
    description: "One-day intro to freediving fundamentals. No experience needed.",
    price: "$200",
    spots: "6 spots",
    href: "/contact/courses?course=aida1",
  },

  // ─── May 2026 ───
  {
    id: "aida3-may3",
    title: "AIDA 3 — Advanced Freediver",
    category: "course",
    date: "2026-05-03",
    endDate: "2026-05-04",
    time: "8:00 AM – 4:00 PM",
    description: "Advanced certification. Must hold AIDA 2. Deep training in the canyon.",
    price: "$700 (group) / $950 (private)",
    spots: "3 spots",
    href: "/contact/courses?course=aida3",
  },
  {
    id: "aida2-may17",
    title: "AIDA 2 Certification",
    category: "course",
    date: "2026-05-17",
    endDate: "2026-05-18",
    time: "8:00 AM – 4:00 PM",
    description: "2-day course. Theory, pool session, open water dives at La Jolla Shores.",
    price: "$575 (group) / $800 (private)",
    spots: "4 spots",
    href: "/contact/courses?course=aida2",
  },
  {
    id: "ocean-day-may24",
    title: "Community Ocean Day — Citizen Science",
    category: "community",
    date: "2026-05-24",
    time: "8:30 AM – 11:30 AM",
    description: "Species survey and iNaturalist data collection. Guided snorkel in the marine reserve with species ID and community science.",
    price: "$35 / $25 subscribers",
    spots: "16 spots",
    guestOrg: "SD Natural History Museum / iNaturalist",
    href: "/contact/courses",
  },

  // ─── June 2026 ───
  {
    id: "camp-jun16",
    title: "Camp Garibaldi — Session 1",
    category: "camp",
    date: "2026-06-16",
    endDate: "2026-06-20",
    time: "8:00 AM – 12:30 PM",
    description: "Week-long ocean camp for ages 8–16. Freediving, surf survival, marine science, guest educators.",
    price: "$750 / $625 military",
    spots: "8 spots",
    href: "/camp-garibaldi",
  },
  {
    id: "ocean-day-jun28",
    title: "Community Ocean Day — Summer Kickoff",
    category: "community",
    date: "2026-06-28",
    time: "8:30 AM – 11:30 AM",
    description: "Summer kickoff! Warm water, peak conditions, beginner-friendly guided ocean experience.",
    price: "$35 / $25 subscribers",
    spots: "16 spots",
    guestOrg: "Birch Aquarium",
    href: "/contact/courses",
  },

  // ─── July 2026 ───
  {
    id: "camp-jul7",
    title: "Camp Garibaldi — Session 2",
    category: "camp",
    date: "2026-07-07",
    endDate: "2026-07-11",
    time: "8:00 AM – 12:30 PM",
    description: "Week-long ocean camp. Leopard shark season — peak aggregation at La Jolla Shores.",
    price: "$750 / $625 military",
    spots: "8 spots",
    href: "/camp-garibaldi",
  },
  {
    id: "camp-jul21",
    title: "Camp Garibaldi — Session 3",
    category: "camp",
    date: "2026-07-21",
    endDate: "2026-07-25",
    time: "8:00 AM – 12:30 PM",
    description: "Week-long ocean camp. Peak summer conditions, warmest water of the year.",
    price: "$750 / $625 military",
    spots: "8 spots",
    href: "/camp-garibaldi",
  },
  {
    id: "ocean-day-jul26",
    title: "Community Ocean Day — Leopard Sharks",
    category: "community",
    date: "2026-07-26",
    time: "8:30 AM – 11:30 AM",
    description: "Swim with the leopard shark aggregation at La Jolla Shores. Peak season for this iconic species.",
    price: "$35 / $25 subscribers",
    spots: "16 spots",
    guestOrg: "Scripps grad student",
    href: "/contact/courses",
  },

  // ─── August 2026 ───
  {
    id: "camp-aug4",
    title: "Camp Garibaldi — Session 4",
    category: "camp",
    date: "2026-08-04",
    endDate: "2026-08-08",
    time: "8:00 AM – 12:30 PM",
    description: "Week-long ocean camp. Canyon focus — deepest diving of the summer.",
    price: "$750 / $625 military",
    spots: "8 spots",
    href: "/camp-garibaldi",
  },
  {
    id: "camp-aug18",
    title: "Camp Garibaldi — Session 5",
    category: "camp",
    date: "2026-08-18",
    endDate: "2026-08-22",
    time: "8:00 AM – 12:30 PM",
    description: "Week-long ocean camp. End-of-summer session before school starts.",
    price: "$750 / $625 military",
    spots: "8 spots",
    href: "/camp-garibaldi",
  },
  {
    id: "ocean-day-aug23",
    title: "Community Ocean Day — The Canyon",
    category: "community",
    date: "2026-08-23",
    time: "8:30 AM – 11:30 AM",
    description: "Canyon exploration — geology, upwelling dynamics, and deep-water species.",
    price: "$35 / $25 subscribers",
    spots: "16 spots",
    guestOrg: "UCSD marine bio student",
    href: "/contact/courses",
  },

  // ─── Seasonal Highlights ───
  {
    id: "leopard-sharks",
    title: "Leopard Shark Season",
    category: "seasonal",
    date: "2026-06-15",
    endDate: "2026-09-15",
    description: "Leopard sharks aggregate in knee-deep water at La Jolla Shores. Visible from the sand, swimmable on a snorkel.",
    seasonal: true,
  },
  {
    id: "whale-migration",
    title: "Gray Whale Migration",
    category: "seasonal",
    date: "2026-12-15",
    endDate: "2027-04-15",
    description: "Gray whales pass La Jolla on their annual migration. Visible from the bluffs, occasionally seen from the water.",
    seasonal: true,
  },
  {
    id: "squid-run",
    title: "Market Squid Run",
    category: "seasonal",
    date: "2026-11-01",
    endDate: "2027-02-28",
    description: "Market squid spawn in the La Jolla canyon. Night dives reveal massive aggregations.",
    seasonal: true,
  },
  {
    id: "bioluminescence",
    title: "Bioluminescence Season",
    category: "seasonal",
    date: "2026-04-01",
    endDate: "2026-10-31",
    description: "Dinoflagellate blooms create blue bioluminescence visible during night swims and from the beach.",
    seasonal: true,
  },
];

// ─── Helpers ───

export function getUpcomingEvents(limit?: number): CalendarEvent[] {
  const now = new Date().toISOString().split("T")[0];
  const upcoming = events
    .filter((e) => !e.recurring && !e.seasonal && e.date >= now)
    .sort((a, b) => a.date.localeCompare(b.date));
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getRecurringEvents(): CalendarEvent[] {
  return events.filter((e) => e.recurring);
}

export function getSeasonalHighlights(): CalendarEvent[] {
  return events.filter((e) => e.seasonal);
}

export function getEventsByCategory(category: EventCategory): CalendarEvent[] {
  return events.filter((e) => e.category === category);
}

export function getEventsByMonth(year: number, month: number): CalendarEvent[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return events.filter((e) => {
    if (e.recurring) return true;
    if (e.date.startsWith(prefix)) return true;
    // Check if a seasonal event spans this month
    if (e.seasonal && e.endDate) {
      return e.date <= `${prefix}-31` && e.endDate >= `${prefix}-01`;
    }
    return false;
  });
}

export function getAllEvents(): CalendarEvent[] {
  return events;
}

export const categoryLabels: Record<EventCategory, string> = {
  course: "Course",
  camp: "Camp",
  community: "Community",
  weekly: "Weekly",
  seasonal: "Season",
  guest: "Guest Educator",
};

export const categoryColors: Record<EventCategory, string> = {
  course: "bg-coral/15 text-coral",
  camp: "bg-sand/20 text-sand",
  community: "bg-seafoam/15 text-seafoam",
  weekly: "bg-teal/15 text-teal",
  seasonal: "bg-ocean/20 text-white/60",
  guest: "bg-sun/15 text-sun",
};
