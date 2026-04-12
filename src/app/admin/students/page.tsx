"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CERTIFICATIONS,
  CERT_ORDER,
  getProgressPercent,
  getCategoryProgress,
  type CertLevel,
  type Requirement,
} from "@/lib/certifications";

const SECRET = "ljfc";

interface Student {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  last_login: string | null;
}

interface ProgressRecord {
  student_id: string;
  requirement_id: string;
  cert_level: string;
  completed_at: string;
  completed_by: string | null;
}

interface CertRecord {
  student_id: string;
  cert_level: string;
  certified_at: string;
  aida_card_number: string | null;
}

interface FormRecord { email: string; form_type: string; signed_at: string }
interface WaiverRecord { email: string; waiver_signed: boolean }
interface BookingRecord { email: string; course: string; payment_status: string; status: string }

interface AllData {
  students: Student[];
  progress: ProgressRecord[];
  certs: CertRecord[];
  aidaForms: FormRecord[];
  waiverMembers: WaiverRecord[];
  bookings: BookingRecord[];
}

const CATEGORIES: { key: Requirement["category"]; label: string; icon: string }[] = [
  { key: "form", label: "Forms", icon: "📋" },
  { key: "prep", label: "Prep", icon: "📖" },
  { key: "theory", label: "Theory", icon: "🧠" },
  { key: "pool", label: "Pool", icon: "🏊" },
  { key: "openwater", label: "Open Water", icon: "🌊" },
];

function StudentsContent() {
  const params = useSearchParams();
  const key = params.get("key");
  const [data, setData] = useState<AllData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [certGranting, setCertGranting] = useState<{ studentId: string; level: CertLevel } | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/admin/students?key=${key}`);
    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
  }, [key]);

  useEffect(() => {
    if (key === SECRET) fetchData();
    else setLoading(false);
  }, [key, fetchData]);

  const apiCall = async (body: Record<string, unknown>) => {
    setSaving(true);
    await fetch(`/api/admin/students?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await fetchData();
    setSaving(false);
  };

  if (key !== SECRET) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center">
        <p className="text-white/30 text-sm">
          Unauthorized. <Link href="/admin" className="text-seafoam no-underline">← Admin</Link>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center">
        <p className="text-white/30 text-sm">Loading students...</p>
      </div>
    );
  }

  if (!data) return null;

  const getStudentProgress = (studentId: string) =>
    data.progress.filter((p) => p.student_id === studentId).map((p) => p.requirement_id);

  const getStudentCerts = (studentId: string) =>
    data.certs.filter((c) => c.student_id === studentId);

  const getHighestCert = (studentId: string): CertLevel | null => {
    const certs = getStudentCerts(studentId);
    for (let i = CERT_ORDER.length - 1; i >= 0; i--) {
      if (certs.some((c) => c.cert_level === CERT_ORDER[i])) return CERT_ORDER[i];
    }
    return null;
  };

  const getStudentFormStatus = (email: string) => {
    const hasWaiver = data.waiverMembers.some((w) => w.email === email && w.waiver_signed);
    const hasMedical = data.aidaForms.some((f) => f.email === email && f.form_type === "medical_statement");
    const hasLiability = data.aidaForms.some((f) => f.email === email && f.form_type === "liability_release");
    return { hasWaiver, hasMedical, hasLiability };
  };

  const buildCompleted = (studentId: string, email: string) => {
    const progIds = getStudentProgress(studentId);
    const forms = getStudentFormStatus(email);
    const all = [...progIds];
    if (forms.hasWaiver) CERT_ORDER.forEach((l) => all.push(`${l.replace("aida", "a")}-waiver`));
    if (forms.hasMedical) CERT_ORDER.forEach((l) => all.push(`${l.replace("aida", "a")}-medical`));
    if (forms.hasLiability) CERT_ORDER.forEach((l) => all.push(`${l.replace("aida", "a")}-liability`));
    return Array.from(new Set(all));
  };

  const selectedStudent = data.students.find((s) => s.id === selected);
  const studentBookings = selected ? data.bookings.filter((b) => b.email === selectedStudent?.email) : [];

  return (
    <div className="min-h-screen bg-deep">
      <div className="max-w-[1000px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href={`/admin?key=${SECRET}`} className="text-seafoam/50 text-xs no-underline hover:text-seafoam">← Admin</Link>
            <h1 className="font-serif text-2xl text-white mt-1">Students & Progress</h1>
            <p className="text-white/30 text-xs mt-1">{data.students.length} students</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-lg bg-seafoam text-deep text-sm font-semibold border-none cursor-pointer hover:bg-seafoam/80 transition-colors">
            + Add Student
          </button>
        </div>

        {/* Add student inline form */}
        {showAdd && (
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 mb-6">
            <h3 className="text-white text-sm font-semibold mb-3">Add New Student</h3>
            <div className="flex gap-3 flex-wrap">
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email (required)"
                className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam placeholder:text-white/20" />
              <input type="text" value={newFirst} onChange={(e) => setNewFirst(e.target.value)}
                placeholder="First name"
                className="w-[140px] px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam placeholder:text-white/20" />
              <input type="text" value={newLast} onChange={(e) => setNewLast(e.target.value)}
                placeholder="Last name"
                className="w-[140px] px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam placeholder:text-white/20" />
            </div>
            <div className="flex gap-3 mt-3">
              <button onClick={async () => {
                if (!newEmail) return;
                await apiCall({ action: "add_student", email: newEmail, firstName: newFirst, lastName: newLast });
                setNewEmail(""); setNewFirst(""); setNewLast(""); setShowAdd(false);
              }} disabled={saving || !newEmail}
                className="px-5 py-2 rounded-lg bg-seafoam text-deep text-sm font-semibold border-none cursor-pointer disabled:opacity-40">
                {saving ? "Adding..." : "Add Student"}
              </button>
              <button onClick={() => setShowAdd(false)}
                className="px-5 py-2 rounded-lg bg-transparent border border-white/10 text-white/50 text-sm cursor-pointer">
                Cancel
              </button>
            </div>
            <p className="text-white/20 text-[10px] mt-2">This creates their account so they can log in via the portal with a magic link.</p>
          </div>
        )}

        <div className="flex gap-6">
          {/* Student list */}
          <div className="w-[320px] shrink-0">
            <div className="space-y-1.5 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
              {data.students.map((s) => {
                const highest = getHighestCert(s.id);
                const completed = buildCompleted(s.id, s.email);
                const workingOn = highest
                  ? (CERT_ORDER[CERT_ORDER.indexOf(highest) + 1] as CertLevel | undefined) ?? null
                  : "aida2" as CertLevel;
                const pct = workingOn ? getProgressPercent(completed, workingOn) : 100;
                const name = [s.first_name, s.last_name].filter(Boolean).join(" ") || s.email.split("@")[0];

                return (
                  <button key={s.id} onClick={() => setSelected(s.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                      selected === s.id
                        ? "bg-white/[0.08] border-seafoam/30"
                        : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]"
                    }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white truncate">{name}</span>
                      {highest && (
                        <span className="text-[9px] font-bold text-seafoam bg-seafoam/15 px-1.5 py-0.5 rounded">
                          {CERTIFICATIONS[highest].name}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-white/30 truncate mb-1.5">{s.email}</div>
                    {workingOn && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-seafoam/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[9px] text-white/30">{pct}% → {CERTIFICATIONS[workingOn].name}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="flex-1 min-w-0">
            {!selectedStudent ? (
              <div className="flex items-center justify-center h-64 text-white/20 text-sm">
                Select a student to view progress
              </div>
            ) : (
              <StudentDetail
                student={selectedStudent}
                completed={buildCompleted(selectedStudent.id, selectedStudent.email)}
                certs={getStudentCerts(selectedStudent.id)}
                bookings={studentBookings}
                progressRecords={data.progress.filter((p) => p.student_id === selectedStudent.id)}
                saving={saving}
                onToggle={(reqId, certLevel, isCompleted) => {
                  apiCall({ action: "toggle_requirement", studentId: selectedStudent.id, requirementId: reqId, certLevel, completed: isCompleted });
                }}
                onGrantCert={() => setCertGranting({ studentId: selectedStudent.id, level: (getHighestCert(selectedStudent.id) ? CERT_ORDER[CERT_ORDER.indexOf(getHighestCert(selectedStudent.id)!) + 1] : "aida2") as CertLevel })}
                onRevokeCert={(level) => apiCall({ action: "revoke_cert", studentId: selectedStudent.id, certLevel: level })}
              />
            )}
          </div>
        </div>
      </div>

      {/* Grant cert modal */}
      {certGranting && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
          onClick={() => setCertGranting(null)}>
          <div className="bg-deep border border-white/10 rounded-2xl p-6 max-w-[380px] w-full"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-lg text-white mb-1">Grant Certification</h3>
            <p className="text-white/40 text-xs mb-4">
              {CERTIFICATIONS[certGranting.level]?.fullName || "Certification"}
            </p>
            <label className="block text-[10px] text-white/40 uppercase tracking-wide mb-1">AIDA Card Number (optional)</label>
            <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
              placeholder="e.g. AIDA-2026-12345"
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam mb-4 placeholder:text-white/20" />
            <div className="flex gap-3">
              <button onClick={() => setCertGranting(null)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 bg-transparent text-white/50 text-sm cursor-pointer">
                Cancel
              </button>
              <button onClick={async () => {
                await apiCall({ action: "grant_cert", studentId: certGranting.studentId, certLevel: certGranting.level, cardNumber: cardNumber || undefined });
                setCertGranting(null);
                setCardNumber("");
              }}
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg border-none bg-seafoam text-deep text-sm font-semibold cursor-pointer disabled:opacity-40">
                {saving ? "Saving..." : "Grant ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentDetail({
  student, completed, certs, bookings, progressRecords, saving,
  onToggle, onGrantCert, onRevokeCert,
}: {
  student: Student;
  completed: string[];
  certs: CertRecord[];
  bookings: BookingRecord[];
  progressRecords: ProgressRecord[];
  saving: boolean;
  onToggle: (reqId: string, certLevel: string, isCompleted: boolean) => void;
  onGrantCert: () => void;
  onRevokeCert: (level: string) => void;
}) {
  const name = [student.first_name, student.last_name].filter(Boolean).join(" ") || student.email.split("@")[0];
  const highest = certs.length > 0
    ? CERT_ORDER.filter((l) => certs.some((c) => c.cert_level === l)).pop() as CertLevel | undefined ?? null
    : null;
  const workingOn = highest
    ? (CERT_ORDER[CERT_ORDER.indexOf(highest) + 1] as CertLevel | undefined) ?? null
    : "aida2" as CertLevel;

  // Which cert level to show requirements for
  const [viewLevel, setViewLevel] = useState<CertLevel>(workingOn || highest || "aida2");

  const cert = CERTIFICATIONS[viewLevel];
  const pct = getProgressPercent(completed, viewLevel);

  return (
    <div className="space-y-4">
      {/* Student header */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-serif text-xl text-white">{name}</h2>
            <p className="text-white/30 text-xs">{student.email}</p>
            {student.last_login && (
              <p className="text-white/20 text-[10px] mt-1">
                Last login: {new Date(student.last_login).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-seafoam">{pct}%</div>
            <div className="text-[10px] text-white/30">{cert.name} progress</div>
          </div>
        </div>

        {/* Cert badges */}
        <div className="flex gap-2 flex-wrap">
          {CERT_ORDER.map((level) => {
            const held = certs.some((c) => c.cert_level === level);
            const isWorking = level === workingOn;
            return (
              <div key={level} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 ${
                held ? "bg-seafoam/15 text-seafoam" :
                isWorking ? "bg-white/[0.06] text-white/60 border border-seafoam/20" :
                "bg-white/[0.03] text-white/20"
              }`}>
                {held && <span>✓</span>}
                {CERTIFICATIONS[level].name}
                {held && (
                  <button onClick={() => onRevokeCert(level)}
                    className="ml-1 text-[9px] text-coral/60 hover:text-coral bg-transparent border-none cursor-pointer"
                    title="Revoke">×</button>
                )}
              </div>
            );
          })}
        </div>

        {/* Bookings */}
        {bookings.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/[0.06]">
            <div className="text-[10px] text-white/30 uppercase tracking-wide mb-1.5">Bookings</div>
            {bookings.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="text-white/60">{b.course}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                  b.payment_status === "paid" ? "bg-seafoam/15 text-seafoam" :
                  b.payment_status === "deposit" ? "bg-sun/15 text-sun" :
                  "bg-coral/15 text-coral"
                }`}>{b.payment_status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Grant cert button */}
        {workingOn && pct >= 80 && (
          <button onClick={onGrantCert}
            className="mt-3 w-full py-2.5 rounded-lg bg-seafoam text-deep text-sm font-semibold border-none cursor-pointer hover:bg-seafoam/80 transition-colors">
            Grant {CERTIFICATIONS[workingOn].name} Certification
          </button>
        )}
      </div>

      {/* Level selector */}
      <div className="flex gap-1.5">
        {CERT_ORDER.map((level) => (
          <button key={level} onClick={() => setViewLevel(level)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-colors ${
              viewLevel === level ? "bg-seafoam text-deep" : "bg-white/[0.06] text-white/40 hover:text-white/60"
            }`}>
            {CERTIFICATIONS[level].name}
          </button>
        ))}
      </div>

      {/* Requirements by category */}
      {CATEGORIES.map((cat) => {
        const reqs = cert.requirements.filter((r) => r.category === cat.key);
        if (reqs.length === 0) return null;
        const { done, total } = getCategoryProgress(completed, viewLevel, cat.key);
        const isFormCategory = cat.key === "form";

        return (
          <div key={cat.key} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span className="text-sm font-semibold text-white">{cat.label}</span>
              </div>
              <span className={`text-[11px] font-semibold ${done === total ? "text-seafoam" : "text-white/30"}`}>
                {done}/{total}
              </span>
            </div>
            <div className="space-y-1">
              {reqs.map((req) => {
                const isComplete = completed.includes(req.id);
                const record = progressRecords.find((p) => p.requirement_id === req.id);

                return (
                  <div key={req.id} className="flex items-center gap-3 py-1.5 group">
                    <button
                      onClick={() => !isFormCategory && !saving && onToggle(req.id, viewLevel, isComplete)}
                      disabled={isFormCategory || saving}
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors ${
                        isComplete
                          ? "bg-seafoam border-seafoam text-deep"
                          : isFormCategory
                          ? "border-white/10 bg-transparent cursor-not-allowed"
                          : "border-white/20 bg-transparent hover:border-seafoam/50 cursor-pointer"
                      }`}>
                      {isComplete && <span className="text-[10px] font-bold">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs ${isComplete ? "text-white/70" : "text-white/40"}`}>{req.label}</span>
                      {isFormCategory && isComplete && (
                        <span className="text-[9px] text-seafoam/40 ml-2">via portal</span>
                      )}
                    </div>
                    {record?.completed_by && (
                      <span className="text-[9px] text-white/20">
                        {record.completed_by === "instructor" ? "✍️" : record.completed_by === "student" ? "👤" : "⚙️"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminStudentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep" />}>
      <StudentsContent />
    </Suspense>
  );
}
