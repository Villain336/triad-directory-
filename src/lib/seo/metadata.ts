import { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";

interface MetadataParams {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: MetadataParams): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image && { images: [image] }),
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

export function generateCityMetadata(cityName: string, citySlug: string): Metadata {
  return generatePageMetadata({
    title: `${cityName} Business Directory - Local Services & Trades`,
    description: `Find the best local businesses and services in ${cityName}, NC. Browse plumbers, electricians, HVAC, contractors, restaurants, and more in the ${cityName} area.`,
    path: `/${citySlug}`,
  });
}

export function generateCityCategoryMetadata(
  cityName: string,
  citySlug: string,
  categoryName: string,
  categorySlug: string
): Metadata {
  return generatePageMetadata({
    title: `Best ${categoryName} in ${cityName}, NC - Top Rated & Reviewed`,
    description: `Find the best ${categoryName.toLowerCase()} in ${cityName}, NC. Read reviews, compare ratings, and get quotes from top-rated ${categoryName.toLowerCase()} near you. Free estimates available.`,
    path: `/${citySlug}/${categorySlug}`,
  });
}

export function generateListingMetadata(
  businessName: string,
  cityName: string,
  categoryName: string,
  citySlug: string,
  categorySlug: string,
  listingSlug: string,
  description: string
): Metadata {
  return generatePageMetadata({
    title: `${businessName} - ${categoryName} in ${cityName}, NC`,
    description: description.slice(0, 160),
    path: `/${citySlug}/${categorySlug}/${listingSlug}`,
  });
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Find Local Businesses & Services in the NC Triad`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Triad directory",
    "Greensboro businesses",
    "Winston-Salem services",
    "High Point directory",
    "NC Triad",
    "local services",
    "business directory",
    "Piedmont Triad",
    "find local businesses",
    "Triad contractors",
    "Greensboro plumber",
    "Winston-Salem HVAC",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};
