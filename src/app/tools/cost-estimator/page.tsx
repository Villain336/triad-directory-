import Link from "next/link";
import { Metadata } from "next";
import { DollarSign, ArrowRight, TrendingUp, Calculator } from "lucide-react";
import { costEstimates } from "@/lib/data/cost-data";
import { getFeaturedCities } from "@/lib/data/cities";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateFAQPageJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import QuoteRequestForm from "@/components/lead-gen/QuoteRequestForm";
import AdSlot from "@/components/ads/AdSlot";

export const metadata: Metadata = generatePageMetadata({
  title: "Cost Estimator - How Much Do Services Cost in the Triad?",
  description:
    "Find out how much plumbers, electricians, HVAC, roofers, and other services cost in the Piedmont Triad. Free cost guides and instant quotes from local pros.",
  path: "/tools/cost-estimator",
});

const faqs = [
  {
    question: "How accurate are these cost estimates?",
    answer:
      "Our estimates are based on average pricing from service providers in the Piedmont Triad area. Actual costs vary based on job complexity, materials, timing, and specific provider pricing. Get exact quotes by requesting estimates from our listed professionals.",
  },
  {
    question: "Why do prices vary so much between providers?",
    answer:
      "Price differences reflect experience level, licensing, insurance coverage, warranty offerings, and quality of materials used. The cheapest option isn't always the best value — consider reviews, credentials, and warranty when comparing.",
  },
  {
    question: "How can I get the best price?",
    answer:
      "Get at least 3 quotes from different providers, ask for itemized estimates, check for seasonal promotions, and consider scheduling during off-peak times. Use our directory to compare ratings and request free quotes.",
  },
];

export default function CostEstimatorPage() {
  const featuredCities = getFeaturedCities();

  return (
    <>
      <JsonLd data={generateFAQPageJsonLd(faqs)} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="container-main py-12 sm:py-16">
          <div className="flex items-center gap-2 text-primary-300 text-sm mb-2">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Free Cost Guides
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            How Much Do Services Cost in the{" "}
            <span className="text-accent-400">Triad</span>?
          </h1>
          <p className="mt-3 max-w-2xl text-primary-200 text-lg">
            Get real pricing data for home services, contractors, and trades in
            Greensboro, Winston-Salem, High Point, and across the Piedmont Triad.
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {costEstimates.map((estimate) => (
                <article
                  key={estimate.categorySlug}
                  className="card overflow-hidden"
                  id={estimate.categorySlug}
                >
                  <div className="bg-primary-50 px-5 py-3 border-b border-primary-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary-600" aria-hidden="true" />
                      How Much Do {estimate.categoryName} Cost in the Triad?
                    </h2>
                  </div>
                  <div className="p-5">
                    {/* Price Range */}
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      <div className="text-center rounded-lg bg-green-50 border border-green-200 p-3">
                        <p className="text-xs text-green-600 font-medium">Low End</p>
                        <p className="text-xl font-bold text-green-700">
                          ${estimate.lowEnd.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center rounded-lg bg-primary-50 border border-primary-200 p-3">
                        <p className="text-xs text-primary-600 font-medium">Average</p>
                        <p className="text-xl font-bold text-primary-700">
                          ${estimate.average.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <p className="text-xs text-amber-600 font-medium">High End</p>
                        <p className="text-xl font-bold text-amber-700">
                          ${estimate.highEnd.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-center text-gray-500 -mt-3 mb-4">
                      {estimate.unit} &middot; Based on Triad area pricing
                    </p>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {estimate.description}
                    </p>

                    {/* Factors */}
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Factors That Affect Price
                      </h3>
                      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                        {estimate.factors.map((factor) => (
                          <li
                            key={factor}
                            className="flex items-start gap-1.5 text-sm text-gray-600"
                          >
                            <TrendingUp className="h-3.5 w-3.5 mt-0.5 text-primary-500 shrink-0" aria-hidden="true" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* City Links */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Find {estimate.categoryName} by City:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {featuredCities.map((city) => (
                          <Link
                            key={city.slug}
                            href={`/${city.slug}/${estimate.categorySlug}`}
                            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          >
                            {city.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* FAQ */}
            <section className="mt-12 prose prose-gray max-w-none">
              <h2>Frequently Asked Questions</h2>
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <QuoteRequestForm />
            <AdSlot position="sidebar" />

            {/* Quick Links */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900">Jump to Service</h3>
              <ul className="mt-3 space-y-2">
                {costEstimates.map((est) => (
                  <li key={est.categorySlug}>
                    <a
                      href={`#${est.categorySlug}`}
                      className="flex items-center justify-between text-sm text-gray-600 hover:text-primary-600"
                    >
                      <span>{est.categoryName}</span>
                      <span className="text-xs text-gray-400">
                        ${est.lowEnd}-${est.highEnd.toLocaleString()}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <AdSlot position="sidebar" />
          </aside>
        </div>
      </div>
    </>
  );
}
