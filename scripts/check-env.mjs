#!/usr/bin/env node
/**
 * Local environment preflight. Runs automatically before `npm run dev` via the
 * `predev` script, and can be run on its own:
 *
 *   node scripts/check-env.mjs
 *
 * It reports, loudly, when local development is wired to production systems —
 * the production Supabase project, live Stripe keys, or live email senders.
 *
 * It does NOT block. Running dev against prod is sometimes legitimate (read-only
 * debugging), and a check that blocks gets disabled. The point is that you know
 * before you start clicking, not after you have written to the real students
 * table. Pass --strict to exit non-zero instead, e.g. in CI.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(ROOT, ".env.local");
const STRICT = process.argv.includes("--strict");

const PROD_SUPABASE_REF = "bvfxmqysquthijsntbnh";

const RED = "\x1b[31m", YEL = "\x1b[33m", GRN = "\x1b[32m", DIM = "\x1b[2m", B = "\x1b[1m", R = "\x1b[0m";

if (!existsSync(ENV_PATH)) {
  console.log(`\n${YEL}${B}  No .env.local found.${R}\n`);
  console.log(`  Copy the template and fill it in:\n`);
  console.log(`      cp .env.example .env.local\n`);
  process.exit(STRICT ? 1 : 0);
}

const env = {};
for (const line of readFileSync(ENV_PATH, "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#") || !t.includes("=")) continue;
  const [k, ...rest] = t.split("=");
  env[k.trim()] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
}

const warnings = [];

// ── The production database ──────────────────────────────────────────────
if ((env.NEXT_PUBLIC_SUPABASE_URL || "").includes(PROD_SUPABASE_REF)) {
  warnings.push({
    what: "Supabase points at PRODUCTION",
    detail: `project ${PROD_SUPABASE_REF}` + (env.SUPABASE_SERVICE_ROLE_KEY ? ", with the service-role key (bypasses RLS)" : ""),
    risk: "Submitting any form locally writes real student records.",
    fix: "Create a second Supabase project, seed it from supabase/*.sql, and point NEXT_PUBLIC_SUPABASE_URL at it.",
  });
}

// ── Live Stripe ──────────────────────────────────────────────────────────
// STRIPE_MODE only affects /api/invoice. Checkout and the webhook read
// STRIPE_SECRET_KEY directly, so that is the key that actually matters.
if ((env.STRIPE_SECRET_KEY || "").startsWith("sk_live_")) {
  warnings.push({
    what: "Stripe is LIVE",
    detail: "STRIPE_SECRET_KEY is an sk_live_ key" + (env.STRIPE_MODE === "test" ? " — note STRIPE_MODE=test does NOT cover checkout, only /api/invoice" : ""),
    risk: "Completing a checkout locally creates a real Stripe session and can take a real payment.",
    fix: "Put an sk_test_ key in STRIPE_SECRET_KEY for local work.",
  });
}

// ── Live senders ─────────────────────────────────────────────────────────
if (env.RESEND_API_KEY) {
  warnings.push({
    what: "Resend is configured locally",
    detail: "RESEND_API_KEY is set",
    risk: "Triggering a send route locally emails real students and Joshua.",
    fix: "Leave RESEND_API_KEY blank unless you are specifically testing email.",
  });
}
if (env.KIT_API_KEY || env.KIT_API_SECRET) {
  warnings.push({
    what: "Kit/ConvertKit is configured locally",
    detail: "KIT_API_KEY or KIT_API_SECRET is set",
    risk: "The daily-email and saturday-blast routes schedule broadcasts to the real subscriber list.",
    fix: "Leave both blank unless you are specifically testing broadcasts.",
  });
}

// ── Report ───────────────────────────────────────────────────────────────
if (warnings.length === 0) {
  console.log(`\n${GRN}  ✓ Local environment is isolated from production.${R}\n`);
  process.exit(0);
}

const line = "─".repeat(72);
console.log(`\n${RED}${B}  ${line}${R}`);
console.log(`${RED}${B}   LOCAL DEV IS WIRED TO PRODUCTION — ${warnings.length} issue${warnings.length > 1 ? "s" : ""}${R}`);
console.log(`${RED}${B}  ${line}${R}\n`);

for (const w of warnings) {
  console.log(`  ${RED}${B}▸ ${w.what}${R}  ${DIM}${w.detail}${R}`);
  console.log(`    ${w.risk}`);
  console.log(`    ${DIM}fix: ${w.fix}${R}\n`);
}

console.log(`  ${DIM}Details in .env.example. This is a warning, not a block —${R}`);
console.log(`  ${DIM}dev will start normally. Just know what you are pointed at.${R}\n`);

process.exit(STRICT ? 1 : 0);
