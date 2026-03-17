"use client";

import { useState } from "react";

const KIT_FORM_ID = "9207242";
const KIT_URL = `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`;

export function ConditionsEmailForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    try {
      const formData = new FormData();
      formData.append("email_address", email);
      await fetch(KIT_URL, { method: "POST", body: formData });
    } catch {
      // Kit often succeeds despite CORS
    }

    setSubmitted(true);
    setEmail("");
  };

  if (submitted) {
    return (
      <div className="text-seafoam text-sm font-medium">
        You&apos;re subscribed! ✓
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 px-5 py-3 rounded-full text-sm outline-none bg-white/[0.08] border border-white/20 text-white placeholder:text-white/40 focus:border-seafoam focus:bg-white/[0.12] transition-all"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-full font-semibold text-sm cursor-pointer border-none bg-coral text-white hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all whitespace-nowrap"
      >
        Subscribe →
      </button>
    </form>
  );
}
