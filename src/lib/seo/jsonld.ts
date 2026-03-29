import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Listing } from "@/types/listing";

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "The Triad's premier business and services directory for Greensboro, Winston-Salem, High Point, and all Piedmont Triad cities.",
    areaServed: {
      "@type": "Place",
      name: "Piedmont Triad, North Carolina",
    },
  };
}

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateLocalBusinessJsonLd(listing: Listing) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.businessName,
    description: listing.shortDescription,
    url: listing.website || `${SITE_URL}/${listing.citySlug}/${listing.categorySlug}/${listing.slug}`,
    telephone: listing.phone,
    email: listing.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip,
      addressCountry: "US",
    },
    ...(listing.latitude &&
      listing.longitude && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: listing.latitude,
          longitude: listing.longitude,
        },
      }),
    ...(listing.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: listing.rating,
        reviewCount: listing.reviewCount,
        bestRating: 5,
      },
    }),
    ...(listing.imageUrl && { image: listing.imageUrl }),
    ...(listing.yearEstablished && { foundingDate: String(listing.yearEstablished) }),
    ...(listing.hours && {
      openingHoursSpecification: Object.entries(listing.hours)
        .filter(([, value]) => value && value !== "Closed")
        .map(([day, hours]) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
          opens: hours?.split(" - ")[0] || "",
          closes: hours?.split(" - ")[1] || "",
        })),
    }),
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateCityDirectoryJsonLd(
  cityName: string,
  citySlug: string,
  listingCount: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cityName} Business Directory`,
    description: `Browse ${listingCount}+ local businesses and services in ${cityName}, NC`,
    url: `${SITE_URL}/${citySlug}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function generateBlogPostJsonLd(post: {
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  slug: string;
  coverImage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.publishedAt,
    url: `${SITE_URL}/blog/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(post.coverImage && { image: post.coverImage }),
  };
}
