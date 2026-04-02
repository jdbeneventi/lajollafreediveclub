"use client";

import { useState } from "react";
import Link from "next/link";

export default function SaturdayConfirmPage() {
  const [email, setEmail] = useState("");
  const [lineDiving, setLineDiving] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || lineDiving === null) return;
    setSubmitting(true);

    try {
      await fetch("/api/saturday-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lineDiving }),
      });
    } catch {
      // Still show confirmed
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="bg-deep min-h-screen flex items-center justify-center px-6">
        <div className="max-w-[440px] text-center">
          <div className="w-14 h-14 rounded-full bg-seafoam/15 flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3db8a4" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-white mb-3">See you tomorrow!</h1>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            {lineDiving
              ? "You're confirmed for line diving. Show up at 7:00 for the full morning or 8:30 for diving."
              : "You're confirmed for the beach session. See you at 7:00 at Kellogg Park."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/conditions"
              className="text-seafoam text-sm font-medium no-underline hover:text-white transition-colors border border-seafoam/15 rounded-full px-5 py-2.5"
            >
              Check conditions &rarr;
            </Link>
            <Link
              href="/saturday-sessions"
              className="text-white/40 text-sm font-medium no-underline hover:text-white transition-colors border border-white/10 rounded-full px-5 py-2.5"
            >
              Saturday info
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-deep min-h-screen flex items-center justify-center px-6">
      <div className="max-w-[440px] w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-white mb-2">Confirm for Saturday</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            We need a final headcount for safety coverage. Takes 10 seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/25"
          />

          <div>
            <div className="text-white/40 text-xs mb-3">Will you be line diving?</div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLineDiving(true)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                  lineDiving === true
                    ? "bg-seafoam/15 border-seafoam/30 text-seafoam"
                    : "bg-transparent border-white/10 text-white/40 hover:border-white/20"
                }`}
              >
                Yes, diving
              </button>
              <button
                type="button"
                onClick={() => setLineDiving(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                  lineDiving === false
                    ? "bg-seafoam/15 border-seafoam/30 text-seafoam"
                    : "bg-transparent border-white/10 text-white/40 hover:border-white/20"
                }`}
              >
                Beach only
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !email || lineDiving === null}
            className="w-full py-3.5 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Confirming..." : "I'm coming →"}
          </button>
        </form>
      </div>
    </section>
  );
}
