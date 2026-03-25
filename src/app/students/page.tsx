"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

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

const COACH_CODE = "ljfc-coach";
const STUDENT_CODE = "ljfc";

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

  // New entry form
  const [noteText, setNoteText] = useState("");
  const [entryType, setEntryType] = useState("Session note");
  const [depth, setDepth] = useState("");
  const [time, setTime] = useState("");
  const [bolt, setBolt] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Edit
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // Voice
  const [listening, setListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

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
    }
  }, [activeStudent, fetchLogs]);

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

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Try Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setNoteText(transcript);
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

  const saveEntry = async () => {
    if (!noteText.trim() || !activeStudent) return;
    setSaving(true);
    setSaved(false);
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      timeZone: "America/Los_Angeles", year: "numeric", month: "short", day: "numeric",
    }) + ", " + now.toLocaleTimeString("en-US", {
      timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit",
    });
    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: activeStudent, date: dateStr,
          author: role === "coach" ? "Coach" : activeStudent,
          type: entryType, note: noteText.trim(),
          depth: depth || "", time: time || "", bolt: bolt || "",
        }),
      });
      setSaved(true);
      setNoteText(""); setDepth(""); setTime(""); setBolt("");
      setTimeout(() => setSaved(false), 3000);
      fetchLogs(activeStudent);
    } catch {
      alert("Failed to save. Try again.");
    }
    setSaving(false);
  };

  const saveEdit = async (index: number) => {
    if (!editText.trim()) return;
    // Save as a correction entry
    const entry = logs[index];
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      timeZone: "America/Los_Angeles", year: "numeric", month: "short", day: "numeric",
    }) + ", " + now.toLocaleTimeString("en-US", {
      timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit",
    });
    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: activeStudent, date: dateStr,
          author: role === "coach" ? "Coach" : activeStudent,
          type: `Edit: ${entry.type}`, note: editText.trim(),
          depth: entry.depth || "", time: entry.time || "", bolt: entry.bolt || "",
        }),
      });
      setEditingIndex(null);
      setEditText("");
      fetchLogs(activeStudent);
    } catch {
      alert("Failed to save edit.");
    }
  };

  // ─── Helpers ───
  function getStudentStats(name: string) {
    const entries = allLogs.filter(e => e.student === name);
    const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
    const depths = entries.map(e => parseFloat(e.depth)).filter(d => !isNaN(d));
    const bolts = entries.map(e => parseFloat(e.bolt)).filter(b => !isNaN(b));
    const times = entries.map(e => {
      const parts = String(e.time).split(":");
      if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      return parseFloat(e.time);
    }).filter(t => !isNaN(t));

    return {
      totalEntries: entries.length,
      lastDate: lastEntry?.date || "—",
      maxDepth: depths.length > 0 ? Math.max(...depths) + "m" : "—",
      bestBolt: bolts.length > 0 ? Math.max(...bolts) + "s" : "—",
      bestTime: times.length > 0 ? formatTime(Math.max(...times)) : "—",
      sessionCount: entries.filter(e => e.type === "Session note").length,
    };
  }

  function getProfileStats() {
    const depths = logs.map(e => parseFloat(e.depth)).filter(d => !isNaN(d));
    const bolts = logs.map(e => parseFloat(e.bolt)).filter(b => !isNaN(b));
    const times = logs.map(e => {
      const parts = String(e.time).split(":");
      if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      return parseFloat(e.time);
    }).filter(t => !isNaN(t));

    return {
      totalEntries: logs.length,
      maxDepth: depths.length > 0 ? Math.max(...depths) + "m" : "—",
      latestBolt: bolts.length > 0 ? bolts[0] + "s" : "—",
      bestBolt: bolts.length > 0 ? Math.max(...bolts) + "s" : "—",
      bestTime: times.length > 0 ? formatTime(Math.max(...times)) : "—",
      sessionCount: logs.filter(e => e.type === "Session note").length,
      goalCount: logs.filter(e => e.type === "Goal").length,
      pbCount: logs.filter(e => e.type === "Personal best").length,
    };
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // ─── Auth screen ───
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

  // ─── Coach: Student list ───
  if (role === "coach" && !activeStudent) {
    return (
      <div className="min-h-screen bg-deep px-6 py-8">
        <div className="max-w-[500px] mx-auto">
          <div className="text-center mb-8 pt-20">
            <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-2">Coach View</div>
            <h1 className="font-serif text-2xl text-white">Students</h1>
            <p className="text-white/20 text-xs mt-2">{allStudents.length} students · {allLogs.length} total entries</p>
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
              return (
                <button
                  key={name}
                  onClick={() => setActiveStudent(name)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.04] border border-white/[0.06] rounded-xl text-left hover:bg-white/[0.07] transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="text-white/80 text-sm font-medium block">{name}</span>
                    <span className="text-white/20 text-[10px]">
                      {stats.sessionCount} sessions · Last: {stats.lastDate}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-3">
                      {stats.maxDepth !== "—" && (
                        <span className="text-white/15 text-[10px]">{stats.maxDepth}</span>
                      )}
                      {stats.bestBolt !== "—" && (
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

  // ─── Student profile ───
  const stats = getProfileStats();

  return (
    <div className="min-h-screen bg-deep px-6 py-8">
      <div className="max-w-[600px] mx-auto">
        {/* Header */}
        <div className="pt-20 mb-6">
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

        {/* Stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Sessions", value: String(stats.sessionCount) },
            { label: "Max depth", value: stats.maxDepth },
            { label: "Best BOLT", value: stats.bestBolt },
            { label: "Best time", value: stats.bestTime },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
              <div className="text-white/70 font-serif text-lg">{s.value}</div>
              <div className="text-white/20 text-[9px] uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick stats row */}
        <div className="flex gap-4 mb-6 text-[10px] text-white/20">
          <span>{stats.totalEntries} entries</span>
          <span>{stats.pbCount} personal bests</span>
          <span>{stats.goalCount} goals</span>
        </div>

        {/* New entry */}
        <div className="bg-ocean/30 border border-teal/15 rounded-2xl p-5 mb-6">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">New Entry</div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {["Session note", "BOLT score", "Personal best", "Goal", "General"].map((t) => (
              <button
                key={t} onClick={() => setEntryType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  entryType === t ? "bg-seafoam/15 border-seafoam/30 text-seafoam" : "bg-transparent border-white/10 text-white/30 hover:text-white/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Voice + text */}
          <div className="mb-4">
            <textarea
              value={noteText} onChange={(e) => setNoteText(e.target.value)}
              placeholder={listening ? "Listening..." : "Type or tap the mic to speak..."}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white text-sm outline-none transition-colors placeholder:text-white/20 resize-none ${
                listening ? "border-coral/50 bg-coral/[0.06]" : "border-white/10 focus:border-seafoam"
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-white/15 text-[10px]">
                {noteText.length > 0 ? `${noteText.split(/\s+/).length} words` : ""}
              </span>
              <button
                type="button" onClick={listening ? stopListening : startListening}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium cursor-pointer border-none transition-all ${
                  listening ? "bg-coral text-white animate-pulse" : "bg-white/[0.06] text-white/40 hover:bg-white/[0.1] hover:text-white/70"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
                {listening ? "Stop" : "Voice"}
              </button>
            </div>
          </div>

          {/* Metrics */}
          {(entryType === "Session note" || entryType === "Personal best" || entryType === "BOLT score" || entryType === "Goal") && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">
                  {entryType === "Goal" ? "Target depth" : "Depth"}
                </label>
                <input
                  type="text" value={depth} onChange={(e) => setDepth(e.target.value)}
                  placeholder="e.g. 15m"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                />
              </div>
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">
                  {entryType === "Goal" ? "Target time" : "Time"}
                </label>
                <input
                  type="text" value={time} onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 2:30"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                />
              </div>
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">
                  {entryType === "Goal" ? "Target BOLT" : "BOLT"}
                </label>
                <input
                  type="text" value={bolt} onChange={(e) => setBolt(e.target.value)}
                  placeholder="e.g. 25s"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                />
              </div>
            </div>
          )}

          <button
            onClick={saveEntry} disabled={saving || !noteText.trim()}
            className="w-full py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : saved ? "Saved \u2713" : "Save Entry"}
          </button>
        </div>

        {/* Log entries */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase">Training Log</div>
            <div className="text-white/15 text-[10px]">{logs.length} entries</div>
          </div>

          {loading && <p className="text-white/20 text-sm text-center py-8">Loading...</p>}
          {!loading && logs.length === 0 && (
            <p className="text-white/20 text-sm text-center py-8">No entries yet. Add your first note above.</p>
          )}

          <div className="space-y-3">
            {logs.map((entry, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      entry.author === "Coach" ? "bg-seafoam/15 text-seafoam" : "bg-sand/15 text-sand"
                    }`}>
                      {entry.author}
                    </span>
                    <span className="text-white/20 text-[10px] uppercase tracking-wider">{entry.type}</span>
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
                  <p className="text-white/60 text-sm leading-relaxed">{entry.note}</p>
                )}

                {(entry.depth || entry.time || entry.bolt) && editingIndex !== i && (
                  <div className="flex gap-4 mt-2 pt-2 border-t border-white/[0.04]">
                    {entry.depth && <span className="text-white/30 text-xs">Depth: <strong className="text-white/50">{entry.depth}</strong></span>}
                    {entry.time && <span className="text-white/30 text-xs">Time: <strong className="text-white/50">{entry.time}</strong></span>}
                    {entry.bolt && <span className="text-white/30 text-xs">BOLT: <strong className="text-white/50">{entry.bolt}</strong></span>}
                  </div>
                )}
              </div>
            ))}
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
