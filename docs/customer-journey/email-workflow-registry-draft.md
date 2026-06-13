# LJFC Email Workflow Registry — Draft

Purpose: make visible what is going out, to whom, when, and from where. This is a draft registry from code inspection, not a guarantee of production delivery history.

Implemented as a read-only admin surface at `/admin/emails?key=ljfc`, backed by `src/lib/emailWorkflows.ts`. This registry should stay behavior-neutral: it documents and organizes workflows, but does not send emails or mutate student/inquiry state.

## Course Inquiry / Conversion

### Course inquiry confirmation

- Trigger: public course inquiry submitted.
- Route: `/api/course-inquiry`
- Recipient: student.
- Subject: `Course inquiry received — {course}`
- Type: user action.
- Status effect: creates `course_inquiries` row.

### Course inquiry owner notification

- Trigger: public course inquiry submitted.
- Route: `/api/course-inquiry`
- Recipient: Joshua.
- Subject: `Course inquiry: {name} — {course}`
- Type: user action.
- Status effect: none beyond inquiry creation.

### AI-drafted inquiry reply

- Trigger: Joshua drafts/sends from `/admin/inquiries`.
- Route: `/api/admin/inquiries/reply`
- Recipient: student.
- Subject: AI-generated or fallback `Re: {course} inquiry`.
- Type: manual admin action.
- Status effect: marks inquiry `replied`.

### Invoice / payment link

- Trigger: Joshua creates invoice/payment link.
- Route: `/api/invoice`
- Recipient: student if `sendEmail` is true.
- Subject: `Invoice: {course} — ${amount}`
- Type: manual admin action.
- Status effect: creates booking with `status=invoice_sent`, `payment_status=unpaid`.

### Stripe payment confirmation

- Trigger: Stripe checkout session completed.
- Route: `/api/webhook/stripe`
- Recipient: student.
- Subject: `Payment confirmed — {courseName}`
- Type: webhook.
- Status effect: booking confirmed; payment status deposit/paid; latest active inquiry linked and marked `paid`; magic link issued.

### Stripe payment owner notification

- Trigger: Stripe checkout session completed.
- Route: `/api/webhook/stripe`
- Recipient: Joshua.
- Subject: `Payment: {student} — {courseName} — ${amount}`
- Type: webhook.
- Status effect: same as above.

## Forms / Waivers

### Send AIDA forms

- Trigger: Joshua uses send forms tool.
- Route: `/api/send-forms`
- Recipient: student.
- Subject: `AIDA Course Forms — La Jolla Freedive Club`
- Type: manual admin action.
- Status effect: none visible from route.

### AIDA forms submitted — student confirmation

- Trigger: student submits AIDA forms.
- Route: `/api/aida-forms`
- Recipient: student.
- Subject: `AIDA Forms Submitted — {course}`
- Type: user action.
- Status effect: stores AIDA form record.

### AIDA forms submitted — owner notification

- Trigger: student submits AIDA forms.
- Route: `/api/aida-forms`
- Recipient: Joshua.
- Subject: `AIDA Forms: {fullName} — {course}` with physician-required warning when relevant.
- Type: user action.
- Status effect: stores AIDA form record.

### LJFC waiver signed — owner notification

- Trigger: student signs LJFC waiver.
- Route: `/api/waiver`
- Recipient: Joshua.
- Subject: `Signed Waiver — {fullName}` with warning marker when relevant.
- Type: user action.
- Status effect: stores/logs waiver; generates PDF.

### LJFC waiver signed — student copy

- Trigger: student signs LJFC waiver.
- Route: `/api/waiver`
- Recipient: student.
- Subject: `Your LJFC Waiver — Signed Copy`
- Type: user action.
- Status effect: PDF delivery.

### Camp waiver signed — owner notification

- Trigger: parent signs camp waiver.
- Route: `/api/camp-waiver`
- Recipient: Joshua.
- Subject: `Camp Waiver Signed — {childName}` with warning marker when relevant.
- Type: user action.
- Status effect: generates PDF.

### Camp waiver signed — parent copy

- Trigger: parent signs camp waiver.
- Route: `/api/camp-waiver`
- Recipient: parent.
- Subject: `Camp Garibaldi Waiver — Signed Copy for {childName}`
- Type: user action.
- Status effect: PDF delivery.

## Onboarding / Readiness

### Magic-link login

- Trigger: student requests login link.
- Route: `/api/auth/magic-link`
- Recipient: student.
- Subject: `Your login link — La Jolla Freedive Club`
- Type: user action.
- Status effect: updates student magic token.

### Admin onboarding link

- Trigger: Joshua sends onboarding link manually.
- Route: `/api/admin/send-links`
- Recipient: student.
- Subject: `Welcome — complete your pre-course onboarding`
- Type: manual admin action.
- Status effect: creates/updates student; issues magic link.

### Course enrollment invite

- Trigger: Joshua enrolls student in `/admin/courses`.
- Route: `/api/admin/courses`, action `enroll`.
- Recipient: student.
- Subject: `You're enrolled — {courseName}`
- Type: manual admin action.
- Status effect: creates student/booking; payment status pending.

### Resend course invite

- Trigger: Joshua clicks resend invite in course roster.
- Route: `/api/admin/courses`, action `resend_invite`.
- Recipient: student.
- Subject: `Reminder: {courseName} — get ready`
- Type: manual admin action.
- Status effect: none besides email.

### Course roster blast

- Trigger: Joshua sends message to event roster.
- Route: `/api/admin/courses`, action `blast_email`.
- Recipient: enrolled course participants.
- Subject: Joshua-supplied.
- Type: manual admin action.
- Status effect: none besides email.

### Course readiness reminder

- Trigger: scheduled/manual cron route.
- Route: `/api/course-reminder`
- Recipient: student.
- Subject: readiness-sensitive; ready vs missing items.
- Type: cron/manual route.
- Status effect: none visible; reminder only.

### Course briefing

- Trigger: scheduled/manual cron route.
- Route: `/api/course-briefing`
- Recipient: Joshua.
- Subject: `Course Briefing: {courseName} — {courseDates} ({roster.length} students)`
- Type: cron/manual route.
- Status effect: none visible; briefing only.

### Inquiry digest

- Trigger: scheduled/manual cron route.
- Route: `/api/inquiry-digest`
- Recipient: Joshua.
- Subject: `LJFC inquiries — {count} need attention` or all clear.
- Type: cron/manual route.
- Status effect: none visible; attention summary.

## Saturday / Conditions / Community

### Friday reminder

- Trigger: scheduled/manual cron route.
- Route: `/api/friday-reminder`
- Recipient: Joshua.
- Subject: `Friday reminder: Send the Saturday go/no-go`
- Type: cron/manual route.

### Saturday go/no-go broadcast

- Trigger: Joshua sends Saturday blast.
- Route: `/api/saturday-blast`
- Recipient: Kit segment/list.
- Subject: generated from go/no-go type.
- Type: manual/scheduled broadcast.

### Saturday RSVP confirmation

- Trigger: user submits Saturday RSVP.
- Route: `/api/saturday-rsvp`
- Recipient: student.
- Subject: `You're registered for Saturday — La Jolla Freedive Club`
- Type: user action.

### Saturday RSVP owner notification

- Trigger: user submits Saturday RSVP.
- Route: `/api/saturday-rsvp`
- Recipient: Joshua.
- Subject: `Saturday RSVP: {name}`
- Type: user action.

### Saturday confirmation owner notification

- Trigger: Saturday confirmation route.
- Route: `/api/saturday-confirm`
- Recipient: Joshua.
- Subject: `Saturday confirmed: {email}`
- Type: user action / confirmation action.

### Daily conditions email

- Trigger: scheduled/manual conditions route.
- Route: `/api/daily-email`
- Recipient: Joshua for test; Kit list for broadcast.
- Subject: `{grade} — La Jolla Dive Conditions · {date}`
- Type: cron/manual broadcast.

## Gaps To Resolve

- Which of these are currently scheduled in Vercel vs externally vs manual only?
- Which emails should appear in the future admin email registry UI?
- Which emails should be logged as events on student/inquiry records?
- Which templates need owner-editable copy?
- Which messages should be disabled or merged to avoid duplicate student emails?
