import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { adminCookieToken, ADMIN_COOKIE, isAdminConfigured } from "./adminAuth";

/**
 * Server-side page gate for the invite-only strategy pages — /science, /ohpc,
 * /ohpc/plan, /education, /research, /camp-garibaldi/charter-funding.
 *
 * Replaces the old client-side PasswordGate, which only decided whether to
 * PAINT the content: the pages are server components, so their full body
 * shipped in the payload to every visitor, and the access code was a string
 * literal in the JS bundle. Anyone reading either had everything.
 *
 * Now the page itself checks `gateAuthorized()` before returning content, so
 * an unauthorized request receives the gate form and nothing else.
 *
 * Two ways in:
 *   - the shared page code (GATE_CODE env var), exchanged for a long-lived
 *     httpOnly cookie at POST /api/gate. These pages are shared with partners,
 *     so the cookie lasts 30 days — the old gate re-asked on every reload.
 *   - an admin session (the ljfc_admin cookie). Joshua never types the page
 *     code.
 *
 * Comparison is trimmed and case-insensitive, matching the old gate's
 * behaviour — partners were given the code without casing instructions.
 * Fails closed: with GATE_CODE unset, the code path rejects everything and
 * only an admin session opens the pages.
 */

export const GATE_COOKIE = "ljfc_gate";

const GATE_CODE = process.env.GATE_CODE?.trim().toLowerCase() || undefined;

export function isGateConfigured(): boolean {
  return Boolean(GATE_CODE);
}

/** Normalise a submitted code the same way the stored one is normalised. */
export function normaliseGateCode(input: string): string {
  return String(input ?? "").trim().toLowerCase();
}

/** The cookie value — derived, so the cookie never carries the code itself. */
export function gateCookieToken(code: string = GATE_CODE ?? ""): string {
  return createHmac("sha256", code).update("ljfc-page-gate-v1").digest("hex");
}

export function gateCodeMatches(input: string): boolean {
  if (!GATE_CODE) return false; // fail closed
  const a = Buffer.from(normaliseGateCode(input), "utf8");
  const b = Buffer.from(GATE_CODE, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/**
 * Server-component check. Reading cookies() makes the page dynamic, which is
 * required anyway — gated content cannot live in a static, cacheable response.
 */
export async function gateAuthorized(): Promise<boolean> {
  const jar = await cookies();

  const gate = jar.get(GATE_COOKIE)?.value;
  if (gate && isGateConfigured() && safeEqual(gate, gateCookieToken())) return true;

  const admin = jar.get(ADMIN_COOKIE)?.value;
  if (admin && isAdminConfigured() && safeEqual(admin, adminCookieToken())) return true;

  return false;
}
