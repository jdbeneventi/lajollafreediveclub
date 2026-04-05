"use client";

import { useState } from "react";
import Link from "next/link";

const SECRET = "ljfc";

export default function SendFormsPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("AIDA 2");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-4">
        <form onSubmit={(e) => { e.preventDefault(); if (password === SECRET) setAuthed(true); }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-2">Admin</div>
            <h1 className="text-2xl font-serif text-salt">Send AIDA Forms</h1>
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter secret" className="w-full px-4 py-3 bg-ocean/50 border border-teal/20 rounded-lg text-salt placeholder:text-salt/30 focus:outline-none focus:border-teal/50 mb-4" />
          <button type="submit" className="w-full py-3 bg-teal text-salt font-semibold rounded-lg hover:bg-teal/80 transition-colors">Authenticate</button>
        </form>
      </div>
    );
  }

  const handleSend = async () => {
    if (!email) { setStatus({ type: "error", message: "Email is required." }); return; }
    setSending(true);
    setStatus(null);

    try {
      const res = await fetch(`/api/send-forms?secret=${SECRET}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, course }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: `Forms sent to ${email}!` });
        setEmail("");
        setName("");
      } else {
        setStatus({ type: "error", message: data.error || "Failed to send." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error." });
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-deep px-4 py-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">Admin</div>
            <h1 className="text-2xl font-serif text-salt">Send AIDA Forms</h1>
            <p className="text-salt/30 text-xs mt-1">Email medical statement + liability release to a student</p>
          </div>
          <Link href="/admin" className="text-teal text-xs no-underline hover:text-salt">← Admin</Link>
        </div>

        <div className="bg-ocean/30 border border-teal/15 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-salt/50 block mb-1">Student email *</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="student@email.com" className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" />
          </div>
          <div>
            <label className="text-xs text-salt/50 block mb-1">Student name (optional)</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="First Last" className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40 placeholder:text-salt/25" />
          </div>
          <div>
            <label className="text-xs text-salt/50 block mb-1">Course</label>
            <select value={course} onChange={e => setCourse(e.target.value)} className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-lg text-salt text-sm focus:outline-none focus:border-teal/40">
              <option value="AIDA 1">AIDA 1</option>
              <option value="AIDA 2">AIDA 2</option>
              <option value="AIDA 3">AIDA 3</option>
            </select>
          </div>
          <button onClick={handleSend} disabled={sending} className="w-full py-3 bg-seafoam text-deep font-semibold rounded-lg cursor-pointer border-none hover:bg-seafoam/80 transition-colors disabled:opacity-50">
            {sending ? "Sending..." : "Send Forms →"}
          </button>
        </div>

        {status && (
          <div className={`mt-4 rounded-xl p-4 text-sm ${status.type === "success" ? "bg-seafoam/15 border border-seafoam/30 text-seafoam" : "bg-coral/15 border border-coral/30 text-coral"}`}>
            {status.message}
          </div>
        )}

        {/* Quick links to PDFs */}
        <div className="mt-8 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
          <div className="text-[11px] text-salt/30 font-medium tracking-[0.15em] uppercase mb-3">Direct PDF Links</div>
          <div className="space-y-2">
            <a href="/documents/aida-medical-statement.pdf" target="_blank" className="block text-teal text-sm no-underline hover:text-salt transition-colors">
              Medical Statement (fillable PDF) →
            </a>
            <a href="/documents/aida-liability-release.pdf" target="_blank" className="block text-teal text-sm no-underline hover:text-salt transition-colors">
              Liability Release (fillable PDF) →
            </a>
            <a href="/documents/ljfc-waiver.pdf" target="_blank" className="block text-salt/30 text-sm no-underline hover:text-salt transition-colors">
              LJFC Waiver (reference copy) →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
