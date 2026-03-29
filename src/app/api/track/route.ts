import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, eventType, sourcePage } = body;

    if (!listingId || !eventType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServerClient();

    await supabase.from("click_events").insert({
      business_id: listingId,
      event_type: eventType,
      source_page: sourcePage,
    });

    await supabase.rpc("increment_click_count", { business_id: listingId });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
