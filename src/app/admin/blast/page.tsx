"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminLogin, adminSession } from "@/lib/adminLogin";

/**
 * /admin/blast — review-and-send surface for the roster-confirmation blast.
 *
 * "Generate drafts" asks the API to match every active inquiry to a
 * published course date and draft a personalized confirmation. Nothing is
 * sent until Joshua reviews (and optionally edits) the drafts and hits
 * Send — that tap is the authorization, same trust ladder as /admin/act.
 */

interface Candidate {
  id: string;
  name: string;
  email: string;
  status: string;
  course: string;
  target: { title: string; range: string; seatsLeft: number | null } | null;
  subject?: string;
  body?: string;
  error?: string;
}

interface SendResult {
  sent: boolean;
  error?: string;
}

export default function BlastPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [schedule, setSchedule] = useState<
    Array<{ title: string; range: string; seatsLeft: number | null }>
  >([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, SendResult>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    adminSession().then(setAuthed);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (await adminLogin(password)) setAuthed(true);
    else setError("Wrong password");
  }

  const [progress, setProgress] = useState({ done: 0, total: 0 });

  // One 28-draft request blows the 60s function ceiling — fetch the fast
  // match list first, then draft in batches of 6 so results stream in.
  async function generate() {
    setLoading(true);
    setError("");
    setResults({});
    try {
      const res = await fetch("/api/admin/blast?list=true");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const bases: Candidate[] = data.candidates || [];
      setCandidates(bases);
      setSchedule(data.schedule || []);
      const init: Record<string, boolean> = {};
      for (const c of bases) init[c.id] = Boolean(c.target);
      setChecked(init);
      setProgress({ done: 0, total: bases.length });

      const BATCH = 6;
      for (let i = 0; i < bases.length; i += BATCH) {
        const ids = bases.slice(i, i + BATCH).map((c) => c.id);
        try {
          const bres = await fetch(
            `/api/admin/blast?ids=${ids.join(",")}`,
          );
          if (!bres.ok) throw new Error(`HTTP ${bres.status}`);
          const bdata = await bres.json();
          const byId = new Map<string, Candidate>(
            (bdata.candidates || []).map((c: Candidate) => [c.id, c]),
          );
          setCandidates((cs) =>
            cs.map((c) => {
              const d = byId.get(c.id);
              return d
                ? { ...c, subject: d.subject, body: d.body, error: d.error }
                : c;
            }),
          );
        } catch {
          setCandidates((cs) =>
            cs.map((c) =>
              ids.includes(c.id) && !c.subject
                ? { ...c, error: "draft batch failed — re-generate" }
                : c,
            ),
          );
        }
        setProgress({
          done: Math.min(i + BATCH, bases.length),
          total: bases.length,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Draft generation failed");
    } finally {
      setLoading(false);
    }
  }

  function edit(id: string, field: "subject" | "body", value: string) {
    setCandidates((cs) =>
      cs.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  }

  const selected = candidates.filter(
    (c) => checked[c.id] && c.subject && c.body && !results[c.id]?.sent,
  );

  async function sendSelected(mode: "send" | "gmail_draft" = "send") {
    if (selected.length === 0) return;
    const verb =
      mode === "gmail_draft"
        ? `Put ${selected.length} draft${selected.length === 1 ? "" : "s"} in your Gmail (nothing sends)?`
        : `Send ${selected.length} confirmation email${selected.length === 1 ? "" : "s"}? This emails real students.`;
    if (!window.confirm(verb)) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          items: selected.map((c) => ({
            id: c.id,
            subject: c.subject,
            body: c.body,
          })),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (mode === "gmail_draft") {
        setError("");
        window.alert(
          `${data.drafted} draft${data.drafted === 1 ? "" : "s"} now in your Gmail Drafts folder.`,
        );
      } else {
        const map: Record<string, SendResult> = { ...results };
        for (const r of data.results || []) {
          map[r.id] = { sent: r.sent, error: r.error };
        }
        setResults(map);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  if (authed === null) {
    return <div className="p-10 text-deep/50 text-sm">Checking session…</div>;
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto pt-24 px-6">
        <h1 className="font-serif text-2xl mb-6">Blast — sign in</h1>
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

  const sentCount = Object.values(results).filter((r) => r.sent).length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="font-serif text-3xl mb-1">Confirmation blast</h1>
          <p className="text-deep/50 text-sm">
            Drafts a date-confirmation email for every active inquiry. You
            review, edit, and send — nothing goes out without you.
          </p>
        </div>
        <Link href="/admin/inquiries" className="text-teal text-sm no-underline">
          ← Inquiries
        </Link>
      </div>

      {schedule.length > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {schedule.map((s, i) => (
            <span
              key={i}
              className={`text-[11px] rounded-full px-2.5 py-1 font-medium ${
                s.seatsLeft !== null && s.seatsLeft <= 0
                  ? "bg-deep/[0.06] text-deep/40"
                  : "bg-teal/[0.08] text-teal"
              }`}
            >
              {s.title} · {s.range}
              {s.seatsLeft !== null ? ` · ${s.seatsLeft} left` : ""}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 my-6">
        <button
          onClick={generate}
          disabled={loading || sending}
          className="btn btn-primary disabled:opacity-40"
        >
          {loading
            ? progress.total
              ? `Drafting ${progress.done}/${progress.total}…`
              : "Loading pipeline…"
            : candidates.length
              ? "Re-generate drafts"
              : "Generate drafts"}
        </button>
        {candidates.length > 0 && (
          <>
            <button
              onClick={() => sendSelected("send")}
              disabled={sending || selected.length === 0}
              className="btn bg-teal text-white disabled:opacity-40"
            >
              {sending ? "Working…" : `Send ${selected.length} selected`}
            </button>
            <button
              onClick={() => sendSelected("gmail_draft")}
              disabled={sending || selected.length === 0}
              className="btn border border-teal text-teal disabled:opacity-40"
              title="Creates drafts in the business Gmail — you send them yourself"
            >
              → Gmail drafts
            </button>
          </>
        )}
        {sentCount > 0 && (
          <span className="text-sm text-teal font-medium">
            ✓ {sentCount} sent
          </span>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="flex flex-col gap-5">
        {candidates.map((c) => {
          const result = results[c.id];
          return (
            <div
              key={c.id}
              className={`border rounded-xl p-5 ${
                result?.sent
                  ? "border-teal/40 bg-teal/[0.03]"
                  : "border-deep/10"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={Boolean(checked[c.id]) && !result?.sent}
                  disabled={Boolean(result?.sent)}
                  onChange={(e) =>
                    setChecked((m) => ({ ...m, [c.id]: e.target.checked }))
                  }
                  className="w-4 h-4 accent-teal"
                />
                <span className="font-medium text-deep">{c.name}</span>
                <span className="text-deep/40 text-xs">{c.email}</span>
                <span className="text-[10px] uppercase tracking-wider bg-deep/[0.06] text-deep/50 rounded-full px-2 py-0.5">
                  {c.status}
                </span>
                {c.target ? (
                  <span className="text-[11px] bg-teal/[0.08] text-teal rounded-full px-2.5 py-0.5 font-medium">
                    → {c.target.title} · {c.target.range}
                  </span>
                ) : (
                  <span className="text-[11px] bg-amber-500/10 text-amber-700 rounded-full px-2.5 py-0.5">
                    no date matched — invite to pick
                  </span>
                )}
                {result?.sent && (
                  <span className="text-teal text-xs font-semibold ml-auto">
                    ✓ sent
                  </span>
                )}
                {result && !result.sent && (
                  <span className="text-red-600 text-xs ml-auto">
                    {result.error || "failed"}
                  </span>
                )}
              </div>
              {c.error ? (
                <p className="text-red-600 text-sm">
                  Draft failed: {c.error}
                </p>
              ) : (
                <>
                  <input
                    value={c.subject || ""}
                    onChange={(e) => edit(c.id, "subject", e.target.value)}
                    disabled={Boolean(result?.sent)}
                    className="w-full border border-deep/10 rounded-lg px-3 py-2 text-sm font-medium mb-2 disabled:bg-deep/[0.03]"
                  />
                  <textarea
                    value={c.body || ""}
                    onChange={(e) => edit(c.id, "body", e.target.value)}
                    disabled={Boolean(result?.sent)}
                    rows={7}
                    className="w-full border border-deep/10 rounded-lg px-3 py-2 text-sm leading-relaxed disabled:bg-deep/[0.03]"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {candidates.length === 0 && !loading && (
        <p className="text-deep/40 text-sm mt-10">
          No drafts yet — hit “Generate drafts” to build the blast from the
          active pipeline and the published schedule.
        </p>
      )}
    </div>
  );
}
