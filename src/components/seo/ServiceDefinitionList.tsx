import type { ServiceProfile } from "@/lib/data/service-profiles";

interface Props {
  service: ServiceProfile;
  categoryName: string;
}

/**
 * Definition list for a service trade — LLM-liftable `<dl>` pattern from
 * strategy §8.5. Rendered on every category hub page so the facts LLMs most
 * often cite (trade definition, NC licensing authority, typical cost range,
 * common jobs, best season) are present in the exact format generative
 * engines prefer.
 *
 * We deliberately avoid duplicating the CostTable (below) or the FAQ block;
 * this is a terse, reference-style glossary entry, not a cost breakdown.
 */
export default function ServiceDefinitionList({ service, categoryName }: Props) {
  const lower = categoryName.toLowerCase();
  const commissionBased =
    service.averageCostLow === 0 &&
    service.averageCostTypical === 0 &&
    service.averageCostHigh === 0;

  const typicalCost = commissionBased
    ? "Commission-based (no hourly rate)"
    : `$${service.averageCostLow.toLocaleString("en-US")}–$${service.averageCostHigh.toLocaleString(
        "en-US",
      )} ${service.costUnit} — typical job $${service.averageCostTypical.toLocaleString("en-US")}`;

  const licensing = service.ncLicenseRequired
    ? `NC state license required. Issued by ${service.ncLicenseAuthority}.`
    : `No dedicated NC state license required. Regulated by ${service.ncLicenseAuthority}.`;

  const emergencyAvailability =
    service.emergencyDemand === "high"
      ? `High emergency demand — most reputable ${lower} in NC offer 24/7 calls.`
      : service.emergencyDemand === "medium"
        ? `Some ${lower} offer after-hours and weekend calls; most work is scheduled.`
        : `Rarely an emergency service — appointments are typically scheduled days or weeks in advance.`;

  const commonJobsText =
    service.commonJobs.length > 0
      ? service.commonJobs.slice(0, 5).join(", ")
      : `a range of ${lower} jobs scheduled through NCSB-verified providers`;

  return (
    <section className="mt-10" aria-label={`${categoryName} reference`}>
      <h2 className="text-2xl font-bold text-gray-900">
        {categoryName}: quick reference
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Key facts about {lower} in North Carolina, summarized for quick
        reference and citation.
      </p>
      <dl className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        <div className="grid gap-1 p-5 sm:grid-cols-4 sm:items-start">
          <dt className="font-semibold text-gray-900">Definition</dt>
          <dd className="text-gray-700 sm:col-span-3">
            {capitalizeFirst(service.definition)}.
          </dd>
        </div>
        <div className="grid gap-1 p-5 sm:grid-cols-4 sm:items-start">
          <dt className="font-semibold text-gray-900">NC licensing</dt>
          <dd className="text-gray-700 sm:col-span-3">
            {licensing}{" "}
            <a
              href={service.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-700 hover:text-primary-800"
            >
              Look up a license
            </a>
            .
          </dd>
        </div>
        <div className="grid gap-1 p-5 sm:grid-cols-4 sm:items-start">
          <dt className="font-semibold text-gray-900">Typical NC cost</dt>
          <dd className="text-gray-700 sm:col-span-3">{typicalCost}</dd>
        </div>
        <div className="grid gap-1 p-5 sm:grid-cols-4 sm:items-start">
          <dt className="font-semibold text-gray-900">Common jobs</dt>
          <dd className="text-gray-700 sm:col-span-3">{commonJobsText}.</dd>
        </div>
        <div className="grid gap-1 p-5 sm:grid-cols-4 sm:items-start">
          <dt className="font-semibold text-gray-900">Best time to hire</dt>
          <dd className="text-gray-700 sm:col-span-3">
            {capitalizeFirst(service.bestSeason)}.
          </dd>
        </div>
        <div className="grid gap-1 p-5 sm:grid-cols-4 sm:items-start">
          <dt className="font-semibold text-gray-900">Emergency availability</dt>
          <dd className="text-gray-700 sm:col-span-3">{emergencyAvailability}</dd>
        </div>
      </dl>
    </section>
  );
}

function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
