"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginInner() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const errorParam = params.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Try again.");
    }

    setSending(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <div className="max-w-[400px] text-center">
          <div className="w-14 h-14 rounded-full bg-seafoam/15 flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3db8a4" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-white mb-3">Check your email</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            We sent a login link to <strong className="text-white/70">{email}</strong>.
            Click the link to sign in — it expires in 15 minutes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-6">
      <div className="max-w-[380px] w-full">
        <div className="text-center mb-8">
          <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-2">
            La Jolla Freedive Club
          </div>
          <h1 className="font-serif text-3xl text-white mb-2">Student Portal</h1>
          <p className="text-white/40 text-sm">
            Sign in with your email — no password needed.
          </p>
        </div>

        {errorParam === "invalid" && (
          <div className="bg-coral/15 border border-coral/30 rounded-xl p-4 mb-6 text-coral text-sm text-center">
            Invalid or expired link. Request a new one.
          </div>
        )}
        {errorParam === "expired" && (
          <div className="bg-coral/15 border border-coral/30 rounded-xl p-4 mb-6 text-coral text-sm text-center">
            Link expired. Request a new one.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/25"
          />
          <button
            type="submit"
            disabled={sending || !email}
            className="w-full py-3.5 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send login link →"}
          </button>
        </form>

        {error && (
          <p className="text-coral text-sm text-center mt-4">{error}</p>
        )}

        <p className="text-white/20 text-xs text-center mt-6">
          We&apos;ll email you a secure link. No password to remember.
        </p>
      </div>
    </div>
  );
}

export function PortalLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep" />}>
      <LoginInner />
    </Suspense>
  );
}
