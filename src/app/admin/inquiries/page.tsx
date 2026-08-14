"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { buildConflictReport, type InquiryLite, type CalendarEventLite } from "@/lib/inquiryConflicts";
import CalendarPanel from "./CalendarPanel";
import { adminLogin, adminSession } from "@/lib/adminLogin";

// Session lives in an httpOnly cookie set by /api/admin/login.
// Kept empty so the inter-page ?key= links below carry no secret.
const SECRET = "";

// ─── Types ────────────────────────────────────────────────────────────────

type InquiryStatus =
  | "new"
  | "replied"
  | "quoted"
  | "deposit_sent"
  | "paid"
  | "onboarded"
  | "completed"
  | "declined"
  | "expired";

interface Booking {
  id: string;
  email: string;
  course: string;
  course_dates: string | null;
  status: string | null;
  payment_status: string | null;
  payment_amount: number | null;
  deposit_paid: number | null;
  created_at: string;
}

interface Inquiry {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  course: string;
  experience: string | null;
  preferred_dates: string | null;
  group_size: string | null;
  message: string | null;
  status: InquiryStatus;
  status_updated_at: string;
  replied_at: string | null;
  admin_notes: string | null;
  parsed_start_date: string | null;
  parsed_end_date: string | null;
  linked_booking_id: string | null;
  archived: boolean;
  // Enrichment
  bookings: Booking[];
  latest_booking: Booking | null;
  has_paid: boolean;
  onboarding_completed_at: string | null;
  onboarding_updated_at: string | null;
}

// ─── Status meta ──────────────────────────────────────────────────────────

const STATUSES: { value: InquiryStatus; label: string; color: string; description: string }[] = [
  { value: "new", label: "New", color: "bg-coral/15 text-coral border-coral/30", description: "Awaiting reply" },
  { value: "replied", label: "Replied", color: "bg-sun/15 text-sun border-sun/30", description: "Waiting on student" },
  { value: "quoted", label: "Quoted", color: "bg-teal/15 text-teal border-teal/30", description: "Dates + price proposed" },
  { value: "deposit_sent", label: "Deposit sent", color: "bg-seafoam/15 text-seafoam border-seafoam/30", description: "Stripe link out" },
  { value: "paid", label: "Paid", color: "bg-seafoam/25 text-seafoam border-seafoam/50", description: "Deposit received" },
  { value: "onboarded", label: "Onboarded", color: "bg-teal/25 text-teal border-teal/50", description: "Portal onboarding complete" },
  { value: "completed", label: "Completed", color: "bg-ocean/30 text-salt/70 border-salt/20", description: "Course delivered" },
  { value: "declined", label: "Declined", color: "bg-salt/10 text-salt/40 border-salt/15", description: "Not moving forward" },
  { value: "expired", label: "Expired", color: "bg-salt/10 text-salt/40 border-salt/15", description: "Stale, no response" },
];

const STATUS_BY_VALUE = Object.fromEntries(STATUSES.map((s) => [s.value, s]));

// ─── Component ────────────────────────────────────────────────────────────

export default function InquiriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep flex items-center justify-center text-salt/40">Loading…</div>}>
      <InquiriesContent />
    </Suspense>
  );
}

function InquiriesContent() {
  const searchParams = useSearchParams();
  const keyParam = searchParams.get("key");
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [events, setEvents] = useState<CalendarEventLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | "all">("all");
  const [showArchived, setShowArchived] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [highlightIds, setHighlightIds] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ first_name: "", last_name: "", email: "", phone: "", course: "", experience: "", preferred_dates: "", group_size: "", message: "", admin_notes: "" });
  const [addSaving, setAddSaving] = useState(false);

  useEffect(() => {
    adminSession().then((ok) => { if (ok) setAuthed(true); });
  }, [keyParam]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem("ljfc-inquiries-walkthrough-seen");
    if (!seen) setShowWalkthrough(true);
  }, []);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const archivedParam = showArchived ? "&archived=true" : "";
      const [inqRes, calRes] = await Promise.all([
        fetch(`/api/admin/inquiries?key=${SECRET}${archivedParam}`),
        fetch(`/api/calendar`),
      ]);
      if (inqRes.ok) {
        const data = await inqRes.json();
        setInquiries(data.inquiries || []);
      }
      if (calRes.ok) {
        const data = await calRes.json();
        setEvents(data.events || []);
      }
    } catch {}
    setLoading(false);
  }, [showArchived]);

  useEffect(() => {
    if (authed) fetchInquiries();
  }, [authed, fetchInquiries]);

  // Conflict report: recomputed whenever inquiries or events change.
  const conflictReport = useMemo(() => {
    const lite: InquiryLite[] = inquiries.map((i) => ({
      id: i.id,
      first_name: i.first_name,
      last_name: i.last_name,
      email: i.email,
      course: i.course,
      parsed_start_date: i.parsed_start_date,
      parsed_end_date: i.parsed_end_date,
      group_size: i.group_size,
      status: i.status,
    }));
    return buildConflictReport(lite, events, { minOverlapDays: 2 });
  }, [inquiries, events]);

  const dismissWalkthrough = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ljfc-inquiries-walkthrough-seen", "1");
    }
    setShowWalkthrough(false);
  };

  const addInquiry = async () => {
    if (!addForm.first_name || !addForm.email || !addForm.course) return;
    setAddSaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries?key=${SECRET}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        setAddForm({ first_name: "", last_name: "", email: "", phone: "", course: "", experience: "", preferred_dates: "", group_size: "", message: "", admin_notes: "" });
        setShowAddForm(false);
        fetchInquiries();
      }
    } catch {}
    setAddSaving(false);
  };

  const updateInquiry = async (id: string, updates: Partial<Inquiry>) => {
    const res = await fetch(`/api/admin/inquiries?key=${SECRET}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    if (res.ok) {
      const data = await res.json();
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, ...data.inquiry } : i)));
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (await adminLogin(password)) setAuthed(true);
          }}
          className="bg-ocean/30 border border-teal/15 rounded-2xl p-8 w-full max-w-sm"
        >
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-2">Admin</div>
          <h1 className="font-serif text-2xl text-salt mb-4">Inquiries Pipeline</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-ocean/50 border border-teal/20 text-salt placeholder:text-salt/30 focus:outline-none focus:border-teal/50 mb-3"
          />
          <button
            type="submit"
            className="w-full py-3 bg-seafoam text-deep font-semibold rounded-lg hover:bg-seafoam/80 transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Filter + counts
  const filtered = filterStatus === "all" ? inquiries : inquiries.filter((i) => i.status === filterStatus);
  const counts = STATUSES.reduce(
    (acc, s) => ({ ...acc, [s.value]: inquiries.filter((i) => i.status === s.value).length }),
    {} as Record<InquiryStatus, number>,
  );

  return (
    <div className="min-h-screen bg-deep">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <Link
            href={`/admin?key=${SECRET}`}
            className="text-[11px] text-seafoam/60 no-underline hover:text-seafoam tracking-[0.15em] uppercase"
          >
            ← Admin Hub
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCalendar((v) => !v)}
              className="text-[11px] text-seafoam/70 hover:text-seafoam uppercase tracking-[0.15em]"
            >
              {showCalendar ? "Hide calendar" : "Show calendar"}
            </button>
            <button
              onClick={fetchInquiries}
              disabled={loading}
              className="text-[11px] text-salt/40 hover:text-salt/70 uppercase tracking-[0.15em] disabled:opacity-50"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">Admin</div>
        <h1 className="font-serif text-3xl text-salt mb-2">Inquiries Pipeline</h1>
        <p className="text-salt/40 text-sm mb-6">
          Every inquiry lands here — from <code className="text-salt/60">/contact</code>, <code className="text-salt/60">/contact/courses</code>, and <code className="text-salt/60">/contact/camp</code>. Move each one through the
          workflow as you respond, quote, and onboard.
        </p>

        {/* Add inquiry button */}
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="mb-4 text-xs px-4 py-2 rounded-full bg-seafoam/15 text-seafoam border border-seafoam/30 hover:bg-seafoam/25 transition-colors"
        >
          {showAddForm ? "Cancel" : "+ Add inquiry manually"}
        </button>

        {/* Add inquiry form */}
        {showAddForm && (
          <div className="bg-ocean/30 border border-teal/20 rounded-2xl p-5 mb-6">
            <div className="text-[11px] text-seafoam/80 font-medium tracking-[0.2em] uppercase mb-3">
              Add inquiry manually
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <input placeholder="First name *" value={addForm.first_name} onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })} className="bg-deep/40 border border-teal/15 rounded-lg px-3 py-2 text-sm text-salt placeholder:text-salt/25 focus:outline-none focus:border-teal/40" />
              <input placeholder="Last name" value={addForm.last_name} onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })} className="bg-deep/40 border border-teal/15 rounded-lg px-3 py-2 text-sm text-salt placeholder:text-salt/25 focus:outline-none focus:border-teal/40" />
              <input placeholder="Email *" type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className="bg-deep/40 border border-teal/15 rounded-lg px-3 py-2 text-sm text-salt placeholder:text-salt/25 focus:outline-none focus:border-teal/40" />
              <input placeholder="Phone" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} className="bg-deep/40 border border-teal/15 rounded-lg px-3 py-2 text-sm text-salt placeholder:text-salt/25 focus:outline-none focus:border-teal/40" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <select value={addForm.course} onChange={(e) => setAddForm({ ...addForm, course: e.target.value })} className="bg-deep/40 border border-teal/15 rounded-lg px-3 py-2 text-sm text-salt focus:outline-none focus:border-teal/40">
                <option value="">Course *</option>
                <option value="AIDA 1">AIDA 1</option>
                <option value="AIDA 2 (Group)">AIDA 2 (Group)</option>
                <option value="AIDA 2 (Private)">AIDA 2 (Private)</option>
                <option value="AIDA 3 (Group)">AIDA 3 (Group)</option>
                <option value="AIDA 3 (Private)">AIDA 3 (Private)</option>
                <option value="Private Coaching">Private Coaching</option>
                <option value="Camp Garibaldi">Camp Garibaldi</option>
                <option value="Saturday Session">Saturday Session</option>
                <option value="General inquiry">General inquiry</option>
              </select>
              <input placeholder="Preferred dates" value={addForm.preferred_dates} onChange={(e) => setAddForm({ ...addForm, preferred_dates: e.target.value })} className="bg-deep/40 border border-teal/15 rounded-lg px-3 py-2 text-sm text-salt placeholder:text-salt/25 focus:outline-none focus:border-teal/40" />
              <input placeholder="Group size" value={addForm.group_size} onChange={(e) => setAddForm({ ...addForm, group_size: e.target.value })} className="bg-deep/40 border border-teal/15 rounded-lg px-3 py-2 text-sm text-salt placeholder:text-salt/25 focus:outline-none focus:border-teal/40" />
              <input placeholder="Experience" value={addForm.experience} onChange={(e) => setAddForm({ ...addForm, experience: e.target.value })} className="bg-deep/40 border border-teal/15 rounded-lg px-3 py-2 text-sm text-salt placeholder:text-salt/25 focus:outline-none focus:border-teal/40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <textarea placeholder="Message / context" value={addForm.message} onChange={(e) => setAddForm({ ...addForm, message: e.target.value })} rows={2} className="bg-deep/40 border border-teal/15 rounded-lg px-3 py-2 text-sm text-salt placeholder:text-salt/25 focus:outline-none focus:border-teal/40 resize-none" />
              <textarea placeholder="Admin notes" value={addForm.admin_notes} onChange={(e) => setAddForm({ ...addForm, admin_notes: e.target.value })} rows={2} className="bg-deep/40 border border-teal/15 rounded-lg px-3 py-2 text-sm text-salt placeholder:text-salt/25 focus:outline-none focus:border-teal/40 resize-none" />
            </div>
            <button
              onClick={addInquiry}
              disabled={addSaving || !addForm.first_name || !addForm.email || !addForm.course}
              className="text-xs px-5 py-2.5 rounded-full bg-seafoam text-deep font-semibold hover:bg-seafoam/80 transition-colors disabled:opacity-40"
            >
              {addSaving ? "Adding…" : "Add to pipeline"}
            </button>
          </div>
        )}

        {/* Walkthrough panel */}
        {showWalkthrough && (
          <div className="relative bg-ocean/40 border border-teal/30 rounded-2xl p-5 mb-6">
            <button
              onClick={dismissWalkthrough}
              className="absolute top-3 right-4 text-salt/40 hover:text-salt text-xs"
              aria-label="Dismiss"
            >
              ✕
            </button>
            <div className="text-[11px] text-seafoam/80 font-medium tracking-[0.2em] uppercase mb-3">
              How this pipeline works
            </div>
            <ol className="text-sm text-salt/70 space-y-2 list-decimal list-inside">
              <li>
                <span className="text-salt/90">New</span> — an inquiry arrives. Open the row, scan their experience and preferred dates.
              </li>
              <li>
                <span className="text-salt/90">Replied</span> — you&apos;ve sent a personal email. Move them here so you can see who&apos;s
                waiting on you.
              </li>
              <li>
                <span className="text-salt/90">Quoted</span> — they&apos;ve agreed on dates and price. Time to send an invoice.
              </li>
              <li>
                <span className="text-salt/90">Deposit sent</span> — Stripe checkout link is out. Use{" "}
                <Link href={`/admin/invoices?key=${SECRET}`} className="text-seafoam hover:underline">
                  /admin/invoices
                </Link>
                .
              </li>
              <li>
                <span className="text-salt/90">Paid</span> — deposit received. Send the onboarding magic link via{" "}
                <Link href={`/admin/send-links?key=${SECRET}`} className="text-seafoam hover:underline">
                  /admin/send-links
                </Link>
                .
              </li>
              <li>
                <span className="text-salt/90">Onboarded</span> — student has filled the 3-step portal flow (medical, gear, swim, etc.).
                You&apos;re ready for course day.
              </li>
              <li>
                <span className="text-salt/90">Completed</span> — course delivered, certification issued.
              </li>
            </ol>
            <div className="text-xs text-salt/40 mt-4">
              Coming soon: conflict detection (suggest groupings when date windows overlap), embedded calendar, and AI-drafted replies.
            </div>
          </div>
        )}

        {/* Calendar overlay (toggleable) */}
        {showCalendar && (
          <div className="mb-6">
            <CalendarPanel
              inquiries={inquiries.map((i) => ({
                id: i.id,
                first_name: i.first_name,
                last_name: i.last_name,
                email: i.email,
                course: i.course,
                parsed_start_date: i.parsed_start_date,
                parsed_end_date: i.parsed_end_date,
                group_size: i.group_size,
                status: i.status,
              }))}
              events={events}
            />
          </div>
        )}

        {/* Conflicts & Opportunities panel */}
        {(conflictReport.groupings.length > 0 ||
          conflictReport.overlaps.length > 0 ||
          conflictReport.calendarConflicts.length > 0) && (
          <div className="bg-gradient-to-br from-coral/10 to-sun/5 border border-coral/30 rounded-2xl p-5 mb-6">
            <div className="text-[11px] text-coral font-medium tracking-[0.2em] uppercase mb-3">
              Conflicts & opportunities
            </div>

            {/* Group suggestions */}
            {conflictReport.groupings.length > 0 && (
              <div className="mb-4">
                <div className="text-[11px] text-salt/50 font-medium uppercase tracking-wider mb-2">
                  Suggested groupings
                </div>
                <div className="space-y-2">
                  {conflictReport.groupings.map((g, idx) => {
                    const names = g.inquiries.map((i) => i.first_name).join(" + ");
                    const startStr = g.windowStart.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
                    const endStr = g.windowEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
                    const window = g.windowStart.getTime() === g.windowEnd.getTime() ? startStr : `${startStr} – ${endStr}`;
                    const ids = g.inquiries.map((i) => i.id);
                    return (
                      <div key={idx} className="flex items-center justify-between bg-deep/40 rounded-lg px-3 py-2.5">
                        <div className="text-sm text-salt/85">
                          <span className="text-salt font-medium">{names}</span>
                          <span className="text-salt/40"> · {window} · </span>
                          <span className="text-seafoam">{g.overlapDays} day{g.overlapDays === 1 ? "" : "s"} overlap</span>
                          <span className="text-salt/30 text-xs"> · {g.course}</span>
                        </div>
                        <button
                          onClick={() => setHighlightIds(ids)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-seafoam/15 text-seafoam border border-seafoam/30 hover:bg-seafoam/25 transition-colors"
                        >
                          Highlight these
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Overlapping pairs (only shown if no grouping already covers them) */}
            {conflictReport.overlaps.length > 0 && (
              <div className="mb-4">
                <div className="text-[11px] text-salt/50 font-medium uppercase tracking-wider mb-2">
                  Overlapping date windows
                </div>
                <div className="space-y-1">
                  {conflictReport.overlaps.slice(0, 5).map((o, idx) => {
                    const startStr = o.overlapStart.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
                    const endStr = o.overlapEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
                    const window = o.overlapStart.getTime() === o.overlapEnd.getTime() ? startStr : `${startStr} – ${endStr}`;
                    return (
                      <div key={idx} className="text-xs text-salt/70 flex items-center gap-2">
                        <span className={o.sameCourse ? "text-seafoam" : "text-salt/40"}>•</span>
                        <span className="text-salt/85">{o.a.first_name}</span>
                        <span className="text-salt/30">↔</span>
                        <span className="text-salt/85">{o.b.first_name}</span>
                        <span className="text-salt/40">— {window} ({o.overlapDays}d)</span>
                        {o.sameCourse && <span className="text-[10px] text-seafoam/70">same course</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Calendar conflicts */}
            {conflictReport.calendarConflicts.length > 0 && (
              <div>
                <div className="text-[11px] text-coral/80 font-medium uppercase tracking-wider mb-2">
                  Inquiry windows that hit scheduled events
                </div>
                <div className="space-y-1">
                  {conflictReport.calendarConflicts.slice(0, 5).map((c, idx) => (
                    <div key={idx} className="text-xs text-salt/70 flex items-center gap-2">
                      <span className="text-coral">⚠</span>
                      <span className="text-salt/85">{c.inquiry.first_name}</span>
                      <span className="text-salt/40">wants a window that overlaps</span>
                      <span className="text-salt/85">&quot;{c.event.title}&quot;</span>
                      <span className="text-salt/40">({c.overlapDays}d)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {highlightIds.length > 0 && (
              <button
                onClick={() => setHighlightIds([])}
                className="text-[10px] text-salt/40 hover:text-salt/70 mt-3 uppercase tracking-wider"
              >
                Clear highlight
              </button>
            )}
          </div>
        )}

        {/* Status filter chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filterStatus === "all"
                ? "bg-salt text-deep border-salt"
                : "bg-transparent text-salt/60 border-salt/20 hover:text-salt hover:border-salt/40"
            }`}
          >
            All <span className="opacity-60">({inquiries.length})</span>
          </button>
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filterStatus === s.value ? s.color : "bg-transparent text-salt/60 border-salt/20 hover:text-salt hover:border-salt/40"
              }`}
            >
              {s.label} <span className="opacity-60">({counts[s.value] || 0})</span>
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-xs text-salt/50 cursor-pointer">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded"
            />
            Include archived
          </label>
        </div>

        {/* Table */}
        <div className="bg-ocean/20 border border-teal/15 rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-salt/40 text-sm">
              {loading ? "Loading inquiries…" : "No inquiries match this filter."}
            </div>
          ) : (
            <div className="divide-y divide-teal/10">
              {filtered.map((inq) => (
                <InquiryRow
                  key={inq.id}
                  inquiry={inq}
                  expanded={expanded === inq.id}
                  highlighted={highlightIds.includes(inq.id)}
                  onToggle={() => setExpanded(expanded === inq.id ? null : inq.id)}
                  onUpdate={(updates) => updateInquiry(inq.id, updates)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footnote */}
        <div className="mt-6 text-[11px] text-salt/30 tracking-[0.1em] uppercase">
          {filtered.length} inquir{filtered.length === 1 ? "y" : "ies"} shown · pulled from <code>course_inquiries</code>
        </div>
      </div>
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────

function InquiryRow({
  inquiry,
  expanded,
  highlighted,
  onToggle,
  onUpdate,
}: {
  inquiry: Inquiry;
  expanded: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<Inquiry>) => void;
}) {
  const [notes, setNotes] = useState(inquiry.admin_notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "sent" | "error">("idle");
  const statusMeta = STATUS_BY_VALUE[inquiry.status];

  const generateDraft = async () => {
    setDrafting(true);
    setDraftError(null);
    try {
      const res = await fetch(`/api/admin/inquiries/reply?key=${SECRET}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "draft", id: inquiry.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setDraft({ subject: data.subject || "", body: data.body || "" });
      } else {
        setDraftError(data.error || "Failed to draft");
      }
    } catch (e) {
      setDraftError(e instanceof Error ? e.message : "Network error");
    }
    setDrafting(false);
  };

  const sendDraft = async () => {
    if (!draft) return;
    setSending(true);
    setSendStatus("idle");
    try {
      const res = await fetch(`/api/admin/inquiries/reply?key=${SECRET}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", id: inquiry.id, subject: draft.subject, body: draft.body }),
      });
      if (res.ok) {
        setSendStatus("sent");
        // Auto-flip status visually (server already did so via PATCH)
        onUpdate({ status: "replied" });
      } else {
        setSendStatus("error");
      }
    } catch {
      setSendStatus("error");
    }
    setSending(false);
  };

  const copyDraft = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
      setSendStatus("sent");
      setTimeout(() => setSendStatus("idle"), 1500);
    } catch {}
  };

  // Derived booking + onboarding chips
  const bookingChip = inquiry.latest_booking ? (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-seafoam/10 text-seafoam border border-seafoam/30">
      {inquiry.latest_booking.payment_status || "pending"} · ${inquiry.latest_booking.deposit_paid || inquiry.latest_booking.payment_amount}
    </span>
  ) : null;

  const onboardingChip = inquiry.onboarding_completed_at ? (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal/20 text-teal border border-teal/40">Onboarded ✓</span>
  ) : inquiry.onboarding_updated_at ? (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sun/10 text-sun border border-sun/30">Onboarding in progress</span>
  ) : null;

  const saveNotes = async () => {
    if (notes === (inquiry.admin_notes || "")) return;
    setSavingNotes(true);
    await onUpdate({ admin_notes: notes });
    setSavingNotes(false);
  };

  const courseShort = inquiry.course.split("—")[0].trim();
  const created = new Date(inquiry.created_at);
  const ageDays = Math.floor((Date.now() - created.getTime()) / 86_400_000);
  const ageLabel = ageDays === 0 ? "today" : ageDays === 1 ? "yesterday" : `${ageDays}d ago`;

  return (
    <div
      className={`transition-colors ${
        highlighted
          ? "bg-seafoam/10 ring-1 ring-inset ring-seafoam/40"
          : "bg-ocean/0 hover:bg-ocean/30"
      }`}
    >
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 grid grid-cols-12 gap-3 items-start"
      >
        <div className="col-span-3">
          <div className="text-sm font-medium text-salt">
            {inquiry.first_name} {inquiry.last_name || ""}
          </div>
          <div className="text-xs text-salt/40">{inquiry.email}</div>
          <div className="text-[10px] text-salt/30 mt-0.5">
            inquired {ageLabel}
            {inquiry.phone ? ` · ${inquiry.phone}` : ""}
          </div>
        </div>
        <div className="col-span-3">
          <div className="text-sm text-salt/80">{courseShort}</div>
          <div className="text-xs text-salt/40">
            {inquiry.preferred_dates || <span className="italic text-salt/30">no dates given</span>}
          </div>
          <div className="text-[10px] text-salt/30 mt-0.5">{inquiry.group_size || "—"}</div>
        </div>
        <div className="col-span-3">
          <div className="text-xs text-salt/60">{inquiry.experience || <span className="italic text-salt/30">no experience info</span>}</div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {bookingChip}
            {onboardingChip}
          </div>
        </div>
        <div className="col-span-3 flex flex-col items-end gap-2">
          <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${statusMeta.color}`}>
            {statusMeta.label}
          </span>
          <span className="text-[10px] text-salt/30">{expanded ? "▲ collapse" : "▼ details"}</span>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 grid grid-cols-12 gap-4 border-t border-teal/10 pt-4">
          {/* Message + admin notes */}
          <div className="col-span-7 space-y-4">
            <div>
              <div className="text-[10px] text-salt/30 font-medium uppercase tracking-wider mb-1">Their message</div>
              <div className="text-sm text-salt/80 bg-deep/40 rounded-lg p-3 whitespace-pre-wrap">
                {inquiry.message || <span className="italic text-salt/30">no message</span>}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-salt/30 font-medium uppercase tracking-wider mb-1">Admin notes</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={saveNotes}
                placeholder="Internal notes — quotes given, why they chose dates, special requests…"
                rows={3}
                className="w-full bg-deep/40 border border-teal/15 rounded-lg p-3 text-sm text-salt placeholder:text-salt/25 focus:outline-none focus:border-teal/40 resize-none"
              />
              {savingNotes && <div className="text-[10px] text-salt/40 mt-1">Saving…</div>}
            </div>

            {inquiry.bookings.length > 0 && (
              <div>
                <div className="text-[10px] text-salt/30 font-medium uppercase tracking-wider mb-1">Bookings on file</div>
                <div className="space-y-1">
                  {inquiry.bookings.map((b) => (
                    <div key={b.id} className="text-xs text-salt/60 bg-deep/40 rounded-lg px-3 py-2 flex justify-between">
                      <span>
                        {b.course} · {b.course_dates || "no dates"} · ${b.payment_amount}
                      </span>
                      <span className="text-salt/40">
                        {b.payment_status} · {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status workflow + actions */}
          <div className="col-span-5 space-y-3">
            <div>
              <div className="text-[10px] text-salt/30 font-medium uppercase tracking-wider mb-2">Advance status</div>
              <div className="grid grid-cols-2 gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onUpdate({ status: s.value })}
                    disabled={inquiry.status === s.value}
                    className={`text-[11px] px-2 py-1.5 rounded-lg border transition-colors text-left ${
                      inquiry.status === s.value
                        ? `${s.color} cursor-default`
                        : "bg-deep/30 text-salt/50 border-teal/10 hover:text-salt hover:border-teal/30"
                    }`}
                    title={s.description}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-salt/30 font-medium uppercase tracking-wider mb-2">Quick actions</div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={generateDraft}
                  disabled={drafting}
                  className="text-xs px-3 py-2 rounded-lg bg-sun/15 text-sun border border-sun/30 hover:bg-sun/25 transition-colors text-center disabled:opacity-50"
                >
                  {drafting ? "Drafting with Claude…" : draft ? "Re-draft reply with Claude" : "Draft reply with Claude →"}
                </button>
                <Link
                  href={`/admin/invoices?key=${SECRET}&prefillEmail=${encodeURIComponent(inquiry.email)}&prefillName=${encodeURIComponent(
                    `${inquiry.first_name} ${inquiry.last_name || ""}`.trim(),
                  )}`}
                  className="text-xs px-3 py-2 rounded-lg bg-coral/15 text-coral border border-coral/30 hover:bg-coral/25 transition-colors no-underline text-center"
                >
                  Create invoice / Stripe link →
                </Link>
                <Link
                  href={`/admin/send-links?key=${SECRET}`}
                  className="text-xs px-3 py-2 rounded-lg bg-teal/15 text-teal border border-teal/30 hover:bg-teal/25 transition-colors no-underline text-center"
                >
                  Send onboarding magic link →
                </Link>
                <Link
                  href={`/admin/send-forms?key=${SECRET}`}
                  className="text-xs px-3 py-2 rounded-lg bg-ocean/40 text-salt/70 border border-teal/20 hover:text-salt transition-colors no-underline text-center"
                >
                  Email AIDA PDFs →
                </Link>
                <Link
                  href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Re: ${inquiry.course.split("—")[0].trim()} inquiry`)}`}
                  className="text-xs px-3 py-2 rounded-lg bg-ocean/40 text-salt/70 border border-teal/20 hover:text-salt transition-colors no-underline text-center"
                >
                  Reply via email client →
                </Link>
                <button
                  onClick={() => onUpdate({ archived: !inquiry.archived })}
                  className="text-xs px-3 py-2 rounded-lg bg-deep/40 text-salt/40 border border-teal/10 hover:text-salt/70 transition-colors"
                >
                  {inquiry.archived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </div>

            <div className="text-[10px] text-salt/30 pt-2 border-t border-teal/10">
              Status updated {new Date(inquiry.status_updated_at).toLocaleDateString()}
              {inquiry.replied_at && ` · replied ${new Date(inquiry.replied_at).toLocaleDateString()}`}
            </div>
          </div>

          {/* Claude-drafted reply editor — full width when present */}
          {(draft || draftError) && (
            <div className="col-span-12 mt-2 bg-gradient-to-br from-sun/10 to-coral/5 border border-sun/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] text-sun font-medium tracking-[0.2em] uppercase">
                  Claude-drafted reply
                </div>
                <div className="flex items-center gap-3 text-[10px] text-salt/40 uppercase tracking-wider">
                  {sendStatus === "sent" && <span className="text-seafoam">✓ done</span>}
                  {sendStatus === "error" && <span className="text-coral">send failed</span>}
                  <span className="text-salt/30">Edit before sending</span>
                </div>
              </div>

              {draftError && (
                <div className="text-xs text-coral bg-coral/10 rounded-lg p-3 mb-3">{draftError}</div>
              )}

              {draft && (
                <>
                  <div className="mb-3">
                    <div className="text-[10px] text-salt/40 uppercase tracking-wider mb-1">Subject</div>
                    <input
                      type="text"
                      value={draft.subject}
                      onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                      className="w-full bg-deep/40 border border-teal/15 rounded-lg px-3 py-2 text-sm text-salt focus:outline-none focus:border-teal/40"
                    />
                  </div>

                  <div className="mb-3">
                    <div className="text-[10px] text-salt/40 uppercase tracking-wider mb-1">Body</div>
                    <textarea
                      value={draft.body}
                      onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                      rows={Math.min(24, Math.max(10, draft.body.split("\n").length + 1))}
                      className="w-full bg-deep/40 border border-teal/15 rounded-lg p-3 text-sm text-salt focus:outline-none focus:border-teal/40 font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={sendDraft}
                      disabled={sending}
                      className="text-xs px-4 py-2 rounded-full bg-seafoam text-deep font-semibold hover:bg-seafoam/80 transition-colors disabled:opacity-50"
                    >
                      {sending ? "Sending…" : "Send via email"}
                    </button>
                    <button
                      onClick={copyDraft}
                      className="text-xs px-4 py-2 rounded-full bg-deep/40 text-salt/70 border border-teal/20 hover:text-salt transition-colors"
                    >
                      Copy to clipboard
                    </button>
                    <button
                      onClick={() => {
                        setDraft(null);
                        setSendStatus("idle");
                      }}
                      className="text-xs px-4 py-2 rounded-full bg-deep/40 text-salt/40 hover:text-salt/70 transition-colors"
                    >
                      Discard
                    </button>
                    <div className="ml-auto text-[10px] text-salt/30 self-center">
                      Sends from noreply@lajollafreediveclub.com · reply-to: you · BCC: you
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
