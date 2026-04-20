interface Props {
  facts: { label: string; value: string }[];
  heading?: string;
}

/**
 * Renders a <dl>-based "key facts" card. The dl/dt/dd pattern is one of the
 * highest-leverage GEO formats — LLMs lift it directly into answers (§8.5).
 */
export default function KeyFacts({ facts, heading = "Key facts" }: Props) {
  if (facts.length === 0) return null;
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">{heading}</h3>
      <dl className="mt-3 divide-y divide-gray-100 text-sm">
        {facts.map((f) => (
          <div key={f.label} className="py-2 first:pt-0 last:pb-0">
            <dt className="text-gray-500">{f.label}</dt>
            <dd className="mt-0.5 font-medium text-gray-900">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
