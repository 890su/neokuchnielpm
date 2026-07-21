interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

interface LeadPayload {
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  fields?: Record<string, string>;
}

export async function onRequestOptions(): Promise<Response> {
  return jsonResponse({ ok: true });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return jsonResponse({ ok: false, error: "Telegram is not configured" }, 500);
  }

  const payload = await readPayload(request);
  const message = formatTelegramMessage(payload, request);
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    return jsonResponse({ ok: false, error: "Telegram request failed" }, 502);
  }

  return jsonResponse({ ok: true });
}

export async function onRequest(): Promise<Response> {
  return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
}

async function readPayload(request: Request): Promise<LeadPayload> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function formatTelegramMessage(payload: LeadPayload, request: Request): string {
  const date = new Date();
  const fields = Object.entries(payload.fields || {})
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `• ${escapeHtml(key)}: ${escapeHtml(value)}`)
    .join("\n");

  return [
    "<b>Neo Kuchnie: nowe zgłoszenie</b>",
    `URL: ${escapeHtml(payload.pageUrl || "")}`,
    `Data: ${escapeHtml(date.toISOString())}`,
    `IP: ${escapeHtml(request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "")}`,
    `User-Agent: ${escapeHtml(payload.userAgent || request.headers.get("user-agent") || "")}`,
    `Referrer: ${escapeHtml(payload.referrer || request.headers.get("referer") || "")}`,
    "",
    fields || "Brak pól formularza"
  ].join("\n");
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type"
    }
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
