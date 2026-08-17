/**
 * Shared footer fragments for outbound student-facing email.
 *
 * CONTACT_PHONE (env, full international format like +18585551234) renders
 * a "reach Joshua directly" line with tap-to-text, tap-to-call, and
 * WhatsApp links. Unset = the line simply doesn't render, so nothing
 * breaks while the env var is missing and the number itself never lives
 * in the repo.
 */

const CONTACT_PHONE = process.env.CONTACT_PHONE?.trim() || undefined;

/** "Prefer to talk? Text, call, or WhatsApp …" — empty string when unset. */
export function contactLineHtml(): string {
  if (!CONTACT_PHONE) return "";
  const digits = CONTACT_PHONE.replace(/[^\d]/g, "");
  return `
    <p style="color:#5a6a7a;font-size:13px;line-height:1.6;margin-top:16px;">
      Prefer to talk? Reach Joshua directly —
      <a href="sms:${CONTACT_PHONE}" style="color:#1B6B6B;">text</a>,
      <a href="tel:${CONTACT_PHONE}" style="color:#1B6B6B;">call</a>, or
      <a href="https://wa.me/${digits}" style="color:#1B6B6B;">WhatsApp</a>
      at ${CONTACT_PHONE}.
    </p>
  `;
}
