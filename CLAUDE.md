# CLAUDE.md — La Jolla Freedive Club

> Last verified against the codebase and production: **2026-08-17**, on Next.js 16.
> Always `git fetch` before trusting the local checkout — it was 4 days stale when this was written.
> When something here contradicts the code, the code wins — and fix this file.

## Project Overview
La Jolla Freedive Club (lajollafreediveclub.com) is a freediving community and AIDA certification business based in La Jolla, San Diego. Founded by Joshua Beneventi — AIDA Instructor, AIDA Youth Instructor, AIDA 4 Freediver. San Diego's only AIDA-certified freediving instructor for both adults and kids. DAN insured. Red Cross First Aid/CPR/AED certified.

Camp Garibaldi is LJFC's youth program (ages 8-16) — a week-long ocean camp teaching freediving, surf survival, and water confidence through a breath-first methodology.

The site is not a brochure. It runs the business: lead capture → inquiry pipeline → payment → student onboarding → medical/liability compliance → course-readiness scoring → certification tracking, plus a live ocean-conditions data layer and a partnership CRM. ~48k lines, 108 routes.

## Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS. Turbopack is the default builder for both `dev` and `build`.
- **Hosting:** Vercel (auto-deploy from GitHub on push to `main`). A failed build is NOT promoted — the previous production deployment stays live.
- **Database:** Supabase Postgres, project `bvfxmqysquthijsntbnh`. Accessed server-side only, via `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS).
- **Payments:** Stripe — card + ACH, deposit or full, `STRIPE_MODE` toggles live/test
- **Transactional email:** Resend, from `noreply@lajollafreediveclub.com` (domain verified). 19 routes send mail.
- **Broadcast email:** Kit/ConvertKit — v4 API with v3 fallback. Form ID 9207242. Tags: Daily Conditions `17696327`, Saturday Crew `17781468`.
- **AI:** Anthropic API — used for exactly one thing, reading the Scripps underwater cam to estimate visibility
- **Forms backup:** Formspree `mojknqlk` (every form also posts here)
- **Domain:** lajollafreediveclub.com (DNS on Cloudflare). Apex 307s to `www`.
- **Analytics:** GA4 `G-X0ZXTHKTKK`
- **GitHub:** github.com/jdbeneventi/lajollafreediveclub.git (private)

### Environment variables
`.env.example` is the annotated list — copy it to `.env.local` and fill in. Production values live in the Vercel dashboard; `.env.local` is gitignored and never affects the live site.

On Vercel: `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `KIT_API_KEY`, `KIT_API_SECRET`, `CRON_SECRET`, `STRIPE_WEBHOOK_SECRET`, plus everything below.
In `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_TEST_SECRET_KEY`, `STRIPE_MODE`.

`NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are set but **not referenced anywhere in `src/`** — Supabase is only ever accessed server-side with the service-role key, and checkout is a server-side redirect with no client-side Stripe.js.

## Local development

⚠️ **As shipped, `.env.local` points at the PRODUCTION Supabase project with the service-role key, and at LIVE Stripe.** Submitting a form locally writes real student records; completing a checkout locally creates a real Stripe session.

`npm run dev` runs `scripts/check-env.mjs` first (via `predev`) and prints a banner naming exactly which production systems you are wired to. It warns rather than blocks — running against prod is sometimes legitimate, and a check that blocks gets disabled. Run it any time with `npm run check-env`, or `--strict` to make it exit non-zero.

**The safe setup:** create a second Supabase project, seed it from `supabase/core-schema.sql` plus the other files in `supabase/`, and point `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` at it. Put an `sk_test_` key in `STRIPE_SECRET_KEY` — note that `STRIPE_MODE=test` is **not** sufficient, since it is read only by `/api/invoice`; `/api/checkout` and the webhook read `STRIPE_SECRET_KEY` directly.

Leave `RESEND_API_KEY`, `KIT_API_KEY` and `KIT_API_SECRET` unset locally. Without them the send routes return "not configured" instead of mailing real students — that absence is a safety feature, not an oversight.

```bash
npm run check-env    # what am I pointed at?
npm run smoke        # 50 checks against production
npm run smoke -- http://localhost:3000
```

## Data Model — 14 Supabase tables

```
students ──┬─< bookings >── calendar_events
           │        ^
           │        └──── course_inquiries.linked_booking_id
           ├─< student_onboarding      (1:1, sizing/medical/emergency contact)
           ├─< student_progress        (requirement_id per prep section + skill)
           ├─< student_certifications  (earned AIDA levels)
           └─< student_gear >── gear_catalog

aida_forms          (medical statement + liability release, signature_data, physician flags)
saturday_members / saturday_rsvps / saturday_confirmations
camp_registrations  (Camp Garibaldi, includes parent/guardian + charter school fields)
```

`students`, `bookings`, `course_inquiries`, `calendar_events`, and `aida_forms` were created in the Supabase dashboard. Reconstructed DDL lives in `supabase/core-schema.sql` — it covers columns, types, defaults, PKs and FKs, but **not** indexes, RLS policies, triggers, or CHECK constraints. The other tables have their real migrations in `supabase/`.

Inquiry lifecycle (`inquiry_status` enum): `new → replied → quoted → deposit_sent → paid → onboarded → completed`, terminal `declined` / `expired`. A Stripe payment auto-advances the matching inquiry to `paid` and links the booking.

## The student pipeline

1. `/contact/courses` → `course_inquiries`. `parseDateRange.ts` extracts a date window from free-text ("sometime mid-June?"); `inquiryConflicts.ts` finds overlapping requests and suggests grouping students into one course.
2. `/booking` → `/api/checkout` → Stripe. 50% deposit option; the 2.9% + $0.30 processing fee is added as a separate line item and passed to the student.
3. Stripe webhook → booking `confirmed`, inquiry `paid`, magic link auto-issued, receipt to student + notification to owner.
4. `/portal` — magic-link auth: 32-byte hex token in an `ljfc_session` cookie, 24h expiry, no password. **Onboarding is blocking**; dependent features show locked states until it's submitted.
5. `readiness.ts` scores each student 0-100% across six gates: onboarding · AIDA medical · physician clearance (only if flagged) · liability release · LJFC waiver · prep guide ≥80%.
6. `course-briefing` cron emails the owner a roster with readiness scores 2 days out; `course-reminder` emails the students.

## Email workflow registry

`src/lib/emailWorkflows.ts` is the canonical inventory of every email the system sends — **26 workflows** across 6 stages (Lead capture · Conversion · Forms & waivers · Onboarding & readiness · Course operations · Saturday & conditions). Each entry records trigger, route, recipients, subject template, kind (`user` / `manual` / `webhook` / `cron` / `broadcast`), the status effect on the database, and which admin view surfaces it. Browsable at `/admin/emails`.

**Read this before changing anything that sends mail** — it is more precise than grepping for `resend.emails.send`, and it records the intended side effects. Keep it in sync when adding or removing a send.

## Assessment — `docs/system-assessment.md`

Whole-system read from 2026-08-14: architecture across all five layers, the load-bearing
paths with a resilience rating each, a health scorecard, every external dependency and what
happens when one fails, and a ranked list of what to do. Figures verified against the repo,
a full database export, and the live site. Start here for the shape of the thing.

## Planning docs — `docs/customer-journey/`

Prior analysis of the lead → ready-student flow. Start with **`preservation-map.md` ("Do Not Break Existing Ops")** and **`safe-improvement-plan.md`** before changing pipeline behavior. Also: `current-state-audit.md`, `operational-journey-inventory.md`, `holes-and-opportunities.md`, `ljfc-lead-to-ready-student-prd.md`, and four interactive `.html` flow maps.

## Automations — 5 Vercel crons (`vercel.json`, times are UTC)

| UTC | Local (PDT) | Endpoint | Does |
|---|---|---|---|
| `0 13 * * *` | 6:00am daily | `/api/daily-email` | Conditions report → owner, then schedules a Kit broadcast to the Daily Conditions tag |
| `0 14 * * 5` | 7:00am Fri | `/api/friday-reminder` | Nudges owner to send the Saturday go/no-go. Self-guards to Fridays. Blast stays manual. |
| `0 16 * * *` | 9:00am daily | `/api/course-briefing` | Roster + readiness for courses 2 days out → owner |
| `0 16 * * *` | 9:00am daily | `/api/course-reminder` | Prep reminder + magic link → students |
| `0 14 * * *` | 7:00am daily | `/api/inquiry-digest` | Pipeline digest: new/stale/stalled, grouping suggestions, upcoming readiness |

## Site Structure

**Public marketing** — `/` · `/programs` · `/programs/aida-2-guide` · `/camp-garibaldi` (+ `/register`, `/waiver`, `/charter-funding`) · `/about` · `/blog` (28 posts) · `/blog/[slug]` · `/blog/state-anchors` (interactive) · `/community` · `/partners/[slug]` · `/policies` · `/shop` · `/events/big-blue-night` · `/contact` (+ `/courses`, `/camp`)

**Ocean tools** — `/conditions` · `/tides` · `/map` (field guide: 10 dive sites, 8 depth zones, 50+ species; custom-built, not Mapbox) · `/gear` · `/calendar` · `/saturday-sessions` (+ `/confirm`) · `/saturday` (blast dashboard, gated)

**Student-facing** — `/booking` (+ `/success`) · `/portal` (+ `/onboarding`, `/prep/aida1`, `/prep/aida2`, `/profile`, `/verify`) · `/waiver` · `/forms/aida` · `/students` (coach portal, gated)

**Admin** (all gated) — `/admin` + `/calendar` `/courses` `/curriculum` `/economics` `/emails` `/inquiries` `/invoices` `/onboarding` `/partners` `/registrations` `/send-forms` `/send-links` `/sitemap` `/students`

**Private strategy** (noindex + server-side gate, GATE_CODE) — `/ohpc` (+ `/plan`) · `/education` (+ `/partners`) · `/science` (ORIGIN Protocol) · `/research` · `/camp-garibaldi/charter-funding`

**PWA** — `manifest.json` + `sw.js` + `/offline` fallback. Shipped.

## Data Sources
- **NDBC 46254** — Scripps Nearshore Waverider Buoy (realtime text file — most reliable for wave/temp)
- **NDBC LJPC1/LJAC1** — Scripps Pier wind speed, direction, gusts (RSS feeds)
- **NOAA CO-OPS 9410230** — La Jolla tide predictions (JSON API)
- **HDOnTap** — Scripps Pier underwater cam thumbnail for AI visibility analysis
- **NWS FZUS56.KSGX** — Marine forecast for PZZ740 inner coastal zone
- **iNaturalist API** — Marine species observations near La Jolla (5km radius, marine-only filter)
- **Reddit JSON API** — r/sandiego, r/freediving, r/scuba, r/surfing for sighting reports

⚠️ **Route-handler caching gotcha.** A route handler with no `fetch()` call is statically prerendered at build time and never revalidates. `/api/conditions` and `/api/watertemp` stay fresh only because their fetches use `next: { revalidate: 600 }`. Any new data route needs an explicit `export const revalidate = N` (or a revalidating fetch), or it will silently freeze on build day.

## Brand — Direction A (Deep Water Editorial)
**Colors (in tailwind.config.ts):** Midnight/deep `#0B1D2C` · Deep/ocean `#163B4E` · Kelp/teal `#1B6B6B` · Seafoam `#3db8a4` · Driftwood/sand `#D4A574` · Salt/foam `#FAF3EC` · Ember/coral `#C75B3A` · Sun `#f0b429` · Slate `#3A4A56`

**Typography:** Instrument Serif (display) + DM Sans (body)

**Design direction:** Editorial Oceanic — Patagonia catalog meets Monocle magazine. Grain textures, asymmetric layouts, atmospheric depth, intentional restraint. Use the frontend-design skill for all UI work.

**Voice:** Athletic, grounded, editorial. NOT wellness culture. Use "breathing drills" not "breathwork." Use "stretching & breathing exercises" not "yoga." The philosophy is real but framed through athletic training language. "The ocean camp that starts from the inside out."

## Pricing (Finalized)
| Program | Price | Notes |
|---|---|---|
| Discover Freediving (AIDA 1) | $200 | Half day |
| AIDA 2 (group, max 4) | $575 | 2-3 days, cert included |
| AIDA 2 (private, 1-on-1) | $800 | Flexible schedule |
| AIDA 3 (group, max 4) | $700 | 3-4 days, AIDA 2 prereq |
| AIDA 3 (private) | $950 | Flexible schedule |
| Private coaching (2-3 hrs) | $150 | Certified freedivers only |
| Saturday ocean session | Free w/ Ocean Flow / $25 drop-in | Cert + own gear + lanyard + computer required |
| Ocean Flow with Lena | $20 drop-in | Open to anyone |
| Camp Garibaldi (5-day) | $750 | Ages 8-16, gear provided |

Checkout also offers `camp-3day` at $450. Competitor reference: JGW beginner $495, intermediate $550, private $1900 (up to 4). Depth Wish AIDA 2 $700. Focus Freedive FII L1 $525-685.

## LJFC Mooring Line
**32.856746, -117.262603** — Canyon edge, ~35-40ft depth, ~500m offshore from Kellogg Park

## Saturday Session Requirements
- Valid freediving certification (any agency)
- Must bring: wetsuit, fins, mask, snorkel, weight belt, lanyard
- LJFC provides: buoys, lines, session leadership
- Signed waiver required (digital at /waiver)
- Not a class — no coaching unless pre-arranged via private coaching signup
- Participants responsible for own safety and buddy's

## Waiver System
- Digital waiver at `/waiver` — 3-step (personal info → medical questionnaire → review & sign), canvas signature
- Server generates the PDF with jsPDF (full text + signature image + timestamp)
- Emails via Resend to both owner and signer; logs to Supabase + Google Sheet + Formspree
- AIDA courses require the additional AIDA forms in `/public/documents/`

## Documents (in public/documents/)
`aida-liability-release.pdf` · `aida-medical-statement.pdf` · `aida1/2/3-guidelines.pdf` · `ljfc-waiver.pdf` + `.md` · `LJFC-AIDA2-Course-Guide.pdf`

## Joshua's Credentials
- AIDA Instructor · AIDA Youth Instructor · AIDA 4 Freediver
- DAN Insured (ID# 3339867, valid through Sept 2026, Policy DAN9477420) — hotline +1-919-684-9111
- American Red Cross Adult & Pediatric First Aid/CPR/AED (Cert 022T2IJ, valid through Sept 2027)
- AIDA profile: https://www.aidainternational.org/InstructorProfile/858dbbd9-9e54-4235-abf8-e0a035ccd077

## Joshua's Background
- Family from Pico, Azores (grandmother's side). Great-grandfather whaler, settled in SD for tuna fishing. Grandfather freedived for abalone in La Jolla.
- Grew up Point Loma / Ocean Beach, 4 blocks from water. Spearfishing, longboarding, Sunset Cliffs.
- Trained: Stella Abbas (Freedive Tioman, Malaysia) → Pieter Van Veen (AIDA 3, Dahab) → Harry Chamas (Freedive Passion, La Ventana) → Khaled El Gammal (AIDA 4 + Instructor + Youth Instructor, Dahab)
- First freediving club in the USA was founded in La Jolla in 1939.
- Substack: joshuabeneventi.substack.com

## Community
- **Lena** — RYT yoga teacher, freediver, artist. "Ocean Flow" Saturday 7am at La Jolla Shores.
- **Brooke** — Apnea Collective / Molchanovs coach

## Workflow

```bash
git fetch origin                     # the local checkout has been stale before
git checkout -b some-change          # never commit straight to main
# ...edit...
npm run verify                       # NOT `npm run build` — see below
node scripts/smoke.mjs               # baseline against prod before you start
git push -u origin some-change       # Vercel builds a preview URL
node scripts/smoke.mjs <preview-url>  # verify the preview, not prod
# merge to main only once the preview is green
```

⚠️ **`npm run build` is not a trustworthy check on its own**, for two reasons.

TypeScript reuses `tsconfig.tsbuildinfo` between builds, and that file is gitignored — so it exists locally and never on Vercel. A local build can pass on stale incremental type info while Vercel fails on the same commit. This happened: `fix/admin-auth` built clean locally four times and failed on Vercel with `Cannot find name 'SECRET'`, then revealed a second hidden error once the cache was cleared.

And since Next 16, **`next build` no longer runs ESLint at all** — the `next lint` command was removed.

`npm run verify` covers both: it clears `.next` and `tsconfig.tsbuildinfo`, runs `eslint src`, then builds. Use it before every push.

### Lint debt carried over from the Next 16 upgrade
`eslint.config.mjs` is flat config now (`.eslintrc.json` is gone) and downgrades two rules to warnings: `react-hooks/set-state-in-effect` (15 occurrences) and `react-hooks/static-components` (2), across 8 admin files. The newer `eslint-plugin-react-hooks` promoted them to errors; they flag **pre-existing patterns**, not anything the upgrade changed. Clearing them means restructuring effects across the admin cockpit — real work with real risk, deliberately not bundled into a framework upgrade. Fix them on purpose, then promote the rules back to `"error"`.

To reproduce Vercel exactly — fresh tree, no `.env.local`, CI semantics:

```bash
git worktree add --detach /tmp/verify <commit>
cd /tmp/verify && ln -s <repo>/node_modules node_modules
CI=true npm run verify
```

`scripts/smoke.mjs` — zero-dependency, read-only. Checks 16 pages render with real content, 8 data APIs for shape + plausible ranges + **freshness**, that admin/cron endpoints reject unauthenticated callers, and the apex redirect. Pre-existing bugs are listed in its `KNOWN_ISSUES` map so they don't mask new breakage; if a known issue starts passing, the run says `FIXED` and tells you to delete the entry. Exits non-zero only on unexpected failures.

Baseline as of 2026-08-13: **44 passed, 0 failed, 4 known** (the 4 are the admin key, fixed on `fix/admin-auth`).

## Monitoring — `.github/workflows/health.yml`

Runs the smoke test hourly from GitHub Actions, plus on demand via *Actions → Health check → Run workflow* (which takes an optional URL, so you can point it at a preview deploy).

It deliberately does **not** run on Vercel: a monitor hosted on the platform it watches cannot tell you that platform is down. GitHub is infrastructure we already own, the job needs no secrets, and `scripts/smoke.mjs` has no dependencies — so the whole run is a checkout plus one `node` invocation, a few seconds of the free tier.

**Silent when healthy.** On failure GitHub emails the repo owner with a link to the run, and the job summary contains the full check output. It retries once after 90s and only alarms if both passes fail — a single slow request against the 30s timeout is enough to trip a check, and an hourly job that cries wolf is one you learn to ignore.

Not covered yet: whether the five Vercel crons actually *fired*. That needs the Vercel API or CLI, neither of which is set up. Today the workflow only proves their endpoints are deployed and correctly reject unauthenticated callers.

Backups (data + reconstructed schema + smoke baseline) live outside the repo in `~/Documents/ljfc-backups/`. They contain student PII — never commit them.

## Code Conventions
- Components in `src/components/` (Nav, Footer, Logo, EmailCapture, Reveal, ExpandableCourse, PasswordGate, ShareButtons, SaturdayBanner, HeroScene, WeekendEmailForm, ServiceWorkerRegister)
- Page-specific components colocated (e.g. ConditionsWidget, AlmanacWidget, OceanIntel, MarineLifeGuide, OnboardingFlow, PrepContent)
- Shared logic in `src/lib/` — blog, moon, seasonal, calendar, certifications, education, partners, partner-network, readiness, auth, supabase, local-intel, inquiryConflicts, parseDateRange, saturday
- Blog posts are HTML in template literals inside `src/lib/blog.ts` (3.7k lines) — not markdown files
- Tailwind color names: deep, ocean, teal, seafoam, sand, salt, coral, sun, slate, driftwood, foam
- `font-serif` for headings, `font-sans` (default) for body
- Section labels: `text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase`
- `Reveal` wraps sections for scroll animations

## Key Decisions
- **Student onboarding is REQUIRED (blocking).** Magic-link landing goes to onboarding first; the portal shows locked states on dependent features until submitted.
- **AIDA Medical Statement is UNIVERSAL** — every course level. Onboarding includes the full 11-question medical and writes to `aida_forms`; no course-level gating. `/forms/aida` keeps only the liability release + signature (per-course, legally distinct).
- Water temp: parse Celsius from the NDBC 46254 text file (WTMP column), convert to F
- Visibility: AI vision on the Scripps cam + predictive model fallback
- The daily email fetches NDBC/NOAA directly, not via our own API routes — self-calls fail on Vercel
- Ocean intel filters to longitude < -117.245 (west of shoreline = ocean)
- Homepage program cards link to `/programs` (details first), not `/contact`
- Gear is not included in courses — students bring or rent from local shops
- `/students` coach portal and the waiver log still use a Google Apps Script → Sheets backend (everything else is Supabase)
- Checkout creates the `students` row and a `pending` booking *before* Stripe confirms, so abandoned checkouts leave orphan rows — don't take raw counts off those tables

## Known Issues

### Security
- **The `"ljfc"` shared key is gone — but `ADMIN_KEY` must be set in Vercel or admin is locked.** Every admin and cron route previously accepted the literal `"ljfc"` (or `ljfc-daily-2026` / `-friday-` / `-saturday-`), which shipped in the public JS bundle; `/api/admin/students?key=ljfc` returned real student medical records. Auth now lives in `src/lib/adminAuth.ts`:
  - `requireAdmin(req)` — admin routes. Accepts the `ljfc_admin` httpOnly cookie (set by `POST /api/admin/login`), an `x-admin-key` header, or `?key=`/`?secret=` — all compared against `ADMIN_KEY` in constant time.
  - `requireCron(req)` — cron/ops routes. Accepts `CRON_SECRET`, or admin credentials.
  - **Fails closed:** with `ADMIN_KEY` unset, nothing authenticates.

  Admin pages verify the typed password via `adminLogin()` in `src/lib/adminLogin.ts` rather than comparing to a bundled constant. The `?key=${SECRET}` still present in some inter-page links is harmless — `SECRET` is now `""`, the server ignores a non-matching key and falls through to the cookie.

  **Rotating the key:** change `ADMIN_KEY` in Vercel and redeploy. Existing sessions break, because the cookie is an HMAC of the key. Note that env changes do **not** reach deployments that already exist — redeploy, or the old value stays live.

  **Login throttling.** `POST /api/admin/login` escalates the delay on each wrong password (250ms × attempts, capped at 2s) and hard-locks an IP after 8 failures in 15 minutes, returning 429 with `Retry-After`. A successful login clears the counter. This is in-memory per serverless instance — it catches bursts from one source and makes sustained guessing expensive, but a distributed attacker spreading guesses across cold starts would evade it. The stronger version is a shared counter in Supabase keyed on IP; deferred because it needs a new table.

  This matters in proportion to the password. The current `ADMIN_KEY` is a short themed phrase rather than a random string, chosen deliberately for memorability — the throttle is what compensates. If the key is ever shortened further, add the shared-state limiter first.

- **`/api/students` is now gated, with two access levels.** It previously had no server-side auth at all — GET with no parameters returned every student's dive logs to anyone, and POST let anyone write. The Apps Script URL it proxies is server-side only and never reaches the browser bundle, so this route is the real boundary.
  - **coach** — all logs, and writing as `author: "Coach"`. Requires `ADMIN_KEY`, the same credential as the rest of the admin surface. No separate coach code.
  - **student** — one student's own logs via `?student=<name>`, and writing as themselves. Requires `STUDENT_CODE`, sent as the `x-student-code` header.

  A student code does **not** unlock the all-logs view — that check is on the absence of the `student` parameter, so privilege separation holds. Both fail closed; with `STUDENT_CODE` unset the student role simply cannot sign in while the coach role keeps working, which is a reasonable state if only Joshua uses that page. The literals `ljfc-coach` and `ljfc` are gone from the bundle.
- **The strategy-page gate is server-side now.** The old `PasswordGate` compared against a bundled `"ljfc"` literal and only decided whether to *paint* — the full page body shipped to every visitor. The six invite-only pages (`/science`, `/ohpc`, `/ohpc/plan`, `/education`, `/research`, `/camp-garibaldi/charter-funding`) now check `gateAuthorized()` (src/lib/gate.ts) before returning content: unauthorized requests receive the gate form and nothing else. The code lives in the `GATE_CODE` env var, verified at `POST /api/gate` (throttled, case-insensitive to match the old contract) for a 30-day httpOnly cookie; an admin session opens the pages without it. Fails closed. Known, accepted leak: page `<title>`s from `metadata` exports render regardless of the gate — navigational, deliberate. The smoke suite asserts all six pages serve the gate form with zero body content to anonymous callers.

### Correctness
- **Build-time-frozen data routes — fixed on `chore/safety-net`, awaiting deploy.** Six routes had no `revalidate` and no revalidating `fetch()`, so Next prerendered them on build day and served that body forever. As of 2026-08-13 production had been serving **June 13** data for 61 days across `/api/almanac` (wrong moon phase, "next full moon" seven weeks past), `/api/visibility` (stale vis grade), `/api/water-quality` (stale beach advisories and closures — safety-relevant), `/api/ocean-intel`, `/api/local-intel`, and `/api/conditions-card`. Each now declares a `revalidate` matching the `s-maxage` it already set. Verify with `.next/prerender-manifest.json` — every `/api/*` entry should show a number, never `false`. The daily conditions email was never affected: it calls `getLocalIntel()` from the lib directly and deliberately skips `/api/visibility`.
- Waiver PDF archiving to Google Drive — Sheet logging works, PDF upload fails on large payloads. The Apps Script side is **fully built**: it decodes `pdfBase64`, files it in a Drive folder named "LJFC Waivers", and writes the file URL back to column 7 of the row. So this is a payload-size problem, not a missing feature. Contract documented in `scripts/apps-script/README.md`.

### Infrastructure not in this repo
**Two Google Apps Script projects back `/api/waiver` and `/api/students`, and their source is not in version control** — no history, no backup, nothing to restore from. For the waiver log, a legal record, this is the largest single gap in the system. IDs, contracts, and the `clasp` commands to pull exact copies are in `scripts/apps-script/README.md`. Do not transcribe them by hand.
- `~/Documents/Claude/Scheduled/ljfc-inquiry-digest/SKILL.md` is a dead duplicate of the inquiry-digest cron — not registered in the scheduler, never runs

### Infrastructure
- No tests beyond `scripts/smoke.mjs`. No CI. Vercel's build gate is the only automatic check on push.
- No verified database backup policy — confirm the Supabase plan's retention. Manual snapshot procedure in `~/Documents/ljfc-backups/`.
- Vercel CLI not installed and the project isn't linked locally, so `vercel logs` / `vercel env pull` aren't available — cron execution history can't be inspected.

### Next Features
- Design pass on about, programs, conditions pages (Editorial Oceanic)
- Proper OG share image (designed 1200x630)
- Welcome email sequence in Kit (5 emails written)
- Interactive map with Mapbox (current field guide is custom-built)
- Instagram embed · historical conditions archive · SMS alerts for A-grade conditions
- Community sighting submission form

### Business
- DAN Professional Liability Insurance — check if Regular covers teaching
- Lawyer review of LJFC waiver
- Google Business Profile optimization
- Rotate exposed API keys (Kit, Resend)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
