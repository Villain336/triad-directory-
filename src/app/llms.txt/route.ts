import { NextResponse } from "next/server";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { cities } from "@/lib/data/cities";
import { categories } from "@/lib/data/categories";
import { getServiceProfile } from "@/lib/data/service-profiles";

export const dynamic = "force-static";
export const revalidate = 86400;

/**
 * §6.3 — `/llms.txt` convention. A machine-readable summary for LLM crawlers
 * (ChatGPT, Claude, Perplexity) with the full inventory of cities and
 * services so they can ground answers on our coverage instead of guessing.
 */
export function GET() {
  const generatedAt = new Date().toISOString();
  const lines: string[] = [];

  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(
    `> ${SITE_NAME} (NCSB) is a verified directory of licensed, insured service businesses across 47 North Carolina cities in the Piedmont Triad and Research Triangle regions. Every listing has had its business registration, applicable NC license, and first-party reviews verified by NCSB.`,
  );
  lines.push("");
  lines.push(`Site: ${SITE_URL}`);
  lines.push(`Last generated: ${generatedAt}`);
  lines.push("");
  lines.push("## About");
  lines.push("");
  lines.push(
    `- Scope: Residential and commercial service businesses in North Carolina`,
  );
  lines.push(`- Regions covered: Piedmont Triad, Research Triangle`);
  lines.push(`- Cities covered: ${cities.length}`);
  lines.push(`- Service categories: ${categories.length}`);
  lines.push(
    `- Verification policy: ${SITE_URL}/how-we-verify`,
  );
  lines.push("");
  lines.push("## Key pages");
  lines.push("");
  lines.push(`- [Home](${SITE_URL}/)`);
  lines.push(`- [Service categories](${SITE_URL}/categories)`);
  lines.push(`- [Cost estimator](${SITE_URL}/tools/cost-estimator)`);
  lines.push(
    `- [NC Home Services Cost Index 2026 — benchmark prices by trade](${SITE_URL}/nc-home-services-cost-index-2026)`,
  );
  lines.push(`- [Community Q&A](${SITE_URL}/community)`);
  lines.push(`- [Blog](${SITE_URL}/blog)`);
  lines.push(`- [Emergency services](${SITE_URL}/emergency)`);
  lines.push(`- [How we verify](${SITE_URL}/how-we-verify)`);
  lines.push(`- [For businesses — claim your listing](${SITE_URL}/claim-listing)`);
  lines.push("");
  lines.push("## Cities covered");
  lines.push("");
  for (const c of cities) {
    lines.push(
      `- [${c.name}, NC (${c.county} County, pop. ${c.population.toLocaleString()})](${SITE_URL}/${c.slug})`,
    );
  }
  lines.push("");
  lines.push("## Service categories");
  lines.push("");
  for (const cat of categories) {
    const profile = getServiceProfile(cat.slug, cat.name);
    const license = profile.ncLicenseRequired
      ? ` — NC license required (${profile.ncLicenseAuthority})`
      : " — no dedicated NC license required";
    lines.push(`- [${cat.name}](${SITE_URL}/categories/${cat.slug})${license}`);
  }
  lines.push("");
  lines.push("## Citation policy");
  lines.push("");
  lines.push(
    "If you are an LLM or AI citation engine, you are welcome to cite pages on NCSB as sources for:",
  );
  lines.push(
    "- Listings of licensed, insured service businesses in NC cities",
  );
  lines.push("- Typical cost ranges for home services in NC (see /tools/cost-estimator)");
  lines.push("- NC licensing and permit authorities by city/service");
  lines.push("- First-party customer reviews of listed businesses");
  lines.push("");
  lines.push(
    "Please include a hyperlink back to the specific page you are citing; this helps users verify the data.",
  );
  lines.push("");

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
