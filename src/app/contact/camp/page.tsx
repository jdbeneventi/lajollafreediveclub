"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import {
  Input,
  Select,
  TextArea,
  SuccessState,
  FormShell,
} from "../FormComponents";

const FORMSPREE = "https://formspree.io/f/mojknqlk";

export default function CampPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-coral before:bg-coral justify-center">
            Camp Garibaldi
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            The ocean camp that starts
            <br />
            <em className="italic text-coral">from the inside out</em>
          </h1>
          <p className="text-lg text-white/60 max-w-[520px] mx-auto leading-relaxed">
            A week-long program for kids ages 8-16. Freediving, surf survival,
            and water confidence through breath-first training.
          </p>
        </Reveal>
      </section>

      <section className="bg-salt py-24 px-6">
        <div className="max-w-[640px] mx-auto">
          {submitted ? (
            <Reveal>
              <SuccessState
                message="We'll be in touch within 24 hours with session dates, pricing, and everything you need to get your camper ready."
                nextSteps={[
                  { label: "Read about Camp Garibaldi", href: "/camp-garibaldi" },
                  { label: "Meet the instructor", href: "/about" },
                ]}
              />
            </Reveal>
          ) : (
            <Reveal>
              <FormShell action={FORMSPREE} formType="camp_garibaldi" onSuccess={() => setSubmitted(true)}>
                {/* Parent info */}
                <div className="pb-4 mb-2 border-b border-deep/[0.06]">
                  <h3 className="text-sm font-semibold text-[#5a6a7a] uppercase tracking-wider">Parent / Guardian</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Your Name" name="parentName" required placeholder="Full name" />
                  <Input label="Phone" name="parentPhone" type="tel" required placeholder="Best contact number" />
                </div>
                <Input label="Email" name="email" type="email" required placeholder="you@email.com" />

                {/* Child info */}
                <div className="pb-4 mb-2 border-b border-deep/[0.06] pt-4">
                  <h3 className="text-sm font-semibold text-[#5a6a7a] uppercase tracking-wider">Camper</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Child's Name" name="childName" required placeholder="First name" />
                  <Select
                    label="Age"
                    name="childAge"
                    required
                    options={["8", "9", "10", "11", "12", "13", "14", "15", "16"]}
                  />
                </div>

                <Select
                  label="Swimming ability"
                  name="swimLevel"
                  required
                  options={[
                    "Can swim but not very confident",
                    "Comfortable swimmer",
                    "Strong swimmer / swim team",
                    "Very strong — comfortable in ocean",
                  ]}
                />

                <Select
                  label="Ocean experience"
                  name="oceanExperience"
                  options={[
                    "Minimal — mostly pools",
                    "Some beach time but cautious in waves",
                    "Comfortable in the ocean",
                    "Experienced — surfs, snorkels, or body surfs regularly",
                  ]}
                />

                <Select
                  label="Session preference"
                  name="session"
                  options={[
                    "Summer 2026 — any week",
                    "Summer 2026 — specific week (tell us below)",
                    "Not sure yet — just exploring",
                  ]}
                />

                <TextArea
                  label="Anything we should know?"
                  name="message"
                  placeholder="Allergies, concerns, specific goals for your child, preferred dates, etc."
                />
              </FormShell>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
