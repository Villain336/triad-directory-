import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  Star,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  CheckCircle,
  Shield,
  Calendar,
  ExternalLink,
  Crown,
} from "lucide-react";
import { getCityBySlug } from "@/lib/data/cities";
import { getCategoryBySlug } from "@/lib/data/categories";
import { sampleListings, getListingsByCityAndCategory } from "@/lib/data/sample-listings";
import { getReviewsByListingId } from "@/lib/data/sample-reviews";
import { getProjectsByListingId } from "@/lib/data/projects";
import { generateListingMetadata } from "@/lib/seo/metadata";
import { generateLocalBusinessJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { formatPhone } from "@/lib/utils";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ListingCard from "@/components/listings/ListingCard";
import AdSlot from "@/components/ads/AdSlot";
import ContactForm from "@/components/lead-gen/ContactForm";
import ReviewSection from "@/components/listings/ReviewSection";
import TrustBadges from "@/components/listings/TrustBadges";
import OpenStatus from "@/components/listings/OpenStatus";
import StickyCallBar from "@/components/lead-gen/StickyCallBar";
import dynamic from "next/dynamic";
import ListingGallery from "@/components/listings/ListingGallery";
import ProjectShowcase from "@/components/listings/ProjectShowcase";

const ListingMap = dynamic(() => import("@/components/listings/ListingMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-xl bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 text-sm">
      Loading map...
    </div>
  ),
});

interface ListingPageProps {
  params: { city: string; category: string; slug: string };
}

export function generateStaticParams() {
  return sampleListings.map((l) => ({
    city: l.citySlug,
    category: l.categorySlug,
    slug: l.slug,
  }));
}

export function generateMetadata({ params }: ListingPageProps): Metadata {
  const listing = sampleListings.find((l) => l.slug === params.slug);
  const city = getCityBySlug(params.city);
  const category = getCategoryBySlug(params.category);
  if (!listing || !city || !category) return {};
  return generateListingMetadata(
    listing.businessName,
    city.name,
    category.name,
    city.slug,
    category.slug,
    listing.slug,
    listing.shortDescription
  );
}

export default function ListingPage({ params }: ListingPageProps) {
  const listing = sampleListings.find((l) => l.slug === params.slug);
  const city = getCityBySlug(params.city);
  const category = getCategoryBySlug(params.category);
  if (!listing || !city || !category) notFound();

  const isPremium = listing.tier === "premium" || listing.tier === "elite";
  const reviews = getReviewsByListingId(listing.id);
  const projects = getProjectsByListingId(listing.id);
  const relatedListings = getListingsByCityAndCategory(city.slug, category.slug)
    .filter((l) => l.id !== listing.id)
    .slice(0, 2);

  return (
    <>
      <JsonLd data={generateLocalBusinessJsonLd(listing)} />
      <StickyCallBar phone={listing.phone} businessName={listing.businessName} />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: city.name, url: `/${city.slug}` },
          { name: category.name, url: `/${city.slug}/${category.slug}` },
          {
            name: listing.businessName,
            url: `/${city.slug}/${category.slug}/${listing.slug}`,
          },
        ])}
      />

      <div className="container-main">
        <Breadcrumbs
          items={[
            { label: city.name, href: `/${city.slug}` },
            { label: category.name, href: `/${city.slug}/${category.slug}` },
            { label: listing.businessName },
          ]}
        />
      </div>

      <div className="container-main pb-24 lg:pb-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Header */}
            <div className={`rounded-xl p-6 ${isPremium ? "bg-accent-50 border border-accent-200" : "bg-gray-50 border border-gray-200"}`}>
              <div className="flex items-start justify-between">
                <div>
                  {isPremium && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-800 mb-2">
                      <Crown className="h-3.5 w-3.5" /> Premium Business
                    </span>
                  )}
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {listing.businessName}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {listing.city}, NC
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
                      <strong>{listing.rating}</strong> ({listing.reviewCount} reviews)
                    </span>
                    {listing.isVerified && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" aria-hidden="true" /> Verified
                      </span>
                    )}
                    <OpenStatus hours={listing.hours} />
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-4">
                <TrustBadges
                  isVerified={listing.isVerified}
                  licenseNumber={listing.licenseNumber}
                  yearEstablished={listing.yearEstablished}
                  tier={listing.tier}
                />
              </div>

              {/* Quick Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`tel:${listing.phone}`} className="btn-primary gap-2">
                  <Phone className="h-4 w-4" />
                  Call {formatPhone(listing.phone)}
                </a>
                {listing.website && (
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <a href={`mailto:${listing.email}`} className="btn-secondary gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>
            </div>

            {/* About */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900">
                About {listing.businessName}
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </section>

            {/* Details Grid */}
            <section className="mt-8 grid gap-6 sm:grid-cols-2">
              {/* Business Info */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900">Business Details</h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                    <div>
                      <dt className="sr-only">Address</dt>
                      <dd className="text-gray-600">
                        {listing.address}
                        <br />
                        {listing.city}, {listing.state} {listing.zip}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <dt className="sr-only">Phone</dt>
                      <dd>
                        <a
                          href={`tel:${listing.phone}`}
                          className="text-primary-600 hover:underline"
                        >
                          {formatPhone(listing.phone)}
                        </a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <dt className="sr-only">Email</dt>
                      <dd>
                        <a
                          href={`mailto:${listing.email}`}
                          className="text-primary-600 hover:underline"
                        >
                          {listing.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                  {listing.yearEstablished && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <dt className="sr-only">Established</dt>
                        <dd className="text-gray-600">
                          Est. {listing.yearEstablished}
                        </dd>
                      </div>
                    </div>
                  )}
                  {listing.licenseNumber && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <div>
                        <dt className="sr-only">License</dt>
                        <dd className="text-gray-600">
                          License: {listing.licenseNumber}
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>
              </div>

              {/* Hours */}
              {listing.hours && (
                <div className="card p-5">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Business Hours
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    {Object.entries(listing.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <dt className="font-medium text-gray-700 capitalize">
                          {day}
                        </dt>
                        <dd className="text-gray-600">{hours}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </section>

            {/* Tags */}
            {listing.tags.length > 0 && (
              <section className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900">Services & Specialties</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {listing.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Photo Gallery (Premium) */}
            {isPremium && (
              <div className="mt-8">
                <ListingGallery
                  images={listing.galleryUrls || ["/placeholder-1.jpg", "/placeholder-2.jpg", "/placeholder-3.jpg", "/placeholder-4.jpg", "/placeholder-5.jpg", "/placeholder-6.jpg"]}
                  businessName={listing.businessName}
                />
              </div>
            )}

            {/* Map */}
            {listing.latitude && listing.longitude && (
              <section className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <ListingMap
                  latitude={listing.latitude}
                  longitude={listing.longitude}
                  businessName={listing.businessName}
                  address={`${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`}
                />
              </section>
            )}

            {/* Project Portfolio */}
            {isPremium && projects.length > 0 && (
              <div className="mt-10">
                <ProjectShowcase
                  projects={projects}
                  businessName={listing.businessName}
                />
              </div>
            )}

            {/* Reviews */}
            <div className="mt-10">
              <ReviewSection
                reviews={reviews}
                businessName={listing.businessName}
                averageRating={listing.rating}
                totalCount={listing.reviewCount}
              />
            </div>

            <AdSlot position="banner-bottom" className="mt-8" />

            {/* Related Listings */}
            {relatedListings.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-gray-900">
                  More {category.name} in {city.name}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {relatedListings.map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
                <Link
                  href={`/${city.slug}/${category.slug}`}
                  className="btn-secondary mt-4 gap-1"
                >
                  View All {category.name} in {city.name}
                </Link>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div id="contact-form" className="card p-5 sticky top-20">
              <ContactForm
                listingId={listing.id}
                listingName={listing.businessName}
                citySlug={city.slug}
                categorySlug={category.slug}
              />
            </div>

            <AdSlot position="sidebar" />
          </aside>
        </div>
      </div>
    </>
  );
}
