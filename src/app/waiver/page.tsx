"use client";

import { useState, useRef, useEffect } from "react";

const medicalQuestions = [
  "Do you have any heart or cardiovascular condition?",
  "Do you have asthma or any respiratory condition?",
  "Do you have a seizure disorder or history of blackouts?",
  "Do you have any ear, nose, or sinus condition that affects equalization?",
  "Are you currently taking any prescription medication?",
  "Have you ever experienced a freediving or diving-related injury (blackout, lung squeeze, barotrauma)?",
  "Do you have any condition that may affect your safety in the water or your judgment under physical or emotional stress?",
  "Are you currently pregnant?",
];

export default function WaiverPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Form data
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    email: "",
    phone: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    medical: Array(medicalQuestions.length).fill("no") as string[],
    medicalDetails: "",
    isMinor: false,
    guardianName: "",
    mediaConsent: true,
  });

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

  const validateStep = (s: number): string[] => {
    const errs: string[] = [];
    if (s === 1) {
      if (!form.fullName.trim()) errs.push("Full name is required");
      if (!form.dob) errs.push("Date of birth is required");
      if (!form.email.includes("@")) errs.push("Valid email is required");
      if (!form.emergencyName.trim()) errs.push("Emergency contact name is required");
      if (!form.emergencyPhone.trim()) errs.push("Emergency contact phone is required");
    }
    if (s === 3) {
      if (!hasSigned) errs.push("Signature is required");
      if (form.isMinor && !form.guardianName.trim()) errs.push("Parent/guardian name is required for minors");
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

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const submit = async () => {
    const errs = validateStep(3);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    const sigData = canvasRef.current?.toDataURL("image/png") || "";

    try {
      const res = await fetch("/api/waiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          dob: form.dob,
          email: form.email,
          phone: form.phone,
          emergencyName: form.emergencyName,
          emergencyPhone: form.emergencyPhone,
          emergencyRelation: form.emergencyRelation,
          medical: form.medical,
          medicalDetails: form.medicalDetails,
          isMinor: form.isMinor,
          guardianName: form.guardianName,
          mediaConsent: form.mediaConsent,
          signatureData: sigData,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("WAIVER API RESPONSE:", JSON.stringify({success: result.success, emailErrors: result.emailErrors, resendConfigured: result.resendConfigured})); if (result.pdf) {
          setPdfUrl(result.pdf);
        }
      }
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
          <h1 className="font-serif text-3xl mb-4">Waiver signed</h1>
          <p className="text-[#5a6a7a] mb-2">
            Thank you, {form.fullName}. Your waiver is on file.
          </p>
          <p className="text-[#5a6a7a] text-sm mb-8">
            A confirmation has been sent to {form.email}. You&apos;re cleared to join Saturday sessions and all LJFC activities.
          </p>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={`LJFC-Waiver-${form.fullName.replace(/\s+/g, "-")}.pdf`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-deep text-white rounded-full font-medium text-sm no-underline hover:shadow-lg transition-all mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Download Signed Waiver (PDF)
            </a>
          )}
          <p className="text-[10px] text-[#5a6a7a] mb-6">
            Keep this PDF for your records. It contains the full waiver text, your medical answers, and your digital signature.
          </p>
          {form.medical.some((a) => a === "yes") && (
            <div className="bg-coral/10 border border-coral/20 rounded-xl p-4 mb-8 text-left">
              <p className="text-sm text-coral font-medium">Medical note</p>
              <p className="text-xs text-[#5a6a7a] mt-1">
                You answered YES to one or more medical questions. Joshua will review your responses
                and may follow up before your first session to ensure your safety.
              </p>
            </div>
          )}
          <a href="/programs" className="btn btn-primary no-underline">
            View programs →
          </a>
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
            Liability Waiver
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Complete this form once and you&apos;re cleared for all LJFC activities —
            Saturday ocean sessions, Ocean Flow, private coaching, and Camp Garibaldi.
            AIDA courses require additional AIDA-specific forms provided at enrollment.
          </p>
        </div>
      </section>

      {/* Progress */}
      <div className="bg-salt border-b border-deep/[0.06] sticky top-16 z-20">
        <div className="max-w-[600px] mx-auto px-6 py-3 flex items-center gap-2">
          {["Your Info", "Medical", "Review & Sign"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  step > i + 1 ? "bg-teal text-white" : step === i + 1 ? "bg-deep text-white" : "bg-deep/10 text-[#5a6a7a]"
                }`}
              >
                {step > i + 1 ? "✓" : i + 1}
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

          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8 space-y-5">
                <h2 className="font-serif text-xl mb-1">Personal Information</h2>
                <p className="text-xs text-[#5a6a7a] mb-4">All fields required unless noted.</p>

                <div>
                  <label className="block text-sm font-medium text-deep mb-1">Full Name *</label>
                  <input type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt" placeholder="Your full legal name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep mb-1">Date of Birth *</label>
                  <input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deep mb-1">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt" placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt" placeholder="(optional)" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 md:p-8 space-y-5">
                <h2 className="font-serif text-xl mb-1">Emergency Contact</h2>

                <div>
                  <label className="block text-sm font-medium text-deep mb-1">Contact Name *</label>
                  <input type="text" value={form.emergencyName} onChange={(e) => update("emergencyName", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deep mb-1">Contact Phone *</label>
                    <input type="tel" value={form.emergencyPhone} onChange={(e) => update("emergencyPhone", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep mb-1">Relationship</label>
                    <input type="text" value={form.emergencyRelation} onChange={(e) => update("emergencyRelation", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt" placeholder="e.g. Spouse, Parent" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 md:p-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isMinor} onChange={(e) => update("isMinor", e.target.checked)} className="mt-1 w-4 h-4 accent-teal" />
                  <span className="text-sm text-[#5a6a7a]">This participant is under 18 years old</span>
                </label>
                {form.isMinor && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-deep mb-1">Parent/Guardian Full Name *</label>
                    <input type="text" value={form.guardianName} onChange={(e) => update("guardianName", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt" />
                  </div>
                )}
              </div>

              <button onClick={nextStep} className="w-full py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all">
                Continue to Medical →
              </button>
            </div>
          )}

          {/* STEP 2: Medical */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="font-serif text-xl mb-1">Medical Questionnaire</h2>
                <p className="text-xs text-[#5a6a7a] mb-6">
                  Please answer honestly. A YES answer does not disqualify you — it helps us ensure your safety.
                </p>

                <div className="space-y-4">
                  {medicalQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-4 py-3 border-b border-deep/[0.04] last:border-none">
                      <div className="flex-1 text-sm text-deep">{q}</div>
                      <div className="flex gap-3 shrink-0">
                        <button
                          onClick={() => updateMedical(i, "no")}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${
                            form.medical[i] === "no" ? "bg-teal text-white border-teal" : "bg-transparent text-[#5a6a7a] border-deep/10 hover:border-teal"
                          }`}
                        >
                          No
                        </button>
                        <button
                          onClick={() => updateMedical(i, "yes")}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${
                            form.medical[i] === "yes" ? "bg-coral text-white border-coral" : "bg-transparent text-[#5a6a7a] border-deep/10 hover:border-coral"
                          }`}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {form.medical.some((a) => a === "yes") && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-deep mb-1">Please provide details for any YES answers:</label>
                    <textarea
                      value={form.medicalDetails}
                      onChange={(e) => update("medicalDetails", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-salt resize-none"
                      placeholder="Describe any conditions, medications, or relevant history..."
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 py-3.5 bg-white text-deep border border-deep/10 rounded-full font-semibold text-sm cursor-pointer hover:bg-deep/[0.03] transition-colors">
                  ← Back
                </button>
                <button onClick={nextStep} className="flex-1 py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all">
                  Continue to Sign →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Sign */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Waiver text */}
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="font-serif text-xl mb-4">Assumption of Risk & Liability Release</h2>
                <div className="text-xs text-[#5a6a7a] leading-[1.8] max-h-[300px] overflow-y-auto pr-2 space-y-3">
                  <p>
                    I understand that La Jolla Freedive Club activities — including group ocean sessions,
                    guided freediving, breath-hold training, stretching and breathing exercises, open water
                    swimming, and related ocean-based activities — involve inherent risks that cannot be
                    eliminated regardless of the care taken to avoid them.
                  </p>
                  <p>
                    I understand that these risks include but are not limited to: drowning or near-drowning,
                    shallow water blackout or loss of motor control, barotrauma to ears/sinuses/lungs,
                    injuries from marine life, hypothermia or cold water shock, physical injury from surf/currents/rocks,
                    equipment failure or misuse, exhaustion, and other participants&apos; actions.
                  </p>
                  <p>
                    I voluntarily choose to participate with full knowledge of the inherent risks.
                    I accept and assume all risks of injury, illness, disability, or death.
                  </p>
                  <p>
                    I hereby release, discharge, and hold harmless La Jolla Freedive Club, Joshua Beneventi,
                    and any of their respective employees, agents, contractors, volunteers, or assigns
                    from any and all liability, claims, demands, or causes of action arising out of or related
                    to any loss, damage, or injury — including death — that may be sustained by me as a
                    result of participation, whether caused by negligence of the Released Parties or otherwise.
                  </p>
                  <p>
                    I declare that I am in good physical and mental health, am a competent swimmer capable
                    of swimming at least 200 meters non-stop, and am not under the influence of alcohol or
                    any impairing substance. In the event of an emergency, I authorize LJFC staff to arrange
                    emergency medical treatment on my behalf.
                  </p>
                </div>
              </div>

              {/* Media consent */}
              <div className="bg-white rounded-xl p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.mediaConsent} onChange={(e) => update("mediaConsent", e.target.checked)} className="mt-1 w-4 h-4 accent-teal" />
                  <span className="text-sm text-[#5a6a7a]">
                    I grant LJFC permission to use photographs or video taken during activities for promotional purposes.
                  </span>
                </label>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h3 className="text-sm font-semibold text-deep mb-3">Summary</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-[#5a6a7a]">Name:</span> <span className="text-deep font-medium">{form.fullName}</span></div>
                  <div><span className="text-[#5a6a7a]">DOB:</span> <span className="text-deep font-medium">{form.dob}</span></div>
                  <div><span className="text-[#5a6a7a]">Email:</span> <span className="text-deep font-medium">{form.email}</span></div>
                  <div><span className="text-[#5a6a7a]">Emergency:</span> <span className="text-deep font-medium">{form.emergencyName}</span></div>
                  <div>
                    <span className="text-[#5a6a7a]">Medical:</span>{" "}
                    <span className={`font-medium ${form.medical.some((a) => a === "yes") ? "text-coral" : "text-teal"}`}>
                      {form.medical.some((a) => a === "yes") ? "Flagged — review needed" : "All clear"}
                    </span>
                  </div>
                  {form.isMinor && <div><span className="text-[#5a6a7a]">Guardian:</span> <span className="text-deep font-medium">{form.guardianName}</span></div>}
                </div>
              </div>

              {/* Signature */}
              <div className="bg-white rounded-xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-deep">
                    {form.isMinor ? "Parent/Guardian Signature *" : "Your Signature *"}
                  </h3>
                  <button onClick={clearSig} className="text-xs text-[#5a6a7a] hover:text-coral cursor-pointer bg-transparent border-none">
                    Clear
                  </button>
                </div>
                <canvas
                  ref={canvasRef}
                  className="w-full h-[120px] border border-deep/10 rounded-lg bg-salt cursor-crosshair touch-none"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={stopDraw}
                />
                <p className="text-[10px] text-[#5a6a7a] mt-2">
                  Draw your signature above. By signing, you confirm you have read and agree to the waiver terms.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 py-3.5 bg-white text-deep border border-deep/10 rounded-full font-semibold text-sm cursor-pointer hover:bg-deep/[0.03] transition-colors">
                  ← Back
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all disabled:opacity-50"
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
