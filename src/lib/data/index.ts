/**
 * Hybrid Data Layer
 *
 * Tries Supabase first for live data.
 * Falls back to static data files for SSG/build time or when DB is empty.
 *
 * This allows:
 * - Static pages to render during build (from sample data)
 * - Live data to show when Supabase has listings (from Google Places seed)
 * - Graceful degradation if Supabase is unreachable
 */

import { createServerClient } from "@/lib/supabase/server";

// Static fallbacks
import { cities as staticCities, getCityBySlug as staticGetCityBySlug, getFeaturedCities as staticGetFeaturedCities } from "./cities";
import { categories as staticCategories, getCategoryBySlug as staticGetCategoryBySlug, getFeaturedCategories as staticGetFeaturedCategories } from "./categories";
import { sampleListings, getFeaturedListings as staticGetFeaturedListings, getListingsByCity as staticGetListingsByCity, getListingsByCityAndCategory as staticGetListingsByCityAndCategory, getListingBySlug as staticGetListingBySlug, searchListings as staticSearchListings } from "./sample-listings";
import { sampleReviews, getReviewsByListingId as staticGetReviewsByListingId } from "./sample-reviews";
import { sampleBlogPosts, getBlogPostBySlug as staticGetBlogPostBySlug, getRecentBlogPosts as staticGetRecentBlogPosts } from "./sample-blog";

// =============================================
// CITIES — always use static (they're fixed)
// =============================================
export { cities, getCityBySlug, getFeaturedCities, getCitiesByCounty, getCitiesByRegion } from "./cities";

// =============================================
// CATEGORIES — always use static (they're fixed)
// =============================================
export { categories, getCategoryBySlug, getFeaturedCategories } from "./categories";

// =============================================
// BUSINESSES — try Supabase, fall back to static
// =============================================

export async function getListings(options?: {
  citySlug?: string;
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
}) {
  try {
    const supabase = createServerClient();
    let query = supabase
      .from("businesses")
      .select("*, cities!inner(name, slug, county, region), categories!inner(name, slug)")
      .eq("status", "active");

    if (options?.citySlug) {
      query = query.eq("cities.slug", options.citySlug);
    }
    if (options?.categorySlug) {
      query = query.eq("categories.slug", options.categorySlug);
    }
    if (options?.featured) {
      query = query.eq("is_featured", true);
    }

    query = query
      .order("tier", { ascending: true })
      .order("rating", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fall back to static
      return getStaticListingsFallback(options);
    }

    // Map Supabase shape to our Listing type
    return data.map(mapBusinessToListing);
  } catch {
    return getStaticListingsFallback(options);
  }
}

function getStaticListingsFallback(options?: {
  citySlug?: string;
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
}) {
  let results = [...sampleListings];

  if (options?.citySlug) {
    results = results.filter((l) => l.citySlug === options.citySlug);
  }
  if (options?.categorySlug) {
    results = results.filter((l) => l.categorySlug === options.categorySlug);
  }
  if (options?.featured) {
    results = results.filter((l) => l.isFeatured);
  }
  if (options?.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

function mapBusinessToListing(biz: any) {
  return {
    id: biz.id,
    businessName: biz.name,
    slug: biz.slug,
    description: biz.description || "",
    shortDescription: biz.short_description || "",
    citySlug: biz.cities?.slug || "",
    categorySlug: biz.categories?.slug || "",
    tier: biz.tier || "free",
    phone: biz.phone || "",
    email: biz.email || "",
    website: biz.website || "",
    address: biz.address || "",
    city: biz.city_name || biz.cities?.name || "",
    state: biz.state || "NC",
    zip: biz.zip || "",
    latitude: biz.latitude,
    longitude: biz.longitude,
    imageUrl: biz.image_url,
    galleryUrls: biz.gallery_urls,
    hours: biz.hours,
    rating: Number(biz.rating) || 0,
    reviewCount: biz.review_count || 0,
    yearEstablished: biz.year_established,
    licenseNumber: biz.license_number,
    isVerified: biz.is_verified || false,
    isFeatured: biz.is_featured || false,
    tags: biz.tags || [],
    createdAt: biz.created_at,
    updatedAt: biz.updated_at,
  };
}

export async function getListingBySlug(slug: string) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("*, cities!inner(name, slug, county, region), categories!inner(name, slug)")
      .eq("slug", slug)
      .eq("status", "active")
      .single();

    if (error || !data) {
      return staticGetListingBySlug(slug) || null;
    }
    return mapBusinessToListing(data);
  } catch {
    return staticGetListingBySlug(slug) || null;
  }
}

export async function searchListings(query: string) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("*, cities!inner(name, slug), categories!inner(name, slug)")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`)
      .eq("status", "active")
      .order("tier")
      .order("rating", { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) {
      return staticSearchListings(query);
    }
    return data.map(mapBusinessToListing);
  } catch {
    return staticSearchListings(query);
  }
}

// =============================================
// REVIEWS — try Supabase, fall back to static
// =============================================

export async function getReviewsByListingId(listingId: string) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("business_id", listingId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return staticGetReviewsByListingId(listingId);
    }

    return data.map((r: any) => ({
      id: r.id,
      listingId: r.business_id,
      authorName: r.author_name,
      rating: r.rating,
      content: r.content,
      isVerified: r.is_verified,
      ownerResponse: r.owner_response,
      ownerResponseDate: r.owner_response_date,
      createdAt: r.created_at,
    }));
  } catch {
    return staticGetReviewsByListingId(listingId);
  }
}

// =============================================
// BLOG — try Supabase, fall back to static
// =============================================

export async function getRecentBlogPosts(count: number = 10) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(count);

    if (error || !data || data.length === 0) {
      return staticGetRecentBlogPosts(count);
    }

    return data.map(mapBlogPost);
  } catch {
    return staticGetRecentBlogPosts(count);
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      return staticGetBlogPostBySlug(slug) || null;
    }
    return mapBlogPost(data);
  } catch {
    return staticGetBlogPostBySlug(slug) || null;
  }
}

function mapBlogPost(p: any) {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    content: p.content,
    author: p.author_name,
    publishedAt: p.published_at,
    updatedAt: p.updated_at,
    coverImage: p.cover_image_url,
    tags: p.tags || [],
    citySlug: p.city_id, // Would need join for slug
    categorySlug: p.category_id,
    metaTitle: p.meta_title,
    metaDescription: p.meta_description,
  };
}
