"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Constants ────────────────────────────────────────────────────────────

const MEDICAL_QUESTIONS = [
  { id: 1, category: "Medication", text: "Any medication taken on a regular basis either over-the-counter or prescribed by a physician?" },
  { id: 2, category: "Mental and Mood Conditions", text: "Current or history of mental illness or mood disorder including, but not limited to schizophrenia, paranoid disorder, bouts of hysteria?" },
  { id: 3, category: "Neurological Conditions", text: "Any history of seizure disorder, stroke, brain surgery, repeated blackouts or fainting fits, severe migraine headaches, or aneurysm of the brain's blood vessels?" },
  { id: 4, category: "Cardiovascular Conditions", text: "Including, but not limited to heart attack, heart surgery, irregular heartbeat, pacemaker, uncontrolled elevated blood pressure?" },
  { id: 5, category: "Pulmonary Conditions", text: "Including, but not limited to asthma, history of spontaneous collapsed lung, collapsed lung due to injury, cysts or air pockets of the lungs, severe damage to lung tissue, emphysema, any lung problem which interferes with your ability to breathe?" },
  { id: 6, category: "Ear, nose and throat", text: "Including, but not limited to tumor, polyps, or cyst of the sinus cavities or nasal passages, major sinus surgery, persistent sinus infection, permanent holes of the eardrums, history of ruptured eardrum, permanent tubes in ear-drums, severely impaired hearing or hearing loss in one or both ears, major ear surgery?" },
  { id: 7, category: "Eye Condition", text: "Including, but not limited to severe myopia, retinal detachment, eye surgery?" },
  { id: 8, category: "Diabetes Mellitus", text: "Type I Diabetes (Insulin dependent) or Type II Diabetes, which requires Insulin or oral medication for control?" },
  { id: 9, category: "Freediving/Diving History", text: "Including, but not limited to previous history of a diving accident, severe blackout, decompression sickness, lung squeeze, any lung squeeze producing pink foam, pulmonary bleeding?" },
  { id: 10, category: "General Medical", text: "Any physical and/or emotional condition not mentioned that might affect your safety in an underwater environment or affect your judgment under times of physical or emotional stress?" },
  { id: 11, category: "Pregnancy", text: "Are you presently pregnant?" },
];

const SWIM_OPTIONS = [
  { value: "non_swimmer", label: "Non-swimmer" },
  { value: "basic", label: "Basic — can tread water" },
  { value: "comfortable", label: "Comfortable — swim laps regularly" },
  { value: "strong", label: "Strong — ocean-experienced" },
  { value: "competitive", label: "Competitive — trained swimmer" },
];

const EXPERIENCE_OPTIONS = [
  { value: "none", label: "None — this is my first time" },
  { value: "recreational", label: "Recreational — snorkel, spearfish, breath-hold games" },
  { value: "trained_other_agency", label: "Trained at another agency" },
  { value: "aida_certified", label: "AIDA-certified" },
];

const BREATH_HOLD_OPTIONS = [
  { value: "under_30s", label: "Under 30 seconds" },
  { value: "30_60s", label: "30–60 seconds" },
  { value: "1_2min", label: "1–2 minutes" },
  { value: "2_plus_min", label: "2+ minutes" },
  { value: "unknown", label: "Not sure" },
];

const DIVE_BUCKET_OPTIONS = [
  { value: "surface_only", label: "Surface only" },
  { value: "under_5m", label: "Less than 5m" },
  { value: "5_10m", label: "5–10m" },
  { value: "10_20m", label: "10–20m" },
  { value: "20m_plus", label: "20m+" },
];

const SWIM_200M_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "with_difficulty", label: "With difficulty" },
  { value: "no", label: "No" },
  { value: "havent_tried", label: "Haven't tried" },
];

const FEAR_OPTIONS = [
  { value: "breath_hold", label: "Running out of air" },
  { value: "equalization", label: "Equalizing my ears" },
  { value: "panic", label: "Panic underwater" },
  { value: "cold_water", label: "Cold water" },
  { value: "depth", label: "Depth" },
  { value: "swimming", label: "Not being a strong swimmer" },
  { value: "nothing", label: "Nothing in particular" },
];

const GOAL_OPTIONS = [
  { value: "spearfishing", label: "Spearfishing" },
  { value: "depth", label: "Depth & competition" },
  { value: "photography", label: "Underwater photography" },
  { value: "breathwork", label: "Breathwork & mindfulness" },
  { value: "surf", label: "Surf confidence" },
  { value: "safety", label: "Water safety & confidence" },
  { value: "other", label: "Other" },
];

const THEORY_OPTIONS = [
  { id: "friday_evening", label: "Friday evening" },
  { id: "saturday_afternoon", label: "Saturday afternoon" },
  { id: "saturday_evening", label: "Saturday evening" },
  { id: "no_preference", label: "No preference" },
];

// ─── Types ────────────────────────────────────────────────────────────────

interface Props {
  student: { id: string; email: string; first_name: string | null; last_name: string | null };
  initial: Record<string, unknown> | null;
  hasMedical: boolean;
  physicianRequired: boolean;
  physicianCleared: boolean;
  waiverEmergency: { name: string; phone: string; relationship: string } | null;
  isAida2Plus: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────

export default function OnboardingFlow({ student, initial, hasMedical, physicianRequired, physicianCleared, waiverEmergency, isAida2Plus }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — About You
  const [firstName, setFirstName] = useState((initial?.first_name as string) || student.first_name || "");
  const [lastName, setLastName] = useState((initial?.last_name as string) || student.last_name || "");
  const [dob, setDob] = useState((initial?.date_of_birth as string) || "");
  const [sex, setSex] = useState((initial?.sex as string) || "");
  const [heightFt, setHeightFt] = useState((initial?.height_ft as number)?.toString() || "");
  const [heightIn, setHeightIn] = useState((initial?.height_in as number)?.toString() || "");
  const [weightLbs, setWeightLbs] = useState((initial?.weight_lbs as number)?.toString() || "");
  const [ecName, setEcName] = useState((initial?.emergency_contact_name as string) || waiverEmergency?.name || "");
  const [ecPhone, setEcPhone] = useState((initial?.emergency_contact_phone as string) || waiverEmergency?.phone || "");
  const [ecRelationship, setEcRelationship] = useState((initial?.emergency_contact_relationship as string) || waiverEmergency?.relationship || "");
  const [swimAbility, setSwimAbility] = useState((initial?.swim_ability as string) || "");
  const [swim200m, setSwim200m] = useState((initial?.swim_200m_no_fins as string) || "");
  const [experience, setExperience] = useState((initial?.freediving_experience as string) || "");
  const [breathHold, setBreathHold] = useState((initial?.breath_hold_bucket as string) || "");
  const [deepestDive, setDeepestDive] = useState((initial?.deepest_dive_bucket as string) || "");

  // Step 2 — Medical
  const [answers, setAnswers] = useState<Record<number, "yes" | "no" | "">>(
    Object.fromEntries(MEDICAL_QUESTIONS.map(q => [q.id, ""]))
  );
  const [medicalDetails, setMedicalDetails] = useState("");
  const [medicalDone, setMedicalDone] = useState(hasMedical);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (step !== 2 || medicalDone) return;
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
  }, [step, medicalDone]);

  // Step 3 — Gear & Logistics
  const [fears, setFears] = useState<string[]>((initial?.fears as string[]) || []);
  const [goals, setGoals] = useState<string[]>((initial?.goals as string[]) || []);
  const [theoryPref, setTheoryPref] = useState((initial?.theory_preference as string) || "");
  const [notes, setNotes] = useState((initial?.notes as string) || "");
  const [shoeSize, setShoeSize] = useState((initial?.shoe_size_us as number)?.toString() || "");
  const [shirtSize, setShirtSize] = useState((initial?.shirt_size as string) || "");

  // ── Helpers ─────────────────────────────────────────────────────────────

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setIsDrawing(true);
    setHasSigned(true);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function endDraw() { setIsDrawing(false); }

  function clearSig() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  }

  // ── Save handlers ───────────────────────────────────────────────────────

  async function saveStep1() {
    // Validate required fields
    if (!firstName || !lastName || !sex || !heightFt || !weightLbs || !ecName || !ecPhone || !swimAbility || !experience) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/portal/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName, last_name: lastName, date_of_birth: dob || null,
        sex, height_ft: heightFt, height_in: heightIn, weight_lbs: weightLbs,
        emergency_contact_name: ecName, emergency_contact_phone: ecPhone,
        emergency_contact_relationship: ecRelationship,
        swim_ability: swimAbility, swim_200m_no_fins: swim200m || null,
        freediving_experience: experience, breath_hold_bucket: breathHold || null,
        deepest_dive_bucket: deepestDive || null,
        // Carry forward existing step 3 data
        fears, goals, theory_preference: theoryPref, notes,
        shoe_size_us: shoeSize || null, shirt_size: shirtSize || null,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save");
      setSaving(false);
      return;
    }
    setSaving(false);
    setStep(2);
    window.scrollTo(0, 0);
  }

  async function saveStep2() {
    if (medicalDone) {
      setStep(3);
      window.scrollTo(0, 0);
      return;
    }
    // Validate all answers filled
    const unanswered = MEDICAL_QUESTIONS.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      setError("Please answer all medical questions.");
      return;
    }
    if (!hasSigned) {
      setError("Please sign above to continue.");
      return;
    }
    setSaving(true);
    setError("");

    const hasYes = Object.values(answers).some(a => a === "yes");
    const signatureData = canvasRef.current?.toDataURL("image/png") || "";

    const res = await fetch("/api/portal/medical", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers,
        medical_details: medicalDetails,
        physician_required: hasYes,
        signature: signatureData,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save medical form");
      setSaving(false);
      return;
    }
    setMedicalDone(true);
    setSaving(false);
    setStep(3);
    window.scrollTo(0, 0);
  }

  async function saveStep3() {
    setSaving(true);
    setError("");
    const res = await fetch("/api/portal/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName, last_name: lastName, date_of_birth: dob || null,
        sex, height_ft: heightFt, height_in: heightIn, weight_lbs: weightLbs,
        emergency_contact_name: ecName, emergency_contact_phone: ecPhone,
        emergency_contact_relationship: ecRelationship,
        swim_ability: swimAbility, swim_200m_no_fins: swim200m || null,
        freediving_experience: experience, breath_hold_bucket: breathHold || null,
        deepest_dive_bucket: deepestDive || null,
        fears, goals, theory_preference: theoryPref, notes,
        shoe_size_us: shoeSize || null, shirt_size: shirtSize || null,
        completed_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save");
      setSaving(false);
      return;
    }
    setSaving(false);
    router.push("/portal");
  }

  // ── Render ──────────────────────────────────────────────────────────────

  const stepLabel = step === 1 ? "About You" : step === 2 ? "Medical" : "Gear & Logistics";

  return (
    <div className="min-h-screen bg-salt">
      {/* Header */}
      <div className="bg-deep px-6 py-6">
        <div className="max-w-[600px] mx-auto">
          <div className="text-[10px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-1">Course Onboarding</div>
          <h1 className="font-serif text-xl text-white">Step {step} — {stepLabel}</h1>
          {/* Progress bar */}
          <div className="flex gap-1.5 mt-3">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? "bg-seafoam" : "bg-white/10"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-6 py-8">
        {error && (
          <div className="bg-coral/10 border border-coral/20 rounded-xl px-4 py-3 mb-6 text-coral text-sm">{error}</div>
        )}

        {/* ─── Step 1: About You ─── */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name *" value={firstName} onChange={setFirstName} placeholder="Joshua" />
              <Field label="Last name *" value={lastName} onChange={setLastName} placeholder="Smith" />
            </div>

            <Field label="Date of birth" type="date" value={dob} onChange={setDob} />

            {/* Sex — for wetsuit/gear sizing */}
            <ChoiceRow label="Sex *" options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} value={sex} onChange={setSex} />

            {/* Height & Weight */}
            <div>
              <SectionLabel>Height & Weight *</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Feet" type="number" value={heightFt} onChange={setHeightFt} placeholder="5" min={3} max={8} />
                <Field label="Inches" type="number" value={heightIn} onChange={setHeightIn} placeholder="10" min={0} max={11} />
                <Field label="Weight (lbs)" type="number" value={weightLbs} onChange={setWeightLbs} placeholder="170" min={50} max={450} />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <SectionLabel>Emergency Contact *</SectionLabel>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <Field label="Name" value={ecName} onChange={setEcName} placeholder="Jane Doe" />
                <Field label="Phone" value={ecPhone} onChange={setEcPhone} placeholder="(619) 555-0123" />
              </div>
              <Field label="Relationship" value={ecRelationship} onChange={setEcRelationship} placeholder="e.g. spouse, parent, friend" />
            </div>

            {/* Swim Ability */}
            <RadioGroup label="Swim ability *" options={SWIM_OPTIONS} value={swimAbility} onChange={setSwimAbility} />

            {isAida2Plus && (
              <RadioGroup label="Can you swim 200m continuously without fins?" options={SWIM_200M_OPTIONS} value={swim200m} onChange={setSwim200m} />
            )}

            {/* Experience */}
            <RadioGroup label="Prior freediving experience *" options={EXPERIENCE_OPTIONS} value={experience} onChange={setExperience} />

            <RadioGroup label="Longest comfortable breath hold" options={BREATH_HOLD_OPTIONS} value={breathHold} onChange={setBreathHold} />

            {isAida2Plus && (
              <RadioGroup label="Deepest freedive to date" options={DIVE_BUCKET_OPTIONS} value={deepestDive} onChange={setDeepestDive} />
            )}

            <SaveButton onClick={saveStep1} saving={saving} label="Continue to Medical →" />
          </div>
        )}

        {/* ─── Step 2: Medical ─── */}
        {step === 2 && (
          <div className="space-y-6">
            {medicalDone ? (
              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-seafoam/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-seafoam text-xl">✓</span>
                </div>
                <h2 className="font-serif text-lg mb-1">Medical statement on file</h2>
                <p className="text-sm text-slate/50">Your AIDA medical statement has already been submitted.</p>
                {physicianRequired && !physicianCleared && (
                  <div className="mt-4 bg-coral/10 rounded-xl px-4 py-3 text-sm text-coral">
                    A physician sign-off is required. Joshua will reach out about next steps.
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl p-5">
                  <h2 className="font-serif text-lg mb-1">AIDA Medical Statement</h2>
                  <p className="text-[11px] text-slate/50 mb-4">
                    Required for all AIDA courses. Answer each question honestly — any &quot;yes&quot; answer means we&apos;ll need a physician sign-off before course day.
                  </p>
                  <div className="space-y-3">
                    {MEDICAL_QUESTIONS.map(q => (
                      <div key={q.id} className={`rounded-xl px-4 py-3 ${answers[q.id] === "yes" ? "bg-coral/5 border border-coral/15" : "bg-salt"}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-[10px] text-slate/30 font-bold mt-0.5 shrink-0">{q.id}.</span>
                          <div className="flex-1">
                            <p className="text-sm text-deep leading-relaxed mb-2">
                              <span className="font-semibold text-teal">{q.category}:</span> {q.text}
                            </p>
                            <div className="flex gap-2">
                              {(["yes", "no"] as const).map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    answers[q.id] === opt
                                      ? opt === "yes" ? "bg-coral text-white" : "bg-seafoam text-deep"
                                      : "bg-white border border-deep/[0.08] text-slate/50 hover:bg-deep/5"
                                  }`}
                                >
                                  {opt === "yes" ? "Yes" : "No"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {Object.values(answers).some(a => a === "yes") && (
                  <div className="bg-white rounded-2xl p-5">
                    <SectionLabel>Details for &quot;Yes&quot; answers</SectionLabel>
                    <textarea
                      value={medicalDetails}
                      onChange={e => setMedicalDetails(e.target.value)}
                      placeholder="Please provide details for any condition you answered 'yes' to..."
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-lg bg-salt border border-deep/[0.08] text-sm resize-none focus:outline-none focus:border-teal/40"
                    />
                  </div>
                )}

                <div className="bg-white rounded-2xl p-5">
                  <SectionLabel>Signature</SectionLabel>
                  <p className="text-[11px] text-slate/50 mb-3">
                    By signing below, I certify that the information provided is accurate to the best of my knowledge.
                  </p>
                  <div className="border border-deep/[0.08] rounded-xl overflow-hidden bg-salt mb-2">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-28 cursor-crosshair touch-none"
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={endDraw}
                      onMouseLeave={endDraw}
                      onTouchStart={startDraw}
                      onTouchMove={draw}
                      onTouchEnd={endDraw}
                    />
                  </div>
                  <button onClick={clearSig} className="text-[10px] text-slate/40 hover:text-coral">Clear signature</button>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setStep(1); window.scrollTo(0, 0); }} className="flex-1 px-5 py-3 rounded-full border border-deep/10 text-deep text-sm font-semibold hover:bg-deep/5 transition-colors">
                ← Back
              </button>
              <SaveButton onClick={saveStep2} saving={saving} label={medicalDone ? "Continue to Gear →" : "Save & Continue →"} className="flex-[2]" />
            </div>
          </div>
        )}

        {/* ─── Step 3: Gear & Logistics ─── */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Fears */}
            <MultiSelect
              label="What are you most nervous about?"
              options={FEAR_OPTIONS}
              value={fears}
              onChange={setFears}
            />

            {/* Goals */}
            <MultiSelect
              label="What's drawing you to freediving?"
              options={GOAL_OPTIONS}
              value={goals}
              onChange={setGoals}
            />

            {/* Conditional sizing */}
            <div>
              <SectionLabel>Sizing for Rentals</SectionLabel>
              <p className="text-[11px] text-slate/50 mb-3">Helps us get the right gear ready for you.</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Shoe size (US)" type="number" value={shoeSize} onChange={setShoeSize} placeholder="10" />
                <div>
                  <div className="text-[10px] text-slate/50 mb-1">T-shirt size</div>
                  <select
                    value={shirtSize}
                    onChange={e => setShirtSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-salt border border-deep/[0.08] text-sm focus:outline-none focus:border-teal/40"
                  >
                    <option value="">Select...</option>
                    {["XS", "S", "M", "L", "XL", "XXL"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Weight calculator */}
            {weightLbs && heightFt && (
              <WeightCalculator weightLbs={parseInt(weightLbs)} heightFt={parseInt(heightFt)} heightIn={parseInt(heightIn || "0")} sex={sex} />
            )}

            {/* Theory preference */}
            <RadioGroup
              label="Theory session preference"
              desc="We do the theory portion over Zoom so we can maximize water time on course day."
              options={THEORY_OPTIONS.map(t => ({ value: t.id, label: t.label }))}
              value={theoryPref}
              onChange={setTheoryPref}
            />

            {/* Notes */}
            <div>
              <SectionLabel>Anything else we should know?</SectionLabel>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Injuries, concerns, questions, previous water experience..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg bg-salt border border-deep/[0.08] text-sm resize-none focus:outline-none focus:border-teal/40"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setStep(2); window.scrollTo(0, 0); }} className="flex-1 px-5 py-3 rounded-full border border-deep/10 text-deep text-sm font-semibold hover:bg-deep/5 transition-colors">
                ← Back
              </button>
              <SaveButton onClick={saveStep3} saving={saving} label="Complete Onboarding ✓" className="flex-[2]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared UI Components ──────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-2">{children}</div>;
}

function Field({ label, value, onChange, placeholder, type = "text", min, max }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; min?: number; max?: number;
}) {
  return (
    <div>
      <div className="text-[10px] text-slate/50 mb-1">{label}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-3 py-2 rounded-lg bg-salt border border-deep/[0.08] text-sm focus:outline-none focus:border-teal/40"
      />
    </div>
  );
}

function ChoiceRow({ label, options, value, onChange }: {
  label: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="flex gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              value === opt.value ? "bg-deep text-white" : "bg-salt text-slate hover:bg-deep/5"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RadioGroup({ label, desc, options, value, onChange }: {
  label: string; desc?: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      {desc && <p className="text-[11px] text-slate/50 mb-3">{desc}</p>}
      <div className="space-y-1.5">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
              value === opt.value ? "bg-deep text-white" : "bg-salt text-slate hover:bg-deep/5"
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
              value === opt.value ? "border-seafoam bg-seafoam" : "border-deep/20"
            }`} />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiSelect({ label, options, value, onChange }: {
  label: string; options: { value: string; label: string }[]; value: string[]; onChange: (v: string[]) => void;
}) {
  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  }
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="grid grid-cols-2 gap-1.5">
        {options.map(opt => {
          const checked = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                checked ? "bg-seafoam/10 text-deep border border-seafoam/30" : "bg-salt text-slate border border-transparent hover:bg-deep/5"
              }`}
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] ${
                checked ? "bg-seafoam text-white" : "border border-deep/20"
              }`}>
                {checked && "✓"}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeightCalculator({ weightLbs, heightFt, heightIn, sex }: { weightLbs: number; heightFt: number; heightIn: number; sex: string }) {
  const [thickness, setThickness] = useState("5");

  // Total height in inches
  const totalInches = heightFt * 12 + heightIn;

  // BMI-ish proxy: higher ratio = more buoyant (more body fat tends to float more)
  // Average male: ~5'10" (70in), 170lbs. Average female: ~5'5" (65in), 150lbs.
  const bmi = (weightLbs / (totalInches * totalInches)) * 703;

  // Base weight: ~8-12% of body weight depending on body composition
  // Leaner people (lower BMI) need less weight; higher body fat needs more
  const basePct = bmi < 20 ? 0.06 : bmi < 24 ? 0.08 : bmi < 28 ? 0.10 : 0.12;
  let baseWeight = weightLbs * basePct;

  // Wetsuit buoyancy adjustment: thicker = more buoyancy = more weight needed
  const thicknessNum = parseInt(thickness);
  const suitAdjust = thicknessNum === 3 ? -1 : thicknessNum === 5 ? 0 : thicknessNum === 7 ? 2 : 0;
  baseWeight += suitAdjust;

  // Sex adjustment: females tend to have higher body fat % → slightly more buoyant
  if (sex === "female") baseWeight += 1;

  // Saltwater adds ~3% buoyancy vs fresh — La Jolla is salt
  baseWeight += 1;

  // Round to nearest 0.5
  const recommended = Math.round(baseWeight * 2) / 2;
  const rangeLow = Math.max(recommended - 2, 2);
  const rangeHigh = recommended + 2;

  return (
    <div className="bg-gradient-to-r from-deep to-ocean rounded-2xl p-5">
      <div className="text-[10px] font-bold text-seafoam uppercase tracking-[1.5px] mb-1">Weight Estimate</div>
      <p className="text-white/40 text-[11px] mb-3">
        Based on your body measurements. This is a starting point — Joshua will fine-tune it on course day.
      </p>

      <div className="flex items-center gap-3 mb-4">
        <div className="text-[10px] text-white/50">Wetsuit thickness:</div>
        <div className="flex gap-1">
          {["3", "5", "7"].map(t => (
            <button
              key={t}
              onClick={() => setThickness(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                thickness === t ? "bg-seafoam text-deep" : "bg-white/10 text-white/40 hover:bg-white/15"
              }`}
            >
              {t}mm
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-3">
        <div>
          <div className="text-3xl font-bold text-white">{recommended} <span className="text-lg font-normal text-white/50">lbs</span></div>
          <div className="text-[10px] text-white/30">Range: {rangeLow}–{rangeHigh} lbs</div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[10px] text-white/20">
            {weightLbs}lbs · {heightFt}&apos;{heightIn}&quot; · {thickness}mm suit · saltwater
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveButton({ onClick, saving, label, className }: { onClick: () => void; saving: boolean; label: string; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={`px-5 py-3 rounded-full bg-seafoam text-deep text-sm font-semibold hover:bg-seafoam/80 transition-colors disabled:opacity-50 ${className || "w-full"}`}
    >
      {saving ? "Saving..." : label}
    </button>
  );
}
