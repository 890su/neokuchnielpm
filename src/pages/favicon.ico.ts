export function GET(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "cache-control": "public, max-age=86400"
    }
  });
}
