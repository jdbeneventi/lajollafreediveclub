"use client";

import { useState, useEffect, useCallback } from "react";

interface Conditions { waveHeight: string | null; wavePeriod: string | null; windSpeed: string | null; windDir: string | null; windGust: string | null; waterTemp: number | null; }
interface Member { id: string; first_name: string; last_name: string; email: string; cert_level: string | null; waiver_signed: boolean; waiver_signed_at: string | null; created_at: string; }
interface RSVP { id: string; email: string; line_diving: boolean; cert_level: string | null; first_time: boolean; created_at: string; member: Member | null; }
interface Confirmation { id: string; email: string; line_diving: boolean; created_at: string; }
interface Stats { registered: number; confirmed: number; diving_registered: number; beach_registered: number; diving_confirmed: number; beach_confirmed: number; total_members: number; waivers_signed: number; waivers_unsigned: number; rsvps_without_waiver: number; }
interface DashboardData { saturday_date: string; rsvps: RSVP[]; confirmations: Confirmation[]; members: Member[]; stats: Stats; }

export default function SaturdayAdmin() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<"overview" | "members" | "blast">("overview");

  // Dashboard data
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(false);

  // Blast state
  const [conditions, setConditions] = useState<Conditions | null>(null);
  const [conditionsLoading, setConditionsLoading] = useState(false);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [confirmType, setConfirmType] = useState<"go" | "nogo" | null>(null);

  // Search
  const [memberSearch, setMemberSearch] = useState("");

  const fetchDashboard = useCallback(async () => {
    setDashLoading(true);
    try {
      const res = await fetch(`/api/saturday-dashboard?secret=${encodeURIComponent(secret)}`);
      if (res.ok) {
        const data = await res.json();
        setDashboard(data);
      }
    } catch {}
    setDashLoading(false);
  }, [secret]);

  const fetchConditions = useCallback(async () => {
    setConditionsLoading(true);
    try {
      const res = await fetch("/api/conditions");
      if (res.ok) {
        const data = await res.json();
        setConditions({
          waveHeight: data.waveHeight ? `${(data.waveHeight * 3.281).toFixed(1)}ft` : null,
          wavePeriod: data.wavePeriod ? `${data.wavePeriod.toFixed(0)}s` : null,
          windSpeed: data.windSpeed ?? null,
          windDir: data.windDirection ?? null,
          windGust: data.windGust ?? null,
          waterTemp: data.waterTemp ? Math.round(data.waterTemp) : null,
        });
      }
    } catch {}
    setConditionsLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchDashboard();
      fetchConditions();
    }
  }, [authenticated, fetchDashboard, fetchConditions]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) setAuthenticated(true);
  };

  const handleSend = async (type: "go" | "nogo") => {
    setConfirmType(null);
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/saturday-blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, note: note.trim() || undefined, secret }),
      });
      const data = await res.json();
      if (res.ok && data.status === "scheduled") {
        setStatus({ type: "success", message: `${type === "go" ? "GO" : "NO-GO"} email scheduled. Broadcast ID: ${data.broadcast_id}` });
      } else {
        setStatus({ type: "error", message: data.error || data.message || "Something went wrong." });
      }
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Network error." });
    }
    setSending(false);
  };

  // Auth screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-4">
        <form onSubmit={handleAuth} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-2">La Jolla Freedive Club</div>
            <h1 className="text-2xl font-serif text-salt">Saturday Dashboard</h1>
            <p className="text-sm text-salt/50 mt-2">Admin access required</p>
          </div>
          <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Enter secret" className="w-full px-4 py-3 bg-ocean/50 border border-teal/20 rounded-lg text-salt placeholder:text-salt/30 focus:outline-none focus:border-teal/50 mb-4" />
          <button type="submit" className="w-full py-3 bg-teal text-salt font-semibold rounded-lg hover:bg-teal/80 transition-colors">Authenticate</button>
        </form>
      </div>
    );
  }

  const s = dashboard?.stats;
  const filteredMembers = (dashboard?.members || []).filter(m => {
    if (!memberSearch.trim()) return true;
    const q = memberSearch.toLowerCase();
    return `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-deep px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">La Jolla Freedive Club</div>
          <h1 className="text-2xl font-serif text-salt">Saturday Dashboard</h1>
          {dashboard && <p className="text-sm text-salt/40 mt-1">Week of {dashboard.saturday_date}</p>}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-ocean/30 rounded-xl p-1 mb-6">
          {(["overview", "members", "blast"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors capitalize cursor-pointer border-none ${tab === t ? "bg-teal text-deep" : "text-salt/50 hover:text-salt/80"}`}>
              {t === "overview" ? `This Week${s ? ` (${s.registered})` : ""}` : t === "members" ? `Members${s ? ` (${s.total_members})` : ""}` : "Send Blast"}
            </button>
          ))}
        </div>

        {dashLoading && <div className="text-center text-salt/40 text-sm py-8">Loading...</div>}

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && dashboard && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard label="Registered" value={s?.registered || 0} color="text-salt" />
              <StatCard label="Confirmed" value={s?.confirmed || 0} sub={s?.registered ? `of ${s.registered}` : undefined} color="text-seafoam" />
              <StatCard label="Diving" value={s?.diving_registered || 0} sub={`${s?.diving_confirmed || 0} confirmed`} color="text-teal" />
              <StatCard label="No Waiver" value={s?.rsvps_without_waiver || 0} color={s?.rsvps_without_waiver ? "text-coral" : "text-salt"} />
            </div>

            {/* RSVPs */}
            <Section title="Registrations" count={dashboard.rsvps.length}>
              {dashboard.rsvps.length === 0 ? (
                <div className="text-salt/30 text-sm py-4 text-center">No registrations yet this week.</div>
              ) : (
                <div className="space-y-2">
                  {dashboard.rsvps.map(r => (
                    <div key={r.id} className="flex items-center justify-between bg-ocean/20 rounded-lg px-4 py-3">
                      <div>
                        <div className="text-sm text-salt font-medium">
                          {r.member ? `${r.member.first_name} ${r.member.last_name}` : r.email}
                        </div>
                        <div className="text-xs text-salt/40">{r.email}</div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${r.line_diving ? "bg-teal/15 text-teal" : "bg-salt/10 text-salt/40"}`}>
                          {r.line_diving ? "Diving" : "Beach"}
                        </span>
                        {r.cert_level && <span className="text-[10px] text-salt/30">{r.cert_level}</span>}
                        {r.member ? (
                          r.member.waiver_signed
                            ? <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-seafoam/15 text-seafoam">Waiver</span>
                            : <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-coral/15 text-coral">No waiver</span>
                        ) : (
                          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-coral/15 text-coral">No waiver</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Confirmations */}
            <Section title="Friday Confirmations" count={dashboard.confirmations.length}>
              {dashboard.confirmations.length === 0 ? (
                <div className="text-salt/30 text-sm py-4 text-center">No confirmations yet.</div>
              ) : (
                <div className="space-y-2">
                  {dashboard.confirmations.map(c => (
                    <div key={c.id} className="flex items-center justify-between bg-ocean/20 rounded-lg px-4 py-3">
                      <div className="text-sm text-salt">{c.email}</div>
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${c.line_diving ? "bg-teal/15 text-teal" : "bg-salt/10 text-salt/40"}`}>
                        {c.line_diving ? "Diving" : "Beach"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </>
        )}

        {/* ── MEMBERS TAB ── */}
        {tab === "members" && dashboard && (
          <>
            <div className="mb-4">
              <input type="text" value={memberSearch} onChange={e => setMemberSearch(e.target.value)} placeholder="Search by name or email..." className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-xl text-salt placeholder:text-salt/30 focus:outline-none focus:border-teal/40 text-sm" />
            </div>
            <div className="flex gap-3 mb-4 text-xs">
              <span className="text-salt/40">{dashboard.members.length} total</span>
              <span className="text-seafoam">{s?.waivers_signed} waiver signed</span>
              <span className="text-coral">{s?.waivers_unsigned} unsigned</span>
            </div>
            <div className="space-y-2">
              {filteredMembers.map(m => (
                <div key={m.id} className="flex items-center justify-between bg-ocean/20 rounded-lg px-4 py-3">
                  <div>
                    <div className="text-sm text-salt font-medium">{m.first_name} {m.last_name}</div>
                    <div className="text-xs text-salt/40">{m.email}{m.cert_level ? ` · ${m.cert_level}` : ""}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {m.waiver_signed ? (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-seafoam/15 text-seafoam">Waiver signed</span>
                    ) : (
                      <button onClick={() => { navigator.clipboard.writeText("https://lajollafreediveclub.com/waiver"); }} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-coral/15 text-coral cursor-pointer border-none hover:bg-coral/25 transition-colors">
                        Copy waiver link
                      </button>
                    )}
                    <span className="text-[10px] text-salt/20">
                      {new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── BLAST TAB ── */}
        {tab === "blast" && (
          <>
            {/* Conditions */}
            <div className="bg-ocean/30 border border-teal/15 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase">Live Conditions</div>
                <button onClick={fetchConditions} disabled={conditionsLoading} className="text-xs text-teal/60 hover:text-teal transition-colors cursor-pointer bg-transparent border-none">{conditionsLoading ? "Loading..." : "Refresh"}</button>
              </div>
              {conditions ? (
                <div className="grid grid-cols-2 gap-3">
                  <div><div className="text-xs text-salt/40 mb-1">Swell</div><div className="text-sm text-salt font-medium">{conditions.waveHeight || "—"} @ {conditions.wavePeriod || "—"}</div></div>
                  <div><div className="text-xs text-salt/40 mb-1">Wind</div><div className="text-sm text-salt font-medium">{conditions.windSpeed || "—"} {conditions.windDir || ""}{conditions.windGust ? ` (G ${conditions.windGust})` : ""}</div></div>
                  <div><div className="text-xs text-salt/40 mb-1">Water Temp</div><div className="text-sm text-salt font-medium">{conditions.waterTemp ? `${conditions.waterTemp}\u00B0F` : "—"}</div></div>
                </div>
              ) : (
                <div className="text-sm text-salt/40">{conditionsLoading ? "Fetching..." : "No data"}</div>
              )}
            </div>

            {/* Headcount summary */}
            {s && (
              <div className="bg-ocean/20 rounded-xl p-4 mb-6 text-sm text-salt/60">
                <strong className="text-salt">{s.registered} registered</strong> ({s.diving_registered} diving, {s.beach_registered} beach) · <strong className="text-seafoam">{s.confirmed} confirmed</strong>
                {s.rsvps_without_waiver > 0 && <span className="text-coral"> · {s.rsvps_without_waiver} missing waiver</span>}
              </div>
            )}

            {/* Note */}
            <div className="mb-6">
              <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">Custom Note (optional)</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a personal note..." rows={3} className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-xl text-salt placeholder:text-salt/30 focus:outline-none focus:border-teal/40 resize-none text-sm" />
            </div>

            {/* Send buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button onClick={() => setConfirmType("go")} disabled={sending} className="py-4 bg-seafoam text-deep font-bold rounded-xl text-lg hover:bg-seafoam/80 transition-colors disabled:opacity-50 cursor-pointer border-none">Send GO</button>
              <button onClick={() => setConfirmType("nogo")} disabled={sending} className="py-4 bg-coral text-salt font-bold rounded-xl text-lg hover:bg-coral/80 transition-colors disabled:opacity-50 cursor-pointer border-none">Send NO-GO</button>
            </div>

            {/* Preview links */}
            <div className="flex justify-center gap-6 mb-6">
              <a href={`/api/saturday-blast?preview=true&type=go&secret=${encodeURIComponent(secret)}`} target="_blank" className="text-xs text-teal/50 hover:text-teal underline underline-offset-2">Preview GO</a>
              <a href={`/api/saturday-blast?preview=true&type=nogo&secret=${encodeURIComponent(secret)}`} target="_blank" className="text-xs text-teal/50 hover:text-teal underline underline-offset-2">Preview NO-GO</a>
              <a href="/api/conditions-card" target="_blank" className="text-xs text-teal/50 hover:text-teal underline underline-offset-2">IG Story card</a>
            </div>

            {sending && <div className="text-center py-4 text-sm text-salt/60">Sending blast...</div>}
            {status && (
              <div className={`rounded-xl p-4 text-sm ${status.type === "success" ? "bg-seafoam/15 border border-seafoam/30 text-seafoam" : "bg-coral/15 border border-coral/30 text-coral"}`}>
                {status.message}
              </div>
            )}
          </>
        )}

        {/* Refresh */}
        <div className="text-center mt-8">
          <button onClick={fetchDashboard} className="text-xs text-teal/40 hover:text-teal cursor-pointer bg-transparent border-none">Refresh data</button>
        </div>

        {/* Confirmation Dialog */}
        {confirmType && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-deep border border-teal/20 rounded-2xl p-6 max-w-sm w-full">
              <h2 className="text-lg font-serif text-salt mb-3">{confirmType === "go" ? "Send GO email?" : "Send NO-GO email?"}</h2>
              <p className="text-sm text-salt/60 mb-6 leading-relaxed">
                {confirmType === "go" ? "This will send the Saturday GO blast with live conditions to all tagged subscribers." : "This will notify subscribers that Saturday is called off."}
                {note.trim() ? " Your note will be included." : ""}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmType(null)} className="flex-1 py-3 border border-teal/20 text-salt/60 rounded-xl hover:bg-ocean/20 transition-colors text-sm cursor-pointer bg-transparent">Cancel</button>
                <button onClick={() => handleSend(confirmType)} className={`flex-1 py-3 font-semibold rounded-xl transition-colors text-sm cursor-pointer border-none ${confirmType === "go" ? "bg-seafoam text-deep hover:bg-seafoam/80" : "bg-coral text-salt hover:bg-coral/80"}`}>
                  {confirmType === "go" ? "Confirm GO" : "Confirm NO-GO"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color = "text-salt" }: { label: string; value: number; sub?: string; color?: string }) {
  return (
    <div className="bg-ocean/30 border border-teal/10 rounded-xl p-4 text-center">
      <div className={`font-serif text-2xl ${color}`}>{value}</div>
      <div className="text-[11px] text-salt/40 uppercase tracking-wider font-medium mt-1">{label}</div>
      {sub && <div className="text-[10px] text-salt/25 mt-0.5">{sub}</div>}
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-2 mb-3">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase">{title}</div>
        <span className="text-[11px] text-salt/25">{count}</span>
      </div>
      {children}
    </div>
  );
}
