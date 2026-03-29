import Link from "next/link";
import { Metadata } from "next";
import { CheckCircle, X } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateFAQPageJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = generatePageMetadata({
  title: "Pricing - Listing Plans",
  description:
    "Choose the perfect listing plan for your business. Free, Basic, Premium, and Elite tiers available. Get more leads in the Piedmont Triad.",
  path: "/pricing",
});

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic listing to get started",
    features: [
      { text: "Business name & contact info", included: true },
      { text: "Listed in city + category pages", included: true },
      { text: "Basic business profile", included: true },
      { text: "Customer reviews", included: true },
      { text: "Priority placement", included: false },
      { text: "Photo gallery", included: false },
      { text: "Verified badge", included: false },
      { text: "Lead tracking", included: false },
      { text: "Featured on homepage", included: false },
      { text: "Sponsored blog mention", included: false },
    ],
    cta: "Get Listed Free",
    href: "/claim-listing",
    popular: false,
  },
  {
    name: "Basic",
    price: "$49",
    period: "/month",
    description: "Enhanced visibility for growing businesses",
    features: [
      { text: "Business name & contact info", included: true },
      { text: "Listed in city + category pages", included: true },
      { text: "Enhanced business profile", included: true },
      { text: "Customer reviews", included: true },
      { text: "Priority over free listings", included: true },
      { text: "Up to 5 photos", included: true },
      { text: "Verified badge", included: true },
      { text: "Basic lead tracking", included: true },
      { text: "Featured on homepage", included: false },
      { text: "Sponsored blog mention", included: false },
    ],
    cta: "Start Basic",
    href: "/contact",
    popular: false,
  },
  {
    name: "Premium",
    price: "$99",
    period: "/month",
    description: "Maximum visibility and lead generation",
    features: [
      { text: "Business name & contact info", included: true },
      { text: "Listed in city + category pages", included: true },
      { text: "Premium business profile", included: true },
      { text: "Customer reviews + responses", included: true },
      { text: "Top placement in results", included: true },
      { text: "Unlimited photos + gallery", included: true },
      { text: "Verified + Premium badges", included: true },
      { text: "Full lead tracking + analytics", included: true },
      { text: "Featured on homepage rotation", included: true },
      { text: "1 sponsored blog mention/quarter", included: true },
    ],
    cta: "Go Premium",
    href: "/contact",
    popular: true,
  },
  {
    name: "Elite",
    price: "$199",
    period: "/month",
    description: "Dominate your market in the Triad",
    features: [
      { text: "Everything in Premium", included: true },
      { text: "Exclusive category placement", included: true },
      { text: "Banner ad included ($150 value)", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Monthly performance reports", included: true },
      { text: "Priority customer support", included: true },
      { text: "Social media features", included: true },
      { text: "Blog article feature/month", included: true },
      { text: "Multi-city listing", included: true },
      { text: "Competitor displacement", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes, all plans are month-to-month with no long-term contracts. Cancel anytime and your listing will revert to our free tier.",
  },
  {
    question: "How quickly will my listing go live?",
    answer:
      "Free and Basic listings go live within 24 hours. Premium and Elite listings include a setup call and typically go live within 48 hours.",
  },
  {
    question: "Can I list my business in multiple cities?",
    answer:
      "Free and Basic plans include one city. Premium includes up to 3 cities. Elite includes unlimited city listings across the Triad.",
  },
  {
    question: "Do you offer annual billing discounts?",
    answer:
      "Yes! Pay annually and save 20%. Contact our sales team for annual pricing.",
  },
  {
    question: "What kind of leads can I expect?",
    answer:
      "Results vary by category and city, but Premium listings typically see 5-15x more engagement than free listings, including phone calls, form submissions, and website clicks.",
  },
];

export default function PricingPage() {
  return (
    <div className="container-main py-12">
      <JsonLd data={generateFAQPageJsonLd(faqs)} />
      <div className="text-center">
        <h1 className="section-heading">Simple, Transparent Pricing</h1>
        <p className="section-subheading max-w-2xl mx-auto">
          Choose the plan that fits your business. All plans include listing in the
          Triad&apos;s most comprehensive business directory.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card relative p-6 flex flex-col ${
              plan.popular
                ? "ring-2 ring-primary-500 border-primary-500"
                : ""
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white">
                Most Popular
              </span>
            )}
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              <div className="mt-2">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-start gap-2 text-sm">
                  {feature.included ? (
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  ) : (
                    <X className="h-4 w-4 mt-0.5 text-gray-300 shrink-0" />
                  )}
                  <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`mt-6 w-full text-center ${
                plan.popular ? "btn-primary" : "btn-secondary"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-semibold text-gray-900">{faq.question}</h3>
              <p className="mt-1 text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
