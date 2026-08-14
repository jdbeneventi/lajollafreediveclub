/**
 * Client-side helpers for admin sign-in.
 *
 * Previously each admin page compared the typed password against a `SECRET`
 * constant that was compiled into the bundle. The password is now verified
 * server-side, which sets an httpOnly session cookie; nothing secret ships to
 * the browser. Every subsequent same-origin fetch carries the cookie, so the
 * pages' existing API calls keep working unchanged.
 */

/** Exchange a password for a session cookie. Returns true on success. */
export async function adminLogin(password: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Is there already a valid admin session? Replaces the old ?key= auto-unlock. */
export async function adminSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/login");
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.authed);
  } catch {
    return false;
  }
}
