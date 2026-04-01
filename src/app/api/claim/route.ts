import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { businessId, userId } = await request.json();

    if (!businessId || !userId) {
      return NextResponse.json({ error: "Missing businessId or userId" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Check if business exists
    const { data: business } = await supabase
      .from("businesses")
      .select("id, owner_id, name")
      .eq("id", businessId)
      .single();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Check if already claimed by someone else
    if (business.owner_id && business.owner_id !== userId) {
      return NextResponse.json({ error: "This business has already been claimed" }, { status: 409 });
    }

    // Claim the business
    const { error: updateError } = await supabase
      .from("businesses")
      .update({ owner_id: userId })
      .eq("id", businessId);

    if (updateError) {
      console.error("Claim error:", updateError);
      return NextResponse.json({ error: "Failed to claim business" }, { status: 500 });
    }

    return NextResponse.json({ success: true, businessName: business.name });
  } catch {
    return NextResponse.json({ error: "Failed to process claim" }, { status: 500 });
  }
}
