"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const MEDICAL_QUESTIONS = [
  { id: 1, category: "Medication", text: "Any medication taken on a regular basis either over-the-counter or prescribed by a physician?" },
  { id: 2, category: "Mental and Mood Conditions", text: "Current or history of mental illness or mood disorder including, but not limited to schizophrenia, paranoid disorder, bouts of hysteria?" },
  { id: 3, category: "Neurological Conditions", text: "Any history of seizure disorder, stroke, brain surgery, repeated blackouts or fainting fits, severe migraine headaches, or aneurysm of the brain's blood vessels?" },
  { id: 4, category: "Cardiovascular Conditions", text: "Including, but not limited to heart attack, heart surgery, irregular heartbeat, pacemaker, uncontrolled elevated blood pressure?" },
  { id: 5, category: "Pulmonary Conditions", text: "Including, but not limited to asthma, history of spontaneous collapsed lung, collapsed lung due to injury, cysts or air pockets of the lungs, severe damage to lung tissue, emphysema, any lung problem which interferes with your ability to breathe?" },
  { id: 6, category: "Ear, nose and throat Conditions", text: "Including, but not limited to tumor, polyps, or cyst of the sinus cavities or nasal passages, major sinus surgery, persistent sinus infection, permanent holes of the eardrums, history of ruptured eardrum, permanent tubes in ear-drums, severely impaired hearing or hearing loss in one or both ears, major ear surgery?" },
  { id: 7, category: "Eye Condition", text: "Including, but not limited to severe myopia, retinal detachment, eye surgery?" },
  { id: 8, category: "Diabetes Mellitus", text: "Type I Diabetes (Insulin dependent) or Type II Diabetes, which requires Insulin or oral medication for control. Any form of Diabetes that is unstable, \"brittle\" or produces episodes of hypoglycemia (low blood sugar reactions), hyperglycemia (extremely high blood sugar with ketosis) or if there is diabetes related kidney disease, eye disease, heart disease or blood vessel disease?" },
  { id: 9, category: "Freediving/Scuba Diving History", text: "Including, but not limited to previous history of a diving accident, severe blackout, decompression sickness, decompression of the inner ear of air, reverse block, lung squeeze, any lung squeeze producing pink foam, pulmonary bleeding?" },
  { id: 10, category: "General Medical Problems", text: "Any physical and/or emotional condition not mentioned that might affect your safety in an underwater environment or affect your judgment under times of physical or emotional stress?" },
  { id: 11, category: "Pregnancy", text: "If you are presently pregnant?" },
];

function AidaFormsInner() {
  const params = useSearchParams();
  const [step, setStep] = useState(1); // 1=info, 2=medical, 3=liability, 4=sign, 5=done
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [physicianRequired, setPhysicianRequired] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    email: params.get("email") || "",
    phone: "",
    course: params.get("course") || "AIDA 2",
    isMinor: false,
    guardianName: "",
  });

  const [answers, setAnswers] = useState<Record<number, "yes" | "no" | "">>(
    Object.fromEntries(MEDICAL_QUESTIONS.map(q => [q.id, ""]))
  );
  const [medicalDetails, setMedicalDetails] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = "#0B1D2C";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, [step]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSigned(true);
  };

  const endDraw = () => setIsDrawing(false);

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const hasYes = Object.values(answers).some(a => a === "yes");
  const allAnswered = Object.values(answers).every(a => a !== "");

  const submit = async () => {
    if (!hasSigned || !agreeTerms) return;
    setSubmitting(true);

    const signatureData = canvasRef.current?.toDataURL("image/png") || "";

    try {
      const res = await fetch("/api/aida-forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          medicalAnswers: answers,
          medicalDetails,
          physicianRequired: hasYes,
          signatureData,
        }),
      });
      const data = await res.json();
      if (data.physicianRequired) setPhysicianRequired(true);
    } catch {}

    setDone(true);
    setSubmitting(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-deep/10 text-sm outline-none focus:border-teal transition-colors bg-white";
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
          <h1 className="font-serif text-3xl mb-4">Forms submitted!</h1>
          <p className="text-[#5a6a7a] text-sm mb-6">
            Both your AIDA Medical Statement and Liability Release have been submitted and sent to your email.
          </p>

          {physicianRequired && (
            <div className="bg-coral/10 border border-coral/20 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-sm font-semibold text-coral mb-2">Physician clearance required</h3>
              <p className="text-sm text-[#5a6a7a] mb-3">
                You answered YES to one or more medical questions. You need a physician to review and sign the medical form before your course.
              </p>
              <a
                href="/documents/aida-medical-statement.pdf"
                className="inline-block px-5 py-2.5 bg-coral text-white rounded-full font-semibold text-sm no-underline"
              >
                Download PDF for physician →
              </a>
            </div>
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/waiver" className="inline-flex px-6 py-3 bg-teal text-white rounded-full font-semibold text-sm no-underline">
              Sign LJFC waiver →
            </Link>
            <Link href="/calendar" className="inline-flex px-6 py-3 border border-deep/10 text-deep rounded-full font-semibold text-sm no-underline">
              Course calendar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-12 px-6 text-center">
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-tight tracking-tight mb-4">
          AIDA Course Forms
        </h1>
        <p className="text-white/50 text-sm max-w-[480px] mx-auto">
          Complete both the Medical Statement and Liability Release. Required before your first day of training.
        </p>
      </section>

      {/* Progress */}
      <div className="bg-salt border-b border-deep/[0.06] sticky top-16 z-20">
        <div className="max-w-[700px] mx-auto px-6 py-3 flex items-center gap-2">
          {["Info", "Medical", "Liability", "Sign"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                step > i + 1 ? "bg-teal text-white" : step === i + 1 ? "bg-deep text-white" : "bg-deep/10 text-[#5a6a7a]"
              }`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${step === i + 1 ? "text-deep font-medium" : "text-[#5a6a7a]"}`}>{label}</span>
              {i < 3 && <div className="flex-1 h-[1px] bg-deep/10" />}
            </div>
          ))}
        </div>
      </div>

      <section className="bg-salt py-12 px-6">
        <div className="max-w-[600px] mx-auto">

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8 space-y-5">
                <h2 className="font-serif text-xl">Your Information</h2>
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className={inputClass} placeholder="As it appears on your ID" required />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} required />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Course</label>
                    <select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} className={inputClass}>
                      <option value="AIDA 1">AIDA 1</option>
                      <option value="AIDA 2">AIDA 2</option>
                      <option value="AIDA 3">AIDA 3</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isMinor} onChange={e => setForm({ ...form, isMinor: e.target.checked })} className="w-4 h-4 accent-teal" />
                    <span className="text-sm text-[#5a6a7a]">This participant is under 18</span>
                  </label>
                  {form.isMinor && (
                    <div className="mt-3">
                      <label className={labelClass}>Parent/Guardian Name *</label>
                      <input value={form.guardianName} onChange={e => setForm({ ...form, guardianName: e.target.value })} className={inputClass} />
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => { if (form.fullName && form.dob && form.email) { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); } }} disabled={!form.fullName || !form.dob || !form.email} className="w-full py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all disabled:opacity-40">
                Continue to Medical Statement →
              </button>
            </div>
          )}

          {/* Step 2: Medical Questions */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="font-serif text-xl mb-2">AIDA Medical Statement</h2>
                <p className="text-xs text-[#5a6a7a] mb-6">Answer YES or NO to each question. If unsure, answer YES.</p>
                <div className="space-y-4">
                  {MEDICAL_QUESTIONS.map(q => (
                    <div key={q.id} className="border-b border-deep/[0.06] pb-4 last:border-0">
                      <div className="flex gap-3 items-start">
                        <span className="text-xs text-[#5a6a7a] mt-1 shrink-0 w-5">{q.id}.</span>
                        <div className="flex-1">
                          <p className="text-sm text-deep leading-relaxed mb-2">
                            <strong className="text-deep">{q.category}:</strong> {q.text}
                          </p>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => setAnswers({ ...answers, [q.id]: "yes" })} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${answers[q.id] === "yes" ? "bg-coral text-white border-coral" : "bg-transparent text-[#5a6a7a] border-deep/10 hover:border-coral"}`}>YES</button>
                            <button type="button" onClick={() => setAnswers({ ...answers, [q.id]: "no" })} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${answers[q.id] === "no" ? "bg-teal text-white border-teal" : "bg-transparent text-[#5a6a7a] border-deep/10 hover:border-teal"}`}>NO</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {hasYes && (
                  <div className="mt-6 bg-coral/10 border border-coral/20 rounded-xl p-4">
                    <p className="text-sm text-coral font-medium mb-2">You answered YES to one or more questions.</p>
                    <p className="text-xs text-[#5a6a7a] mb-3">Please provide details below. You will also need a physician to sign the medical form before your course.</p>
                    <textarea value={medicalDetails} onChange={e => setMedicalDetails(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Please specify details for each YES answer..." />
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex-1 py-3.5 bg-white text-deep border border-deep/10 rounded-full font-semibold text-sm cursor-pointer">← Back</button>
                <button onClick={() => { if (allAnswered) { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); } }} disabled={!allAnswered} className="flex-1 py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none disabled:opacity-40">Continue to Liability →</button>
              </div>
            </div>
          )}

          {/* Step 3: Liability Release */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="font-serif text-xl mb-4">AIDA Liability Release and Assumption of Risk</h2>
                <div className="bg-salt rounded-lg p-4 max-h-[300px] overflow-y-auto text-xs text-[#5a6a7a] leading-relaxed space-y-3 mb-4">
                  <p>I, <strong className="text-deep">{form.fullName}</strong>, hereby declare that I am aware that freediving has inherent risks, which may result in serious injury or death. I still choose to participate in the freediving activities with <strong className="text-deep">La Jolla Freedive Club / AIDA International</strong>.</p>
                  <p>I understand and agree that neither my instructor nor AIDA International, nor any of their respective employees, officers, agents, contractors or assigns (herein after referred to as the &quot;Released Parties&quot;) may be held liable or responsible in any way for any injury, death or other damages to me, my family, estate, heirs or assigns that may occur as a result of my participation in freediving activity with AIDA International or as a result of the negligence of any party, including the Released Parties whether passive or active.</p>
                  <p>In consideration of AIDA International allowing me to participate in the freediving activity, I hereby personally assume all risks of the experience, whether foreseen or unforeseen, that may befall me while I am freediving with La Jolla Freedive Club.</p>
                  <p>I declare that I am in good mental and physical fitness for freediving and that I am not under the influence of alcohol, nor am I under the influence of any drugs that are contraindicatory to freediving. I declare that if requested as a result of completion of the AIDA Medical Statement, I have seen a physician and have approval to freedive.</p>
                  <p>I further declare that I am of lawful age and legally competent to sign this liability release. I understand that the terms herein are contractual and not a mere recital, and that I have signed this document of my own free act and with the knowledge that I hereby agree to waive my legal rights.</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="mt-1 w-4 h-4 accent-teal" />
                  <span className="text-sm text-[#5a6a7a]">I have read and agree to the AIDA Liability Release and Assumption of Risk.</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex-1 py-3.5 bg-white text-deep border border-deep/10 rounded-full font-semibold text-sm cursor-pointer">← Back</button>
                <button onClick={() => { if (agreeTerms) { setStep(4); window.scrollTo({ top: 0, behavior: "smooth" }); } }} disabled={!agreeTerms} className="flex-1 py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none disabled:opacity-40">Continue to Sign →</button>
              </div>
            </div>
          )}

          {/* Step 4: Signature */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="font-serif text-xl mb-4">Sign Below</h2>
                <div className="text-xs text-[#5a6a7a] mb-4 space-y-1">
                  <p><strong>Name:</strong> {form.fullName}</p>
                  <p><strong>DOB:</strong> {form.dob}</p>
                  <p><strong>Course:</strong> {form.course}</p>
                  <p><strong>Medical:</strong> {hasYes ? <span className="text-coral font-medium">Flagged — physician clearance needed</span> : <span className="text-teal">All clear</span>}</p>
                  {form.isMinor && <p><strong>Guardian:</strong> {form.guardianName}</p>}
                </div>

                <div className="border border-deep/10 rounded-xl overflow-hidden mb-3">
                  <canvas
                    ref={canvasRef}
                    className="w-full bg-white cursor-crosshair touch-none"
                    style={{ height: "160px" }}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={endDraw}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#5a6a7a]">{hasSigned ? "Signature captured" : "Draw your signature above"}</span>
                  <button onClick={clearSig} type="button" className="text-xs text-coral cursor-pointer bg-transparent border-none hover:underline">Clear</button>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex-1 py-3.5 bg-white text-deep border border-deep/10 rounded-full font-semibold text-sm cursor-pointer">← Back</button>
                <button onClick={submit} disabled={submitting || !hasSigned} className="flex-1 py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all disabled:opacity-40">
                  {submitting ? "Submitting..." : "Submit Both Forms"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function AidaFormsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-salt" />}>
      <AidaFormsInner />
    </Suspense>
  );
}
