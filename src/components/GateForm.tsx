"use client";

import { useState } from "react";

/**
 * Client half of the server-side page gate — visually identical to the old
 * PasswordGate, but the code is verified by POST /api/gate, which sets an
 * httpOnly cookie. On success the page reloads and the server, now seeing the
 * cookie, renders the real content. Until then the content has never left the
 * server. See src/lib/gate.ts.
 */
export function GateForm() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Incorrect code.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-6">
      <div className="max-w-[360px] w-full text-center">
        <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-4">
          Private
        </div>
        <h1 className="font-serif text-3xl text-white mb-2">Enter code</h1>
        <p className="text-white/30 text-sm mb-8">This page is invite-only.</p>
        <form onSubmit={submit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="Code"
            autoFocus
            className="flex-1 px-5 py-3 rounded-full bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/20 text-center tracking-widest"
          />
          <button
            type="submit"
            disabled={busy}
            className="px-6 py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all disabled:opacity-40"
          >
            {busy ? "…" : "Enter"}
          </button>
        </form>
        {error && <p className="text-coral/70 text-xs mt-3">{error}</p>}
      </div>
    </div>
  );
}
