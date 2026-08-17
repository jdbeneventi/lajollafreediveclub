import { ImapFlow } from "imapflow";
import { supabase } from "@/lib/supabase";

/**
 * Gmail sync — reconciles the inquiry pipeline with what actually happened
 * in Joshua's personal inbox, where inquiry conversations really live.
 *
 * Auth is a Google APP PASSWORD over IMAP (env GMAIL_USER +
 * GMAIL_APP_PASSWORD), not OAuth: Gmail API scopes are "restricted", which
 * for a personal account means either 7-day-expiring refresh tokens
 * (testing mode) or a formal Google security review (production). An app
 * password is created and revoked by Joshua at
 * myaccount.google.com/apppasswords and never touches this repo.
 *
 * Per sync (bounded, no full-mailbox scan):
 *   - Load active inquiry emails (≤ ~60 addresses).
 *   - In the account's All Mail folder, run two targeted IMAP searches per
 *     address inside the window: FROM student (inbound — this also catches
 *     mail students send to addresses that Cloudflare Email Routing
 *     forwards here, since forwarding preserves the From header), and
 *     FROM Joshua TO student (outbound — how he has always replied).
 *   - Store the newest date each way on last_email_in_at/out_at.
 *   - Auto-advance status new → replied when an outbound postdates the
 *     inquiry: the ONLY status the sync ever changes, in the one direction
 *     that is always true (he wrote to them = it was answered). Everything
 *     further stays human-driven.
 *
 * Fail-soft: missing env vars, IMAP/auth errors, or missing columns
 * (migration not run) log and return a summary with `ok: false` — callers
 * (digest, admin endpoint) carry on.
 */

export interface GmailSyncSummary {
  ok: boolean;
  reason?: string;
  addressesChecked: number;
  inboundMatched: number;
  outboundMatched: number;
  advancedToReplied: number;
}

const skip = (reason: string): GmailSyncSummary => ({
  ok: false,
  reason,
  addressesChecked: 0,
  inboundMatched: 0,
  outboundMatched: 0,
  advancedToReplied: 0,
});

interface TrackedInquiry {
  id: string;
  email: string;
  status: string;
  created_at: string;
  last_email_in_at: string | null;
  last_email_out_at: string | null;
}

export function isGmailSyncConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

/**
 * Addresses that count as "Joshua wrote this". The account itself, plus any
 * Gmail "Send mail as" aliases (GMAIL_ALIASES, comma-separated) — a reply
 * sent as joshua@lajollafreediveclub.com carries that From header, not the
 * account's own address, and would otherwise be invisible to the sync.
 */
function ownAddresses(user: string): string[] {
  const aliases = (process.env.GMAIL_ALIASES || "")
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);
  return [user.toLowerCase(), ...aliases];
}

export async function syncGmail(windowDays = 30): Promise<GmailSyncSummary> {
  const user = process.env.GMAIL_USER?.trim();
  // App passwords display as "xxxx xxxx xxxx xxxx" — tolerate pasted spaces.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return skip("GMAIL_USER / GMAIL_APP_PASSWORD not set");

  // Active pipeline addresses — the only mail this sync ever looks for.
  const { data: rows, error } = await supabase
    .from("course_inquiries")
    .select("id, email, status, created_at, last_email_in_at, last_email_out_at")
    .eq("archived", false)
    .in("status", ["new", "replied", "quoted", "deposit_sent"]);
  if (error) {
    console.error("[gmail-sync] inquiry query failed:", error.message);
    return skip(
      /last_email/.test(error.message)
        ? "columns missing — run supabase/email-sync.sql"
        : error.message,
    );
  }

  const tracked = (rows || []) as TrackedInquiry[];
  const byEmail = new Map<string, TrackedInquiry[]>();
  for (const t of tracked) {
    const key = t.email.toLowerCase();
    if (!byEmail.has(key)) byEmail.set(key, []);
    byEmail.get(key)!.push(t);
  }
  if (byEmail.size === 0) {
    return { ok: true, addressesChecked: 0, inboundMatched: 0, outboundMatched: 0, advancedToReplied: 0 };
  }

  const since = new Date(Date.now() - windowDays * 86_400_000);
  const newestIn = new Map<string, Date>(); // address → newest inbound
  const newestOut = new Map<string, Date>(); // address → newest outbound

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  try {
    await client.connect();

    // Find the all-mail folder by special-use flag rather than assuming
    // the English "[Gmail]/All Mail" name.
    const boxes = await client.list();
    const allMail =
      boxes.find((b) => b.specialUse === "\\All")?.path || "[Gmail]/All Mail";

    const lock = await client.getMailboxLock(allMail);
    try {
      const newestDateOf = async (uids: number[]): Promise<Date | null> => {
        if (uids.length === 0) return null;
        let newest: Date | null = null;
        for await (const msg of client.fetch(
          uids.join(","),
          { internalDate: true },
          { uid: true },
        )) {
          if (!msg.internalDate) continue;
          // imapflow types this string | Date; normalize.
          const d =
            msg.internalDate instanceof Date
              ? msg.internalDate
              : new Date(msg.internalDate);
          if (!Number.isNaN(d.getTime()) && (!newest || d > newest)) {
            newest = d;
          }
        }
        return newest;
      };

      for (const address of byEmail.keys()) {
        // Inbound: anything from the student's address in the window.
        const inUids = await client.search(
          { since, from: address },
          { uid: true },
        );
        const inDate = await newestDateOf(inUids || []);
        if (inDate) newestIn.set(address, inDate);

        // Outbound: Joshua → the student, under the account address or any
        // send-as alias. All Mail includes Sent.
        for (const own of ownAddresses(user)) {
          const outUids = await client.search(
            { since, from: own, to: address },
            { uid: true },
          );
          const outDate = await newestDateOf(outUids || []);
          if (outDate) {
            const prev = newestOut.get(address);
            if (!prev || outDate > prev) newestOut.set(address, outDate);
          }
        }
      }
    } finally {
      lock.release();
    }
    await client.logout();
  } catch (e) {
    try {
      await client.logout();
    } catch {}
    console.error(
      "[gmail-sync] IMAP failed:",
      e instanceof Error ? e.message : e,
    );
    return skip(e instanceof Error ? e.message : "IMAP failed");
  }

  // ── Persist: newest-seen timestamps + the one status auto-advance. ──
  let inboundMatched = 0;
  let outboundMatched = 0;
  let advancedToReplied = 0;

  for (const [address, inquiries] of byEmail.entries()) {
    const inDate = newestIn.get(address) || null;
    const outDate = newestOut.get(address) || null;
    if (!inDate && !outDate) continue;

    for (const inq of inquiries) {
      const update: Record<string, unknown> = {};
      if (inDate && (!inq.last_email_in_at || inDate > new Date(inq.last_email_in_at))) {
        update.last_email_in_at = inDate.toISOString();
        inboundMatched++;
      }
      if (outDate && (!inq.last_email_out_at || outDate > new Date(inq.last_email_out_at))) {
        update.last_email_out_at = outDate.toISOString();
        outboundMatched++;
      }
      // He wrote to them after they inquired and the row still says "new":
      // that inquiry was answered — in Gmail, like always.
      if (
        inq.status === "new" &&
        outDate &&
        outDate > new Date(inq.created_at)
      ) {
        update.status = "replied";
        advancedToReplied++;
      }
      if (Object.keys(update).length > 0) {
        const { error: upErr } = await supabase
          .from("course_inquiries")
          .update(update)
          .eq("id", inq.id);
        if (upErr) {
          console.error("[gmail-sync] persist failed:", upErr.message);
          return skip(
            /last_email/.test(upErr.message)
              ? "columns missing — run supabase/email-sync.sql"
              : upErr.message,
          );
        }
      }
    }
  }

  return {
    ok: true,
    addressesChecked: byEmail.size,
    inboundMatched,
    outboundMatched,
    advancedToReplied,
  };
}
