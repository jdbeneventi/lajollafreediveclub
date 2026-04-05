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
  "AIDA 1 — Discover Freediving ($200, half day)",
  "AIDA 2 — Open Water Certification ($575 group / $800 private)",
  "AIDA 3 — Advanced Freediver ($700 group / $950 private)",
  "Private Coaching ($150/session, 2–3 hrs)",
  "Saturday Ocean Session ($25 drop-in)",
  "Ocean Flow with Lena ($20 drop-in)",
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
        aida1: "AIDA 1 — Discover Freediving ($200, half day)",
        aida2: "AIDA 2 — Open Water Certification ($575 group / $800 private)",
        aida3: "AIDA 3 — Advanced Freediver ($700 group / $950 private)",
        private: "Private Coaching ($150/session, 2–3 hrs)",
        saturday: "Saturday Ocean Session ($25 drop-in)",
        oceanflow: "Ocean Flow with Lena ($20 drop-in)",
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
              <SuccessState
                message="We'll be in touch within 24 hours with course details and available dates. Check your email for a confirmation."
                nextSteps={[
                  ...(selectedCourse.includes("AIDA") ? [
                    { label: "AIDA Medical Statement (PDF)", href: "/documents/aida-medical-statement.pdf" },
                    { label: "AIDA Liability Release (PDF)", href: "/documents/aida-liability-release.pdf" },
                  ] : []),
                  { label: "Sign your LJFC waiver", href: "/waiver" },
                  { label: "View course calendar", href: "/calendar" },
                ]}
              />
            </Reveal>
          ) : (
            <Reveal>
              <FormShell action={FORMSPREE} formType="course_inquiry" onSuccess={async (formData?: FormData) => {
                // Also send to our API for confirmation email + Supabase storage
                if (formData) {
                  try {
                    await fetch("/api/course-inquiry", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        firstName: formData.get("firstName"),
                        lastName: formData.get("lastName"),
                        email: formData.get("email"),
                        phone: formData.get("phone"),
                        course: formData.get("course"),
                        experience: formData.get("experience"),
                        dates: formData.get("dates"),
                        groupSize: formData.get("groupSize"),
                        message: formData.get("message"),
                      }),
                    });
                  } catch {}
                }
                setSubmitted(true);
              }}>
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
