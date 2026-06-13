# LJFC Preservation Map — Do Not Break Existing Ops

## Principle

The current LJFC system is already useful and working for Joshua. Improvements should preserve the working operating system and add a thin orchestration layer around it. Do not rewrite flows that already work. Do not collapse distinct operational surfaces into one “CRM” abstraction until their roles are understood.

The product direction is **operational relief and student experience first**, not aggressive lead generation.

## Existing Working Assets To Preserve

### 1. Email automations

Current automations and email surfaces include:

- Course inquiry confirmation to student.
- Course inquiry notification to Joshua.
- AI-drafted inquiry replies in `/api/admin/inquiries/reply`.
- Stripe payment confirmation email.
- Portal magic-link email.
- Course reminder email, with different copy depending on readiness state.
- Course briefing email to Joshua.
- Inquiry digest for new/stale/stalled leads and upcoming readiness.
- AIDA forms send route.
- Friday reminder / daily conditions / Saturday blast automations.
- Camp Garibaldi registration confirmation.
- Camp waiver PDF email.
- LJFC waiver PDF email.
- Invoice/payment-link emails.

Preservation rule: before changing a flow, identify which route sends the email, what event triggers it, who receives it, and which state transition depends on it.

### 2. PDF forms and legal-ish documents

Current form/PDF surfaces include:

- `/forms/aida` for AIDA medical/liability forms.
- `/api/aida-forms` for AIDA form handling.
- `/waiver` and `/api/waiver` for LJFC waiver PDF generation and email.
- `/camp-garibaldi/waiver` and `/api/camp-waiver` for youth waiver PDF generation and email.
- Public downloadable documents under `/public/documents/`.
- Physician-clearance upload/handling via portal routes.

Preservation rule: do not move medical/legal detail into the marketing inquiry form. Public qualification can ask lightweight routing questions; official medical/liability details stay in dedicated forms.

### 3. Internal education spaces

Current education/onboarding surfaces include:

- `/portal` student dashboard.
- `/portal/onboarding` demographic, emergency, swim, experience, gear, and goal intake.
- `/portal/prep/aida1` and `/portal/prep/aida2` preparation spaces.
- `student_progress` tracking via `/api/portal/prep-progress`.
- AIDA manuals and course-prep links in emails.
- `/programs/aida-2-guide` and other public educational pages.
- `/students`, `/science`, `/education`, `/research`, `/ohpc/plan` as internal or semi-internal spaces, some password-gated.

Preservation rule: onboarding improvements should route students into the portal and education spaces rather than duplicating content inside emails or admin screens.

### 4. Information elicitation

The system already elicits several categories of information:

- Contact info: name, email, phone.
- Course fit: desired course, experience, dates, group size, message.
- Demographic/onboarding info: date of birth, sex, height, weight, pronouns, emergency contact.
- Water readiness: swim ability, 200m no-fins attestation, freediving experience, breath-hold/depth buckets.
- Gear info: owned/needed/renting gear, sizes, notes, gear catalog.
- Medical/liability information via dedicated forms.
- Goals/fears/preferences via onboarding.
- Camp-specific parent/guardian, child, medical, charter-school, emergency, and dietary info.

Preservation rule: do not ask for the same data twice unless the second ask is an explicit confirmation. Prefer “progressive profiling”: ask the minimum needed at each stage.

### 5. Administrative cockpits

Existing admin surfaces include:

- `/admin/inquiries` — inquiry pipeline.
- `/admin/calendar` — events/course scheduling.
- `/admin/courses` — enrollment and course administration.
- `/admin/students` — student state.
- `/admin/onboarding` — onboarding review.
- `/admin/send-forms` and `/admin/send-links` — operational messaging.
- `/admin/invoices` — payment links/invoices.

Preservation rule: improve visibility and state labels before moving functionality. The safest first move is documentation and read-only status surfaces, not mutation-heavy automation.

## Current Critical State Boundaries

### Inquiry state

Stored in `course_inquiries.status`:

- `new`
- `replied`
- `quoted`
- `deposit_sent`
- `paid`
- `onboarded`
- `completed`
- `declined`
- `expired`

This is already close to the desired funnel. Do not replace it casually.

### Booking/payment state

Stored in `bookings`:

- `status`
- `payment_status`
- `payment_amount`
- `deposit_paid`
- `stripe_session_id`
- `event_id`

Important boundary: **seat reservation begins at confirmed deposit/full payment**, not at inquiry.

### Student readiness state

Computed by `getReadinessScore` from:

- `student_onboarding`
- `aida_forms`
- `saturday_members.waiver_signed`
- `student_progress`
- recent `bookings`

Readiness currently checks:

- onboarding complete;
- AIDA medical statement;
- physician clearance when required;
- AIDA liability release;
- LJFC waiver;
- prep guide ≥ 80%.

This is valuable. It should become more visible, not be replaced.

## Safe Change Strategy

### Phase 0 — Documentation and instrumentation only

Allowed:

- Create journey maps.
- Create status maps.
- Add README/docs.
- Add tests around existing behavior.
- Add `.env.example`.
- Add read-only admin summaries.

Avoid:

- Changing email triggers.
- Changing database schema.
- Changing Stripe/webhook logic.
- Changing legal/medical form flow.
- Changing cron schedules.

### Phase 1 — Copy and visibility

Allowed:

- Make “deposit reserves seat” clearer in copy.
- Improve inquiry success copy.
- Add read-only eligibility/readiness badges in admin UI.
- Add lightweight qualification fields only if backwards-compatible.

Guardrails:

- Keep existing fields accepted.
- Default new fields to optional/null.
- Do not block current successful submissions.
- Do not alter email sending unless covered by a test or manual preview.

### Phase 2 — State transitions

Allowed:

- Add explicit transitions like `deposit_sent` from invoice/payment-link action.
- Add follow-up reminders for stale states.
- Add better grouping/date suggestions.

Guardrails:

- Every mutation should be idempotent.
- Every automated email should have preview mode.
- Every automated email should be suppressible.
- Edge cases escalate to Joshua.

### Phase 3 — Knowledge-base support agent

Allowed:

- Bounded student-support agent.
- Knowledge base over LJFC policies, course requirements, gear, logistics, forms, and onboarding.
- Read-only access to student readiness state.

Not allowed initially:

- Autonomous medical judgment.
- Autonomous eligibility approval for edge cases.
- Autonomous refunds/transfers.
- Autonomous legal advice.
- Autonomous schedule changes.

## Suggested Non-Breaking Next Tasks

1. Create an email automation inventory: route, trigger, recipient, state transition, preview mode, dependencies.
2. Create a forms/PDF inventory: route, inputs, outputs, storage, recipients, legal/medical sensitivity.
3. Create a state-transition diagram for `course_inquiries`, `bookings`, and readiness.
4. Add tests for current critical flows before editing behavior:
   - inquiry submit;
   - Stripe webhook payment confirmation;
   - magic-link verification;
   - readiness calculation;
   - course reminder ready vs not-ready;
   - inquiry digest stale/stalled detection.
5. Only after tests/docs: make copy-only UI improvements around the deposit boundary.

## Working Hypothesis

LJFC’s strongest product advantage is not a prettier landing page. It is a coherent trust-and-readiness system:

- candidates feel guided;
- students know exactly what to complete;
- Joshua sees exceptions only;
- the course day is safer and smoother;
- the business retains its human voice without requiring constant manual coordination.
