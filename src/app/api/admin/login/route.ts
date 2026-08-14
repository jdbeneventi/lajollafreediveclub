import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieToken, isAdmin, isAdminConfigured } from "@/lib/adminAuth";
import { createHmac, timingSafeEqual } from "crypto";

export const dynamic = "force-dynamic";

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
    // Same shape and timing as a success, minus the cookie.
    createHmac("sha256", key).update("noop").digest("hex");
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

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
