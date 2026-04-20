import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { MapPin, ArrowRight } from "lucide-react";
import { cities, getCityBySlug } from "@/lib/data/cities";
import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { getListings } from "@/lib/data/index";
import { generateCityCategoryMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbJsonLd,
  generateItemListJsonLd,
  generateFAQPageJsonLd,
} from "@/lib/seo/jsonld";
import { composeCityServiceIntro, nearestCities, relatedServicesFor } from "@/lib/seo/composition";
import { buildCityServiceFAQs } from "@/lib/seo/faq";
import { getServiceProfile } from "@/lib/data/service-profiles";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ListingGrid from "@/components/listings/ListingGrid";
import AdSlot from "@/components/ads/AdSlot";
import QuoteRequestForm from "@/components/lead-gen/QuoteRequestForm";
import ExitIntentModal from "@/components/lead-gen/ExitIntentModal";
import AgencyCTA from "@/components/agency/AgencyCTA";
import FAQBlock from "@/components/seo/FAQBlock";
import CostTable from "@/components/seo/CostTable";
import KeyFacts from "@/components/seo/KeyFacts";

interface CategoryPageProps {
  params: { city: string; category: string };
}

export function generateStaticParams() {
  const params: { city: string; category: string }[] = [];
  for (const city of cities) {
    for (const cat of categories) {
      params.push({ city: city.slug, category: cat.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  const category = getCategoryBySlug(params.category);
  if (!city || !category) return {};
  const listings = await getListings({ citySlug: city.slug, categorySlug: category.slug });
  return generateCityCategoryMetadata(city.name, city.slug, category.name, category.slug, listings.length);
}

export const revalidate = 3600;

export default async function CityCategoryPage({ params }: CategoryPageProps) {
  const city = getCityBySlug(params.city);
  const category = getCategoryBySlug(params.category);
  if (!city || !category) notFound();

  // Computed inside the component so ISR revalidation (every `revalidate`
  // seconds) produces a fresh timestamp — a module-level constant would be
  // frozen to the deploy/cold-start date.
  const lastUpdated = new Date().toISOString().slice(0, 10);
  const listings = await getListings({ citySlug: city.slug, categorySlug: category.slug });
  const service = getServiceProfile(category.slug, category.name);
  const intro = composeCityServiceIntro(city, category, listings.length);
  const faqs = buildCityServiceFAQs(city, category);
  const nearby = nearestCities(city, cities, 3);
  const related = relatedServicesFor(category, categories, 3);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: city.name, url: `/${city.slug}` },
          { name: category.name, url: `/${city.slug}/${category.slug}` },
        ])}
      />
      <JsonLd
        data={generateItemListJsonLd(
          listings,
          city.name,
          category.name,
          city.slug,
          category.slug
        )}
      />
      <JsonLd data={generateFAQPageJsonLd(faqs)} />
      <ExitIntentModal
        categoryName={category.name}
        cityName={city.name}
        citySlug={city.slug}
        categorySlug={category.slug}
      />

      <div className="container-main">
        <Breadcrumbs
          items={[
            { label: city.name, href: `/${city.slug}` },
            { label: category.name },
          ]}
        />
      </div>

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container-main py-8 sm:py-12">
          <div className="flex items-center gap-2 text-primary-200 text-sm">
            <MapPin className="h-4 w-4" />
            {city.name}, {city.county} County, NC
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Best {category.name} in {city.name}, NC
          </h1>
          <p className="mt-3 max-w-2xl text-primary-200">
            {listings.length > 0
              ? `${listings.length} verified ${category.name.toLowerCase()} serving ${city.name}. Licensed, insured, and first-party reviewed.`
              : `Finding licensed, insured ${category.name.toLowerCase()} in ${city.name}. Claim your free listing to appear here.`}
          </p>
          <p className="mt-2 text-xs text-primary-300">
            Last updated <time dateTime={lastUpdated}>{lastUpdated}</time>
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Composed intro — unique per (city, service) */}
            <section className="prose prose-gray max-w-none">
              {intro.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>

            <AdSlot position="banner-top" className="my-6" />

            <ListingGrid
              listings={listings}
              emptyMessage={`No ${category.name.toLowerCase()} listed in ${city.name} yet. Be the first!`}
            />

            {listings.length === 0 && (
              <div className="mt-6 rounded-xl bg-primary-50 p-6 text-center">
                <h3 className="font-semibold text-gray-900">
                  Are you a {service.nameSingular} in {city.name}?
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Get listed and start receiving leads today.
                </p>
                <Link href="/claim-listing" className="btn-primary mt-4">
                  Add Your Business Free
                </Link>
              </div>
            )}

            {/* Cost table */}
            <CostTable service={service} cityName={city.name} serviceName={category.name} />

            {/* FAQ — paired with FAQPage JSON-LD above */}
            <FAQBlock faqs={faqs} />

            {/* Agency CTA */}
            <div className="mt-10">
              <AgencyCTA variant="inline" cityName={city.name} categoryName={category.name} />
            </div>

            {/* Horizontal internal linking — §4.5 */}
            <section className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {category.name} in nearby cities
                </h2>
                <ul className="mt-3 space-y-2">
                  {nearby.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${c.slug}/${category.slug}`}
                        className="inline-flex items-center gap-1.5 text-primary-700 hover:text-primary-800 hover:underline"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        {category.name} in {c.name}, NC
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Related services in {city.name}
                </h2>
                <ul className="mt-3 space-y-2">
                  {related.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${city.slug}/${c.slug}`}
                        className="inline-flex items-center gap-1.5 text-primary-700 hover:text-primary-800 hover:underline"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        {c.name} in {city.name}, NC
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Resource links */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-gray-900">Helpful resources</h2>
              <ul className="mt-3 grid gap-2 text-gray-700 sm:grid-cols-2">
                <li>
                  <Link href="/how-we-verify" className="text-primary-700 hover:underline">
                    How NCSB verifies {category.name.toLowerCase()}
                  </Link>
                </li>
                <li>
                  <Link href="/tools/cost-estimator" className="text-primary-700 hover:underline">
                    {category.name} cost estimator
                  </Link>
                </li>
                <li>
                  <Link href={`/${city.slug}`} className="text-primary-700 hover:underline">
                    All services in {city.name}
                  </Link>
                </li>
                <li>
                  <Link href={`/categories/${category.slug}`} className="text-primary-700 hover:underline">
                    {category.name} across North Carolina
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-primary-700 hover:underline">
                    Ask the community about {category.name.toLowerCase()}
                  </Link>
                </li>
                <li>
                  <Link href="/claim-listing" className="text-primary-700 hover:underline">
                    Are you a {service.nameSingular}? Claim your listing
                  </Link>
                </li>
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <QuoteRequestForm
              defaultCity={city.slug}
              defaultCategory={category.slug}
            />

            <KeyFacts facts={intro.keyFacts} heading={`${category.name} in ${city.name} — at a glance`} />

            <AdSlot position="sidebar" />

            <div className="card p-5">
              <h3 className="font-semibold text-gray-900">
                More services in {city.name}
              </h3>
              <ul className="mt-3 space-y-2">
                {categories
                  .filter((c) => c.slug !== category.slug)
                  .slice(0, 8)
                  .map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/${city.slug}/${cat.slug}`}
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        {cat.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <AgencyCTA variant="sidebar" />
          </aside>
        </div>
      </div>
    </>
  );
}
