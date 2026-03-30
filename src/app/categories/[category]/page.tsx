import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { MapPin, ArrowRight } from "lucide-react";
import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { cities, getFeaturedCities } from "@/lib/data/cities";
import { getListings } from "@/lib/data/index";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ListingGrid from "@/components/listings/ListingGrid";
import AdSlot from "@/components/ads/AdSlot";

interface Props {
  params: { category: string };
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = getCategoryBySlug(params.category);
  if (!category) return {};
  return generatePageMetadata({
    title: `${category.name} in the Triad - All Cities`,
    description: `Find the best ${category.name.toLowerCase()} across the Piedmont Triad. Browse ${category.name.toLowerCase()} in Greensboro, Winston-Salem, High Point, and 30+ cities.`,
    path: `/categories/${category.slug}`,
  });
}

export const revalidate = 3600;

export default async function CategoryAcrossCitiesPage({ params }: Props) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const listings = await getListings({ categorySlug: category.slug });
  const featuredCities = getFeaturedCities();

  return (
    <>
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
            {category.name} in the Piedmont Triad
          </h1>
          <p className="mt-3 max-w-2xl text-primary-200">
            {category.description}. Find top-rated {category.name.toLowerCase()} in every
            Triad city.
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        {/* City Quick Links */}
        <div className="mb-8 rounded-xl bg-gray-50 p-5 border border-gray-200">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Find {category.name} By City
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}/${category.slug}`}
                className="rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:border-primary-300 hover:text-primary-700 transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              All {category.name} in the Triad
            </h2>
            <ListingGrid listings={listings} showCity />
          </div>

          <aside className="space-y-6">
            <AdSlot position="sidebar" />
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900">Browse by City</h3>
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
