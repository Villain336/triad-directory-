import { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
  Phone,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { cities, getFeaturedCities } from "@/lib/data/cities";
import { getFeaturedCategories } from "@/lib/data/categories";
import { getListings } from "@/lib/data/index";
import { sampleReviews } from "@/lib/data/sample-reviews";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import ListingCard from "@/components/listings/ListingCard";
import AdSlot from "@/components/ads/AdSlot";
import NewsletterSignup from "@/components/lead-gen/NewsletterSignup";
import QuoteRequestForm from "@/components/lead-gen/QuoteRequestForm";

export const metadata: Metadata = {
  title: `${SITE_NAME} - Find Trusted Service Pros Across North Carolina`,
  description:
    "North Carolina's #1 service business directory. Find verified contractors, trades, and professionals in the Triad, Triangle, Raleigh, Greensboro, Winston-Salem & 45+ cities. Free quotes.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} - Find Trusted Service Pros Across North Carolina`,
    description:
      "North Carolina's #1 service business directory. Find verified pros in the Triad, Triangle & 45+ cities.",
    url: SITE_URL,
    type: "website",
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const featuredCities = getFeaturedCities();
  const featuredCategories = getFeaturedCategories();
  const featuredListings = await getListings({ featured: true, limit: 4 });

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container-main relative py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find Trusted Service Pros Across{" "}
              <span className="text-accent-400">North Carolina</span>
            </h1>
            <p className="mt-4 text-lg text-primary-200 sm:text-xl">
              NC&apos;s most comprehensive directory of service businesses, trades,
              and contractors. Triad, Triangle, Raleigh, Greensboro & 45+ cities.
            </p>

            {/* Search Bar */}
            <form
              action="/search"
              method="GET"
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="What do you need? (e.g., plumber, electrician, dentist)"
                  className="w-full rounded-xl border-0 py-4 pl-12 pr-4 text-gray-900 shadow-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-accent-500 px-8 py-4 font-semibold text-gray-900 shadow-lg transition hover:bg-accent-400"
              >
                Search
              </button>
            </form>

            {/* Quick Links */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-primary-200">
              <span>Popular:</span>
              {featuredCategories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container-main py-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Shield className="h-6 w-6 text-primary-600" />
              <span className="text-sm font-semibold text-gray-900">Verified Businesses</span>
              <span className="text-xs text-gray-500">Licensed & insured</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Star className="h-6 w-6 text-accent-500" />
              <span className="text-sm font-semibold text-gray-900">Real Reviews</span>
              <span className="text-xs text-gray-500">Honest ratings</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Users className="h-6 w-6 text-primary-600" />
              <span className="text-sm font-semibold text-gray-900">500+ Businesses</span>
              <span className="text-xs text-gray-500">Across the Triad</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="text-sm font-semibold text-gray-900">Free Quotes</span>
              <span className="text-xs text-gray-500">No obligation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="container-main py-4">
        <AdSlot position="banner-top" />
      </div>

      {/* Browse by City */}
      <section className="py-12 sm:py-16">
        <div className="container-main">
          <div className="text-center">
            <h2 className="section-heading">Browse by City</h2>
            <p className="section-subheading">
              Find local businesses in every Triad community
            </p>
          </div>

          {/* Featured Cities */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                <MapPin className="absolute right-4 top-4 h-12 w-12 text-white/10" />
                <h3 className="text-xl font-bold">{city.name}</h3>
                <p className="mt-1 text-sm text-primary-200">{city.county} County</p>
                <p className="mt-3 text-xs text-primary-300">
                  Pop. {city.population.toLocaleString()}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-300 group-hover:text-accent-200">
                  Browse Listings <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>

          {/* All Cities Grid */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              All Triad Cities & Towns
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container-main">
          <div className="text-center">
            <h2 className="section-heading">Popular Services</h2>
            <p className="section-subheading">
              The most searched-for services across the Triad
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="card group p-5 text-center transition-all hover:border-primary-300 hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{cat.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{cat.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary-600 group-hover:text-primary-700">
                  Find {cat.name} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/categories" className="btn-secondary gap-2">
              View All Categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 sm:py-16">
        <div className="container-main">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-heading">Featured Businesses</h2>
              <p className="section-subheading">
                Top-rated, verified businesses across the Triad
              </p>
            </div>
            <Link href="/search" className="hidden sm:inline-flex btn-secondary text-sm gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} showCity />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reviews - Social Proof */}
      <section className="bg-gray-50 py-12 sm:py-16 border-t border-gray-100">
        <div className="container-main">
          <div className="text-center">
            <h2 className="section-heading">What Triad Residents Are Saying</h2>
            <p className="section-subheading">
              Real reviews from real customers across the Piedmont Triad
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sampleReviews.slice(0, 6).map((review) => (
              <div key={review.id} className="card p-5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating
                          ? "fill-accent-400 text-accent-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  &quot;{review.content}&quot;
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{review.authorName}</span>
                  {review.isVerified && (
                    <span className="flex items-center gap-0.5 text-green-600">
                      <CheckCircle className="h-3 w-3" aria-hidden="true" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Request Form */}
      <section className="py-12 sm:py-16">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="section-heading">
                Need a Pro? Get Free Quotes in Minutes
              </h2>
              <p className="section-subheading">
                Tell us what you need and we&apos;ll connect you with top-rated
                professionals in your area. No obligation, no cost.
              </p>
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true" />
                  <span>Get 2-3 quotes from verified professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true" />
                  <span>Compare ratings, reviews, and pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true" />
                  <span>Responses typically within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary-500 shrink-0" aria-hidden="true" />
                  <span><strong>100% free</strong> — no hidden costs or obligations</span>
                </div>
              </div>
            </div>
            <QuoteRequestForm />
          </div>
        </div>
      </section>

      {/* Cross-City Category Links - SEO Powerhouse */}
      <section className="bg-white py-12 sm:py-16 border-t border-gray-100">
        <div className="container-main">
          <h2 className="section-heading text-center">Find Services by City</h2>
          <p className="section-subheading text-center">
            Direct links to the most popular services in each major Triad city
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredCities.map((city) => (
              <div key={city.slug}>
                <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary-600" />
                  {city.name}
                </h3>
                <ul className="mt-2 space-y-1">
                  {featuredCategories.slice(0, 8).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/${city.slug}/${cat.slug}`}
                        className="text-sm text-gray-600 hover:text-primary-600"
                      >
                        {cat.name} in {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Newsletter */}
      <section className="bg-gray-900 py-12 sm:py-16 text-white">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Are You a Local Business Owner?
              </h2>
              <p className="mt-3 text-gray-400">
                Get your business in front of thousands of Triad residents searching for
                services like yours. Premium listings get 10x more visibility and leads.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Appear at the top of search results</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Enhanced business profile with photos & reviews</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Direct lead notifications to your phone</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Track clicks, calls, and contact form submissions</span>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Link href="/pricing" className="btn-accent">
                  View Pricing
                </Link>
                <Link
                  href="/claim-listing"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Claim Free Listing
                </Link>
              </div>
            </div>
            <div className="rounded-xl bg-gray-800 p-6">
              <h3 className="text-lg font-semibold">Stay Updated</h3>
              <p className="mt-1 text-sm text-gray-400">
                Get the latest Triad business news, tips, and featured listings in your
                inbox.
              </p>
              <div className="mt-4">
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="container-main py-4">
        <AdSlot position="banner-bottom" />
      </div>
    </>
  );
}
