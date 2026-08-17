import { createHmac, timingSafeEqual } from "crypto";

/**
 * Telegram transport for the LJFC agent — thin wrappers around the Bot API.
 *
 * The bot is serverless like everything else here: Telegram POSTs updates to
 * /api/telegram (registered via setWebhook), the route answers 200
 * immediately and does the real work in after(), replying through
 * sendMessage. No long-running process anywhere.
 *
 * Security:
 *   - The webhook is verified with Telegram's secret_token mechanism. The
 *     secret is DERIVED from ADMIN_KEY (HMAC), so there is no extra env var
 *     and it rotates with the admin key.
 *   - Only TELEGRAM_CHAT_ID gets answers. While that env var is unset the
 *     bot replies to anyone with their chat id — that's the setup step —
 *     and once set, strangers get silence.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim() || undefined;
const ADMIN_KEY = process.env.ADMIN_KEY?.trim() || undefined;

export const ALLOWED_CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim() || undefined;

export function isTelegramConfigured(): boolean {
  return Boolean(BOT_TOKEN);
}

/** Derived webhook secret — no separate env var, dies with ADMIN_KEY. */
export function telegramWebhookSecret(): string | null {
  if (!ADMIN_KEY) return null;
  return createHmac("sha256", ADMIN_KEY)
    .update("ljfc-telegram-webhook-v1")
    .digest("hex");
}

export function verifyTelegramSecret(header: string | null): boolean {
  const expected = telegramWebhookSecret();
  if (!expected || !header) return false;
  const a = Buffer.from(header, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

async function api(method: string, payload: Record<string, unknown>) {
  if (!BOT_TOKEN) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    return await res.json();
  } catch (e) {
    console.error(`[telegram] ${method} failed:`, e instanceof Error ? e.message : e);
    return null;
  }
}

/** Send plain text, chunked under Telegram's 4096-char message limit. */
export async function sendTelegram(chatId: string | number, text: string) {
  const chunks: string[] = [];
  let rest = text;
  while (rest.length > 0) {
    if (rest.length <= 4000) {
      chunks.push(rest);
      break;
    }
    // Prefer breaking on a paragraph, then a line, then hard.
    let cut = rest.lastIndexOf("\n\n", 4000);
    if (cut < 1000) cut = rest.lastIndexOf("\n", 4000);
    if (cut < 1000) cut = 4000;
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut).trimStart();
  }
  for (const chunk of chunks) {
    await api("sendMessage", {
      chat_id: chatId,
      text: chunk,
      disable_web_page_preview: true,
    });
  }
}

/** Register the production webhook with the derived secret. */
export async function registerTelegramWebhook() {
  const secret = telegramWebhookSecret();
  if (!secret) return { ok: false, error: "ADMIN_KEY not set" };
  if (!BOT_TOKEN) return { ok: false, error: "TELEGRAM_BOT_TOKEN not set" };
  const result = await api("setWebhook", {
    url: "https://www.lajollafreediveclub.com/api/telegram",
    secret_token: secret,
    allowed_updates: ["message"],
    drop_pending_updates: true,
  });
  const info = await api("getWebhookInfo", {});
  return { ok: Boolean(result?.ok), setWebhook: result, webhookInfo: info?.result };
}
