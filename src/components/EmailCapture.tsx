"use client";

import { useState } from "react";

export function EmailCapture({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      // TODO: Connect to email service (ConvertKit, Mailchimp, etc.)
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  const isDark = variant === "dark";

  return (
    <section
      className={`py-28 px-6 text-center relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-ocean to-teal"
          : "bg-white"
      }`}
    >
      {isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(232,115,74,0.1)_0%,transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(240,180,41,0.08)_0%,transparent_40%)]" />
        </div>
      )}

      <div className="max-w-[640px] mx-auto relative z-10">
        <div
          className={`section-label justify-center ${
            isDark ? "text-seafoam before:bg-seafoam" : ""
          }`}
        >
          Join the Club
        </div>
        <h2
          className={`section-title ${isDark ? "text-white" : ""}`}
        >
          Ready to go{" "}
          <em className={`italic ${isDark ? "text-seafoam" : "text-teal"}`}>
            deeper?
          </em>
        </h2>
        <p
          className={`text-[1.05rem] leading-relaxed mb-10 ${
            isDark ? "text-white/60" : "text-[#5a6a7a]"
          }`}
        >
          Get on the list for upcoming courses, weekly dive schedules, and
          community events. No spam — just the stuff that matters.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-[500px] mx-auto mb-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className={`flex-1 px-6 py-4 rounded-full text-[0.95rem] outline-none transition-all ${
              isDark
                ? "bg-white/[0.08] border border-white/20 text-white placeholder:text-white/40 focus:border-seafoam focus:bg-white/[0.12]"
                : "bg-salt border border-deep/10 text-deep placeholder:text-deep/40 focus:border-teal"
            }`}
          />
          <button
            type="submit"
            className={`px-8 py-4 rounded-full font-semibold text-[0.95rem] cursor-pointer transition-all whitespace-nowrap border-none ${
              submitted
                ? "bg-teal text-white"
                : "bg-coral text-white hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(232,115,74,0.4)]"
            }`}
          >
            {submitted ? "You're In! ✓" : "Join →"}
          </button>
        </form>

        <p className={`text-xs ${isDark ? "text-white/35" : "text-deep/35"}`}>
          Free to join. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
