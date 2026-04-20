/**
 * IndexNow key file. Search engines fetch this URL to verify that the site
 * owner controls the key used in IndexNow submissions.
 *
 * Per the IndexNow spec the response body MUST be exactly the key string —
 * no JSON, no whitespace, no surrounding HTML. The file is served with
 * `Content-Type: text/plain`.
 *
 * If INDEXNOW_KEY is unset (local/preview builds), we return 404 so the route
 * is effectively dormant and cannot be fetched with an empty body that would
 * fail verification in production.
 */
export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    return new Response("IndexNow key is not configured.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
