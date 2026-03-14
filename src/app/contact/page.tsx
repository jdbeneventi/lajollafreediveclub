"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";

const interests = [
  "AIDA Certification",
  "Discover Freediving",
  "Group Sessions",
  "Private Coaching",
  "Dry Training",
  "Camp Garibaldi (kids)",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("https://formspree.io/f/mojknqlk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(e.target as HTMLFormElement))) });
    setSubmitted(true);
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Get in Touch
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            Ready to go deeper?
          </h1>
          <p className="text-lg text-white/60 max-w-[520px] mx-auto leading-relaxed">
            Tell us what you&apos;re interested in and we&apos;ll get back to you with
            next steps, upcoming dates, and answers to any questions.
          </p>
        </Reveal>
      </section>

      {/* Form */}
      <section className="bg-salt py-24 px-6">
        <div className="max-w-[640px] mx-auto">
          {submitted ? (
            <Reveal>
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-seafoam/10 flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3db8a4" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="font-serif text-3xl mb-4">You&apos;re on the list!</h2>
                <p className="text-[#5a6a7a] leading-relaxed">
                  We&apos;ll be in touch within 24 hours with more info about the programs
                  you&apos;re interested in. In the meantime, check out our{" "}
                  <a href="/blog" className="text-teal underline">journal</a> for
                  freediving tips and guides.
                </p>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-12 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors"
                    placeholder="you@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors"
                    placeholder="(optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    What are you interested in? *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <label
                        key={interest}
                        className="flex items-center gap-2 px-4 py-2 bg-salt border border-deep/10 rounded-full cursor-pointer hover:border-teal transition-colors has-[:checked]:bg-teal/10 has-[:checked]:border-teal has-[:checked]:text-teal"
                      >
                        <input type="checkbox" name="interests" value={interest} className="sr-only" />
                        <span className="text-sm">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Experience Level
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors">
                    <option>Complete beginner — never freedived</option>
                    <option>Some experience — snorkeling / casual diving</option>
                    <option>Certified freediver (AIDA 2 or equivalent)</option>
                    <option>Advanced freediver (AIDA 3+)</option>
                    <option>Asking for my kid (Camp Garibaldi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Anything else we should know?
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors resize-none"
                    placeholder="Questions, goals, concerns — we want to hear it all."
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full justify-center text-center">
                  Send It →
                </button>

                <p className="text-xs text-center text-[#5a6a7a]">
                  We&apos;ll respond within 24 hours. No spam, no pressure.
                </p>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
