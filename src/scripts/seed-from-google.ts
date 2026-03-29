/**
 * Seed script: Fetches real business listings from Google Places API
 * and inserts them into the Supabase database.
 *
 * PREREQUISITES:
 * 1. Google Places API key — set GOOGLE_PLACES_API_KEY in .env.local
 *    Get one at: https://console.cloud.google.com (enable "Places API (New)")
 * 2. Supabase project running with cities + categories seeded
 *
 * Usage: npx tsx src/scripts/seed-from-google.ts
 *
 * This will make ~85 Google Places API calls (within free tier of ~10K/month)
 * and seed approximately 1,000-1,500 real business listings across 7 major
 * cities and 14 service categories.
 *
 * Run monthly to keep data fresh. Safe to re-run — uses upsert on slug.
 */

const SUPABASE_URL = "https://fopomlrqwzghbjamcrkf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvcG9tbHJxd3pnaGJqYW1jcmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTUwNzYsImV4cCI6MjA5MDM5MTA3Nn0.XSkh5FXzfTMHn-vQH257UuUW7Mwlcv-mVEgf_vdTUJQ";
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "AIzaSyBqtm0jTIWP3eHh-iKZHgT3hSRZVnlLllY";

// Priority cities and categories to seed first
const SEED_PLAN = [
  // Major Triad cities
  { city: "greensboro", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors", "cleaning-services", "landscaping", "auto-repair", "restaurants", "dentists", "attorneys", "handyman"] },
  { city: "winston-salem", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors", "cleaning-services", "landscaping", "auto-repair", "restaurants", "dentists"] },
  { city: "high-point", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors", "cleaning-services"] },
  { city: "burlington", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing"] },
  // Major Triangle cities
  { city: "raleigh", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors", "cleaning-services", "landscaping", "auto-repair", "restaurants", "dentists", "attorneys", "handyman"] },
  { city: "durham", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors", "cleaning-services"] },
  { city: "cary", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors"] },
];

// Category name mapping for search queries
const CATEGORY_SEARCH_TERMS: Record<string, string> = {
  plumbers: "plumber plumbing",
  electricians: "electrician electrical",
  hvac: "HVAC heating air conditioning",
  roofing: "roofing roofer",
  "paving-striping": "paving asphalt striping",
  "pressure-washing": "pressure washing power washing",
  "general-contractors": "general contractor construction",
  "cleaning-services": "cleaning service house cleaning",
  landscaping: "landscaping lawn care",
  "auto-repair": "auto repair mechanic",
  restaurants: "restaurant dining",
  dentists: "dentist dental",
  attorneys: "attorney lawyer",
  handyman: "handyman home repair",
};

interface SupabaseRow {
  id: string;
  slug: string;
  name?: string;
  latitude?: number;
  longitude?: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function supabaseQuery(path: string, options: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.method === "POST" ? "return=representation,resolution=merge-duplicates" : "return=representation",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error ${res.status}: ${text}`);
  }
  return res.json();
}

async function searchGooglePlaces(query: string, lat: number, lng: number) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_API_KEY,
      "X-Goog-FieldMask":
        "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.location,places.id,places.businessStatus",
    },
    body: JSON.stringify({
      textQuery: query,
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 25000,
        },
      },
      maxResultCount: 20,
    }),
  });

  const data = await res.json();
  return data.places || [];
}

async function main() {
  console.log("=== NC Service Businesses — Google Places Seed ===\n");

  // Get all cities and categories from DB
  const cities: SupabaseRow[] = await supabaseQuery("cities?select=id,slug,name,latitude,longitude");
  const categories: SupabaseRow[] = await supabaseQuery("categories?select=id,slug,name");

  const cityMap = new Map(cities.map((c) => [c.slug, c]));
  const catMap = new Map(categories.map((c) => [c.slug, c]));

  let totalCreated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let apiCalls = 0;

  for (const plan of SEED_PLAN) {
    const city = cityMap.get(plan.city);
    if (!city) {
      console.log(`  ⚠ City "${plan.city}" not found in DB, skipping`);
      continue;
    }

    console.log(`\n📍 ${city.name} (${plan.categories.length} categories)`);

    for (const catSlug of plan.categories) {
      const category = catMap.get(catSlug);
      if (!category) {
        console.log(`  ⚠ Category "${catSlug}" not found`);
        continue;
      }

      const searchTerm = CATEGORY_SEARCH_TERMS[catSlug] || category.name;
      const query = `${searchTerm} in ${city.name}, NC`;

      console.log(`  🔍 Searching: "${query}"`);
      apiCalls++;

      try {
        const places = await searchGooglePlaces(query, city.latitude!, city.longitude!);
        console.log(`     Found ${places.length} results`);

        for (const place of places) {
          const name = place.displayName?.text;
          if (!name) continue;

          // Skip if business is permanently closed
          if (place.businessStatus === "CLOSED_PERMANENTLY") continue;

          const baseSlug = slugify(name);
          const slug = `${baseSlug}-${slugify(city.name!)}`;

          const phone = place.nationalPhoneNumber?.replace(/\D/g, "") ||
            place.internationalPhoneNumber?.replace(/\D/g, "") || null;

          const business = {
            name,
            slug,
            short_description: `${category.name} serving ${city.name}, NC and surrounding areas.`,
            city_id: city.id,
            category_id: category.id,
            phone,
            website: place.websiteUri || null,
            address: place.formattedAddress || null,
            city_name: city.name,
            state: "NC",
            latitude: place.location?.latitude || null,
            longitude: place.location?.longitude || null,
            rating: place.rating || 0,
            review_count: place.userRatingCount || 0,
            tier: "free",
            status: "active",
            is_verified: false,
            is_featured: false,
            data_source: "google_places",
            external_id: place.id,
            last_synced_at: new Date().toISOString(),
          };

          try {
            await supabaseQuery("businesses", {
              method: "POST",
              body: JSON.stringify(business),
              headers: { Prefer: "return=representation,resolution=merge-duplicates" },
            });
            totalCreated++;
          } catch (err: any) {
            if (err.message?.includes("duplicate") || err.message?.includes("unique")) {
              totalSkipped++;
            } else {
              totalErrors++;
              console.log(`     ❌ Error inserting "${name}": ${err.message?.slice(0, 80)}`);
            }
          }
        }

        // Rate limit: wait 200ms between API calls
        await new Promise((r) => setTimeout(r, 200));
      } catch (err: any) {
        console.log(`     ❌ Google API error: ${err.message?.slice(0, 100)}`);
        totalErrors++;
      }
    }
  }

  console.log("\n=== SEED COMPLETE ===");
  console.log(`API calls made: ${apiCalls}`);
  console.log(`Businesses created: ${totalCreated}`);
  console.log(`Duplicates skipped: ${totalSkipped}`);
  console.log(`Errors: ${totalErrors}`);
}

main().catch(console.error);
