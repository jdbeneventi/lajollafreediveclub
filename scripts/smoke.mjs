#!/usr/bin/env node
/**
 * LJFC smoke tests — zero dependencies, read-only.
 *
 *   node scripts/smoke.mjs                          # against production
 *   node scripts/smoke.mjs http://localhost:3000    # against local dev
 *   node scripts/smoke.mjs --json                   # machine-readable output
 *
 * Run it before a change to capture the baseline, then after to diff.
 *
 * SAFETY: every request is a GET to a read-only or unauthenticated endpoint.
 * Nothing here sends email, writes to the database, or triggers a cron job.
 * The cron checks deliberately omit the secret so the route 401s before doing
 * any work.
 *
 * Three outcomes per check:
 *   PASS   working as expected
 *   FAIL   broken — exits non-zero
 *   KNOWN  a documented pre-existing bug (see KNOWN_ISSUES below). Does not
 *          fail the run, but is listed loudly. If a KNOWN check starts
 *          passing, the run says so — delete the flag at that point.
 */

const args = process.argv.slice(2);
const JSON_OUT = args.includes("--json");
const BASE = (args.find((a) => a.startsWith("http")) || "https://www.lajollafreediveclub.com").replace(/\/$/, "");
const TIMEOUT_MS = 30_000;

/** Pre-existing bugs. Keyed by check id. Remove an entry once it's fixed. */
const KNOWN_ISSUES = {
  // The six build-time-frozen data routes were fixed and deployed 2026-08-13
  // (commits 2dca4ed, 40683e3) and verified fresh in production, so their
  // entries are gone. The freshness assertions above stay — they are what
  // would catch a regression.

  "gate:/api/admin/students":
    "Admin API accepts the hardcoded fallback key 'ljfc', which ships in the public JS bundle.",
  "gate:/api/admin/onboarding": "Same hardcoded 'ljfc' fallback key — exposes medical and emergency-contact data.",
  "gate:/api/admin/inquiries": "Same hardcoded 'ljfc' fallback key.",
  "gate:/api/admin/gear": "Same hardcoded 'ljfc' fallback key.",
};

const results = [];
const record = (id, label, ok, detail) => {
  const known = KNOWN_ISSUES[id];
  const status = ok ? (known ? "FIXED" : "PASS") : known ? "KNOWN" : "FAIL";
  results.push({ id, label, status, detail, known });
};

async function get(path, { redirect = "follow" } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(BASE + path, { redirect, signal: ctrl.signal });
    const body = await res.text();
    return { status: res.status, body, headers: res.headers };
  } finally {
    clearTimeout(timer);
  }
}

// ─────────────────────────────────────────────────────────────────────
// 1. Pages — must return 200 and actually contain their content.
//    A page that 200s with an empty shell is still broken.
// ─────────────────────────────────────────────────────────────────────
const PAGES = [
  ["/", "La Jolla Freedive Club"],
  ["/programs", "AIDA"],
  ["/conditions", "Conditions"],
  ["/tides", "Tide"],
  ["/map", "Field Guide"],
  ["/blog", "Journal"],
  ["/camp-garibaldi", "Camp Garibaldi"],
  ["/about", "Joshua"],
  ["/contact/courses", "Course"],
  ["/booking", "Book"],
  ["/waiver", "Waiver"],
  ["/gear", "Gear"],
  ["/calendar", "Calendar"],
  ["/saturday-sessions", "Saturday"],
  ["/portal", "portal"],
  ["/policies", "Policies"],
];

async function checkPages() {
  for (const [path, marker] of PAGES) {
    const id = `page:${path}`;
    try {
      const { status, body } = await get(path);
      if (status !== 200) record(id, `GET ${path}`, false, `expected 200, got ${status}`);
      else if (body.length < 1000) record(id, `GET ${path}`, false, `suspiciously small body (${body.length}B)`);
      else if (!body.toLowerCase().includes(marker.toLowerCase()))
        record(id, `GET ${path}`, false, `200 but missing expected content "${marker}"`);
      else record(id, `GET ${path}`, true, `200 · ${(body.length / 1024).toFixed(0)}KB`);
    } catch (e) {
      record(id, `GET ${path}`, false, e.message);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────
// 2. Data APIs — shape and plausibility, not just status.
//    These aggregate external feeds (NOAA/NDBC/NWS), so the realistic
//    failure is "200 with wrong or stale data", not "500".
// ─────────────────────────────────────────────────────────────────────
const APIS = [
  {
    path: "/api/conditions",
    required: ["waveHeight", "waterTemp", "updated"],
    sane: (d) => {
      if (typeof d.waterTemp === "number" && (d.waterTemp < 45 || d.waterTemp > 85))
        return `waterTemp ${d.waterTemp}F outside plausible La Jolla range 45-85`;
      if (typeof d.waveHeight === "number" && (d.waveHeight < 0 || d.waveHeight > 30))
        return `waveHeight ${d.waveHeight}ft implausible`;
      return null;
    },
    maxAgeHours: 3,
  },
  {
    path: "/api/watertemp",
    required: ["water_temp", "temp_source", "tides"],
    sane: (d) => {
      if (d.water_temp < 45 || d.water_temp > 85) return `water_temp ${d.water_temp}F implausible`;
      if (!Array.isArray(d.tides) || d.tides.length === 0) return "tides array empty";
      return null;
    },
    maxAgeHours: 3,
  },
  {
    path: "/api/tides",
    required: ["days", "station"],
    sane: (d) => {
      if (!Array.isArray(d.days) || d.days.length < 7) return `expected 7 days, got ${d.days?.length}`;
      // Compare in Pacific, not UTC — the site is La Jolla-local, so a UTC
      // "today" is a day ahead every evening after 5pm PT and fails falsely.
      const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
      if (d.days[0]?.date < today) return `first day ${d.days[0].date} is in the past (today ${today} PT)`;
      return null;
    },
    maxAgeHours: 24,
  },
  {
    path: "/api/almanac",
    required: ["moon", "seasonal"],
    sane: (d) => (d.moon?.phase ? null : "moon.phase missing"),
    maxAgeHours: 48,
  },
  { path: "/api/forecast", required: [], maxAgeHours: 24 },
  { path: "/api/visibility", required: ["grade", "summary"], maxAgeHours: 2 },
  { path: "/api/water-quality", required: ["status", "alerts"], maxAgeHours: 2 },
  { path: "/api/ocean-intel", required: ["sightings"], maxAgeHours: 6 },
  // This one reports its timestamp as lastUpdated rather than updated.
  { path: "/api/local-intel", required: ["alerts"], maxAgeHours: 6, timestampKey: "lastUpdated" },
];

async function checkApis() {
  for (const api of APIS) {
    const idBase = api.path;
    let data;
    try {
      const { status, body } = await get(api.path);
      if (status !== 200) {
        record(`api:${idBase}`, `GET ${api.path}`, false, `expected 200, got ${status}`);
        continue;
      }
      data = JSON.parse(body);
    } catch (e) {
      record(`api:${idBase}`, `GET ${api.path}`, false, `not valid JSON — ${e.message}`);
      continue;
    }

    const missing = (api.required || []).filter((k) => !(k in data));
    if (missing.length) record(`api:${idBase}`, `GET ${api.path}`, false, `missing keys: ${missing.join(", ")}`);
    else {
      const problem = api.sane?.(data);
      if (problem) record(`api:${idBase}`, `GET ${api.path}`, false, problem);
      else record(`api:${idBase}`, `GET ${api.path}`, true, "200 · shape + ranges ok");
    }

    // Freshness — catches build-time-frozen routes, which look healthy otherwise.
    const stamp = data[api.timestampKey || "updated"];
    if (api.maxAgeHours && stamp) {
      const ageH = (Date.now() - new Date(stamp).getTime()) / 3_600_000;
      const fresh = ageH <= api.maxAgeHours;
      record(
        `fresh:${idBase}`,
        `FRESH ${api.path}`,
        fresh,
        `data is ${ageH < 48 ? `${ageH.toFixed(1)}h` : `${(ageH / 24).toFixed(0)} days`} old (limit ${api.maxAgeHours}h)`
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────
// 3. Auth gates — these must reject. Regression guard: once the shared
//    'ljfc' fallback is removed, these flip to PASS and stay that way.
// ─────────────────────────────────────────────────────────────────────
const ADMIN = ["/api/admin/students", "/api/admin/onboarding", "/api/admin/inquiries", "/api/admin/gear"];
const CRONS = ["/api/daily-email", "/api/inquiry-digest", "/api/course-briefing", "/api/friday-reminder", "/api/course-reminder"];

async function checkGates() {
  for (const path of ADMIN) {
    // No key at all — must always 401.
    try {
      const { status } = await get(path);
      record(`noauth:${path}`, `GET ${path} (no key)`, status === 401, `expected 401, got ${status}`);
    } catch (e) {
      record(`noauth:${path}`, `GET ${path} (no key)`, false, e.message);
    }
    // The hardcoded fallback — should also be rejected once fixed.
    try {
      const { status } = await get(`${path}?key=ljfc`);
      record(`gate:${path}`, `GET ${path}?key=ljfc`, status === 401, `expected 401, got ${status} — data is exposed`);
    } catch (e) {
      record(`gate:${path}`, `GET ${path}?key=ljfc`, false, e.message);
    }
  }

  // Cron endpoints must refuse an unauthenticated caller. No secret is sent,
  // so they reject before sending any email.
  for (const path of CRONS) {
    try {
      const { status } = await get(path);
      record(`cron:${path}`, `GET ${path} (no secret)`, status === 401, `expected 401, got ${status}`);
    } catch (e) {
      record(`cron:${path}`, `GET ${path} (no secret)`, false, e.message);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────
// 4. Apex → www redirect (only meaningful against production).
// ─────────────────────────────────────────────────────────────────────
async function checkRedirect() {
  if (!BASE.includes("lajollafreediveclub.com")) return;
  try {
    const res = await fetch("https://lajollafreediveclub.com/", { redirect: "manual" });
    const loc = res.headers.get("location") || "";
    record("redirect:apex", "apex → www redirect", [301, 307, 308].includes(res.status) && loc.includes("www."), `${res.status} → ${loc || "(none)"}`);
  } catch (e) {
    record("redirect:apex", "apex → www redirect", false, e.message);
  }
}

// ─────────────────────────────────────────────────────────────────────

const t0 = Date.now();
if (!JSON_OUT) console.log(`\nLJFC smoke tests → ${BASE}\n`);

await checkPages();
await checkApis();
await checkGates();
await checkRedirect();

const counts = results.reduce((a, r) => ({ ...a, [r.status]: (a[r.status] || 0) + 1 }), {});
const failed = results.filter((r) => r.status === "FAIL");
const known = results.filter((r) => r.status === "KNOWN");
const fixed = results.filter((r) => r.status === "FIXED");
const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

if (JSON_OUT) {
  console.log(JSON.stringify({ base: BASE, ranAt: new Date().toISOString(), elapsed: +elapsed, counts, results }, null, 2));
} else {
  const icon = { PASS: "  ok  ", FAIL: " FAIL ", KNOWN: " known", FIXED: " FIXED" };
  for (const r of results) {
    if (r.status === "PASS") console.log(`${icon[r.status]} ${r.label}`);
    else console.log(`${icon[r.status]} ${r.label}\n         ${r.detail}`);
  }
  console.log(`\n${counts.PASS || 0} passed · ${failed.length} failed · ${known.length} known issues · ${elapsed}s`);

  if (known.length) {
    console.log("\nKnown issues (pre-existing, not caused by this change):");
    for (const r of known) console.log(`  · ${r.label}\n    ${r.known}`);
  }
  if (fixed.length) {
    console.log("\nFIXED — these were known issues and now pass. Remove them from KNOWN_ISSUES:");
    for (const r of fixed) console.log(`  · ${r.id}`);
  }
  if (failed.length) console.log(`\n${failed.length} unexpected failure(s) — investigate before deploying.`);
}

process.exit(failed.length > 0 ? 1 : 0);
