"use client";

import { useState } from "react";
import Link from "next/link";

const KIT_URL = "https://app.kit.com/forms/9207242/subscriptions";

export function SaturdayRSVP() {
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [firstTime, setFirstTime] = useState<boolean | null>(null);
  const [lineDiving, setLineDiving] = useState<boolean | null>(null);
  const [certLevel, setCertLevel] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!email || !name) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("email_address", email);
      formData.append("fields[first_name]", firstName.trim());
      formData.append("fields[last_name]", lastName.trim());
      formData.append("fields[line_diving]", lineDiving ? "yes" : "no");
      formData.append("fields[cert_level]", certLevel || "none");
      formData.append("fields[first_time]", firstTime ? "yes" : "no");
      await fetch(KIT_URL, { method: "POST", body: formData });
    } catch {
      // Kit often succeeds despite CORS
    }

    setSubmitting(false);
    setStep("confirmed");
  };

  if (step === "confirmed") {
    return (
      <div className="bg-deep rounded-2xl p-8 md:p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-seafoam/15 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3db8a4" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-white mb-2">
          You&apos;re in, {firstName}!
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-[400px] mx-auto">
          We&apos;ll confirm Friday based on conditions. Check your email for updates.
          {lineDiving && " We've got you on the dive headcount."}
        </p>

        {firstTime && (
          <div className="bg-coral/10 border border-coral/20 rounded-xl p-6 mb-8 text-left max-w-[400px] mx-auto">
            <div className="text-[11px] text-coral font-medium tracking-[0.15em] uppercase mb-3">
              First time? Do this before Saturday
            </div>
            <div className="space-y-3">
              <Link
                href="/waiver"
                className="flex items-center justify-between bg-white/[0.06] rounded-lg px-4 py-3 no-underline hover:bg-white/[0.1] transition-colors group"
              >
                <span className="text-white/80 text-sm font-medium">Sign your waiver</span>
                <span className="text-coral text-xs group-hover:text-white transition-colors">&rarr;</span>
              </Link>
              <div className="text-white/30 text-xs leading-relaxed px-1">
                Required before your first session. Takes 2 minutes.
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-6 text-left max-w-[400px] mx-auto">
          <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.15em] uppercase mb-3">
            What to bring
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(lineDiving
              ? ["Wetsuit", "Mask + snorkel", "Fins", "Weight belt", "Lanyard", "Towel + water"]
              : ["Towel", "Water", "Sunscreen", "Yoga mat", "Comfortable clothes"]
            ).map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/50 text-xs">
                <span className="text-seafoam/50">&bull;</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <Link
            href="/conditions"
            className="text-seafoam text-xs font-medium no-underline hover:text-white transition-colors border border-seafoam/15 rounded-full px-4 py-2 hover:border-seafoam/30"
          >
            Check conditions &rarr;
          </Link>
          <Link
            href="/gear"
            className="text-white/40 text-xs font-medium no-underline hover:text-white transition-colors border border-white/10 rounded-full px-4 py-2 hover:border-white/20"
          >
            Gear guide
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-deep rounded-2xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl text-white mb-2">
          Register for this Saturday
        </h3>
        <p className="text-white/40 text-sm leading-relaxed">
          We need a headcount — especially for line diving. Register so we can plan safety coverage and confirm conditions Friday.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-[400px] mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            required
            className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/25"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            required
            className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/25"
          />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/25"
        />

        {/* Line diving? */}
        <div className="pt-2">
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
              Yes, I&apos;m diving
            </button>
            <button
              type="button"
              onClick={() => { setLineDiving(false); setCertLevel(""); }}
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

        {/* Cert level — only if diving */}
        {lineDiving && (
          <div>
            <div className="text-white/40 text-xs mb-3">Certification level</div>
            <div className="flex gap-2 flex-wrap">
              {["AIDA 1–2", "AIDA 3+", "Molchanovs W1–2", "Molchanovs W3+", "Other agency"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setCertLevel(level)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    certLevel === level
                      ? "bg-seafoam/15 border-seafoam/30 text-seafoam"
                      : "bg-transparent border-white/10 text-white/40 hover:border-white/20"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* First time? */}
        <div className="pt-2">
          <div className="text-white/40 text-xs mb-3">Is this your first Saturday?</div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFirstTime(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                firstTime === true
                  ? "bg-seafoam/15 border-seafoam/30 text-seafoam"
                  : "bg-transparent border-white/10 text-white/40 hover:border-white/20"
              }`}
            >
              Yes, first time
            </button>
            <button
              type="button"
              onClick={() => setFirstTime(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                firstTime === false
                  ? "bg-seafoam/15 border-seafoam/30 text-seafoam"
                  : "bg-transparent border-white/10 text-white/40 hover:border-white/20"
              }`}
            >
              I&apos;ve been before
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || firstTime === null || lineDiving === null || (lineDiving && !certLevel)}
          className="w-full py-3.5 rounded-full bg-coral text-white font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2"
        >
          {submitting ? "Registering..." : "Register for Saturday →"}
        </button>

        <p className="text-white/20 text-[11px] text-center pt-1">
          Registration helps us plan safety coverage and confirm the session.
        </p>
      </form>
    </div>
  );
}
