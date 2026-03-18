# CLAUDE.md — La Jolla Freedive Club

## Project Overview
La Jolla Freedive Club (lajollafreediveclub.com) is a freediving community and AIDA certification business based in La Jolla, San Diego. Founded by Joshua Beneventi — AIDA Instructor, AIDA Youth Instructor, AIDA 4 Freediver. San Diego's only AIDA-certified freediving instructor for both adults and kids. DAN insured.

Camp Garibaldi is LJFC's youth program (ages 8-16) — a week-long ocean camp teaching freediving, surf survival, and water confidence through a breath-first methodology.

## Tech Stack
- **Framework:** Next.js 14 + TypeScript + Tailwind CSS
- **Hosting:** Vercel (auto-deploy from GitHub on push)
- **Domain:** lajollafreediveclub.com (DNS on Cloudflare)
- **GitHub:** github.com/jdbeneventi/lajollafreediveclub.git
- **Forms:** Formspree (endpoint: https://formspree.io/f/mojknqlk)
- **Email:** Kit/ConvertKit (form ID: 9207242)
- **AI API:** Anthropic API key on Vercel as ANTHROPIC_API_KEY
- **Daily Email:** Kit broadcast API (KIT_API_SECRET env var on Vercel)
- **Cron:** vercel.json cron at 6am PT (0 13 * * * UTC)

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

**Voice:** Athletic, grounded, editorial. NOT wellness culture. Use "breathing drills" not "breathwork." Use "stretching & breathing exercises" not "yoga." The philosophy is real but framed through athletic training language. "The ocean camp that starts from the inside out."

## Site Structure
```
/ — Homepage
/programs — AIDA 1/2/3 course details + upcoming calendar + community events
/camp-garibaldi — Camp Garibaldi youth program
/conditions — Live dive conditions dashboard (AI vis, swell, wind, temp, tides, moon, seasonal)
/map — Underwater field guide (10 dive sites, 8 depth zones, 50+ species)
/tides — 7-day tide calendar with best dive windows
/gear — Wetsuit guide by temp + equipment recommendations
/blog — Journal (9 posts: beginner guide, surfers, spots, AIDA levels, disciplines, dive reflex, CO2, dry training, body during dive)
/blog/[slug] — Individual blog post
/about — Joshua's story, credentials, philosophy, FAQ
/contact — General contact (Formspree)
/contact/courses — Course inquiry form (Formspree, supports ?course= URL param)
/contact/camp — Camp Garibaldi inquiry form (Formspree)
```

## Key API Routes
```
/api/conditions — Buoy data from NDBC LJPC1 RSS
/api/visibility — AI analysis of Scripps underwater cam via Anthropic API
/api/watertemp — Water temp from NDBC 46254 + seatemperature.net + seasonal fallback
/api/forecast — 7-day marine forecast from NWS
/api/tides — NOAA CO-OPS tide predictions (station 9410230)
/api/almanac — Moon phase + seasonal events + grunion check
/api/daily-email — Daily conditions email (preview with ?preview=true, send without)
```

## Data Sources
- **NDBC 46254** — Scripps Nearshore Waverider Buoy. Wave height, period, direction, sea temp. Realtime text file is most reliable source.
- **NDBC LJPC1/LJAC1** — Scripps Pier wind speed, direction, gusts (RSS feeds)
- **NOAA CO-OPS 9410230** — La Jolla tide predictions (JSON API)
- **HDOnTap** — Scripps Pier underwater cam thumbnail for AI visibility analysis
- **NWS FZUS56.KSGX** — Marine forecast for PZZ740 inner coastal zone
- **seatemperature.net** — Backup water temp (Celsius only, convert to F)

## LJFC Mooring Line
**32.856746, -117.262603** — Canyon edge, ~35-40ft depth, ~500m offshore from Kellogg Park

## Key Decisions Made
- Water temp: parse Celsius from 46254 text file (WTMP column), convert to F. Do NOT parse Fahrenheit from seatemperature.net (grabs wrong value from swimming advisory text).
- Visibility: AI vision analysis of Scripps cam thumbnail + predictive model fallback using swell/wind/tide/temp/season.
- Forecast scoring: baseline 50 (not 70). 3-4ft seas + 10kt wind = B not A.
- Blog posts use HTML in template literals inside src/lib/blog.ts.
- Forms all submit to same Formspree endpoint with hidden _form_type field to distinguish.
- EmailCapture component submits to Kit form 9207242.
- Daily email fetches directly from NDBC/NOAA (not from own API routes — self-calls fail on Vercel).

## Joshua's Background
- Family from Pico, Azores (grandmother's side). Great-grandfather was a whaler, settled in SD for tuna fishing. Grandfather freedived for abalone in La Jolla, bodysurfed.
- Grew up Point Loma / Ocean Beach, 4 blocks from water. Spearfishing, longboarding, Sunset Cliffs.
- Trained at Freedive Tioman (Malaysia) under Stella Abbas (Malaysian national record holder, 60m CWTB)
- AIDA 3 with Pieter Van Veen in Dahab, Egypt
- Trained with Harry Chamas at Freedive Passion, La Ventana, Baja California
- AIDA 4 + Instructor + Youth Instructor under Khaled El Gammal (Egypt's deepest freediver, 100m+, 13x national records) in Dahab
- AIDA profile: https://www.aidainternational.org/InstructorProfile/858dbbd9-9e54-4235-abf8-e0a035ccd077
- Substack: joshuabeneventi.substack.com
- The first freediving club in the USA was founded in La Jolla in 1939.

## Photos (in public/images/photos/)
- joshua-red-sea.jpg — Headshot floating in Red Sea (about page portrait)
- joshua-stella.jpg — With Stella Abbas at Blue Hole, Dahab
- joshua-khaled.jpg — With Khaled El Gammal at Lighthouse, Dahab
- joshua-khaled-hannah.jpg — With Khaled and Hannah at Blue Hole, Dahab
- joshua-teaching-kids.jpg — Teaching 2 kids poolside (Camp Garibaldi)
- joshua-kid-beach.jpg — With young student at Mission Bay
- joshua-kid-pool.jpg — With kid at pool
- joshua-lena-shores.jpg — With Lena at La Jolla Shores (Ocean Flow yoga)
- joshua-brooke-kristina.jpg — With Brooke and Kristina in wetsuits, SD (homepage intro)

## Community Collaborators
- **Lena** — RYT yoga teacher, freediver, artist. Teaches "Ocean Flow" — a pre-dive yoga/stretching session. Saturday mornings 7am at La Jolla Shores before group dive at 8:30am.
- **Brooke** — Apnea Collective / Molchanovs coach

## Workflow
Edit → Save → Push:
```
cd ~/Downloads/ljfc && git add . && git commit -m "describe change" && git push
```
Auto-deploys to Vercel within ~1 minute.

## Code Conventions
- Components in src/components/ (Nav, Footer, Logo, EmailCapture, Reveal)
- Page-specific components colocated (e.g., ConditionsWidget.tsx in src/app/conditions/)
- Shared utilities in src/lib/ (blog.ts, moon.ts, seasonal.ts)
- All API routes in src/app/api/
- Use the existing Tailwind color names (deep, ocean, teal, seafoam, sand, salt, coral, sun, slate, driftwood, foam)
- Font classes: font-serif for headings, font-sans (default) for body
- Section labels use: className="section-label"
- Section titles use: className="section-title"
- Reveal component wraps sections for scroll animations

## Pending / Next
- Fix daily email: broadcasts creating as drafts in Kit (may need send endpoint)
- Vercel crons require Pro plan — check if on Hobby
- Ocean intel feed (Reddit + iNaturalist + news monitoring for whale/shark/bioluminescence sightings)
- Apply course calendar with real dates (current dates are April/May placeholders)
- Instagram integration / embed
- Online booking with payment (Stripe)
- Interactive map on /map page (needs Mapbox API key)
- Historical conditions archive
- SMS alerts for A-grade conditions
