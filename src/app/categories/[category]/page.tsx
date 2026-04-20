import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { cities, getFeaturedCities } from "@/lib/data/cities";
import { getListings } from "@/lib/data/index";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServiceProfile } from "@/lib/data/service-profiles";
import { buildCategoryHubFAQs } from "@/lib/seo/faq";
import {
  generateBreadcrumbJsonLd,
  generateFAQPageJsonLd,
} from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ListingGrid from "@/components/listings/ListingGrid";
import AdSlot from "@/components/ads/AdSlot";
import FAQBlock from "@/components/seo/FAQBlock";
import CostTable from "@/components/seo/CostTable";
import ServiceDefinitionList from "@/components/seo/ServiceDefinitionList";

interface Props {
  params: { category: string };
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = getCategoryBySlug(params.category);
  if (!category) return {};
  const year = new Date().getUTCFullYear();
  const lower = category.name.toLowerCase();
  return generatePageMetadata({
    title: `${category.name} in North Carolina (${year}) | Verified Local Pros`,
    description: `Find verified, licensed ${lower} across 47 North Carolina cities — Greensboro, Raleigh, Durham, Winston-Salem, Cary, and more. First-party reviews, cost guides, and free quotes.`,
    path: `/categories/${category.slug}`,
  });
}

export const revalidate = 3600;

export default async function CategoryAcrossCitiesPage({ params }: Props) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  // Computed inside the component so ISR revalidation produces a fresh date.
  const lastUpdated = new Date().toISOString().slice(0, 10);
  const listings = await getListings({ categorySlug: category.slug });
  const featuredCities = getFeaturedCities();
  const service = getServiceProfile(category.slug, category.name);
  const faqs = buildCategoryHubFAQs(category);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Categories", url: "/categories" },
          { name: category.name, url: `/categories/${category.slug}` },
        ])}
      />
      <JsonLd data={generateFAQPageJsonLd(faqs)} />

      <div className="container-main">
        <Breadcrumbs
          items={[
            { label: "Categories", href: "/categories" },
            { label: category.name },
          ]}
        />
      </div>

      <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container-main py-8 sm:py-12">
          <h1 className="text-3xl font-bold sm:text-4xl">
            {category.name} in North Carolina
          </h1>
          <p className="mt-3 max-w-2xl text-primary-200">
            Verified {category.name.toLowerCase()} across 47 NC cities. Licensed, insured,
            and first-party reviewed by NCSB.
          </p>
          <p className="mt-2 text-xs text-primary-300">
            Last updated <time dateTime={lastUpdated}>{lastUpdated}</time>
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        {/* Intro paragraph for LLM-liftable summary */}
        <section className="prose prose-gray max-w-none mb-8">
          <p>
            <strong>{category.name}</strong>: {service.definition}.
            {service.ncLicenseRequired
              ? ` North Carolina ${category.name.toLowerCase()} are regulated by ${service.ncLicenseAuthority}. Every business listed on this page has had its license verified within the last 90 days.`
              : ` NC does not require a dedicated state license for ${category.name.toLowerCase()}, but NCSB still verifies insurance and business registration before publishing.`}
          </p>
        </section>

        {/* City Quick Links */}
        <div className="mb-8 rounded-xl bg-gray-50 p-5 border border-gray-200">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Find {category.name} by city
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}/${category.slug}`}
                className="rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:border-primary-300 hover:text-primary-700 transition-colors"
              >
                {category.name} in {city.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              All {category.name} on NCSB
            </h2>
            <ListingGrid listings={listings} showCity />

            <ServiceDefinitionList service={service} categoryName={category.name} />
            <CostTable service={service} serviceName={category.name} />
            <FAQBlock faqs={faqs} />
          </div>

          <aside className="space-y-6">
            <AdSlot position="sidebar" />
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900">Browse by city</h3>
              <ul className="mt-3 space-y-2">
                {featuredCities.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/${city.slug}/${category.slug}`}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      {category.name} in {city.name}
                    </Link>
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
