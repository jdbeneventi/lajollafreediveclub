import { NextResponse } from "next/server";
import { GATE_COOKIE, gateCodeMatches, gateCookieToken, isGateConfigured } from "@/lib/gate";
import { createLoginThrottle, clientIp, sleep } from "@/lib/loginThrottle";

export const dynamic = "force-dynamic";

// Own throttle instance: failing here must never lock the admin login, and
// vice versa.
const throttle = createLoginThrottle();

/** POST { code } — exchange the page code for a long-lived httpOnly cookie. */
export async function POST(req: Request) {
  if (!isGateConfigured()) {
    return NextResponse.json(
      { error: "GATE_CODE is not set on this deployment. Add it in the Vercel dashboard." },
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

  let code = "";
  try {
    ({ code } = await req.json());
  } catch {
    return NextResponse.json({ error: "Expected JSON body { code }" }, { status: 400 });
  }

  if (!gateCodeMatches(code)) {
    const n = throttle.recordFailure(ip);
    await sleep(throttle.failureDelayMs(n));
    return NextResponse.json(
      { error: "Incorrect code", remaining: Math.max(0, throttle.maxFailures - n) },
      { status: 401 }
    );
  }

  throttle.clear(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(GATE_COOKIE, gateCookieToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // These pages are shared with partners who open them occasionally; the old
    // client gate forgot on every reload, which was the worst of both worlds.
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

/** DELETE — forget the gate cookie. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(GATE_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
