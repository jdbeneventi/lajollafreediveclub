"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  partners,
  getThisWeekActions,
  getPartnersNeedingFollowUp,
  getPartnersByStatus,
  type NetworkPartner,
  type PartnerCategory,
  type PartnerPriority,
  type PartnerStatus,
} from "@/lib/partner-network";

const SECRET = "ljfc-partners-2026";

const statusColors: Record<PartnerStatus, string> = {
  not_started: "#3A4A56",
  contacted: "#f0b429",
  in_discussion: "#3db8a4",
  active: "#22c55e",
  declined: "#C75B3A",
  paused: "#6b7280",
};

const priorityColors: Record<PartnerPriority, string> = {
  this_week: "#C75B3A",
  this_month: "#D4A574",
  before_camp: "#3db8a4",
  after_camp: "#3A4A56",
  future: "#6b7280",
};

function Badge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: color + "22", color }}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
}

function PartnerCard({ partner }: { partner: NetworkPartner }) {
  const [expanded, setExpanded] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const isOverdue =
    partner.followUpDate && partner.followUpDate <= today && partner.status !== "declined";

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif text-lg text-white leading-snug">
          {partner.name}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <Badge label={partner.category} color="#3db8a4" />
          <Badge label={partner.priority} color={priorityColors[partner.priority]} />
          <Badge label={partner.status} color={statusColors[partner.status]} />
        </div>
      </div>

      {/* Next Step — prominent */}
      <div className="bg-coral/10 border border-coral/20 rounded-lg p-3 mb-3">
        <div className="text-[10px] text-coral font-semibold uppercase tracking-wider mb-1">
          Next Step
        </div>
        <p className="text-white/80 text-sm leading-relaxed">
          {partner.nextStep}
        </p>
      </div>

      {/* Contact info */}
      {(partner.contactName || partner.contactEmail || partner.contactPhone) && (
        <div className="flex flex-wrap gap-3 text-xs text-white/40 mb-3">
          {partner.contactName && <span>{partner.contactName}</span>}
          {partner.contactEmail && (
            <a href={`mailto:${partner.contactEmail}`} className="text-seafoam no-underline hover:underline">
              {partner.contactEmail}
            </a>
          )}
          {partner.contactPhone && <span>{partner.contactPhone}</span>}
        </div>
      )}

      {/* Dates */}
      <div className="flex flex-wrap gap-4 text-xs text-white/30 mb-3">
        {partner.lastContact && <span>Last contact: {partner.lastContact}</span>}
        {partner.followUpDate && (
          <span className={isOverdue ? "text-coral font-semibold" : ""}>
            Follow up: {partner.followUpDate} {isOverdue ? "(OVERDUE)" : ""}
          </span>
        )}
        {partner.guestModules && partner.guestModules.length > 0 && (
          <span className="text-teal">
            {partner.guestModules.length} guest module{partner.guestModules.length > 1 ? "s" : ""}
          </span>
        )}
        {partner.partnerPageUrl && (
          <Link href={partner.partnerPageUrl} className="text-seafoam no-underline hover:underline">
            Partner page &rarr;
          </Link>
        )}
      </div>

      {/* Expandable details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer p-0"
      >
        {expanded ? "Hide details" : "Show details"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <div className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-1">
              What they offer
            </div>
            <p className="text-white/60 leading-relaxed">{partner.whatTheyOffer}</p>
          </div>
          <div>
            <div className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-1">
              What we offer
            </div>
            <p className="text-white/60 leading-relaxed">{partner.whatWeOffer}</p>
          </div>
          {partner.notes && (
            <div>
              <div className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-1">
                Notes
              </div>
              <p className="text-white/60 leading-relaxed">{partner.notes}</p>
            </div>
          )}
          {partner.guestModules && partner.guestModules.length > 0 && (
            <div>
              <div className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-1">
                Guest Modules
              </div>
              <div className="space-y-2">
                {partner.guestModules.map((m, i) => (
                  <div key={i} className="bg-white/[0.03] rounded-lg p-3">
                    <div className="text-white/80 font-medium text-sm">{m.title}</div>
                    <div className="text-white/40 text-xs mt-1">{m.duration} — {m.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPartnersPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"priority" | "name" | "status">("priority");

  // Check URL param on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("key") === SECRET) {
        setAuthed(true);
      }
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET) {
      setAuthed(true);
    }
  };

  const thisWeekActions = getThisWeekActions();
  const needsFollowUp = getPartnersNeedingFollowUp();
  const activeCount = getPartnersByStatus("active").length;

  const priorityOrder: PartnerPriority[] = useMemo(() => [
    "this_week",
    "this_month",
    "before_camp",
    "after_camp",
    "future",
  ], []);
  const statusOrder: PartnerStatus[] = useMemo(() => [
    "active",
    "in_discussion",
    "contacted",
    "not_started",
    "paused",
    "declined",
  ], []);

  const filtered = useMemo(() => {
    let result = [...partners];
    if (categoryFilter !== "all") result = result.filter((p) => p.category === categoryFilter);
    if (priorityFilter !== "all") result = result.filter((p) => p.priority === priorityFilter);
    if (statusFilter !== "all") result = result.filter((p) => p.status === statusFilter);

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "priority")
        return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
      if (sortBy === "status")
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      return 0;
    });

    return result;
  }, [categoryFilter, priorityFilter, statusFilter, sortBy]);

  const categories: PartnerCategory[] = [
    "government", "science", "university", "conservation", "grants",
    "community", "education", "military", "business", "tourism", "media", "digital",
  ];

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="max-w-sm w-full">
          <h1 className="font-serif text-2xl text-white mb-6 text-center">
            Partner Dashboard
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
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl text-white mb-2">
              Partner Network
            </h1>
            <p className="text-white/40 text-sm">CRM dashboard for LJFC partnerships</p>
          </div>
          <Link
            href="/admin/partners/add"
            className="bg-coral text-white px-5 py-2.5 rounded-full text-sm font-medium no-underline hover:-translate-y-0.5 transition-all text-center"
          >
            + Add Partner
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl text-white font-serif">{partners.length}</div>
            <div className="text-[11px] text-white/40 uppercase tracking-wider mt-1">Total Partners</div>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl text-seafoam font-serif">{activeCount}</div>
            <div className="text-[11px] text-white/40 uppercase tracking-wider mt-1">Active</div>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl text-coral font-serif">{thisWeekActions.length}</div>
            <div className="text-[11px] text-white/40 uppercase tracking-wider mt-1">This Week</div>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl text-sun font-serif">{needsFollowUp.length}</div>
            <div className="text-[11px] text-white/40 uppercase tracking-wider mt-1">Needs Follow-up</div>
          </div>
        </div>

        {/* This Week */}
        {thisWeekActions.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-xl text-coral mb-4">This Week</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {thisWeekActions.map((p) => (
                <PartnerCard key={p.id} partner={p} />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white/[0.08] border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-seafoam"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white/[0.08] border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-seafoam"
          >
            <option value="all">All Priorities</option>
            {priorityOrder.map((p) => (
              <option key={p} value={p}>
                {p.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/[0.08] border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-seafoam"
          >
            <option value="all">All Statuses</option>
            {statusOrder.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "priority" | "name" | "status")}
            className="bg-white/[0.08] border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-seafoam"
          >
            <option value="priority">Sort: Priority</option>
            <option value="name">Sort: Name</option>
            <option value="status">Sort: Status</option>
          </select>
          <span className="text-white/30 text-sm self-center ml-2">
            {filtered.length} partner{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Partner List */}
        <div className="grid gap-4">
          {filtered.map((p) => (
            <PartnerCard key={p.id} partner={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
