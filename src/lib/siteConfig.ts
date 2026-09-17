/**
 * Site-wide operational switches. One flip here propagates to every
 * surface (banner, pages, cards, crons) — publish once, true everywhere.
 */

/** Saturday community sessions: paused as of Sep 16, 2026. Flip to false
 *  (and redeploy) to resume — banner, pages, and the Friday-reminder +
 *  Saturday-blast crons all key off this. */
export const SATURDAY_SESSIONS_PAUSED = true;

export const SATURDAY_PAUSE_NOTE =
  "Saturday sessions are on pause right now — courses are running as usual. We'll announce here and by email when weekly sessions return.";

/** ALL courses paused until 2027 (Sep 16, 2026). Flip to false and
 *  publish 2027 dates to resume — homepage strip, /programs schedule,
 *  and the inquiry-form notice all key off this. The inquiry form stays
 *  OPEN: submissions become the 2027 first-to-know list. */
export const COURSES_PAUSED = true;

export const COURSES_PAUSE_NOTE =
  "Courses are on pause until 2027 — leave your details and you'll hear new dates first, with first pick of seats. Private coaching is still running.";
