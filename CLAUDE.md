# CLAUDE.md — La Jolla Freedive Club

## Project Overview
La Jolla Freedive Club (lajollafreediveclub.com) is a freediving community and AIDA certification business based in La Jolla, San Diego. Founded by Joshua Beneventi — AIDA Instructor, AIDA Youth Instructor, AIDA 4 Freediver. San Diego's only AIDA-certified freediving instructor for both adults and kids. DAN insured. Red Cross First Aid/CPR/AED certified.

Camp Garibaldi is LJFC's youth program (ages 8-16) — a week-long ocean camp teaching freediving, surf survival, and water confidence through a breath-first methodology.

## Tech Stack
- **Framework:** Next.js 14 + TypeScript + Tailwind CSS
- **Hosting:** Vercel (auto-deploy from GitHub on push)
- **Domain:** lajollafreediveclub.com (DNS on Cloudflare)
- **GitHub:** github.com/jdbeneventi/lajollafreediveclub.git
- **Forms:** Formspree (endpoint: https://formspree.io/f/mojknqlk)
- **Email list:** Kit/ConvertKit (form ID: 9207242)
- **Transactional email:** Resend (RESEND_API_KEY env var on Vercel, domain verified)
- **AI API:** Anthropic API key on Vercel as ANTHROPIC_API_KEY
- **Daily Email:** Kit broadcast API (KIT_API_SECRET env var on Vercel)
- **Cron:** vercel.json cron at 6am PT (0 13 * * * UTC) — requires Vercel Pro plan

## Brand — Direction A (Deep Water Editorial)
**Colors (in tailwind.config.ts):**
- Midnight/deep: #0B1D2C
- Deep/ocean: #163B4E
- Kelp/teal: #1B6B6B
- Seafoam: #3db8a4
- Driftwood/sand: #D4A574
- Salt/foam: #FAF3EC
- Ember/coral: #C75B3A
- Sun: #f0b429
- Slate: #3A4A56

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

Competitor reference: JGW beginner $495, intermediate $550, private $1900 (for up to 4). Depth Wish AIDA 2 $700. Focus Freedive FII L1 $525-685.

## Site Structure
```
/ — Homepage (Editorial Oceanic redesign, bottom-aligned hero, tools section, This Weekend, programs, Camp Garibaldi, testimonials, journal)
/programs — AIDA 1/2/3 (expandable cards with prices) + other programs + upcoming calendar + community events
/camp-garibaldi — Camp Garibaldi youth program
/conditions — Live conditions (AI vis, swell, wind, temp, tides, moon, seasonal, ocean intel sightings feed)
/map — Underwater field guide (10 dive sites, 8 depth zones, 50+ species)
/tides — 7-day tide calendar with best dive windows
/gear — Wetsuit guide by temp + equipment recommendations
/blog — Journal (10 posts)
/blog/[slug] — Individual blog post
/about — Joshua's story, credentials, philosophy, FAQ
/contact — General contact (Formspree)
/contact/courses — Course inquiry form (supports ?course= URL param)
/contact/camp — Camp Garibaldi inquiry form
/waiver — Digital waiver system (3-step: info → medical → review & sign with canvas signature)
```

## Key API Routes
```
/api/conditions — Buoy data from NDBC LJPC1 RSS
/api/visibility — AI analysis of Scripps underwater cam via Anthropic API
/api/watertemp — Water temp from NDBC 46254 + seatemperature.net + seasonal fallback
/api/forecast — 7-day marine forecast from NWS
/api/tides — NOAA CO-OPS tide predictions (station 9410230)
/api/almanac — Moon phase + seasonal events + grunion check
/api/daily-email — Daily conditions email (preview with ?preview=true&secret=ljfc-daily-2026)
/api/ocean-intel — Aggregated sightings from iNaturalist + Reddit + CDFW HAB reports
/api/waiver — Generates signed PDF, emails via Resend to owner + signer, sends to Formspree
```

## Data Sources
- **NDBC 46254** — Scripps Nearshore Waverider Buoy (realtime text file — most reliable for wave/temp)
- **NDBC LJPC1/LJAC1** — Scripps Pier wind speed, direction, gusts (RSS feeds)
- **NOAA CO-OPS 9410230** — La Jolla tide predictions (JSON API)
- **HDOnTap** — Scripps Pier underwater cam thumbnail for AI visibility analysis
- **NWS FZUS56.KSGX** — Marine forecast for PZZ740 inner coastal zone
- **iNaturalist API** — Marine species observations near La Jolla (5km radius, marine-only filter)
- **Reddit JSON API** — r/sandiego, r/freediving, r/scuba, r/surfing for sighting reports

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
- Digital waiver at /waiver — 3-step form (personal info → medical questionnaire → review & sign)
- Canvas-based digital signature
- Server generates PDF with jsPDF (full waiver text + signature image + timestamp)
- Emails PDF via Resend to both owner (joshuabeneventi@gmail.com) and signer
- Formspree backup notification
- AIDA courses require additional AIDA-specific forms (in /public/documents/)
- **KNOWN ISSUE:** Resend emails may not be sending — needs debugging (check Resend dashboard, verify RESEND_API_KEY env var in Vercel, check API response for emailErrors field)

## Documents (in public/documents/)
- aida-liability-release.pdf
- aida-medical-statement.pdf
- aida1-guidelines.pdf, aida2-guidelines.pdf, aida3-guidelines.pdf
- ljfc-waiver.pdf + ljfc-waiver.md

## Joshua's Credentials
- AIDA Instructor
- AIDA Youth Instructor
- AIDA 4 Freediver
- DAN Insured (ID# 3339867, valid through Sept 2026, Policy DAN9477420)
- DAN Emergency Hotline: +1-919-684-9111
- American Red Cross Adult & Pediatric First Aid/CPR/AED (Cert 022T2IJ, valid through Sept 2027)
- AIDA profile: https://www.aidainternational.org/InstructorProfile/858dbbd9-9e54-4235-abf8-e0a035ccd077

## Joshua's Background
- Family from Pico, Azores (grandmother's side). Great-grandfather whaler, settled in SD for tuna fishing. Grandfather freedived for abalone in La Jolla.
- Grew up Point Loma / Ocean Beach, 4 blocks from water. Spearfishing, longboarding, Sunset Cliffs.
- Trained: Stella Abbas (Freedive Tioman, Malaysia) → Pieter Van Veen (AIDA 3, Dahab) → Harry Chamas (Freedive Passion, La Ventana) → Khaled El Gammal (AIDA 4 + Instructor + Youth Instructor, Dahab)
- First freediving club in the USA was founded in La Jolla in 1939.
- Substack: joshuabeneventi.substack.com

## Photos (in public/images/photos/)
- joshua-red-sea.jpg — Headshot floating in Red Sea
- joshua-stella.jpg — With Stella Abbas at Blue Hole, Dahab
- joshua-khaled.jpg — With Khaled El Gammal at Lighthouse, Dahab
- joshua-khaled-hannah.jpg — With Khaled and Hannah at Blue Hole
- joshua-teaching-kids.jpg — Teaching 2 kids poolside
- joshua-kid-beach.jpg — With young student at Mission Bay
- joshua-kid-pool.jpg — With kid at pool
- joshua-lena-shores.jpg — With Lena at La Jolla Shores
- joshua-brooke-kristina.jpg — With Brooke and Kristina in wetsuits

## Community
- **Lena** — RYT yoga teacher, freediver, artist. "Ocean Flow" Saturday 7am at La Jolla Shores.
- **Brooke** — Apnea Collective / Molchanovs coach

## Blog Posts (13 total)
1. Beginner's Guide to Freediving in La Jolla (Guide)
2. Why Surfers Should Learn to Freedive (Crossover)
3. 5 Best Freediving Spots in San Diego (Local Guide)
4. AIDA Levels Explained (Education)
5. 6 Disciplines of Competitive Freediving (Education)
6. The Mammalian Dive Reflex (Science)
7. CO2 Tolerance Training Guide (Training)
8. 7 Dry Training Exercises (Training)
9. What Happens to Your Body During a Freedive (Science)
10. The Big Blue: The Film That Made a Generation Want to Dive (Culture)
11. The Complete Guide to Equalization for Freediving (Training)
12. Freediving Certification Agencies Compared (Education)
13. Why Singers Make Natural Freedivers (Science)

## Key Decisions
- Water temp: parse Celsius from NDBC 46254 text file (WTMP column), convert to F
- Visibility: AI vision analysis of Scripps cam + predictive model fallback
- Daily email fetches directly from NDBC/NOAA (not own API routes — self-calls fail on Vercel)
- Blog posts use HTML in template literals in src/lib/blog.ts
- Forms submit to Formspree with hidden _form_type field
- EmailCapture component submits to Kit form 9207242
- Ocean intel filters to longitude < -117.245 (west of shoreline = ocean)
- Program cards on homepage link to /programs (details first), not /contact (form)
- Saturday sessions: free with Ocean Flow ($20), $25 drop-in without
- Gear: not included in courses, students must bring or rent from local shops

## Workflow
```
cd ~/Downloads/ljfc && git add . && git commit -m "describe change" && git push
```
Auto-deploys to Vercel within ~1 minute.

## Code Conventions
- Components in src/components/ (Nav, Footer, Logo, EmailCapture, Reveal, ExpandableCourse, WeekendEmailForm)
- Page-specific components colocated (e.g., ConditionsWidget, AlmanacWidget, OceanIntel, ConditionsEmailForm)
- Shared utilities in src/lib/ (blog.ts, moon.ts, seasonal.ts)
- All API routes in src/app/api/
- Tailwind color names: deep, ocean, teal, seafoam, sand, salt, coral, sun, slate, driftwood, foam
- Font classes: font-serif for headings, font-sans (default) for body
- Section labels: text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase
- Reveal component wraps sections for scroll animations
- frontend-design skill installed (project scope, symlink)

## Pending / Known Issues
### Bugs to Fix
- **Resend waiver emails not sending** — RESEND_API_KEY added to Vercel, domain verified in Resend. Emails not appearing. Debug: submit waiver with browser Network tab open, check /api/waiver POST response for emailErrors field. Also check Resend dashboard Emails tab.
- **Daily email creates drafts in Kit** — not auto-sending. Kit broadcast API creates drafts. May need to hit Kit send endpoint after creation.
- **Vercel cron requires Pro plan** — verify billing or use free cron-job.org

### Next Features
- Design pass on about, programs, conditions pages (Editorial Oceanic)
- Proper OG share image (designed 1200x630)
- Course calendar with real dates (current are Apr/May placeholders)
- Welcome email sequence in Kit (5 emails written)
- PWA setup (conditions as home screen)
- Interactive map with Mapbox
- Online booking with Stripe
- Instagram embed
- Historical conditions archive
- SMS alerts for A-grade conditions
- Waiver PDF cloud storage
- Community sighting submission form

### Business
- DAN Professional Liability Insurance — check if Regular covers teaching
- Lawyer review of LJFC waiver
- Google Business Profile optimization
- Resubmit sitemap in Search Console
- Rotate exposed API keys (Kit, Resend)
