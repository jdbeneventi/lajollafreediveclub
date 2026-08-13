# CLAUDE.md — La Jolla Freedive Club

> Last verified against the codebase and production: **2026-08-13**.
> When something here contradicts the code, the code wins — and fix this file.

## Project Overview
La Jolla Freedive Club (lajollafreediveclub.com) is a freediving community and AIDA certification business based in La Jolla, San Diego. Founded by Joshua Beneventi — AIDA Instructor, AIDA Youth Instructor, AIDA 4 Freediver. San Diego's only AIDA-certified freediving instructor for both adults and kids. DAN insured. Red Cross First Aid/CPR/AED certified.

Camp Garibaldi is LJFC's youth program (ages 8-16) — a week-long ocean camp teaching freediving, surf survival, and water confidence through a breath-first methodology.

The site is not a brochure. It runs the business: lead capture → inquiry pipeline → payment → student onboarding → medical/liability compliance → course-readiness scoring → certification tracking, plus a live ocean-conditions data layer and a partnership CRM. ~47k lines, ~100 routes.

## Tech Stack
- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Hosting:** Vercel (auto-deploy from GitHub on push to `main`). A failed build is NOT promoted — the previous production deployment stays live.
- **Database:** Supabase Postgres, project `bvfxmqysquthijsntbnh`. Accessed server-side only, via `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS).
- **Payments:** Stripe — card + ACH, deposit or full, `STRIPE_MODE` toggles live/test
- **Transactional email:** Resend, from `noreply@lajollafreediveclub.com` (domain verified). 21 routes send mail.
- **Broadcast email:** Kit/ConvertKit — v4 API with v3 fallback. Form ID 9207242. Tags: Daily Conditions `17696327`, Saturday Crew `17781468`.
- **AI:** Anthropic API — used for exactly one thing, reading the Scripps underwater cam to estimate visibility
- **Forms backup:** Formspree `mojknqlk` (every form also posts here)
- **Domain:** lajollafreediveclub.com (DNS on Cloudflare). Apex 307s to `www`.
- **Analytics:** GA4 `G-X0ZXTHKTKK`
- **GitHub:** github.com/jdbeneventi/lajollafreediveclub.git (private)

### Environment variables
On Vercel: `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `KIT_API_KEY`, `KIT_API_SECRET`, `CRON_SECRET`, `STRIPE_WEBHOOK_SECRET`, plus everything below.
In `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_TEST_SECRET_KEY`, `STRIPE_MODE`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

⚠️ **`.env.local` points at the PRODUCTION Supabase project with the service-role key, and `STRIPE_MODE=live`.** `npm run dev` reads and writes real student data. Do not submit forms against local dev without changing this first.

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

**Admin** (all gated) — `/admin` + `/calendar` `/courses` `/curriculum` `/economics` `/inquiries` `/invoices` `/onboarding` `/partners` `/registrations` `/send-forms` `/send-links` `/sitemap` `/students`

**Private strategy** (noindex + password) — `/ohpc` (+ `/plan`) · `/education` (+ `/partners`) · `/science` (ORIGIN Protocol) · `/research`

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
git checkout -b some-change          # never commit straight to main
# ...edit...
npm run build                        # must pass — Vercel runs this too
node scripts/smoke.mjs               # baseline against prod before you start
git push -u origin some-change       # Vercel builds a preview URL
node scripts/smoke.mjs <preview-url>  # verify the preview, not prod
# merge to main only once the preview is green
```

`scripts/smoke.mjs` — zero-dependency, read-only. Checks 16 pages render with real content, 8 data APIs for shape + plausible ranges + **freshness**, that admin/cron endpoints reject unauthenticated callers, and the apex redirect. Pre-existing bugs are listed in its `KNOWN_ISSUES` map so they don't mask new breakage; if a known issue starts passing, the run says `FIXED` and tells you to delete the entry. Exits non-zero only on unexpected failures.

Baseline as of 2026-08-13: **38 passed, 0 failed, 5 known**.

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

### Security — fix before other work
- **The literal string `"ljfc"` is a hardcoded fallback secret across the whole admin + cron surface, and it ships in the public JS bundle.** Verified live 2026-08-13: `/api/admin/students?key=ljfc`, `/api/admin/onboarding?key=ljfc` (medical + emergency contacts), `/api/admin/inquiries?key=ljfc`, `/api/admin/gear?key=ljfc` all return 200 with real data. Same fallback authorizes `/api/daily-email` (schedules a Kit broadcast to the whole list), `/api/invoice`, `/api/send-forms`, `/api/aida-forms`, `/api/calendar`, `/api/calendar/seed`. Sibling literals: `ljfc-daily-2026` (in plaintext in `vercel.json`), `ljfc-friday-2026`, `ljfc-saturday-2026`.
- **`PasswordGate` is client-side only** (`useState`, no server check) — gated content ships in the bundle regardless, so `/ohpc`, `/science`, `/education` and `/research` are readable by anyone who opens devtools. Admin pages gate the UI the same way; their APIs at least check server-side, but with the key above.

### Correctness
- **`/api/almanac` is frozen at build time** — no `fetch()`, so no revalidation. As of 2026-08-13 it serves June 13 data: wrong moon phase, "next full moon" seven weeks in the past, stale grunion flag. `/conditions` displays it. Fix: `export const revalidate = 3600`.
- Waiver PDF archiving to Google Drive — Sheet logging works, PDF upload fails on large payloads
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
