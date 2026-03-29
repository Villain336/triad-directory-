import { NextRequest, NextResponse } from "next/server";
import { searchListings } from "@/lib/data/sample-listings";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], message: "Query too short" });
  }

  const results = searchListings(query);

  return NextResponse.json({
    results: results.map((l) => ({
      id: l.id,
      businessName: l.businessName,
      slug: l.slug,
      citySlug: l.citySlug,
      categorySlug: l.categorySlug,
      shortDescription: l.shortDescription,
      rating: l.rating,
      city: l.city,
      tier: l.tier,
    })),
    count: results.length,
  });
}
