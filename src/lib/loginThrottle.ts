/**
 * Brute-force throttling, shared by the admin login and the page gate.
 *
 * In-memory per serverless instance rather than shared state: Vercel reuses a
 * warm instance across requests, so a burst from one source is caught, and the
 * escalating delay makes a sustained attempt expensive even when it lands
 * across several instances. It is a speed bump, not a lock — a distributed
 * attacker spreading guesses across many cold starts would evade it. The
 * stronger version is a shared counter in Supabase keyed on IP; deliberately
 * deferred, see CLAUDE.md.
 *
 * Each route creates its own throttle so counters never bleed between
 * endpoints — failing at the page gate must not lock the admin login.
 */

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function createLoginThrottle({
  windowMs = 15 * 60 * 1000,
  maxFailures = 8,
  baseDelayMs = 250,
  maxDelayMs = 2000,
} = {}) {
  const attempts = new Map<string, { count: number; first: number }>();

  return {
    maxFailures,

    /** Seconds to wait if the caller is locked out, else null. */
    lockedOut(ip: string): number | null {
      const rec = attempts.get(ip);
      if (!rec) return null;
      if (Date.now() - rec.first > windowMs) {
        attempts.delete(ip);
        return null;
      }
      if (rec.count >= maxFailures) {
        return Math.ceil((rec.first + windowMs - Date.now()) / 1000);
      }
      return null;
    },

    /** Records a failure and returns the new count. */
    recordFailure(ip: string): number {
      const rec = attempts.get(ip);
      if (!rec || Date.now() - rec.first > windowMs) {
        attempts.set(ip, { count: 1, first: Date.now() });
        return 1;
      }
      rec.count += 1;
      return rec.count;
    },

    /** Escalating delay for the nth failure: cheap for a fat-finger, expensive for a script. */
    failureDelayMs(n: number): number {
      return Math.min(baseDelayMs * n, maxDelayMs);
    },

    clear(ip: string): void {
      attempts.delete(ip);
    },
  };
}
