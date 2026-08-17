"use client";

import { useState } from "react";

/**
 * Client half of /admin/act — drives the POSTs for the one-tap digest
 * links. Three capabilities, decided by the signed token:
 *
 *   replied  → one button, marks the inquiry replied
 *   archive  → one button, archives it
 *   draft    → generate an AI draft, edit it, send it (send also marks
 *              replied via the shared reply engine)
 *
 * Built phone-first — these links get tapped from the digest email.
 */

interface TokenProps {
  id: string;
  action: "replied" | "archive" | "draft";
  exp: number;
  sig: string;
}

interface InquiryProps {
  name: string;
  email: string;
  course: string;
  status: string;
  preferred_dates: string | null;
  group_size: string | null;
  parsed_headcount: number | null;
  parsed_start_date: string | null;
  parsed_end_date: string | null;
  message: string | null;
}

const ACTION_LABEL: Record<TokenProps["action"], string> = {
  replied: "Mark replied",
  archive: "Archive",
  draft: "Draft a reply",
};

export function ActClient({
  token,
  inquiry,
}: {
  token: TokenProps;
  inquiry: InquiryProps;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(
    null,
  );

  async function post(op: string, extra: Record<string, unknown> = {}) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/inquiries/act", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...token, op, ...extra }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || `Request failed (${res.status})`);
        return null;
      }
      return data;
    } catch {
      setError("Could not reach the server.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  const people =
    inquiry.parsed_headcount != null
      ? `${inquiry.parsed_headcount} ${inquiry.parsed_headcount === 1 ? "person" : "people"}`
      : inquiry.group_size || "party size unknown";
  const window =
    inquiry.parsed_start_date && inquiry.parsed_end_date
      ? inquiry.parsed_start_date === inquiry.parsed_end_date
        ? inquiry.parsed_start_date
        : `${inquiry.parsed_start_date} → ${inquiry.parsed_end_date}`
      : inquiry.preferred_dates || "no dates given";

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-3">
          {ACTION_LABEL[token.action]}
        </div>
        <h1 className="font-serif text-2xl text-white">{inquiry.name}</h1>
        <p className="text-white/40 text-sm mt-1">
          {inquiry.course.split("—")[0].trim()} · {people} · currently{" "}
          {inquiry.status}
        </p>
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 mb-6 text-sm">
        <div className="text-white/60 mb-1">
          <span className="text-white/30">Dates:</span> {window}
        </div>
        {inquiry.message && (
          <div className="text-white/60">
            <span className="text-white/30">Message:</span> {inquiry.message}
          </div>
        )}
      </div>

      {done ? (
        <div className="text-center">
          <p className="text-seafoam text-sm mb-4">{done}</p>
          <a href="/admin/inquiries" className="text-white/40 text-xs underline">
            Open the full pipeline
          </a>
        </div>
      ) : token.action === "draft" ? (
        draft ? (
          <div>
            <input
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              className="w-full px-4 py-3 mb-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam"
            />
            <textarea
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              rows={16}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm leading-relaxed outline-none focus:border-seafoam"
            />
            <button
              disabled={busy}
              onClick={async () => {
                const r = await post("send", {
                  subject: draft.subject,
                  body: draft.body,
                });
                if (r) setDone(`Sent to ${inquiry.email} and marked replied.`);
              }}
              className="w-full py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none disabled:opacity-40"
            >
              {busy ? "Sending…" : `Send to ${inquiry.email}`}
            </button>
          </div>
        ) : (
          <button
            disabled={busy}
            onClick={async () => {
              const r = await post("draft");
              if (r?.subject) setDraft({ subject: r.subject, body: r.body });
            }}
            className="w-full py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none disabled:opacity-40"
          >
            {busy ? "Drafting…" : "Generate draft"}
          </button>
        )
      ) : (
        <button
          disabled={busy}
          onClick={async () => {
            const r = await post(token.action);
            if (r)
              setDone(
                token.action === "archive"
                  ? "Archived."
                  : "Marked replied.",
              );
          }}
          className="w-full py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none disabled:opacity-40"
        >
          {busy ? "Working…" : ACTION_LABEL[token.action]}
        </button>
      )}

      {error && <p className="text-coral/70 text-xs mt-3 text-center">{error}</p>}
    </div>
  );
}
