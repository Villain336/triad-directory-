import { SITE_URL } from "@/lib/constants";

/**
 * IndexNow client — pings Bing, Yandex, Seznam, Naver, and other IndexNow-
 * participating search engines that one or more URLs on the site have been
 * created, updated, or deleted.
 *
 * Docs: https://www.indexnow.org/documentation
 *
 * Setup:
 *   1. Pick (or generate) a 32+ hex-character key.
 *   2. Set INDEXNOW_KEY in the runtime env (Vercel project env).
 *   3. The key file is served at {@link INDEXNOW_KEY_PATH} so search engines
 *      can verify ownership — see src/app/indexnow-key.txt/route.ts.
 *   4. Call {@link pingIndexNow} from any server action, route handler, or
 *      webhook that publishes / updates a URL. When the env var is unset,
 *      calls short-circuit so local + preview builds don't error.
 */
export const INDEXNOW_KEY_PATH = "/indexnow-key.txt";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

export interface IndexNowResult {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  status?: number;
  submitted?: number;
}

/**
 * Submit a batch of URLs to IndexNow. Accepts up to 10,000 URLs per call per
 * the spec; we cap at 1,000 to keep requests tidy and predictable.
 *
 * Returns `{ ok: true, skipped: true }` when the key env var is missing so
 * callers can treat "no-op in preview" and "submitted in prod" uniformly.
 */
export async function pingIndexNow(urls: string[]): Promise<IndexNowResult> {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    return { ok: true, skipped: true, reason: "INDEXNOW_KEY is not set" };
  }

  const normalized = urls
    .map((u) => u.trim())
    .filter(Boolean)
    .filter((u) => u.startsWith(SITE_URL))
    .slice(0, 1000);

  if (normalized.length === 0) {
    return { ok: true, skipped: true, reason: "no URLs to submit" };
  }

  const host = new URL(SITE_URL).host;

  const body = {
    host,
    key,
    keyLocation: `${SITE_URL}${INDEXNOW_KEY_PATH}`,
    urlList: normalized,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  return {
    ok: res.ok,
    status: res.status,
    submitted: normalized.length,
    reason: res.ok ? undefined : `IndexNow returned HTTP ${res.status}`,
  };
}
