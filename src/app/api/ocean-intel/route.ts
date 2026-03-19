import { NextResponse } from "next/server";

// La Jolla Cove/Shores — centered slightly offshore to bias marine results
const LAT = 32.856;
const LNG = -117.265; // offshore from La Jolla Shores
const RADIUS_KM = 5; // tight radius — La Jolla coastline only

// Marine-only species to track on iNaturalist (taxon IDs)
// Using specific species/genera rather than broad orders to avoid land animals and plants
const NOTABLE_TAXA = [
  // Sharks
  { id: 49907, name: "Leopard Shark", icon: "🦈" },
  { id: 195434, name: "Sevengill Shark", icon: "🦈" },
  { id: 49856, name: "Horn Shark", icon: "🦈" },
  { id: 49862, name: "Angel Shark", icon: "🦈" },
  { id: 49837, name: "Swell Shark", icon: "🦈" },
  { id: 47126, name: "Sharks (other)", icon: "🦈" },
  // Marine mammals
  { id: 47553, name: "Whales", icon: "🐋" },
  { id: 47549, name: "Dolphins", icon: "🐬" },
  { id: 41536, name: "California Sea Lion", icon: "🦭" },
  { id: 41537, name: "Harbor Seal", icon: "🦭" },
  // Rays
  { id: 47497, name: "Rays & Skates", icon: "🪸" },
  // Reptiles
  { id: 46560, name: "Sea Turtles", icon: "🐢" },
  // Cephalopods
  { id: 47207, name: "Octopuses", icon: "🐙" },
  { id: 47370, name: "Squid", icon: "🦑" },
  // Invertebrates
  { id: 48469, name: "Nudibranchs", icon: "🌈" },
  { id: 47459, name: "Jellyfish", icon: "🪼" },
  // Notable fish
  { id: 48310, name: "Garibaldi", icon: "🐠" },
  { id: 82671, name: "Giant Sea Bass", icon: "🐟" },
  { id: 47672, name: "Moray Eels", icon: "🐍" },
];

interface Sighting {
  source: string;
  type: string;
  icon: string;
  title: string;
  description: string;
  date: string;
  url?: string;
  image?: string;
  lat?: number;
  lng?: number;
}

// ─── iNaturalist ───
async function fetchINaturalist(): Promise<Sighting[]> {
  const sightings: Sighting[] = [];
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateStr = thirtyDaysAgo.toISOString().split("T")[0];

  for (const taxon of NOTABLE_TAXA) {
    try {
      const url = `https://api.inaturalist.org/v1/observations?lat=${LAT}&lng=${LNG}&radius=${RADIUS_KM}&taxon_id=${taxon.id}&d1=${dateStr}&order=desc&order_by=observed_on&per_page=3&quality_grade=research,needs_id`;
      const res = await fetch(url, {
        headers: { "User-Agent": "LaJollaFreediveClub/1.0 (lajollafreediveclub.com)" },
      });
      if (!res.ok) continue;
      const data = await res.json();

      for (const obs of data.results || []) {
        // Filter: only include observations that are likely marine
        // Skip if the observation is clearly on land (east of the coastline)
        const obsLng = obs.geojson?.coordinates?.[0];
        if (obsLng && obsLng > -117.245) continue; // east of shoreline = land

        const species = obs.taxon?.preferred_common_name || obs.taxon?.name || taxon.name;
        const photo = obs.photos?.[0]?.url?.replace("square", "medium");
        const place = obs.place_guess || "La Jolla";

        // Skip generic/unhelpful place names
        const placeName = place.includes("La Jolla") || place.includes("San Diego") || place.includes("Scripps") || place.includes("Pacific")
          ? place
          : `Near La Jolla`;

        sightings.push({
          source: "iNaturalist",
          type: taxon.name,
          icon: taxon.icon,
          title: `${species} spotted`,
          description: `Observed near ${placeName}`,
          date: obs.observed_on || obs.created_at?.split("T")[0] || "",
          url: `https://www.inaturalist.org/observations/${obs.id}`,
          image: photo || undefined,
          lat: obs.geojson?.coordinates?.[1],
          lng: obsLng,
        });
      }
    } catch {
      // Skip failed taxa
    }
  }

  return sightings;
}

// ─── Reddit ───
async function fetchReddit(): Promise<Sighting[]> {
  const sightings: Sighting[] = [];

  const subreddits = ["sandiego", "freediving", "scuba", "surfing"];
  const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 86400;

  for (const sub of subreddits) {
    try {
      const url = `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent("La Jolla OR Scripps whale OR shark OR bioluminescence OR \"red tide\" OR dolphin OR turtle OR seal")}&restrict_sr=on&sort=new&limit=10&t=month`;
      const res = await fetch(url, {
        headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
      });
      if (!res.ok) continue;
      const data = await res.json();

      for (const post of data?.data?.children || []) {
        const d = post.data;
        if (d.created_utc < sevenDaysAgo) continue;

        // Determine icon based on content
        const text = (d.title + " " + (d.selftext || "")).toLowerCase();
        let icon = "🌊";
        if (text.includes("whale")) icon = "🐋";
        else if (text.includes("shark")) icon = "🦈";
        else if (text.includes("bioluminescence") || text.includes("biolum")) icon = "✨";
        else if (text.includes("red tide") || text.includes("algal bloom")) icon = "🔴";
        else if (text.includes("dolphin")) icon = "🐬";
        else if (text.includes("turtle")) icon = "🐢";
        else if (text.includes("seal") || text.includes("sea lion")) icon = "🦭";
        else if (text.includes("ray")) icon = "🪸";

        sightings.push({
          source: "Reddit",
          type: "Community Report",
          icon,
          title: d.title.length > 100 ? d.title.substring(0, 100) + "..." : d.title,
          description: `Posted in r/${sub}`,
          date: new Date(d.created_utc * 1000).toISOString().split("T")[0],
          url: `https://reddit.com${d.permalink}`,
          image: d.thumbnail && d.thumbnail.startsWith("http") ? d.thumbnail : undefined,
        });
      }
    } catch {
      // Skip failed subreddits
    }
  }

  return sightings;
}

// ─── CDFW Harmful Algal Bloom ───
async function fetchHABStatus(): Promise<Sighting[]> {
  const sightings: Sighting[] = [];
  try {
    // Check for recent HAB advisories
    const res = await fetch("https://www.sccwrp.org/about/research-areas/regional-monitoring/southern-california-hab-bulletin/", {
      headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
    });
    if (res.ok) {
      const html = await res.text();
      // Look for red tide / HAB mentions near San Diego
      const hasAlert = html.toLowerCase().includes("san diego") &&
        (html.toLowerCase().includes("bloom") || html.toLowerCase().includes("red tide") || html.toLowerCase().includes("harmful algal"));
      if (hasAlert) {
        sightings.push({
          source: "CDFW/SCCWRP",
          type: "Advisory",
          icon: "🔴",
          title: "Harmful algal bloom advisory active",
          description: "HAB conditions reported in the San Diego region. Check water quality before diving.",
          date: new Date().toISOString().split("T")[0],
          url: "https://www.sccwrp.org/about/research-areas/regional-monitoring/southern-california-hab-bulletin/",
        });
      }
    }
  } catch {
    // Skip HAB check
  }
  return sightings;
}

// ─── Handler ───
export async function GET() {
  try {
    // Fetch all sources in parallel
    const [inat, reddit, hab] = await Promise.all([
      fetchINaturalist(),
      fetchReddit(),
      fetchHABStatus(),
    ]);

    // Combine and sort by date (newest first)
    const all = [...inat, ...reddit, ...hab]
      .sort((a, b) => b.date.localeCompare(a.date));

    // Deduplicate by rough title similarity
    const seen = new Set<string>();
    const unique = all.filter((s) => {
      const key = s.title.toLowerCase().substring(0, 40);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({
      sightings: unique.slice(0, 30),
      sources: {
        inaturalist: inat.length,
        reddit: reddit.length,
        hab: hab.length,
      },
      updated: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch ocean intel" },
      { status: 500 }
    );
  }
}
