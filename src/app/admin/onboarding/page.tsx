"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SECRET = "ljfc";

const GEAR_LABELS: Record<string, string> = {
  wetsuit: "Wetsuit",
  hood: "Hood",
  mask: "Mask",
  snorkel: "Snorkel",
  fins: "Fins",
  booties: "Booties",
  gloves: "Gloves",
  weight_belt: "Belt",
  weights: "Weights",
};

const ALL_GEAR = Object.keys(GEAR_LABELS);

const THEORY_LABELS: Record<string, string> = {
  friday_evening: "Friday evening",
  saturday_afternoon: "Saturday afternoon",
  saturday_evening: "Saturday evening",
  no_preference: "No preference",
};

interface OnboardingRecord {
  student_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  sex: string | null;
  height_ft: number | null;
  height_in: number | null;
  weight_lbs: number | null;
  gear_owned: string[];
  theory_preference: string | null;
  notes: string | null;
  updated_at: string;
}

export default function AdminOnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep flex items-center justify-center text-white/40">Loading...</div>}>
      <AdminOnboardingContent />
    </Suspense>
  );
}

function AdminOnboardingContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [records, setRecords] = useState<OnboardingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (key === SECRET) setAuthed(true);
  }, [key]);

  useEffect(() => {
    if (!authed) return;
    fetch(`/api/admin/onboarding?key=${SECRET}`)
      .then((r) => r.json())
      .then((d) => {
        setRecords(d.records || []);
        setLoading(false);
      });
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <div className="bg-white/5 rounded-2xl p-8 w-full max-w-sm">
          <h1 className="font-serif text-xl text-white mb-4">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && password === SECRET && setAuthed(true)}
            placeholder="Password"
            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm mb-3"
          />
          <button
            onClick={() => password === SECRET && setAuthed(true)}
            className="w-full px-4 py-2.5 rounded-full bg-seafoam text-deep text-sm font-semibold"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  const selectedRecord = records.find((r) => r.student_id === selected);
  const needsGear = records.filter((r) => r.gear_owned.length < ALL_GEAR.length);
  const theoryVotes = records.reduce<Record<string, number>>((acc, r) => {
    if (r.theory_preference) acc[r.theory_preference] = (acc[r.theory_preference] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-deep">
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href={`/admin?key=${SECRET}`} className="text-[11px] text-seafoam/60 no-underline hover:text-seafoam">
                ← Admin Hub
              </Link>
              <h1 className="font-serif text-2xl text-white mt-1">Student Onboarding</h1>
              <p className="text-white/40 text-sm">{records.length} students submitted</p>
            </div>
          </div>

          {loading ? (
            <div className="text-white/40 text-center py-20">Loading...</div>
          ) : records.length === 0 ? (
            <div className="text-white/40 text-center py-20">No onboarding data yet.</div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <StatBox label="Submitted" value={records.length} />
                <StatBox label="Need Gear" value={needsGear.length} />
                <StatBox
                  label="Top Theory Time"
                  value={
                    Object.entries(theoryVotes).sort((a, b) => b[1] - a[1])[0]
                      ? THEORY_LABELS[Object.entries(theoryVotes).sort((a, b) => b[1] - a[1])[0][0]] || "—"
                      : "—"
                  }
                  small
                />
                <StatBox
                  label="Avg Weight"
                  value={
                    Math.round(
                      records.filter((r) => r.weight_lbs).reduce((sum, r) => sum + (r.weight_lbs || 0), 0) /
                        (records.filter((r) => r.weight_lbs).length || 1)
                    ) + " lbs"
                  }
                  small
                />
              </div>

              {/* Two-panel layout */}
              <div className="grid md:grid-cols-[1fr_1.2fr] gap-4">
                {/* Student list */}
                <div className="bg-white/5 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5">
                    <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Students</div>
                  </div>
                  <div className="max-h-[600px] overflow-y-auto">
                    {records.map((r) => {
                      const name = [r.first_name, r.last_name].filter(Boolean).join(" ") || r.email;
                      const missingGear = ALL_GEAR.filter((g) => !r.gear_owned.includes(g));
                      const isSelected = selected === r.student_id;
                      return (
                        <button
                          key={r.student_id}
                          onClick={() => setSelected(r.student_id)}
                          className={`w-full text-left px-4 py-3 border-b border-white/5 transition-colors ${
                            isSelected ? "bg-seafoam/10" : "hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-white font-medium">{name}</div>
                            <div className="flex gap-1">
                              {missingGear.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-coral/20 text-coral">
                                  {missingGear.length} missing
                                </span>
                              )}
                              {missingGear.length === 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-seafoam/20 text-seafoam">
                                  All gear ✓
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-[10px] text-white/30 mt-0.5">{r.email}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detail panel */}
                <div className="bg-white/5 rounded-2xl p-6">
                  {!selectedRecord ? (
                    <div className="text-white/30 text-center py-20 text-sm">Select a student to view details</div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <h2 className="font-serif text-xl text-white">
                          {[selectedRecord.first_name, selectedRecord.last_name].filter(Boolean).join(" ") || selectedRecord.email}
                        </h2>
                        <div className="text-xs text-white/40">{selectedRecord.email}</div>
                      </div>

                      {/* Bio */}
                      <div className="grid grid-cols-3 gap-3">
                        <InfoBox label="Sex" value={selectedRecord.sex || "—"} />
                        <InfoBox
                          label="Height"
                          value={
                            selectedRecord.height_ft
                              ? `${selectedRecord.height_ft}'${selectedRecord.height_in || 0}"`
                              : "—"
                          }
                        />
                        <InfoBox label="Weight" value={selectedRecord.weight_lbs ? `${selectedRecord.weight_lbs} lbs` : "—"} />
                      </div>

                      {/* Gear */}
                      <div>
                        <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-2">Gear</div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {ALL_GEAR.map((g) => {
                            const has = selectedRecord.gear_owned.includes(g);
                            return (
                              <div
                                key={g}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium ${
                                  has
                                    ? "bg-seafoam/10 text-seafoam"
                                    : "bg-coral/10 text-coral"
                                }`}
                              >
                                {has ? "✓" : "✗"} {GEAR_LABELS[g]}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Theory */}
                      <div>
                        <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-1">Theory Preference</div>
                        <div className="text-sm text-white">
                          {selectedRecord.theory_preference
                            ? THEORY_LABELS[selectedRecord.theory_preference] || selectedRecord.theory_preference
                            : "Not selected"}
                        </div>
                      </div>

                      {/* Notes */}
                      {selectedRecord.notes && (
                        <div>
                          <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-1">Notes</div>
                          <div className="text-sm text-white/70 bg-white/[0.03] rounded-lg px-3 py-2">{selectedRecord.notes}</div>
                        </div>
                      )}

                      <div className="text-[10px] text-white/20">
                        Updated {new Date(selectedRecord.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div className="bg-white/5 rounded-xl px-4 py-3">
      <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider">{label}</div>
      <div className={`text-white font-bold mt-0.5 ${small ? "text-sm" : "text-xl"}`}>{value}</div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/[0.03] rounded-lg px-3 py-2">
      <div className="text-[10px] text-white/30">{label}</div>
      <div className="text-sm text-white font-medium capitalize">{value}</div>
    </div>
  );
}
