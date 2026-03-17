"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  Input,
  Select,
  TextArea,
  SuccessState,
  FormShell,
} from "./FormComponents";

const FORMSPREE = "https://formspree.io/f/mojknqlk";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Get in Touch
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            Ready to go deeper?
          </h1>
          <p className="text-lg text-white/60 max-w-[520px] mx-auto leading-relaxed">
            General questions, partnership inquiries, or just want to say hello.
            For course bookings or Camp Garibaldi, use the specific forms below.
          </p>
        </Reveal>
      </section>

      <section className="bg-salt py-24 px-6">
        <div className="max-w-[640px] mx-auto">
          {/* Quick links to specific forms */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <Link
              href="/contact/courses"
              className="px-4 py-2 bg-white rounded-full text-sm text-teal font-medium no-underline hover:shadow-sm transition-shadow border border-deep/[0.06]"
            >
              Inquire about a course →
            </Link>
            <Link
              href="/contact/camp"
              className="px-4 py-2 bg-white rounded-full text-sm text-coral font-medium no-underline hover:shadow-sm transition-shadow border border-deep/[0.06]"
            >
              Camp Garibaldi inquiry →
            </Link>
          </div>

          {submitted ? (
            <Reveal>
              <SuccessState />
            </Reveal>
          ) : (
            <Reveal>
              <FormShell action={FORMSPREE} formType="general" onSuccess={() => setSubmitted(true)}>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="First Name" name="firstName" required placeholder="Your first name" />
                  <Input label="Last Name" name="lastName" required placeholder="Your last name" />
                </div>
                <Input label="Email" name="email" type="email" required placeholder="you@email.com" />
                <Input label="Phone" name="phone" type="tel" placeholder="(optional)" />
                <Select
                  label="What brings you here?"
                  name="topic"
                  options={[
                    "General question",
                    "Partnership / collaboration",
                    "Gear advice",
                    "Group / corporate event",
                    "Media / press",
                    "Other",
                  ]}
                />
                <TextArea
                  label="Your message"
                  name="message"
                  placeholder="Tell us what's on your mind."
                />
              </FormShell>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
