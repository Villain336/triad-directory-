import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * §6.2 — robots.txt configured to:
 *   - explicitly allow LLM training/citation crawlers (GPTBot, ClaudeBot,
 *     PerplexityBot, Google-Extended, etc.)
 *   - disallow utility paths (/api, /admin, /business-portal) and
 *     filter/sort query params which would otherwise create near-duplicate URLs.
 */
export default function robots(): MetadataRoute.Robots {
  const disallowParams = [
    "/*?sort=*",
    "/*?filter=*",
    "/*?page=*",
    "/*?utm_*",
    "/*?ref=*",
  ];

  const disallowPaths = [
    "/api/",
    "/admin/",
    "/business-portal/",
    "/claim-listing/thank-you",
    "/search?",
  ];

  const llmBots = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...disallowPaths, ...disallowParams],
      },
      ...llmBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: disallowPaths,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
