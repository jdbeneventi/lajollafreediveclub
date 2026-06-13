# LJFC Lead → Ready Student Flow

## Problem Statement

La Jolla Freedive Club does not need a maximal lead-generation machine right now. It needs a clean operational system that turns the leads already arriving into qualified, paid, ready students with minimal manual follow-up.

Today the repo already has many pieces of that system: course inquiries, calendar events, admin inquiry pipeline, AI-drafted replies, Stripe deposits, magic-link portal, onboarding, AIDA forms, waivers, readiness scoring, course reminders, and instructor briefing emails. The gap is not absence of capability; it is orchestration. The user journey is distributed across forms, email copy, admin screens, API routes, and cron jobs without a single canonical funnel.

The desired outcome is operational relief plus a better student experience: each prospective student should know where they are, what is required next, whether they are eligible, whether a seat is actually reserved, and what they must complete before course day.

## Solution

Create a lightweight customer journey layer over the existing implementation.

This should be implemented as a simple funnel/state model before adding more features. The core object is not “lead” in the abstract; it is a course candidate moving toward being a ready student.

The target journey:

1. Candidate chooses a course/date or asks for help choosing.
2. Candidate answers qualifying questions.
3. System checks minimum eligibility and flags medical/age/prerequisite risks.
4. System shows or sends viable course options with open seats.
5. Candidate pays a deposit or full payment.
6. Seat becomes reserved only after payment.
7. Student receives a magic-link onboarding path.
8. Portal guides them through onboarding, medical, AIDA forms, LJFC waiver, prep guide, and gear/logistics.
9. Reminders continue until readiness is complete.
10. Joshua gets a concise course briefing before the course.

## Current Implementation Map

### Existing entry points

- `/contact/courses` — course inquiry form.
- `/calendar` — public scheduled courses/events, currently reads Supabase first and falls back to static calendar data.
- `/booking` — Stripe checkout entry point.
- `/portal` — magic-link student portal.
- `/portal/onboarding` — blocking onboarding flow after magic-link verification.
- `/forms/aida` — AIDA forms.
- `/waiver` — LJFC waiver.
- `/admin/inquiries` — inquiry pipeline.
- `/admin/calendar` — course/event manager.
- `/admin/courses` — course enrollment/booking management.

### Existing backend pieces

- `/api/course-inquiry` inserts into `course_inquiries`, sends student confirmation, notifies Joshua.
- `/api/admin/inquiries` lists/enriches inquiries with bookings and onboarding state.
- `/api/admin/inquiries/reply` drafts and sends replies using Anthropic + LJFC source-of-truth prompt.
- `/api/checkout` creates Stripe Checkout and a pending booking.
- `/api/webhook/stripe` confirms booking, links latest inquiry, marks inquiry `paid`, issues portal magic link, sends payment confirmation.
- `/api/portal/onboarding` stores onboarding.
- `/api/portal/medical` stores medical data.
- `/api/portal/prep-progress` tracks prep guide progress.
- `/api/course-reminder` sends 48-hour readiness/logistics reminder.
- `/api/course-briefing` sends Joshua a pre-course briefing.
- `/api/inquiry-digest` sends pipeline digest for stale inquiries, stalled quotes, groupings, and upcoming course readiness.

### Existing database concepts

- `course_inquiries` with status lifecycle:
  - `new`
  - `replied`
  - `quoted`
  - `deposit_sent`
  - `paid`
  - `onboarded`
  - `completed`
  - `declined`
  - `expired`
- `bookings`
- `students`
- `student_onboarding`
- `aida_forms`
- `student_progress`
- `calendar_events`

## Recommended Canonical Funnel

Use these canonical states across UI, emails, admin screens, and automation:

1. **Inquiry received**
   - Candidate submitted interest.
   - System has name, email, desired course, date preference, experience.

2. **Needs qualification**
   - System or Joshua still needs eligibility information.
   - Qualification includes age, swim ability, AIDA prerequisite, medical risk, course fit, and date availability.

3. **Qualified / date proposed**
   - Candidate appears eligible.
   - System or Joshua has proposed one or more course options.

4. **Deposit requested**
   - Candidate has a payment link.
   - Seat is not reserved yet.

5. **Seat reserved**
   - Deposit or full payment received.
   - Booking is confirmed.
   - Portal magic link sent.

6. **Onboarding incomplete**
   - Student is paid but missing one or more readiness items.

7. **Ready for course**
   - Student has completed onboarding, required medical/forms/waiver, and enough prep.

8. **Course completed**
   - Post-course follow-up can begin.

9. **Dormant / declined**
   - Candidate stopped responding, is not eligible, or date no longer works.

## Qualification Rules

### AIDA 1

Minimum required checks:

- Adult or minor with guardian handling where applicable.
- Comfort in water.
- Medical statement completed.
- No physician-clearance blocker unless cleared.
- LJFC waiver completed.

### AIDA 2

Minimum required checks:

- Swim 200m nonstop without fins OR 300m with mask/fins/snorkel.
- Medical statement completed.
- Physician clearance if required.
- LJFC waiver completed.
- Candidate understands course includes pool and open-water sessions.
- Gear plan exists.

### AIDA 3

Minimum required checks:

- AIDA 2 or equivalent prerequisite.
- Medical statement completed.
- Physician clearance if required.
- Gear plan exists.
- Candidate understands increased depth/training expectations.

### Private coaching / Saturday sessions

Minimum required checks:

- Already certified if in-water coaching/session requires it.
- Own gear, lanyard, computer for Saturday line diving.
- LJFC waiver completed.

### Camp Garibaldi

Minimum required checks:

- Age eligibility.
- Parent/guardian contact.
- Youth medical/liability paperwork.
- Emergency contact.
- Swim comfort.

## UX Opportunities

### 1. Public calendar should distinguish “interest” from “reserve”

Every course card should make the seat rule explicit:

> Spots are reserved after deposit.

Suggested CTAs:

- “Ask about this date” for candidates needing qualification.
- “Reserve with deposit” for candidates who already know they are eligible.

### 2. Course inquiry form should ask qualification questions earlier

Current `/contact/courses` captures course, experience, preferred dates, group size, and message. Add a compact qualification block:

- Age range / adult vs minor.
- Swim comfort or swim-test readiness.
- Prior certification, if any.
- Any medical “yes” on AIDA statement? Do not ask for details publicly; just route to medical form or “needs review.”
- Gear status.
- Preferred date or “match me with next eligible opening.”

Keep it light. The goal is routing, not a legal medical intake in the marketing form.

### 3. Inquiry success state should show “what happens next”

After inquiry:

- “We’ll confirm eligibility + date availability.”
- “Your seat is reserved only after deposit.”
- “You can get ahead by reviewing medical/waiver requirements.”

Do not push full onboarding too early before eligibility/date/payment, except as optional preview.

### 4. Admin pipeline should become the operating cockpit

The existing `/admin/inquiries` direction is right. Make it the single cockpit for:

- new inquiries;
- stale inquiries;
- qualification blockers;
- proposed dates;
- deposit links sent;
- paid but not onboarded;
- ready students;
- upcoming course readiness.

### 5. Student portal should become the single “source of next step”

Once paid, every email should point to the portal. The portal should show:

- course/date;
- payment status and remaining balance;
- readiness checklist;
- prep guide progress;
- forms/waiver status;
- gear/logistics checklist;
- contact/help CTA.

## Automation Opportunities

### Pre-conversion nurture

Automations to add or strengthen:

- Inquiry confirmation: already exists.
- 24h stale lead reminder to Joshua: partially exists via inquiry digest.
- 48h candidate follow-up if status is `replied`, `quoted`, or `deposit_sent` but no payment.
- 5–7 day dormant follow-up: “Still want a spot?”
- Expiry rule: auto-mark `expired` after a defined period without response.

### Conversion

Automations:

- Generate/send deposit link from admin pipeline.
- Mark inquiry `deposit_sent` when link is sent.
- Mark `paid` from Stripe webhook.
- Link booking to event and inquiry reliably.

### Post-conversion onboarding

Automations:

- Payment confirmation with magic link: already exists.
- 7-day readiness reminder if course is more than a week away.
- 48-hour reminder: already exists.
- 24-hour logistics reminder: proposed.
- Instructor briefing: already exists.

### Delight / retention

Later, not first phase:

- Post-course thank-you.
- Certification/next-step email.
- Saturday Sessions invitation.
- Conditions tool digest for alumni.
- Review/referral request.

## Knowledge Base / Agent Opportunity

The user’s note about a knowledge base and agent fits naturally, but should come after the funnel state model is clean.

Useful agent scope:

- Answer student questions from a bounded LJFC knowledge base.
- Explain eligibility requirements.
- Explain what is missing from the student’s readiness checklist.
- Help choose between AIDA 1, AIDA 2, private coaching, and Saturday Sessions.
- Escalate medical, safety, refund, and edge-case eligibility questions to Joshua.

Do not start with an autonomous sales agent. Start with a support/clarification agent constrained by the same readiness and calendar state used by the portal.

## Implementation Decisions

- Use the existing `course_inquiries` lifecycle as the starting point, but refine labels around actual user state.
- Treat payment as the seat reservation boundary.
- Keep qualification lightweight in the public inquiry form.
- Keep medical details in the dedicated medical/AIDA form, not the marketing form.
- Make the portal the post-payment source of truth.
- Make the admin inquiry pipeline the pre-payment cockpit.
- Do not build a large CRM. Build a few small state transitions and clear screens.

## Testing Decisions

Good tests should verify observable behavior:

- Submitting an inquiry creates an inquiry and returns success.
- Sending a deposit link transitions inquiry to `deposit_sent`.
- Stripe webhook marks booking confirmed and inquiry paid.
- Magic-link verification redirects incomplete students to onboarding.
- Readiness score reports missing items accurately.
- Course reminder sends “ready” vs “missing items” email depending on readiness.
- Inquiry digest identifies stale leads and stalled deposit links.

Prefer route-level integration tests with mocked Supabase/Stripe/Resend seams over implementation-specific unit tests.

## Out of Scope For First Pass

- Full CRM replacement.
- Maximizing lead volume.
- Complex AI agent autonomy.
- SMS automation.
- Advanced segmentation.
- Major redesign of every public page.
- New course education content beyond making the existing prep/onboarding sequence visible.

## Phase Plan

### Phase 1 — Map and clarify

- Create the canonical journey map.
- Decide exact funnel states.
- Audit UI copy against the “seat reserved after deposit” rule.
- Identify missing qualification fields.

### Phase 2 — Minimal flow improvements

- Add qualification fields to `/contact/courses`.
- Improve inquiry success copy.
- Add “reserve with deposit” vs “ask about this date” CTAs where appropriate.
- Add/admin strengthen deposit-link action.

### Phase 3 — Readiness cockpit

- Improve admin pipeline grouping: needs reply, needs qualification, deposit pending, paid/not onboarded, ready.
- Add student readiness summary to admin course view.
- Make reminder behavior visible.

### Phase 4 — Support agent / knowledge base

- Build a small LJFC student support knowledge base.
- Add bounded agent for course-fit and onboarding questions.
- Escalate medical/safety/payment exceptions.

## Open Questions

1. Should candidates be allowed to pay a deposit before Joshua manually reviews eligibility?
2. Which courses can be self-serve reserved and which require manual approval?
3. What exact age ranges apply to each offering?
4. For AIDA 2, should the swim requirement be a checkbox attestation before payment?
5. Should physician-clearance cases block payment, or allow deposit with clear “pending medical clearance” status?
6. What is the refund/transfer rule for deposits?
7. Should course capacity live only in `calendar_events`, or should seats be calculated from confirmed bookings?
