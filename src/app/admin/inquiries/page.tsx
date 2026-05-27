"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SECRET = "ljfc";

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
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | "all">("all");
  const [showArchived, setShowArchived] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  useEffect(() => {
    if (keyParam === SECRET) setAuthed(true);
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
      const res = await fetch(`/api/admin/inquiries?key=${SECRET}${archivedParam}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch {}
    setLoading(false);
  }, [showArchived]);

  useEffect(() => {
    if (authed) fetchInquiries();
  }, [authed, fetchInquiries]);

  const dismissWalkthrough = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ljfc-inquiries-walkthrough-seen", "1");
    }
    setShowWalkthrough(false);
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
          onSubmit={(e) => {
            e.preventDefault();
            if (password === SECRET) setAuthed(true);
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
          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="text-[11px] text-salt/40 hover:text-salt/70 uppercase tracking-[0.15em] disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">Admin</div>
        <h1 className="font-serif text-3xl text-salt mb-2">Inquiries Pipeline</h1>
        <p className="text-salt/40 text-sm mb-6">
          Every course inquiry that comes through <code className="text-salt/60">/contact/courses</code> lands here. Move each one through the
          workflow as you respond, quote, and onboard.
        </p>

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
  onToggle,
  onUpdate,
}: {
  inquiry: Inquiry;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<Inquiry>) => void;
}) {
  const [notes, setNotes] = useState(inquiry.admin_notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const statusMeta = STATUS_BY_VALUE[inquiry.status];

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
    <div className="bg-ocean/0 hover:bg-ocean/30 transition-colors">
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
        </div>
      )}
    </div>
  );
}
