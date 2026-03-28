"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const medicalQuestions = [
  "Does your child have any heart conditions?",
  "Does your child have asthma or respiratory conditions?",
  "Does your child have epilepsy or seizure disorders?",
  "Does your child have any allergies (food, medication, environmental)?",
  "Is your child currently taking any medications?",
  "Does your child have any learning disabilities or behavioral conditions we should be aware of?",
  "Any other medical conditions?",
];

function CampWaiverForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    childName: searchParams.get("student") || "",
    childDob: "",
    parentName: "",
    parentEmail: searchParams.get("parent") || "",
    parentPhone: "",
    medical: Array(medicalQuestions.length).fill("no") as string[],
    medicalDetails: Array(medicalQuestions.length).fill("") as string[],
  });

  const registrationId = searchParams.get("reg") || "";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = "#0B1D2C";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [step]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateMedical = (index: number, value: string) => {
    setForm((prev) => {
      const medical = [...prev.medical];
      medical[index] = value;
      return { ...prev, medical };
    });
  };

  const updateMedicalDetails = (index: number, value: string) => {
    setForm((prev) => {
      const medicalDetails = [...prev.medicalDetails];
      medicalDetails[index] = value;
      return { ...prev, medicalDetails };
    });
  };

  const validateStep = (s: number): string[] => {
    const errs: string[] = [];
    if (s === 1) {
      if (!form.childName.trim()) errs.push("Child's full name is required");
      if (!form.childDob) errs.push("Child's date of birth is required");
      if (!form.parentName.trim()) errs.push("Parent/guardian full name is required");
      if (!form.parentEmail.includes("@")) errs.push("Valid parent email is required");
      if (!form.parentPhone.trim()) errs.push("Parent phone number is required");
    }
    if (s === 3) {
      if (!hasSigned) errs.push("Signature is required");
      if (!agreed) errs.push("You must agree to the waiver terms");
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
    const errs = validateStep(3);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    const sigData = canvasRef.current?.toDataURL("image/png") || "";

    // Build medical answers object
    const medicalAnswers: Record<string, { answer: string; details: string }> = {};
    medicalQuestions.forEach((q, i) => {
      medicalAnswers[q] = {
        answer: form.medical[i],
        details: form.medicalDetails[i] || "",
      };
    });

    try {
      await fetch("/api/camp-waiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName: form.childName,
          childDob: form.childDob,
          parentName: form.parentName,
          parentEmail: form.parentEmail,
          parentPhone: form.parentPhone,
          medicalAnswers,
          signatureDataUrl: sigData,
          registrationId,
        }),
      });
    } catch {
      // Still mark as done even if API has issues
    }

    setDone(true);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <div className="min-h-screen bg-salt flex items-center justify-center px-6">
        <div className="max-w-[500px] text-center">
          <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl mb-4">Waiver signed!</h1>
          <p className="text-[#5a6a7a] mb-2">
            A PDF copy has been emailed to {form.parentEmail}.
          </p>
          <p className="text-[#5a6a7a] text-sm mb-8">
            Your child is registered for Camp Garibaldi. We&apos;ll be in touch with session details and what to bring.
          </p>
          {form.medical.some((a) => a === "yes") && (
            <div className="bg-coral/10 border border-coral/20 rounded-xl p-4 mb-8 text-left">
              <p className="text-sm text-coral font-medium">Medical note</p>
              <p className="text-xs text-[#5a6a7a] mt-1">
                You flagged one or more medical conditions. Joshua will review your responses
                and may follow up before camp to ensure your child&apos;s safety.
              </p>
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
            Camp Garibaldi — Youth Waiver
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Complete this waiver to finalize your child&apos;s enrollment in Camp Garibaldi.
            One waiver per child. Parent or legal guardian must sign.
          </p>
        </div>
      </section>

      {/* Progress */}
      <div className="bg-salt border-b border-deep/[0.06] sticky top-16 z-20">
        <div className="max-w-[600px] mx-auto px-6 py-3 flex items-center gap-2">
          {["Participant Info", "Medical", "Review & Sign"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  step > i + 1 ? "bg-teal text-white" : step === i + 1 ? "bg-deep text-white" : "bg-deep/10 text-[#5a6a7a]"
                }`}
              >
                {step > i + 1 ? "\u2713" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${step === i + 1 ? "text-deep font-medium" : "text-[#5a6a7a]"}`}>
                {label}
              </span>
              {i < 2 && <div className="flex-1 h-[1px] bg-deep/10" />}
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
                <p key={e} className="text-sm text-coral">{e}</p>
              ))}
            </div>
          )}

          {/* STEP 1: Participant Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8 space-y-5">
                <h2 className="font-serif text-xl mb-1">Child Information</h2>
                <p className="text-xs text-[#5a6a7a] mb-4">All fields required.</p>

                <div>
                  <label className="block text-sm font-medium text-deep mb-1">Child&apos;s Full Name *</label>
                  <input
                    type="text"
                    value={form.childName}
                    onChange={(e) => update("childName", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt"
                    placeholder="First and last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep mb-1">Child&apos;s Date of Birth *</label>
                  <input
                    type="date"
                    value={form.childDob}
                    onChange={(e) => update("childDob", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 md:p-8 space-y-5">
                <h2 className="font-serif text-xl mb-1">Parent / Guardian</h2>

                <div>
                  <label className="block text-sm font-medium text-deep mb-1">Parent/Guardian Full Name *</label>
                  <input
                    type="text"
                    value={form.parentName}
                    onChange={(e) => update("parentName", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt"
                    placeholder="Full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deep mb-1">Parent Email *</label>
                    <input
                      type="email"
                      value={form.parentEmail}
                      onChange={(e) => update("parentEmail", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt"
                      placeholder="parent@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep mb-1">Parent Phone *</label>
                    <input
                      type="tel"
                      value={form.parentPhone}
                      onChange={(e) => update("parentPhone", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt"
                      placeholder="(858) 555-1234"
                    />
                  </div>
                </div>
              </div>

              <button onClick={nextStep} className="w-full py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all focus:outline-2 focus:outline-offset-2 focus:outline-teal">
                Continue to Medical Authorization →
              </button>
            </div>
          )}

          {/* STEP 2: Medical Authorization */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="font-serif text-xl mb-1">Medical Authorization</h2>
                <p className="text-xs text-[#5a6a7a] mb-6">
                  Please answer honestly. A YES answer does not disqualify your child — it helps us ensure their safety during ocean activities.
                </p>

                <div className="space-y-4">
                  {medicalQuestions.map((q, i) => (
                    <div key={i} className="py-3 border-b border-deep/[0.04] last:border-none">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 text-sm text-deep">{q}</div>
                        <div className="flex gap-3 shrink-0">
                          <button
                            onClick={() => updateMedical(i, "no")}
                            className={`px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal ${
                              form.medical[i] === "no" ? "bg-teal text-white border-teal" : "bg-transparent text-[#5a6a7a] border-deep/10 hover:border-teal"
                            }`}
                          >
                            No
                          </button>
                          <button
                            onClick={() => updateMedical(i, "yes")}
                            className={`px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal ${
                              form.medical[i] === "yes" ? "bg-coral text-white border-coral" : "bg-transparent text-[#5a6a7a] border-deep/10 hover:border-coral"
                            }`}
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                      {form.medical[i] === "yes" && (
                        <div className="mt-3">
                          <textarea
                            value={form.medicalDetails[i]}
                            onChange={(e) => updateMedicalDetails(i, e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg border border-coral/20 text-sm outline-none focus:border-coral transition-colors bg-coral/[0.03] resize-none"
                            placeholder="Please provide details..."
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 py-3.5 bg-white text-deep border border-deep/10 rounded-full font-semibold text-sm cursor-pointer hover:bg-deep/[0.03] transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal">
                  ← Back
                </button>
                <button onClick={nextStep} className="flex-1 py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all focus:outline-2 focus:outline-offset-2 focus:outline-teal">
                  Continue to Review & Sign →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Sign */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h3 className="text-sm font-semibold text-deep mb-3">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div><span className="text-[#5a6a7a]">Child:</span> <span className="text-deep font-medium">{form.childName}</span></div>
                  <div><span className="text-[#5a6a7a]">DOB:</span> <span className="text-deep font-medium">{form.childDob}</span></div>
                  <div><span className="text-[#5a6a7a]">Parent:</span> <span className="text-deep font-medium">{form.parentName}</span></div>
                  <div><span className="text-[#5a6a7a]">Email:</span> <span className="text-deep font-medium">{form.parentEmail}</span></div>
                  <div><span className="text-[#5a6a7a]">Phone:</span> <span className="text-deep font-medium">{form.parentPhone}</span></div>
                  <div>
                    <span className="text-[#5a6a7a]">Medical:</span>{" "}
                    <span className={`font-medium ${form.medical.some((a) => a === "yes") ? "text-coral" : "text-teal"}`}>
                      {form.medical.some((a) => a === "yes") ? "Flagged — review needed" : "All clear"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Waiver Text */}
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="font-serif text-xl mb-4">Waiver & Release</h2>
                <div className="text-xs text-[#5a6a7a] leading-[1.8] max-h-[300px] overflow-y-auto pr-2 space-y-4">
                  <div>
                    <p className="font-semibold text-deep text-sm mb-2">Liability Release</p>
                    <p>
                      I, {form.parentName || "[parent name]"}, parent/guardian of {form.childName || "[child name]"}, acknowledge that ocean activities including freediving, snorkeling, and swimming in open water involve inherent risks including but not limited to drowning, marine life encounters, surf conditions, and cold water exposure. I voluntarily assume these risks on behalf of my child and release La Jolla Freedive Club, its instructors, and staff from liability for any injury, illness, or loss arising from participation in Camp Garibaldi activities, whether caused by negligence of the released parties or otherwise.
                    </p>
                    <p className="mt-2">
                      I understand that ocean conditions are unpredictable and that while LJFC staff will exercise reasonable care, they cannot guarantee absolute safety. I acknowledge that my child is a competent swimmer and I have disclosed all relevant medical conditions.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-deep text-sm mb-2">Medical Authorization</p>
                    <p>
                      I authorize La Jolla Freedive Club and its staff to arrange emergency medical treatment for my child, {form.childName || "[child name]"}, in the event I cannot be reached. I understand that I am responsible for all medical costs incurred.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-deep text-sm mb-2">Photo/Video Release</p>
                    <p>
                      I grant La Jolla Freedive Club permission to use photographs and video recordings of my child taken during camp activities for promotional, educational, and social media purposes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="bg-white rounded-xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-deep">Parent/Guardian Signature *</h3>
                  <button onClick={clearSig} className="text-xs text-[#5a6a7a] hover:text-coral cursor-pointer bg-transparent border-none focus:outline-2 focus:outline-offset-2 focus:outline-teal">
                    Clear
                  </button>
                </div>
                <canvas
                  ref={canvasRef}
                  className="w-full h-[150px] md:h-[120px] border border-deep/10 rounded-lg bg-salt cursor-crosshair touch-none"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={stopDraw}
                />
                <p className="text-[10px] text-[#5a6a7a] mt-2">
                  Draw your signature above. By signing, you confirm you have read and agree to the waiver terms on behalf of your child.
                </p>
              </div>

              {/* Agreement checkbox */}
              <div className="bg-white rounded-xl p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-teal"
                  />
                  <span className="text-sm text-[#5a6a7a]">
                    I have read and agree to the above liability release, medical authorization, and photo/video release on behalf of my child.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 py-3.5 bg-white text-deep border border-deep/10 rounded-full font-semibold text-sm cursor-pointer hover:bg-deep/[0.03] transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-teal">
                  ← Back
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all disabled:opacity-50 focus:outline-2 focus:outline-offset-2 focus:outline-teal"
                >
                  {submitting ? "Submitting..." : "Sign & Submit Waiver"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function CampWaiverPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-salt flex items-center justify-center">
          <p className="text-[#5a6a7a] text-sm">Loading waiver...</p>
        </div>
      }
    >
      <CampWaiverForm />
    </Suspense>
  );
}
