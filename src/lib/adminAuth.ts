import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Admin authentication.
 *
 * Replaces the previous pattern of comparing against a hardcoded `"ljfc"`
 * literal. That literal was compiled into the client bundle, so anyone could
 * read it and call the admin API directly — verified 2026-08-13 returning real
 * student medical records.
 *
 * The secret now lives only in the ADMIN_KEY environment variable. Three ways
 * to authenticate, in order of preference:
 *
 *   1. The `ljfc_admin` cookie, set by POST /api/admin/login. This is what the
 *      browser uses. httpOnly, so page scripts cannot read it and it never
 *      appears in a URL, referrer header, or server log.
 *   2. An `x-admin-key` request header, for scripts.
 *   3. `?key=` or `?secret=` query params, kept so existing bookmarks and the
 *      inter-page links scattered through the admin pages keep working. Note
 *      these DO leak into logs and referrers — prefer the cookie.
 *
 * FAILS CLOSED: if ADMIN_KEY is unset, nothing authenticates. An unconfigured
 * deployment is locked, never open.
 */

// Trimmed at read time: a trailing space or newline picked up while pasting the
// value into the Vercel dashboard would otherwise reject the correct password
// forever, with nothing visible from outside — configured:true, wrong passwords
// 401 normally, right password fails. Classic env-var paste lockout. User input
// is deliberately NOT trimmed; only the stored side.
const ADMIN_KEY = process.env.ADMIN_KEY?.trim() || undefined;
export const ADMIN_COOKIE = "ljfc_admin";

/** Constant-time compare that tolerates differing lengths. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * The cookie value for a given key. Derived rather than the key itself, so a
 * stolen cookie does not hand over ADMIN_KEY (which also authorises the
 * header and query-param paths).
 */
export function adminCookieToken(key: string = ADMIN_KEY ?? ""): string {
  return createHmac("sha256", key).update("ljfc-admin-session-v1").digest("hex");
}

export function isAdminConfigured(): boolean {
  return Boolean(ADMIN_KEY);
}

/** True when the request carries valid admin credentials. */
export function isAdmin(req: Request): boolean {
  if (!ADMIN_KEY) return false; // fail closed

  const url = new URL(req.url);
  const provided =
    req.headers.get("x-admin-key") ||
    url.searchParams.get("key") ||
    url.searchParams.get("secret");

  if (provided && safeEqual(provided, ADMIN_KEY)) return true;

  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`));
  if (match) return safeEqual(decodeURIComponent(match[1]), adminCookieToken());

  return false;
}

/**
 * True when the request is an authorised automated caller — a Vercel cron or
 * an ops script. Admin credentials also satisfy this, so a human can trigger
 * a cron endpoint by hand.
 */
export function isCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    // Vercel cron invocations carry "Authorization: Bearer <CRON_SECRET>"
    // automatically when the env var exists — the ${CRON_SECRET} query
    // syntax in vercel.json is NEVER interpolated (all five crons 401'd
    // silently for 3 days on exactly that).
    const bearer = req.headers.get("authorization");
    if (bearer?.startsWith("Bearer ") && safeEqual(bearer.slice(7), secret)) {
      return true;
    }
    const url = new URL(req.url);
    const provided =
      url.searchParams.get("secret") ||
      url.searchParams.get("key") ||
      req.headers.get("x-cron-secret");
    if (provided && safeEqual(provided, secret)) return true;
  }
  return isAdmin(req);
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** Guard for admin routes. Returns a 401 response, or null when authorised. */
export function requireAdmin(req: Request): NextResponse | null {
  return isAdmin(req) ? null : unauthorized();
}

/** Guard for cron/ops routes. Returns a 401 response, or null when authorised. */
export function requireCron(req: Request): NextResponse | null {
  return isCron(req) ? null : unauthorized();
}
