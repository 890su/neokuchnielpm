export function GET(): Response {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#9A8164"/><text x="16" y="22" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#fff">N</text></svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=86400"
    }
  });
}
