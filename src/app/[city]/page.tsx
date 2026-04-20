import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { MapPin, ArrowRight, Users } from "lucide-react";
import { cities, getCityBySlug } from "@/lib/data/cities";
import { categories, getFeaturedCategories } from "@/lib/data/categories";
import { getListings } from "@/lib/data/index";
import { getCityProfile } from "@/lib/data/city-profiles";
import { generateCityMetadata } from "@/lib/seo/metadata";
import { generateCityDirectoryJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { nearestCities } from "@/lib/seo/composition";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ListingCard from "@/components/listings/ListingCard";
import AdSlot from "@/components/ads/AdSlot";
import ContactForm from "@/components/lead-gen/ContactForm";
import KeyFacts from "@/components/seo/KeyFacts";

interface CityPageProps {
  params: { city: string };
}

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export function generateMetadata({ params }: CityPageProps): Metadata {
  const city = getCityBySlug(params.city);
  if (!city) return {};
  return generateCityMetadata(city.name, city.slug);
}

export const revalidate = 3600;

export default async function CityPage({ params }: CityPageProps) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  // Computed inside the component so ISR revalidation produces a fresh date.
  const lastUpdated = new Date().toISOString().slice(0, 10);
  const listings = await getListings({ citySlug: city.slug });
  const featuredCategories = getFeaturedCategories();
  const featuredListings = listings.filter((l: any) => l.isFeatured).slice(0, 4);
  const profile = getCityProfile(city.slug);
  const nearby = nearestCities(city, cities, 5);

  const keyFacts = [
    { label: "County", value: `${city.county} County, NC` },
    { label: "Population", value: city.population.toLocaleString() },
    { label: "Primary ZIPs", value: profile.zipCodes.slice(0, 4).join(", ") || "—" },
    { label: "Permit authority", value: profile.permitAuthority },
    { label: "Verified businesses listed", value: `${listings.length}` },
  ];

  return (
    <>
      <JsonLd
        data={generateCityDirectoryJsonLd(city.name, city.slug, listings.length)}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: city.name, url: `/${city.slug}` },
        ])}
      />

      <div className="container-main">
        <Breadcrumbs items={[{ label: city.name }]} />
      </div>

      {/* City Hero */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container-main py-10 sm:py-14">
          <div className="flex items-center gap-2 text-primary-200 text-sm">
            <MapPin className="h-4 w-4" />
            {city.county} County, North Carolina
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
            {city.name} Business Directory
          </h1>
          <p className="mt-3 max-w-2xl text-primary-200 text-lg">{city.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-primary-300">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Pop. {city.population.toLocaleString()}
            </span>
            <span>{listings.length}+ verified businesses</span>
            <span>
              Last updated <time dateTime={lastUpdated}>{lastUpdated}</time>
            </span>
          </div>
        </div>
      </section>

      <div className="container-main py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Category Grid */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Browse Services in {city.name}
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${city.slug}/${cat.slug}`}
                    className="card group flex items-center gap-3 p-4 transition-all hover:border-primary-300"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                      <span className="block text-xs text-gray-500">in {city.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Featured Listings */}
            {featuredListings.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Businesses in {city.name}
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {featuredListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </section>
            )}

            {/* SEO Content */}
            <section className="mt-12 prose prose-gray max-w-none">
              <h2>About {city.name}, NC</h2>
              <p>
                <strong>{city.name}</strong> is {profile.localFlavor}. {city.description}
              </p>
              <p>
                {city.name} has a {profile.climateNotes}, which shapes seasonal demand for
                the most common home services — HVAC tune-ups in spring and fall, tree
                service and roofing after summer storms, and plumbing calls during the
                January–February cold snap.
              </p>
              {profile.neighborhoods.length > 0 && (
                <>
                  <h3>Neighborhoods served</h3>
                  <p>
                    NCSB-listed businesses cover all of {city.name}, including{" "}
                    {profile.neighborhoods.slice(0, 8).join(", ")}.
                  </p>
                </>
              )}
              {profile.zipCodes.length > 0 && (
                <p>
                  <strong>ZIP codes served:</strong>{" "}
                  {profile.zipCodes.join(", ")}.
                </p>
              )}
              <h3>Permits &amp; licensing in {city.name}</h3>
              <p>
                Building, plumbing, electrical, and mechanical permits in {city.name} are
                issued by{" "}
                <a href={profile.permitUrl} rel="noopener noreferrer">
                  {profile.permitAuthority}
                </a>
                . Any licensed contractor on NCSB pulls permits on your behalf — if a
                business insists you pull the permit yourself on a permit-required job,
                that's a red flag.
              </p>
              <h3>Popular services in {city.name}</h3>
              <ul>
                {featuredCategories.slice(0, 8).map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/${city.slug}/${cat.slug}`}>
                      {cat.name} in {city.name}, NC
                    </Link>{" "}
                    — {cat.description}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <KeyFacts facts={keyFacts} heading={`${city.name} at a glance`} />

            <AdSlot position="sidebar" />

            <div className="card p-5">
              <ContactForm citySlug={city.slug} />
            </div>

            <AdSlot position="sidebar" />

            {/* Nearby Cities — by actual distance, not just county */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900">Nearby cities</h3>
              <ul className="mt-3 space-y-2">
                {nearby.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/${c.slug}`}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      {c.name}, NC directory
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
