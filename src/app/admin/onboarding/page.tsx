"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SECRET = "ljfc";

const THEORY_LABELS: Record<string, string> = {
  friday_evening: "Friday evening",
  saturday_afternoon: "Saturday afternoon",
  saturday_evening: "Saturday evening",
  no_preference: "No preference",
};

const STATUS_COLORS: Record<string, string> = {
  own: "bg-seafoam/10 text-seafoam",
  need: "bg-coral/10 text-coral",
  renting: "bg-sun/10 text-sun",
};

interface GearCatalogItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  rental_available: boolean;
  rental_note: string | null;
  sort_order: number;
  archived: boolean;
}

interface StudentGearEntry {
  gear_id: string;
  student_id: string;
  status: string;
  brand: string | null;
  size: string | null;
  condition: string | null;
  notes: string | null;
  students: { email: string; first_name: string | null; last_name: string | null } | null;
}

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
  const [catalog, setCatalog] = useState<GearCatalogItem[]>([]);
  const [allStudentGear, setAllStudentGear] = useState<StudentGearEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"students" | "catalog">("students");

  // Add gear form
  const [showAddGear, setShowAddGear] = useState(false);
  const [newGear, setNewGear] = useState({ name: "", slug: "", category: "essential", description: "", rental_available: false, rental_note: "" });
  const [addingGear, setAddingGear] = useState(false);

  useEffect(() => {
    if (key === SECRET) setAuthed(true);
  }, [key]);

  function fetchData() {
    if (!authed) return;
    Promise.all([
      fetch(`/api/admin/onboarding?key=${SECRET}`).then((r) => r.json()),
      fetch(`/api/admin/gear?key=${SECRET}`).then((r) => r.json()),
    ]).then(([onb, gear]) => {
      setRecords(onb.records || []);
      setCatalog(gear.catalog || []);
      setAllStudentGear(gear.studentGear || []);
      setLoading(false);
    });
  }

  useEffect(fetchData, [authed]);

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

  const activeCatalog = catalog.filter((g) => !g.archived);
  const essentialIds = activeCatalog.filter((g) => g.category === "essential").map((g) => g.id);
  const selectedRecord = records.find((r) => r.student_id === selected);
  const selectedGear = allStudentGear.filter((g) => g.student_id === selected);

  const studentsNeedingGear = records.filter((r) => {
    const gear = allStudentGear.filter((g) => g.student_id === r.student_id);
    return essentialIds.some((eid) => {
      const entry = gear.find((g) => g.gear_id === eid);
      return !entry || entry.status === "need";
    });
  });

  const theoryVotes = records.reduce<Record<string, number>>((acc, r) => {
    if (r.theory_preference) acc[r.theory_preference] = (acc[r.theory_preference] || 0) + 1;
    return acc;
  }, {});

  async function handleAddGear() {
    if (!newGear.name || !newGear.slug) return;
    setAddingGear(true);
    await fetch(`/api/admin/gear?key=${SECRET}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", ...newGear, sort_order: activeCatalog.length + 1 }),
    });
    setNewGear({ name: "", slug: "", category: "essential", description: "", rental_available: false, rental_note: "" });
    setShowAddGear(false);
    setAddingGear(false);
    fetchData();
  }

  async function handleArchiveGear(id: string) {
    await fetch(`/api/admin/gear?key=${SECRET}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive", id }),
    });
    fetchData();
  }

  return (
    <div className="min-h-screen bg-deep">
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href={`/admin?key=${SECRET}`} className="text-[11px] text-seafoam/60 no-underline hover:text-seafoam">
                ← Admin Hub
              </Link>
              <h1 className="font-serif text-2xl text-white mt-1">Student Onboarding</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6">
            <button
              onClick={() => setTab("students")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "students" ? "bg-seafoam text-deep" : "text-white/40 hover:text-white/60"
              }`}
            >
              Students ({records.length})
            </button>
            <button
              onClick={() => setTab("catalog")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "catalog" ? "bg-seafoam text-deep" : "text-white/40 hover:text-white/60"
              }`}
            >
              Gear Catalog ({activeCatalog.length})
            </button>
          </div>

          {loading ? (
            <div className="text-white/40 text-center py-20">Loading...</div>
          ) : tab === "students" ? (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <StatBox label="Submitted" value={records.length} />
                <StatBox label="Need Essential Gear" value={studentsNeedingGear.length} />
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
                    records.filter((r) => r.weight_lbs).length > 0
                      ? Math.round(
                          records.filter((r) => r.weight_lbs).reduce((sum, r) => sum + (r.weight_lbs || 0), 0) /
                            records.filter((r) => r.weight_lbs).length
                        ) + " lbs"
                      : "—"
                  }
                  small
                />
              </div>

              {records.length === 0 ? (
                <div className="text-white/40 text-center py-20">No onboarding data yet.</div>
              ) : (
                <div className="grid md:grid-cols-[1fr_1.2fr] gap-4">
                  {/* Student list */}
                  <div className="bg-white/5 rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Students</div>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto">
                      {records.map((r) => {
                        const name = [r.first_name, r.last_name].filter(Boolean).join(" ") || r.email;
                        const gear = allStudentGear.filter((g) => g.student_id === r.student_id);
                        const missingEssential = essentialIds.filter((eid) => {
                          const entry = gear.find((g) => g.gear_id === eid);
                          return !entry || entry.status === "need";
                        });
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
                                {missingEssential.length > 0 ? (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-coral/20 text-coral">
                                    {missingEssential.length} needed
                                  </span>
                                ) : gear.length > 0 ? (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-seafoam/20 text-seafoam">
                                    Gear set ✓
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/10 text-white/30">
                                    No gear info
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

                        {/* Gear from student_gear table */}
                        <div>
                          <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-2">Gear</div>
                          {selectedGear.length === 0 ? (
                            <div className="text-white/20 text-sm">No gear entries yet</div>
                          ) : (
                            <div className="space-y-1.5">
                              {activeCatalog.map((g) => {
                                const entry = selectedGear.find((sg) => sg.gear_id === g.id);
                                if (!entry) return (
                                  <div key={g.id} className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-white/[0.03] text-white/20">
                                    ? {g.name}
                                  </div>
                                );
                                return (
                                  <div key={g.id} className={`px-2.5 py-2 rounded-lg ${STATUS_COLORS[entry.status] || "bg-white/5 text-white/40"}`}>
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-medium">
                                        {entry.status === "own" ? "✓" : entry.status === "need" ? "✗" : "◎"} {g.name}
                                      </span>
                                      <span className="text-[9px] uppercase font-bold opacity-60">{entry.status}</span>
                                    </div>
                                    {entry.status === "own" && (entry.brand || entry.size || entry.condition) && (
                                      <div className="text-[10px] opacity-60 mt-0.5">
                                        {[entry.brand, entry.size, entry.condition].filter(Boolean).join(" · ")}
                                      </div>
                                    )}
                                    {entry.notes && (
                                      <div className="text-[10px] opacity-50 mt-0.5 italic">{entry.notes}</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-1">Theory Preference</div>
                          <div className="text-sm text-white">
                            {selectedRecord.theory_preference
                              ? THEORY_LABELS[selectedRecord.theory_preference] || selectedRecord.theory_preference
                              : "Not selected"}
                          </div>
                        </div>

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
              )}
            </>
          ) : (
            /* Gear Catalog Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-white/40 text-sm">{activeCatalog.length} active items. Add, edit, or archive gear that students see.</p>
                <button
                  onClick={() => setShowAddGear(!showAddGear)}
                  className="px-4 py-2 rounded-full bg-seafoam text-deep text-sm font-semibold"
                >
                  {showAddGear ? "Cancel" : "+ Add Item"}
                </button>
              </div>

              {/* Add gear form */}
              {showAddGear && (
                <div className="bg-white/5 rounded-2xl p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] text-white/30 mb-1">Name</div>
                      <input
                        type="text"
                        value={newGear.name}
                        onChange={(e) => setNewGear({ ...newGear, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") })}
                        placeholder="e.g. Dive Torch"
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 mb-1">Category</div>
                      <select
                        value={newGear.category}
                        onChange={(e) => setNewGear({ ...newGear, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm"
                      >
                        <option value="essential">Essential</option>
                        <option value="recommended">Recommended</option>
                        <option value="optional">Optional</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/30 mb-1">Description</div>
                    <input
                      type="text"
                      value={newGear.description}
                      onChange={(e) => setNewGear({ ...newGear, description: e.target.value })}
                      placeholder="What students need to know about this item"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-white/60">
                      <input
                        type="checkbox"
                        checked={newGear.rental_available}
                        onChange={(e) => setNewGear({ ...newGear, rental_available: e.target.checked })}
                        className="rounded"
                      />
                      Rental available
                    </label>
                    {newGear.rental_available && (
                      <input
                        type="text"
                        value={newGear.rental_note}
                        onChange={(e) => setNewGear({ ...newGear, rental_note: e.target.value })}
                        placeholder="Rental details..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-xs"
                      />
                    )}
                  </div>
                  <button
                    onClick={handleAddGear}
                    disabled={addingGear || !newGear.name}
                    className="px-5 py-2 rounded-full bg-seafoam text-deep text-sm font-semibold disabled:opacity-50"
                  >
                    {addingGear ? "Adding..." : "Add to Catalog"}
                  </button>
                </div>
              )}

              {/* Catalog list */}
              {(["essential", "recommended", "optional"] as const).map((cat) => {
                const items = activeCatalog.filter((g) => g.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${
                      cat === "essential" ? "text-coral" :
                      cat === "recommended" ? "text-sun" : "text-white/30"
                    }`}>
                      {cat} ({items.length})
                    </div>
                    <div className="space-y-1.5">
                      {items.map((g) => {
                        const gearEntries = allStudentGear.filter((sg) => sg.gear_id === g.id);
                        const ownCount = gearEntries.filter((e) => e.status === "own").length;
                        const needCount = gearEntries.filter((e) => e.status === "need").length;
                        const rentCount = gearEntries.filter((e) => e.status === "renting").length;
                        return (
                          <div key={g.id} className="bg-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
                            <div>
                              <div className="text-sm text-white font-medium">{g.name}</div>
                              {g.description && <div className="text-[10px] text-white/30 mt-0.5 max-w-md">{g.description}</div>}
                              {g.rental_available && <div className="text-[9px] text-teal/50 mt-0.5">Rental available</div>}
                            </div>
                            <div className="flex items-center gap-3">
                              {gearEntries.length > 0 && (
                                <div className="flex gap-1.5 text-[9px] font-semibold">
                                  {ownCount > 0 && <span className="text-seafoam">{ownCount} own</span>}
                                  {needCount > 0 && <span className="text-coral">{needCount} need</span>}
                                  {rentCount > 0 && <span className="text-sun">{rentCount} rent</span>}
                                </div>
                              )}
                              <button
                                onClick={() => handleArchiveGear(g.id)}
                                className="text-[10px] text-white/20 hover:text-coral transition-colors"
                                title="Archive this item"
                              >
                                ✗
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Archived items */}
              {catalog.some((g) => g.archived) && (
                <div>
                  <div className="text-[10px] text-white/15 font-bold uppercase tracking-wider mb-2">
                    Archived ({catalog.filter((g) => g.archived).length})
                  </div>
                  <div className="space-y-1">
                    {catalog.filter((g) => g.archived).map((g) => (
                      <div key={g.id} className="bg-white/[0.02] rounded-lg px-4 py-2 flex items-center justify-between">
                        <span className="text-xs text-white/20 line-through">{g.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
