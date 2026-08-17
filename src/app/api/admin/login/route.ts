import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieToken, isAdmin, isAdminConfigured } from "@/lib/adminAuth";
import { createHmac, timingSafeEqual } from "crypto";
import { createLoginThrottle, clientIp, sleep } from "@/lib/loginThrottle";

export const dynamic = "force-dynamic";

// Brute-force throttling — shared implementation in src/lib/loginThrottle.ts.
// Own instance: failing at the page gate must never lock the admin login.
const throttle = createLoginThrottle();

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

  const wait = throttle.lockedOut(ip);
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

  // Trimmed for the same reason as in adminAuth.ts — a paste artifact in the
  // Vercel env value must not lock the correct password out.
  const key = process.env.ADMIN_KEY!.trim();
  const a = Buffer.from(String(password ?? ""), "utf8");
  const b = Buffer.from(key, "utf8");
  const ok = a.length === b.length && timingSafeEqual(a, b);

  if (!ok) {
    const n = throttle.recordFailure(ip);
    // Same shape and timing as a success, minus the cookie.
    createHmac("sha256", key).update("noop").digest("hex");
    // Escalating delay: cheap for a human who fat-fingered it, expensive for a
    // script. Capped so we stay well inside the function timeout.
    await sleep(throttle.failureDelayMs(n));
    return NextResponse.json(
      { error: "Incorrect password", remaining: Math.max(0, throttle.maxFailures - n) },
      { status: 401 }
    );
  }

  throttle.clear(ip);
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
