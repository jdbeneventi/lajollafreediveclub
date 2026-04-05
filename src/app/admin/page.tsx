"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const SECRET = "ljfc";

const ADMIN_PAGES = [
  {
    label: "Invoices & Payments",
    href: "/admin/invoices",
    desc: "Create invoices, send payment links, track payments. Custom amounts + deposits.",
    icon: "💳",
    color: "from-coral to-sun",
  },
  {
    label: "Saturday Dashboard",
    href: "/saturday",
    desc: "This week's RSVPs, confirmations, dive headcount, waiver status, and Go/No-Go blast.",
    icon: "🌊",
    color: "from-ocean to-teal",
  },
  {
    label: "Calendar Manager",
    href: "/admin/calendar",
    desc: "Add, edit, delete course dates and events. Changes go live in ~60 seconds.",
    icon: "📅",
    color: "from-seafoam to-teal",
  },
  {
    label: "Camp Registrations",
    href: "/admin/registrations",
    desc: "Camp Garibaldi signups stored in Supabase. Student info, sessions, medical, charter.",
    icon: "🏕️",
    color: "from-coral to-sun",
  },
  {
    label: "Partner Network",
    href: "/admin/partners",
    desc: "Track partner relationships, follow-ups, and outreach status.",
    icon: "🤝",
    color: "from-teal to-seafoam",
  },
  {
    label: "Revenue Calculator",
    href: "/admin/economics",
    desc: "Model revenue, staffing, charter funding across session types.",
    icon: "💰",
    color: "from-sun to-sand",
  },
  {
    label: "Curriculum Planner",
    href: "/admin/curriculum",
    desc: "Build session plans tied to NGSS standards. Full K-12 standards library.",
    icon: "📋",
    color: "from-coral to-sun",
  },
  {
    label: "Send AIDA Forms",
    href: "/admin/send-forms",
    desc: "Email medical statement + liability release to a student.",
    icon: "📨",
    color: "from-teal to-ocean",
  },
  {
    label: "Site Map",
    href: "/admin/sitemap",
    desc: "Visual tree of all 40 pages, 22 API routes, and infrastructure.",
    icon: "🗺️",
    color: "from-ocean to-deep",
  },
];

const GATED_PAGES = [
  {
    label: "Student Portal",
    href: "/students",
    desc: "Student coaching portal with session logs.",
    icon: "🎓",
  },
  {
    label: "ORIGIN Protocol",
    href: "/science",
    desc: "The breath-first methodology — internal documentation.",
    icon: "🧬",
  },
  {
    label: "OHPC Plan",
    href: "/ohpc/plan",
    desc: "Ocean Health & Policy Council action plan.",
    icon: "📄",
  },
  {
    label: "Education",
    href: "/education",
    desc: "Ocean education programs overview.",
    icon: "🌊",
  },
  {
    label: "Add Partner",
    href: "/admin/partners/add",
    desc: "Submit a new partner to the network tracker.",
    icon: "➕",
  },
];

function AdminContent() {
  const params = useSearchParams();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (params.get("key") === SECRET) setAuthed(true);
  }, [params]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <div className="max-w-[360px] w-full text-center">
          <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-4">
            LJFC Internal
          </div>
          <h1 className="font-serif text-3xl text-white mb-2">Admin</h1>
          <p className="text-white/30 text-sm mb-8">Enter code to continue.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === SECRET) setAuthed(true);
            }}
            className="flex gap-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Code"
              autoFocus
              className="flex-1 px-5 py-3 rounded-full bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/20 text-center tracking-widest"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep">
      <div className="max-w-[900px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-2">
            Internal Dashboard
          </div>
          <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] text-white font-normal">
            LJFC <em className="italic text-seafoam">Admin</em>
          </h1>
          <p className="text-white/30 text-sm mt-2">
            All internal tools and gated pages in one place.
          </p>
        </div>

        {/* Admin Tools */}
        <div className="mb-10">
          <h2 className="text-[10px] text-seafoam/40 font-medium tracking-[0.2em] uppercase mb-4">
            Tools
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {ADMIN_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href + "?key=" + SECRET}
                className="group block bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 no-underline hover:bg-white/[0.06] hover:border-seafoam/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${page.color} flex items-center justify-center text-lg shrink-0`}
                  >
                    {page.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-seafoam transition-colors">
                      {page.label}
                    </h3>
                    <p className="text-white/30 text-xs leading-relaxed">
                      {page.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Gated Pages */}
        <div className="mb-10">
          <h2 className="text-[10px] text-seafoam/40 font-medium tracking-[0.2em] uppercase mb-4">
            Gated Pages
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {GATED_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group flex items-center gap-3 bg-white/[0.02] border border-white/[0.04] rounded-lg px-5 py-4 no-underline hover:bg-white/[0.05] hover:border-white/[0.1] transition-all"
              >
                <span className="text-lg">{page.icon}</span>
                <div>
                  <h3 className="text-white/70 font-medium text-sm group-hover:text-white transition-colors">
                    {page.label}
                  </h3>
                  <p className="text-white/20 text-[11px]">{page.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick reference */}
        <div className="border-t border-white/[0.06] pt-6">
          <p className="text-white/15 text-xs">
            All pages use password: <code className="text-seafoam/30">ljfc</code> · Admin tools pass the key via URL param so you stay authenticated.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep" />}>
      <AdminContent />
    </Suspense>
  );
}
