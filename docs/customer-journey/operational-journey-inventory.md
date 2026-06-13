# LJFC Operational Journey Inventory

This document maps the live-ish operating system already present in the repo. It is intentionally conservative: the site is working, so the next improvements should wrap and clarify the existing flow rather than replace it.

## Core Principle

Do not break the current operating system.

The current product is not just a marketing site. It is an operational stack with:

- public lead capture;
- email automation;
- PDF / signed form generation;
- Stripe payment and booking confirmation;
- student magic-link auth;
- internal student education spaces;
- onboarding and demographic elicitation;
- gear information elicitation;
- readiness scoring;
- admin cockpit views;
- daily/weekly instructor and student reminders;
- conditions/community emails.

The correct next move is not a rewrite. The correct next move is to name the existing journey, document the boundaries, then make the smallest changes that reduce Joshua’s manual load.

## Existing Subsystems

### 1. Lead capture and inquiry handling

Primary files:

- `src/app/contact/courses/page.tsx`
- `src/app/api/course-inquiry/route.ts`
- `src/app/admin/inquiries/page.tsx`
- `src/app/api/admin/inquiries/route.ts`
- `src/app/api/admin/inquiries/reply/route.ts`
- `src/app/api/inquiry-digest/route.ts`
- `src/lib/inquiryConflicts.ts`

Current capabilities:

- Collects course inquiry data.
- Stores inquiry in `course_inquiries`.
- Sends candidate confirmation email.
- Sends Joshua notification email.
- Drafts Joshua-style replies using Anthropic.
- Detects overlapping inquiry windows for possible group-rate courses.
- Sends digest for new/stale inquiries, stalled quotes, and upcoming course readiness.

Current risk:

- Qualification fields are partially downstream in onboarding rather than clearly represented in the pre-payment inquiry state.
- Some secrets are hardcoded in admin/digest routes.
- There is not one canonical journey label set visible across the whole app.

### 2. Calendar, capacity, and course inventory

Primary files:

- `src/app/calendar/page.tsx`
- `src/app/admin/calendar/page.tsx`
- `src/app/api/calendar/route.ts`
- `src/lib/calendar.ts`
- `src/app/api/admin/courses/route.ts`

Current capabilities:

- Public calendar exists.
- Admin calendar/course management exists.
- Calendar events stored in `calendar_events`.
- Course enrollment can be linked to bookings and students.

Needed clarification:

- The system should distinguish: available event, candidate interest, deposit requested, confirmed booking, and fully ready student.
- Capacity should eventually be calculated from event capacity minus confirmed bookings, not from loose inquiry interest.

### 3. Payment, booking, and seat reservation

Primary files:

- `src/app/booking/page.tsx`
- `src/app/booking/success/page.tsx`
- `src/app/api/checkout/route.ts`
- `src/app/api/webhook/stripe/route.ts`
- `src/app/api/invoice/route.ts`
- `src/app/admin/invoices/page.tsx`

Current capabilities:

- Creates Stripe Checkout sessions.
- Creates or updates students/bookings.
- Stripe webhook confirms bookings.
- Webhook advances matching inquiry to `paid`.
- Payment confirmation email includes portal magic link.
- Invoice/admin payment tools exist.

Canonical rule:

- Seat is reserved only after deposit or full payment.

Do not change this boundary casually. It is the strongest simplifying rule in the system.

### 4. Magic-link auth and student portal

Primary files:

- `src/lib/auth.ts`
- `src/app/api/auth/magic-link/route.ts`
- `src/app/api/auth/verify/route.ts`
- `src/app/portal/page.tsx`
- `src/app/portal/verify/page.tsx`
- `src/app/portal/PortalLogin.tsx`
- `src/app/portal/JourneyCard.tsx`
- `src/app/portal/OnboardingCard.tsx`

Current capabilities:

- Issues magic links to students.
- Stores token on student record.
- Verifies session via `ljfc_session` cookie.
- Portal acts as post-payment home base.

Important UX direction:

- After payment, every student email should point back to the portal.
- The portal should be the source of truth for “what do I still need to do?”

### 5. Onboarding and demographic elicitation

Primary files:

- `src/app/portal/onboarding/page.tsx`
- `src/app/portal/onboarding/OnboardingFlow.tsx`
- `src/app/api/portal/onboarding/route.ts`
- `src/app/admin/onboarding/page.tsx`
- `src/app/api/admin/onboarding/route.ts`
- `supabase/student_onboarding.sql`
- `supabase/onboarding-v2.sql`

Current data captured includes:

- first/last name;
- date of birth;
- sex;
- height;
- weight;
- emergency contact;
- swim ability;
- 200m swim readiness;
- freediving experience;
- breath-hold bucket;
- deepest dive bucket;
- fears;
- goals;
- theory preference;
- notes;
- shoe size;
- shirt size.

This is stronger than a generic CRM profile. It is a course-readiness elicitation instrument.

Do not flatten it into generic “lead fields.” Keep the distinction between:

- pre-payment qualification;
- post-payment onboarding;
- instructor preparation.

### 6. Medical, AIDA forms, waivers, and PDFs

Primary files:

- `src/app/forms/aida/page.tsx`
- `src/app/api/aida-forms/route.ts`
- `src/app/waiver/page.tsx`
- `src/app/api/waiver/route.ts`
- `src/app/camp-garibaldi/waiver/page.tsx`
- `src/app/api/camp-waiver/route.ts`
- `src/app/api/send-forms/route.ts`
- `src/app/api/portal/medical/route.ts`
- `src/app/api/portal/physician-clearance/route.ts`
- `public/documents/`

Current capabilities:

- Online AIDA medical/liability forms.
- Online LJFC waiver.
- Camp waiver.
- PDF generation and email delivery.
- Medical physician-clearance handling.
- Admin form-send tools.

Important boundary:

- Marketing/inquiry forms should not collect detailed medical explanations.
- They may ask whether there is a potential medical “yes” that requires review.
- Detailed medical data belongs in the dedicated form/onboarding flow.

### 7. Gear elicitation and weight guidance

Primary files:

- `src/app/portal/profile/page.tsx`
- `src/app/portal/profile/ProfileView.tsx`
- `src/app/api/portal/gear/route.ts`
- `src/app/api/admin/gear/route.ts`
- `src/app/gear/page.tsx`
- `supabase/gear_catalog.sql`

Current capabilities:

- Gear catalog.
- Student gear ownership/rental/need tracking.
- Brand/size/condition/notes capture.
- Weight calculator based on body metrics and wetsuit thickness.

This is operationally valuable because it helps Joshua prepare rentals, sizing, and safety logistics before course day.

### 8. Internal education and prep spaces

Primary files:

- `src/app/portal/prep/aida1/page.tsx`
- `src/app/portal/prep/aida1/PrepContent.tsx`
- `src/app/portal/prep/aida2/page.tsx`
- `src/app/portal/prep/aida2/PrepContent.tsx`
- `src/app/api/portal/prep-progress/route.ts`
- `src/app/programs/aida-2-guide/page.tsx`
- `src/lib/certifications.ts`
- `src/lib/readiness.ts`

Current capabilities:

- Internal course prep spaces.
- Prep progress tracking in `student_progress`.
- Readiness score requires prep-guide completion threshold.
- Public AIDA 2 guide exists as acquisition/education material.

Important product direction:

- This proprietary educational material is not a side feature. It is part of the product experience after conversion.
- Do not bury it in email. The portal should frame it as the path to being ready.

### 9. Student reminders and instructor briefings

Primary files:

- `src/app/api/course-reminder/route.ts`
- `src/app/api/course-briefing/route.ts`
- `src/app/api/friday-reminder/route.ts`
- `src/app/api/daily-email/route.ts`
- `src/app/api/saturday-blast/route.ts`
- `src/app/api/saturday-confirm/route.ts`
- `src/app/api/inquiry-digest/route.ts`
- `vercel.json`

Current capabilities:

- Course reminders.
- Instructor briefing emails.
- Inquiry digest.
- Daily conditions email.
- Friday reminder / Saturday session communications.
- Kit/ConvertKit integration.

Improvement direction:

- Make each automation map to a funnel state or operational exception.
- Avoid creating redundant emails that fight the portal.
- Reminder logic should ask: what state is this person in, and what one action moves them forward?

### 10. Conditions and delight layer

Primary files:

- `src/app/conditions/page.tsx`
- `src/app/api/conditions/route.ts`
- `src/app/api/daily-email/route.ts`
- `src/app/api/visibility/route.ts`
- `src/app/api/ocean-intel/route.ts`
- `src/app/api/local-intel/route.ts`
- `src/app/saturday-sessions/page.tsx`

Current capabilities:

- Conditions pages and intelligence tools.
- Daily/weekend email layer.
- Saturday Sessions funnel/community layer.

Product role:

- This is delight, retention, and community infrastructure.
- It should not be mixed into the core course enrollment path until the enrollment path is calm.

## Conservative Change Strategy

### Non-invasive first pass

Start with docs, copy, labels, and state clarity:

1. Document the canonical funnel.
2. Document the current subsystem map.
3. Add `.env.example` later, but do not change env behavior first.
4. Add admin labels or copy only after checking real data shape.
5. Avoid database migrations until the journey/state map is stable.

### Safe code changes later

Only after the map is accepted:

1. Add optional qualification fields to the existing inquiry form.
2. Store them without changing current required fields.
3. Preserve old behavior if new fields are absent.
4. Update admin display to show the new fields.
5. Add tests around existing webhook/onboarding/readiness behavior before refactoring.

### Things not to do yet

- Do not rewrite checkout.
- Do not rewrite onboarding.
- Do not replace current email automations.
- Do not add a fully autonomous agent before a knowledge base and escalation boundaries exist.
- Do not change Supabase tables without a migration and rollback plan.
- Do not push directly to production without a preview build.

## Proposed Funnel Vocabulary

Use this vocabulary across docs and future UI:

- **Candidate** — someone considering a course.
- **Inquiry** — a submitted expression of interest.
- **Qualification** — minimum checks before Joshua can confidently propose/confirm a course path.
- **Payment link** — invitation to reserve a seat.
- **Reserved seat** — deposit or full payment received.
- **Student** — paid participant with portal access.
- **Readiness** — completion of required forms, onboarding, waiver, prep, and logistics.
- **Exception** — anything requiring Joshua: medical review, eligibility ambiguity, schedule conflict, refund/transfer, safety issue.

## Minimal Next Implementation Plan

### Step 1 — Preserve and document

- Keep current flows working.
- Add journey docs only.
- Create a future ADR if/when the canonical funnel states are adopted in code.

### Step 2 — Add observability without changing behavior

- Add visible admin labels for current state.
- Add a “why this needs attention” column/card.
- Show readiness blockers from existing data.

### Step 3 — Add lightweight qualification capture

- Add optional fields to inquiry form:
  - adult/minor or age band;
  - swim comfort;
  - AIDA/prior cert;
  - gear status;
  - possible medical review needed yes/no.
- Keep submit API backward-compatible.

### Step 4 — Make portal the readiness home

- Ensure payment confirmation, reminders, and admin links all point to portal/readiness.
- Use existing readiness scoring as the organizing object.

### Step 5 — Knowledge base / bounded support agent

- Build a small knowledge base from existing course pages, AIDA requirements, waivers, gear guidance, and logistics.
- Agent answers only within that boundary.
- Escalates medical/safety/refund/edge-case questions.

## Success Criteria

The system is better when:

- Joshua can open one admin screen and know who needs attention.
- A paid student can open one portal screen and know what to do next.
- Course day reminders are driven by missing readiness items, not generic emails.
- Deposits reliably define reserved seats.
- Candidate questions are answered without Joshua repeating the same logistics.
- No existing forms, PDFs, emails, Stripe flows, or onboarding paths are broken.
