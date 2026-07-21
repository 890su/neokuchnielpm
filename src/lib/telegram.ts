export interface TelegramPayload {
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  fields?: Record<string, unknown>;
}

export interface TelegramConfig {
  botToken?: string;
  chatId?: string;
}

export function buildTelegramMessage(payload: TelegramPayload, request: Request): string {
  const now = new Date();
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = payload.userAgent || request.headers.get("user-agent") || "unknown";
  const referrer = payload.referrer || request.headers.get("referer") || "";
  const fields = payload.fields || {};

  const lines = [
    "Neo Kuchnie - nowe zgłoszenie",
    `URL: ${payload.pageUrl || "unknown"}`,
    `Data: ${now.toISOString().slice(0, 10)}`,
    `Czas: ${now.toISOString().slice(11, 19)} UTC`,
    `IP: ${ip}`,
    `User-Agent: ${userAgent}`,
    `Referrer: ${referrer || "-"}`,
    "",
    "Pola formularza:"
  ];

  for (const [key, value] of Object.entries(fields)) {
    lines.push(`${key}: ${String(value)}`);
  }

  return lines.join("\n");
}

export async function sendTelegramMessage(config: TelegramConfig, text: string): Promise<Response> {
  if (!config.botToken || !config.chatId) {
    return new Response(JSON.stringify({ ok: false, error: "Telegram env is not configured" }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: config.chatId,
      text,
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ ok: false, error: "Telegram API error" }), {
      status: 502,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
