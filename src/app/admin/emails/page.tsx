"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EMAIL_WORKFLOW_STAGES, getEmailWorkflowsByStage, EMAIL_WORKFLOWS, type EmailWorkflowKind } from "@/lib/emailWorkflows";
import { adminLogin, adminSession } from "@/lib/adminLogin";

// Session lives in an httpOnly cookie set by /api/admin/login.
// Kept empty so the inter-page ?key= links below carry no secret.
const SECRET = "";

const KIND_LABELS: Record<EmailWorkflowKind, string> = {
  user: "User action",
  manual: "Manual admin",
  webhook: "Webhook",
  cron: "Cron/manual",
  broadcast: "Broadcast",
};

const KIND_CLASSES: Record<EmailWorkflowKind, string> = {
  user: "border-seafoam/30 text-seafoam bg-seafoam/5",
  manual: "border-sand/30 text-sand bg-sand/5",
  webhook: "border-coral/30 text-coral bg-coral/5",
  cron: "border-white/20 text-white/60 bg-white/[0.03]",
  broadcast: "border-teal/40 text-teal bg-teal/5",
};

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/25 mb-1">{label}</div>
      <div className="text-2xl font-serif text-white">{value}</div>
    </div>
  );
}

function AdminEmailsContent() {
  const params = useSearchParams();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | EmailWorkflowKind>("all");

  useEffect(() => {
    adminSession().then((ok) => { if (ok) setAuthed(true); });
  }, [params]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EMAIL_WORKFLOWS.filter((workflow) => {
      const matchesKind = kind === "all" || workflow.kind === kind;
      const haystack = `${workflow.name} ${workflow.stage} ${workflow.trigger} ${workflow.route} ${workflow.recipients} ${workflow.subject} ${workflow.statusEffect}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      return matchesKind && matchesQuery;
    });
  }, [query, kind]);

  const counts = useMemo(() => {
    return EMAIL_WORKFLOWS.reduce<Record<EmailWorkflowKind, number>>(
      (acc, workflow) => {
        acc[workflow.kind] += 1;
        return acc;
      },
      { user: 0, manual: 0, webhook: 0, cron: 0, broadcast: 0 },
    );
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <div className="max-w-[360px] w-full text-center">
          <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-4">LJFC Internal</div>
          <h1 className="font-serif text-3xl text-white mb-2">Email Workflows</h1>
          <p className="text-white/30 text-sm mb-8">Enter code to continue.</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (await adminLogin(password)) setAuthed(true);
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
            <button type="submit" className="px-6 py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep text-white">
      <div className="max-w-[1120px] mx-auto px-6 py-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href={`/admin?key=${SECRET}`} className="text-xs text-seafoam/60 hover:text-seafoam no-underline">← Admin home</Link>
            <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mt-6 mb-2">Operating registry</div>
            <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] leading-none font-normal">Email <em className="italic text-seafoam">Workflows</em></h1>
            <p className="text-white/35 text-sm mt-3 max-w-[680px]">
              A map of what can go out, why it sends, who receives it, and where you control it. This is intentionally read-only so it clarifies the current system without changing behavior.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-5 gap-3 mb-8">
          <Stat label="Total" value={EMAIL_WORKFLOWS.length} />
          <Stat label="Manual" value={counts.manual} />
          <Stat label="User action" value={counts.user} />
          <Stat label="Cron/manual" value={counts.cron} />
          <Stat label="Broadcast" value={counts.broadcast} />
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 mb-8">
          <div className="grid md:grid-cols-[1fr_auto] gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search route, subject, recipient, trigger..."
              className="w-full rounded-full bg-white/[0.05] border border-white/[0.08] px-5 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-seafoam/40"
            />
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as "all" | EmailWorkflowKind)}
              className="rounded-full bg-deep border border-white/[0.08] px-5 py-3 text-sm text-white outline-none focus:border-seafoam/40"
            >
              <option value="all">All triggers</option>
              <option value="manual">Manual admin</option>
              <option value="user">User action</option>
              <option value="webhook">Webhook</option>
              <option value="cron">Cron/manual</option>
              <option value="broadcast">Broadcast</option>
            </select>
          </div>
          <p className="text-white/25 text-xs mt-3">Showing {filtered.length} of {EMAIL_WORKFLOWS.length} workflows.</p>
        </div>

        <div className="space-y-8">
          {EMAIL_WORKFLOW_STAGES.map((stage) => {
            const workflows = getEmailWorkflowsByStage(stage).filter((workflow) => filtered.includes(workflow));
            if (workflows.length === 0) return null;
            return (
              <section key={stage}>
                <h2 className="text-[10px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-3">{stage}</h2>
                <div className="grid gap-3">
                  {workflows.map((workflow) => (
                    <article key={workflow.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-white font-semibold text-base">{workflow.name}</h3>
                            <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${KIND_CLASSES[workflow.kind]}`}>{KIND_LABELS[workflow.kind]}</span>
                          </div>
                          <p className="text-white/45 text-sm leading-relaxed">{workflow.trigger}</p>
                        </div>
                        <div className="text-xs text-white/30 md:text-right">
                          <div className="text-white/60 font-mono">{workflow.route}</div>
                          <div className="mt-1">Control: {workflow.ownerView}</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-3 mt-4 text-xs">
                        <div className="rounded-xl bg-white/[0.025] border border-white/[0.04] p-3">
                          <div className="text-white/25 uppercase tracking-[0.14em] mb-1">Recipient</div>
                          <div className="text-white/65">{workflow.recipients}</div>
                        </div>
                        <div className="rounded-xl bg-white/[0.025] border border-white/[0.04] p-3">
                          <div className="text-white/25 uppercase tracking-[0.14em] mb-1">Subject</div>
                          <div className="text-white/65">{workflow.subject}</div>
                        </div>
                        <div className="rounded-xl bg-white/[0.025] border border-white/[0.04] p-3">
                          <div className="text-white/25 uppercase tracking-[0.14em] mb-1">State effect</div>
                          <div className="text-white/65">{workflow.statusEffect}</div>
                        </div>
                      </div>

                      {workflow.risk ? (
                        <div className="mt-3 rounded-xl border border-coral/20 bg-coral/5 px-3 py-2 text-xs text-coral/80">
                          Watch: {workflow.risk}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminEmailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep" />}>
      <AdminEmailsContent />
    </Suspense>
  );
}
