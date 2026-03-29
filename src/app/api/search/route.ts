import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], message: "Query too short" });
  }

  const supabase = createServerClient();

  const { data: results } = await supabase
    .from("businesses")
    .select("id, name, slug, short_description, rating, city_name, tier, cities!inner(slug), categories!inner(slug)")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`)
    .eq("status", "active")
    .order("tier")
    .order("rating", { ascending: false })
    .limit(20);

  return NextResponse.json({
    results: results || [],
    count: results?.length || 0,
  });
}
