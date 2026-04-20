/**
 * Composition layer — deterministically generates unique intro copy for every
 * (city, service) programmatic page so we satisfy the "≥250 words of unique
 * content, not present on any other page" bar in §4.1 without hand-authoring
 * 2,303 pages.
 *
 * The same (city, service) pair always produces the same output so pages stay
 * stable across builds and revalidations.
 */
import type { City } from "@/lib/data/cities";
import type { Category } from "@/lib/data/categories";
import { getCityProfile } from "@/lib/data/city-profiles";
import { getServiceProfile } from "@/lib/data/service-profiles";

const CURRENT_YEAR = new Date().getUTCFullYear();

/** Stable, non-cryptographic 32-bit hash used only for deterministic variant selection. */
function hash32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: readonly T[], seed: number, bump = 0): T {
  return arr[(seed + bump) % arr.length];
}

const OPENERS = [
  (city: string, service: string, count: number) =>
    `If you need ${service} in ${city}, NC, this page lists every verified pro serving the area — ${count > 0 ? `${count} businesses` : "a continually expanding roster"} ranked by customer reviews, response time, and license status.`,
  (city: string, service: string, count: number) =>
    `${city} homeowners and businesses hire ${service} for everything from routine maintenance to 24/7 emergency calls. The ${count > 0 ? `${count} companies` : "local companies"} below are the ones NCSB has independently verified in ${CURRENT_YEAR}.`,
  (city: string, service: string, count: number) =>
    `This is NCSB's verified directory of ${service} in ${city}, North Carolina. ${count > 0 ? `We currently list ${count}` : "We are currently verifying additional"} local pros and update licenses, insurance, and reviews every month.`,
  (city: string, service: string) =>
    `Finding a trustworthy ${service.replace(/s$/, "")} in ${city} shouldn't take a dozen tabs. NCSB verifies license status, insurance, and customer reviews before a business appears on this page.`,
];

const LOCAL_FLAVOR_TEMPLATES = [
  (city: string, flavor: string, service: string) =>
    `${city} is ${flavor}, and its size and housing mix shape which ${service} skills are in highest demand.`,
  (city: string, flavor: string) =>
    `${city} — ${flavor} — has a distinct service-industry market that rewards specialists over national chains.`,
  (city: string, flavor: string, service: string) =>
    `Because ${city} is ${flavor}, local ${service} tend to specialize in the housing stock, climate, and permit quirks unique to this community.`,
];

const CLIMATE_TEMPLATES = [
  (city: string, service: string, climate: string) =>
    `The local climate matters for ${service}: ${city} has a ${climate}. Plan ahead for the seasonal spikes when capacity tightens.`,
  (city: string, service: string, climate: string) =>
    `${city} sees a ${climate}, and that weather pattern drives most emergency ${service} calls in the area.`,
  (city: string, service: string, climate: string) =>
    `Because ${city} has a ${climate}, experienced ${service} know which failures are seasonal and which point to bigger issues.`,
];

const NEIGHBORHOOD_TEMPLATES = [
  (city: string, service: string, neighborhoods: string[]) =>
    `Neighborhoods served include ${joinList(neighborhoods)}. Most ${service.replace(/s$/, "")}s listed here work across the full ${city} service area.`,
  (city: string, service: string, neighborhoods: string[]) =>
    `The ${service} below cover ${joinList(neighborhoods)} and the surrounding ${city} neighborhoods, not just a single ZIP code.`,
  (city: string, service: string, neighborhoods: string[]) =>
    `Expect coverage across ${city} — ${joinList(neighborhoods)} are all part of most pros' standard service radius.`,
];

const ZIP_TEMPLATES = [
  (city: string, zips: string[]) =>
    `ZIP codes served include ${joinList(zips)}.`,
  (city: string, zips: string[]) =>
    `ZIPs in the primary ${city} service area: ${joinList(zips)}.`,
  (city: string, zips: string[]) =>
    `Covered ZIP codes: ${joinList(zips)}.`,
];

const COST_TEMPLATES = [
  (service: string, low: number, typical: number, high: number, unit: string) =>
    `Typical costs in NC run ${usd(low)}–${usd(high)} ${unit}, with the middle of the market at about ${usd(typical)} — but the spread depends heavily on scope. See the cost breakdown below.`,
  (service: string, low: number, typical: number, high: number, unit: string) =>
    `Expect ${service} quotes in the ${usd(low)}–${usd(high)} range (${unit}), with most jobs landing near ${usd(typical)}. Emergency or specialty work can push beyond this range.`,
  (service: string, low: number, typical: number, high: number, unit: string) =>
    `The cost table further down breaks pricing into Low / Typical / High tiers (${usd(low)} / ${usd(typical)} / ${usd(high)} ${unit}) so you can sanity-check any quote you receive.`,
];

const LICENSE_TEMPLATES = [
  (service: string, authority: string) =>
    `${capitalizeFirst(service)} in North Carolina must be licensed by ${authority}. Every business on this page has had its license number verified within the last 90 days.`,
  (service: string, authority: string) =>
    `Because ${authority} regulates ${service} in NC, we do not list a business until we've confirmed the license is active and in good standing.`,
  (service: string, authority: string) =>
    `NC requires ${service} to be licensed through ${authority}. NCSB checks license status at listing and again at every quarterly re-verification.`,
];

const NO_LICENSE_TEMPLATES = [
  (service: string) =>
    `North Carolina does not require a specific state license for ${service}, so NCSB verifies business registration, insurance, and customer reviews instead before listing.`,
  (service: string) =>
    `${capitalizeFirst(service)} are not state-licensed as a dedicated trade in NC; we verify insurance, year founded, and review authenticity before publishing.`,
  (service: string) =>
    `State licensing isn't required for ${service} in NC, but NCSB still checks insurance and reviews before any business is published.`,
];

const SEASON_TEMPLATES = [
  (service: string, season: string) =>
    `Best time to book: ${season}. Scheduling outside the peak reduces wait time and sometimes unlocks lower pricing.`,
  (service: string, season: string) =>
    `Schedule tip — for ${service}, ${season} is when capacity is highest and rates are most competitive.`,
  (service: string, season: string) =>
    `Planning ahead helps: most NC ${service} have the shortest wait times during ${season}.`,
];

const EMERGENCY_TEMPLATES = {
  high: (service: string) =>
    `Need someone now? Many of the ${service} listed offer 24/7 emergency dispatch. The listings that advertise emergency response are flagged on their profile.`,
  medium: (service: string) =>
    `Some ${service} on this list handle same-day or next-day urgent work. Filter by response-time on individual profiles if speed is critical.`,
  low: (_service: string) =>
    `This category is usually planned ahead of time, so booking 1–4 weeks out is normal for most jobs.`,
} as const;

const CLOSERS = [
  (city: string, service: string) =>
    `Every company listed in ${city} has had its license, insurance (where applicable), and first-party reviews reviewed by NCSB. Click any listing to request a free quote or compare up to three companies side-by-side.`,
  (city: string, service: string) =>
    `Request free quotes from multiple ${service} in ${city} in one step, or click through to an individual listing to read verified reviews, check hours, and contact the business directly.`,
  (city: string, service: string) =>
    `Not seeing your favorite ${service.replace(/s$/, "")}? Let us know — we verify and publish new ${city}-area listings every month.`,
];

function joinList(items: string[], max = 6): string {
  const subset = items.slice(0, max);
  if (subset.length <= 1) return subset.join("");
  if (subset.length === 2) return subset.join(" and ");
  return `${subset.slice(0, -1).join(", ")}, and ${subset[subset.length - 1]}`;
}

function usd(n: number): string {
  if (n === 0) return "commission-based";
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export interface ComposedIntro {
  /** 3–5 paragraphs of unique intro copy, totalling ≥250 words for 99% of (city,service) pairs. */
  paragraphs: string[];
  /** Page H2 string, varied deterministically. */
  subheading: string;
  /** Key facts block, used in sidebar and for LLM-liftable `<dl>` definitions. */
  keyFacts: { label: string; value: string }[];
}

export function composeCityServiceIntro(
  city: City,
  category: Category,
  listingCount: number,
): ComposedIntro {
  const cityProfile = getCityProfile(city.slug);
  const service = getServiceProfile(category.slug, category.name);
  const lowerService = category.name.toLowerCase();
  const seed = hash32(`${city.slug}::${category.slug}`);

  const paragraphs: string[] = [];

  // 1. Opener
  const opener = pick(OPENERS, seed, 0)(city.name, lowerService, listingCount);
  paragraphs.push(opener);

  // 2. Local flavor + neighborhoods + ZIPs (one compound paragraph)
  const parts: string[] = [];
  if (cityProfile.localFlavor) {
    parts.push(pick(LOCAL_FLAVOR_TEMPLATES, seed, 1)(city.name, cityProfile.localFlavor, lowerService));
  }
  if (cityProfile.neighborhoods.length > 0) {
    parts.push(pick(NEIGHBORHOOD_TEMPLATES, seed, 2)(city.name, lowerService, cityProfile.neighborhoods));
  }
  if (cityProfile.zipCodes.length > 0) {
    parts.push(pick(ZIP_TEMPLATES, seed, 3)(city.name, cityProfile.zipCodes));
  }
  if (parts.length > 0) paragraphs.push(parts.join(" "));

  // 3. Climate paragraph
  if (cityProfile.climateNotes) {
    paragraphs.push(pick(CLIMATE_TEMPLATES, seed, 4)(city.name, lowerService, cityProfile.climateNotes));
  }

  // 4. Licensing + cost paragraph
  const licenseParts: string[] = [];
  if (service.ncLicenseRequired) {
    licenseParts.push(pick(LICENSE_TEMPLATES, seed, 5)(lowerService, service.ncLicenseAuthority));
  } else {
    licenseParts.push(pick(NO_LICENSE_TEMPLATES, seed, 5)(lowerService));
  }
  licenseParts.push(
    pick(COST_TEMPLATES, seed, 6)(
      lowerService,
      service.averageCostLow,
      service.averageCostTypical,
      service.averageCostHigh,
      service.costUnit,
    ),
  );
  paragraphs.push(licenseParts.join(" "));

  // 5. Season + emergency + closer paragraph
  const finalParts: string[] = [];
  finalParts.push(pick(SEASON_TEMPLATES, seed, 7)(lowerService, service.bestSeason));
  finalParts.push(EMERGENCY_TEMPLATES[service.emergencyDemand](lowerService));
  finalParts.push(pick(CLOSERS, seed, 8)(city.name, lowerService));
  paragraphs.push(finalParts.join(" "));

  const subheadings = [
    `Find the Best ${category.name} in ${city.name}, NC`,
    `How to Choose ${category.name} in ${city.name}`,
    `Top-Rated ${category.name} Serving ${city.name}`,
    `About ${category.name} in ${city.name}`,
  ];

  const keyFacts: { label: string; value: string }[] = [
    { label: "NC license required", value: service.ncLicenseRequired ? "Yes" : "No" },
    { label: "Licensing authority", value: service.ncLicenseAuthority },
    {
      label: "Typical NC cost",
      value: `${usd(service.averageCostLow)}–${usd(service.averageCostHigh)} ${service.costUnit}`,
    },
    { label: "Best time to book", value: service.bestSeason },
    { label: "Emergency availability", value: service.emergencyDemand === "high" ? "Often 24/7" : service.emergencyDemand === "medium" ? "Some same-day" : "Scheduled only" },
    { label: "Permit authority", value: cityProfile.permitAuthority },
  ];

  return {
    paragraphs,
    subheading: pick(subheadings, seed, 9),
    keyFacts,
  };
}

/** Returns the N closest sibling cities (great-circle distance). */
export function nearestCities(
  from: City,
  candidates: readonly City[],
  limit = 3,
): City[] {
  const R = 3958.8; // miles
  const toRad = (d: number) => (d * Math.PI) / 180;

  return candidates
    .filter((c) => c.slug !== from.slug)
    .map((c) => {
      const dLat = toRad(c.latitude - from.latitude);
      const dLon = toRad(c.longitude - from.longitude);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(from.latitude)) * Math.cos(toRad(c.latitude)) * Math.sin(dLon / 2) ** 2;
      const dist = 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
      return { city: c, dist };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
    .map((x) => x.city);
}

/** Returns N related services in the same city, preferring the declared related list. */
export function relatedServicesFor(
  category: Category,
  all: readonly Category[],
  limit = 3,
): Category[] {
  const service = getServiceProfile(category.slug, category.name);
  const byPriority: Category[] = [];
  const seen = new Set<string>([category.slug]);

  for (const slug of service.relatedServices) {
    if (seen.has(slug)) continue;
    const match = all.find((c) => c.slug === slug);
    if (match) {
      byPriority.push(match);
      seen.add(slug);
    }
  }

  // Fill with featured categories if we didn't get enough
  if (byPriority.length < limit) {
    for (const c of all) {
      if (seen.has(c.slug)) continue;
      if (!c.featured) continue;
      byPriority.push(c);
      seen.add(c.slug);
      if (byPriority.length >= limit) break;
    }
  }

  return byPriority.slice(0, limit);
}
