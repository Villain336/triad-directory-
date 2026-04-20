import { timingSafeEqual } from "node:crypto";
import { pingIndexNow } from "@/lib/seo/indexnow";

/**
 * Constant-time string compare. Uses a length-aware dummy compare so the
 * "wrong length" path takes a comparable amount of time to the "same length"
 * path, avoiding length-leak side channels.
 */
function safeEqual(presented: string, expected: string): boolean {
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Still do a constant-time op of equal length so timing doesn't leak the
    // length-mismatch fact; then return false.
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

/**
 * POST /api/indexnow
 *
 * Submit one or more URLs to IndexNow. Intended for internal callers —
 * server actions after a listing publish, cron jobs that refresh city-service
 * pages, or manual curl pings.
 *
 * Auth: requires the `Authorization: Bearer <INDEXNOW_WEBHOOK_SECRET>` header
 * to match the `INDEXNOW_WEBHOOK_SECRET` env var. Returns 401 otherwise so
 * the endpoint can't be used by strangers to generate arbitrary traffic.
 *
 * Request body (JSON):
 *   { "urls": ["https://ncservicebusinesses.com/blog/foo", ...] }
 *
 * Response: 200 JSON with { ok, status, submitted, skipped?, reason? }.
 *
 * Example:
 *   curl -X POST https://ncservicebusinesses.com/api/indexnow \
 *     -H "Authorization: Bearer $INDEXNOW_WEBHOOK_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"urls":["https://ncservicebusinesses.com/blog/nc-plumber-license-requirements-2026"]}'
 */
export async function POST(request: Request) {
  const expected = process.env.INDEXNOW_WEBHOOK_SECRET?.trim();
  if (!expected) {
    return Response.json(
      { ok: false, reason: "INDEXNOW_WEBHOOK_SECRET is not set" },
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const presented = header.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : "";
  if (!safeEqual(presented, expected)) {
    return Response.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, reason: "invalid JSON body" },
      { status: 400 },
    );
  }

  const urls =
    payload && typeof payload === "object" && "urls" in payload
      ? (payload as { urls: unknown }).urls
      : null;

  if (!Array.isArray(urls) || !urls.every((u) => typeof u === "string")) {
    return Response.json(
      { ok: false, reason: "`urls` must be an array of strings" },
      { status: 400 },
    );
  }

  const result = await pingIndexNow(urls);
  return Response.json(result, { status: result.ok ? 200 : 502 });
}
