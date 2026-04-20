import type { ServiceProfile } from "@/lib/data/service-profiles";

interface Props {
  service: ServiceProfile;
  cityName?: string;
  serviceName: string;
}

/**
 * Featured-snippet-friendly Low / Typical / High cost table.
 * Matches the pattern called out in §5.4 of the strategy.
 */
export default function CostTable({ service, cityName, serviceName }: Props) {
  const formatUsd = (n: number) => (n === 0 ? "—" : `$${n.toLocaleString("en-US")}`);
  const scope = cityName ? `${serviceName} in ${cityName}, NC` : `${serviceName} in NC`;

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
