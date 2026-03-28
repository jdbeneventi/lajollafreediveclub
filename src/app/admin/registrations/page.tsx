"use client";

import { useState, useEffect, useMemo } from "react";

const SECRET = "ljfc";

interface Registration {
  id: string;
  studentName: string;
  studentAge: number;
  session: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  charter: boolean;
  charterDetails: string;
  paymentStatus: "unpaid" | "paid" | "partial";
  waiverStatus: "unsigned" | "signed";
  medicalFlag: boolean;
  medicalNotes: string;
  swimLevel: string;
  notes: string;
  createdAt: string;
}

const STORAGE_KEY = "ljfc-camp-registrations";

function loadRegistrations(): Registration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegistrations(regs: Registration[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(regs));
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: color + "22", color }}
    >
      {label}
    </span>
  );
}

function RegistrationCard({
  reg,
  onUpdate,
}: {
  reg: Registration;
  onUpdate: (updated: Registration) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
      <div
        className="flex items-start justify-between gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="font-serif text-lg text-white leading-snug">
            {reg.studentName}
            <span className="text-white/40 text-sm ml-2">age {reg.studentAge}</span>
          </h3>
          <p className="text-white/40 text-xs mt-1">
            {reg.parentName} · {reg.parentEmail}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <Badge label={reg.session || "No session"} color="#3db8a4" />
          <Badge
            label={reg.paymentStatus}
            color={reg.paymentStatus === "paid" ? "#22c55e" : reg.paymentStatus === "partial" ? "#f0b429" : "#C75B3A"}
          />
          <Badge
            label={reg.waiverStatus === "signed" ? "waiver signed" : "waiver pending"}
            color={reg.waiverStatus === "signed" ? "#22c55e" : "#f0b429"}
          />
          {reg.medicalFlag && <Badge label="medical flag" color="#C75B3A" />}
          {reg.charter && <Badge label="charter" color="#D4A574" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-white/40">Phone</span>
              <p className="text-white/80 mt-0.5">{reg.parentPhone || "N/A"}</p>
            </div>
            <div>
              <span className="text-white/40">Swim Level</span>
              <p className="text-white/80 mt-0.5">{reg.swimLevel || "N/A"}</p>
            </div>
            <div>
              <span className="text-white/40">Registered</span>
              <p className="text-white/80 mt-0.5">{reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "N/A"}</p>
            </div>
            {reg.charter && (
              <div className="col-span-2">
                <span className="text-white/40">Charter Details</span>
                <p className="text-white/80 mt-0.5">{reg.charterDetails || "Requested — no details"}</p>
              </div>
            )}
            {reg.medicalFlag && (
              <div className="col-span-2 md:col-span-3">
                <span className="text-coral">Medical Notes</span>
                <p className="text-white/80 mt-0.5">{reg.medicalNotes || "Flagged — no details provided"}</p>
              </div>
            )}
            {reg.notes && (
              <div className="col-span-2 md:col-span-3">
                <span className="text-white/40">Notes</span>
                <p className="text-white/80 mt-0.5">{reg.notes}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {reg.paymentStatus !== "paid" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate({ ...reg, paymentStatus: "paid" });
                }}
                className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full cursor-pointer border border-green-500/30 hover:bg-green-500/30 transition-colors"
              >
                Mark Paid
              </button>
            )}
            {reg.waiverStatus !== "signed" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate({ ...reg, waiverStatus: "signed" });
                }}
                className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full cursor-pointer border border-green-500/30 hover:bg-green-500/30 transition-colors"
              >
                Mark Waiver Signed
              </button>
            )}
            {reg.charter && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const detail = prompt("Charter status update:", reg.charterDetails);
                  if (detail !== null) onUpdate({ ...reg, charterDetails: detail });
                }}
                className="px-3 py-1.5 bg-sand/20 text-sand text-xs font-semibold rounded-full cursor-pointer border border-sand/30 hover:bg-sand/30 transition-colors"
              >
                Update Charter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminRegistrationsPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [filterSession, setFilterSession] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterWaiver, setFilterWaiver] = useState("all");
  const [search, setSearch] = useState("");

  // Add form state
  const [addForm, setAddForm] = useState({
    studentName: "",
    studentAge: "",
    session: "",
    parentName: "",
    parentEmail: "",
    charter: false,
    paymentStatus: "unpaid" as "unpaid" | "paid" | "partial",
    waiverStatus: "unsigned" as "unsigned" | "signed",
    medicalFlag: false,
    medicalNotes: "",
    swimLevel: "",
    parentPhone: "",
    notes: "",
  });

  useEffect(() => {
    setRegistrations(loadRegistrations());
  }, []);

  const updateRegistration = (updated: Registration) => {
    const newRegs = registrations.map((r) => (r.id === updated.id ? updated : r));
    setRegistrations(newRegs);
    saveRegistrations(newRegs);
  };

  const addRegistration = () => {
    if (!addForm.studentName.trim() || !addForm.parentName.trim()) return;
    const newReg: Registration = {
      id: `camp-${Date.now().toString(36)}`,
      studentName: addForm.studentName,
      studentAge: parseInt(addForm.studentAge) || 0,
      session: addForm.session,
      parentName: addForm.parentName,
      parentEmail: addForm.parentEmail,
      parentPhone: addForm.parentPhone,
      charter: addForm.charter,
      charterDetails: "",
      paymentStatus: addForm.paymentStatus,
      waiverStatus: addForm.waiverStatus,
      medicalFlag: addForm.medicalFlag,
      medicalNotes: addForm.medicalNotes,
      swimLevel: addForm.swimLevel,
      notes: addForm.notes,
      createdAt: new Date().toISOString(),
    };
    const newRegs = [newReg, ...registrations];
    setRegistrations(newRegs);
    saveRegistrations(newRegs);
    setAddForm({
      studentName: "",
      studentAge: "",
      session: "",
      parentName: "",
      parentEmail: "",
      charter: false,
      paymentStatus: "unpaid",
      waiverStatus: "unsigned",
      medicalFlag: false,
      medicalNotes: "",
      swimLevel: "",
      parentPhone: "",
      notes: "",
    });
    setShowAddForm(false);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const newRegs = [...arr, ...registrations];
      setRegistrations(newRegs);
      saveRegistrations(newRegs);
      setImportJson("");
      setShowImport(false);
    } catch {
      alert("Invalid JSON. Please check your input.");
    }
  };

  const exportCSV = () => {
    const headers = [
      "ID", "Student", "Age", "Session", "Parent", "Email", "Phone",
      "Payment", "Waiver", "Medical Flag", "Medical Notes", "Charter",
      "Charter Details", "Swim Level", "Notes", "Date",
    ];
    const rows = registrations.map((r) => [
      r.id, r.studentName, r.studentAge, r.session, r.parentName,
      r.parentEmail, r.parentPhone, r.paymentStatus, r.waiverStatus,
      r.medicalFlag ? "Yes" : "No", r.medicalNotes, r.charter ? "Yes" : "No",
      r.charterDetails, r.swimLevel, r.notes, r.createdAt,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `camp-garibaldi-registrations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sessions = useMemo(() => {
    const s = new Set(registrations.map((r) => r.session).filter(Boolean));
    return Array.from(s).sort();
  }, [registrations]);

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      if (filterSession !== "all" && r.session !== filterSession) return false;
      if (filterPayment !== "all" && r.paymentStatus !== filterPayment) return false;
      if (filterWaiver !== "all" && r.waiverStatus !== filterWaiver) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.studentName.toLowerCase().includes(q) &&
          !r.parentName.toLowerCase().includes(q) &&
          !r.parentEmail.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [registrations, filterSession, filterPayment, filterWaiver, search]);

  // Stats
  const stats = useMemo(() => {
    const total = registrations.length;
    const bySession: Record<string, number> = {};
    registrations.forEach((r) => {
      const s = r.session || "Unassigned";
      bySession[s] = (bySession[s] || 0) + 1;
    });
    const waiversSigned = registrations.filter((r) => r.waiverStatus === "signed").length;
    const paid = registrations.filter((r) => r.paymentStatus === "paid").length;
    return { total, bySession, waiversSigned, paid };
  }, [registrations]);

  // Password gate
  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <div className="max-w-[360px] w-full">
          <h1 className="font-serif text-2xl text-white text-center mb-6">Camp Registrations</h1>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6">
            <label className="block text-sm text-white/60 mb-2">Password</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && pw === SECRET) setAuthed(true);
              }}
              className="w-full px-4 py-3 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors"
              placeholder="Enter password"
              autoFocus
            />
            <button
              onClick={() => {
                if (pw === SECRET) setAuthed(true);
              }}
              className="w-full mt-4 py-3 bg-seafoam text-deep rounded-full font-semibold text-sm cursor-pointer border-none hover:shadow-lg transition-all"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClasses = "w-full px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors";
  const labelClasses = "block text-xs text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-deep">
      {/* Header */}
      <div className="border-b border-white/10 px-6 pt-28 pb-6">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-white">Camp Garibaldi — Registrations</h1>
            <p className="text-white/40 text-sm mt-1">Manage camp enrollments, waivers, and payments</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowImport(!showImport)}
              className="px-4 py-2 bg-white/[0.06] text-white/60 text-xs font-semibold rounded-full cursor-pointer border border-white/10 hover:border-white/20 transition-colors"
            >
              Import JSON
            </button>
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-white/[0.06] text-white/60 text-xs font-semibold rounded-full cursor-pointer border border-white/10 hover:border-white/20 transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs">Total Registrations</p>
            <p className="text-white font-serif text-2xl mt-1">{stats.total}</p>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs">By Session</p>
            <div className="mt-1 space-y-0.5">
              {Object.entries(stats.bySession).length > 0 ? (
                Object.entries(stats.bySession).map(([session, count]) => (
                  <p key={session} className="text-white/80 text-xs">
                    {session}: <span className="font-semibold text-white">{count}</span>
                  </p>
                ))
              ) : (
                <p className="text-white/30 text-xs">No registrations yet</p>
              )}
            </div>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs">Waivers Signed</p>
            <p className="text-white font-serif text-2xl mt-1">
              {stats.waiversSigned}
              <span className="text-white/30 text-sm">/{stats.total}</span>
            </p>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs">Payments Confirmed</p>
            <p className="text-white font-serif text-2xl mt-1">
              {stats.paid}
              <span className="text-white/30 text-sm">/{stats.total}</span>
            </p>
          </div>
        </div>

        {/* Import JSON */}
        {showImport && (
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Import from JSON</h3>
            <p className="text-xs text-white/40 mb-3">Paste registration data as a JSON array. Each object should match the registration schema.</p>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-white/[0.06] border border-white/10 text-white text-xs font-mono outline-none focus:border-seafoam transition-colors resize-none"
              placeholder='[{"id":"camp-abc","studentName":"Jane Doe","studentAge":12,"session":"June 16-20",...}]'
            />
            <div className="flex gap-2 mt-3">
              <button onClick={handleImport} className="px-4 py-2 bg-seafoam text-deep text-xs font-semibold rounded-full cursor-pointer border-none hover:shadow-lg transition-all">
                Import
              </button>
              <button onClick={() => setShowImport(false)} className="px-4 py-2 bg-white/[0.06] text-white/60 text-xs font-semibold rounded-full cursor-pointer border border-white/10 hover:border-white/20 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Registration Form */}
        <div className="bg-white/[0.04] border border-white/10 rounded-xl">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full px-6 py-4 flex items-center justify-between cursor-pointer bg-transparent border-none text-left"
          >
            <span className="text-sm font-semibold text-white">+ Add Registration Manually</span>
            <span className="text-white/40 text-xs">{showAddForm ? "collapse" : "expand"}</span>
          </button>

          {showAddForm && (
            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Student Name *</label>
                  <input
                    type="text"
                    value={addForm.studentName}
                    onChange={(e) => setAddForm((p) => ({ ...p, studentName: e.target.value }))}
                    className={inputClasses}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Age</label>
                  <input
                    type="number"
                    value={addForm.studentAge}
                    onChange={(e) => setAddForm((p) => ({ ...p, studentAge: e.target.value }))}
                    className={inputClasses}
                    placeholder="e.g. 12"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Session</label>
                  <input
                    type="text"
                    value={addForm.session}
                    onChange={(e) => setAddForm((p) => ({ ...p, session: e.target.value }))}
                    className={inputClasses}
                    placeholder="e.g. June 16-20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Parent Name *</label>
                  <input
                    type="text"
                    value={addForm.parentName}
                    onChange={(e) => setAddForm((p) => ({ ...p, parentName: e.target.value }))}
                    className={inputClasses}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Parent Email</label>
                  <input
                    type="email"
                    value={addForm.parentEmail}
                    onChange={(e) => setAddForm((p) => ({ ...p, parentEmail: e.target.value }))}
                    className={inputClasses}
                    placeholder="parent@email.com"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Parent Phone</label>
                  <input
                    type="tel"
                    value={addForm.parentPhone}
                    onChange={(e) => setAddForm((p) => ({ ...p, parentPhone: e.target.value }))}
                    className={inputClasses}
                    placeholder="(858) 555-1234"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Swim Level</label>
                  <input
                    type="text"
                    value={addForm.swimLevel}
                    onChange={(e) => setAddForm((p) => ({ ...p, swimLevel: e.target.value }))}
                    className={inputClasses}
                    placeholder="e.g. Intermediate"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Payment Status</label>
                  <select
                    value={addForm.paymentStatus}
                    onChange={(e) => setAddForm((p) => ({ ...p, paymentStatus: e.target.value as "unpaid" | "paid" | "partial" }))}
                    className={inputClasses}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Waiver Status</label>
                  <select
                    value={addForm.waiverStatus}
                    onChange={(e) => setAddForm((p) => ({ ...p, waiverStatus: e.target.value as "unsigned" | "signed" }))}
                    className={inputClasses}
                  >
                    <option value="unsigned">Unsigned</option>
                    <option value="signed">Signed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addForm.charter}
                    onChange={(e) => setAddForm((p) => ({ ...p, charter: e.target.checked }))}
                    className="w-4 h-4 accent-seafoam"
                  />
                  <span className="text-sm text-white/60">Charter requested</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addForm.medicalFlag}
                    onChange={(e) => setAddForm((p) => ({ ...p, medicalFlag: e.target.checked }))}
                    className="w-4 h-4 accent-coral"
                  />
                  <span className="text-sm text-white/60">Medical flag</span>
                </label>
              </div>

              {addForm.medicalFlag && (
                <div>
                  <label className={labelClasses}>Medical Notes</label>
                  <textarea
                    value={addForm.medicalNotes}
                    onChange={(e) => setAddForm((p) => ({ ...p, medicalNotes: e.target.value }))}
                    rows={2}
                    className={inputClasses + " resize-none"}
                    placeholder="Describe medical conditions..."
                  />
                </div>
              )}

              <div>
                <label className={labelClasses}>Notes</label>
                <textarea
                  value={addForm.notes}
                  onChange={(e) => setAddForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  className={inputClasses + " resize-none"}
                  placeholder="Any additional notes..."
                />
              </div>

              <button
                onClick={addRegistration}
                className="px-6 py-2.5 bg-seafoam text-deep text-sm font-semibold rounded-full cursor-pointer border-none hover:shadow-lg transition-all"
              >
                Add Registration
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors"
            placeholder="Search by name or email..."
          />
          <select
            value={filterSession}
            onChange={(e) => setFilterSession(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors"
          >
            <option value="all">All Sessions</option>
            {sessions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors"
          >
            <option value="all">All Payments</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
          <select
            value={filterWaiver}
            onChange={(e) => setFilterWaiver(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors"
          >
            <option value="all">All Waivers</option>
            <option value="unsigned">Unsigned</option>
            <option value="signed">Signed</option>
          </select>
        </div>

        {/* Registration List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-12 text-center">
              <p className="text-white/30 text-sm">
                {registrations.length === 0
                  ? "No registrations yet. Add one manually or import from JSON."
                  : "No registrations match your filters."}
              </p>
            </div>
          ) : (
            filtered.map((reg) => (
              <RegistrationCard key={reg.id} reg={reg} onUpdate={updateRegistration} />
            ))
          )}
        </div>

        {/* Footer note */}
        <p className="text-white/20 text-xs text-center pt-4">
          Data stored in browser localStorage. Export CSV regularly for backup. Google Sheet integration coming soon.
        </p>
      </div>
    </div>
  );
}
