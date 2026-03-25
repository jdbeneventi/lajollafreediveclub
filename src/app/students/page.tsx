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

export default function StudentPortal() {
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [role, setRole] = useState<"coach" | "student">("coach");
  const [studentName, setStudentName] = useState("");
  const [activeStudent, setActiveStudent] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
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
        setLogs(data.reverse()); // newest first
      }
    } catch {
      // silent
    }
    setLoading(false);
  }, []);

  const fetchAllStudents = useCallback(async () => {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      if (Array.isArray(data)) {
        const nameSet = new Set<string>();
        data.forEach((d: LogEntry) => { if (d.student) nameSet.add(d.student); });
        const names = Array.from(nameSet);
        setAllStudents(names as string[]);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (authenticated && role === "coach") {
      fetchAllStudents();
    }
  }, [authenticated, role, fetchAllStudents]);

  useEffect(() => {
    if (activeStudent) {
      fetchLogs(activeStudent);
    }
  }, [activeStudent, fetchLogs]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.toLowerCase().trim() === "ljfc") {
      setAuthenticated(true);
      if (role === "student" && studentName.trim()) {
        setActiveStudent(studentName.trim());
      }
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

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  const saveEntry = async () => {
    if (!noteText.trim() || !activeStudent) return;
    setSaving(true);
    setSaved(false);

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "short",
      day: "numeric",
    }) + ", " + now.toLocaleTimeString("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      minute: "2-digit",
    });

    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: activeStudent,
          date: dateStr,
          author: role === "coach" ? "Coach" : activeStudent,
          type: entryType,
          note: noteText.trim(),
          depth: depth || "",
          time: time || "",
          bolt: bolt || "",
        }),
      });

      setSaved(true);
      setNoteText("");
      setDepth("");
      setTime("");
      setBolt("");
      setTimeout(() => setSaved(false), 3000);
      fetchLogs(activeStudent);
    } catch {
      alert("Failed to save. Try again.");
    }
    setSaving(false);
  };

  // ─── Auth screen ───
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <form onSubmit={handleAuth} className="max-w-[360px] w-full">
          <div className="text-center mb-8">
            <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-3">
              LJFC
            </div>
            <h1 className="font-serif text-3xl text-white mb-2">Student Portal</h1>
            <p className="text-white/30 text-sm">Track progress, log sessions, review notes.</p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole("coach")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                role === "coach"
                  ? "bg-seafoam/15 border-seafoam/30 text-seafoam"
                  : "bg-transparent border-white/10 text-white/40"
              }`}
            >
              Coach
            </button>
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                role === "student"
                  ? "bg-seafoam/15 border-seafoam/30 text-seafoam"
                  : "bg-transparent border-white/10 text-white/40"
              }`}
            >
              Student
            </button>
          </div>

          {role === "student" && (
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-5 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/20 mb-4"
            />
          )}

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            className="w-full px-5 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/20 text-center tracking-widest mb-4"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all"
          >
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
            <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-2">
              Coach View
            </div>
            <h1 className="font-serif text-2xl text-white">Students</h1>
          </div>

          {/* Add new student */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="New student name..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && studentName.trim()) {
                  setActiveStudent(studentName.trim());
                }
              }}
            />
            <button
              onClick={() => {
                if (studentName.trim()) setActiveStudent(studentName.trim());
              }}
              className="px-5 py-3 rounded-xl bg-seafoam/20 text-seafoam text-sm font-medium cursor-pointer border-none hover:bg-seafoam/30 transition-colors"
            >
              Open
            </button>
          </div>

          {/* Student list */}
          <div className="space-y-2">
            {allStudents.length === 0 && (
              <p className="text-white/20 text-sm text-center py-8">
                No students yet. Type a name above to create the first profile.
              </p>
            )}
            {allStudents.map((name) => (
              <button
                key={name}
                onClick={() => setActiveStudent(name)}
                className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.04] border border-white/[0.06] rounded-xl text-left hover:bg-white/[0.07] transition-colors cursor-pointer"
              >
                <span className="text-white/80 text-sm font-medium">{name}</span>
                <span className="text-white/20 text-xs">&rarr;</span>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/saturday" className="text-white/20 text-xs no-underline hover:text-white/40">
              Saturday Admin &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Student profile ───
  return (
    <div className="min-h-screen bg-deep px-6 py-8">
      <div className="max-w-[600px] mx-auto">
        {/* Header */}
        <div className="pt-20 mb-8">
          <button
            onClick={() => {
              setActiveStudent("");
              setLogs([]);
            }}
            className="text-white/30 text-xs mb-4 bg-transparent border-none cursor-pointer hover:text-white/50"
          >
            &larr; {role === "coach" ? "All students" : "Back"}
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-1">
                {role === "coach" ? "Student Profile" : "My Progress"}
              </div>
              <h1 className="font-serif text-2xl text-white">{activeStudent}</h1>
            </div>
            <div className="text-right">
              <div className="text-white/20 text-xs">{logs.length} entries</div>
            </div>
          </div>
        </div>

        {/* New entry */}
        <div className="bg-ocean/30 border border-teal/15 rounded-2xl p-5 mb-6">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">
            New Entry
          </div>

          {/* Entry type */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {["Session note", "BOLT score", "Personal best", "Goal", "General"].map((t) => (
              <button
                key={t}
                onClick={() => setEntryType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  entryType === t
                    ? "bg-seafoam/15 border-seafoam/30 text-seafoam"
                    : "bg-transparent border-white/10 text-white/30 hover:text-white/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Voice + text input */}
          <div className="relative mb-4">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={listening ? "Listening..." : "Type or tap the mic to speak..."}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white text-sm outline-none transition-colors placeholder:text-white/20 resize-none ${
                listening ? "border-coral/50 bg-coral/[0.06]" : "border-white/10 focus:border-seafoam"
              }`}
            />
            <button
              type="button"
              onClick={listening ? stopListening : startListening}
              className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-none transition-all ${
                listening
                  ? "bg-coral text-white animate-pulse"
                  : "bg-white/[0.06] text-white/40 hover:bg-white/[0.1] hover:text-white/70"
              }`}
              title={listening ? "Stop recording" : "Start voice note"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          </div>

          {/* Optional metrics */}
          {(entryType === "Session note" || entryType === "Personal best" || entryType === "BOLT score") && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Depth</label>
                <input
                  type="text"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  placeholder="e.g. 15m"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                />
              </div>
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">Time</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 2:30"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                />
              </div>
              <div>
                <label className="text-white/25 text-[10px] uppercase tracking-wider block mb-1">BOLT</label>
                <input
                  type="text"
                  value={bolt}
                  onChange={(e) => setBolt(e.target.value)}
                  placeholder="e.g. 25s"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-seafoam transition-colors placeholder:text-white/15"
                />
              </div>
            </div>
          )}

          <button
            onClick={saveEntry}
            disabled={saving || !noteText.trim()}
            className="w-full py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Entry"}
          </button>
        </div>

        {/* Log entries */}
        <div className="mb-8">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">
            Training Log
          </div>

          {loading && (
            <p className="text-white/20 text-sm text-center py-8">Loading...</p>
          )}

          {!loading && logs.length === 0 && (
            <p className="text-white/20 text-sm text-center py-8">
              No entries yet. Add your first note above.
            </p>
          )}

          <div className="space-y-3">
            {logs.map((entry, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      entry.author === "Coach"
                        ? "bg-seafoam/15 text-seafoam"
                        : "bg-sand/15 text-sand"
                    }`}>
                      {entry.author}
                    </span>
                    <span className="text-white/20 text-[10px] uppercase tracking-wider">
                      {entry.type}
                    </span>
                  </div>
                  <span className="text-white/15 text-[10px]">{entry.date}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{entry.note}</p>
                {(entry.depth || entry.time || entry.bolt) && (
                  <div className="flex gap-4 mt-2 pt-2 border-t border-white/[0.04]">
                    {entry.depth && (
                      <span className="text-white/30 text-xs">Depth: <strong className="text-white/50">{entry.depth}</strong></span>
                    )}
                    {entry.time && (
                      <span className="text-white/30 text-xs">Time: <strong className="text-white/50">{entry.time}</strong></span>
                    )}
                    {entry.bolt && (
                      <span className="text-white/30 text-xs">BOLT: <strong className="text-white/50">{entry.bolt}</strong></span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
