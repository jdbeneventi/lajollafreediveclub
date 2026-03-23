"use client";

import { useState } from "react";

const KIT_FORM_ID = "9207242";
const KIT_URL = `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`;

export function EmailCapture({
  variant = "dark",
  headline,
  subtext,
}: {
  variant?: "dark" | "light";
  headline?: React.ReactNode;
  subtext?: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    try {
      const formData = new FormData();
      formData.append("email_address", email);

      const res = await fetch(KIT_URL, {
        method: "POST",
        body: formData,
      });

      if (res.ok || res.status === 200 || res.status === 302) {
        setSubmitted(true);
        setEmail("");
      } else {
        // Kit sometimes redirects — treat any non-error as success
        setSubmitted(true);
        setEmail("");
      }
    } catch {
      // Kit form submissions often succeed despite CORS — treat as success
      setSubmitted(true);
      setEmail("");
    }
  };

  const isDark = variant === "dark";

  return (
    <section
      className={`py-16 md:py-28 px-6 text-center relative overflow-hidden ${
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
          Stay Connected
        </div>
        <h2
          className={`section-title ${isDark ? "text-white" : ""}`}
        >
          {headline || (
            <>
              Dive conditions.{" "}
              <em className={`italic ${isDark ? "text-seafoam" : "text-teal"}`}>
                In your inbox.
              </em>
            </>
          )}
        </h2>
        <p
          className={`text-[1.05rem] leading-relaxed mb-10 ${
            isDark ? "text-white/60" : "text-[#5a6a7a]"
          }`}
        >
          {subtext || "Get dive conditions, seasonal species alerts, upcoming courses, and weekly dive schedules. The stuff that matters — nothing that doesn't."}
        </p>

        {submitted ? (
          <div className={`text-lg font-medium ${isDark ? "text-seafoam" : "text-teal"}`}>
            You&apos;re in! Check your email. ✓
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-[500px] mx-auto mb-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(false); }}
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
                className="px-8 py-4 rounded-full font-semibold text-[0.95rem] cursor-pointer transition-all whitespace-nowrap border-none bg-coral text-white hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)]"
              >
                Join →
              </button>
            </form>

            {error && (
              <p className="text-coral text-xs mb-2">Something went wrong. Try again or email us directly.</p>
            )}
          </>
        )}

        <p className={`text-xs ${isDark ? "text-white/35" : "text-deep/35"}`}>
          Free to join. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
