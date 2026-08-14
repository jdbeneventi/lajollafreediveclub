# LJFC System Assessment

Assessed 2026-08-14 against `main` at `4e1ba6f`. Findings verified against the running
production site, not inferred from code alone. Figures come from the repository, a full
database export, and the live deployment.

An interactive version of this document exists as a Claude artifact; this is the copy of
record that lives with the code.

---

## The verdict

**The engineering is better than it has any right to be.** The parts that would hurt most
if they failed are the parts built most defensively — the inquiry pipeline survives an
email outage without losing a lead, and a broken build cannot reach production. The data
is small enough to move anywhere.

**The risk isn't in the code. It's in the concentration.** One person holds the whole
model; two load-bearing pieces live in Google's cloud with no source in version control;
and the framework is two major versions behind with four high-severity advisories
outstanding. None of that breaks tomorrow. All of it gets harder to fix the longer it
waits.

---

## Scale

| | |
|---|---|
| Lines of code | 48,005 |
| Routes | 108 — 61 pages, 47 API |
| Database tables | 14 |
| Rows of business data | 505 |
| Runtime dependencies | 8 |
| Email workflows | 26 |
| Scheduled jobs | 5 |
| People who understand it | 1 |

---

## Architecture

```
VISITOR SURFACE   marketing · ocean tools · Camp Garibaldi · student portal · 15 admin screens
       │
APPLICATION       Next.js 14 App Router · 47 API routes · 18 logic modules · 5 crons
       │
RECORDS           Supabase Postgres (14 tables, system of record)
                  Google Apps Script ×2  ← source NOT in git
                  Formspree (backup copy of every form)
       │
SERVICES          Stripe · Resend · Kit/ConvertKit · Anthropic · Vercel · Cloudflare
       │
LIVE FEEDS        NDBC 46254 · NDBC LJPC1 · NOAA CO-OPS 9410230 · NWS PZZ740
                  HDOnTap Scripps cam · iNaturalist · Reddit · sdbeachinfo
```

---

## Load-bearing paths

The paths that must not break, and how much punishment each takes.

### Course inquiry — triple redundant

```
/contact/courses → Formspree
                 + /api/course-inquiry → Supabase row → email to owner + ack to prospect
```

The strongest thing in the system. The database write happens first in its own error
boundary, each email sends in a separate one, and the form posts to Formspree
independently. Resend can be down entirely and the lead still lands in two places.

### Payment — sound

```
/api/checkout → Stripe → webhook → booking confirmed → inquiry marked paid → magic link
```

The webhook always returns success to Stripe and wraps each step in its own catch, so a
downstream failure never triggers endless retries. Caveat: the student row and a pending
booking are created *before* payment confirms, so abandoned checkouts leave orphan rows.
Don't take student counts off that table raw.

### Admin cockpit — newly changed

```
/admin/* → sign in → session cookie → /api/admin/* → Supabase
```

Reworked 2026-08-14. Fifteen screens now authenticate through one server-checked
credential instead of a constant compiled into the browser bundle. Verified before
shipping, but this is the freshest paint — first place to look if an admin screen
misbehaves.

### Conditions — externally dependent

```
NOAA + NDBC + Scripps cam → 9 cached routes → /conditions
```

Seven public feeds parsed from raw text, RSS and HTML — formats nobody promised to keep
stable. Six of these routes silently froze at build time and served two-month-old data for
61 days. Fixed; the monitor now asserts freshness, not just availability.

### Waiver — single point of failure

```
/waiver → PDF generated → emailed both ways → logged to Google Apps Script
```

The legally meaningful path and the most fragile. The record lands in a Google Sheet
through a script whose code exists only inside Google's editor. No repository, no history,
nothing to restore from.

---

## Health

| Dimension | State | Note |
|---|---|---|
| Data safety | Sound | 14 tables, 505 rows backed up and verified; schema reconstructible from git |
| Deploy safety | Sound | Failed builds are never promoted; every deployment retained; one-click rollback |
| Observability | Sound | 50 checks hourly from outside Vercel; still blind to whether crons fired |
| Access control | Sound | Admin and cron endpoints check server-side and fail closed; login throttled |
| Dependency health | **Behind** | Next 14 vs 16, React 18 vs 19, Tailwind 3 vs 4; 8 advisories, 4 high |
| Testing | Thin | Surface covered; no tests on the logic inside |
| Complexity | Concentrated | 22 files over 500 lines; blog is one 3,732-line source file |
| Continuity | **Bus factor 1** | One maintainer; two scripts with no source; credentials across 6 services |

---

## External dependencies

| Service | Carries | If it goes away | Exposure |
|---|---|---|---|
| Supabase | All 14 tables | Dynamic features stop; full backup and schema held | High value, portable |
| Vercel | Hosting, deploys, crons | Site offline; standard Next.js, rehostable | High value, portable |
| **Google Apps Script** | Waiver log, coach portal | Waivers stop logging. **No source to restore from** | **Unrecoverable** |
| Stripe | All payments | No new bookings; records intact | Low |
| Resend | 19 routes send mail | Silence; inquiries still captured twice | Low |
| Kit/ConvertKit | Broadcasts, subscriber list | Broadcasts stop; export the list periodically | Medium |
| Formspree | Backup of every form | Redundancy lost, primary unaffected | Low |
| NOAA / NDBC / NWS | Swell, wind, temp, tides | Conditions degrade; format changes break silently | Medium |
| HDOnTap Scripps cam | Visibility source image | Falls back to predictive model | Low |
| Anthropic | Reads the cam | Falls back to prediction | Low |
| Cloudflare | DNS | Unreachable until DNS moves | Low |

---

## What to do, in order

Ranked by threat to the business, not by interest. Nothing is on fire.

1. **Put the two Apps Script sources in git.** One logs signed waivers — a legal record —
   and its code exists only inside Google's editor. No history, no backup, nothing to
   rebuild from. An hour of copy-paste converts an unrecoverable dependency into an
   inconvenient one. See `scripts/apps-script/README.md`.

2. **Write down who holds what.** Every service, account, and where its credential lives.
   Not sophisticated — just somewhere other than one person's head.

3. **Take the safe dependency updates, then plan the Next.js jump.** Supabase, Resend,
   Stripe and PostCSS are non-breaking today. Treat 14 → 15 → 16 as its own project with
   the smoke tests as the safety net.

4. **Swap the local Stripe key for a test key.** Two minutes; closes the sharper half of
   the local-dev-writes-to-production problem. A separate dev database is optional — only
   2 of 18 logic modules touch the database.

5. **Know which system is authoritative for which question.** Supabase for state, Formspree
   for "did it arrive at all", Sheets for the waiver archive.

6. **Test the pure functions.** Date parsing, overlap detection, readiness scoring — the
   decisions that quietly affect real students, all testable with no infrastructure.

7. **The blog file.** Only worth restructuring if someone else needs to publish, or if the
   3,732-line file starts making changes feel risky.

---

## Long-term read

A system like this usually fails in one of two ways: it rots until upgrading is a rewrite,
or it outgrows its maintainer until changes feel frightening and the owner stops touching
it. This one is closer to the second, and the direction is good.

**What holds up well**

- Failure design is real, not incidental — the inquiry path survives an email outage by construction.
- Eight runtime dependencies. No ORM, no auth library, no UI kit. Little to be abandoned upstream.
- 505 rows. Portable to any Postgres, backed up, schema in git.
- 16 of 18 logic modules are pure functions — the parts most worth testing are the easiest.
- Prior planning already in the repo: `src/lib/emailWorkflows.ts` and `docs/customer-journey/preservation-map.md`.

**What decides the next two years**

- Whether the Apps Script source ends up in the repository.
- Whether the Next.js upgrade is scheduled deliberately or deferred until forced.
- Whether anyone besides the owner can deploy a change and rotate a credential.
- Whether the monitor stays trusted. An alarm that cries wolf gets muted, and then you're blind again.

**The number worth sitting with.** Six data feeds served two-month-old information —
including beach advisories and closures — for sixty-one days. Nothing was down. Nothing
errored. Every page returned a healthy 200. That is the failure mode this system is prone
to: not outages, but quiet wrongness. It is why the monitor checks whether data is *fresh*
rather than merely whether the page loads.
