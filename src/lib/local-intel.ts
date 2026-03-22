// Local Intel — scrapes multiple sources for anything affecting La Jolla Shores divers

const UA = "LaJollaFreediveClub/1.0";

interface RawItem {
  title: string;
  source: string;
  url: string;
}

export interface LocalAlert {
  title: string;
  severity: "info" | "warning" | "critical";
  category: "road" | "parking" | "water_quality" | "weather" | "event" | "wildlife" | "safety";
  summary: string;
  source: string;
  url: string;
}

export interface LocalIntelResult {
  alerts: LocalAlert[];
  waterQuality: { advisories: number; closures: number; warnings: number };
  persistentAdvisories: { beach: string; status: string; since: string }[];
  lastUpdated: string;
  sourcesChecked: number;
}

const PERSISTENT_ADVISORIES = [
  { beach: "Children's Pool", status: "advisory", since: "1997" },
  { beach: "La Jolla Cove", status: "advisory", since: "Jan 2026" },
];

// ─── Source: lajolla.ca ───
async function scrapeLaJollaCa(): Promise<RawItem[]> {
  const items: RawItem[] = [];
  try {
    const res = await fetch("https://lajolla.ca/news/local-impact/", { headers: { "User-Agent": UA } });
    if (!res.ok) return items;
    const html = await res.text();

    // Extract headline links: <a href="...">Title</a> patterns within article/post elements
    const linkPattern = /<a[^>]+href="(https:\/\/lajolla\.ca\/[^"]+)"[^>]*>([^<]+)<\/a>/gi;
    let match;
    while ((match = linkPattern.exec(html)) !== null) {
      const url = match[1];
      const title = match[2].trim();
      if (title.length > 15 && title.length < 200 && !url.includes("/author/") && !url.includes("/category/")) {
        items.push({ title, source: "lajolla.ca", url });
      }
    }
  } catch {}
  return items.slice(0, 20);
}

// ─── Source: Reddit ───
async function scrapeReddit(): Promise<RawItem[]> {
  const items: RawItem[] = [];
  const subs = ["sandiego", "surfing", "freediving"];
  const query = encodeURIComponent("la jolla OR kellogg park OR la jolla shores OR scripps pier");

  for (const sub of subs) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/search.json?q=${query}&sort=new&t=week&limit=10&restrict_sr=on`,
        { headers: { "User-Agent": UA } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      for (const post of data?.data?.children || []) {
        const d = post.data;
        items.push({
          title: d.title,
          source: `r/${sub}`,
          url: `https://reddit.com${d.permalink}`,
        });
      }
    } catch {}
  }
  return items.slice(0, 15);
}

// ─── Source: NWS Active Alerts ───
async function scrapeNWSAlerts(): Promise<LocalAlert[]> {
  const alerts: LocalAlert[] = [];
  try {
    const res = await fetch("https://api.weather.gov/alerts/active?point=32.8568,-117.2555", {
      headers: { "User-Agent": UA, Accept: "application/geo+json" },
    });
    if (!res.ok) return alerts;
    const data = await res.json();

    for (const feature of data?.features || []) {
      const props = feature.properties;
      if (!props?.headline) continue;

      const event = (props.event || "").toLowerCase();
      let severity: LocalAlert["severity"] = "info";
      if (event.includes("warning") || event.includes("high surf")) severity = "warning";
      if (event.includes("extreme") || event.includes("tornado") || event.includes("tsunami")) severity = "critical";

      alerts.push({
        title: props.headline,
        severity,
        category: "weather",
        summary: props.description?.split("\n")[0]?.substring(0, 150) || props.headline,
        source: "NWS",
        url: props["@id"] || "https://weather.gov",
      });
    }
  } catch {}
  return alerts;
}

// ─── Source: sdbeachinfo.com ───
async function scrapeSDBeachInfo(): Promise<{ advisories: number; closures: number; warnings: number }> {
  try {
    const res = await fetch("https://www.sdbeachinfo.com/", { headers: { "User-Agent": UA } });
    if (!res.ok) return { advisories: 0, closures: 0, warnings: 0 };
    const html = await res.text();
    const am = html.match(/Advisories\s*\((\d+)\)/i);
    const cm = html.match(/Closures\s*\((\d+)\)/i);
    const wm = html.match(/Warnings\s*\((\d+)\)/i);
    return {
      advisories: am ? parseInt(am[1]) : 0,
      closures: cm ? parseInt(cm[1]) : 0,
      warnings: wm ? parseInt(wm[1]) : 0,
    };
  } catch {
    return { advisories: 0, closures: 0, warnings: 0 };
  }
}

// ─── Anthropic AI Filter ───
async function filterWithAI(rawItems: RawItem[]): Promise<LocalAlert[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || rawItems.length === 0) return [];

  const itemList = rawItems.map((item, i) => `${i + 1}. [${item.source}] ${item.title} — ${item.url}`).join("\n");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: `You are a local conditions assistant for La Jolla Freedive Club. Divers meet at Kellogg Park, La Jolla Shores every Saturday morning at 7am.

From the following news items, identify ONLY items that would directly affect a freediver going to La Jolla Shores. This includes:
- Road closures or construction on La Jolla Shores Dr, Torrey Pines Rd, or I-5 La Jolla exits
- Parking restrictions at Kellogg Park or La Jolla Shores
- Water quality advisories for La Jolla Shores, La Jolla Cove, or nearby beaches
- Weather hazards (fog, high surf, wind)
- Special events affecting beach access or parking (marathons, triathlons, surf contests, filming)
- Shark sightings near La Jolla
- Beach closures or safety concerns

Ignore: general San Diego news, real estate, restaurant openings, politics, crime not near the beach, general interest stories.

Items:
${itemList}

Return ONLY a JSON array of relevant items. Each item: {"title": string, "severity": "info" | "warning" | "critical", "category": "road" | "parking" | "water_quality" | "weather" | "event" | "wildlife" | "safety", "summary": string (one sentence), "source": string, "url": string}

If nothing is relevant, return []. Return ONLY the JSON array, no other text.`,
        }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) return [];
    const data = await res.json();
    const text = data?.content?.[0]?.text || "[]";

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item: LocalAlert) =>
      item.title && item.severity && item.category && item.summary && item.source && item.url
    );
  } catch {
    return [];
  }
}

// ─── Main Function ───
export async function getLocalIntel(): Promise<LocalIntelResult> {
  let sourcesChecked = 0;

  // Fetch all sources in parallel
  const [laJollaNews, redditItems, nwsAlerts, waterQuality] = await Promise.all([
    scrapeLaJollaCa().then((r) => { sourcesChecked++; return r; }),
    scrapeReddit().then((r) => { sourcesChecked++; return r; }),
    scrapeNWSAlerts().then((r) => { sourcesChecked++; return r; }),
    scrapeSDBeachInfo().then((r) => { sourcesChecked++; return r; }),
  ]);

  // Combine raw items for AI filtering
  const rawItems: RawItem[] = [...laJollaNews, ...redditItems];

  // Filter with AI (NWS alerts are already filtered by location)
  const aiAlerts = await filterWithAI(rawItems);

  // Combine AI-filtered alerts with NWS alerts
  const allAlerts = [...nwsAlerts, ...aiAlerts];

  // Deduplicate by title similarity
  const seen = new Set<string>();
  const unique = allAlerts.filter((a) => {
    const key = a.title.toLowerCase().substring(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort: critical first, then warning, then info
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  unique.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    alerts: unique.slice(0, 10),
    waterQuality,
    persistentAdvisories: PERSISTENT_ADVISORIES,
    lastUpdated: new Date().toISOString(),
    sourcesChecked,
  };
}
