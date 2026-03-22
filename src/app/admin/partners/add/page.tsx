"use client";

import { useState } from "react";
import type { PartnerCategory, PartnerPriority } from "@/lib/partner-network";

const SECRET = "ljfc-partners-2026";
const FORMSPREE_URL = "https://formspree.io/f/mojknqlk";

const categories: PartnerCategory[] = [
  "government", "science", "university", "conservation", "grants",
  "community", "education", "military", "business", "tourism", "media", "digital",
];

const priorities: PartnerPriority[] = [
  "this_week", "this_month", "before_camp", "after_camp", "future",
];

export default function AddPartnerPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<PartnerCategory>("business");
  const [priority, setPriority] = useState<PartnerPriority>("this_month");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [whatTheyOffer, setWhatTheyOffer] = useState("");
  const [whatWeOffer, setWhatWeOffer] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [notes, setNotes] = useState("");

  // Check URL param on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("key") === SECRET) {
        setAuthed(true);
      }
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET) setAuthed(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nextStep) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("_form_type", "partner_add");
      formData.append("name", name);
      formData.append("category", category);
      formData.append("priority", priority);
      formData.append("contactName", contactName);
      formData.append("contactEmail", contactEmail);
      formData.append("contactPhone", contactPhone);
      formData.append("whatTheyOffer", whatTheyOffer);
      formData.append("whatWeOffer", whatWeOffer);
      formData.append("nextStep", nextStep);
      formData.append("notes", notes);

      await fetch(FORMSPREE_URL, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      setSubmitted(true);
    } catch {
      // Formspree may still succeed despite CORS
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="max-w-sm w-full">
          <h1 className="font-serif text-2xl text-white mb-6 text-center">
            Add Partner
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter access key"
            className="w-full px-5 py-3 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-seafoam mb-4"
          />
          <button
            type="submit"
            className="w-full px-5 py-3 rounded-lg bg-coral text-white font-medium border-none cursor-pointer hover:bg-coral/90 transition-colors"
          >
            Access Form
          </button>
        </form>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-4xl text-seafoam mb-4 font-serif">Added</div>
          <p className="text-white/60 mb-6">
            Partner submission sent. Add them to partner-network.ts when you&apos;re at your desk.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setCategory("business");
                setPriority("this_month");
                setContactName("");
                setContactEmail("");
                setContactPhone("");
                setWhatTheyOffer("");
                setWhatWeOffer("");
                setNextStep("");
                setNotes("");
              }}
              className="bg-white/[0.08] text-white px-5 py-2.5 rounded-full text-sm border border-white/20 cursor-pointer hover:bg-white/[0.12] transition-colors"
            >
              Add Another
            </button>
            <a
              href="/admin/partners"
              className="bg-coral text-white px-5 py-2.5 rounded-full text-sm font-medium no-underline hover:bg-coral/90 transition-colors"
            >
              Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-seafoam text-sm";
  const labelClass = "text-[11px] text-white/40 font-medium uppercase tracking-wider mb-1.5 block";

  return (
    <div className="min-h-screen bg-deep pt-28 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-2xl text-white">Add Partner</h1>
          <a
            href="/admin/partners"
            className="text-white/40 text-sm no-underline hover:text-white/60 transition-colors"
          >
            &larr; Dashboard
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization or person name"
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PartnerCategory)}
                className={inputClass}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PartnerPriority)}
                className={inputClass}
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Contact Name</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Person to contact"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="(619) 555-0000"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>What They Offer</label>
            <textarea
              value={whatTheyOffer}
              onChange={(e) => setWhatTheyOffer(e.target.value)}
              placeholder="What this partner can provide to LJFC"
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>

          <div>
            <label className={labelClass}>What We Offer</label>
            <textarea
              value={whatWeOffer}
              onChange={(e) => setWhatWeOffer(e.target.value)}
              placeholder="What LJFC can provide to this partner"
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>

          <div>
            <label className={labelClass}>Next Step *</label>
            <textarea
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder="The very next action to take"
              required
              rows={2}
              className={inputClass + " resize-y"}
            />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional context"
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-5 py-3.5 rounded-full bg-coral text-white font-medium border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Add Partner"}
          </button>
        </form>
      </div>
    </div>
  );
}
