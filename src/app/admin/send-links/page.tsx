"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SECRET = "ljfc";

export default function SendLinksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep flex items-center justify-center text-white/40">Loading...</div>}>
      <SendLinksContent />
    </Suspense>
  );
}

function SendLinksContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [emailsText, setEmailsText] = useState("");
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<{ email: string; status: string; error?: string }[] | null>(null);

  useEffect(() => {
    if (key === SECRET) setAuthed(true);
  }, [key]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <div className="bg-white/5 rounded-2xl p-8 w-full max-w-sm">
          <h1 className="font-serif text-xl text-white mb-4">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && password === SECRET && setAuthed(true)}
            placeholder="Password"
            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm mb-3"
          />
          <button
            onClick={() => password === SECRET && setAuthed(true)}
            className="w-full px-4 py-2.5 rounded-full bg-seafoam text-deep text-sm font-semibold"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  const emails = emailsText
    .split(/[\n,]+/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0 && e.includes("@"));

  async function handleSend() {
    if (emails.length === 0) return;
    setSending(true);
    setResults(null);

    const res = await fetch(`/api/admin/send-links?key=${SECRET}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails }),
    });
    const data = await res.json();
    setResults(data.results || []);
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-deep">
      <div className="px-6 py-8">
        <div className="max-w-lg mx-auto">
          <Link href={`/admin?key=${SECRET}`} className="text-[11px] text-seafoam/60 no-underline hover:text-seafoam">
            ← Admin Hub
          </Link>
          <h1 className="font-serif text-2xl text-white mt-1 mb-2">Send Onboarding Links</h1>
          <p className="text-white/40 text-sm mb-6">
            Paste student emails below (one per line or comma-separated). Each gets a welcome email with a magic link that drops them straight into the 3-step onboarding flow.
            If they don&apos;t have a student record yet, one is created automatically.
          </p>

          <div className="bg-white/5 rounded-2xl p-5 space-y-4">
            <div>
              <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-2">Student Emails</div>
              <textarea
                value={emailsText}
                onChange={(e) => setEmailsText(e.target.value)}
                placeholder={"student1@email.com\nstudent2@email.com\nstudent3@email.com\nstudent4@email.com"}
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm resize-none font-mono focus:outline-none focus:border-seafoam/40"
              />
              {emails.length > 0 && (
                <div className="text-[10px] text-seafoam/60 mt-1">
                  {emails.length} valid email{emails.length !== 1 ? "s" : ""} detected
                </div>
              )}
            </div>

            <button
              onClick={handleSend}
              disabled={sending || emails.length === 0}
              className="w-full px-5 py-3 rounded-full bg-seafoam text-deep text-sm font-semibold hover:bg-seafoam/80 transition-colors disabled:opacity-50"
            >
              {sending ? "Sending..." : `Send ${emails.length} onboarding link${emails.length !== 1 ? "s" : ""}`}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="mt-6 bg-white/5 rounded-2xl p-5">
              <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-3">Results</div>
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-white font-mono">{r.email}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      r.status === "sent" ? "bg-seafoam/20 text-seafoam" :
                      r.status === "skipped" ? "bg-sun/20 text-sun" :
                      "bg-coral/20 text-coral"
                    }`}>
                      {r.status === "sent" ? "Sent ✓" : r.status === "skipped" ? "Skipped" : `Error: ${r.error}`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[10px] text-white/20">
                {results.filter((r) => r.status === "sent").length} of {results.length} sent successfully
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
