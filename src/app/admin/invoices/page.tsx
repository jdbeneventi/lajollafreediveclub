"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const SECRET = "ljfc";

interface Booking {
  id: string;
  email: string;
  course: string;
  course_dates: string | null;
  status: string;
  payment_status: string;
  payment_amount: number | null;
  deposit_paid: number | null;
  created_at: string;
  notes: string | null;
}

const PRESET_COURSES = [
  "AIDA 1 — Discover Freediving",
  "AIDA 2 Certification (Group)",
  "AIDA 2 Certification (Private)",
  "AIDA 3 — Advanced (Group)",
  "AIDA 3 — Advanced (Private)",
  "Private Coaching Session",
  "Camp Garibaldi — 3 Day",
  "Camp Garibaldi — 5 Day",
  "Custom",
];

export default function InvoicesPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"create" | "history">("create");

  // Create form
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [customCourse, setCustomCourse] = useState("");
  const [courseDates, setCourseDates] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string; url?: string } | null>(null);

  // History
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch(`/api/invoice?secret=${SECRET}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {}
    setLoadingBookings(false);
  }, []);

  useEffect(() => {
    if (authed && tab === "history") fetchBookings();
  }, [authed, tab, fetchBookings]);

  const courseName = course === "Custom" ? customCourse : course;
  const total = parseInt(totalAmount) || 0;
  const deposit = parseInt(depositAmount) || 0;
  const chargeAmount = deposit && deposit < total ? deposit : total;

  const handleCreate = async () => {
    if (!studentEmail || !courseName || !total) {
      setResult({ type: "error", message: "Email, course, and amount required." });
      return;
    }
    setSending(true);
    setResult(null);

    try {
      const res = await fetch(`/api/invoice?secret=${SECRET}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          studentEmail,
          studentName,
          course: courseName,
          courseDates,
          amount: total,
          depositAmount: deposit || null,
          notes,
          sendEmail,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          type: "success",
          message: sendEmail
            ? `Invoice sent to ${studentEmail}!`
            : "Payment link created (not emailed).",
          url: data.paymentUrl,
        });
        // Reset form
        setStudentEmail("");
        setStudentName("");
        setCourse("");
        setCustomCourse("");
        setCourseDates("");
        setTotalAmount("");
        setDepositAmount("");
        setNotes("");
      } else {
        setResult({ type: "error", message: data.error || "Failed to create invoice." });
      }
    } catch {
      setResult({ type: "error", message: "Network error." });
    }
    setSending(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-4">
        <form onSubmit={(e) => { e.preventDefault(); if (password === SECRET) setAuthed(true); }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-2">Admin</div>
            <h1 className="text-2xl font-serif text-salt">Invoices &amp; Payments</h1>
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter secret" className="w-full px-4 py-3 bg-ocean/50 border border-teal/20 rounded-lg text-salt placeholder:text-salt/30 focus:outline-none focus:border-teal/50 mb-4" />
          <button type="submit" className="w-full py-3 bg-teal text-salt font-semibold rounded-lg hover:bg-teal/80 transition-colors">Authenticate</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">Admin</div>
            <h1 className="text-2xl font-serif text-salt">Invoices</h1>
          </div>
          <Link href="/admin" className="text-teal text-xs no-underline hover:text-salt">← Admin</Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-ocean/30 rounded-xl p-1 mb-6">
          <button onClick={() => setTab("create")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none transition-colors ${tab === "create" ? "bg-teal text-deep" : "text-salt/50 hover:text-salt"}`}>
            Create Invoice
          </button>
          <button onClick={() => setTab("history")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none transition-colors ${tab === "history" ? "bg-teal text-deep" : "text-salt/50 hover:text-salt"}`}>
            Payment History ({bookings.length})
          </button>
        </div>

        {/* CREATE TAB */}
        {tab === "create" && (
          <div className="bg-ocean/30 border border-teal/15 rounded-2xl p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-salt/50 block mb-1">Student email *</label>
                <input value={studentEmail} onChange={e => setStudentEmail(e.target.value)} type="email" placeholder="student@email.com" className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" />
              </div>
              <div>
                <label className="text-xs text-salt/50 block mb-1">Student name</label>
                <input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="First Last" className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" />
              </div>
            </div>

            <div>
              <label className="text-xs text-salt/50 block mb-1">Course *</label>
              <select value={course} onChange={e => setCourse(e.target.value)} className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40">
                <option value="">Select course...</option>
                {PRESET_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {course === "Custom" && (
                <input value={customCourse} onChange={e => setCustomCourse(e.target.value)} placeholder="Custom course name" className="w-full mt-2 px-4 py-3 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" />
              )}
            </div>

            <div>
              <label className="text-xs text-salt/50 block mb-1">Dates</label>
              <input value={courseDates} onChange={e => setCourseDates(e.target.value)} placeholder="e.g. May 29-31" className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-salt/50 block mb-1">Total price ($) *</label>
                <input value={totalAmount} onChange={e => setTotalAmount(e.target.value)} type="number" placeholder="800" className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" />
              </div>
              <div>
                <label className="text-xs text-salt/50 block mb-1">Deposit amount ($)</label>
                <input value={depositAmount} onChange={e => setDepositAmount(e.target.value)} type="number" placeholder="Leave blank for full" className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" />
              </div>
            </div>

            <div>
              <label className="text-xs text-salt/50 block mb-1">Note to student (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="e.g. Looking forward to working with you! We'll finalize dates once others join." className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 resize-none placeholder:text-salt/25" />
            </div>

            {/* Preview */}
            {total > 0 && courseName && (
              <div className="bg-ocean/40 rounded-xl p-4">
                <div className="text-[10px] text-salt/30 uppercase tracking-wider mb-2">Invoice Preview</div>
                <div className="text-salt text-sm font-medium">{courseName}</div>
                <div className="text-salt/50 text-xs mt-1">
                  {studentName || studentEmail} · {courseDates || "Dates TBD"}
                </div>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-salt/50">Total: <strong className="text-salt">${total}</strong></span>
                  {deposit > 0 && deposit < total && (
                    <>
                      <span className="text-seafoam">Charging: <strong>${deposit}</strong> (deposit)</span>
                      <span className="text-coral/70">Balance: ${total - deposit}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} className="w-4 h-4 accent-teal" />
                <span className="text-salt/60 text-xs">Email invoice to student</span>
              </label>
            </div>

            <button onClick={handleCreate} disabled={sending} className="w-full py-3.5 bg-coral text-white font-semibold rounded-lg cursor-pointer border-none hover:bg-coral/80 transition-colors disabled:opacity-50">
              {sending ? "Creating..." : `Send Invoice — $${chargeAmount}`}
            </button>

            {result && (
              <div className={`rounded-xl p-4 text-sm ${result.type === "success" ? "bg-seafoam/15 border border-seafoam/30 text-seafoam" : "bg-coral/15 border border-coral/30 text-coral"}`}>
                {result.message}
                {result.url && (
                  <div className="mt-2">
                    <button onClick={() => { navigator.clipboard.writeText(result.url!); }} className="text-xs underline cursor-pointer bg-transparent border-none text-seafoam">
                      Copy payment link
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <div>
            {loadingBookings ? (
              <div className="text-salt/40 text-sm text-center py-12">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="text-salt/30 text-sm text-center py-12">No bookings yet.</div>
            ) : (
              <div className="space-y-2">
                {bookings.map(b => (
                  <div key={b.id} className="flex items-center justify-between bg-ocean/20 rounded-lg px-4 py-3">
                    <div>
                      <div className="text-salt text-sm font-medium">{b.course}</div>
                      <div className="text-salt/30 text-xs">{b.email}{b.course_dates ? ` · ${b.course_dates}` : ""}</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      {b.payment_amount && <span className="text-salt/40 text-xs">${b.payment_amount}</span>}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        b.payment_status === "paid" ? "bg-seafoam/15 text-seafoam" :
                        b.payment_status === "deposit" ? "bg-sun/15 text-sun" :
                        b.payment_status === "pending" ? "bg-ocean/30 text-salt/50" :
                        "bg-coral/15 text-coral"
                      }`}>
                        {b.payment_status}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        b.status === "confirmed" ? "bg-seafoam/15 text-seafoam" :
                        b.status === "invoice_sent" ? "bg-teal/15 text-teal" :
                        "bg-ocean/30 text-salt/50"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center mt-4">
              <button onClick={fetchBookings} className="text-salt/30 text-xs cursor-pointer bg-transparent border-none hover:text-salt">Refresh</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
