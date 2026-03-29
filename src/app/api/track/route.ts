import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, eventType, sourcePage } = body;

    if (!listingId || !eventType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In production, save to Supabase:
    // await supabase.from('click_events').insert({ listing_id: listingId, event_type: eventType, source_page: sourcePage })
    // await supabase.rpc('increment_click_count', { listing_id: listingId })

    console.log("Click tracked:", {
      listingId,
      eventType, // phone_click, website_click, directions_click
      sourcePage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
