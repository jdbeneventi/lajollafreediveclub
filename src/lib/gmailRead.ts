import { ImapFlow } from "imapflow";

/**
 * Gmail thread reading — the agent's native way to read what a student
 * actually wrote, without a browser.
 *
 * Same app-password IMAP access as gmailSync (which stamps only
 * timestamps) and gmailDrafts (which writes drafts). This module fetches
 * MESSAGE BODIES for one address: targeted searches only (FROM student,
 * and own→student), never a mailbox scan. Bodies are truncated and
 * quoted-reply tails trimmed, because the consumer is a human summary or
 * a drafting prompt, not an archive.
 *
 * MIME handling is deliberately small: walk multipart boundaries, take
 * the first text/plain part, decode base64/quoted-printable. Anything
 * that defeats the parser degrades to a raw-source snippet — fail-soft,
 * never fail-closed.
 */

export interface ThreadMessage {
  direction: "inbound" | "outbound";
  date: string; // ISO
  subject: string;
  body: string; // text/plain, truncated
}

export function isGmailReadConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function decodeBody(raw: string, cte: string): string {
  try {
    const enc = cte.toLowerCase();
    if (enc.includes("base64")) {
      return Buffer.from(raw.replace(/\s+/g, ""), "base64").toString("utf-8");
    }
    if (enc.includes("quoted-printable")) {
      // Decode to BYTES then UTF-8 — per-char decoding mangles multibyte
      // sequences (curly quotes became mojibake in ground testing).
      const cleaned = raw.replace(/=\r?\n/g, "");
      const bytes: number[] = [];
      for (let i = 0; i < cleaned.length; i++) {
        if (
          cleaned[i] === "=" &&
          /^[0-9A-Fa-f]{2}/.test(cleaned.slice(i + 1, i + 3))
        ) {
          bytes.push(parseInt(cleaned.slice(i + 1, i + 3), 16));
          i += 2;
        } else {
          bytes.push(cleaned.charCodeAt(i) & 0xff);
        }
      }
      return Buffer.from(bytes).toString("utf-8");
    }
    return raw;
  } catch {
    return raw;
  }
}

/** Extract the first text/plain body from a raw RFC822 source. */
export function extractPlainText(source: string): string {
  const headerEnd = source.search(/\r?\n\r?\n/);
  if (headerEnd === -1) return source.slice(0, 1500);
  const headers = source.slice(0, headerEnd);
  const body = source.slice(headerEnd).replace(/^\r?\n\r?\n/, "");

  const ctMatch = headers.match(/^Content-Type:\s*([^\r\n]+(?:\r?\n[ \t][^\r\n]+)*)/im);
  const ct = (ctMatch?.[1] || "text/plain").replace(/\r?\n[ \t]+/g, " ");

  if (/multipart\//i.test(ct)) {
    const bMatch = ct.match(/boundary="?([^";\r\n]+)"?/i);
    if (bMatch) {
      const parts = body.split(new RegExp(`--${bMatch[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:--)?`));
      // Prefer text/plain; recurse for nested multiparts.
      for (const part of parts) {
        if (/Content-Type:\s*text\/plain/i.test(part)) {
          return extractPlainText(part.replace(/^\r?\n/, ""));
        }
      }
      for (const part of parts) {
        if (/Content-Type:\s*multipart\//i.test(part)) {
          return extractPlainText(part.replace(/^\r?\n/, ""));
        }
      }
    }
    return body.slice(0, 1200);
  }

  const cteMatch = headers.match(/^Content-Transfer-Encoding:\s*([^\r\n]+)/im);
  let text = decodeBody(body, cteMatch?.[1] || "7bit");
  if (/text\/html/i.test(ct)) {
    text = text
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ");
  }
  return text;
}

/** Trim quoted-reply tails and signatures for prompt-friendly bodies. */
function trimReplyTail(text: string): string {
  let t = text;
  const markers = [
    /\r?\nOn .{5,80}wrote:\s*[\s\S]*$/,
    /\r?\n>{1,}[^\n]*[\s\S]*$/,
    /\r?\n-{2,}\s*Forwarded message[\s\S]*$/i,
    /\r?\nFrom:\s[^\n]+\r?\nSent:\s[\s\S]*$/i,
  ];
  for (const m of markers) t = t.replace(m, "");
  return t.trim().slice(0, 1800);
}

/**
 * Read the recent email exchange with one student address.
 * Returns messages sorted oldest → newest.
 */
export async function readThread(
  studentEmail: string,
  windowDays = 45,
  maxPerDirection = 6,
): Promise<ThreadMessage[]> {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return [];

  const own = [
    user.toLowerCase(),
    ...(process.env.GMAIL_ALIASES || "")
      .split(",")
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean),
  ];
  const since = new Date(Date.now() - windowDays * 86_400_000);
  const email = studentEmail.toLowerCase();

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  const out: ThreadMessage[] = [];
  try {
    await client.connect();
    let allPath = "[Gmail]/All Mail";
    try {
      const boxes = await client.list();
      const special = boxes.find((b) => b.specialUse === "\\All");
      if (special) allPath = special.path;
    } catch {}
    const lock = await client.getMailboxLock(allPath);
    try {
      const collect = async (
        uids: number[],
        direction: "inbound" | "outbound",
      ) => {
        const recent = uids.slice(-maxPerDirection);
        for (const uid of recent) {
          try {
            const msg = await client.fetchOne(
              String(uid),
              { envelope: true, source: { maxLength: 60_000 } },
              { uid: true },
            );
            if (!msg || !msg.source) continue;
            out.push({
              direction,
              date: (msg.envelope?.date
                ? new Date(msg.envelope.date)
                : new Date()
              ).toISOString(),
              subject: msg.envelope?.subject || "(no subject)",
              body: trimReplyTail(extractPlainText(msg.source.toString())),
            });
          } catch (e) {
            console.error("[gmail-read] fetch failed:", e);
          }
        }
      };

      const inbound = (await client.search(
        { from: email, since },
        { uid: true },
      )) as number[] | false;
      if (inbound) await collect(inbound, "inbound");

      for (const addr of own) {
        const outbound = (await client.search(
          { from: addr, to: email, since },
          { uid: true },
        )) as number[] | false;
        if (outbound) await collect(outbound, "outbound");
      }
    } finally {
      lock.release();
    }
  } catch (e) {
    console.error(
      "[gmail-read]",
      e instanceof Error ? e.message : "IMAP failed",
    );
  } finally {
    await client.logout().catch(() => {});
  }

  return out.sort((a, b) => a.date.localeCompare(b.date));
}
