/**
 * Deterministic FAQ generator per (city, service) and per service hub page.
 *
 * These feed both the rendered <details> FAQ block on the page AND the
 * FAQPage JSON-LD, which is one of the highest-leverage GEO patterns per
 * §5.3 of the strategy ("FAQ Schema on Every City + Service Page").
 */
import type { City } from "@/lib/data/cities";
import type { Category } from "@/lib/data/categories";
import { getCityProfile } from "@/lib/data/city-profiles";
import { getServiceProfile } from "@/lib/data/service-profiles";

export interface FAQ {
  question: string;
  answer: string;
}

const CURRENT_YEAR = new Date().getUTCFullYear();

function usd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function isCommissionService(service: {
  averageCostLow: number;
  averageCostTypical: number;
  averageCostHigh: number;
}): boolean {
  return (
    service.averageCostLow === 0 &&
    service.averageCostTypical === 0 &&
    service.averageCostHigh === 0
  );
}

export function buildCityServiceFAQs(city: City, category: Category): FAQ[] {
  const cityProfile = getCityProfile(city.slug);
  const service = getServiceProfile(category.slug, category.name);
  const lowerService = category.name.toLowerCase();
  const singular = service.nameSingular;
  const commissionBased = isCommissionService(service);

  const costRange = commissionBased
    ? "commission-based"
    : `${usd(service.averageCostLow)}–${usd(service.averageCostHigh)} ${service.costUnit}`;

  const faqs: FAQ[] = [
    {
      question: `How much does a ${singular} cost in ${city.name}, NC?`,
      answer: commissionBased
        ? `${singular.charAt(0).toUpperCase() + singular.slice(1)}s in ${city.name} are typically compensated on commission rather than by flat fee, so there's no direct per-visit cost for homeowners. Fees are usually negotiated at the close of the transaction. Focus on experience, specialties, and reviews when choosing.`
        : `Most ${lowerService} jobs in ${city.name} run ${costRange}, with the middle of the market at around ${usd(service.averageCostTypical)}. Actual pricing varies with scope, access, parts, and emergency vs. scheduled service. Use the cost table on this page or request free quotes to benchmark.`,
    },
    {
      question: `Do ${lowerService} in North Carolina need a license?`,
      answer: service.ncLicenseRequired
        ? `Yes. ${service.ncLicenseAuthority} regulates ${lowerService} in NC, and every business listed on this page has had its license verified. You can look up any NC license at ${service.licenseUrl}.`
        : `North Carolina does not require a dedicated state license for ${lowerService}, but general-contractor rules apply to jobs over $30,000. NCSB still verifies insurance and business registration for every ${singular} we list.`,
    },
    {
      question: `What's the best time of year to book a ${singular} in ${city.name}?`,
      answer: `For ${city.name}, plan on ${service.bestSeason}. Booking outside of the peak season typically means shorter wait times and more competitive quotes.`,
    },
    {
      question: service.emergencyDemand === "high"
        ? `Which ${lowerService} in ${city.name} offer 24/7 emergency service?`
        : `How quickly can I get a ${singular} in ${city.name}?`,
      answer: service.emergencyDemand === "high"
        ? `A large share of ${city.name} ${lowerService} offer 24/7 emergency dispatch. Profiles on this page that advertise emergency response are marked, and most will dispatch within 1–2 hours for genuine urgent issues like active leaks, outages, or total system failures.`
        : service.emergencyDemand === "medium"
          ? `Many ${city.name} ${lowerService} handle same-day or next-day work for urgent issues. For non-urgent jobs, expect a 1–4 week lead time, especially during the ${service.bestSeason.split(",")[0]} rush.`
          : `${lowerService.charAt(0).toUpperCase() + lowerService.slice(1)} in ${city.name} are typically scheduled 1–4 weeks out. Booking ahead of the peak season reduces wait time.`,
    },
    {
      question: `Who issues permits for ${lowerService} work in ${city.name}?`,
      answer: `Permits for ${lowerService} projects in ${city.name} are issued by ${cityProfile.permitAuthority}. Licensed pros pull permits on your behalf; if a ${singular} quotes a permit-required job without one, that's a red flag. You can contact the permit office directly at ${cityProfile.permitUrl}.`,
    },
    {
      question: `What neighborhoods in ${city.name} do these ${lowerService} serve?`,
      answer: cityProfile.neighborhoods.length > 0
        ? `Most ${lowerService} listed cover the full ${city.name} service area, including ${cityProfile.neighborhoods.slice(0, 5).join(", ")}, and surrounding neighborhoods.${cityProfile.zipCodes.length > 0 ? ` Covered ZIP codes include ${cityProfile.zipCodes.slice(0, 5).join(", ")}.` : ""}`
        : `Nearly every ${singular} listed on this page covers the full ${city.name} area, including surrounding neighborhoods and nearby communities.`,
    },
    {
      question: `How does NCSB verify ${lowerService} in ${city.name}?`,
      answer: `For ${CURRENT_YEAR}, every ${singular} listed is checked on three criteria before publishing: (1) active business registration, (2) applicable license or certification (${service.ncLicenseRequired ? service.ncLicenseAuthority : "general business insurance"}), and (3) first-party review authenticity. Verification is re-run every quarter. Read the full verification methodology at /how-we-verify.`,
    },
  ];

  if (service.commonJobs.length > 0) {
    faqs.push({
      question: `What do ${lowerService} in ${city.name} typically do?`,
      answer: `Common jobs include: ${service.commonJobs.slice(0, 5).join(", ")}. Most ${lowerService} on this page handle the full range; a few specialize in one or two of these areas — check individual profiles for scope.`,
    });
  }

  return faqs;
}

export function buildCategoryHubFAQs(category: Category): FAQ[] {
  const service = getServiceProfile(category.slug, category.name);
  const lowerService = category.name.toLowerCase();
  const singular = service.nameSingular;

  return [
    {
      question: `How much do ${lowerService} cost in North Carolina?`,
      answer: isCommissionService(service)
        ? `${lowerService.charAt(0).toUpperCase() + lowerService.slice(1)} in North Carolina are typically paid on commission rather than a fixed hourly or per-visit rate, so there's no direct cost comparison. Evaluate them on experience, specialty, and reviews instead.`
        : `Typical ${lowerService} pricing across NC ranges ${usd(service.averageCostLow)}–${usd(service.averageCostHigh)} ${service.costUnit}, with the middle of the market at about ${usd(service.averageCostTypical)}. Costs vary by city and project scope; check any city page for local pricing detail.`,
    },
    {
      question: `Do ${lowerService} need a license in NC?`,
      answer: service.ncLicenseRequired
        ? `Yes — ${service.ncLicenseAuthority} is the licensing body. You can verify any ${singular}'s license at ${service.licenseUrl}. NCSB verifies license status for every listed business.`
        : `NC does not require a dedicated state license specifically for ${lowerService}, but the NC Licensing Board for General Contractors applies to jobs over $30,000. NCSB verifies business insurance and registration.`,
    },
    {
      question: `What cities does NCSB cover ${lowerService} in?`,
      answer: `NCSB lists ${lowerService} in 47 North Carolina cities across the Piedmont Triad and Research Triangle regions, including Greensboro, Winston-Salem, High Point, Raleigh, Durham, and Cary. Use the city list on this page to jump directly to any location.`,
    },
    {
      question: `What jobs do ${lowerService} handle?`,
      answer: service.commonJobs.length > 0
        ? `The most common ${lowerService} jobs across NC are: ${service.commonJobs.slice(0, 6).join(", ")}.`
        : `${lowerService.charAt(0).toUpperCase() + lowerService.slice(1)} handle a wide range of residential and commercial work; see individual city pages for specialty information.`,
    },
    {
      question: `When's the best time to book a ${singular}?`,
      answer: `For most NC markets, the best time to book a ${singular} is ${service.bestSeason}. Emergency service is available year-round from providers that advertise it.`,
    },
  ];
}
