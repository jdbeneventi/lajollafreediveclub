# LJFC Current-State Holes and Opportunities

## Guiding constraint

The current LJFC system is working. Do not break it. Improvements should start as documentation, maps, copy-only changes, and admin visibility before schema/API changes.

## Current strength

The repo already contains a surprisingly complete operating system:

- public marketing and trust-building pages;
- live conditions, tides, ocean intelligence, and local-intel pages;
- course/camp/contact inquiry forms;
- AIDA forms and LJFC waiver/PDF workflows;
- course calendar and admin calendar;
- Supabase-backed inquiry, booking, student, onboarding, gear, and prep data;
- Stripe checkout and invoice/payment routes;
- magic-link student portal;
- student onboarding, profile, gear, medical, prep progress, readiness score;
- admin inquiry, course, student, onboarding, calendar, invoice, and send-link spaces;
- AI-drafted inquiry replies;
- automated emails: inquiry confirmations, owner notifications, payment confirmations, course reminders, course briefings, daily/Friday/Saturday/digest flows.

The opportunity is orchestration, not replacement.

## Main holes

### 1. No single canonical journey map

The journey exists in pieces across forms, API routes, admin pages, emails, and Supabase tables. There is no single visible map that says:

- what state a candidate/student is in;
- what must happen next;
- what the system should automate;
- what Joshua must personally decide;
- what should be escalated.

Recommendation: maintain a current-state and target-state map in `docs/customer-journey/` before changing behavior.

### 2. State language is likely inconsistent across surfaces

Existing statuses include useful states such as `new`, `replied`, `quoted`, `deposit_sent`, `paid`, `onboarded`, `completed`, `declined`, `expired`.

But the user-facing journey should be simpler:

1. Inquiry received
2. Needs qualification
3. Qualified / date proposed
4. Deposit requested
5. Seat reserved
6. Onboarding incomplete
7. Ready for course
8. Course completed
9. Dormant / declined

Recommendation: map internal statuses to user-facing/admin-facing labels before adding new statuses.

### 3. Qualification happens too implicitly

Current inquiry capture gets course, experience, dates, group size, message, and contact info. But qualification depends on:

- age/minor status;
- swim comfort or AIDA 2 swim-test readiness;
- existing certification/prerequisite;
- medical flag or physician clearance risk;
- gear status;
- desired course fit.

Recommendation: add lightweight qualification questions later. Do not ask for detailed medical information in the marketing form; ask only enough to route safely.

### 4. Deposit as seat-reservation boundary is under-emphasized

The business rule is clear: a spot is not reserved until deposit/full payment. This should appear consistently in:

- calendar course cards;
- inquiry confirmation;
- Joshua/admin proposal emails;
- deposit link copy;
- booking/checkout page;
- portal after payment.

Recommendation: first improve copy everywhere, before backend changes.

### 5. Email automation inventory is missing

There are many automations. Because they are useful and currently working, changing them without a map is risky.

Recommendation: create an email automation inventory with:

- trigger;
- recipient;
- current CTA;
- data dependency;
- failure mode;
- whether it is pre-payment, post-payment, readiness, instructor-facing, or alumni-facing.

### 6. Portal is the right post-payment home, but all emails should point there

Once payment happens, the portal should be the single source of truth for:

- course/date;
- payment status and remaining balance;
- onboarding status;
- medical/AIDA form state;
- LJFC waiver state;
- prep guide progress;
- gear/logistics checklist;
- help/contact.

Recommendation: align all post-payment emails to “go to your portal” except specific hard links where necessary.

### 7. Admin cockpit can become much clearer without a big CRM

The existing admin pages are a strong foundation. The high-value improvement is grouping work by operational state:

- new / needs reply;
- needs qualification;
- date proposed;
- deposit pending;
- paid but onboarding incomplete;
- ready students;
- exceptions.

Recommendation: prefer dashboard grouping and filters over new product complexity.

### 8. Knowledge base / support agent should come after state cleanup

A chat agent could help with course fit, gear, logistics, forms, and onboarding. But if the underlying state model is unclear, the agent will create confusion.

Recommendation: first build a bounded LJFC knowledge base and escalation policy. Then add an agent that reads the same readiness/calendar/course-state data as the portal/admin system.

### 9. Security cleanup is important but should be staged separately

Hardcoded simple passcodes and cron secrets appear in multiple places. They should be migrated to env vars eventually.

But because the current system is working, do not mix this with customer-journey work. It needs its own inventory and rollout plan.

## Opportunity map

### Low-risk, high-value first

- Current-state map.
- Target-state map.
- Email automation inventory.
- Copy audit for “deposit reserves seat.”
- Admin label/status mapping.
- Student-facing portal checklist audit.

### Medium-risk next

- Add lightweight qualification fields.
- Add deposit-link follow-up sequences.
- Add better admin filters/grouping.
- Add 24h logistics reminder.
- Add post-course follow-up.

### Higher-risk later

- Schema changes to formalize state machine.
- Support/chat agent.
- Env-var migration for secrets.
- Major UI redesign.
- SMS automation.

## Recommended next deliverable

Yes: produce two visual maps.

1. **Current-state map** — what exists now, including all forms, automations, PDFs, portal steps, internal education spaces, gear/demographic elicitation, admin spaces, and Joshua handoffs.
2. **Target-state map** — same system, but organized around a smaller number of states and next actions.

These maps should identify:

- what is already working and should not be disturbed;
- duplicated or unclear CTAs;
- where manual judgment is required;
- where automation is safe;
- where data exists but is not surfaced;
- where missing data blocks flow;
- where a future agent/knowledge base would fit.

## Proposed immediate next step

Create an inventory table for:

- all forms;
- all PDF/form generation flows;
- all automated emails;
- all admin screens;
- all portal/student education screens;
- all statuses and transitions;
- all secrets/passcodes/cron triggers.

Then turn that inventory into the current-state map.
