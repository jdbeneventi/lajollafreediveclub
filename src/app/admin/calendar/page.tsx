"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

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
  { value: "course", label: "Course" },
  { value: "camp", label: "Camp" },
  { value: "community", label: "Community" },
  { value: "weekly", label: "Weekly" },
  { value: "seasonal", label: "Seasonal" },
  { value: "guest", label: "Guest Educator" },
];

const categoryColors: Record<string, string> = {
  course: "bg-coral/15 text-coral",
  camp: "bg-sand/20 text-sand",
  community: "bg-seafoam/15 text-seafoam",
  weekly: "bg-teal/15 text-teal",
  seasonal: "bg-ocean/20 text-white/60",
  guest: "bg-sun/15 text-sun",
};

const emptyEvent = {
  title: "",
  category: "course",
  date: "",
  end_date: "",
  time: "",
  description: "",
  price: "",
  spots: "",
  href: "",
  recurring: "",
  guest_org: "",
  seasonal: false,
};

export default function CalendarAdmin() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState("all");

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
    if (authenticated) fetchEvents();
  }, [authenticated, fetchEvents]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) setAuthenticated(true);
  };

  const startCreate = () => {
    setForm(emptyEvent);
    setCreating(true);
    setEditing(null);
  };

  const startEdit = (event: CalendarEvent) => {
    setForm({
      title: event.title,
      category: event.category,
      date: event.date,
      end_date: event.end_date || "",
      time: event.time || "",
      description: event.description || "",
      price: event.price || "",
      spots: event.spots || "",
      href: event.href || "",
      recurring: event.recurring || "",
      guest_org: event.guest_org || "",
      seasonal: event.seasonal,
    });
    setEditing(event);
    setCreating(false);
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setForm(emptyEvent);
  };

  const save = async () => {
    if (!form.title || !form.date) {
      setStatus("Title and date are required.");
      return;
    }
    setSaving(true);
    setStatus("");

    const payload = {
      action: editing ? "update" : "create",
      ...(editing ? { id: editing.id } : {}),
      title: form.title,
      category: form.category,
      date: form.date,
      end_date: form.end_date || null,
      time: form.time || null,
      description: form.description || null,
      price: form.price || null,
      spots: form.spots || null,
      href: form.href || null,
      recurring: form.recurring || null,
      guest_org: form.guest_org || null,
      seasonal: form.seasonal,
    };

    try {
      const res = await fetch(`/api/calendar?secret=${encodeURIComponent(secret)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus(editing ? "Updated!" : "Created!");
        cancel();
        fetchEvents();
      } else {
        const data = await res.json();
        setStatus(data.error || "Failed to save.");
      }
    } catch {
      setStatus("Network error.");
    }
    setSaving(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await fetch(`/api/calendar?secret=${encodeURIComponent(secret)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      fetchEvents();
    } catch {}
  };

  const seedFromCode = async () => {
    if (!confirm("This will import all events from the hardcoded calendar into the database. Continue?")) return;
    setSaving(true);
    setStatus("Seeding...");

    // Import the current hardcoded events and transform them
    try {
      const res = await fetch(`/api/calendar/seed?secret=${encodeURIComponent(secret)}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(`Seeded ${data.count} events!`);
        fetchEvents();
      } else {
        const data = await res.json();
        setStatus(data.error || "Seed failed.");
      }
    } catch {
      setStatus("Seed failed.");
    }
    setSaving(false);
  };

  if (!authenticated) {
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

  const filteredEvents = filter === "all"
    ? events
    : events.filter(e => e.category === filter);

  const isEditorOpen = creating || editing;

  return (
    <div className="min-h-screen bg-deep px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">Admin</div>
            <h1 className="text-2xl font-serif text-salt">Calendar</h1>
          </div>
          <div className="flex gap-2">
            {events.length === 0 && (
              <button onClick={seedFromCode} disabled={saving} className="px-4 py-2 bg-ocean/40 text-salt text-xs font-medium rounded-lg hover:bg-ocean/60 transition-colors cursor-pointer border-none">
                Import from code
              </button>
            )}
            <button onClick={startCreate} className="px-4 py-2 bg-coral text-white text-sm font-medium rounded-lg hover:bg-coral/80 transition-colors cursor-pointer border-none">
              + Add Event
            </button>
          </div>
        </div>

        {/* Status */}
        {status && (
          <div className="bg-seafoam/10 border border-seafoam/20 rounded-lg px-4 py-2 text-seafoam text-sm mb-4">
            {status}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-none transition-colors ${filter === "all" ? "bg-teal text-deep" : "bg-white/[0.06] text-salt/50 hover:text-salt"}`}>
            All ({events.length})
          </button>
          {categories.map(c => {
            const count = events.filter(e => e.category === c.value).length;
            if (count === 0) return null;
            return (
              <button key={c.value} onClick={() => setFilter(c.value)} className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-none transition-colors ${filter === c.value ? "bg-teal text-deep" : "bg-white/[0.06] text-salt/50 hover:text-salt"}`}>
                {c.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Editor */}
        {isEditorOpen && (
          <div className="bg-ocean/30 border border-teal/15 rounded-2xl p-6 mb-6">
            <h3 className="text-salt font-serif text-lg mb-4">{editing ? "Edit Event" : "New Event"}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-salt/50 block mb-1">Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" placeholder="e.g. AIDA 2 Certification" />
                </div>
                <div>
                  <label className="text-xs text-salt/50 block mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40">
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-salt/50 block mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40" />
                </div>
                <div>
                  <label className="text-xs text-salt/50 block mb-1">End Date</label>
                  <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="w-full px-4 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40" />
                </div>
                <div>
                  <label className="text-xs text-salt/50 block mb-1">Time</label>
                  <input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="w-full px-4 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" placeholder="e.g. 8:00 AM – 1:00 PM" />
                </div>
                <div>
                  <label className="text-xs text-salt/50 block mb-1">Price</label>
                  <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" placeholder="e.g. $200" />
                </div>
                <div>
                  <label className="text-xs text-salt/50 block mb-1">Spots</label>
                  <input value={form.spots} onChange={e => setForm({ ...form, spots: e.target.value })} className="w-full px-4 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" placeholder="e.g. 4 spots" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-salt/50 block mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 resize-none placeholder:text-salt/25" placeholder="Brief description..." />
                </div>
                <div>
                  <label className="text-xs text-salt/50 block mb-1">Link (href)</label>
                  <input value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} className="w-full px-4 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" placeholder="/contact/courses?course=aida2" />
                </div>
                <div>
                  <label className="text-xs text-salt/50 block mb-1">Guest Org</label>
                  <input value={form.guest_org} onChange={e => setForm({ ...form, guest_org: e.target.value })} className="w-full px-4 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-seafoam text-deep font-semibold text-sm rounded-lg cursor-pointer border-none hover:bg-seafoam/80 transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
                <button onClick={cancel} className="px-6 py-2.5 bg-white/[0.06] text-salt/60 text-sm rounded-lg cursor-pointer border-none hover:bg-white/[0.1] transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events list */}
        {loading ? (
          <div className="text-salt/40 text-sm text-center py-12">Loading...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-salt/30 text-sm text-center py-12">
            {events.length === 0 ? "No events yet. Add one or import from code." : "No events in this category."}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEvents.map(event => (
              <div key={event.id} className="flex items-center gap-4 bg-ocean/20 rounded-lg px-4 py-3">
                <div className="shrink-0 w-16 text-center">
                  <div className="text-salt text-sm font-medium">{new Date(event.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  {event.end_date && <div className="text-salt/30 text-[10px]">– {new Date(event.end_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[event.category] || "bg-white/10 text-salt/50"}`}>
                      {event.category}
                    </span>
                    <span className="text-salt text-sm font-medium truncate">{event.title}</span>
                  </div>
                  <div className="text-salt/30 text-xs truncate">
                    {[event.time, event.price, event.spots].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(event)} className="text-teal text-xs hover:text-salt cursor-pointer bg-transparent border-none">Edit</button>
                  <button onClick={() => deleteEvent(event.id)} className="text-coral/60 text-xs hover:text-coral cursor-pointer bg-transparent border-none">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer links */}
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/calendar" className="text-teal text-xs no-underline hover:text-salt">View public calendar →</Link>
          <button onClick={fetchEvents} className="text-salt/30 text-xs cursor-pointer bg-transparent border-none hover:text-salt">Refresh</button>
        </div>
      </div>
    </div>
  );
}
