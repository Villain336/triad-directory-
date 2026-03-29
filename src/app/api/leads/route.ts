import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, message, listingId, citySlug, categorySlug, source } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // In production, save to Supabase:
    // const { data, error } = await supabase.from('leads').insert({
    //   name, email, phone, message, listing_id: listingId,
    //   city_slug: citySlug, category_slug: categorySlug, source,
    // });

    // For now, log the lead
    console.log("New lead captured:", {
      name,
      email,
      phone,
      message: message?.slice(0, 100),
      listingId,
      citySlug,
      categorySlug,
      source,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Lead captured successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
