import { SITE_URL } from "@/lib/constants";

/**
 * Sitemap index at /sitemap.xml.
 *
 * Next.js's `generateSitemaps()` in `src/app/sitemap.ts` emits per-chunk
 * sitemaps at `/sitemap/<id>.xml` but does NOT emit a sitemap-index pointing
 * at them. Search engines (and our own `robots.ts`) point at `/sitemap.xml`
 * as the entry point, so this route handler renders the index manually from
 * the same chunk list used by the sitemap generator.
 *
 * If you add or reorder chunks in `src/app/sitemap.ts`, update CHUNK_COUNT
 * here to match.
 */

// Keep in sync with SITEMAP_CHUNKS.length in src/app/sitemap.ts
const CHUNK_COUNT = 8;

export const revalidate = 3600;

export function GET() {
  const now = new Date().toISOString();
  const entries = Array.from({ length: CHUNK_COUNT }, (_, id) => id)
    .map(
      (id) =>
        `  <sitemap>\n    <loc>${SITE_URL}/sitemap/${id}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
