"use client";

import { useEffect, useState, ReactNode } from "react";

/**
 * Admin sign-in gate.
 *
 * Replaces the previous per-page pattern of `if (password === SECRET)` where
 * SECRET was a hardcoded `"ljfc"` compiled into the bundle. The password is
 * now checked server-side by POST /api/admin/login, which sets an httpOnly
 * session cookie. Nothing secret ships to the browser.
 *
 * Wrap an admin page's content in this. Once signed in the cookie is sent
 * automatically with every same-origin fetch, so the pages' existing API calls
 * work without passing a key.
 */
export function AdminGate({ children, title = "Admin" }: { children: ReactNode; title?: string }) {
  const [state, setState] = useState<"checking" | "locked" | "open">("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already signed in? The cookie rides along with this request.
  useEffect(() => {
    fetch("/api/admin/login")
      .then((r) => r.json())
      .then((d) => setState(d.authed ? "open" : "locked"))
      .catch(() => setState("locked"));
  }, []);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setState("open");
      else setError(data.error || "Incorrect password");
    } catch {
      setError("Could not reach the server");
    } finally {
      setBusy(false);
    }
  }

  if (state === "open") return <>{children}</>;

  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-6">
      <div className="max-w-[360px] w-full text-center">
        <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-4">
          {title}
        </div>
        <h1 className="font-serif text-3xl text-white mb-2">Sign in</h1>
        <p className="text-white/30 text-sm mb-8">
          {state === "checking" ? "Checking session…" : "Enter the admin password."}
        </p>

        {state === "locked" && (
          <form onSubmit={signIn} className="flex gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Password"
              autoFocus
              autoComplete="current-password"
              className="flex-1 px-5 py-3 rounded-full bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/20 text-center"
            />
            <button
              type="submit"
              disabled={busy || !password}
              className="px-6 py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-default"
            >
              {busy ? "…" : "Enter"}
            </button>
          </form>
        )}

        {error && <p className="text-coral/70 text-xs mt-3">{error}</p>}
      </div>
    </div>
  );
}
