import { NextRequest, NextResponse, after } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  ALLOWED_CHAT_ID,
  isTelegramConfigured,
  registerTelegramWebhook,
  verifyTelegramSecret,
  sendTelegram,
} from "@/lib/telegram";
import { handleTelegramMessage } from "@/lib/telegramBot";

/**
 * /api/telegram — the LJFC agent's Telegram surface.
 *
 *   GET  (admin auth)              → config status
 *   GET  ?setup=true (admin auth)  → register the webhook with Telegram
 *   POST (Telegram servers only)   → webhook updates, verified against the
 *                                    ADMIN_KEY-derived secret_token
 *
 * The webhook answers 200 immediately and does the real work in after()
 * (data reads, Claude calls, drafting can take 10-30s) — replies go out
 * through sendMessage, so Telegram never retries on slowness.
 *
 * Chat gating: only TELEGRAM_CHAT_ID gets answers. Until that env var is
 * set, the bot tells whoever messages it their chat id — that IS the setup
 * step — and once set, other senders get silence.
 */

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  if (req.nextUrl.searchParams.get("setup") === "true") {
    const result = await registerTelegramWebhook();
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  }

  return NextResponse.json({
    botToken: isTelegramConfigured(),
    chatIdPinned: Boolean(ALLOWED_CHAT_ID),
    hint: "add ?setup=true to (re)register the webhook",
  });
}

export async function POST(req: NextRequest) {
  if (!verifyTelegramSecret(req.headers.get("x-telegram-bot-api-secret-token"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const update = await req.json().catch(() => null);
  const message = update?.message;
  const chatId = message?.chat?.id;
  const text = message?.text;

  // Always 200 so Telegram never re-delivers; unusable updates just drop.
  if (!chatId || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (!ALLOWED_CHAT_ID) {
    // Setup phase: hand back the chat id to put in TELEGRAM_CHAT_ID.
    after(() =>
      sendTelegram(
        chatId,
        `This bot is not paired yet. Your chat id is:\n\n${chatId}\n\nSet TELEGRAM_CHAT_ID to that value in Vercel, redeploy, and message me again.`,
      ),
    );
    return NextResponse.json({ ok: true });
  }

  if (String(chatId) !== ALLOWED_CHAT_ID) {
    // Paired with someone else — silence.
    return NextResponse.json({ ok: true });
  }

  after(() => handleTelegramMessage(chatId, text));
  return NextResponse.json({ ok: true });
}
