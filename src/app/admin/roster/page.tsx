"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { adminLogin, adminSession } from "@/lib/adminLogin";

/**
 * /admin/roster — attach students to course events.
 *
 * Rostering creates the booking row that seat counts everywhere are
 * computed from (homepage strip, /programs, /calendar, digest, bot).
 * After a course runs, "Mark all completed" closes out the students'
 * inquiries in one tap.
 */

interface RosterRow {
  bookingId: string;
  email: string;
  name: string;
  inquiryStatus: string | null;
  paymentStatus: string;
  fromStripe: boolean;
}

interface EventRow {
  id: string;
  title: string;
  date: string;
  end_date: string | null;
  capacity: number | null;
  roster: RosterRow[];
  past: boolean;
}

interface Available {
  id: string;
  name: string;
  email: string;
  course: string;
  status: string;
}

function fmtRange(date: string, end: string | null): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const s = new Date(date + "T12:00:00");
  if (!end || end === date) return s.toLocaleDateString("en-US", opts);
  const e = new Date(end + "T12:00:00");
  return s.getMonth() === e.getMonth()
    ? `${s.toLocaleDateString("en-US", opts)}–${e.getDate()}`
    : `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", opts)}`;
}

export default function RosterPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [available, setAvailable] = useState<Available[]>([]);
  const [pick, setPick] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/roster");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEvents(data.events || []);
      setAvailable(data.available || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "load failed");
    }
  }, []);

  useEffect(() => {
    adminSession().then((ok) => {
      setAuthed(ok);
      if (ok) load();
    });
  }, [load]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (await adminLogin(password)) {
      setAuthed(true);
      load();
    } else setError("Wrong password");
  }

  async function act(body: Record<string, string>, confirmMsg?: string) {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "action failed");
    } finally {
      setBusy(false);
    }
  }

  if (authed === null)
    return <div className="p-10 text-deep/50 text-sm">Checking session…</div>;

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto pt-24 px-6">
        <h1 className="font-serif text-2xl mb-6">Rosters — sign in</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="border border-deep/20 rounded-lg px-4 py-2.5 text-sm"
          />
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-1">Course rosters</h1>
          <p className="text-deep/50 text-sm">
            Rostering a student creates the booking that drives seat counts
            site-wide. After a course runs, close it out here.
          </p>
        </div>
        <Link href="/admin/inquiries" className="text-teal text-sm no-underline">
          ← Inquiries
        </Link>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="flex flex-col gap-6">
        {events.map((ev) => {
          const seats =
            ev.capacity !== null ? ev.capacity - ev.roster.length : null;
          return (
            <div key={ev.id} className="border border-deep/10 rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-serif text-lg">
                  {fmtRange(ev.date, ev.end_date)}
                </span>
                <span className="font-medium text-deep/80 text-sm">
                  {ev.title}
                </span>
                {ev.past ? (
                  <span className="text-[11px] bg-deep/[0.06] text-deep/50 rounded-full px-2.5 py-0.5">
                    ran
                  </span>
                ) : seats !== null ? (
                  <span
                    className={`text-[11px] rounded-full px-2.5 py-0.5 font-medium ${
                      seats <= 0
                        ? "bg-deep/[0.06] text-deep/40"
                        : "bg-teal/[0.08] text-teal"
                    }`}
                  >
                    {seats <= 0 ? "Full" : `${seats} of ${ev.capacity} open`}
                  </span>
                ) : null}
                {ev.past && ev.roster.length > 0 && (
                  <button
                    onClick={() =>
                      act(
                        { action: "complete", eventId: ev.id },
                        `Mark ${ev.roster.length} student(s) completed for ${ev.title}?`,
                      )
                    }
                    disabled={busy}
                    className="ml-auto text-xs bg-teal text-white rounded-full px-3 py-1 disabled:opacity-40"
                  >
                    Mark all completed
                  </button>
                )}
              </div>

              {ev.roster.length === 0 ? (
                <p className="text-deep/35 text-sm mb-3">No one rostered yet.</p>
              ) : (
                <ul className="mb-3 flex flex-col gap-1.5">
                  {ev.roster.map((r) => (
                    <li
                      key={r.bookingId}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="font-medium">{r.name}</span>
                      <span className="text-deep/40 text-xs">{r.email}</span>
                      {r.inquiryStatus && (
                        <span className="text-[10px] uppercase tracking-wider bg-deep/[0.06] text-deep/50 rounded-full px-2 py-0.5">
                          {r.inquiryStatus}
                        </span>
                      )}
                      <span
                        className={`text-[10px] rounded-full px-2 py-0.5 ${
                          r.paymentStatus === "paid" ||
                          r.paymentStatus === "deposit"
                            ? "bg-teal/[0.08] text-teal"
                            : "bg-amber-500/10 text-amber-700"
                        }`}
                      >
                        {r.paymentStatus}
                      </span>
                      {!r.fromStripe && !ev.past && (
                        <button
                          onClick={() =>
                            act(
                              { action: "unroster", bookingId: r.bookingId },
                              `Remove ${r.name} from this course?`,
                            )
                          }
                          disabled={busy}
                          className="text-deep/30 hover:text-red-600 text-xs ml-1"
                          title="Remove from roster"
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {!ev.past && (
                <div className="flex gap-2 items-center">
                  <select
                    value={pick[ev.id] || ""}
                    onChange={(e) =>
                      setPick((m) => ({ ...m, [ev.id]: e.target.value }))
                    }
                    className="border border-deep/15 rounded-lg px-3 py-1.5 text-sm flex-1 max-w-[320px]"
                  >
                    <option value="">Add from pipeline…</option>
                    {available.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {a.course.split("—")[0].trim()} ({a.status})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      pick[ev.id] &&
                      act({ inquiryId: pick[ev.id], eventId: ev.id })
                    }
                    disabled={busy || !pick[ev.id]}
                    className="btn btn-primary text-sm py-1.5 disabled:opacity-40"
                  >
                    Roster
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
