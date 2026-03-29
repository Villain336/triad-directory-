import { createServerClient } from "./server";

// =============================================
// CITIES
// =============================================

export async function getCities() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("cities")
    .select("*")
    .order("population", { ascending: false });
  return data || [];
}

export async function getCityBySlug(slug: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getFeaturedCities() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("cities")
    .select("*")
    .eq("featured", true)
    .order("population", { ascending: false });
  return data || [];
}

export async function getCitiesByRegion(region: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("cities")
    .select("*")
    .eq("region", region)
    .order("population", { ascending: false });
  return data || [];
}

// =============================================
// CATEGORIES
// =============================================

export async function getCategories() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data || [];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getFeaturedCategories() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("featured", true)
    .order("sort_order");
  return data || [];
}

// =============================================
// BUSINESSES
// =============================================

export async function getBusinessesByCity(cityId: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("businesses")
    .select("*, cities!inner(name, slug), categories!inner(name, slug)")
    .eq("city_id", cityId)
    .order("tier", { ascending: true })
    .order("rating", { ascending: false });
  return data || [];
}

export async function getBusinessesByCityAndCategory(cityId: string, categoryId: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("businesses")
    .select("*, cities!inner(name, slug), categories!inner(name, slug)")
    .eq("city_id", cityId)
    .eq("category_id", categoryId)
    .order("tier", { ascending: true })
    .order("rating", { ascending: false });
  return data || [];
}

export async function getBusinessBySlug(slug: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("businesses")
    .select("*, cities!inner(name, slug, county), categories!inner(name, slug)")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getFeaturedBusinesses(limit: number = 6) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("businesses")
    .select("*, cities!inner(name, slug), categories!inner(name, slug)")
    .eq("is_featured", true)
    .order("rating", { ascending: false })
    .limit(limit);
  return data || [];
}

export async function searchBusinesses(query: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("businesses")
    .select("*, cities!inner(name, slug), categories!inner(name, slug)")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`)
    .order("tier", { ascending: true })
    .order("rating", { ascending: false })
    .limit(50);
  return data || [];
}

// =============================================
// REVIEWS
// =============================================

export async function getReviewsByBusiness(businessId: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });
  return data || [];
}

// =============================================
// LEADS
// =============================================

export async function createLead(lead: {
  business_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  city_slug?: string;
  category_slug?: string;
  source: string;
  source_page?: string;
}) {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("leads").insert(lead).select().single();
  return { data, error };
}

// =============================================
// CLICK EVENTS
// =============================================

export async function trackClick(businessId: string, eventType: string, sourcePage?: string) {
  const supabase = createServerClient();
  await supabase.from("click_events").insert({
    business_id: businessId,
    event_type: eventType,
    source_page: sourcePage,
  });
  await supabase.rpc("increment_click_count", { business_id: businessId });
}

// =============================================
// BLOG
// =============================================

export async function getPublishedBlogPosts(limit: number = 20) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

// =============================================
// COMMUNITY
// =============================================

export async function getCommunityQuestions(limit: number = 20) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("community_questions")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getQuestionBySlug(slug: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("community_questions")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getAnswersByQuestion(questionId: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("community_answers")
    .select("*")
    .eq("question_id", questionId)
    .order("is_accepted", { ascending: false })
    .order("upvotes", { ascending: false });
  return data || [];
}

// =============================================
// DEALS
// =============================================

export async function getActiveDeals() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("deals")
    .select("*, businesses!inner(name, slug, cities!inner(slug))")
    .eq("is_active", true)
    .gte("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });
  return data || [];
}

// =============================================
// DATA SYNC
// =============================================

export async function upsertBusiness(business: {
  name: string;
  slug: string;
  city_id: string;
  category_id: string;
  phone?: string;
  address?: string;
  city_name?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  data_source: string;
  external_id: string;
  [key: string]: unknown;
}) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("businesses")
    .upsert(
      { ...business, last_synced_at: new Date().toISOString() },
      { onConflict: "slug" }
    )
    .select()
    .single();
  return { data, error };
}

export async function logSync(log: {
  source: string;
  sync_type: string;
  records_processed: number;
  records_created: number;
  records_updated: number;
  records_skipped: number;
  errors?: unknown;
  status: string;
}) {
  const supabase = createServerClient();
  await supabase.from("data_sync_log").insert({
    ...log,
    completed_at: new Date().toISOString(),
  });
}
