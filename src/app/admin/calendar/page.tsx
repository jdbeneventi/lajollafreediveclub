"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Auth handled by password input → stored in secret state

interface CalendarEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  end_date: string | null;
  time: string | null;
  description: string | null;
  price: string | null;
  spots: string | null;
  href: string | null;
  recurring: string | null;
  guest_org: string | null;
  seasonal: boolean;
  active: boolean;
  created_at: string;
}

const categories = [
  { value: "course", label: "Course", color: "bg-coral/15 text-coral" },
  { value: "camp", label: "Camp", color: "bg-sand/20 text-sand" },
  { value: "community", label: "Community", color: "bg-seafoam/15 text-seafoam" },
  { value: "weekly", label: "Weekly", color: "bg-teal/15 text-teal" },
  { value: "seasonal", label: "Seasonal", color: "bg-ocean/20 text-white/60" },
  { value: "guest", label: "Guest", color: "bg-sun/15 text-sun" },
];

const catColor = (cat: string) => categories.find(c => c.value === cat)?.color || "bg-white/10 text-salt/50";

const emptyEvent = {
  title: "", category: "course", date: "", end_date: "", time: "",
  description: "", price: "", spots: "", href: "", recurring: "",
  guest_org: "", seasonal: false,
};

export default function CalendarAdmin() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/calendar");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchEvents();
  }, [authed, fetchEvents]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) setAuthed(true);
  };

  const startCreate = () => {
    setForm(emptyEvent);
    setCreating(true);
    setEditing(null);
    setShowAdvanced(false);
  };

  const startEdit = (event: CalendarEvent) => {
    setForm({
      title: event.title, category: event.category, date: event.date,
      end_date: event.end_date || "", time: event.time || "",
      description: event.description || "", price: event.price || "",
      spots: event.spots || "", href: event.href || "",
      recurring: event.recurring || "", guest_org: event.guest_org || "",
      seasonal: event.seasonal,
    });
    setEditing(event);
    setCreating(false);
    setShowAdvanced(false);
  };

  const duplicate = (event: CalendarEvent) => {
    setForm({
      title: event.title, category: event.category, date: "",
      end_date: "", time: event.time || "",
      description: event.description || "", price: event.price || "",
      spots: event.spots || "", href: event.href || "",
      recurring: "", guest_org: event.guest_org || "",
      seasonal: false,
    });
    setCreating(true);
    setEditing(null);
    setShowAdvanced(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => { setEditing(null); setCreating(false); setForm(emptyEvent); };

  const save = async () => {
    if (!form.title || !form.date) { setStatus("Title and date required."); return; }
    setSaving(true); setStatus("");
    const payload = {
      action: editing ? "update" : "create",
      ...(editing ? { id: editing.id } : {}),
      ...form,
      end_date: form.end_date || null, time: form.time || null,
      description: form.description || null, price: form.price || null,
      spots: form.spots || null, href: form.href || null,
      recurring: form.recurring || null, guest_org: form.guest_org || null,
    };
    try {
      const res = await fetch(`/api/calendar?secret=${encodeURIComponent(secret)}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) { setStatus(editing ? "Updated!" : "Created!"); cancel(); fetchEvents(); }
      else { const data = await res.json(); setStatus(data.error || "Failed."); }
    } catch { setStatus("Network error."); }
    setSaving(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await fetch(`/api/calendar?secret=${encodeURIComponent(secret)}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      fetchEvents();
    } catch {}
  };

  const seedFromCode = async () => {
    if (!confirm("Import all events from the hardcoded calendar into the database?")) return;
    setSaving(true); setStatus("Importing...");
    try {
      const res = await fetch(`/api/calendar/seed?secret=${encodeURIComponent(secret)}`);
      if (res.ok) { const data = await res.json(); setStatus(`Imported ${data.count} events!`); fetchEvents(); }
      else { const data = await res.json(); setStatus(data.error || "Import failed."); }
    } catch { setStatus("Import failed."); }
    setSaving(false);
  };

  // Auth
  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-4">
        <form onSubmit={handleAuth} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-2">Admin</div>
            <h1 className="text-2xl font-serif text-salt">Calendar Manager</h1>
          </div>
          <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Enter secret" className="w-full px-4 py-3 bg-ocean/50 border border-teal/20 rounded-lg text-salt placeholder:text-salt/30 focus:outline-none focus:border-teal/50 mb-4" />
          <button type="submit" className="w-full py-3 bg-teal text-salt font-semibold rounded-lg hover:bg-teal/80 transition-colors">Authenticate</button>
        </form>
      </div>
    );
  }

  const filtered = filter === "all" ? events : events.filter(e => e.category === filter);
  const isEditorOpen = creating || editing;

  return (
    <div className="min-h-screen bg-deep px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">Admin</div>
              <h1 className="text-2xl font-serif text-salt">Calendar</h1>
            </div>
            <Link href="/admin" className="text-teal text-xs no-underline hover:text-salt">← Admin</Link>
          </div>

          {/* Action buttons — full width, below header */}
          <div className="flex gap-3">
            <button onClick={startCreate} className="flex-1 py-3 bg-coral text-white text-sm font-semibold rounded-xl hover:bg-coral/80 transition-colors cursor-pointer border-none">
              + Add Event
            </button>
            {events.length === 0 && (
              <button onClick={seedFromCode} disabled={saving} className="flex-1 py-3 bg-ocean/50 text-salt text-sm font-medium rounded-xl hover:bg-ocean/70 transition-colors cursor-pointer border-none disabled:opacity-50">
                Import from code
              </button>
            )}
            <Link href="/calendar" className="py-3 px-4 bg-white/[0.06] text-salt/50 text-sm rounded-xl no-underline hover:text-salt transition-colors flex items-center">
              View live →
            </Link>
          </div>
        </div>

        {/* Status */}
        {status && (
          <div className="bg-seafoam/10 border border-seafoam/20 rounded-lg px-4 py-3 text-seafoam text-sm mb-4">
            {status}
            <button onClick={() => setStatus("")} className="ml-2 text-seafoam/50 cursor-pointer bg-transparent border-none">×</button>
          </div>
        )}

        {/* Editor */}
        {isEditorOpen && (
          <div className="bg-ocean/30 border border-teal/15 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-salt font-serif text-lg">{editing ? "Edit Event" : "New Event"}</h3>
              <button onClick={cancel} className="text-salt/40 text-xs cursor-pointer bg-transparent border-none hover:text-salt">Cancel ×</button>
            </div>

            <div className="space-y-3">
              {/* Row 1: Title + Category */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] text-salt/40 uppercase tracking-wider block mb-1">Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" placeholder="e.g. AIDA 2 Certification" />
                </div>
                <div>
                  <label className="text-[10px] text-salt/40 uppercase tracking-wider block mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40">
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2: Date + End Date + Time */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-salt/40 uppercase tracking-wider block mb-1">Start Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40" />
                </div>
                <div>
                  <label className="text-[10px] text-salt/40 uppercase tracking-wider block mb-1">End Date</label>
                  <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="w-full px-3 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40" />
                </div>
                <div>
                  <label className="text-[10px] text-salt/40 uppercase tracking-wider block mb-1">Time</label>
                  <input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="w-full px-3 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" placeholder="8:00 AM – 1:00 PM" />
                </div>
              </div>

              {/* Row 3: Price + Spots */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-salt/40 uppercase tracking-wider block mb-1">Price</label>
                  <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" placeholder="$200" />
                </div>
                <div>
                  <label className="text-[10px] text-salt/40 uppercase tracking-wider block mb-1">Spots</label>
                  <input value={form.spots} onChange={e => setForm({ ...form, spots: e.target.value })} className="w-full px-3 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" placeholder="4 spots" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] text-salt/40 uppercase tracking-wider block mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 resize-none placeholder:text-salt/25" placeholder="Brief description..." />
              </div>

              {/* Advanced (collapsed by default) */}
              <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-salt/30 text-xs cursor-pointer bg-transparent border-none hover:text-salt">
                {showAdvanced ? "Hide advanced ↑" : "Show advanced (link, guest org, recurring) ↓"}
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] text-salt/40 uppercase tracking-wider block mb-1">Link (href)</label>
                    <input value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} className="w-full px-3 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" placeholder="/contact/courses?course=aida2" />
                  </div>
                  <div>
                    <label className="text-[10px] text-salt/40 uppercase tracking-wider block mb-1">Guest Org</label>
                    <input value={form.guest_org} onChange={e => setForm({ ...form, guest_org: e.target.value })} className="w-full px-3 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" />
                  </div>
                </div>
              )}

              {/* Save */}
              <button onClick={save} disabled={saving} className="w-full py-3 bg-seafoam text-deep font-semibold text-sm rounded-xl cursor-pointer border-none hover:bg-seafoam/80 transition-colors disabled:opacity-50 mt-2">
                {saving ? "Saving..." : editing ? "Save Changes" : "Create Event"}
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
          <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-none transition-colors shrink-0 ${filter === "all" ? "bg-teal text-deep" : "bg-white/[0.06] text-salt/50 hover:text-salt"}`}>
            All ({events.length})
          </button>
          {categories.map(c => {
            const count = events.filter(e => e.category === c.value).length;
            if (count === 0) return null;
            return (
              <button key={c.value} onClick={() => setFilter(c.value)} className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-none transition-colors shrink-0 ${filter === c.value ? "bg-teal text-deep" : "bg-white/[0.06] text-salt/50 hover:text-salt"}`}>
                {c.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Event List */}
        {loading ? (
          <div className="text-salt/40 text-sm text-center py-12">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-salt/30 text-sm mb-4">{events.length === 0 ? "No events yet." : "No events in this category."}</div>
            {events.length === 0 && (
              <button onClick={seedFromCode} disabled={saving} className="px-6 py-3 bg-teal text-deep font-semibold text-sm rounded-xl cursor-pointer border-none hover:bg-teal/80 transition-colors disabled:opacity-50">
                Import existing events from site →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(event => (
              <div key={event.id} className="bg-ocean/20 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 items-start min-w-0">
                    {/* Date */}
                    <div className="shrink-0 w-14 text-center">
                      <div className="text-salt text-sm font-medium leading-tight">
                        {new Date(event.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      {event.end_date && (
                        <div className="text-salt/25 text-[10px]">
                          – {new Date(event.end_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${catColor(event.category)}`}>
                          {event.category}
                        </span>
                        <span className="text-salt text-sm font-medium truncate">{event.title}</span>
                      </div>
                      <div className="text-salt/30 text-xs flex gap-3 flex-wrap">
                        {event.time && <span>{event.time}</span>}
                        {event.price && <span>{event.price}</span>}
                        {event.spots && <span className="text-seafoam/60">{event.spots}</span>}
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(event)} className="text-teal text-xs hover:text-salt cursor-pointer bg-transparent border-none px-2 py-1">Edit</button>
                    <button onClick={() => duplicate(event)} className="text-salt/30 text-xs hover:text-salt cursor-pointer bg-transparent border-none px-2 py-1">Copy</button>
                    <button onClick={() => deleteEvent(event.id)} className="text-coral/40 text-xs hover:text-coral cursor-pointer bg-transparent border-none px-2 py-1">×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <button onClick={fetchEvents} className="text-salt/30 text-xs cursor-pointer bg-transparent border-none hover:text-salt">Refresh</button>
        </div>
      </div>
    </div>
  );
}
