import { ImapFlow } from "imapflow";

/**
 * Gmail draft creation over IMAP — the agent writes, Joshua sends.
 *
 * Same app-password auth as gmailSync (GMAIL_USER + GMAIL_APP_PASSWORD),
 * no OAuth and no new credentials: IMAP APPEND into the account's Drafts
 * folder creates a normal Gmail draft. Joshua opens it in Gmail, edits
 * whatever he likes, and hits send himself — the send happens from his
 * real account (his thread history, his deliverability), and the existing
 * gmailSync sees the outbound afterward and advances the pipeline.
 *
 * NOTE: Gmail does NOT auto-append the account's signature to drafts
 * created this way — bodies should already end with the sign-off.
 */

export interface DraftItem {
  to: string;
  toName?: string;
  subject: string;
  text: string;
}

export interface DraftResult {
  to: string;
  created: boolean;
  error?: string;
}

export function isGmailDraftsConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

/** RFC 2047 encoded-word — safe for any UTF-8 subject/display name. */
function encodeWord(s: string): string {
  return /^[\x20-\x7e]*$/.test(s)
    ? s
    : `=?UTF-8?B?${Buffer.from(s, "utf-8").toString("base64")}?=`;
}

function buildRfc822(from: string, item: DraftItem): string {
  const bodyB64 = Buffer.from(item.text, "utf-8")
    .toString("base64")
    .replace(/(.{76})/g, "$1\r\n");
  const toHeader = item.toName
    ? `${encodeWord(item.toName)} <${item.to}>`
    : item.to;
  const msgId = `<draft-${Date.now()}-${Math.random().toString(36).slice(2)}@lajollafreediveclub.com>`;
  return [
    `From: Joshua Beneventi <${from}>`,
    `To: ${toHeader}`,
    `Subject: ${encodeWord(item.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: ${msgId}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset=UTF-8',
    "Content-Transfer-Encoding: base64",
    "",
    bodyB64,
  ].join("\r\n");
}

/**
 * Create one or many Gmail drafts on a single IMAP connection.
 * Fail-soft per item; a connection-level failure fails all remaining.
 */
export async function createGmailDrafts(
  items: DraftItem[],
): Promise<DraftResult[]> {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) {
    return items.map((i) => ({
      to: i.to,
      created: false,
      error: "GMAIL_USER / GMAIL_APP_PASSWORD not set",
    }));
  }

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  const results: DraftResult[] = [];
  try {
    await client.connect();

    // Locale-proof Drafts resolution: prefer the \Drafts special-use flag.
    let draftsPath = "[Gmail]/Drafts";
    try {
      const boxes = await client.list();
      const special = boxes.find((b) => b.specialUse === "\\Drafts");
      if (special) draftsPath = special.path;
    } catch {}

    for (const item of items) {
      try {
        await client.append(draftsPath, buildRfc822(user, item), [
          "\\Draft",
          "\\Seen",
        ]);
        results.push({ to: item.to, created: true });
      } catch (e) {
        results.push({
          to: item.to,
          created: false,
          error: e instanceof Error ? e.message : "append failed",
        });
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "IMAP connection failed";
    console.error("[gmail-drafts]", msg);
    while (results.length < items.length) {
      results.push({ to: items[results.length].to, created: false, error: msg });
    }
  } finally {
    await client.logout().catch(() => {});
  }
  return results;
}

/** Single-draft convenience for the Telegram /draft flow. */
export async function createGmailDraft(item: DraftItem): Promise<DraftResult> {
  return (await createGmailDrafts([item]))[0];
}
