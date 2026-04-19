"use client";

import { useState } from "react";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────

interface GearItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  rental_available: boolean;
  rental_note: string | null;
}

interface StudentGearEntry {
  gear_id: string;
  status: string;
  brand: string | null;
  size: string | null;
  condition: string | null;
  notes: string | null;
}

interface Props {
  student: { id: string; email: string; first_name: string | null; last_name: string | null };
  onboarding: Record<string, unknown> | null;
  gearCatalog: GearItem[];
  studentGear: StudentGearEntry[];
}

const STATUS_OPTIONS = [
  { value: "own", label: "I have this", color: "bg-seafoam/10 text-seafoam border-seafoam/30" },
  { value: "need", label: "I need this", color: "bg-coral/10 text-coral border-coral/30" },
  { value: "renting", label: "Renting", color: "bg-sun/10 text-sun border-sun/30" },
] as const;

const CONDITION_OPTIONS = ["new", "good", "fair", "worn"] as const;

const CATEGORY_LABELS: Record<string, { label: string; desc: string }> = {
  essential: { label: "Essential", desc: "Required for your course" },
  recommended: { label: "Recommended", desc: "Highly recommended" },
  optional: { label: "Optional", desc: "Nice to have" },
};

const SWIM_LABELS: Record<string, string> = {
  non_swimmer: "Non-swimmer", basic: "Basic", comfortable: "Comfortable", strong: "Strong", competitive: "Competitive",
};
const EXP_LABELS: Record<string, string> = {
  none: "None", recreational: "Recreational", trained_other_agency: "Trained (other agency)", aida_certified: "AIDA certified",
};

// ── Component ────────────────────────────────────────────────────────

export default function ProfileView({ student, onboarding, gearCatalog, studentGear: initialGear }: Props) {
  const [tab, setTab] = useState<"profile" | "gear" | "weight">("profile");
  const [studentGear, setStudentGear] = useState(initialGear);
  const [expandedGear, setExpandedGear] = useState<string | null>(null);
  const [gearSaving, setGearSaving] = useState<string | null>(null);

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [firstName, setFirstName] = useState((onboarding?.first_name as string) || student.first_name || "");
  const [lastName, setLastName] = useState((onboarding?.last_name as string) || student.last_name || "");
  const [sex, setSex] = useState((onboarding?.sex as string) || "");
  const [heightFt, setHeightFt] = useState((onboarding?.height_ft as number)?.toString() || "");
  const [heightIn, setHeightIn] = useState((onboarding?.height_in as number)?.toString() || "");
  const [weightLbs, setWeightLbs] = useState((onboarding?.weight_lbs as number)?.toString() || "");
  const [ecName, setEcName] = useState((onboarding?.emergency_contact_name as string) || "");
  const [ecPhone, setEcPhone] = useState((onboarding?.emergency_contact_phone as string) || "");
  const [ecRelationship, setEcRelationship] = useState((onboarding?.emergency_contact_relationship as string) || "");

  // Weight calculator
  const [thickness, setThickness] = useState("5");

  async function saveProfile() {
    setProfileSaving(true);
    await fetch("/api/portal/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName, last_name: lastName, sex,
        height_ft: heightFt, height_in: heightIn, weight_lbs: weightLbs,
        emergency_contact_name: ecName, emergency_contact_phone: ecPhone,
        emergency_contact_relationship: ecRelationship,
        // Carry forward existing fields
        swim_ability: onboarding?.swim_ability, freediving_experience: onboarding?.freediving_experience,
        breath_hold_bucket: onboarding?.breath_hold_bucket, deepest_dive_bucket: onboarding?.deepest_dive_bucket,
        fears: onboarding?.fears, goals: onboarding?.goals,
        theory_preference: onboarding?.theory_preference, notes: onboarding?.notes,
        shoe_size_us: onboarding?.shoe_size_us, shirt_size: onboarding?.shirt_size,
        completed_at: onboarding?.completed_at,
      }),
    });
    setProfileSaving(false);
    setProfileSaved(true);
    setEditing(false);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  async function saveGearEntry(gearId: string, updates: Partial<StudentGearEntry>) {
    setGearSaving(gearId);
    const existing = studentGear.find((g) => g.gear_id === gearId);
    const entry = { ...existing, gear_id: gearId, ...updates };
    const res = await fetch("/api/portal/gear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (res.ok) {
      setStudentGear((prev) => {
        const idx = prev.findIndex((g) => g.gear_id === gearId);
        if (idx >= 0) { const next = [...prev]; next[idx] = { ...next[idx], ...updates }; return next; }
        return [...prev, entry as StudentGearEntry];
      });
    }
    setGearSaving(null);
  }

  // Weight calculation
  const wt = parseInt(weightLbs) || 0;
  const ht = (parseInt(heightFt) || 0) * 12 + (parseInt(heightIn) || 0);
  const bmi = ht > 0 ? (wt / (ht * ht)) * 703 : 22;
  const basePct = bmi < 20 ? 0.06 : bmi < 24 ? 0.08 : bmi < 28 ? 0.10 : 0.12;
  let calcWeight = wt * basePct;
  const thicknessNum = parseInt(thickness);
  calcWeight += thicknessNum === 3 ? -1 : thicknessNum === 7 ? 2 : 0;
  if (sex === "female") calcWeight += 1;
  calcWeight += 1; // saltwater
  const recommended = Math.round(calcWeight * 2) / 2;
  const rangeLow = Math.max(recommended - 2, 2);
  const rangeHigh = recommended + 2;

  // Gear grouping
  const grouped = gearCatalog.reduce<Record<string, GearItem[]>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-salt">
      <div className="bg-deep px-6 py-6">
        <div className="max-w-[600px] mx-auto">
          <Link href="/portal" className="text-[10px] text-seafoam/50 no-underline hover:text-seafoam">← Back to Portal</Link>
          <h1 className="font-serif text-xl text-white mt-1">My Profile & Gear</h1>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          {([["profile", "Profile"], ["gear", "My Gear"], ["weight", "Weight Calculator"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === id ? "bg-deep text-white" : "text-slate/50 hover:text-deep hover:bg-deep/5"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {tab === "profile" && (
          <div className="bg-white rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg">Personal Details</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="text-[11px] text-teal font-medium hover:underline">
                  {profileSaved ? "Saved ✓" : "Edit"}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={saveProfile} disabled={profileSaving} className="px-3 py-1 rounded-full bg-seafoam text-deep text-[11px] font-semibold disabled:opacity-50">
                    {profileSaving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setEditing(false)} className="px-3 py-1 rounded-full border border-deep/10 text-slate text-[11px]">Cancel</button>
                </div>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="First name" value={firstName} onChange={setFirstName} />
                  <InputField label="Last name" value={lastName} onChange={setLastName} />
                </div>
                <div className="flex gap-2">
                  {["male", "female"].map(s => (
                    <button key={s} onClick={() => setSex(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${sex === s ? "bg-deep text-white" : "bg-salt text-slate"}`}>{s}</button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <InputField label="Height (ft)" type="number" value={heightFt} onChange={setHeightFt} />
                  <InputField label="Height (in)" type="number" value={heightIn} onChange={setHeightIn} />
                  <InputField label="Weight (lbs)" type="number" value={weightLbs} onChange={setWeightLbs} />
                </div>
                <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mt-4">Emergency Contact</div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Name" value={ecName} onChange={setEcName} />
                  <InputField label="Phone" value={ecPhone} onChange={setEcPhone} />
                </div>
                <InputField label="Relationship" value={ecRelationship} onChange={setEcRelationship} />
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow label="Name" value={`${firstName} ${lastName}`.trim() || "—"} />
                <InfoRow label="Sex" value={sex || "—"} />
                <InfoRow label="Height" value={heightFt ? `${heightFt}'${heightIn || 0}"` : "—"} />
                <InfoRow label="Weight" value={weightLbs ? `${weightLbs} lbs` : "—"} />
                <InfoRow label="Swim ability" value={SWIM_LABELS[onboarding?.swim_ability as string] || (onboarding?.swim_ability as string) || "—"} />
                <InfoRow label="Experience" value={EXP_LABELS[onboarding?.freediving_experience as string] || (onboarding?.freediving_experience as string) || "—"} />
                <div className="border-t border-deep/[0.06] pt-3 mt-3">
                  <div className="text-[10px] text-teal/50 font-medium uppercase tracking-wider mb-2">Emergency Contact</div>
                  <InfoRow label="Name" value={ecName || "—"} />
                  <InfoRow label="Phone" value={ecPhone || "—"} />
                  <InfoRow label="Relationship" value={ecRelationship || "—"} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Gear Tab ── */}
        {tab === "gear" && (
          <div className="space-y-4">
            {(["essential", "recommended", "optional"] as const).map((cat) => {
              const items = grouped[cat];
              if (!items || items.length === 0) return null;
              const meta = CATEGORY_LABELS[cat];
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      cat === "essential" ? "text-coral" : cat === "recommended" ? "text-sun" : "text-slate/40"
                    }`}>{meta.label}</span>
                    <span className="text-[9px] text-slate/30">{meta.desc}</span>
                  </div>
                  <div className="space-y-1.5">
                    {items.map((item) => {
                      const entry = studentGear.find((g) => g.gear_id === item.id);
                      const isExpanded = expandedGear === item.id;
                      const isSaving = gearSaving === item.id;
                      const statusInfo = STATUS_OPTIONS.find((s) => s.value === entry?.status);
                      return (
                        <div key={item.id} className="bg-white rounded-xl border border-deep/[0.06] overflow-hidden">
                          <button onClick={() => setExpandedGear(isExpanded ? null : item.id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-salt/50 transition-colors">
                            <span className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-[9px] font-bold ${
                              entry?.status === "own" ? "bg-seafoam text-white" :
                              entry?.status === "renting" ? "bg-sun text-white" :
                              entry?.status === "need" ? "bg-coral/20 text-coral" :
                              "border border-deep/15 text-deep/20"
                            }`}>
                              {entry?.status === "own" ? "✓" : entry?.status === "renting" ? "R" : entry?.status === "need" ? "!" : "?"}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-deep">{item.name}</div>
                              {entry && <div className="text-[10px] text-slate/40">{[entry.brand, entry.size, entry.condition].filter(Boolean).join(" · ") || statusInfo?.value}</div>}
                            </div>
                            {statusInfo && <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${statusInfo.color}`}>{statusInfo.label}</span>}
                            <span className={`text-slate/30 text-xs transition-transform ${isExpanded ? "rotate-180" : ""}`}>▾</span>
                          </button>
                          {isExpanded && (
                            <div className="px-3 pb-3 pt-1 border-t border-deep/[0.04] bg-salt/30">
                              {item.description && <p className="text-[11px] text-slate/50 mb-3">{item.description}</p>}
                              {item.rental_available && item.rental_note && <p className="text-[10px] text-teal/60 mb-3 bg-teal/5 rounded-lg px-2.5 py-1.5">Rental: {item.rental_note}</p>}
                              <div className="flex gap-1.5 mb-3">
                                {STATUS_OPTIONS.map((opt) => (
                                  <button key={opt.value} onClick={() => saveGearEntry(item.id, { status: opt.value })} disabled={isSaving}
                                    className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold border transition-colors ${
                                      entry?.status === opt.value ? opt.color : "border-deep/[0.06] text-slate/40 hover:bg-deep/[0.03]"
                                    }`}>{opt.label}</button>
                                ))}
                              </div>
                              {entry?.status === "own" && (
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <div className="text-[9px] text-slate/40 mb-0.5">Brand</div>
                                      <input type="text" defaultValue={entry.brand || ""} onBlur={(e) => saveGearEntry(item.id, { brand: e.target.value })} placeholder="e.g. Cressi"
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-deep/[0.06] text-xs focus:outline-none focus:border-teal/40" />
                                    </div>
                                    <div>
                                      <div className="text-[9px] text-slate/40 mb-0.5">Size</div>
                                      <input type="text" defaultValue={entry.size || ""} onBlur={(e) => saveGearEntry(item.id, { size: e.target.value })} placeholder="e.g. M, 42"
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-deep/[0.06] text-xs focus:outline-none focus:border-teal/40" />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[9px] text-slate/40 mb-0.5">Condition</div>
                                    <div className="flex gap-1">
                                      {CONDITION_OPTIONS.map((c) => (
                                        <button key={c} onClick={() => saveGearEntry(item.id, { condition: c })}
                                          className={`flex-1 px-2 py-1 rounded text-[10px] font-medium capitalize transition-colors ${
                                            entry.condition === c ? "bg-deep text-white" : "bg-white border border-deep/[0.06] text-slate/50 hover:bg-deep/5"
                                          }`}>{c}</button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {isSaving && <div className="text-[10px] text-teal/50 mt-1">Saving...</div>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Weight Calculator Tab ── */}
        {tab === "weight" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-deep to-ocean rounded-2xl p-6">
              <div className="text-[10px] font-bold text-seafoam uppercase tracking-[1.5px] mb-1">Dive Weight Estimate</div>
              <p className="text-white/40 text-[11px] mb-4">
                Based on your body measurements. This is a starting point — Joshua will fine-tune it on course day.
              </p>

              <div className="flex items-center gap-3 mb-5">
                <div className="text-[10px] text-white/50">Wetsuit thickness:</div>
                <div className="flex gap-1">
                  {["3", "5", "7"].map(t => (
                    <button key={t} onClick={() => setThickness(t)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        thickness === t ? "bg-seafoam text-deep" : "bg-white/10 text-white/40 hover:bg-white/15"
                      }`}>{t}mm</button>
                  ))}
                </div>
              </div>

              {wt > 0 && ht > 0 ? (
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-4xl font-bold text-white">{recommended} <span className="text-xl font-normal text-white/50">lbs</span></div>
                    <div className="text-[11px] text-white/30 mt-1">Range: {rangeLow}–{rangeHigh} lbs</div>
                  </div>
                  <div className="text-right text-[10px] text-white/20 leading-relaxed">
                    {wt} lbs · {heightFt}&apos;{heightIn || 0}&quot;<br />
                    {thickness}mm suit · saltwater · {sex || "—"}
                  </div>
                </div>
              ) : (
                <p className="text-white/30 text-sm">Add your height and weight in the Profile tab to see your estimate.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5">
              <h3 className="font-serif text-base mb-3">How weight works</h3>
              <div className="space-y-3 text-sm text-slate/70 leading-relaxed">
                <p>Lead weight counteracts the buoyancy of your wetsuit and body fat. The goal is <strong>neutral buoyancy at 10m</strong> — you float at the surface, sink gently past 10m, and don&apos;t have to fight to ascend or descend.</p>
                <p><strong>Thicker wetsuits</strong> trap more air, making you more buoyant — so you need more weight. A 7mm suit needs ~2 lbs more than a 5mm.</p>
                <p><strong>Body composition</strong> matters more than body weight alone. Muscle is denser than fat, so two people at 170 lbs may need different amounts of lead.</p>
                <p className="text-[11px] text-teal/60">Joshua will do a buoyancy check with you on course day and adjust from there. This estimate gets you in the ballpark.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small components ─────────────────────────────────────────────────

function InputField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <div className="text-[10px] text-slate/50 mb-1">{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-salt border border-deep/[0.08] text-sm focus:outline-none focus:border-teal/40" />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-slate/50">{label}</span>
      <span className="text-sm font-medium text-deep capitalize">{value}</span>
    </div>
  );
}
