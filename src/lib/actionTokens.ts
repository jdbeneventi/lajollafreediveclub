import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signed single-purpose action links for the daily digest.
 *
 * A link authorizes ONE capability on ONE inquiry until it expires:
 *
 *   /admin/act?id=<uuid>&action=replied|archive|draft&exp=<unix>&sig=<hmac>
 *
 * The signature is an HMAC over (id, action, exp) keyed on ADMIN_KEY, so
 * links die when the admin key rotates — same lifecycle as admin sessions.
 * The "draft" capability covers both generating a draft and sending it for
 * that inquiry (the send is the point of the draft).
 *
 * Safety properties:
 *   - GET on /admin/act only renders; every mutation is a POST that
 *     re-verifies the signature. Email-client link prefetchers therefore
 *     can't mark, archive, or send anything.
 *   - Tokens are scoped and expiring; nothing about them is guessable
 *     without ADMIN_KEY.
 *   - Fails closed: no ADMIN_KEY → nothing signs, nothing verifies.
 */

export type ActAction = "replied" | "archive" | "draft";

export const ACT_ACTIONS: ActAction[] = ["replied", "archive", "draft"];

const ADMIN_KEY = process.env.ADMIN_KEY?.trim() || undefined;

const DEFAULT_TTL_DAYS = 14;

function sig(id: string, action: string, exp: number): string | null {
  if (!ADMIN_KEY) return null;
  return createHmac("sha256", ADMIN_KEY)
    .update(`ljfc-act-v1.${id}.${action}.${exp}`)
    .digest("hex");
}

/** Absolute URL for a digest action link, or null when unsigned (no key). */
export function actionLink(
  baseUrl: string,
  id: string,
  action: ActAction,
  ttlDays = DEFAULT_TTL_DAYS,
): string | null {
  const exp = Math.floor(Date.now() / 1000) + ttlDays * 86400;
  const s = sig(id, action, exp);
  if (!s) return null;
  return `${baseUrl}/admin/act?id=${encodeURIComponent(id)}&action=${action}&exp=${exp}&sig=${s}`;
}

export function verifyActionToken(params: {
  id?: string | null;
  action?: string | null;
  exp?: string | number | null;
  sig?: string | null;
}): { valid: true; id: string; action: ActAction; exp: number } | { valid: false } {
  const { id, action, exp, sig: provided } = params;
  if (!id || !action || !exp || !provided) return { valid: false };
  if (!ACT_ACTIONS.includes(action as ActAction)) return { valid: false };

  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum < Date.now() / 1000) {
    return { valid: false };
  }

  const expected = sig(id, action, expNum);
  if (!expected) return { valid: false }; // no key configured — fail closed

  const a = Buffer.from(String(provided), "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { valid: false };

  return { valid: true, id, action: action as ActAction, exp: expNum };
}
