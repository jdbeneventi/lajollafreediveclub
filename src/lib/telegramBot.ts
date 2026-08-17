import { supabase } from "@/lib/supabase";
import { sendTelegram } from "@/lib/telegram";
import { getScheduleContext } from "@/lib/schedule";
import { buildDemandReport, type DemandInquiry } from "@/lib/demandClusters";
import { actionLink, type ActAction } from "@/lib/actionTokens";
import { getInquiry, draftInquiryReply } from "@/lib/inquiryReply";
import { syncGmail, isGmailSyncConfigured } from "@/lib/gmailSync";
import { syncStripe, isStripeSyncConfigured } from "@/lib/stripeSync";
import { enrichInquiry } from "@/lib/extractInquiryFacts";

/**
 * The LJFC Telegram agent's brain — everything the digest knows, on demand,
 * from Joshua's phone.
 *
 * Commands are deterministic reads (or explicitly bounded actions); free
 * text goes to Claude with a live snapshot of the pipeline + schedule as
 * context, so answers are grounded in data rather than memory. The bot
 * NEVER sends student email itself: /draft returns the draft plus a signed
 * /admin/act link, and the human tap on that page is the send. Same trust
 * ladder as the digest.
 */

const BASE = "https://lajollafreediveclub.com";
const ACTIVE = new Set(["new", "replied", "quoted", "deposit_sent"]);

const HELP = `LJFC agent — what I know is live from the site.

/pipeline — status counts + who's waiting on you
/clusters — who can share a course, and where it fits
/schedule — courses, seats left, open weekends
/draft <name> — AI reply draft + a one-tap send link
/act <name> — mark-replied / archive / draft links
/sync — run Gmail + Stripe + extraction sync now

Or just ask in plain words — "who wants AIDA 2 in September?", "when's my next free weekend?", "how many people are waiting on me?"`;

// ─── Data snapshot (shared by commands + free text) ───────────────────────

async function loadInquiries() {
  const { data } = await supabase
    .from("course_inquiries")
    .select(
      "id, first_name, last_name, email, course, status, created_at, preferred_dates, group_size, parsed_headcount, parsed_start_date, parsed_end_date, date_flexibility, last_email_in_at, last_email_out_at, ai_facts",
    )
    .eq("archived", false)
    .order("created_at", { ascending: false });
  return data || [];
}

const fmtDay = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const todayPT = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });

// ─── Commands ─────────────────────────────────────────────────────────────

async function cmdPipeline(): Promise<string> {
  const rows = await loadInquiries();
  const active = rows.filter((r) => ACTIVE.has(r.status));
  const counts = new Map<string, number>();
  for (const r of active) counts.set(r.status, (counts.get(r.status) || 0) + 1);
  const people = active.reduce((s, r) => s + (r.parsed_headcount ?? 1), 0);

  const waiting = active.filter(
    (r) =>
      r.last_email_in_at &&
      (!r.last_email_out_at ||
        new Date(r.last_email_in_at) > new Date(r.last_email_out_at)),
  );

  const lines = [
    `Pipeline: ${active.length} active inquiries ≈ ${people} people`,
    ...Array.from(counts.entries()).map(([s, n]) => `  ${s}: ${n}`),
  ];
  if (waiting.length > 0) {
    lines.push("", `Waiting on you (they emailed last):`);
    for (const r of waiting.slice(0, 8)) {
      lines.push(
        `  ${r.first_name} — ${String(r.course).split("—")[0].trim()} (emailed ${fmtDay(String(r.last_email_in_at).slice(0, 10))})`,
      );
    }
  }
  lines.push("", `Pipeline UI: ${BASE}/admin/inquiries`);
  return lines.join("\n");
}

async function cmdClusters(): Promise<string> {
  const [rows, ctx] = await Promise.all([loadInquiries(), getScheduleContext(90)]);
  const demand = buildDemandReport(
    rows as unknown as DemandInquiry[],
    ctx.courses,
    ctx.openWeekends,
    todayPT(),
  );
  if (demand.clusters.length === 0 && demand.flexiblePools.length === 0) {
    return "No demand clusters right now.";
  }
  const lines: string[] = [];
  for (const c of demand.clusters.slice(0, 6)) {
    const names = c.members
      .map((m) =>
        m.parsed_headcount && m.parsed_headcount > 1
          ? `${m.first_name}(${m.parsed_headcount})`
          : m.first_name,
      )
      .join(" + ");
    const fit = c.matchedEvent
      ? `fits ${c.matchedEvent.title} ${fmtDay(c.matchedEvent.date)}${c.matchedEvent.seatsLeft != null ? ` — ${c.matchedEvent.seatsLeft} seats left` : ""}`
      : c.suggestedWeekend
        ? `open weekend ${fmtDay(c.suggestedWeekend.friday)}–${fmtDay(c.suggestedWeekend.sunday)}`
        : "no open weekend in window";
    lines.push(
      `${c.course}: ${names} — ${c.peopleExact ? "" : "≥"}${c.people} people, ${fmtDay(c.windowStart)}–${fmtDay(c.windowEnd)} · ${fit}`,
    );
  }
  for (const p of demand.flexiblePools) {
    lines.push(`${p.course} flexible pool: ${p.people} people, any date (${p.names.join(", ")})`);
  }
  if (demand.staleActive.length > 0) {
    lines.push(`\n${demand.staleActive.length} inquiries have lapsed windows — see today's digest to clear them.`);
  }
  return lines.join("\n");
}

async function cmdSchedule(): Promise<string> {
  const ctx = await getScheduleContext(90);
  const lines: string[] = [];
  if (ctx.courses.length === 0) {
    lines.push("No courses on the calendar in the next 90 days.");
  } else {
    lines.push("Scheduled:");
    for (const c of ctx.courses) {
      const range = c.end_date ? `${fmtDay(c.date)}–${fmtDay(c.end_date)}` : fmtDay(c.date);
      const seats =
        c.seatsLeft != null ? `${c.seatsLeft}/${c.capacity} seats left` : `${c.enrolled} enrolled`;
      lines.push(`  ${c.title} · ${range} · ${seats}`);
    }
  }
  lines.push("", "Open weekends:");
  for (const w of ctx.openWeekends.slice(0, 6)) {
    const note = w.personalNotes.length > 0 ? ` (you have: ${w.personalNotes[0]})` : "";
    lines.push(`  ${fmtDay(w.friday)}–${fmtDay(w.sunday)}${note}`);
  }
  if (ctx.busy.length === 0 && !process.env.PERSONAL_ICS_URLS) {
    lines.push("", "Personal calendars not connected (PERSONAL_ICS_URLS).");
  }
  return lines.join("\n");
}

async function cmdSync(): Promise<string> {
  const lines: string[] = [];
  if (isGmailSyncConfigured()) {
    const g = await syncGmail(30);
    lines.push(
      g.ok
        ? `Gmail: ${g.addressesChecked} addresses, ${g.inboundMatched} inbound, ${g.outboundMatched} outbound, ${g.advancedToReplied} auto-marked replied`
        : `Gmail sync failed: ${g.reason}`,
    );
  } else {
    lines.push("Gmail sync not configured.");
  }
  if (isStripeSyncConfigured()) {
    const s = await syncStripe(90);
    lines.push(
      s.ok
        ? `Stripe: ${s.checked} checked, ${s.advancedToPaid} marked paid${s.nonCoursePayments ? `, ${s.nonCoursePayments} non-course payment(s) ignored` : ""}`
        : `Stripe sync failed: ${s.reason}`,
    );
  } else {
    lines.push("Stripe sync not configured.");
  }
  const { data: unprocessed } = await supabase
    .from("course_inquiries")
    .select(
      "id, created_at, course, experience, preferred_dates, group_size, message, parsed_start_date, parsed_end_date",
    )
    .eq("archived", false)
    .is("ai_facts", null)
    .limit(5);
  if (unprocessed && unprocessed.length > 0) {
    const results = await Promise.all(
      unprocessed.map((row) => enrichInquiry(row, "backfill")),
    );
    lines.push(`Extraction: ${results.filter((r) => r === "enriched").length}/${unprocessed.length} processed`);
  } else {
    lines.push("Extraction: all inquiries processed.");
  }
  return lines.join("\n");
}

/** Find one active inquiry by (partial) first name; describe ambiguity. */
async function findByName(
  name: string,
): Promise<{ row?: Record<string, unknown>; message?: string }> {
  if (!name) return { message: "Give me a name — e.g. /draft Bruce" };
  const rows = await loadInquiries();
  const matches = rows.filter(
    (r) =>
      ACTIVE.has(r.status) &&
      `${r.first_name} ${r.last_name || ""}`.toLowerCase().includes(name.toLowerCase()),
  );
  if (matches.length === 0) return { message: `No active inquiry matching "${name}".` };
  if (matches.length > 1) {
    return {
      message:
        `Several match "${name}":\n` +
        matches
          .slice(0, 6)
          .map((m) => `  ${m.first_name} ${m.last_name || ""} — ${String(m.course).split("—")[0].trim()} (${m.status})`)
          .join("\n") +
        "\nBe more specific (add a last name).",
    };
  }
  return { row: matches[0] as unknown as Record<string, unknown> };
}

async function cmdDraft(name: string): Promise<string> {
  const found = await findByName(name);
  if (!found.row) return found.message!;
  const inquiry = await getInquiry(String(found.row.id));
  if (!inquiry) return "Inquiry vanished — check the pipeline.";
  const result = await draftInquiryReply(inquiry);
  if (!result.ok) return `Draft failed: ${result.error}`;
  const link = actionLink(BASE, String(inquiry.id), "draft");
  return [
    `Draft for ${inquiry.first_name} (${inquiry.email}):`,
    "",
    `Subject: ${result.subject}`,
    "",
    result.body,
    "",
    link
      ? `Review & send (one tap): ${link}`
      : "(signing unavailable — send from the pipeline UI)",
  ].join("\n");
}

async function cmdAct(name: string): Promise<string> {
  const found = await findByName(name);
  if (!found.row) return found.message!;
  const id = String(found.row.id);
  const labels: Array<[ActAction, string]> = [
    ["draft", "Draft & send a reply"],
    ["replied", "Mark replied"],
    ["archive", "Archive"],
  ];
  const lines = [`${found.row.first_name} — ${String(found.row.course).split("—")[0].trim()} (${found.row.status}):`];
  for (const [action, label] of labels) {
    const url = actionLink(BASE, id, action);
    if (url) lines.push(`${label}: ${url}`);
  }
  return lines.join("\n");
}

// ─── Free text → Claude, grounded in the live snapshot ────────────────────

async function askClaude(question: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return "ANTHROPIC_API_KEY not configured.";

  const [rows, ctx] = await Promise.all([loadInquiries(), getScheduleContext(90)]);
  const demand = buildDemandReport(
    rows as unknown as DemandInquiry[],
    ctx.courses,
    ctx.openWeekends,
    todayPT(),
  );

  const compact = rows
    .filter((r) => ACTIVE.has(r.status))
    .map((r) => ({
      name: `${r.first_name} ${r.last_name || ""}`.trim(),
      course: String(r.course).split("—")[0].trim(),
      status: r.status,
      people: r.parsed_headcount ?? null,
      window:
        r.parsed_start_date && r.parsed_end_date
          ? `${r.parsed_start_date}..${r.parsed_end_date}`
          : null,
      flex: r.date_flexibility ?? null,
      lastIn: r.last_email_in_at ? String(r.last_email_in_at).slice(0, 10) : null,
      lastOut: r.last_email_out_at ? String(r.last_email_out_at).slice(0, 10) : null,
      note:
        (r.ai_facts as { facts?: { availability_note?: string } } | null)?.facts
          ?.availability_note ?? null,
    }));

  const context = {
    today: todayPT(),
    activeInquiries: compact,
    schedule: {
      courses: ctx.courses,
      openWeekends: ctx.openWeekends.slice(0, 8),
    },
    clusters: demand.clusters.slice(0, 8).map((c) => ({
      course: c.course,
      names: c.members.map((m) => m.first_name),
      people: c.people,
      window: `${c.windowStart}..${c.windowEnd}`,
      fitsEvent: c.matchedEvent?.title ?? null,
    })),
    flexiblePools: demand.flexiblePools,
  };

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-5",
        max_tokens: 3000,
        system: `You are the La Jolla Freedive Club operations agent, talking to Joshua (the owner) on Telegram. Answer from the DATA payload only — never invent inquiries, dates, or numbers; say plainly when the data doesn't contain the answer. Plain text only (no markdown syntax). Be concise and phone-readable: short lines, no preamble. When an action would help, mention the matching command (/draft Name, /act Name, /schedule).`,
        messages: [
          {
            role: "user",
            content: `DATA:\n${JSON.stringify(context)}\n\nQUESTION: ${question}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[telegram-bot] Anthropic error:", await res.text());
      return "Couldn't reach the model — try again in a minute.";
    }
    const data = await res.json();
    if (data.stop_reason === "refusal") return "I can't help with that one.";
    const text = (data.content as Array<{ type: string; text?: string }>)?.find(
      (b) => b.type === "text",
    )?.text;
    return text || "No answer came back — try rephrasing.";
  } catch (e) {
    console.error("[telegram-bot] ask failed:", e);
    return "Something broke on my end — try again.";
  }
}

// ─── Dispatch ─────────────────────────────────────────────────────────────

export async function handleTelegramMessage(chatId: string | number, text: string) {
  const trimmed = text.trim();
  // Strip @BotName suffixes Telegram appends in some clients.
  const [rawCmd, ...rest] = trimmed.split(/\s+/);
  const cmd = rawCmd.toLowerCase().replace(/@[\w_]+$/, "");
  const arg = rest.join(" ").trim();

  let reply: string;
  try {
    switch (cmd) {
      case "/start":
      case "/help":
        reply = HELP;
        break;
      case "/pipeline":
      case "/status":
        reply = await cmdPipeline();
        break;
      case "/clusters":
        reply = await cmdClusters();
        break;
      case "/schedule":
        reply = await cmdSchedule();
        break;
      case "/sync":
        reply = await cmdSync();
        break;
      case "/draft":
        reply = await cmdDraft(arg);
        break;
      case "/act":
        reply = await cmdAct(arg);
        break;
      default:
        reply = await askClaude(trimmed);
    }
  } catch (e) {
    console.error("[telegram-bot] handler failed:", e);
    reply = "Something broke handling that — check the Vercel logs.";
  }
  await sendTelegram(chatId, reply);
}
