"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Reveal } from "@/components/Reveal";
import {
  Input,
  Select,
  TextArea,
  SuccessState,
  FormShell,
} from "../FormComponents";

const FORMSPREE = "https://formspree.io/f/mojknqlk";

const COURSES = [
  "AIDA 1 — Introduction to Freediving",
  "AIDA 2 — Open Water Certification",
  "AIDA 3 — Advanced Freediver",
  "Group Ocean Sessions",
  "Private Coaching",
  "Not sure — help me decide",
];

function CourseFormInner() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const course = searchParams.get("course");
    if (course) {
      const map: Record<string, string> = {
        aida1: "AIDA 1 — Introduction to Freediving",
        aida2: "AIDA 2 — Open Water Certification",
        aida3: "AIDA 3 — Advanced Freediver",
        group: "Group Ocean Sessions",
        private: "Private Coaching",
      };
      if (map[course]) setSelectedCourse(map[course]);
    }
  }, [searchParams]);

  return (
    <>
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Course Inquiry
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            Start your training
          </h1>
          <p className="text-lg text-white/60 max-w-[520px] mx-auto leading-relaxed">
            Tell us which course you&apos;re interested in and a bit about your
            experience. We&apos;ll get back to you with dates, pricing, and next steps.
          </p>
        </Reveal>
      </section>

      <section className="bg-salt py-24 px-6">
        <div className="max-w-[640px] mx-auto">
          {submitted ? (
            <Reveal>
              <SuccessState message="We'll be in touch within 24 hours with course details, upcoming dates, and pricing. Check your email!" />
            </Reveal>
          ) : (
            <Reveal>
              <FormShell action={FORMSPREE} formType="course_inquiry" onSuccess={() => setSubmitted(true)}>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="First Name" name="firstName" required placeholder="Your first name" />
                  <Input label="Last Name" name="lastName" required placeholder="Your last name" />
                </div>
                <Input label="Email" name="email" type="email" required placeholder="you@email.com" />
                <Input label="Phone" name="phone" type="tel" placeholder="(optional)" />

                <div>
                  <label className="block text-sm font-medium mb-2">Which course? *</label>
                  <select
                    name="course"
                    required
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors text-sm"
                  >
                    <option value="">Select a course...</option>
                    {COURSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <Select
                  label="Experience level"
                  name="experience"
                  required
                  options={[
                    "Complete beginner — never freedived",
                    "Some experience — snorkeling or casual diving",
                    "Certified freediver (AIDA 2 or equivalent)",
                    "Advanced freediver (AIDA 3+)",
                  ]}
                />

                <Input
                  label="Preferred dates"
                  name="dates"
                  placeholder="e.g. any weekend in April, or specific dates"
                />

                <Select
                  label="How many people?"
                  name="groupSize"
                  options={["Just me", "2 people", "3-4 people", "5+ (group rate)"]}
                />

                <TextArea
                  label="Anything else?"
                  name="message"
                  placeholder="Goals, concerns, questions — whatever's on your mind."
                />
              </FormShell>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-salt" />}>
      <CourseFormInner />
    </Suspense>
  );
}
