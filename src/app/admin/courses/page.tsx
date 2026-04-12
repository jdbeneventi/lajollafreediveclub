"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SECRET = "ljfc";

interface CalendarEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  end_date: string | null;
  time: string | null;
  spots: string | null;
  description: string | null;
}

interface Booking {
  id: string;
  student_id: string;
  email: string;
  course: string;
  course_dates: string | null;
  status: string;
  payment_status: string;
  event_id: string | null;
}

interface Student {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

function parseSpots(spots: string | null): number {
  if (!spots) return 4;
  const match = spots.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 4;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function CoursesContent() {
  const params = useSearchParams();
  const key = params.get("key");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Enroll form state
  const [enrollingEvent, setEnrollingEvent] = useState<string | null>(null);
  const [enrollEmail, setEnrollEmail] = useState("");
  const [enrollFirst, setEnrollFirst] = useState("");
  const [enrollLast, setEnrollLast] = useState("");

  // Email blast state
  const [emailingEvent, setEmailingEvent] = useState<string | null>(null);
  const [blastSubject, setBlastSubject] = useState("");
  const [blastMessage, setBlastMessage] = useState("");
  const [blastStatus, setBlastStatus] = useState("");

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/admin/courses?key=${key}`);
    if (res.ok) {
      const data = await res.json();
      setEvents(data.events || []);
      setBookings(data.bookings || []);
      setStudents(data.students || []);
    }
    setLoading(false);
  }, [key]);

  useEffect(() => {
    if (key === SECRET) fetchData();
    else setLoading(false);
  }, [key, fetchData]);

  const apiCall = async (body: Record<string, unknown>) => {
    setSaving(true);
    const res = await fetch(`/api/admin/courses?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    await fetchData();
    setSaving(false);
    return data;
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
        <p className="text-white/30 text-sm">Loading courses...</p>
      </div>
    );
  }

  const getEventBookings = (eventId: string, eventTitle: string) => {
    // Match by event_id (structured) or fuzzy match on course name (legacy)
    return bookings.filter(
      (b) => b.event_id === eventId || (!b.event_id && b.course.toLowerCase() === eventTitle.toLowerCase())
    );
  };

  const getStudentName = (studentId: string, email: string) => {
    const s = students.find((st) => st.id === studentId);
    if (s) {
      const name = [s.first_name, s.last_name].filter(Boolean).join(" ");
      return name || email.split("@")[0];
    }
    return email.split("@")[0];
  };

  return (
    <div className="min-h-screen bg-deep">
      <div className="max-w-[800px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/admin?key=${SECRET}`} className="text-seafoam/50 text-xs no-underline hover:text-seafoam">← Admin</Link>
          <h1 className="font-serif text-2xl text-white mt-1">Course Roster</h1>
          <p className="text-white/30 text-xs mt-1">
            {events.length} upcoming {events.length === 1 ? "course" : "courses"} · <Link href={`/admin/calendar?key=${SECRET}`} className="text-seafoam/50 no-underline hover:text-seafoam">Manage calendar →</Link>
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm mb-4">No upcoming courses or camps scheduled.</p>
            <Link href={`/admin/calendar?key=${SECRET}`}
              className="inline-block px-5 py-2.5 bg-seafoam text-deep rounded-lg text-sm font-semibold no-underline">
              Add a course date →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => {
              const eventBookings = getEventBookings(event.id, event.title);
              const maxSpots = parseSpots(event.spots);
              const enrolled = eventBookings.length;
              const isFull = enrolled >= maxSpots;
              const isEnrolling = enrollingEvent === event.id;
              const isEmailing = emailingEvent === event.id;

              return (
                <div key={event.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                  {/* Event header */}
                  <div className="px-5 py-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                          event.category === "camp" ? "bg-sand/20 text-sand" : "bg-coral/15 text-coral"
                        }`}>
                          {event.category}
                        </span>
                        <span className="text-white/30 text-[10px]">{formatDate(event.date)}{event.end_date ? ` – ${formatDate(event.end_date)}` : ""}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm">{event.title}</h3>
                      {event.time && <p className="text-white/30 text-xs mt-0.5">{event.time}</p>}
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className={`text-lg font-bold ${isFull ? "text-coral" : "text-seafoam"}`}>
                        {enrolled}/{maxSpots}
                      </div>
                      <div className="text-[9px] text-white/30">{isFull ? "Full" : "enrolled"}</div>
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div className="px-5 pb-3">
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${isFull ? "bg-coral" : "bg-seafoam/60"}`}
                        style={{ width: `${Math.min(100, (enrolled / maxSpots) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Participants */}
                  {enrolled > 0 && (
                    <div className="px-5 pb-3">
                      <div className="text-[10px] text-white/30 uppercase tracking-wide mb-2">Enrolled</div>
                      <div className="space-y-1">
                        {eventBookings.map((b) => (
                          <div key={b.id} className="flex items-center justify-between py-1.5 px-3 bg-white/[0.03] rounded-lg">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm text-white/70 truncate">{getStudentName(b.student_id, b.email)}</span>
                              <span className="text-[10px] text-white/20 truncate">{b.email}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                b.payment_status === "paid" ? "bg-seafoam/15 text-seafoam" :
                                b.payment_status === "deposit" ? "bg-sun/15 text-sun" :
                                "bg-coral/15 text-coral"
                              }`}>{b.payment_status}</span>
                              <button onClick={() => apiCall({ action: "remove_enrollment", bookingId: b.id })}
                                disabled={saving}
                                className="text-[10px] text-coral/40 hover:text-coral bg-transparent border-none cursor-pointer"
                                title="Remove">×</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="px-5 py-3 border-t border-white/[0.04] flex gap-2">
                    <button onClick={() => { setEnrollingEvent(isEnrolling ? null : event.id); setEmailingEvent(null); }}
                      disabled={isFull}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-colors ${
                        isEnrolling ? "bg-seafoam text-deep" :
                        isFull ? "bg-white/[0.03] text-white/15 cursor-not-allowed" :
                        "bg-white/[0.06] text-white/50 hover:text-white"
                      }`}>
                      + Enroll
                    </button>
                    {enrolled > 0 && (
                      <button onClick={() => {
                        setEmailingEvent(isEmailing ? null : event.id);
                        setEnrollingEvent(null);
                        setBlastSubject(event.title);
                        setBlastMessage("");
                        setBlastStatus("");
                      }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-colors ${
                          isEmailing ? "bg-seafoam text-deep" : "bg-white/[0.06] text-white/50 hover:text-white"
                        }`}>
                        ✉ Email All ({enrolled})
                      </button>
                    )}
                  </div>

                  {/* Enroll form */}
                  {isEnrolling && (
                    <div className="px-5 pb-4 border-t border-white/[0.04] pt-3">
                      <div className="flex gap-2 flex-wrap">
                        <input type="email" value={enrollEmail} onChange={(e) => setEnrollEmail(e.target.value)}
                          placeholder="Email (required)"
                          className="flex-1 min-w-[180px] px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-xs outline-none focus:border-seafoam placeholder:text-white/20" />
                        <input type="text" value={enrollFirst} onChange={(e) => setEnrollFirst(e.target.value)}
                          placeholder="First"
                          className="w-[100px] px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-xs outline-none focus:border-seafoam placeholder:text-white/20" />
                        <input type="text" value={enrollLast} onChange={(e) => setEnrollLast(e.target.value)}
                          placeholder="Last"
                          className="w-[100px] px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-xs outline-none focus:border-seafoam placeholder:text-white/20" />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={async () => {
                          if (!enrollEmail) return;
                          await apiCall({ action: "enroll", eventId: event.id, email: enrollEmail, firstName: enrollFirst, lastName: enrollLast });
                          setEnrollEmail(""); setEnrollFirst(""); setEnrollLast(""); setEnrollingEvent(null);
                        }} disabled={saving || !enrollEmail}
                          className="px-4 py-1.5 rounded-lg bg-seafoam text-deep text-xs font-semibold border-none cursor-pointer disabled:opacity-40">
                          {saving ? "Adding..." : "Enroll"}
                        </button>
                        <button onClick={() => setEnrollingEvent(null)}
                          className="px-4 py-1.5 rounded-lg bg-transparent border border-white/10 text-white/40 text-xs cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Email blast */}
                  {isEmailing && (
                    <div className="px-5 pb-4 border-t border-white/[0.04] pt-3">
                      <input type="text" value={blastSubject} onChange={(e) => setBlastSubject(e.target.value)}
                        placeholder="Subject"
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-xs outline-none focus:border-seafoam placeholder:text-white/20 mb-2" />
                      <textarea value={blastMessage} onChange={(e) => setBlastMessage(e.target.value)}
                        placeholder="Message to all participants..."
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-xs outline-none focus:border-seafoam placeholder:text-white/20 resize-y mb-2" />
                      <div className="flex items-center gap-2">
                        <button onClick={async () => {
                          if (!blastSubject || !blastMessage) return;
                          setBlastStatus("Sending...");
                          const result = await apiCall({ action: "blast_email", eventId: event.id, subject: blastSubject, message: blastMessage });
                          setBlastStatus(`Sent to ${result.sent || 0} of ${result.total || 0} participants`);
                        }} disabled={saving || !blastSubject || !blastMessage}
                          className="px-4 py-1.5 rounded-lg bg-seafoam text-deep text-xs font-semibold border-none cursor-pointer disabled:opacity-40">
                          {saving ? "Sending..." : `Send to ${enrolled}`}
                        </button>
                        <button onClick={() => { setEmailingEvent(null); setBlastStatus(""); }}
                          className="px-4 py-1.5 rounded-lg bg-transparent border border-white/10 text-white/40 text-xs cursor-pointer">
                          Cancel
                        </button>
                        {blastStatus && <span className="text-[10px] text-seafoam">{blastStatus}</span>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminCoursesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep" />}>
      <CoursesContent />
    </Suspense>
  );
}
