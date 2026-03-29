import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * Data Sync API
 *
 * This endpoint handles importing business data from external sources:
 * - Google Places API (primary source)
 * - Manual CSV uploads
 * - Partner data feeds
 *
 * Flow:
 * 1. External cron job or admin triggers sync
 * 2. Fetches data from source API
 * 3. Maps to our schema
 * 4. Upserts into businesses table
 * 5. Logs the sync result
 *
 * Security: Requires API key in Authorization header
 */

const SYNC_API_KEY = process.env.SYNC_API_KEY || "dev-sync-key";

export async function POST(request: NextRequest) {
  // Verify API key
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${SYNC_API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { source, action, data } = body;

    const supabase = createServerClient();

    if (action === "import_businesses") {
      const businesses = data as ImportBusiness[];
      let created = 0;
      let updated = 0;
      let skipped = 0;
      const errors: { slug: string; error: string }[] = [];

      for (const biz of businesses) {
        try {
          // Look up city and category IDs
          const { data: city } = await supabase
            .from("cities")
            .select("id")
            .eq("slug", biz.city_slug)
            .single();

          const { data: category } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", biz.category_slug)
            .single();

          if (!city || !category) {
            skipped++;
            errors.push({
              slug: biz.slug,
              error: `City "${biz.city_slug}" or category "${biz.category_slug}" not found`,
            });
            continue;
          }

          // Check if business already exists
          const { data: existing } = await supabase
            .from("businesses")
            .select("id")
            .eq("slug", biz.slug)
            .single();

          const businessData = {
            name: biz.name,
            slug: biz.slug,
            short_description: biz.short_description,
            description: biz.description,
            city_id: city.id,
            category_id: category.id,
            phone: biz.phone,
            email: biz.email,
            website: biz.website,
            address: biz.address,
            city_name: biz.city_name,
            zip: biz.zip,
            latitude: biz.latitude,
            longitude: biz.longitude,
            hours: biz.hours,
            tags: biz.tags,
            year_established: biz.year_established,
            license_number: biz.license_number,
            rating: biz.rating || 0,
            review_count: biz.review_count || 0,
            tier: biz.tier || "free",
            status: "active" as const,
            data_source: source,
            external_id: biz.external_id,
            last_synced_at: new Date().toISOString(),
          };

          if (existing) {
            await supabase
              .from("businesses")
              .update(businessData)
              .eq("id", existing.id);
            updated++;
          } else {
            await supabase.from("businesses").insert(businessData);
            created++;
          }
        } catch (err) {
          skipped++;
          errors.push({
            slug: biz.slug,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }

      // Log the sync
      await supabase.from("data_sync_log").insert({
        source,
        sync_type: "import_businesses",
        records_processed: businesses.length,
        records_created: created,
        records_updated: updated,
        records_skipped: skipped,
        errors: errors.length > 0 ? errors : null,
        status: errors.length > 0 ? "completed_with_errors" : "completed",
        completed_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        processed: businesses.length,
        created,
        updated,
        skipped,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    if (action === "google_places_search") {
      // This is a guided flow for fetching from Google Places API
      // The caller provides a search query + location, we format the results
      const { query, city_slug, category_slug, google_api_key } = data;

      if (!google_api_key) {
        return NextResponse.json({
          error: "Google Places API key required. Set GOOGLE_PLACES_API_KEY in env or pass google_api_key in request.",
        }, { status: 400 });
      }

      // Fetch city coordinates for location bias
      const { data: city } = await supabase
        .from("cities")
        .select("*")
        .eq("slug", city_slug)
        .single();

      if (!city) {
        return NextResponse.json({ error: "City not found" }, { status: 404 });
      }

      // Call Google Places Text Search
      const googleUrl = `https://places.googleapis.com/v1/places:searchText`;
      const googleRes = await fetch(googleUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": google_api_key,
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.location,places.id,places.regularOpeningHours,places.types",
        },
        body: JSON.stringify({
          textQuery: `${query} in ${city.name}, NC`,
          locationBias: {
            circle: {
              center: { latitude: city.latitude, longitude: city.longitude },
              radius: 20000,
            },
          },
          maxResultCount: 20,
        }),
      });

      const googleData = await googleRes.json();

      if (!googleData.places) {
        return NextResponse.json({
          success: false,
          message: "No results from Google Places",
          raw: googleData,
        });
      }

      // Map Google results to our schema
      const mappedListings = googleData.places.map((place: GooglePlace) => ({
        name: place.displayName?.text || "",
        address: place.formattedAddress || "",
        phone: place.nationalPhoneNumber || "",
        website: place.websiteUri || "",
        rating: place.rating || 0,
        review_count: place.userRatingCount || 0,
        latitude: place.location?.latitude,
        longitude: place.location?.longitude,
        external_id: place.id,
        city_slug,
        category_slug,
        city_name: city.name,
      }));

      return NextResponse.json({
        success: true,
        results: mappedListings,
        count: mappedListings.length,
        message: "Results mapped. POST to /api/sync with action=import_businesses to save these.",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "Sync failed", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

interface ImportBusiness {
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  city_slug: string;
  category_slug: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city_name?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  hours?: Record<string, string>;
  tags?: string[];
  year_established?: number;
  license_number?: string;
  rating?: number;
  review_count?: number;
  tier?: string;
  external_id?: string;
}

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  location?: { latitude: number; longitude: number };
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  types?: string[];
}
