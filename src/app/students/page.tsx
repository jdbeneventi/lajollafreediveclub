"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface LogEntry {
  student: string;
  date: string;
  author: string;
  type: string;
  note: string;
  depth: string;
  time: string;
  bolt: string;
}

interface ParsedFields {
  [key: string]: string;
}

const COACH_CODE = "ljfc-coach";
const STUDENT_CODE = "ljfc";

const LOCATIONS = ["La Jolla Shores", "La Jolla Cove", "Canyon", "Pool", "Other"];
const DISCIPLINES = ["CWT", "FIM", "CNF", "STA", "DYN", "No-fins"];
const PB_DISCIPLINES = ["CWT", "FIM", "CNF", "STA", "DYN", "CWTB"];
const SKILLS = ["Duck dive", "Frenzel", "Mouthfill", "Free-fall", "Rescue", "Buddy protocol", "Recovery breathing", "Exhale diving", "Line pulls"];
const BOLT_CONTEXTS = ["Morning", "Pre-session", "Post-session", "Standalone"];
const AGENCIES = ["AIDA", "SSI", "Molchanovs", "PADI", "None"];

// ─── Parse structured fields from note ───
function parseStructuredNote(note: string): { fields: ParsedFields; freeText: string } {
  const fields: ParsedFields = {};
  let remaining = note || "";
  const regex = /\[([A-Z_]+):([^\]]*)\]/g;
  let match;
  while ((match = regex.exec(note)) !== null) {
    fields[match[1]] = match[2];
    remaining = remaining.replace(match[0], "");
  }
  return { fields, freeText: remaining.trim() };
}

function formatNow(): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles", year: "numeric", month: "short", day: "numeric",
  }) + ", " + now.toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit",
  });
  return dateStr;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parseTimeToSeconds(t: string): number {
  if (!t) return NaN;
  const parts = String(t).split(":");
  if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  return parseFloat(t);
}

// ─── Pill toggle component ───
function PillSelect({ options, selected, onChange, color = "seafoam" }: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  color?: string;
}) {
  const toggle = (opt: string) => {
    if (selected.indexOf(opt) >= 0) {
      onChange(selected.filter(s => s !== opt));
    } else {
      onChange(selected.concat([opt]));
    }
  };
  const activeClass = color === "seafoam"
    ? "bg-seafoam/15 border-seafoam/30 text-seafoam"
    : "bg-teal/15 border-teal/30 text-teal";

  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
            selected.indexOf(opt) >= 0
              ? activeClass
              : "bg-transparent border-white/10 text-white/30 hover:text-white/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Mic SVG ───
function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

// ─── Entry type colors ───
function entryTypeColor(type: string): string {
  switch (type) {
    case "Session": return "bg-teal/15 text-teal border-teal/25";
    case "PB": return "bg-coral/15 text-coral border-coral/25";
    case "BOLT": return "bg-seafoam/15 text-seafoam border-seafoam/25";
    case "Goal": return "bg-sand/15 text-sand border-sand/25";
    case "Note": return "bg-white/[0.06] text-white/50 border-white/10";
    default: return "bg-white/[0.06] text-white/50 border-white/10";
  }
}

function entryBorderColor(type: string): string {
  switch (type) {
    case "Session": return "border-teal/15";
    case "PB": return "border-coral/15";
    case "BOLT": return "border-seafoam/15";
    case "Goal": return "border-sand/15";
    default: return "border-white/[0.06]";
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function StudentPortal() {
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [role, setRole] = useState<"coach" | "student">("coach");
  const [studentName, setStudentName] = useState("");
  const [activeStudent, setActiveStudent] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [allStudents, setAllStudents] = useState<string[]>([]);

  // Conditions
  const [conditions, setConditions] = useState<any>(null);
  const [conditionsLoading, setConditionsLoading] = useState(false);

  const fetchConditions = useCallback(async () => {
    setConditionsLoading(true);
    try {
      const res = await fetch("/api/conditions");
      if (res.ok) {
        const data = await res.json();
        setConditions(data);
      }
    } catch { /* silent */ }
    setConditionsLoading(false);
  }, []);

  // Entry form state
  const [entryType, setEntryType] = useState<"Session" | "PB" | "BOLT" | "Goal" | "Note">("Session");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Session form
  const [sessionDate, setSessionDate] = useState(formatNow());
  const [sessionLocation, setSessionLocation] = useState("La Jolla Shores");
  const [sessionLocationOther, setSessionLocationOther] = useState("");
  const [sessionDives, setSessionDives] = useState("");
  const [sessionTopDepth, setSessionTopDepth] = useState("");
  const [sessionLongestHold, setSessionLongestHold] = useState("");
  const [sessionBoltPre, setSessionBoltPre] = useState("");
  const [sessionBoltPost, setSessionBoltPost] = useState("");
  const [sessionDisciplines, setSessionDisciplines] = useState<string[]>([]);
  const [sessionSkills, setSessionSkills] = useState<string[]>([]);
  const [sessionNotes, setSessionNotes] = useState("");

  // PB form
  const [pbDiscipline, setPbDiscipline] = useState("CWT");
  const [pbValue, setPbValue] = useState("");
  const [pbDate, setPbDate] = useState(formatNow());
  const [pbConditions, setPbConditions] = useState("");
  const [pbNotes, setPbNotes] = useState("");

  // BOLT form
  const [boltScore, setBoltScore] = useState("");
  const [boltContext, setBoltContext] = useState<string[]>([]);
  const [boltNotes, setBoltNotes] = useState("");

  // Goal form
  const [goalDiscipline, setGoalDiscipline] = useState("CWT");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalTargetDate, setGoalTargetDate] = useState("");
  const [goalCurrentLevel, setGoalCurrentLevel] = useState("");
  const [goalNotes, setGoalNotes] = useState("");

  // Note form
  const [generalNote, setGeneralNote] = useState("");

  // Profile (cert) editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileAgency, setProfileAgency] = useState("None");
  const [profileLevel, setProfileLevel] = useState("");
  const [profileCertDate, setProfileCertDate] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Edit log entry
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // Log filter
  const [logFilter, setLogFilter] = useState<string>("All");

  // Voice
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [voiceTarget, setVoiceTarget] = useState<string>("sessionNotes");

  // ─── Data fetching ───
  const fetchLogs = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students?student=${encodeURIComponent(name)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data.reverse());
      }
    } catch {
      // silent
    }
    setLoading(false);
  }, []);

  const fetchAllLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAllLogs(data);
        const nameSet = new Set<string>();
        data.forEach((d: LogEntry) => { if (d.student) nameSet.add(d.student); });
        setAllStudents(Array.from(nameSet));
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (authenticated && role === "coach") {
      fetchAllLogs();
    }
  }, [authenticated, role, fetchAllLogs]);

  useEffect(() => {
    if (activeStudent) {
      fetchLogs(activeStudent);
      fetchConditions();
    }
  }, [activeStudent, fetchLogs, fetchConditions]);

  // Load profile data when logs change
  useEffect(() => {
    const profileEntry = logs.find(e => e.type === "Profile");
    if (profileEntry) {
      const { fields } = parseStructuredNote(profileEntry.note);
      setProfileAgency(fields.AGENCY || "None");
      setProfileLevel(fields.LEVEL || "");
      setProfileCertDate(fields.CERT_DATE || "");
    }
  }, [logs]);

  // ─── Auth ───
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.toLowerCase().trim();
    if (role === "coach" && c === COACH_CODE) {
      setAuthenticated(true);
      setCodeError(false);
    } else if (role === "student" && c === STUDENT_CODE && studentName.trim()) {
      setAuthenticated(true);
      setActiveStudent(studentName.trim());
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  // ─── Voice ───
  const startListening = (target: string) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Try Chrome.");
      return;
    }
    setVoiceTarget(target);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      // Update the correct field
      switch (target) {
        case "sessionNotes": setSessionNotes(transcript); break;
        case "pbNotes": setPbNotes(transcript); break;
        case "boltNotes": setBoltNotes(transcript); break;
        case "goalNotes": setGoalNotes(transcript); break;
        case "generalNote": setGeneralNote(transcript); break;
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
  };

  // ─── Voice button component ───
  const VoiceButton = ({ target }: { target: string }) => (
    <button
      type="button"
      onClick={listening && voiceTarget === target ? stopListening : () => startListening(target)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium cursor-pointer border-none transition-all ${
        listening && voiceTarget === target
          ? "bg-coral text-white animate-pulse"
          : "bg-white/[0.06] text-white/40 hover:bg-white/[0.1] hover:text-white/70"
      }`}
    >
      <MicIcon />
      {listening && voiceTarget === target ? "Stop" : "Voice"}
    </button>
  );

  // ─── Save profile ───
  const saveProfile = async () => {
    if (!activeStudent) return;
    setSavingProfile(true);
    const noteStr = `[AGENCY:${profileAgency}] [LEVEL:${profileLevel}] [CERT_DATE:${profileCertDate}]`;
    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: activeStudent,
          date: formatNow(),
          author: "Coach",
          type: "Profile",
          note: noteStr,
          depth: "", time: "", bolt: "",
        }),
      });
      setEditingProfile(false);
      fetchLogs(activeStudent);
    } catch {
      alert("Failed to save profile.");
    }
    setSavingProfile(false);
  };

  // ─── Save entry ───
  const saveEntry = async () => {
    if (!activeStudent) return;
    setSaving(true);
    setSaved(false);

    let note = "";
    let depth = "";
    let time = "";
    let bolt = "";
    const type = entryType as string;

    switch (entryType) {
      case "Session": {
        const loc = sessionLocation === "Other" ? sessionLocationOther : sessionLocation;
        const parts: string[] = [];
        if (loc) parts.push(`[LOC:${loc}]`);
        if (sessionDives) parts.push(`[DIVES:${sessionDives}]`);
        if (sessionTopDepth) parts.push(`[TOP:${sessionTopDepth}]`);
        if (sessionLongestHold) parts.push(`[HOLD:${sessionLongestHold}]`);
        if (sessionBoltPre) parts.push(`[BOLT_PRE:${sessionBoltPre}]`);
        if (sessionBoltPost) parts.push(`[BOLT_POST:${sessionBoltPost}]`);
        if (sessionDisciplines.length > 0) parts.push(`[DISC:${sessionDisciplines.join(",")}]`);
        if (sessionSkills.length > 0) parts.push(`[SKILLS:${sessionSkills.join(",")}]`);
        // Auto-attach conditions
        if (conditions) {
          const cParts: string[] = [];
          if (conditions.waveHeight) cParts.push(`${(conditions.waveHeight * 3.281).toFixed(1)}ft`);
          if (conditions.wavePeriod) cParts.push(`${conditions.wavePeriod.toFixed(0)}s`);
          if (conditions.windSpeed) cParts.push(`wind ${conditions.windSpeed}`);
          if (conditions.waterTemp) cParts.push(`${Math.round(conditions.waterTemp)}°F`);
          if (cParts.length > 0) parts.push(`[CONDITIONS:${cParts.join(", ")}]`);
        }
        if (sessionNotes) parts.push(sessionNotes);
        note = parts.join(" ");
        depth = sessionTopDepth;
        time = sessionLongestHold;
        bolt = sessionBoltPre;
        break;
      }
      case "PB": {
        const parts: string[] = [];
        parts.push(`[DISC:${pbDiscipline}]`);
        if (pbValue) parts.push(`[VALUE:${pbValue}]`);
        if (pbConditions) parts.push(`[CONDITIONS:${pbConditions}]`);
        if (pbNotes) parts.push(pbNotes);
        note = parts.join(" ");
        // Put value in depth or time depending on discipline
        if (pbDiscipline === "STA" || pbDiscipline === "DYN") {
          time = pbValue;
        } else {
          depth = pbValue;
        }
        break;
      }
      case "BOLT": {
        const parts: string[] = [];
        parts.push(`[SCORE:${boltScore}]`);
        if (boltContext.length > 0) parts.push(`[CONTEXT:${boltContext.join(",")}]`);
        if (boltNotes) parts.push(boltNotes);
        note = parts.join(" ");
        bolt = boltScore;
        break;
      }
      case "Goal": {
        const parts: string[] = [];
        parts.push(`[DISC:${goalDiscipline}]`);
        if (goalTarget) parts.push(`[TARGET:${goalTarget}]`);
        if (goalTargetDate) parts.push(`[TARGET_DATE:${goalTargetDate}]`);
        if (goalCurrentLevel) parts.push(`[CURRENT:${goalCurrentLevel}]`);
        if (goalNotes) parts.push(goalNotes);
        note = parts.join(" ");
        break;
      }
      case "Note": {
        note = generalNote;
        break;
      }
    }

    if (!note.trim()) {
      setSaving(false);
      return;
    }

    const dateStr = entryType === "Session" ? sessionDate : (entryType === "PB" ? pbDate : formatNow());

    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: activeStudent,
          date: dateStr,
          author: role === "coach" ? "Coach" : activeStudent,
          type,
          note: note.trim(),
          depth: depth || "",
          time: time || "",
          bolt: bolt || "",
        }),
      });
      setSaved(true);
      // Reset form
      resetForm();
      setTimeout(() => setSaved(false), 3000);
      fetchLogs(activeStudent);
    } catch {
      alert("Failed to save. Try again.");
    }
    setSaving(false);
  };

  const resetForm = () => {
    setSessionDate(formatNow());
    setSessionLocation("La Jolla Shores");
    setSessionLocationOther("");
    setSessionDives("");
    setSessionTopDepth("");
    setSessionLongestHold("");
    setSessionBoltPre("");
    setSessionBoltPost("");
    setSessionDisciplines([]);
    setSessionSkills([]);
    setSessionNotes("");
    setPbDiscipline("CWT");
    setPbValue("");
    setPbDate(formatNow());
    setPbConditions("");
    setPbNotes("");
    setBoltScore("");
    setBoltContext([]);
    setBoltNotes("");
    setGoalDiscipline("CWT");
    setGoalTarget("");
    setGoalTargetDate("");
    setGoalCurrentLevel("");
    setGoalNotes("");
    setGeneralNote("");
  };

  // ─── Save edit ───
  const saveEdit = async (index: number) => {
    if (!editText.trim()) return;
    const entry = logs[index];
    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: activeStudent,
          date: formatNow(),
          author: role === "coach" ? "Coach" : activeStudent,
          type: `Edit: ${entry.type}`,
          note: editText.trim(),
          depth: entry.depth || "",
          time: entry.time || "",
          bolt: entry.bolt || "",
        }),
      });
      setEditingIndex(null);
      setEditText("");
      fetchLogs(activeStudent);
    } catch {
      alert("Failed to save edit.");
    }
  };

  // ─── Stats helpers ───
  function getProfileEntry(studentLogs: LogEntry[]): LogEntry | undefined {
    // Most recent Profile entry
    const profiles = studentLogs.filter(e => e.type === "Profile");
    return profiles.length > 0 ? profiles[0] : undefined;
  }

  function getCertBadge(studentLogs: LogEntry[]): string | null {
    const profile = getProfileEntry(studentLogs);
    if (!profile) return null;
    const { fields } = parseStructuredNote(profile.note);
    if (fields.LEVEL && fields.LEVEL !== "None") return fields.LEVEL;
    if (fields.AGENCY && fields.AGENCY !== "None") return fields.AGENCY;
    return null;
  }

  function getStudentStats(name: string) {
    const entries = allLogs.filter(e => e.student === name);
    const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
    const depths = entries.map(e => parseFloat(e.depth)).filter(d => !isNaN(d));
    const bolts = entries.map(e => parseFloat(e.bolt)).filter(b => !isNaN(b));
    return {
      totalEntries: entries.length,
      lastDate: lastEntry?.date || "--",
      maxDepth: depths.length > 0 ? Math.max.apply(null, depths) + "m" : "--",
      bestBolt: bolts.length > 0 ? Math.max.apply(null, bolts) + "s" : "--",
      sessionCount: entries.filter(e => e.type === "Session" || e.type === "Session note").length,
    };
  }

  function getProfileStats() {
    const nonProfile = logs.filter(e => e.type !== "Profile");

    // Total sessions
    const sessions = nonProfile.filter(e => e.type === "Session" || e.type === "Session note");

    // Max depth — from depth column + parsed [TOP:] fields
    const depths: number[] = [];
    nonProfile.forEach(e => {
      const d = parseFloat(e.depth);
      if (!isNaN(d)) depths.push(d);
      const { fields } = parseStructuredNote(e.note);
      if (fields.TOP) {
        const td = parseFloat(fields.TOP);
        if (!isNaN(td)) depths.push(td);
      }
      if (fields.VALUE) {
        const vd = parseFloat(fields.VALUE);
        if (!isNaN(vd) && e.type === "PB") depths.push(vd);
      }
    });

    // Best STA
    const staTimes: number[] = [];
    nonProfile.forEach(e => {
      const { fields } = parseStructuredNote(e.note);
      // From time column
      const t = parseTimeToSeconds(e.time);
      if (!isNaN(t)) staTimes.push(t);
      // From HOLD field
      if (fields.HOLD) {
        const ht = parseTimeToSeconds(fields.HOLD);
        if (!isNaN(ht)) staTimes.push(ht);
      }
    });

    // Best BOLT
    const bolts: number[] = [];
    nonProfile.forEach(e => {
      const b = parseFloat(e.bolt);
      if (!isNaN(b)) bolts.push(b);
      const { fields } = parseStructuredNote(e.note);
      if (fields.SCORE) {
        const bs = parseFloat(fields.SCORE);
        if (!isNaN(bs)) bolts.push(bs);
      }
      if (fields.BOLT_PRE) {
        const bp = parseFloat(fields.BOLT_PRE);
        if (!isNaN(bp)) bolts.push(bp);
      }
      if (fields.BOLT_POST) {
        const bpo = parseFloat(fields.BOLT_POST);
        if (!isNaN(bpo)) bolts.push(bpo);
      }
    });

    // Total dives
    let totalDives = 0;
    nonProfile.forEach(e => {
      const { fields } = parseStructuredNote(e.note);
      if (fields.DIVES) {
        const nd = parseInt(fields.DIVES);
        if (!isNaN(nd)) totalDives += nd;
      }
    });

    return {
      totalSessions: sessions.length,
      maxDepth: depths.length > 0 ? Math.max.apply(null, depths) + "m" : "--",
      bestSTA: staTimes.length > 0 ? formatTime(Math.max.apply(null, staTimes)) : "--",
      bestBolt: bolts.length > 0 ? Math.max.apply(null, bolts) + "s" : "--",
      totalDives: totalDives || "--",
    };
  }

  function getActiveGoals(): Array<{ discipline: string; target: string; targetDate: string; current: string; notes: string }> {
    const goals: Array<{ discipline: string; target: string; targetDate: string; current: string; notes: string }> = [];
    logs.forEach(e => {
      if (e.type === "Goal") {
        const { fields, freeText } = parseStructuredNote(e.note);
        goals.push({
          discipline: fields.DISC || "",
          target: fields.TARGET || "",
          targetDate: fields.TARGET_DATE || "",
          current: fields.CURRENT || "",
          notes: freeText,
        });
      }
    });
    return goals;
  }

  // ─── Filtered logs ───
  const filteredLogs = logs.filter(e => {
    if (e.type === "Profile") return false;
    if (logFilter === "All") return true;
    return e.type === logFilter;
  });

  // ═══════════════════════════════════════════════
  // AUTH SCREEN
  // ═══════════════════════════════════════════════
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <form onSubmit={handleAuth} className="max-w-[360px] w-full">
          <div className="text-center mb-8">
            <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-3">LJFC</div>
            <h1 className="font-serif text-3xl text-white mb-2">Student Portal</h1>
            <p className="text-white/30 text-sm">Track progress, log sessions, review notes.</p>
          </div>

          <div className="flex gap-2 mb-6">
            {(["coach", "student"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setCodeError(false); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                  role === r ? "bg-seafoam/15 border-seafoam/30 text-seafoam" : "bg-transparent border-white/10 text-white/40"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {role === "student" && (
            <input
              type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-5 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/20 mb-4"
            />
          )}

          <input
            type="password" value={code}
            onChange={(e) => { setCode(e.target.value); setCodeError(false); }}
            placeholder={role === "coach" ? "Coach code" : "Access code"}
            className={`w-full px-5 py-3 rounded-xl bg-white/[0.06] border text-white text-sm outline-none transition-colors placeholder:text-white/20 text-center tracking-widest mb-4 ${
              codeError ? "border-coral/50" : "border-white/10 focus:border-seafoam"
            }`}
          />
          {codeError && <p className="text-coral/70 text-xs text-center mb-4">Incorrect code.</p>}
          <button type="submit" className="w-full py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all">
            Enter
          </button>
        </form>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // COACH: STUDENT LIST
  // ═══════════════════════════════════════════════
  if (role === "coach" && !activeStudent) {
    return (
      <div className="min-h-screen bg-deep px-6 py-8">
        <div className="max-w-[500px] mx-auto">
          <div className="text-center mb-8 pt-20">
            <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-2">Coach View</div>
            <h1 className="font-serif text-2xl text-white">Students</h1>
            <p className="text-white/20 text-xs mt-2">{allStudents.length} students &middot; {allLogs.length} total entries</p>
          </div>

          <div className="flex gap-2 mb-6">
            <input
              type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)}
              placeholder="New or existing student..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/20"
              onKeyDown={(e) => { if (e.key === "Enter" && studentName.trim()) setActiveStudent(studentName.trim()); }}
            />
            <button
              onClick={() => { if (studentName.trim()) setActiveStudent(studentName.trim()); }}
              className="px-5 py-3 rounded-xl bg-seafoam/20 text-seafoam text-sm font-medium cursor-pointer border-none hover:bg-seafoam/30 transition-colors"
            >
              Open
            </button>
          </div>

          <div className="space-y-2">
            {allStudents.length === 0 && (
              <p className="text-white/20 text-sm text-center py-8">No students yet. Type a name above to create the first profile.</p>
            )}
            {allStudents.map((name) => {
              const stats = getStudentStats(name);
              const studentLogs = allLogs.filter(e => e.student === name);
              const certBadge = getCertBadge(studentLogs);
              return (
                <button
                  key={name}
                  onClick={() => setActiveStudent(name)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.04] border border-white/[0.06] rounded-xl text-left hover:bg-white/[0.07] transition-colors cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 text-sm font-medium">{name}</span>
                      {certBadge && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-seafoam/15 text-seafoam border border-seafoam/20">
                          {certBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-white/20 text-[10px]">
                      {stats.sessionCount} sessions &middot; Last: {stats.lastDate}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-3">
                      {stats.maxDepth !== "--" && (
                        <span className="text-white/15 text-[10px]">{stats.maxDepth}</span>
                      )}
                      {stats.bestBolt !== "--" && (
                        <span className="text-white/15 text-[10px]">BOLT {stats.bestBolt}</span>
                      )}
                    </div>
                    <span className="text-white/10 text-xs group-hover:text-seafoam/40 transition-colors">&rarr;</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center gap-6">
            <Link href="/saturday" className="text-white/20 text-xs no-underline hover:text-white/40">Saturday Admin</Link>
            <a href="https://docs.google.com/spreadsheets/d/17-XZMotYOiVIcJde2_Ppgxan7TFGBU6df-DI43Ygf8E/edit" target="_blank" rel="noopener noreferrer" className="text-white/20 text-xs no-underline hover:text-white/40">Open Sheet</a>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // STUDENT PROFILE VIEW
  // ═══════════════════════════════════════════════
  const stats = getProfileStats();
  const activeGoals = getActiveGoals();
  const profileEntry = getProfileEntry(logs);
  const profileData = profileEntry ? parseStructuredNote(profileEntry.note).fields : null;

  return (
    <div className="min-h-screen bg-deep px-4 sm:px-6 py-8">
      <div className="max-w-[600px] mx-auto">

        {/* ─── Header ─── */}
        <div className="pt-16 sm:pt-20 mb-6">
          {role === "coach" && (
            <button
              onClick={() => { setActiveStudent(""); setLogs([]); fetchAllLogs(); }}
              className="text-white/30 text-xs mb-4 bg-transparent border-none cursor-pointer hover:text-white/50"
            >
              &larr; All students
            </button>
          )}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-1">
                {role === "coach" ? "Student Profile" : "My Progress"}
              </div>
              <h1 className="font-serif text-2xl text-white">{activeStudent}</h1>
            </div>
            <button
              onClick={() => fetchLogs(activeStudent)}
              className="text-white/20 text-xs bg-transparent border-none cursor-pointer hover:text-white/40"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* ─── Certification Info ─── */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] text-white/25 uppercase tracking-wider font-medium">Certification</div>
            {role === "coach" && !editingProfile && (
              <button
                onClick={() => setEditingProfile(true)}
                className="text-white/20 text-[10px] bg-transparent border-none cursor-pointer hover:text-seafoam/60"
              >
                {profileData ? "Edit" : "+ Add"}
              </button>
            )}
          </div>

          {editingProfile ? (
            <div className="space-y-3">
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Agency</label>
                <select
                  value={profileAgency}
                  onChange={(e) => setProfileAgency(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors appearance-none cursor-pointer"
                >
                  {AGENCIES.map(a => <option key={a} value={a} className="bg-deep">{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Level</label>
                <input
                  type="text" value={profileLevel} onChange={(e) => setProfileLevel(e.target.value)}
                  placeholder="e.g. AIDA 2, SSI Level 1, None"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                />
              </div>
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Cert Date</label>
                <input
                  type="text" value={profileCertDate} onChange={(e) => setProfileCertDate(e.target.value)}
                  placeholder="e.g. March 2026"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={() => setEditingProfile(false)}
                  className="px-4 py-2 text-white/30 text-xs bg-transparent border border-white/10 rounded-lg cursor-pointer hover:text-white/50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  className="px-4 py-2 bg-seafoam/20 text-seafoam text-xs font-medium rounded-lg cursor-pointer border-none hover:bg-seafoam/30 disabled:opacity-40"
                >
                  {savingProfile ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap">
              {profileData ? (
                <>
                  {profileData.AGENCY && profileData.AGENCY !== "None" && (
                    <div>
                      <div className="text-white/15 text-[9px] uppercase">Agency</div>
                      <div className="text-white/60 text-sm">{profileData.AGENCY}</div>
                    </div>
                  )}
                  {profileData.LEVEL && profileData.LEVEL !== "None" && (
                    <div>
                      <div className="text-white/15 text-[9px] uppercase">Level</div>
                      <div className="text-white/60 text-sm">{profileData.LEVEL}</div>
                    </div>
                  )}
                  {profileData.CERT_DATE && (
                    <div>
                      <div className="text-white/15 text-[9px] uppercase">Cert Date</div>
                      <div className="text-white/60 text-sm">{profileData.CERT_DATE}</div>
                    </div>
                  )}
                  {(!profileData.AGENCY || profileData.AGENCY === "None") && (!profileData.LEVEL || profileData.LEVEL === "None") && (
                    <div className="text-white/20 text-sm">No certification on file</div>
                  )}
                </>
              ) : (
                <div className="text-white/20 text-sm">No certification on file</div>
              )}
            </div>
          )}
        </div>

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
          {[
            { label: "Sessions", value: String(stats.totalSessions) },
            { label: "Max Depth", value: stats.maxDepth },
            { label: "Best STA", value: stats.bestSTA },
            { label: "Best BOLT", value: stats.bestBolt },
            { label: "Total Dives", value: String(stats.totalDives) },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
              <div className="text-white/70 font-serif text-lg">{s.value}</div>
              <div className="text-white/20 text-[8px] sm:text-[9px] uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ─── Active Goals ─── */}
        {activeGoals.length > 0 && (
          <div className="mb-6">
            <div className="text-[10px] text-sand/50 uppercase tracking-wider font-medium mb-2">Active Goals</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeGoals.map((goal, i) => (
                <div key={i} className="bg-sand/[0.06] border border-sand/15 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-sand/15 text-sand">{goal.discipline}</span>
                    {goal.targetDate && <span className="text-white/20 text-[10px]">by {goal.targetDate}</span>}
                  </div>
                  <div className="text-white/70 text-sm font-medium">{goal.target}</div>
                  {goal.current && (
                    <div className="text-white/30 text-[11px] mt-0.5">Current: {goal.current}</div>
                  )}
                  {goal.notes && (
                    <div className="text-white/20 text-[11px] mt-1">{goal.notes}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* NEW ENTRY FORM                                 */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="bg-ocean/30 border border-teal/15 rounded-2xl p-4 sm:p-5 mb-6">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">New Entry</div>

          {/* Entry type selector */}
          <div className="flex gap-1.5 mb-5 flex-wrap">
            {(["Session", "PB", "BOLT", "Goal", "Note"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setEntryType(t)}
                className={`px-3 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  entryType === t ? "bg-seafoam/15 border-seafoam/30 text-seafoam" : "bg-transparent border-white/10 text-white/30 hover:text-white/50"
                }`}
              >
                {t === "PB" ? "Personal Best" : t === "BOLT" ? "BOLT Score" : t === "Note" ? "General Note" : t === "Session" ? "Session Log" : t}
              </button>
            ))}
          </div>

          {/* ─── SESSION FORM ─── */}
          {entryType === "Session" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Date</label>
                  <input
                    type="text" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Location</label>
                  <select
                    value={sessionLocation}
                    onChange={(e) => setSessionLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors appearance-none cursor-pointer"
                  >
                    {LOCATIONS.map(l => <option key={l} value={l} className="bg-deep">{l}</option>)}
                  </select>
                </div>
              </div>

              {sessionLocation === "Other" && (
                <input
                  type="text" value={sessionLocationOther} onChange={(e) => setSessionLocationOther(e.target.value)}
                  placeholder="Location name"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                />
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1"># Dives</label>
                  <input
                    type="number" value={sessionDives} onChange={(e) => setSessionDives(e.target.value)}
                    placeholder="6"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Top Depth</label>
                  <input
                    type="text" value={sessionTopDepth} onChange={(e) => setSessionTopDepth(e.target.value)}
                    placeholder="15m"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Longest Hold</label>
                  <input
                    type="text" value={sessionLongestHold} onChange={(e) => setSessionLongestHold(e.target.value)}
                    placeholder="2:30"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">BOLT Pre</label>
                  <input
                    type="text" value={sessionBoltPre} onChange={(e) => setSessionBoltPre(e.target.value)}
                    placeholder="22"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">BOLT Post</label>
                  <input
                    type="text" value={sessionBoltPost} onChange={(e) => setSessionBoltPost(e.target.value)}
                    placeholder="28"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-2">Disciplines</label>
                <PillSelect options={DISCIPLINES} selected={sessionDisciplines} onChange={setSessionDisciplines} />
              </div>

              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-2">Skills Practiced</label>
                <PillSelect options={SKILLS} selected={sessionSkills} onChange={setSessionSkills} color="teal" />
              </div>

              {/* Auto-attached conditions */}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/20 text-[10px] uppercase tracking-wider">Conditions (auto)</span>
                  <button
                    type="button" onClick={fetchConditions}
                    className="text-white/15 text-[10px] bg-transparent border-none cursor-pointer hover:text-white/30"
                  >
                    {conditionsLoading ? "..." : "refresh"}
                  </button>
                </div>
                {conditions ? (
                  <div className="flex gap-3 flex-wrap text-xs">
                    {conditions.waveHeight && <span className="text-seafoam/60">{(conditions.waveHeight * 3.281).toFixed(1)}ft @ {conditions.wavePeriod?.toFixed(0) || "—"}s</span>}
                    {conditions.windSpeed && <span className="text-white/30">wind {conditions.windSpeed}</span>}
                    {conditions.waterTemp && <span className="text-white/30">{Math.round(conditions.waterTemp)}°F</span>}
                  </div>
                ) : (
                  <span className="text-white/15 text-xs">{conditionsLoading ? "Loading..." : "Unavailable"}</span>
                )}
              </div>

              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Notes</label>
                <textarea
                  value={sessionNotes} onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder={listening && voiceTarget === "sessionNotes" ? "Listening..." : "How did the session go?"}
                  rows={3}
                  className={`w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border text-white text-sm outline-none transition-colors placeholder:text-white/15 resize-none ${
                    listening && voiceTarget === "sessionNotes" ? "border-coral/50 bg-coral/[0.06]" : "border-white/10 focus:border-seafoam"
                  }`}
                />
                <div className="flex justify-end mt-1.5">
                  <VoiceButton target="sessionNotes" />
                </div>
              </div>
            </div>
          )}

          {/* ─── PB FORM ─── */}
          {entryType === "PB" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Discipline</label>
                  <select
                    value={pbDiscipline}
                    onChange={(e) => setPbDiscipline(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors appearance-none cursor-pointer"
                  >
                    {PB_DISCIPLINES.map(d => <option key={d} value={d} className="bg-deep">{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Value</label>
                  <input
                    type="text" value={pbValue} onChange={(e) => setPbValue(e.target.value)}
                    placeholder="22m or 3:15"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Date</label>
                  <input
                    type="text" value={pbDate} onChange={(e) => setPbDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Conditions <span className="text-white/10">(opt)</span></label>
                  <input
                    type="text" value={pbConditions} onChange={(e) => setPbConditions(e.target.value)}
                    placeholder="clean water, 68F"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Notes</label>
                <textarea
                  value={pbNotes} onChange={(e) => setPbNotes(e.target.value)}
                  placeholder="Details about the PB..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15 resize-none"
                />
              </div>
            </div>
          )}

          {/* ─── BOLT FORM ─── */}
          {entryType === "BOLT" && (
            <div className="space-y-4">
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Score (seconds)</label>
                <input
                  type="number" value={boltScore} onChange={(e) => setBoltScore(e.target.value)}
                  placeholder="25"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                />
              </div>
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-2">Context</label>
                <PillSelect options={BOLT_CONTEXTS} selected={boltContext} onChange={setBoltContext} />
              </div>
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Notes <span className="text-white/10">(opt)</span></label>
                <textarea
                  value={boltNotes} onChange={(e) => setBoltNotes(e.target.value)}
                  placeholder="Any observations..."
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15 resize-none"
                />
              </div>
            </div>
          )}

          {/* ─── GOAL FORM ─── */}
          {entryType === "Goal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Discipline</label>
                  <select
                    value={goalDiscipline}
                    onChange={(e) => setGoalDiscipline(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors appearance-none cursor-pointer"
                  >
                    {PB_DISCIPLINES.map(d => <option key={d} value={d} className="bg-deep">{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Target</label>
                  <input
                    type="text" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="30m CWT or 3:00 STA"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Target Date <span className="text-white/10">(opt)</span></label>
                  <input
                    type="text" value={goalTargetDate} onChange={(e) => setGoalTargetDate(e.target.value)}
                    placeholder="June 2026"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
                <div>
                  <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Current Level</label>
                  <input
                    type="text" value={goalCurrentLevel} onChange={(e) => setGoalCurrentLevel(e.target.value)}
                    placeholder="22m CWT"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Notes</label>
                <textarea
                  value={goalNotes} onChange={(e) => setGoalNotes(e.target.value)}
                  placeholder="Training plan, strategy..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/15 resize-none"
                />
              </div>
            </div>
          )}

          {/* ─── NOTE FORM ─── */}
          {entryType === "Note" && (
            <div className="space-y-3">
              <textarea
                value={generalNote} onChange={(e) => setGeneralNote(e.target.value)}
                placeholder={listening && voiceTarget === "generalNote" ? "Listening..." : "Type or tap the mic to speak..."}
                rows={5}
                className={`w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border text-white text-sm outline-none transition-colors placeholder:text-white/15 resize-none ${
                  listening && voiceTarget === "generalNote" ? "border-coral/50 bg-coral/[0.06]" : "border-white/10 focus:border-seafoam"
                }`}
              />
              <div className="flex justify-end">
                <VoiceButton target="generalNote" />
              </div>
            </div>
          )}

          {/* Save button */}
          <button
            onClick={saveEntry}
            disabled={saving}
            className="w-full py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-5"
          >
            {saving ? "Saving..." : saved ? "Saved!" : `Save ${entryType === "PB" ? "Personal Best" : entryType === "BOLT" ? "BOLT Score" : entryType === "Note" ? "Note" : entryType}`}
          </button>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* TRAINING LOG                                   */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase">Training Log</div>
            <div className="text-white/15 text-[10px]">{filteredLogs.length} entries</div>
          </div>

          {/* Filter pills */}
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {["All", "Session", "PB", "BOLT", "Goal", "Note"].map(f => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium border cursor-pointer transition-all ${
                  logFilter === f ? "bg-white/[0.08] border-white/20 text-white/60" : "bg-transparent border-white/[0.06] text-white/20 hover:text-white/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading && <p className="text-white/20 text-sm text-center py-8">Loading...</p>}
          {!loading && filteredLogs.length === 0 && (
            <p className="text-white/20 text-sm text-center py-8">No entries yet. Add your first entry above.</p>
          )}

          <div className="space-y-3">
            {filteredLogs.map((entry, i) => {
              const { fields, freeText } = parseStructuredNote(entry.note);
              const typeColor = entryTypeColor(entry.type);
              const borderColor = entryBorderColor(entry.type);
              const isPB = entry.type === "PB";

              return (
                <div key={i} className={`bg-white/[0.03] border ${borderColor} rounded-xl p-4 group`}>
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${typeColor}`}>
                        {isPB ? "PB" : entry.type}
                      </span>
                      {isPB && <span className="text-coral/60 text-xs">&#9733;</span>}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        entry.author === "Coach" ? "bg-seafoam/15 text-seafoam" : "bg-sand/15 text-sand"
                      }`}>
                        {entry.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/15 text-[10px]">{entry.date}</span>
                      {role === "coach" && (
                        <button
                          onClick={() => { setEditingIndex(i); setEditText(entry.note); }}
                          className="text-white/0 group-hover:text-white/20 text-[10px] bg-transparent border-none cursor-pointer hover:text-white/40 transition-all"
                        >
                          edit
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Parsed structured fields as pills */}
                  {Object.keys(fields).length > 0 && editingIndex !== i && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {fields.LOC && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal/10 text-teal/70 border border-teal/15">{fields.LOC}</span>
                      )}
                      {fields.DIVES && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.04] text-white/40 border border-white/[0.08]">{fields.DIVES} dives</span>
                      )}
                      {fields.TOP && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.04] text-white/40 border border-white/[0.08]">{fields.TOP} depth</span>
                      )}
                      {fields.HOLD && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.04] text-white/40 border border-white/[0.08]">{fields.HOLD} hold</span>
                      )}
                      {fields.BOLT_PRE && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-seafoam/10 text-seafoam/60 border border-seafoam/15">BOLT pre: {fields.BOLT_PRE}</span>
                      )}
                      {fields.BOLT_POST && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-seafoam/10 text-seafoam/60 border border-seafoam/15">BOLT post: {fields.BOLT_POST}</span>
                      )}
                      {fields.DISC && fields.DISC.split(",").map((d: string) => (
                        <span key={d} className="px-2 py-0.5 rounded-full text-[10px] bg-teal/10 text-teal/70 border border-teal/15">{d.trim()}</span>
                      ))}
                      {fields.SKILLS && fields.SKILLS.split(",").map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-[10px] bg-ocean/30 text-white/40 border border-white/[0.08]">{s.trim()}</span>
                      ))}
                      {fields.SCORE && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-seafoam/10 text-seafoam/70 border border-seafoam/15">{fields.SCORE}s BOLT</span>
                      )}
                      {fields.CONTEXT && fields.CONTEXT.split(",").map((c: string) => (
                        <span key={c} className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.04] text-white/30 border border-white/[0.06]">{c.trim()}</span>
                      ))}
                      {fields.VALUE && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-coral/10 text-coral/70 border border-coral/15">{fields.VALUE}</span>
                      )}
                      {fields.CONDITIONS && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.04] text-white/30 border border-white/[0.06]">{fields.CONDITIONS}</span>
                      )}
                      {fields.TARGET && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-sand/10 text-sand/70 border border-sand/15">Target: {fields.TARGET}</span>
                      )}
                      {fields.TARGET_DATE && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.04] text-white/30 border border-white/[0.06]">by {fields.TARGET_DATE}</span>
                      )}
                      {fields.CURRENT && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.04] text-white/30 border border-white/[0.06]">Current: {fields.CURRENT}</span>
                      )}
                    </div>
                  )}

                  {/* Edit mode or display */}
                  {editingIndex === i ? (
                    <div className="mt-2">
                      <textarea
                        value={editText} onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-seafoam/30 text-white text-sm outline-none resize-none mb-2"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="px-3 py-1.5 text-white/30 text-xs bg-transparent border border-white/10 rounded-lg cursor-pointer hover:text-white/50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(i)}
                          className="px-3 py-1.5 bg-seafoam/20 text-seafoam text-xs font-medium rounded-lg cursor-pointer border-none hover:bg-seafoam/30"
                        >
                          Save correction
                        </button>
                      </div>
                    </div>
                  ) : (
                    freeText && <p className="text-white/60 text-sm leading-relaxed">{freeText}</p>
                  )}

                  {/* Legacy depth/time/bolt display */}
                  {(entry.depth || entry.time || entry.bolt) && editingIndex !== i && Object.keys(fields).length === 0 && (
                    <div className="flex gap-4 mt-2 pt-2 border-t border-white/[0.04]">
                      {entry.depth && <span className="text-white/30 text-xs">Depth: <strong className="text-white/50">{entry.depth}</strong></span>}
                      {entry.time && <span className="text-white/30 text-xs">Time: <strong className="text-white/50">{entry.time}</strong></span>}
                      {entry.bolt && <span className="text-white/30 text-xs">BOLT: <strong className="text-white/50">{entry.bolt}</strong></span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom links */}
        {role === "coach" && (
          <div className="text-center pb-8">
            <a
              href="https://docs.google.com/spreadsheets/d/17-XZMotYOiVIcJde2_Ppgxan7TFGBU6df-DI43Ygf8E/edit"
              target="_blank" rel="noopener noreferrer"
              className="text-white/15 text-xs no-underline hover:text-white/30"
            >
              Open raw data in Sheets
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
