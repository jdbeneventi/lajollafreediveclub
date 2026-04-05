"use client";

import { useState } from "react";
import Link from "next/link";

const SECRET = "ljfc";

interface SiteNode {
  path: string;
  label: string;
  type: "page" | "api" | "admin" | "gated";
  meta?: string;
  children?: SiteNode[];
}

const siteTree: SiteNode[] = [
  {
    path: "/", label: "Homepage", type: "page", meta: "Hero, tools, programs, testimonials, Camp CTA",
    children: [],
  },
  {
    path: "/programs", label: "Programs & Courses", type: "page", meta: "AIDA 1/2/3 details, pricing, upcoming dates, Saturday community",
    children: [
      { path: "/contact/courses", label: "Course Inquiry Form", type: "page", meta: "Formspree, supports ?course= param" },
    ],
  },
  {
    path: "/calendar", label: "Course Calendar", type: "page", meta: "Supabase-powered, revalidates every 60s",
    children: [],
  },
  {
    path: "/saturday-sessions", label: "Saturday Sessions", type: "page", meta: "Hero, 3 phases, 3 options, location, RSVP",
    children: [
      { path: "/saturday-sessions/confirm", label: "Friday Confirmation", type: "page", meta: "Email + diving toggle from Friday blast" },
    ],
  },
  {
    path: "/camp-garibaldi", label: "Camp Garibaldi", type: "page", meta: "Light theme, Fraunces font, own nav, brand assets",
    children: [
      { path: "/camp-garibaldi/register", label: "Camp Registration", type: "page", meta: "5-step form → Supabase + Resend" },
      { path: "/camp-garibaldi/waiver", label: "Camp Waiver", type: "page", meta: "Signature pad, PDF generation" },
      { path: "/camp-garibaldi/charter-funding", label: "Charter Funding Guide", type: "gated", meta: "PCA enrichment fund details" },
    ],
  },
  {
    path: "/conditions", label: "Live Conditions", type: "page", meta: "5-factor weighted scoring, buoy + cam + tide + wind",
    children: [],
  },
  {
    path: "/map", label: "Underwater Field Guide", type: "page", meta: "10 dive sites, 8 depth zones, 50+ species" },
  { path: "/tides", label: "Tide Calendar", type: "page", meta: "7-day NOAA predictions with best dive windows" },
  { path: "/gear", label: "Gear Guide", type: "page", meta: "Wetsuit by temp, equipment recommendations" },
  {
    path: "/blog", label: "The Journal", type: "page", meta: "14 blog posts",
    children: [
      { path: "/blog/[slug]", label: "Blog Post", type: "page", meta: "Individual post template" },
      { path: "/blog/state-anchors", label: "State Anchors (interactive)", type: "page" },
    ],
  },
  { path: "/about", label: "About / Story", type: "page", meta: "Joshua's story, credentials, FAQ" },
  {
    path: "/contact", label: "Contact", type: "page", meta: "General inquiry via Formspree",
    children: [
      { path: "/contact/courses", label: "Course Inquiry", type: "page", meta: "Supports ?course= param" },
      { path: "/contact/camp", label: "Camp Inquiry", type: "page" },
    ],
  },
  { path: "/waiver", label: "Digital Waiver", type: "page", meta: "3-step: info → medical → sign. PDF via jsPDF + Resend" },
  { path: "/community", label: "Community / Partners", type: "page" },
  {
    path: "/events/big-blue-night", label: "Big Blue Movie Night", type: "page", meta: "Apr 25 event page",
  },
  { path: "/saturday-sessions", label: "Saturday Landing (→ RSVP)", type: "page" },
  {
    path: "/science", label: "ORIGIN Protocol", type: "gated", meta: "Password: ljfc",
  },
  {
    path: "/education", label: "Education Programs", type: "gated", meta: "Password: ljfc",
    children: [
      { path: "/education/partners", label: "Education Partners", type: "page" },
    ],
  },
  { path: "/students", label: "Student Portal", type: "gated", meta: "Password: ljfc-coach / ljfc" },
  { path: "/ohpc/plan", label: "OHPC Action Plan", type: "gated", meta: "Password: ljfc" },
  { path: "/shop", label: "Shop (placeholder)", type: "page" },
  { path: "/offline", label: "Offline Fallback", type: "page" },
];

const adminTree: SiteNode[] = [
  { path: "/admin", label: "Admin Hub", type: "admin", meta: "Central dashboard, password: ljfc" },
  { path: "/admin/calendar", label: "Calendar Manager", type: "admin", meta: "CRUD events → Supabase" },
  { path: "/admin/registrations", label: "Camp Registrations", type: "admin", meta: "View signups from Supabase" },
  { path: "/admin/partners", label: "Partner Network", type: "admin", meta: "Track outreach & relationships" },
  { path: "/admin/partners/add", label: "Add Partner", type: "admin" },
  { path: "/admin/economics", label: "Revenue Calculator", type: "admin" },
  { path: "/admin/curriculum", label: "Curriculum Planner", type: "admin", meta: "NGSS-aligned session builder" },
  { path: "/admin/sitemap", label: "Site Map (this page)", type: "admin" },
  { path: "/saturday", label: "Saturday Dashboard", type: "admin", meta: "RSVPs, confirmations, headcount, Go/No-Go blast" },
];

const apiTree: SiteNode[] = [
  { path: "/api/conditions", label: "Buoy Data", type: "api", meta: "NDBC 46254 + LJPC1 wind" },
  { path: "/api/visibility", label: "Visibility AI", type: "api", meta: "Scripps cam analysis via Anthropic" },
  { path: "/api/watertemp", label: "Water Temp", type: "api", meta: "NDBC 46254 + seasonal fallback" },
  { path: "/api/forecast", label: "Marine Forecast", type: "api", meta: "NWS PZZ740" },
  { path: "/api/tides", label: "Tide Predictions", type: "api", meta: "NOAA CO-OPS 9410230" },
  { path: "/api/almanac", label: "Moon & Seasonal", type: "api", meta: "Moon phase, grunion, events" },
  { path: "/api/ocean-intel", label: "Ocean Intel", type: "api", meta: "iNaturalist + Reddit sightings" },
  { path: "/api/local-intel", label: "Local Intel", type: "api", meta: "Aggregated alerts" },
  { path: "/api/water-quality", label: "Water Quality", type: "api" },
  { path: "/api/conditions-card", label: "IG Story Card", type: "api", meta: "SVG conditions card" },
  { path: "/api/daily-email", label: "Daily Email", type: "api", meta: "Cron 6am PT → Kit broadcast" },
  { path: "/api/friday-reminder", label: "Friday Reminder", type: "api", meta: "Cron Fri 6am PT → Resend to Joshua" },
  { path: "/api/saturday-blast", label: "Saturday Blast", type: "api", meta: "Manual Go/No-Go → Kit" },
  { path: "/api/saturday-rsvp", label: "Saturday RSVP", type: "api", meta: "→ Supabase + Kit + Resend" },
  { path: "/api/saturday-confirm", label: "Saturday Confirm", type: "api", meta: "→ Supabase + Resend" },
  { path: "/api/saturday-dashboard", label: "Saturday Data", type: "api", meta: "Dashboard JSON endpoint" },
  { path: "/api/calendar", label: "Calendar CRUD", type: "api", meta: "GET public / POST admin" },
  { path: "/api/calendar/seed", label: "Calendar Seed", type: "api", meta: "Import from code → Supabase" },
  { path: "/api/camp-registration", label: "Camp Registration", type: "api", meta: "→ Supabase + Resend + Formspree" },
  { path: "/api/camp-waiver", label: "Camp Waiver", type: "api", meta: "PDF + Resend" },
  { path: "/api/waiver", label: "General Waiver", type: "api", meta: "PDF + Resend + Google Sheet + Supabase" },
  { path: "/api/students", label: "Student Portal", type: "api", meta: "Google Sheet backend" },
];

const typeStyles: Record<string, { bg: string; text: string; label: string }> = {
  page: { bg: "bg-seafoam/15", text: "text-seafoam", label: "Page" },
  api: { bg: "bg-teal/15", text: "text-teal", label: "API" },
  admin: { bg: "bg-coral/15", text: "text-coral", label: "Admin" },
  gated: { bg: "bg-sun/15", text: "text-sun", label: "Gated" },
};

function TreeNode({ node, depth = 0 }: { node: SiteNode; depth?: number }) {
  const style = typeStyles[node.type];
  return (
    <>
      <div className={`flex items-start gap-3 py-2 ${depth > 0 ? "ml-8 border-l border-white/[0.06] pl-4" : ""}`}>
        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold shrink-0 mt-0.5 ${style.bg} ${style.text}`}>
          {style.label}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link href={node.path} className="text-white text-sm font-medium no-underline hover:text-seafoam transition-colors">
              {node.label}
            </Link>
            <code className="text-white/20 text-[10px] hidden sm:inline">{node.path}</code>
          </div>
          {node.meta && <p className="text-white/25 text-[11px] mt-0.5">{node.meta}</p>}
        </div>
      </div>
      {node.children?.map(child => (
        <TreeNode key={child.path} node={child} depth={depth + 1} />
      ))}
    </>
  );
}

function SitemapContent() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-4">
        <form onSubmit={(e) => { e.preventDefault(); if (password === SECRET) setAuthed(true); }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-2">Admin</div>
            <h1 className="text-2xl font-serif text-salt">Site Map</h1>
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter secret" className="w-full px-4 py-3 bg-ocean/50 border border-teal/20 rounded-lg text-salt placeholder:text-salt/30 focus:outline-none focus:border-teal/50 mb-4" />
          <button type="submit" className="w-full py-3 bg-teal text-salt font-semibold rounded-lg hover:bg-teal/80 transition-colors">Authenticate</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">Admin</div>
            <h1 className="text-2xl font-serif text-salt">Site Map</h1>
            <p className="text-salt/30 text-xs mt-1">40 pages · 22 API routes · 9 admin pages</p>
          </div>
          <Link href="/admin" className="text-teal text-xs no-underline hover:text-salt">← Admin hub</Link>
        </div>

        {/* Legend */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {Object.entries(typeStyles).map(([key, style]) => (
            <span key={key} className={`px-2.5 py-1 rounded text-[10px] font-semibold ${style.bg} ${style.text}`}>
              {style.label}
            </span>
          ))}
        </div>

        {/* Public Pages */}
        <div className="mb-10">
          <h2 className="text-[10px] text-seafoam/40 font-medium tracking-[0.2em] uppercase mb-4">Public Pages</h2>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 divide-y divide-white/[0.04]">
            {siteTree.map(node => (
              <TreeNode key={node.path + node.label} node={node} />
            ))}
          </div>
        </div>

        {/* Admin Pages */}
        <div className="mb-10">
          <h2 className="text-[10px] text-coral/40 font-medium tracking-[0.2em] uppercase mb-4">Admin & Dashboards</h2>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 divide-y divide-white/[0.04]">
            {adminTree.map(node => (
              <TreeNode key={node.path} node={node} />
            ))}
          </div>
        </div>

        {/* API Routes */}
        <div className="mb-10">
          <h2 className="text-[10px] text-teal/40 font-medium tracking-[0.2em] uppercase mb-4">API Routes</h2>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 divide-y divide-white/[0.04]">
            {apiTree.map(node => (
              <TreeNode key={node.path} node={node} />
            ))}
          </div>
        </div>

        {/* Infrastructure */}
        <div className="mb-10">
          <h2 className="text-[10px] text-white/20 font-medium tracking-[0.2em] uppercase mb-4">Infrastructure</h2>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-xs text-white/30 space-y-2">
            <div><strong className="text-white/50">Hosting:</strong> Vercel (auto-deploy from GitHub on push)</div>
            <div><strong className="text-white/50">Domain:</strong> lajollafreediveclub.com (Cloudflare DNS)</div>
            <div><strong className="text-white/50">Database:</strong> Supabase (bvfxmqysquthijsntbnh) — calendar_events, camp_registrations, saturday_members, saturday_rsvps, saturday_confirmations</div>
            <div><strong className="text-white/50">Email:</strong> Resend (transactional) + Kit/ConvertKit (broadcasts)</div>
            <div><strong className="text-white/50">Forms:</strong> Formspree (backup)</div>
            <div><strong className="text-white/50">AI:</strong> Anthropic API (underwater visibility analysis)</div>
            <div><strong className="text-white/50">Data:</strong> NDBC buoy 46254, LJPC1 wind, NOAA tides 9410230, NWS forecast, iNaturalist, Reddit</div>
            <div><strong className="text-white/50">Crons:</strong> Daily email (6am PT daily), Friday reminder (6am PT Fridays)</div>
            <div><strong className="text-white/50">Analytics:</strong> Google Analytics 4 (G-X0ZXTHKTKK)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SitemapPage() {
  return <SitemapContent />;
}
