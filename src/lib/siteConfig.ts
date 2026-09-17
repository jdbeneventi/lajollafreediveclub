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
