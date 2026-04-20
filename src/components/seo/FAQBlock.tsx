import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/lib/seo/faq";

interface Props {
  faqs: FAQ[];
  heading?: string;
  headingLevel?: "h2" | "h3";
}

/**
 * Renders a semantic FAQ block using <details>/<summary> for progressive
 * enhancement + good crawler parsing. Paired with FAQPage JSON-LD injected
 * separately so the structured-data and the visible HTML stay in sync
 * (Google's own guidance for FAQPage markup).
 */
export default function FAQBlock({ faqs, heading = "Frequently Asked Questions", headingLevel = "h2" }: Props) {
  if (faqs.length === 0) return null;
  const Heading = headingLevel;

  return (
    <section aria-label="Frequently asked questions" className="mt-12">
      <Heading className="text-2xl font-bold text-gray-900">{heading}</Heading>
      <div className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        {faqs.map((faq, idx) => (
          <details key={idx} className="group [&_svg]:open:rotate-180">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 text-left text-gray-900 hover:bg-gray-50">
              <span className="font-medium">{faq.question}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform" aria-hidden />
            </summary>
            <div className="px-5 pb-5 text-gray-700">{faq.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
