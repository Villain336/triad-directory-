import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { cities } from "@/lib/data/cities";
import { categories } from "@/lib/data/categories";
import { sampleListings } from "@/lib/data/sample-listings";
import { sampleBlogPosts } from "@/lib/data/sample-blog";
import { neighborhoods } from "@/lib/data/neighborhoods";
import { sampleQuestions, getPopularTags } from "@/lib/data/community";

/**
 * Logical sitemap-index split per strategy §6.1.
 *
 * Next.js App Router calls `generateSitemaps()` at build time to discover the
 * chunks, and automatically emits a sitemap-index at `/sitemap.xml` that points
 * at `/sitemap/<id>.xml`. The numeric IDs below map 1:1 to the SITEMAP_CHUNKS
 * array so search engines get distinct, semantically named feeds for each
 * content type instead of one mega-file.
 *
 * Chunk sizes today are well under the 50,000 URL / 50 MB sitemap limit, but
 * splitting up front means we can grow individual surfaces (listings,
 * neighborhoods, community Q&A) without a second migration later.
 */

const SITEMAP_CHUNKS = [
  "static",
  "cities",
  "categories",
  "city-services",
  "listings",
  "blog",
  "neighborhoods",
  "community",
] as const;

type ChunkName = (typeof SITEMAP_CHUNKS)[number];

export async function generateSitemaps() {
  return SITEMAP_CHUNKS.map((_, id) => ({ id }));
}

function staticSitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/advertise`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/claim-listing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/tools/cost-estimator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/community`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/price-check`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/deals`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/emergency`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/partners`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/media-kit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/request-service`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/marketing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/case-studies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/business-portal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/how-we-verify`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/nc-home-services-cost-index-2026`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}

function citiesSitemap(): MetadataRoute.Sitemap {
  return cities.map((city) => ({
    url: `${SITE_URL}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
}

function categoriesSitemap(): MetadataRoute.Sitemap {
  return categories.map((cat) => ({
    url: `${SITE_URL}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}

function cityServicesSitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [];
  for (const city of cities) {
    for (const category of categories) {
      pages.push({
        url: `${SITE_URL}/${city.slug}/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      });
    }
  }
  return pages;
}

function listingsSitemap(): MetadataRoute.Sitemap {
  return sampleListings.map((listing) => ({
    url: `${SITE_URL}/${listing.citySlug}/${listing.categorySlug}/${listing.slug}`,
    lastModified: new Date(listing.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}

function blogSitemap(): MetadataRoute.Sitemap {
  return sampleBlogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}

function neighborhoodsSitemap(): MetadataRoute.Sitemap {
  return neighborhoods.map((n) => ({
    url: `${SITE_URL}/${n.citySlug}/neighborhoods/${n.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}

function communitySitemap(): MetadataRoute.Sitemap {
  const questions: MetadataRoute.Sitemap = sampleQuestions.map((q) => ({
    url: `${SITE_URL}/community/${q.slug}`,
    lastModified: new Date(q.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));
  const tags: MetadataRoute.Sitemap = getPopularTags().map(({ tag }) => ({
    url: `${SITE_URL}/community/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));
  return [...questions, ...tags];
}

const BUILDERS: Record<ChunkName, () => MetadataRoute.Sitemap> = {
  static: staticSitemap,
  cities: citiesSitemap,
  categories: categoriesSitemap,
  "city-services": cityServicesSitemap,
  listings: listingsSitemap,
  blog: blogSitemap,
  neighborhoods: neighborhoodsSitemap,
  community: communitySitemap,
};

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const name = SITEMAP_CHUNKS[id];
  if (!name) return [];
  return BUILDERS[name]();
}
