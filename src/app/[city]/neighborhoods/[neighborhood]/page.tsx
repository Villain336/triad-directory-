import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { MapPin, ArrowRight } from "lucide-react";
import { cities, getCityBySlug } from "@/lib/data/cities";
import { getFeaturedCategories } from "@/lib/data/categories";
import { neighborhoods, getNeighborhoodsByCity } from "@/lib/data/neighborhoods";
import { getListings } from "@/lib/data/index";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ListingGrid from "@/components/listings/ListingGrid";
import AdSlot from "@/components/ads/AdSlot";
import QuoteRequestForm from "@/components/lead-gen/QuoteRequestForm";

interface Props {
  params: { city: string; neighborhood: string };
}

export function generateStaticParams() {
  const params: { city: string; neighborhood: string }[] = [];
  for (const n of neighborhoods) {
    params.push({ city: n.citySlug, neighborhood: n.slug });
  }
  return params;
}

export function generateMetadata({ params }: Props): Metadata {
  const city = getCityBySlug(params.city);
  const neighborhood = neighborhoods.find(
    (n) => n.citySlug === params.city && n.slug === params.neighborhood
  );
  if (!city || !neighborhood) return {};
  return generatePageMetadata({
    title: `${neighborhood.name} Services & Businesses - ${city.name}, NC`,
    description: `Find trusted local businesses and services in ${neighborhood.name}, ${city.name}, NC. Browse plumbers, electricians, contractors, and more serving the ${neighborhood.name} area.`,
    path: `/${city.slug}/neighborhoods/${neighborhood.slug}`,
  });
}

export const revalidate = 3600;

export default async function NeighborhoodPage({ params }: Props) {
  const city = getCityBySlug(params.city);
  const neighborhood = neighborhoods.find(
    (n) => n.citySlug === params.city && n.slug === params.neighborhood
  );
  if (!city || !neighborhood) notFound();

  const listings = await getListings({ citySlug: city.slug });
  const featuredCategories = getFeaturedCategories();
  const otherNeighborhoods = getNeighborhoodsByCity(city.slug).filter(
    (n) => n.slug !== neighborhood.slug
  );

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: city.name, url: `/${city.slug}` },
          { name: "Neighborhoods", url: `/${city.slug}` },
          { name: neighborhood.name, url: `/${city.slug}/neighborhoods/${neighborhood.slug}` },
        ])}
      />

      <div className="container-main">
        <Breadcrumbs
          items={[
            { label: city.name, href: `/${city.slug}` },
            { label: neighborhood.name },
          ]}
        />
      </div>

      <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container-main py-10">
          <div className="flex items-center gap-2 text-primary-200 text-sm">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {city.name}, NC &middot; ZIP: {neighborhood.zipCodes.join(", ")}
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {neighborhood.name} Business Directory
          </h1>
          <p className="mt-3 max-w-2xl text-primary-200">{neighborhood.description}</p>
        </div>
      </section>

      <div className="container-main py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Services in this neighborhood */}
            <h2 className="text-2xl font-bold text-gray-900">
              Services Near {neighborhood.name}
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {featuredCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${city.slug}/${cat.slug}`}
                  className="card flex items-center gap-3 p-4 hover:border-primary-300 transition-colors"
                >
                  <MapPin className="h-5 w-5 text-primary-600 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                    <span className="block text-xs text-gray-500">
                      near {neighborhood.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Nearby Listings */}
            {listings.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Businesses Serving {neighborhood.name}
                </h2>
                <div className="mt-6">
                  <ListingGrid listings={listings.slice(0, 6)} />
                </div>
              </section>
            )}

            {/* SEO Content */}
            <section className="mt-12 prose prose-gray max-w-none">
              <h2>About {neighborhood.name}</h2>
              <p>{neighborhood.description}</p>
              <p>
                Looking for local services in {neighborhood.name}, {city.name}?
                Triad Directory connects you with verified businesses serving the{" "}
                {neighborhood.name} area and surrounding ZIP codes ({neighborhood.zipCodes.join(", ")}).
                Whether you need a plumber, electrician, contractor, or any other
                service, our directory has you covered.
              </p>
              <h3>Other Neighborhoods in {city.name}</h3>
              <ul>
                {otherNeighborhoods.map((n) => (
                  <li key={n.slug}>
                    <Link href={`/${city.slug}/neighborhoods/${n.slug}`}>
                      {n.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6">
            <QuoteRequestForm defaultCity={city.slug} />
            <AdSlot position="sidebar" />

            {otherNeighborhoods.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900">
                  More Neighborhoods
                </h3>
                <ul className="mt-3 space-y-2">
                  {otherNeighborhoods.map((n) => (
                    <li key={n.slug}>
                      <Link
                        href={`/${city.slug}/neighborhoods/${n.slug}`}
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600"
                      >
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        {n.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <AdSlot position="sidebar" />
          </aside>
        </div>
      </div>
    </>
  );
}
