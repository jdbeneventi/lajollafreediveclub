"use client";

import { useState, useEffect } from "react";

const THEORY_OPTIONS = [
  { id: "friday_evening", label: "Friday evening (Zoom)" },
  { id: "saturday_afternoon", label: "Saturday afternoon (Zoom)" },
  { id: "saturday_evening", label: "Saturday evening (Zoom)" },
  { id: "no_preference", label: "No preference" },
] as const;

const CONDITION_OPTIONS = ["new", "good", "fair", "worn"] as const;
const STATUS_OPTIONS = [
  { value: "own", label: "I have this", color: "bg-seafoam/10 text-seafoam border-seafoam/30" },
  { value: "need", label: "I need this", color: "bg-coral/10 text-coral border-coral/30" },
  { value: "renting", label: "Renting", color: "bg-sun/10 text-sun border-sun/30" },
] as const;

const CATEGORY_LABELS: Record<string, { label: string; desc: string }> = {
  essential: { label: "Essential", desc: "Required for your course" },
  recommended: { label: "Recommended", desc: "Highly recommended for comfort and safety" },
  optional: { label: "Optional", desc: "Nice to have but not required" },
};

interface GearItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  rental_available: boolean;
  rental_note: string | null;
  sort_order: number;
}

interface StudentGearEntry {
  gear_id: string;
  status: string;
  brand: string | null;
  size: string | null;
  condition: string | null;
  notes: string | null;
}

interface OnboardingData {
  sex: string | null;
  height_ft: number | null;
  height_in: number | null;
  weight_lbs: number | null;
  gear_owned: string[];
  theory_preference: string | null;
  notes: string | null;
}

export function OnboardingCard({ initial }: { initial: OnboardingData | null }) {
  const [sex, setSex] = useState(initial?.sex || "");
  const [heightFt, setHeightFt] = useState(initial?.height_ft?.toString() || "");
  const [heightIn, setHeightIn] = useState(initial?.height_in?.toString() || "");
  const [weightLbs, setWeightLbs] = useState(initial?.weight_lbs?.toString() || "");
  const [theoryPref, setTheoryPref] = useState(initial?.theory_preference || "");
  const [profileNotes, setProfileNotes] = useState(initial?.notes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Gear state — loaded from API
  const [catalog, setCatalog] = useState<GearItem[]>([]);
  const [studentGear, setStudentGear] = useState<StudentGearEntry[]>([]);
  const [gearLoaded, setGearLoaded] = useState(false);
  const [expandedGear, setExpandedGear] = useState<string | null>(null);
  const [gearSaving, setGearSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/gear")
      .then((r) => r.json())
      .then((d) => {
        setCatalog(d.catalog || []);
        setStudentGear(d.studentGear || []);
        setGearLoaded(true);
      })
      .catch(() => setGearLoaded(true));
  }, []);

  const isProfileComplete = sex && heightFt && weightLbs;

  async function handleSaveProfile() {
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/portal/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sex,
        height_ft: heightFt,
        height_in: heightIn,
        weight_lbs: weightLbs,
        gear_owned: studentGear.filter((g) => g.status === "own").map((g) => {
          const item = catalog.find((c) => c.id === g.gear_id);
          return item?.slug || g.gear_id;
        }),
        theory_preference: theoryPref,
        notes: profileNotes,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save");
    } else {
      setSaved(true);
    }
    setSaving(false);
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
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], ...updates };
          return next;
        }
        return [...prev, entry as StudentGearEntry];
      });
    }
    setGearSaving(null);
    setSaved(false);
  }

  // Group catalog by category
  const grouped = catalog.reduce<Record<string, GearItem[]>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  const essentialCount = catalog.filter((g) => g.category === "essential").length;
  const ownedEssential = catalog.filter((g) => {
    if (g.category !== "essential") return false;
    const entry = studentGear.find((sg) => sg.gear_id === g.id);
    return entry && (entry.status === "own" || entry.status === "renting");
  }).length;

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-deep to-ocean px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-seafoam uppercase tracking-[1.5px] mb-1">
              Before Your Course
            </div>
            <h2 className="font-serif text-lg text-white">Course Onboarding</h2>
          </div>
          {isProfileComplete && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-seafoam/20 text-seafoam">
              {saved ? "Saved ✓" : "Profile complete"}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Sex */}
        <div>
          <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
            Sex
          </label>
          <div className="flex gap-2">
            {[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setSex(opt.value); setSaved(false); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sex === opt.value
                    ? "bg-deep text-white"
                    : "bg-salt text-slate hover:bg-deep/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Height & Weight */}
        <div>
          <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
            Height & Weight
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-[10px] text-slate/50 mb-1">Feet</div>
              <input
                type="number"
                min="3"
                max="7"
                value={heightFt}
                onChange={(e) => { setHeightFt(e.target.value); setSaved(false); }}
                placeholder="5"
                className="w-full px-3 py-2 rounded-lg bg-salt border border-deep/[0.08] text-sm focus:outline-none focus:border-teal/40"
              />
            </div>
            <div>
              <div className="text-[10px] text-slate/50 mb-1">Inches</div>
              <input
                type="number"
                min="0"
                max="11"
                value={heightIn}
                onChange={(e) => { setHeightIn(e.target.value); setSaved(false); }}
                placeholder="10"
                className="w-full px-3 py-2 rounded-lg bg-salt border border-deep/[0.08] text-sm focus:outline-none focus:border-teal/40"
              />
            </div>
            <div>
              <div className="text-[10px] text-slate/50 mb-1">Weight (lbs)</div>
              <input
                type="number"
                min="50"
                max="400"
                value={weightLbs}
                onChange={(e) => { setWeightLbs(e.target.value); setSaved(false); }}
                placeholder="170"
                className="w-full px-3 py-2 rounded-lg bg-salt border border-deep/[0.08] text-sm focus:outline-none focus:border-teal/40"
              />
            </div>
          </div>
        </div>

        {/* Gear — Dynamic from catalog */}
        <div>
          <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-1">
            Your Gear
          </label>
          {essentialCount > 0 && (
            <p className="text-[11px] text-slate/50 mb-3">
              {ownedEssential}/{essentialCount} essentials covered.
              Tap each item to set status and add details.
            </p>
          )}

          {!gearLoaded ? (
            <div className="text-slate/40 text-sm py-4 text-center">Loading gear list...</div>
          ) : catalog.length === 0 ? (
            <div className="text-slate/40 text-sm py-4 text-center">No gear items configured yet.</div>
          ) : (
            <div className="space-y-4">
              {(["essential", "recommended", "optional"] as const).map((cat) => {
                const items = grouped[cat];
                if (!items || items.length === 0) return null;
                const meta = CATEGORY_LABELS[cat];
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        cat === "essential" ? "text-coral" :
                        cat === "recommended" ? "text-sun" : "text-slate/40"
                      }`}>
                        {meta.label}
                      </span>
                      <span className="text-[9px] text-slate/30">{meta.desc}</span>
                    </div>
                    <div className="space-y-1.5">
                      {items.map((item) => {
                        const entry = studentGear.find((g) => g.gear_id === item.id);
                        const isExpanded = expandedGear === item.id;
                        const isSaving = gearSaving === item.id;
                        const statusInfo = STATUS_OPTIONS.find((s) => s.value === entry?.status);

                        return (
                          <div key={item.id} className="rounded-xl border border-deep/[0.06] overflow-hidden">
                            {/* Header row */}
                            <button
                              onClick={() => setExpandedGear(isExpanded ? null : item.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-salt/50 transition-colors"
                            >
                              <span className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-[9px] font-bold ${
                                entry?.status === "own" ? "bg-seafoam text-white" :
                                entry?.status === "renting" ? "bg-sun text-white" :
                                entry?.status === "need" ? "bg-coral/20 text-coral" :
                                "border border-deep/15 text-deep/20"
                              }`}>
                                {entry?.status === "own" ? "✓" :
                                 entry?.status === "renting" ? "R" :
                                 entry?.status === "need" ? "!" : "?"}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-deep">{item.name}</div>
                                {entry && (
                                  <div className="text-[10px] text-slate/40">
                                    {[entry.brand, entry.size, entry.condition].filter(Boolean).join(" · ") || statusInfo?.value}
                                  </div>
                                )}
                              </div>
                              {statusInfo && (
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              )}
                              <span className={`text-slate/30 text-xs transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                                ▾
                              </span>
                            </button>

                            {/* Expanded detail */}
                            {isExpanded && (
                              <div className="px-3 pb-3 pt-1 border-t border-deep/[0.04] bg-salt/30">
                                {item.description && (
                                  <p className="text-[11px] text-slate/50 mb-3">{item.description}</p>
                                )}
                                {item.rental_available && item.rental_note && (
                                  <p className="text-[10px] text-teal/60 mb-3 bg-teal/5 rounded-lg px-2.5 py-1.5">
                                    Rental: {item.rental_note}
                                  </p>
                                )}

                                {/* Status buttons */}
                                <div className="flex gap-1.5 mb-3">
                                  {STATUS_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      onClick={() => saveGearEntry(item.id, { status: opt.value })}
                                      disabled={isSaving}
                                      className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold border transition-colors ${
                                        entry?.status === opt.value
                                          ? opt.color
                                          : "border-deep/[0.06] text-slate/40 hover:bg-deep/[0.03]"
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>

                                {/* Detail fields — only show if they own it */}
                                {entry?.status === "own" && (
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <div className="text-[9px] text-slate/40 mb-0.5">Brand</div>
                                        <input
                                          type="text"
                                          defaultValue={entry.brand || ""}
                                          onBlur={(e) => saveGearEntry(item.id, { brand: e.target.value })}
                                          placeholder="e.g. Cressi, Mares"
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-deep/[0.06] text-xs focus:outline-none focus:border-teal/40"
                                        />
                                      </div>
                                      <div>
                                        <div className="text-[9px] text-slate/40 mb-0.5">Size</div>
                                        <input
                                          type="text"
                                          defaultValue={entry.size || ""}
                                          onBlur={(e) => saveGearEntry(item.id, { size: e.target.value })}
                                          placeholder="e.g. M, 42, 7mm"
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-deep/[0.06] text-xs focus:outline-none focus:border-teal/40"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[9px] text-slate/40 mb-0.5">Condition</div>
                                      <div className="flex gap-1">
                                        {CONDITION_OPTIONS.map((c) => (
                                          <button
                                            key={c}
                                            onClick={() => saveGearEntry(item.id, { condition: c })}
                                            className={`flex-1 px-2 py-1 rounded text-[10px] font-medium capitalize transition-colors ${
                                              entry.condition === c
                                                ? "bg-deep text-white"
                                                : "bg-white border border-deep/[0.06] text-slate/50 hover:bg-deep/5"
                                            }`}
                                          >
                                            {c}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[9px] text-slate/40 mb-0.5">Notes</div>
                                      <input
                                        type="text"
                                        defaultValue={entry.notes || ""}
                                        onBlur={(e) => saveGearEntry(item.id, { notes: e.target.value })}
                                        placeholder="Any details..."
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-deep/[0.06] text-xs focus:outline-none focus:border-teal/40"
                                      />
                                    </div>
                                  </div>
                                )}

                                {isSaving && (
                                  <div className="text-[10px] text-teal/50 mt-1">Saving...</div>
                                )}
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
        </div>

        {/* Theory Preference */}
        <div>
          <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-1">
            Theory Session Preference
          </label>
          <p className="text-[11px] text-slate/50 mb-3">
            We do the theory portion over Zoom so we can maximize water time on course day.
          </p>
          <div className="space-y-2">
            {THEORY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { setTheoryPref(opt.id); setSaved(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                  theoryPref === opt.id
                    ? "bg-deep text-white"
                    : "bg-salt text-slate hover:bg-deep/5"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                    theoryPref === opt.id
                      ? "border-seafoam bg-seafoam"
                      : "border-deep/20"
                  }`}
                />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
            Anything else we should know?
          </label>
          <textarea
            value={profileNotes}
            onChange={(e) => { setProfileNotes(e.target.value); setSaved(false); }}
            placeholder="Injuries, concerns, questions, previous water experience..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg bg-salt border border-deep/[0.08] text-sm resize-none focus:outline-none focus:border-teal/40"
          />
        </div>

        {/* Save profile */}
        {error && (
          <p className="text-[11px] text-coral">{error}</p>
        )}
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full px-5 py-3 rounded-full bg-seafoam text-deep text-sm font-semibold hover:bg-seafoam/80 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
