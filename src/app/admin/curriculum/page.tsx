"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

// ─── CONSTANTS ─────────────────────────────────────────────────────

const SECRET = "ljfc-curriculum";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHLY_THEMES: Record<string, string> = {
  January: "Squid Run",
  February: "Gray Whale Migration",
  March: "Upwelling Season",
  April: "Kelp Forest Recovery",
  May: "Citizen Science Day",
  June: "Summer Kickoff",
  July: "Leopard Shark Season",
  August: "The Canyon",
  September: "Fall Blue Water",
  October: "Sea Lion Pup Season",
  November: "Lobster Season / Night Ocean",
  December: "Winter Bioluminescence",
};

const SESSION_TYPES = [
  "Camp Garibaldi 5-day",
  "Camp Garibaldi 3-day",
  "Ocean Explorers (8-11)",
  "Canyon Crew (11-14)",
  "Field Trip",
  "Community Ocean Day",
];

const GRADE_BANDS = ["Grades 3-5", "Grades 6-8", "High School"];

const GRADE_COLORS: Record<string, string> = {
  "Grades 3-5": "#f0b429",
  "Grades 6-8": "#3db8a4",
  "High School": "#C75B3A",
};

const SESSION_TYPE_COLORS: Record<string, string> = {
  "Camp Garibaldi 5-day": "#3db8a4",
  "Camp Garibaldi 3-day": "#1B6B6B",
  "Ocean Explorers (8-11)": "#f0b429",
  "Canyon Crew (11-14)": "#D4A574",
  "Field Trip": "#163B4E",
  "Community Ocean Day": "#C75B3A",
};

// ─── NGSS STANDARDS ────────────────────────────────────────────────

interface NGSSStandard {
  code: string;
  label: string;
}

const NGSS_DOMAINS: { domain: string; standards: NGSSStandard[] }[] = [
  {
    domain: "Life Sciences",
    standards: [
      { code: "3-LS2-1", label: "Animal groups for survival" },
      { code: "3-LS4-3", label: "Habitat and organism survival" },
      { code: "4-LS1-1", label: "Internal/external structures for survival" },
      { code: "5-LS2-1", label: "Matter movement in ecosystems" },
      { code: "MS-LS2-1", label: "Resource effects on populations" },
      { code: "MS-LS2-2", label: "Predator-prey patterns" },
      { code: "MS-LS2-3", label: "Matter/energy cycling" },
      { code: "MS-LS2-4", label: "Ecosystem changes" },
      { code: "MS-LS2-5", label: "Biodiversity solutions" },
      { code: "HS-LS1-3", label: "Homeostasis feedback" },
      { code: "HS-LS2-6", label: "Complex ecosystem interactions" },
      { code: "HS-LS2-7", label: "Human impact solutions" },
    ],
  },
  {
    domain: "Earth & Space Sciences",
    standards: [
      { code: "4-ESS2-1", label: "Weathering/erosion" },
      { code: "4-ESS2-2", label: "Map data patterns" },
      { code: "5-ESS2-1", label: "Earth system interactions" },
      { code: "5-ESS3-1", label: "Protecting resources" },
      { code: "MS-ESS2-1", label: "Earth material cycling" },
      { code: "MS-ESS2-4", label: "Water cycling" },
      { code: "MS-ESS2-6", label: "Oceanic circulation" },
      { code: "MS-ESS3-3", label: "Human impact monitoring" },
      { code: "HS-ESS2-2", label: "Geoscience feedback" },
      { code: "HS-ESS2-5", label: "Water properties" },
      { code: "HS-ESS3-4", label: "Impact reduction tech" },
    ],
  },
  {
    domain: "Physical Sciences",
    standards: [{ code: "MS-PS4-1", label: "Wave models" }],
  },
];

const SEP_PRACTICES = [
  "Asking questions",
  "Developing models",
  "Planning investigations",
  "Analyzing data",
  "Constructing explanations",
  "Engaging in argument from evidence",
  "Obtaining/evaluating information",
];

// ─── TYPES ─────────────────────────────────────────────────────────

interface SessionPlan {
  id: string;
  sessionType: string;
  month: string;
  theme: string;
  gradeBand: string;
  scientificFocus: string;
  inWaterActivities: string;
  shoreLandActivities: string;
  speciesTargets: string;
  ngssStandards: string[];
  sepPractices: string[];
  journalPrompt: string;
  guestEducator: string;
  materialsNeeded: string;
  safetyNotes: string;
  createdAt: string;
}

const EMPTY_SESSION: Omit<SessionPlan, "id" | "createdAt"> = {
  sessionType: "",
  month: "",
  theme: "",
  gradeBand: "",
  scientificFocus: "",
  inWaterActivities: "",
  shoreLandActivities: "",
  speciesTargets: "",
  ngssStandards: [],
  sepPractices: [],
  journalPrompt: "",
  guestEducator: "",
  materialsNeeded: "",
  safetyNotes: "",
};

// ─── STORAGE ───────────────────────────────────────────────────────

const STORAGE_KEY = "ljfc-curriculum-sessions";

function loadSessions(): SessionPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: SessionPlan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// ─── COMPONENTS ────────────────────────────────────────────────────

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

function Pill({ label }: { label: string }) {
  return (
    <span className="text-[9px] font-mono bg-white/[0.08] text-white/60 px-1.5 py-0.5 rounded">
      {label}
    </span>
  );
}

function SessionCard({
  session,
  onEdit,
  onDelete,
}: {
  session: SessionPlan;
  onEdit: (s: SessionPlan) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors print:bg-white print:border-gray-200 print:text-black">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg text-white leading-snug print:text-black">
            {session.theme || session.month}
          </h3>
          <p className="text-white/40 text-xs mt-1 print:text-gray-500">
            {session.month} &middot; {session.scientificFocus}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          <Badge label={session.gradeBand} color={GRADE_COLORS[session.gradeBand] || "#3db8a4"} />
          <Badge label={session.sessionType} color={SESSION_TYPE_COLORS[session.sessionType] || "#3A4A56"} />
        </div>
      </div>

      {/* NGSS pills */}
      {session.ngssStandards.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {session.ngssStandards.map((code) => (
            <Pill key={code} label={code} />
          ))}
        </div>
      )}

      {/* Species */}
      {session.speciesTargets && (
        <p className="text-white/50 text-xs mb-3 print:text-gray-500">
          <span className="text-white/30 print:text-gray-400">Species:</span>{" "}
          {session.speciesTargets}
        </p>
      )}

      {/* Toggle expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-seafoam text-xs hover:text-seafoam/80 transition-colors bg-transparent border-none cursor-pointer print:hidden"
      >
        {expanded ? "Collapse" : "View details"}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-white/10 pt-4 print:border-gray-200">
          {session.inWaterActivities && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                In-Water Activities
              </div>
              <p className="text-white/70 text-sm whitespace-pre-wrap print:text-gray-700">
                {session.inWaterActivities}
              </p>
            </div>
          )}
          {session.shoreLandActivities && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Shore/Land Activities
              </div>
              <p className="text-white/70 text-sm whitespace-pre-wrap print:text-gray-700">
                {session.shoreLandActivities}
              </p>
            </div>
          )}
          {session.sepPractices.length > 0 && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Science & Engineering Practices
              </div>
              <div className="flex flex-wrap gap-1">
                {session.sepPractices.map((p) => (
                  <Pill key={p} label={p} />
                ))}
              </div>
            </div>
          )}
          {session.journalPrompt && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Journal Prompt
              </div>
              <p className="text-white/70 text-sm italic print:text-gray-700">
                &ldquo;{session.journalPrompt}&rdquo;
              </p>
            </div>
          )}
          {session.guestEducator && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Guest Educator
              </div>
              <p className="text-white/70 text-sm print:text-gray-700">{session.guestEducator}</p>
            </div>
          )}
          {session.materialsNeeded && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Materials Needed
              </div>
              <p className="text-white/70 text-sm whitespace-pre-wrap print:text-gray-700">
                {session.materialsNeeded}
              </p>
            </div>
          )}
          {session.safetyNotes && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Safety Notes
              </div>
              <p className="text-coral/80 text-sm whitespace-pre-wrap print:text-red-600">
                {session.safetyNotes}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2 print:hidden">
            <button
              onClick={() => onEdit(session)}
              className="text-xs text-seafoam bg-seafoam/10 px-3 py-1.5 rounded-lg border border-seafoam/20 hover:bg-seafoam/20 transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this session?")) onDelete(session.id);
              }}
              className="text-xs text-coral bg-coral/10 px-3 py-1.5 rounded-lg border border-coral/20 hover:bg-coral/20 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────

export default function CurriculumPlannerPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [sessions, setSessions] = useState<SessionPlan[]>([]);
  const [form, setForm] = useState(EMPTY_SESSION);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  // Filters
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load sessions from localStorage
  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  // Auth via URL param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("key") === SECRET) setAuthed(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET) setAuthed(true);
  };

  // Auto-fill theme when month changes
  const updateForm = useCallback(
    (patch: Partial<typeof form>) => {
      setForm((prev) => {
        const next = { ...prev, ...patch };
        if (patch.month && !prev.theme && MONTHLY_THEMES[patch.month]) {
          next.theme = MONTHLY_THEMES[patch.month];
        }
        return next;
      });
    },
    []
  );

  const handleSave = () => {
    if (!form.sessionType || !form.month || !form.gradeBand) {
      alert("Session type, month, and grade band are required.");
      return;
    }

    let updated: SessionPlan[];
    if (editingId) {
      updated = sessions.map((s) =>
        s.id === editingId ? { ...form, id: editingId, createdAt: s.createdAt } : s
      );
    } else {
      const newSession: SessionPlan = {
        ...form,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      updated = [...sessions, newSession];
    }

    setSessions(updated);
    saveSessions(updated);
    setForm(EMPTY_SESSION);
    setEditingId(null);
    setShowBuilder(false);
  };

  const handleEdit = (session: SessionPlan) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, ...rest } = session;
    setForm(rest);
    setEditingId(session.id);
    setShowBuilder(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    saveSessions(updated);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ljfc-curriculum-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string) as SessionPlan[];
        const merged = [...sessions, ...imported.filter((i) => !sessions.some((s) => s.id === i.id))];
        setSessions(merged);
        saveSessions(merged);
        alert(`Imported ${imported.length} sessions.`);
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Filtered sessions
  const filtered = useMemo(() => {
    let result = [...sessions];
    if (filterGrade !== "all") result = result.filter((s) => s.gradeBand === filterGrade);
    if (filterType !== "all") result = result.filter((s) => s.sessionType === filterType);
    if (filterMonth !== "all") result = result.filter((s) => s.month === filterMonth);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.theme.toLowerCase().includes(q) ||
          s.scientificFocus.toLowerCase().includes(q) ||
          s.inWaterActivities.toLowerCase().includes(q) ||
          s.shoreLandActivities.toLowerCase().includes(q) ||
          s.speciesTargets.toLowerCase().includes(q) ||
          s.journalPrompt.toLowerCase().includes(q) ||
          s.guestEducator.toLowerCase().includes(q) ||
          s.materialsNeeded.toLowerCase().includes(q) ||
          s.ngssStandards.some((c) => c.toLowerCase().includes(q))
      );
    }
    return result;
  }, [sessions, filterGrade, filterType, filterMonth, searchQuery]);

  // Group by month
  const grouped = useMemo(() => {
    const map: Record<string, SessionPlan[]> = {};
    for (const m of MONTHS) map[m] = [];
    for (const s of filtered) {
      if (!map[s.month]) map[s.month] = [];
      map[s.month].push(s);
    }
    return Object.entries(map).filter(([, arr]) => arr.length > 0);
  }, [filtered]);

  // NGSS coverage matrix
  const allStandardCodes = useMemo(
    () => NGSS_DOMAINS.flatMap((d) => d.standards.map((s) => s.code)),
    []
  );
  const coverageMatrix = useMemo(() => {
    const matrix: Record<string, Set<string>> = {};
    for (const code of allStandardCodes) matrix[code] = new Set();
    for (const s of sessions) {
      for (const code of s.ngssStandards) {
        if (matrix[code]) matrix[code].add(s.month);
      }
    }
    return matrix;
  }, [sessions, allStandardCodes]);

  const uncoveredStandards = useMemo(
    () => allStandardCodes.filter((code) => coverageMatrix[code].size === 0),
    [allStandardCodes, coverageMatrix]
  );

  // ─── PASSWORD GATE ─────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="max-w-sm w-full">
          <h1 className="font-serif text-2xl text-white mb-6 text-center">
            Curriculum Planner
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter access key"
            className="w-full px-5 py-3 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-seafoam mb-4"
          />
          <button
            type="submit"
            className="w-full px-5 py-3 rounded-lg bg-coral text-white font-medium border-none cursor-pointer hover:bg-coral/90 transition-colors"
          >
            Access Planner
          </button>
        </form>
      </div>
    );
  }

  // ─── MAIN LAYOUT ───────────────────────────────────────────────

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:border-gray-200 { border-color: #e5e7eb !important; }
          .print\\:text-black { color: black !important; }
          .print\\:text-gray-500 { color: #6b7280 !important; }
          .print\\:text-gray-400 { color: #9ca3af !important; }
          .print\\:text-gray-700 { color: #374151 !important; }
          .print\\:text-red-600 { color: #dc2626 !important; }
        }
      `}</style>

      <div className="min-h-screen bg-deep pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
            <div>
              <h1 className="font-serif text-3xl text-white mb-2">
                Curriculum Planner
              </h1>
              <p className="text-white/40 text-sm">
                LJFC session planning &middot; NGSS-aligned &middot;{" "}
                {sessions.length} session{sessions.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  setShowBuilder(!showBuilder);
                  if (showBuilder) {
                    setForm(EMPTY_SESSION);
                    setEditingId(null);
                  }
                }}
                className="bg-coral text-white px-5 py-2.5 rounded-full text-sm font-medium border-none cursor-pointer hover:-translate-y-0.5 transition-all"
              >
                {showBuilder ? "Cancel" : "+ New Session"}
              </button>
              <button
                onClick={() => window.print()}
                className="bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-full text-sm border border-white/10 cursor-pointer hover:bg-white/[0.12] transition-colors"
              >
                Export PDF
              </button>
              <button
                onClick={handleExportJSON}
                className="bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-full text-sm border border-white/10 cursor-pointer hover:bg-white/[0.12] transition-colors"
              >
                Export JSON
              </button>
              <label className="bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-full text-sm border border-white/10 cursor-pointer hover:bg-white/[0.12] transition-colors">
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* ─── SESSION BUILDER ─────────────────────────────── */}
          {showBuilder && (
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:p-8 mb-10 print:hidden">
              <h2 className="font-serif text-xl text-white mb-6">
                {editingId ? "Edit Session" : "New Session Plan"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Session type */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Session Type *
                  </label>
                  <select
                    value={form.sessionType}
                    onChange={(e) => updateForm({ sessionType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white outline-none focus:border-seafoam appearance-none"
                  >
                    <option value="" className="bg-deep">Select...</option>
                    {SESSION_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-deep">{t}</option>
                    ))}
                  </select>
                </div>

                {/* Month */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Month *
                  </label>
                  <select
                    value={form.month}
                    onChange={(e) => updateForm({ month: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white outline-none focus:border-seafoam appearance-none"
                  >
                    <option value="" className="bg-deep">Select...</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m} className="bg-deep">{m}</option>
                    ))}
                  </select>
                </div>

                {/* Theme */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Theme
                  </label>
                  <input
                    type="text"
                    value={form.theme}
                    onChange={(e) => updateForm({ theme: e.target.value })}
                    placeholder={form.month ? MONTHLY_THEMES[form.month] || "" : ""}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam"
                  />
                </div>

                {/* Grade band */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Grade Band *
                  </label>
                  <select
                    value={form.gradeBand}
                    onChange={(e) => updateForm({ gradeBand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white outline-none focus:border-seafoam appearance-none"
                  >
                    <option value="" className="bg-deep">Select...</option>
                    {GRADE_BANDS.map((g) => (
                      <option key={g} value={g} className="bg-deep">{g}</option>
                    ))}
                  </select>
                </div>

                {/* Scientific focus */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Scientific Focus
                  </label>
                  <input
                    type="text"
                    value={form.scientificFocus}
                    onChange={(e) => updateForm({ scientificFocus: e.target.value })}
                    placeholder="e.g. Shark biology & aggregation behavior"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam"
                  />
                </div>

                {/* Species targets */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Species Targets
                  </label>
                  <input
                    type="text"
                    value={form.speciesTargets}
                    onChange={(e) => updateForm({ speciesTargets: e.target.value })}
                    placeholder="leopard sharks, garibaldi, bat rays"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam"
                  />
                </div>

                {/* In-water activities */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    In-Water Activities
                  </label>
                  <textarea
                    value={form.inWaterActivities}
                    onChange={(e) => updateForm({ inWaterActivities: e.target.value })}
                    rows={3}
                    placeholder="Snorkel survey, freedive transects..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam resize-y"
                  />
                </div>

                {/* Shore/land activities */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Shore/Land Activities
                  </label>
                  <textarea
                    value={form.shoreLandActivities}
                    onChange={(e) => updateForm({ shoreLandActivities: e.target.value })}
                    rows={3}
                    placeholder="Tide pool exploration, journal writing..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam resize-y"
                  />
                </div>

                {/* Journal prompt */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Journal Prompt
                  </label>
                  <input
                    type="text"
                    value={form.journalPrompt}
                    onChange={(e) => updateForm({ journalPrompt: e.target.value })}
                    placeholder="What did you observe about..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam"
                  />
                </div>

                {/* Guest educator */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Guest Educator
                  </label>
                  <input
                    type="text"
                    value={form.guestEducator}
                    onChange={(e) => updateForm({ guestEducator: e.target.value })}
                    placeholder="Name / Organization"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam"
                  />
                </div>

                {/* Materials needed */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Materials Needed
                  </label>
                  <textarea
                    value={form.materialsNeeded}
                    onChange={(e) => updateForm({ materialsNeeded: e.target.value })}
                    rows={2}
                    placeholder="Field journals, species ID cards..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam resize-y"
                  />
                </div>

                {/* Safety notes */}
                <div className="lg:col-span-3">
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Safety Notes
                  </label>
                  <textarea
                    value={form.safetyNotes}
                    onChange={(e) => updateForm({ safetyNotes: e.target.value })}
                    rows={2}
                    placeholder="Surf conditions check, buddy system..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam resize-y"
                  />
                </div>
              </div>

              {/* NGSS Standards */}
              <div className="mt-6">
                <h3 className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">
                  NGSS Standards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {NGSS_DOMAINS.map((domain) => (
                    <div key={domain.domain}>
                      <div className="text-white/60 text-xs font-semibold mb-2">
                        {domain.domain}
                      </div>
                      <div className="space-y-1.5">
                        {domain.standards.map((std) => (
                          <label
                            key={std.code}
                            className="flex items-start gap-2 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={form.ngssStandards.includes(std.code)}
                              onChange={(e) => {
                                const codes = e.target.checked
                                  ? [...form.ngssStandards, std.code]
                                  : form.ngssStandards.filter((c) => c !== std.code);
                                updateForm({ ngssStandards: codes });
                              }}
                              className="mt-0.5 accent-seafoam"
                            />
                            <span className="text-white/50 text-xs group-hover:text-white/70 transition-colors">
                              <span className="font-mono text-white/40">{std.code}</span>{" "}
                              {std.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Science & Engineering Practices */}
              <div className="mt-6">
                <h3 className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-3">
                  Science & Engineering Practices
                </h3>
                <div className="flex flex-wrap gap-3">
                  {SEP_PRACTICES.map((p) => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.sepPractices.includes(p)}
                        onChange={(e) => {
                          const practices = e.target.checked
                            ? [...form.sepPractices, p]
                            : form.sepPractices.filter((x) => x !== p);
                          updateForm({ sepPractices: practices });
                        }}
                        className="accent-seafoam"
                      />
                      <span className="text-white/50 text-xs group-hover:text-white/70 transition-colors">
                        {p}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-seafoam text-deep px-6 py-3 rounded-lg font-medium border-none cursor-pointer hover:bg-seafoam/90 transition-colors"
                >
                  {editingId ? "Update Session" : "Save Session"}
                </button>
                <button
                  onClick={() => {
                    setForm(EMPTY_SESSION);
                    setEditingId(null);
                    setShowBuilder(false);
                  }}
                  className="bg-white/[0.08] text-white/60 px-6 py-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/[0.12] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ─── FILTERS ────────────────────────────────────── */}
          <div className="flex flex-wrap gap-3 mb-8 print:hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="px-4 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam text-sm flex-1 min-w-[200px]"
            />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm outline-none focus:border-seafoam appearance-none"
            >
              <option value="all" className="bg-deep">All Grades</option>
              {GRADE_BANDS.map((g) => (
                <option key={g} value={g} className="bg-deep">{g}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm outline-none focus:border-seafoam appearance-none"
            >
              <option value="all" className="bg-deep">All Types</option>
              {SESSION_TYPES.map((t) => (
                <option key={t} value={t} className="bg-deep">{t}</option>
              ))}
            </select>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm outline-none focus:border-seafoam appearance-none"
            >
              <option value="all" className="bg-deep">All Months</option>
              {MONTHS.map((m) => (
                <option key={m} value={m} className="bg-deep">{m}</option>
              ))}
            </select>
          </div>

          {/* ─── SESSION LIBRARY ─────────────────────────────── */}
          {grouped.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg font-serif mb-4">No sessions yet</p>
              <p className="text-white/20 text-sm">
                Click &ldquo;+ New Session&rdquo; to start building your curriculum.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {grouped.map(([month, monthSessions]) => (
                <div key={month}>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-serif text-xl text-white">{month}</h2>
                    <span className="text-white/30 text-xs">
                      {MONTHLY_THEMES[month]}
                    </span>
                    <span className="text-white/20 text-xs">
                      {monthSessions.length} session{monthSessions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {monthSessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── NGSS COVERAGE MATRIX ────────────────────────── */}
          {sessions.length > 0 && (
            <div className="mt-16 print:mt-8">
              <h2 className="font-serif text-xl text-white mb-2">NGSS Coverage Matrix</h2>
              <p className="text-white/40 text-sm mb-6">
                Standards coverage across all saved sessions by month
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-white/40 font-medium p-2 sticky left-0 bg-deep min-w-[140px]">
                        Standard
                      </th>
                      {MONTHS.map((m) => (
                        <th
                          key={m}
                          className="text-center text-white/40 font-medium p-2 min-w-[40px]"
                        >
                          {m.slice(0, 3)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {NGSS_DOMAINS.map((domain) => (
                      <>
                        <tr key={`header-${domain.domain}`}>
                          <td
                            colSpan={13}
                            className="text-[10px] text-teal/60 font-semibold tracking-[0.15em] uppercase pt-4 pb-1 px-2"
                          >
                            {domain.domain}
                          </td>
                        </tr>
                        {domain.standards.map((std) => {
                          const covered = coverageMatrix[std.code];
                          const isCovered = covered.size > 0;
                          return (
                            <tr
                              key={std.code}
                              className={
                                isCovered ? "" : "bg-coral/[0.05]"
                              }
                            >
                              <td
                                className={`p-2 font-mono sticky left-0 bg-deep ${
                                  isCovered ? "text-white/50" : "text-coral/70"
                                }`}
                              >
                                {std.code}
                              </td>
                              {MONTHS.map((m) => (
                                <td key={m} className="p-2 text-center">
                                  {covered.has(m) ? (
                                    <span className="inline-block w-4 h-4 rounded bg-seafoam/30 border border-seafoam/50" />
                                  ) : (
                                    <span className="inline-block w-4 h-4 rounded bg-white/[0.03]" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Gaps summary */}
              {uncoveredStandards.length > 0 && (
                <div className="mt-6 bg-coral/10 border border-coral/20 rounded-xl p-5">
                  <div className="text-[10px] text-coral font-semibold uppercase tracking-wider mb-2">
                    Coverage Gaps — {uncoveredStandards.length} standard{uncoveredStandards.length !== 1 ? "s" : ""} with no sessions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {uncoveredStandards.map((code) => (
                      <span
                        key={code}
                        className="text-[10px] font-mono bg-coral/20 text-coral px-2 py-0.5 rounded"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
