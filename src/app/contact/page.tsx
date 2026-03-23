"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  Input,
  TextArea,
  SuccessState,
  FormShell,
} from "./FormComponents";

const FORMSPREE = "https://formspree.io/f/mojknqlk";

const inquiryTypes = [
  {
    label: "I want to learn to freedive",
    href: "/contact/courses",
    desc: "AIDA 1, 2, 3 courses and private coaching",
    color: "bg-teal",
    textColor: "text-teal",
    borderColor: "border-teal/20",
  },
  {
    label: "Camp Garibaldi for my kid",
    href: "/contact/camp",
    desc: "Ages 8–16, week-long ocean camp",
    color: "bg-coral",
    textColor: "text-coral",
    borderColor: "border-coral/20",
  },
  {
    label: "Saturday ocean session",
    href: "/contact/courses?course=saturday",
    desc: "Weekly group dive, $25 drop-in",
    color: "bg-ocean",
    textColor: "text-ocean",
    borderColor: "border-ocean/20",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Get Started
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            What are you looking for?
          </h1>
          <p className="text-lg text-white/60 max-w-[520px] mx-auto leading-relaxed">
            Pick the path that fits, or scroll down for general inquiries.
          </p>
        </Reveal>
      </section>

      {/* Quick-route cards */}
      <section className="bg-salt py-16 px-6">
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {inquiryTypes.map((t) => (
                <Link
                  key={t.label}
                  href={t.href}
                  className={`block bg-white rounded-2xl p-6 no-underline text-deep border ${t.borderColor} hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(10,22,40,0.08)] transition-all group`}
                >
                  <div className={`w-2 h-2 rounded-full ${t.color} mb-4`} />
                  <div className={`font-semibold text-[0.95rem] mb-1.5 group-hover:${t.textColor} transition-colors`}>
                    {t.label}
                  </div>
                  <div className="text-xs text-[#5a6a7a]">{t.desc}</div>
                  <div className="text-teal text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    Go &rarr;
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* General form */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[640px] mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl tracking-tight mb-2">
                Something else?
              </h2>
              <p className="text-sm text-[#5a6a7a]">
                Partnerships, media, group events, or just want to connect.
              </p>
            </div>
          </Reveal>

          {submitted ? (
            <Reveal>
              <SuccessState />
            </Reveal>
          ) : (
            <Reveal>
              <FormShell action={FORMSPREE} formType="general" onSuccess={() => setSubmitted(true)}>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Name" name="name" required placeholder="Your name" />
                  <Input label="Email" name="email" type="email" required placeholder="you@email.com" />
                </div>
                <Input label="Subject" name="subject" required placeholder="What's this about?" />
                <TextArea
                  label="Message"
                  name="message"
                  required
                  placeholder="Tell us what you're thinking."
                />
              </FormShell>
            </Reveal>
          )}

          {/* Direct contact fallback */}
          <Reveal delay={60}>
            <div className="mt-10 text-center">
              <p className="text-sm text-[#5a6a7a] mb-2">
                Prefer email? Reach Joshua directly:
              </p>
              <a
                href="mailto:joshuabeneventi@gmail.com"
                className="text-teal font-medium text-sm no-underline hover:underline"
              >
                joshuabeneventi@gmail.com
              </a>
              <p className="text-xs text-[#5a6a7a] mt-6">
                Follow us{" "}
                <a
                  href="https://instagram.com/lajollafreedive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal no-underline hover:underline"
                >
                  @lajollafreedive
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
