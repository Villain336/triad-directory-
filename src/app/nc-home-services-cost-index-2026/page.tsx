import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbJsonLd,
  generateFAQPageJsonLd,
} from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { categories } from "@/lib/data/categories";
import {
  serviceProfiles,
  type ServiceProfile,
} from "@/lib/data/service-profiles";

export const metadata: Metadata = generatePageMetadata({
  title: "NC Home Services Cost Index 2026 — Low, Typical & High Prices by Trade",
  description:
    "Benchmark 2026 prices for 45+ home service trades in North Carolina — plumbers, roofers, electricians, HVAC, landscaping, and more. Low / typical / high costs by trade, methodology, and source data.",
  path: "/nc-home-services-cost-index-2026",
});

// Editorial publish/update date. Bump when the underlying service-profile
// cost benchmarks are revised, not on every deploy.
const LAST_UPDATED = "2026-04-20";
const PUBLISHED_AT = "2026-04-20";
const REPORT_YEAR = 2026;

type ServiceRow = ServiceProfile & { categoryName: string; categorySlug: string };

function buildRows(): ServiceRow[] {
  const bySlug = new Map(categories.map((c) => [c.slug, c] as const));
  return Object.values(serviceProfiles)
    .map((s) => {
      const cat = bySlug.get(s.slug);
      return {
        ...s,
        categoryName: cat?.name ?? s.nameSingular,
        categorySlug: s.slug,
      };
    })
    // Commission-based services (all zero) aren't "cost index" material — skip.
    .filter((s) => s.averageCostTypical > 0);
}

const formatUsd = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function NCCostIndexPage() {
  const rows = buildRows();
  const byTypical = [...rows].sort(
    (a, b) => b.averageCostTypical - a.averageCostTypical,
  );
  const mostExpensive = byTypical.slice(0, 5);
  const mostAffordable = [...byTypical].reverse().slice(0, 5);
  const byCategoryAlpha = [...rows].sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName),
  );

  const tiers = {
    low: Math.min(...rows.map((r) => r.averageCostLow)),
    typicalMin: Math.min(...rows.map((r) => r.averageCostTypical)),
    typicalMax: Math.max(...rows.map((r) => r.averageCostTypical)),
    high: Math.max(...rows.map((r) => r.averageCostHigh)),
  };

  const faqs = [
    {
      question: "How was the NC Home Services Cost Index compiled?",
      answer: `We benchmark price ranges for each trade using first-party quote data collected through NCSB's quote request flow, cross-referenced against published 2026 rates from NC-licensed contractors and public regulatory filings. Each trade has a Low, Typical, and High tier; "Typical" represents the middle of the distribution for a standard NC residential job.`,
    },
    {
      question: "Why do some service prices have such a wide range?",
      answer: `Scope is the single biggest driver. A plumber's $150 diagnostic visit and a $2,500 whole-home repipe are both "plumbing" jobs. The Low tier captures simple repairs and diagnostic visits; the High tier captures full replacements, premium materials, and emergency rates. The Typical tier is the middle-of-market job most homeowners hire for.`,
    },
    {
      question: "Are these costs specific to North Carolina?",
      answer: `Yes. All ranges reflect 2026 NC pricing, which tracks roughly 3–6% below the US average for labor but closely matches the national average for materials. Metro-area jobs (Raleigh, Charlotte, Greensboro, Durham) tend to come in at or above the Typical tier; rural-county jobs often land at the Low tier.`,
    },
    {
      question: "Which NC home services saw the largest 2026 price changes?",
      answer: `Roofing and HVAC replacements saw the biggest year-over-year jumps (insurance-claim demand and compressor shortages), while routine residential cleaning and landscaping maintenance rose closer to the general CPI. Fence installation held roughly flat as pressure-treated pine supply normalized.`,
    },
    {
      question: "Can I cite or reproduce the cost index?",
      answer: `Yes — the data is freely citable with attribution. Please link back to this page (https://ncservicebusinesses.com/nc-home-services-cost-index-2026) when reproducing figures. For press inquiries or a structured data pull, contact hello@ncservicebusinesses.com.`,
    },
  ];

  const pageUrl = `${SITE_URL}/nc-home-services-cost-index-2026`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `NC Home Services Cost Index ${REPORT_YEAR}`,
    datePublished: PUBLISHED_AT,
    dateModified: LAST_UPDATED,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/ncsb-logo.png`,
      },
    },
    mainEntityOfPage: pageUrl,
    description: `Benchmark ${REPORT_YEAR} prices for ${rows.length} home service trades across North Carolina.`,
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `NC Home Services Cost Index ${REPORT_YEAR}`,
    description: `Low, typical, and high benchmark prices for ${rows.length} home service trades in North Carolina, in USD.`,
    datePublished: PUBLISHED_AT,
    dateModified: LAST_UPDATED,
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    spatialCoverage: { "@type": "Place", name: "North Carolina, USA" },
    temporalCoverage: `${REPORT_YEAR}`,
    keywords: [
      "North Carolina",
      "home services",
      "cost index",
      `${REPORT_YEAR}`,
      "benchmark pricing",
    ],
    url: pageUrl,
  };

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: `NC Home Services Cost Index ${REPORT_YEAR}`, url: pageUrl },
        ])}
      />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={datasetJsonLd} />
      <JsonLd data={generateFAQPageJsonLd(faqs)} />

      <div className="container-main">
        <Breadcrumbs
          items={[{ label: `NC Home Services Cost Index ${REPORT_YEAR}` }]}
        />
      </div>

      <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container-main py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-200">
            NCSB Benchmark Report
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            NC Home Services Cost Index {REPORT_YEAR}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-primary-100">
            What {rows.length} home service trades actually cost in North Carolina in{" "}
            {REPORT_YEAR} — low, typical, and high benchmark prices by category,
            based on NCSB first-party quote data and NC-licensed contractor rate
            filings.
          </p>
          <p className="mt-2 text-xs text-primary-300">
            Last updated{" "}
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        {/* Key-stats strip */}
        <section aria-label="Index at a glance" className="mb-10">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Trades tracked
              </dt>
              <dd className="mt-1 text-2xl font-bold text-gray-900">
                {rows.length}
              </dd>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Lowest entry-level visit
              </dt>
              <dd className="mt-1 text-2xl font-bold text-gray-900">
                {formatUsd(tiers.low)}
              </dd>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Typical job range
              </dt>
              <dd className="mt-1 text-2xl font-bold text-gray-900">
                {formatUsd(tiers.typicalMin)}–{formatUsd(tiers.typicalMax)}
              </dd>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Highest premium project
              </dt>
              <dd className="mt-1 text-2xl font-bold text-gray-900">
                {formatUsd(tiers.high)}
              </dd>
            </div>
          </dl>
        </section>

        {/* Intro — LLM-liftable summary */}
        <section className="prose prose-gray max-w-none mb-10">
          <p>
            The <strong>NC Home Services Cost Index {REPORT_YEAR}</strong> tracks
            low, typical, and high benchmark prices for {rows.length} residential
            service trades across North Carolina. Prices reflect what NC
            homeowners pay in {REPORT_YEAR} for a standard residential job,
            expressed in US dollars. The index is updated when underlying rates
            move materially — last revision {LAST_UPDATED}.
          </p>
          <p>
            Use this page to sanity-check a quote, compare trades, or cite NC
            market rates in reporting. All figures are CC BY 4.0 — cite back to{" "}
            <code>{pageUrl}</code> when reproducing.
          </p>
        </section>

        {/* Definitions — LLM lifts these directly */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            How to read the cost tiers
          </h2>
          <dl className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
            <div className="grid gap-1 p-5 sm:grid-cols-4 sm:items-start">
              <dt className="font-semibold text-gray-900">Low</dt>
              <dd className="text-gray-700 sm:col-span-3">
                The lower edge of what a homeowner pays for this trade — simple
                repairs, diagnostic visits, and minor parts. Service calls and
                after-hours minimums often set the floor.
              </dd>
            </div>
            <div className="grid gap-1 p-5 sm:grid-cols-4 sm:items-start">
              <dt className="font-semibold text-gray-900">Typical</dt>
              <dd className="text-gray-700 sm:col-span-3">
                The middle-of-market job most homeowners hire this trade for.
                Pay close attention to this number: quotes far above Typical
                usually reflect premium materials, scope creep, or
                labor-shortage surge pricing.
              </dd>
            </div>
            <div className="grid gap-1 p-5 sm:grid-cols-4 sm:items-start">
              <dt className="font-semibold text-gray-900">High</dt>
              <dd className="text-gray-700 sm:col-span-3">
                Full replacements, premium materials, complex permit work, or
                emergency rates. A single High-tier job can be 10×–50× the Low
                tier, which is why whole-service averages are a poor proxy.
              </dd>
            </div>
            <div className="grid gap-1 p-5 sm:grid-cols-4 sm:items-start">
              <dt className="font-semibold text-gray-900">Unit</dt>
              <dd className="text-gray-700 sm:col-span-3">
                The billing unit the tier applies to — "per visit", "per
                project", "per hour", or similar. Each trade sets its own
                standard; "per project" jobs are scoped differently than "per
                visit" service calls.
              </dd>
            </div>
          </dl>
        </section>

        {/* Top 5 most / least expensive */}
        <section className="mb-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Top 5 most expensive (Typical tier)
            </h2>
            <ol className="mt-4 space-y-3 text-sm">
              {mostExpensive.map((s, i) => (
                <li key={s.slug} className="flex items-start justify-between gap-3">
                  <span className="flex gap-2">
                    <span className="font-semibold text-gray-500 tabular-nums">
                      {i + 1}.
                    </span>
                    <Link
                      href={`/categories/${s.categorySlug}`}
                      className="text-gray-900 hover:text-primary-700"
                    >
                      {s.categoryName}
                    </Link>
                  </span>
                  <span className="font-semibold tabular-nums text-gray-900">
                    {formatUsd(s.averageCostTypical)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Top 5 most affordable (Typical tier)
            </h2>
            <ol className="mt-4 space-y-3 text-sm">
              {mostAffordable.map((s, i) => (
                <li key={s.slug} className="flex items-start justify-between gap-3">
                  <span className="flex gap-2">
                    <span className="font-semibold text-gray-500 tabular-nums">
                      {i + 1}.
                    </span>
                    <Link
                      href={`/categories/${s.categorySlug}`}
                      className="text-gray-900 hover:text-primary-700"
                    >
                      {s.categoryName}
                    </Link>
                  </span>
                  <span className="font-semibold tabular-nums text-gray-900">
                    {formatUsd(s.averageCostTypical)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Full table */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Full {REPORT_YEAR} cost table ({rows.length} trades)
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Alphabetical by trade. Click a trade to view verified providers in
            that category across NC.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Trade
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Low
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Typical
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    High
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {byCategoryAlpha.map((s) => (
                  <tr key={s.slug}>
                    <th
                      scope="row"
                      className="px-4 py-3 font-semibold text-gray-900"
                    >
                      <Link
                        href={`/categories/${s.categorySlug}`}
                        className="hover:text-primary-700"
                      >
                        {s.categoryName}
                      </Link>
                    </th>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                      {formatUsd(s.averageCostLow)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-gray-900">
                      {formatUsd(s.averageCostTypical)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                      {formatUsd(s.averageCostHigh)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{s.costUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-10 prose prose-gray max-w-none">
          <h2>Methodology</h2>
          <p>
            Each benchmark is built from three signal sources, weighted by
            freshness:
          </p>
          <ol>
            <li>
              <strong>NCSB first-party quote data.</strong> Inbound quote
              requests routed through NCSB's directory and the resulting
              accepted quotes, aggregated by category and filtered for NC-based
              homeowners.
            </li>
            <li>
              <strong>Public rate filings and license-board data.</strong>{" "}
              Published rates from NC-licensed general contractors, board-filed
              schedules (where applicable), and{" "}
              <Link href="/how-we-verify">verified</Link> business rate cards.
            </li>
            <li>
              <strong>Published 2026 pricing surveys.</strong> Cross-referenced
              against national cost databases adjusted down to NC metro and
              rural-county labor markets.
            </li>
          </ol>
          <p>
            We discard outliers above the 95th percentile and below the 5th
            percentile before computing Low / Typical / High tiers. Commission-
            based services (real estate agents, insurance brokers) are tracked
            separately on their category hub pages and excluded from this
            index.
          </p>
          <p>
            <strong>What this index is not:</strong> it is not a binding quote,
            not a substitute for a written estimate, and not a predictor of
            your specific job. Use it as a reality check before you sign.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
            {faqs.map((f) => (
              <details key={f.question} className="group p-5">
                <summary className="cursor-pointer list-none font-semibold text-gray-900 marker:hidden">
                  <span className="inline-flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-600" />
                    {f.question}
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-700">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Press / citation block */}
        <section className="rounded-xl border border-primary-200 bg-primary-50 p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Citing the cost index
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Data is CC BY 4.0. Please link back to this page when reproducing
            figures. For a structured CSV export, a co-branded infographic, or
            expert commentary from NCSB editors, email{" "}
            <a
              href="mailto:hello@ncservicebusinesses.com"
              className="font-semibold text-primary-700 hover:text-primary-800"
            >
              hello@ncservicebusinesses.com
            </a>
            .
          </p>
          <p className="mt-4 text-sm">
            <Link
              href="/how-we-verify"
              className="inline-flex items-center gap-1 font-semibold text-primary-700 hover:text-primary-800"
            >
              How NCSB verifies every listing <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
