import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieToken, isAdmin, isAdminConfigured } from "@/lib/adminAuth";
import { createHmac, timingSafeEqual } from "crypto";

export const dynamic = "force-dynamic";

/**
 * Brute-force throttling.
 *
 * Without this the endpoint accepts unlimited guesses as fast as they arrive,
 * which matters more the shorter the password is. In-memory per-instance rather
 * than shared state: Vercel reuses a warm instance across requests, so a burst
 * from one source is caught, and the escalating delay makes a sustained attempt
 * expensive even when it lands across several instances. It is a speed bump,
 * not a lock — a distributed attacker spreading guesses across many cold starts
 * would evade it.
 *
 * The stronger version is a shared counter in Supabase keyed on IP. That needs
 * a new table, so it is deliberately deferred; see CLAUDE.md.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const attempts = new Map<string, { count: number; first: number }>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Returns seconds to wait if the caller is locked out, else null. */
function lockedOut(ip: string): number | null {
  const rec = attempts.get(ip);
  if (!rec) return null;
  if (Date.now() - rec.first > WINDOW_MS) {
    attempts.delete(ip);
    return null;
  }
  if (rec.count >= MAX_FAILURES) {
    return Math.ceil((rec.first + WINDOW_MS - Date.now()) / 1000);
  }
  return null;
}

function recordFailure(ip: string): number {
  const rec = attempts.get(ip);
  if (!rec || Date.now() - rec.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: Date.now() });
    return 1;
  }
  rec.count += 1;
  return rec.count;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET — is the caller already signed in? Used by AdminGate on mount. */
export async function GET(req: Request) {
  return NextResponse.json({
    authed: isAdmin(req),
    configured: isAdminConfigured(),
  });
}

/** POST { password } — exchange the admin password for an httpOnly session cookie. */
export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_KEY is not set on this deployment. Add it in the Vercel dashboard." },
      { status: 503 }
    );
  }

  const ip = clientIp(req);

  const wait = lockedOut(ip);
  if (wait !== null) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(wait / 60)} minute(s).` },
      { status: 429, headers: { "Retry-After": String(wait) } }
    );
  }

  let password = "";
  try {
    ({ password } = await req.json());
  } catch {
    return NextResponse.json({ error: "Expected JSON body { password }" }, { status: 400 });
  }

  const key = process.env.ADMIN_KEY!;
  const a = Buffer.from(String(password ?? ""), "utf8");
  const b = Buffer.from(key, "utf8");
  const ok = a.length === b.length && timingSafeEqual(a, b);

  if (!ok) {
    const n = recordFailure(ip);
    // Same shape and timing as a success, minus the cookie.
    createHmac("sha256", key).update("noop").digest("hex");
    // Escalating delay: cheap for a human who fat-fingered it, expensive for a
    // script. Capped so we stay well inside the function timeout.
    await sleep(Math.min(250 * n, 2000));
    return NextResponse.json(
      { error: "Incorrect password", remaining: Math.max(0, MAX_FAILURES - n) },
      { status: 401 }
    );
  }

  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminCookieToken(key), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}

/** DELETE — sign out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
