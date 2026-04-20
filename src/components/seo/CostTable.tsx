import type { ServiceProfile } from "@/lib/data/service-profiles";

interface Props {
  service: ServiceProfile;
  cityName?: string;
  serviceName: string;
}

/**
 * Featured-snippet-friendly Low / Typical / High cost table.
 * Matches the pattern called out in §5.4 of the strategy.
 *
 * For commission-based services (real-estate agents, insurance brokers,
 * financial advisors) where all three cost tiers are zero, we render an
 * explanatory callout instead of a misleading "—" table.
 */
export default function CostTable({ service, cityName, serviceName }: Props) {
  const scope = cityName ? `${serviceName} in ${cityName}, NC` : `${serviceName} in NC`;
  const isCommissionBased =
    service.averageCostLow === 0 &&
    service.averageCostTypical === 0 &&
    service.averageCostHigh === 0;

  if (isCommissionBased) {
    return (
      <section className="mt-10" aria-label="How pricing works">
        <h2 className="text-2xl font-bold text-gray-900">
          How much does {serviceName.toLowerCase()} cost {cityName ? `in ${cityName}` : "in NC"}?
        </h2>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-gray-700">
          <p>
            <strong>{serviceName} are commission-based, not hourly.</strong> There's no direct
            per-visit or hourly cost for homeowners — compensation is paid out of the transaction
            itself (e.g. as a percentage of a home sale or policy premium).
          </p>
          <p className="mt-2">
            When comparing {serviceName.toLowerCase()} in {cityName ? `${cityName}, NC` : "NC"},
            focus on years of experience, specialties, recent transactions, and first-party
            reviews instead of quote shopping.
          </p>
        </div>
      </section>
    );
  }

  const formatUsd = (n: number) => `$${n.toLocaleString("en-US")}`;

  return (
    <section className="mt-10" aria-label="Typical cost">
      <h2 className="text-2xl font-bold text-gray-900">
        How much does {serviceName.toLowerCase()} cost {cityName ? `in ${cityName}` : "in NC"}?
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Based on NCSB first-party quote data for {scope}. {service.costUnit}.
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-3">Tier</th>
              <th scope="col" className="px-4 py-3">Price ({service.costUnit})</th>
              <th scope="col" className="px-4 py-3">What it covers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th scope="row" className="px-4 py-3 font-semibold text-gray-900">Low</th>
              <td className="px-4 py-3 text-gray-700">{formatUsd(service.averageCostLow)}</td>
              <td className="px-4 py-3 text-gray-700">Simple repairs, diagnostic visits, minor parts</td>
            </tr>
            <tr className="bg-amber-50/40">
              <th scope="row" className="px-4 py-3 font-semibold text-gray-900">Typical</th>
              <td className="px-4 py-3 font-semibold text-gray-900">{formatUsd(service.averageCostTypical)}</td>
              <td className="px-4 py-3 text-gray-700">Average job — the middle of the market</td>
            </tr>
            <tr>
              <th scope="row" className="px-4 py-3 font-semibold text-gray-900">High</th>
              <td className="px-4 py-3 text-gray-700">{formatUsd(service.averageCostHigh)}</td>
              <td className="px-4 py-3 text-gray-700">Full replacements, premium materials, emergency rates</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
