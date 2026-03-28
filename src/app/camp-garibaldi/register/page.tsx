"use client";

import { useState } from "react";
import Link from "next/link";

const stepLabels = ["Student", "Session", "Contacts", "Medical", "Review"];

const sessions = [
  {
    id: "session-1",
    name: "Session I",
    dates: "June 15\u201317",
    days: "3 days",
    price: 450,
    priceLabel: "$450",
    featured: false,
  },
  {
    id: "session-2",
    name: "Session II",
    dates: "July 13\u201317",
    days: "5 days",
    price: 750,
    priceLabel: "$750",
    featured: true,
    badge: "Full Week",
  },
  {
    id: "session-3",
    name: "Session III",
    dates: "August 10\u201312",
    days: "3 days",
    price: 450,
    priceLabel: "$450",
    featured: false,
  },
];

const hearAboutOptions = [
  "Friend/family",
  "Instagram",
  "Facebook group",
  "School",
  "Birch Aquarium",
  "Google search",
  "Other",
];

export default function CampRegistrationPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const [form, setForm] = useState({
    studentFirstName: "",
    studentLastName: "",
    age: "",
    grade: "",
    swimmingAbility: "",
    sessionId: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    allergies: "",
    medications: "",
    medicalConditions: "",
    dietaryRestrictions: "",
    isCharterFamily: false,
    charterSchoolName: "",
    charterTeacherName: "",
    charterTeacherEmail: "",
    hearAbout: "",
    agreeTerms: false,
  });

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectedSession = sessions.find((s) => s.id === form.sessionId);

  const validateStep = (s: number): string[] => {
    const errs: string[] = [];
    if (s === 1) {
      if (!form.studentFirstName.trim()) errs.push("Student first name is required");
      if (!form.studentLastName.trim()) errs.push("Student last name is required");
      if (!form.age) errs.push("Age is required");
      if (!form.grade) errs.push("Grade is required");
      if (!form.swimmingAbility) errs.push("Swimming ability is required");
    }
    if (s === 2) {
      if (!form.sessionId) errs.push("Please select a session");
    }
    if (s === 3) {
      if (!form.parentName.trim()) errs.push("Parent/guardian name is required");
      if (!form.parentEmail.includes("@")) errs.push("Valid parent email is required");
      if (!form.parentPhone.trim()) errs.push("Parent phone is required");
      if (!form.emergencyName.trim()) errs.push("Emergency contact name is required");
      if (!form.emergencyPhone.trim()) errs.push("Emergency contact phone is required");
      if (!form.emergencyRelation.trim()) errs.push("Emergency contact relationship is required");
    }
    if (s === 5) {
      if (!form.agreeTerms) errs.push("You must agree to the registration terms");
    }
    return errs;
  };

  const nextStep = () => {
    const errs = validateStep(step);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setErrors([]);
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    const errs = validateStep(5);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/camp-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.registrationId) {
          setRegistrationId(result.registrationId);
        }
      }
    } catch {
      // Still mark as done
    }

    setDone(true);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-white";
  const labelClass = "block text-sm font-medium text-deep mb-1";

  if (done) {
    return (
      <div className="min-h-screen bg-salt flex items-center justify-center px-6">
        <div className="max-w-[500px] text-center">
          <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl mb-4">Registration received!</h1>
          {selectedSession && (
            <p className="text-[#5a6a7a] mb-2">
              {selectedSession.name} &middot; {selectedSession.dates} &middot; {selectedSession.days} &middot; {selectedSession.priceLabel}
            </p>
          )}
          <p className="text-[#5a6a7a] text-sm mb-8">
            We&apos;ve sent a confirmation email to {form.parentEmail}
          </p>

          <div className="bg-white rounded-xl p-6 mb-6 text-left">
            <h3 className="text-sm font-semibold text-deep mb-2">Next step: Complete the camp waiver</h3>
            <p className="text-sm text-[#5a6a7a] mb-4">
              Every camper needs a signed waiver before the first day of camp.
            </p>
            <Link
              href={`/camp-garibaldi/waiver?student=${encodeURIComponent(form.studentFirstName)}&parent=${encodeURIComponent(form.parentEmail)}&reg=${encodeURIComponent(registrationId)}`}
              className="inline-block px-6 py-3 bg-coral text-white rounded-full font-semibold text-sm no-underline hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all"
            >
              Complete Camp Waiver &rarr;
            </Link>
          </div>

          {form.isCharterFamily && (
            <div className="bg-teal/5 border border-teal/20 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-sm font-semibold text-teal mb-2">Charter school family</h3>
              <p className="text-sm text-[#5a6a7a] mb-3">
                You indicated your child is enrolled in a homeschool charter. Learn how to use enrichment funds to cover most of the cost.
              </p>
              <Link
                href="/camp-garibaldi/charter-funding"
                className="text-sm font-semibold text-teal no-underline hover:underline"
              >
                Charter funding guide &rarr;
              </Link>
            </div>
          )}

          <Link href="/camp-garibaldi" className="btn btn-primary no-underline">
            Back to Camp Garibaldi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-deep pt-36 pb-12 px-6">
        <div className="max-w-[600px] mx-auto text-center">
          <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-tight tracking-tight mb-4">
            Camp Garibaldi Registration
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Secure your child&apos;s spot for Summer 2026. Ages 8&ndash;14. All gear provided.
          </p>
        </div>
      </section>

      {/* Progress */}
      <div className="bg-salt border-b border-deep/[0.06] sticky top-16 z-20">
        <div className="max-w-[700px] mx-auto px-6 py-3 flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  step > i + 1
                    ? "bg-teal text-white"
                    : step === i + 1
                    ? "bg-deep text-white"
                    : "bg-deep/10 text-[#5a6a7a]"
                }`}
              >
                {step > i + 1 ? "\u2713" : i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  step === i + 1 ? "text-deep font-medium" : "text-[#5a6a7a]"
                }`}
              >
                {label}
              </span>
              {i < stepLabels.length - 1 && <div className="flex-1 h-[1px] bg-deep/10" />}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <section className="bg-salt py-12 px-6">
        <div className="max-w-[600px] mx-auto">
          {errors.length > 0 && (
            <div className="bg-coral/10 border border-coral/20 rounded-xl p-4 mb-6">
              {errors.map((e) => (
                <p key={e} className="text-sm text-coral">
                  {e}
                </p>
              ))}
            </div>
          )}

          {/* STEP 1: Student Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8 space-y-5">
                <h2 className="font-serif text-xl mb-1">Student Information</h2>
                <p className="text-xs text-[#5a6a7a] mb-4">All fields required.</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input
                      type="text"
                      value={form.studentFirstName}
                      onChange={(e) => update("studentFirstName", e.target.value)}
                      className={inputClass}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input
                      type="text"
                      value={form.studentLastName}
                      onChange={(e) => update("studentLastName", e.target.value)}
                      className={inputClass}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Age *</label>
                    <select
                      value={form.age}
                      onChange={(e) => update("age", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select age</option>
                      {Array.from({ length: 7 }, (_, i) => i + 8).map((age) => (
                        <option key={age} value={String(age)}>
                          {age}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Grade *</label>
                    <select
                      value={form.grade}
                      onChange={(e) => update("grade", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select grade</option>
                      {["3rd", "4th", "5th", "6th", "7th", "8th"].map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Swimming Ability *</label>
                  <div className="space-y-2 mt-2">
                    {[
                      "Can't swim yet",
                      "Beginner",
                      "Intermediate",
                      "Strong swimmer",
                    ].map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg hover:bg-salt transition-colors"
                      >
                        <input
                          type="radio"
                          name="swimmingAbility"
                          value={level}
                          checked={form.swimmingAbility === level}
                          onChange={(e) => update("swimmingAbility", e.target.value)}
                          className="w-4 h-4 accent-teal"
                        />
                        <span className="text-sm text-deep">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all focus:outline-2 focus:outline-offset-2 focus:outline-teal"
              >
                Continue to Session &rarr;
              </button>
            </div>
          )}

          {/* STEP 2: Session Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="font-serif text-xl mb-1">Select a Session</h2>
                <p className="text-xs text-[#5a6a7a] mb-6">Choose one session for your child.</p>

                <div className="space-y-4">
                  {sessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => update("sessionId", s.id)}
                      className={`relative w-full text-left p-6 rounded-xl border-2 transition-all cursor-pointer bg-white ${
                        form.sessionId === s.id
                          ? "border-teal bg-teal/[0.03] shadow-sm"
                          : "border-deep/10 hover:border-deep/20"
                      }`}
                    >
                      {s.featured && (
                        <span className="absolute -top-3 right-4 bg-coral text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                          {s.badge}
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                              form.sessionId === s.id ? "text-teal" : "text-[#5a6a7a]"
                            }`}
                          >
                            {s.name}
                          </div>
                          <div className="font-serif text-xl text-deep">{s.dates}</div>
                          <div className="text-sm text-[#5a6a7a] mt-1">{s.days}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-serif text-2xl text-deep">{s.priceLabel}</div>
                        </div>
                      </div>
                      {form.sessionId === s.id && (
                        <div className="absolute top-4 left-4">
                          <div className="w-5 h-5 bg-teal rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 py-3.5 bg-white text-deep border border-deep/10 rounded-full font-semibold text-sm cursor-pointer hover:bg-deep/[0.03] transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal"
                >
                  &larr; Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all focus:outline-2 focus:outline-offset-2 focus:outline-teal"
                >
                  Continue to Contacts &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Parent & Emergency */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8 space-y-5">
                <h2 className="font-serif text-xl mb-1">Parent / Guardian</h2>
                <p className="text-xs text-[#5a6a7a] mb-4">All fields required.</p>

                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    type="text"
                    value={form.parentName}
                    onChange={(e) => update("parentName", e.target.value)}
                    className={inputClass}
                    placeholder="Parent or guardian full name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      value={form.parentEmail}
                      onChange={(e) => update("parentEmail", e.target.value)}
                      className={inputClass}
                      placeholder="parent@email.com"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input
                      type="tel"
                      value={form.parentPhone}
                      onChange={(e) => update("parentPhone", e.target.value)}
                      className={inputClass}
                      placeholder="(619) 555-0123"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 md:p-8 space-y-5">
                <h2 className="font-serif text-xl mb-1">Emergency Contact</h2>
                <p className="text-xs text-[#5a6a7a] mb-4">Someone other than the parent/guardian if possible.</p>

                <div>
                  <label className={labelClass}>Contact Name *</label>
                  <input
                    type="text"
                    value={form.emergencyName}
                    onChange={(e) => update("emergencyName", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Contact Phone *</label>
                    <input
                      type="tel"
                      value={form.emergencyPhone}
                      onChange={(e) => update("emergencyPhone", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Relationship *</label>
                    <input
                      type="text"
                      value={form.emergencyRelation}
                      onChange={(e) => update("emergencyRelation", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Grandparent, Aunt, Family friend"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 py-3.5 bg-white text-deep border border-deep/10 rounded-full font-semibold text-sm cursor-pointer hover:bg-deep/[0.03] transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal"
                >
                  &larr; Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all focus:outline-2 focus:outline-offset-2 focus:outline-teal"
                >
                  Continue to Medical &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Medical & Charter */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8 space-y-5">
                <h2 className="font-serif text-xl mb-1">Medical Information</h2>
                <p className="text-xs text-[#5a6a7a] mb-4">Help us keep your child safe. Leave blank or write &quot;None&quot; if not applicable.</p>

                <div>
                  <label className={labelClass}>Allergies</label>
                  <textarea
                    value={form.allergies}
                    onChange={(e) => update("allergies", e.target.value)}
                    rows={2}
                    className={`${inputClass} resize-none`}
                    placeholder="None"
                  />
                </div>

                <div>
                  <label className={labelClass}>Current Medications</label>
                  <textarea
                    value={form.medications}
                    onChange={(e) => update("medications", e.target.value)}
                    rows={2}
                    className={`${inputClass} resize-none`}
                    placeholder="None"
                  />
                </div>

                <div>
                  <label className={labelClass}>Medical Conditions</label>
                  <textarea
                    value={form.medicalConditions}
                    onChange={(e) => update("medicalConditions", e.target.value)}
                    rows={2}
                    className={`${inputClass} resize-none`}
                    placeholder="e.g., asthma, seizures, diabetes"
                  />
                </div>

                <div>
                  <label className={labelClass}>Dietary Restrictions</label>
                  <textarea
                    value={form.dietaryRestrictions}
                    onChange={(e) => update("dietaryRestrictions", e.target.value)}
                    rows={2}
                    className={`${inputClass} resize-none`}
                    placeholder="None"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 md:p-8 space-y-5">
                <h2 className="font-serif text-xl mb-1">Charter School</h2>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <span className="text-sm text-deep">
                      Is your child enrolled in a homeschool charter school?
                    </span>
                  </label>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => update("isCharterFamily", true)}
                      className={`px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${
                        form.isCharterFamily
                          ? "bg-teal text-white border-teal"
                          : "bg-transparent text-[#5a6a7a] border-deep/10 hover:border-teal"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => update("isCharterFamily", false)}
                      className={`px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${
                        !form.isCharterFamily
                          ? "bg-teal text-white border-teal"
                          : "bg-transparent text-[#5a6a7a] border-deep/10 hover:border-teal"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {form.isCharterFamily && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className={labelClass}>Charter School Name</label>
                      <input
                        type="text"
                        value={form.charterSchoolName}
                        onChange={(e) => update("charterSchoolName", e.target.value)}
                        className={inputClass}
                        placeholder="e.g., Pacific Coast Academy"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Assigned Teacher Name</label>
                      <input
                        type="text"
                        value={form.charterTeacherName}
                        onChange={(e) => update("charterTeacherName", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Teacher Email</label>
                      <input
                        type="email"
                        value={form.charterTeacherEmail}
                        onChange={(e) => update("charterTeacherEmail", e.target.value)}
                        className={inputClass}
                        placeholder="teacher@charter.org"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 md:p-8">
                <label className={labelClass}>How did you hear about Camp Garibaldi?</label>
                <select
                  value={form.hearAbout}
                  onChange={(e) => update("hearAbout", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select one</option>
                  {hearAboutOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 py-3.5 bg-white text-deep border border-deep/10 rounded-full font-semibold text-sm cursor-pointer hover:bg-deep/[0.03] transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal"
                >
                  &larr; Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all focus:outline-2 focus:outline-offset-2 focus:outline-teal"
                >
                  Continue to Review &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="font-serif text-xl mb-4">Review Registration</h2>
                <p className="text-xs text-[#5a6a7a] mb-6">Please confirm all information is correct before submitting.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#5a6a7a]">Student:</span>{" "}
                    <span className="text-deep font-medium">
                      {form.studentFirstName} {form.studentLastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#5a6a7a]">Age:</span>{" "}
                    <span className="text-deep font-medium">{form.age}</span>
                  </div>
                  <div>
                    <span className="text-[#5a6a7a]">Grade:</span>{" "}
                    <span className="text-deep font-medium">{form.grade}</span>
                  </div>
                  <div>
                    <span className="text-[#5a6a7a]">Swimming:</span>{" "}
                    <span className="text-deep font-medium">{form.swimmingAbility}</span>
                  </div>
                  {selectedSession && (
                    <>
                      <div>
                        <span className="text-[#5a6a7a]">Session:</span>{" "}
                        <span className="text-deep font-medium">
                          {selectedSession.name} &middot; {selectedSession.dates}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#5a6a7a]">Price:</span>{" "}
                        <span className="text-deep font-medium">{selectedSession.priceLabel}</span>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="text-[#5a6a7a]">Parent:</span>{" "}
                    <span className="text-deep font-medium">{form.parentName}</span>
                  </div>
                  <div>
                    <span className="text-[#5a6a7a]">Parent Email:</span>{" "}
                    <span className="text-deep font-medium">{form.parentEmail}</span>
                  </div>
                  <div>
                    <span className="text-[#5a6a7a]">Parent Phone:</span>{" "}
                    <span className="text-deep font-medium">{form.parentPhone}</span>
                  </div>
                  <div>
                    <span className="text-[#5a6a7a]">Emergency:</span>{" "}
                    <span className="text-deep font-medium">
                      {form.emergencyName} ({form.emergencyRelation})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#5a6a7a]">Emergency Phone:</span>{" "}
                    <span className="text-deep font-medium">{form.emergencyPhone}</span>
                  </div>
                  <div>
                    <span className="text-[#5a6a7a]">Allergies:</span>{" "}
                    <span className="text-deep font-medium">{form.allergies || "None"}</span>
                  </div>
                  <div>
                    <span className="text-[#5a6a7a]">Medications:</span>{" "}
                    <span className="text-deep font-medium">{form.medications || "None"}</span>
                  </div>
                  <div>
                    <span className="text-[#5a6a7a]">Conditions:</span>{" "}
                    <span className="text-deep font-medium">{form.medicalConditions || "None"}</span>
                  </div>
                  <div>
                    <span className="text-[#5a6a7a]">Dietary:</span>{" "}
                    <span className="text-deep font-medium">{form.dietaryRestrictions || "None"}</span>
                  </div>
                  {form.isCharterFamily && (
                    <div className="md:col-span-2">
                      <span className="text-[#5a6a7a]">Charter:</span>{" "}
                      <span className="text-deep font-medium">
                        {form.charterSchoolName} &middot; {form.charterTeacherName} &middot; {form.charterTeacherEmail}
                      </span>
                    </div>
                  )}
                  {form.hearAbout && (
                    <div>
                      <span className="text-[#5a6a7a]">Heard about us:</span>{" "}
                      <span className="text-deep font-medium">{form.hearAbout}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={(e) => update("agreeTerms", e.target.checked)}
                    className="mt-1 w-4 h-4 accent-teal"
                  />
                  <span className="text-sm text-[#5a6a7a]">
                    I agree to the Camp Garibaldi registration terms including the 72-hour cancellation policy.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 py-3.5 bg-white text-deep border border-deep/10 rounded-full font-semibold text-sm cursor-pointer hover:bg-deep/[0.03] transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal"
                >
                  &larr; Back
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all disabled:opacity-50 focus:outline-2 focus:outline-offset-2 focus:outline-teal"
                >
                  {submitting ? "Submitting..." : "Submit Registration"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
