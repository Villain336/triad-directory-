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
 * Run monthly to keep data fresh. Safe to re-run — skips duplicates by slug.
 */

const SUPABASE_URL = "https://fopomlrqwzghbjamcrkf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvcG9tbHJxd3pnaGJqYW1jcmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTUwNzYsImV4cCI6MjA5MDM5MTA3Nn0.XSkh5FXzfTMHn-vQH257UuUW7Mwlcv-mVEgf_vdTUJQ";
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";

if (!GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_PLACES_API_KEY is required. Set it in .env.local");
  process.exit(1);
}

// Priority cities and categories to seed first
const SEED_PLAN = [
  { city: "greensboro", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors", "cleaning-services", "landscaping", "auto-repair", "restaurants", "dentists", "attorneys", "handyman"] },
  { city: "winston-salem", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors", "cleaning-services", "landscaping", "auto-repair", "restaurants", "dentists"] },
  { city: "high-point", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors", "cleaning-services"] },
  { city: "burlington", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing"] },
  { city: "raleigh", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors", "cleaning-services", "landscaping", "auto-repair", "restaurants", "dentists", "attorneys", "handyman"] },
  { city: "durham", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors", "cleaning-services"] },
  { city: "cary", categories: ["plumbers", "electricians", "hvac", "roofing", "paving-striping", "pressure-washing", "general-contractors"] },
];

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

// Track slugs we've already used in this run to avoid collisions
const usedSlugs = new Set<string>();

function makeUniqueSlug(name: string, cityName: string, catSlug: string): string {
  let slug = `${slugify(name)}-${slugify(cityName)}`;

  // If slug collision, append category
  if (usedSlugs.has(slug)) {
    slug = `${slugify(name)}-${catSlug}-${slugify(cityName)}`;
  }

  // If still collision, append random suffix
  if (usedSlugs.has(slug)) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  usedSlugs.add(slug);
  return slug;
}

async function supabaseGet(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase GET error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function supabaseInsert(table: string, data: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    // Duplicate key = skip silently
    if (text.includes("duplicate") || text.includes("unique") || text.includes("23505")) {
      return { status: "duplicate" };
    }
    throw new Error(`Insert error ${res.status}: ${text}`);
  }
  return { status: "created" };
}

async function searchGooglePlaces(query: string, lat: number, lng: number) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_API_KEY,
      "X-Goog-FieldMask":
        "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.location,places.id,places.businessStatus,places.regularOpeningHours,places.editorialSummary,places.shortFormattedAddress,places.addressComponents",
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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Places error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.places || [];
}

async function main() {
  console.log("=== NC Service Businesses — Google Places Seed ===\n");

  // Get all cities and categories from DB
  const cities = await supabaseGet("cities?select=id,slug,name,latitude,longitude");
  const categories = await supabaseGet("categories?select=id,slug,name");

  console.log(`📊 Database: ${cities.length} cities, ${categories.length} categories\n`);

  const cityMap = new Map(cities.map((c: any) => [c.slug, c]));
  const catMap = new Map(categories.map((c: any) => [c.slug, c]));

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

      console.log(`  🔍 "${query}"`);
      apiCalls++;

      try {
        const places = await searchGooglePlaces(query, city.latitude, city.longitude);
        let created = 0;
        let skipped = 0;

        for (const place of places) {
          const name = place.displayName?.text;
          if (!name) continue;
          if (place.businessStatus === "CLOSED_PERMANENTLY") continue;

          const slug = makeUniqueSlug(name, city.name, catSlug);

          const phone = place.nationalPhoneNumber?.replace(/\D/g, "") ||
            place.internationalPhoneNumber?.replace(/\D/g, "") || null;

          // Parse hours from Google Places
          let hours: Record<string, string> | null = null;
          if (place.regularOpeningHours?.weekdayDescriptions) {
            hours = {};
            const dayMap: Record<string, string> = {
              Monday: "monday", Tuesday: "tuesday", Wednesday: "wednesday",
              Thursday: "thursday", Friday: "friday", Saturday: "saturday", Sunday: "sunday",
            };
            for (const desc of place.regularOpeningHours.weekdayDescriptions) {
              const parts = desc.split(": ");
              if (parts.length === 2) {
                const key = dayMap[parts[0]] || parts[0].toLowerCase();
                hours[key] = parts[1] === "Closed" ? "Closed" : parts[1];
              }
            }
          }

          // Parse zip from address components
          let zip: string | null = null;
          if (place.addressComponents) {
            const postal = place.addressComponents.find(
              (c: any) => c.types?.includes("postal_code")
            );
            if (postal) zip = postal.shortText || postal.longText || null;
          }

          // Build description
          const editorial = place.editorialSummary?.text || "";
          const shortDesc = editorial || `${category.name} serving ${city.name}, NC and surrounding areas.`;
          const fullDesc = editorial
            ? `${editorial} ${name} is a ${category.name.toLowerCase()} serving ${city.name}, NC and the surrounding area. Contact us for professional service, free estimates, and quality workmanship.`
            : `${name} provides professional ${category.name.toLowerCase()} services in ${city.name}, NC and surrounding areas. Trusted by local residents and businesses for quality workmanship and reliable service. Contact us today for a free estimate.`;

          try {
            const result = await supabaseInsert("businesses", {
              name,
              slug,
              short_description: shortDesc.slice(0, 200),
              description: fullDesc,
              city_id: city.id,
              category_id: category.id,
              phone,
              website: place.websiteUri || null,
              address: place.formattedAddress || null,
              city_name: city.name,
              state: "NC",
              zip,
              latitude: place.location?.latitude || null,
              longitude: place.location?.longitude || null,
              rating: place.rating || 0,
              review_count: place.userRatingCount || 0,
              hours: hours ? JSON.stringify(hours) : null,
              tier: "free",
              status: "active",
              is_verified: false,
              is_featured: false,
              data_source: "google_places",
              external_id: place.id,
              last_synced_at: new Date().toISOString(),
            });

            if (result.status === "created") {
              created++;
              totalCreated++;
            } else {
              skipped++;
              totalSkipped++;
            }
          } catch (err: any) {
            totalErrors++;
            if (!err.message?.includes("duplicate")) {
              console.log(`     ❌ "${name}": ${err.message?.slice(0, 80)}`);
            } else {
              totalSkipped++;
            }
          }
        }

        console.log(`     ✅ ${created} created, ${skipped} skipped (${places.length} found)`);

        // Rate limit: wait 300ms between API calls
        await new Promise((r) => setTimeout(r, 300));
      } catch (err: any) {
        console.log(`     ❌ API error: ${err.message?.slice(0, 100)}`);
        totalErrors++;
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("SEED COMPLETE");
  console.log("=".repeat(50));
  console.log(`Google API calls: ${apiCalls}`);
  console.log(`Businesses created: ${totalCreated}`);
  console.log(`Duplicates skipped: ${totalSkipped}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`\nYour site now has real listings! 🎉`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
