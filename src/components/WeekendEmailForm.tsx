"use client";

import { useState } from "react";

const KIT_FORM_ID = "9207242";
const KIT_URL = `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`;

export function WeekendEmailForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    try {
      const fd = new FormData();
      fd.append("email_address", email);
      await fetch(KIT_URL, { method: "POST", body: fd });
    } catch {}
    setDone(true);
    setEmail("");
  };

  if (done) return <div className="text-seafoam text-sm font-medium">You&apos;re in! We&apos;ll confirm Friday night. ✓</div>;

  return (
    <form onSubmit={submit} className="flex flex-col gap-2.5">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none bg-white/[0.06] border border-white/[0.12] text-white placeholder:text-white/30 focus:border-seafoam/40 transition-all"
      />
      <button
        type="submit"
        className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer border-none bg-coral text-white hover:shadow-[0_4px_20px_rgba(199,91,58,0.4)] transition-all"
      >
        Join the crew →
      </button>
    </form>
  );
}
