import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { cities } from "@/lib/data/cities";
import { categories } from "@/lib/data/categories";
import { sampleListings } from "@/lib/data/sample-listings";
import { sampleBlogPosts } from "@/lib/data/sample-blog";
import { neighborhoods } from "@/lib/data/neighborhoods";
import { sampleQuestions, getPopularTags } from "@/lib/data/community";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
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
  ];

  // City pages
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${SITE_URL}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // City + Category pages (THE money pages)
  const cityCategoryPages: MetadataRoute.Sitemap = [];
  for (const city of cities) {
    for (const category of categories) {
      cityCategoryPages.push({
        url: `${SITE_URL}/${city.slug}/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      });
    }
  }

  // Category overview pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Individual listing pages
  const listingPages: MetadataRoute.Sitemap = sampleListings.map((listing) => ({
    url: `${SITE_URL}/${listing.citySlug}/${listing.categorySlug}/${listing.slug}`,
    lastModified: new Date(listing.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = sampleBlogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Neighborhood pages
  const neighborhoodPages: MetadataRoute.Sitemap = neighborhoods.map((n) => ({
    url: `${SITE_URL}/${n.citySlug}/neighborhoods/${n.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Community Q&A pages
  const communityPages: MetadataRoute.Sitemap = sampleQuestions.map((q) => ({
    url: `${SITE_URL}/community/${q.slug}`,
    lastModified: new Date(q.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const communityTagPages: MetadataRoute.Sitemap = getPopularTags().map(({ tag }) => ({
    url: `${SITE_URL}/community/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  return [
    ...staticPages,
    ...cityPages,
    ...cityCategoryPages,
    ...categoryPages,
    ...listingPages,
    ...blogPages,
    ...communityPages,
    ...communityTagPages,
    ...neighborhoodPages,
  ];
}
