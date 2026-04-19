"use client";

import { useState } from "react";

const GEAR_ITEMS = [
  { id: "wetsuit", label: "5mm Wetsuit" },
  { id: "hood", label: "Hood" },
  { id: "mask", label: "Mask" },
  { id: "snorkel", label: "Snorkel" },
  { id: "fins", label: "Fins" },
  { id: "booties", label: "Booties" },
  { id: "gloves", label: "Gloves" },
  { id: "weight_belt", label: "Weight Belt" },
  { id: "weights", label: "Weights" },
] as const;

const THEORY_OPTIONS = [
  { id: "friday_evening", label: "Friday evening (Zoom)" },
  { id: "saturday_afternoon", label: "Saturday afternoon (Zoom)" },
  { id: "saturday_evening", label: "Saturday evening (Zoom)" },
  { id: "no_preference", label: "No preference" },
] as const;

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
  const [gearOwned, setGearOwned] = useState<string[]>(initial?.gear_owned || []);
  const [theoryPref, setTheoryPref] = useState(initial?.theory_preference || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const isComplete = sex && heightFt && weightLbs;
  const hasAllGear = GEAR_ITEMS.every((g) => gearOwned.includes(g.id));
  const needsSizing = !hasAllGear && (!heightFt || !weightLbs);

  function toggleGear(id: string) {
    setGearOwned((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
    setSaved(false);
  }

  async function handleSave() {
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
        gear_owned: gearOwned,
        theory_preference: theoryPref,
        notes,
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
          {isComplete && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-seafoam/20 text-seafoam">
              {saved ? "Saved ✓" : "Complete"}
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
          {needsSizing && (
            <p className="text-[10px] text-coral mt-2">
              Height & weight help us size rental gear for items you don&apos;t have.
            </p>
          )}
        </div>

        {/* Gear Checklist */}
        <div>
          <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-1">
            Gear You Own
          </label>
          <p className="text-[11px] text-slate/50 mb-3">
            Check everything you already have. We&apos;ll help with anything you&apos;re missing.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {GEAR_ITEMS.map((item) => {
              const checked = gearOwned.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleGear(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                    checked
                      ? "bg-seafoam/10 text-deep border border-seafoam/30"
                      : "bg-salt text-slate border border-transparent hover:bg-deep/5"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] ${
                      checked
                        ? "bg-seafoam text-white"
                        : "border border-deep/20"
                    }`}
                  >
                    {checked && "✓"}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>
          {hasAllGear && (
            <p className="text-[11px] text-seafoam mt-2 font-medium">
              You&apos;re all set on gear!
            </p>
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
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
            placeholder="Injuries, concerns, questions, previous water experience..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg bg-salt border border-deep/[0.08] text-sm resize-none focus:outline-none focus:border-teal/40"
          />
        </div>

        {/* Save */}
        {error && (
          <p className="text-[11px] text-coral">{error}</p>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-5 py-3 rounded-full bg-seafoam text-deep text-sm font-semibold hover:bg-seafoam/80 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Onboarding Info"}
        </button>
      </div>
    </div>
  );
}
