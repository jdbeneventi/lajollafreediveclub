# Safe LJFC Improvement Plan

This plan assumes the current system is useful and mostly working. The job is to reduce manual load without breaking email automations, PDFs, onboarding, education spaces, gear collection, demographic collection, Stripe, or Supabase state.

## Safety Rules

1. No production-breaking refactors.
2. No schema changes without migration + rollback.
3. No checkout/webhook changes without tests or a Stripe test run.
4. No form/PDF changes without verifying generated PDFs still render.
5. No email automation changes without preview mode or dry-run output.
6. No admin secret changes until replacement env vars are verified in Vercel.
7. No autonomous AI support agent until escalation boundaries and KB are written.

## Branching Strategy

Use a branch for implementation:

```bash
git checkout -b ljfc/customer-journey-safe-pass
```

Work in small commits:

1. docs only;
2. copy-only UI changes;
3. optional fields only;
4. admin display only;
5. tests;
6. automation changes last.

## Phase 0 — Current-state baseline

Before code changes, capture baseline behavior:

- `npm ci`
- `npm run build` with production-like env or documented local dummy env.
- screenshot/check:
  - `/contact/courses`
  - `/calendar`
  - `/booking`
  - `/portal`
  - `/portal/onboarding`
  - `/portal/profile`
  - `/forms/aida`
  - `/waiver`
  - `/admin/inquiries`
  - `/admin/courses`
- preview API/email HTML where supported:
  - `/api/inquiry-digest?preview=true&secret=...`
  - course reminder preview if added later.

Known current local build blocker:

- `src/lib/supabase.ts` creates Supabase client at import time and requires env vars during build.
- Do not “fix” this while implementing journey UX unless making a separate tested infrastructure change.

## Phase 1 — Docs and language only

Goal: create shared language.

Files:

- `docs/customer-journey/ljfc-lead-to-ready-student-prd.md`
- `docs/customer-journey/operational-journey-inventory.md`
- `docs/customer-journey/flow-map.html`

No app behavior changes.

Decision to confirm:

- Canonical state labels.
- Seat reservation boundary = deposit/full payment.
- Which qualification checks happen before payment vs after payment.

## Phase 2 — Copy and UI clarity only

Low-risk changes:

- Add “seat reserved after deposit” copy to relevant public pages.
- Clarify inquiry success screen/email: “Joshua will confirm eligibility/date; deposit reserves your spot.”
- Clarify portal readiness card language.
- Clarify admin headings without changing data model.

No new fields. No new DB writes.

Verification:

- page render still works;
- existing form submit still works;
- emails still send same core links.

## Phase 3 — Optional qualification fields

Add optional fields to inquiry form and API. Must be backwards-compatible.

Candidate fields:

- age band / adult vs minor;
- swim comfort;
- AIDA/prior certification;
- gear status;
- possible medical review needed: yes/no/prefer to discuss.

Rules:

- Do not ask for detailed medical explanations on the marketing form.
- Do not make new fields required at first.
- Store if column exists or use a JSON metadata/admin_notes strategy only after checking schema.
- Admin display should show missing vs present qualification signals.

Verification:

- old payload still accepted;
- new payload accepted;
- Joshua notification includes the new fields;
- student confirmation does not leak sensitive medical details.

## Phase 4 — Admin cockpit refinement

Goal: one place to see operational exceptions.

Group views by:

- new inquiry;
- needs qualification;
- replied/date proposed;
- deposit pending;
- paid/not onboarded;
- paid/not ready;
- ready upcoming;
- dormant/expired.

Use existing fields first:

- `course_inquiries.status`
- `bookings.payment_status`
- `student_onboarding.completed_at`
- `aida_forms`
- `saturday_members.waiver_signed`
- `student_progress`

No schema changes until the UI proves what is missing.

## Phase 5 — Reminder sequencing

Only after states are clear.

Pre-conversion:

- candidate follow-up if replied/quoted/deposit_sent and no payment after 48h;
- dormant follow-up after 5–7 days.

Post-conversion:

- payment confirmation already exists;
- 7-day readiness reminder if missing items;
- 48-hour course reminder already exists;
- 24-hour logistics reminder optional;
- instructor briefing already exists.

Rule:

Each email should have exactly one primary action.

## Phase 6 — Knowledge base / support agent

Build only after the funnel is clean.

KB inputs:

- course pages;
- AIDA requirements;
- waiver/policies;
- gear guide;
- onboarding/prep guide;
- calendar/booking FAQ;
- conditions/Saturday Session FAQ.

Allowed answers:

- course fit;
- “what do I still need?”;
- gear/logistics;
- prep guidance;
- calendar/payment status if safely available.

Escalate:

- medical details;
- safety exceptions;
- refunds/transfers;
- minors/guardian edge cases;
- custom scheduling promises;
- legal/insurance questions.

## Rollback Plan

For every implementation PR:

- Keep changes small enough to revert with one commit.
- Avoid migrations unless required.
- If migration required, write down reverse SQL.
- Keep old email links valid.
- Keep old form payload accepted.
- Do not delete old routes during transition.

## First Actual Code Change Recommendation

When ready, start with a copy-only PR:

- Public course inquiry page: clarify next steps and deposit boundary.
- Student confirmation email: clarify forms are useful, but seat is reserved only by payment.
- Booking page: clarify deposit meaning.
- Portal home: strengthen “readiness checklist” framing.

This has high product value and low breakage risk.
