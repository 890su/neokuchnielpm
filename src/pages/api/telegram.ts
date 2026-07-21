import type { APIRoute } from "astro";
import { buildTelegramMessage, sendTelegramMessage, type TelegramPayload } from "@lib/telegram";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  let payload: TelegramPayload;

  try {
    payload = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  const runtimeEnv = (context.locals as { runtime?: { env?: Record<string, string> } }).runtime?.env;
  const botToken = runtimeEnv?.TELEGRAM_BOT_TOKEN || import.meta.env.TELEGRAM_BOT_TOKEN;
  const chatId = runtimeEnv?.TELEGRAM_CHAT_ID || import.meta.env.TELEGRAM_CHAT_ID;
  const text = buildTelegramMessage(payload, context.request);

  return sendTelegramMessage({ botToken, chatId }, text);
};
