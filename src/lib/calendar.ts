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
    id: "aida1-wednesday",
    title: "AIDA 1 — Discover Freediving",
    category: "course",
    date: "recurring",
    time: "Wednesdays · 8:00 AM – 1:00 PM",
    description: "Half-day introduction to freediving. Theory, pool session, and your first breath-hold. No experience needed. La Jolla.",
    price: "$200",
    recurring: "weekly",
    href: "/contact/courses?course=aida1",
  },
  {
    id: "saturday-session",
    title: "Saturday Sessions",
    category: "weekly",
    date: "recurring",
    time: "Saturdays · 7:00 AM – 10:00 AM",
    description: "Ocean Flow yoga (7–7:45), dry training (7:45–8:15), and line diving (8:30–10). Meet at Kellogg Park, La Jolla Shores. All certified divers welcome.",
    recurring: "weekly",
    href: "/saturday-sessions",
  },

  // ─── April 2026 ───
  {
    id: "aida1-apr15",
    title: "AIDA 1 — Discover Freediving",
    category: "course",
    date: "2026-04-15",
    time: "8:00 AM – 1:00 PM",
    description: "Half-day introduction to freediving. Theory, pool session, first breath-hold. No experience needed.",
    price: "$200",
    spots: "6 spots",
    href: "/contact/courses?course=aida1",
  },
  {
    id: "big-blue-night-apr25",
    title: "The Big Blue — Movie Night at the Beach",
    category: "community",
    date: "2026-04-25",
    time: "6:30 PM – 10:00 PM",
    description: "Free outdoor screening of The Big Blue (1988). Sunset Ocean Flow, breathing drills, then the film that made a generation want to freedive. Blankets, layers, snacks. Open to everyone.",
    price: "Free",
    href: "/events/big-blue-night",
  },
  {
    id: "aida1-apr29",
    title: "AIDA 1 — Discover Freediving",
    category: "course",
    date: "2026-04-29",
    time: "8:00 AM – 1:00 PM",
    description: "Half-day introduction to freediving. Theory, pool session, first breath-hold. No experience needed.",
    price: "$200",
    spots: "6 spots",
    href: "/contact/courses?course=aida1",
  },

  // ─── May 2026 ───
  {
    id: "aida1-may13",
    title: "AIDA 1 — Discover Freediving",
    category: "course",
    date: "2026-05-13",
    time: "8:00 AM – 1:00 PM",
    description: "Half-day introduction to freediving. No experience needed.",
    price: "$200",
    spots: "6 spots",
    href: "/contact/courses?course=aida1",
  },
  {
    id: "aida1-may20",
    title: "AIDA 1 — Discover Freediving",
    category: "course",
    date: "2026-05-20",
    time: "8:00 AM – 1:00 PM",
    description: "Half-day introduction to freediving. No experience needed.",
    price: "$200",
    spots: "6 spots",
    href: "/contact/courses?course=aida1",
  },
  {
    id: "aida1-may27",
    title: "AIDA 1 — Discover Freediving",
    category: "course",
    date: "2026-05-27",
    time: "8:00 AM – 1:00 PM",
    description: "Half-day introduction to freediving. No experience needed.",
    price: "$200",
    spots: "6 spots",
    href: "/contact/courses?course=aida1",
  },
  {
    id: "aida2-may29",
    title: "AIDA 2 Certification",
    category: "course",
    date: "2026-05-29",
    endDate: "2026-05-31",
    time: "8:00 AM – 4:00 PM",
    description: "3-day course. Theory, pool session, open water dives at La Jolla Shores. Internationally recognized certification.",
    price: "$575 (group) / $800 (private)",
    spots: "4 spots",
    href: "/contact/courses?course=aida2",
  },

  // ─── June 2026 ───
  {
    id: "aida1-jun10",
    title: "AIDA 1 — Discover Freediving",
    category: "course",
    date: "2026-06-10",
    time: "8:00 AM – 1:00 PM",
    description: "Half-day introduction to freediving. No experience needed.",
    price: "$200",
    spots: "6 spots",
    href: "/contact/courses?course=aida1",
  },
  {
    id: "camp-jun15",
    title: "Camp Garibaldi — Session I",
    category: "camp",
    date: "2026-06-15",
    endDate: "2026-06-17",
    time: "9:00 AM – 3:00 PM",
    description: "3-day ocean camp for ages 8–14. Freediving, surf survival, marine science at La Jolla Shores.",
    price: "$450",
    spots: "8 spots",
    href: "/camp-garibaldi/register?session=june",
  },
  {
    id: "aida2-jun19",
    title: "AIDA 2 Certification",
    category: "course",
    date: "2026-06-19",
    endDate: "2026-06-21",
    time: "8:00 AM – 4:00 PM",
    description: "3-day course. Theory, pool session, open water dives at La Jolla Shores.",
    price: "$575 (group) / $800 (private)",
    spots: "4 spots",
    href: "/contact/courses?course=aida2",
  },

  // ─── July 2026 ───
  {
    id: "aida2-jul10",
    title: "AIDA 2 Certification",
    category: "course",
    date: "2026-07-10",
    endDate: "2026-07-12",
    time: "8:00 AM – 4:00 PM",
    description: "3-day course. Theory, pool session, open water dives at La Jolla Shores.",
    price: "$575 (group) / $800 (private)",
    spots: "3 spots",
    href: "/contact/courses?course=aida2",
  },
  {
    id: "camp-jul13",
    title: "Camp Garibaldi — Session II",
    category: "camp",
    date: "2026-07-13",
    endDate: "2026-07-17",
    time: "9:00 AM – 3:00 PM",
    description: "5-day full week ocean camp. Peak season — leopard sharks, warm water, best conditions of the year.",
    price: "$750",
    spots: "8 spots",
    href: "/camp-garibaldi/register?session=july",
  },

  // ─── August 2026 ───
  {
    id: "camp-aug10",
    title: "Camp Garibaldi — Session III",
    category: "camp",
    date: "2026-08-10",
    endDate: "2026-08-12",
    time: "9:00 AM – 3:00 PM",
    description: "3-day ocean camp. End-of-summer session before school starts.",
    price: "$450",
    spots: "8 spots",
    href: "/camp-garibaldi/register?session=august",
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
