import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { MapPin, ArrowRight } from "lucide-react";
import { cities, getCityBySlug } from "@/lib/data/cities";
import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { getListings } from "@/lib/data/index";
import { generateCityCategoryMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbJsonLd, generateItemListJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ListingGrid from "@/components/listings/ListingGrid";
import AdSlot from "@/components/ads/AdSlot";
import QuoteRequestForm from "@/components/lead-gen/QuoteRequestForm";
import ExitIntentModal from "@/components/lead-gen/ExitIntentModal";
import AgencyCTA from "@/components/agency/AgencyCTA";

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

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const city = getCityBySlug(params.city);
  const category = getCategoryBySlug(params.category);
  if (!city || !category) return {};
  return generateCityCategoryMetadata(city.name, city.slug, category.name, category.slug);
}

export const revalidate = 3600;

export default async function CityCategoryPage({ params }: CategoryPageProps) {
  const city = getCityBySlug(params.city);
  const category = getCategoryBySlug(params.category);
  if (!city || !category) notFound();

  const listings = await getListings({ citySlug: city.slug, categorySlug: category.slug });

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
            Find top-rated {category.name.toLowerCase()} in {city.name}. Read reviews,
            compare ratings, and get free quotes from trusted local{" "}
            {category.name.toLowerCase()}.
          </p>
          <p className="mt-2 text-sm text-primary-300">
            {listings.length} {category.name.toLowerCase()} found in {city.name}
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AdSlot position="banner-top" className="mb-6" />

            <ListingGrid
              listings={listings}
              emptyMessage={`No ${category.name.toLowerCase()} listed in ${city.name} yet. Be the first!`}
            />

            {listings.length === 0 && (
              <div className="mt-6 rounded-xl bg-primary-50 p-6 text-center">
                <h3 className="font-semibold text-gray-900">
                  Are you a {category.name.toLowerCase().replace(/s$/, "")} in{" "}
                  {city.name}?
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Get listed and start receiving leads today.
                </p>
                <Link href="/claim-listing" className="btn-primary mt-4">
                  Add Your Business Free
                </Link>
              </div>
            )}

            {/* Agency CTA */}
            <div className="mt-8">
              <AgencyCTA variant="inline" cityName={city.name} categoryName={category.name} />
            </div>

            {/* SEO Content */}
            <section className="mt-12 prose prose-gray max-w-none">
              <h2>
                Find the Best {category.name} in {city.name}, NC
              </h2>
              <p>
                Looking for reliable {category.name.toLowerCase()} in {city.name},{" "}
                North Carolina? Triad Directory makes it easy to find, compare, and
                contact the top-rated {category.name.toLowerCase()} serving the{" "}
                {city.name} area.
              </p>
              <p>
                Every {category.name.toLowerCase().replace(/s$/, "")} listed on our
                directory includes ratings, reviews, contact information, and service
                details so you can make an informed decision. Many of our premium-listed{" "}
                {category.name.toLowerCase()} offer free estimates and same-day service.
              </p>
              <h3>
                Why Use Triad Directory to Find {category.name} in {city.name}?
              </h3>
              <ul>
                <li>Verified, licensed professionals</li>
                <li>Real customer ratings and reviews</li>
                <li>Free quotes with no obligation</li>
                <li>Click-to-call for instant connections</li>
                <li>Side-by-side comparison of services and pricing</li>
              </ul>

              <h3>
                {category.name} in Other Triad Cities
              </h3>
              <ul>
                {cities
                  .filter((c) => c.slug !== city.slug && c.featured)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link href={`/${c.slug}/${category.slug}`}>
                        {category.name} in {c.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <QuoteRequestForm
              defaultCity={city.slug}
              defaultCategory={category.slug}
            />

            <AdSlot position="sidebar" />

            {/* Related Categories */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900">
                More Services in {city.name}
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
