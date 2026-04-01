import Link from "next/link";
import { Metadata } from "next";
import { CheckCircle, X, Zap } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateFAQPageJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata: Metadata = generatePageMetadata({
  title: "Pricing - Listing Plans",
  description:
    "Choose the perfect listing plan for your business. Free, Basic, and Premium tiers available. Get more leads in the Piedmont Triad.",
  path: "/pricing",
});

const plans = [
  {
    name: "Free",
    tier: "free",
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
    checkout: false,
  },
  {
    name: "Basic",
    tier: "basic",
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
    href: null,
    popular: false,
    checkout: true,
  },
  {
    name: "Premium",
    tier: "premium",
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
    href: null,
    popular: true,
    checkout: true,
  },
];

const addons = [
  {
    name: "Featured Boost",
    addon: "featuredBoost",
    price: "$29",
    period: "one-time",
    description: "Boost your listing to the top of search results and homepage for 7 days.",
    cta: "Buy Boost",
  },
  {
    name: "Banner Ad",
    addon: "bannerAd",
    price: "$149",
    period: "/month",
    description: "Display banner ads across directory pages. Geo-targeted by city or category.",
    cta: "Start Banner Ad",
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
      "Free and Basic plans include one city. Premium includes up to 3 cities across the Triad.",
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

      <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
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

            {plan.checkout ? (
              <CheckoutButton
                tier={plan.tier}
                label={plan.cta}
                className={`mt-6 w-full text-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              />
            ) : (
              <Link
                href={plan.href!}
                className={`mt-6 w-full text-center ${
                  plan.popular ? "btn-primary" : "btn-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <section className="mt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-amber-500" />
            Add-Ons &amp; Boosts
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Supercharge any listing plan with these extras
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
          {addons.map((item) => (
            <div key={item.name} className="card p-6 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
              <div className="mt-1">
                <span className="text-2xl font-bold text-gray-900">{item.price}</span>
                <span className="text-sm text-gray-500 ml-1">{item.period}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 flex-1">{item.description}</p>
              <CheckoutButton
                addon={item.addon}
                label={item.cta}
                className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
              />
            </div>
          ))}
        </div>
      </section>

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
