import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, listingId, citySlug, categorySlug, source } = body;

    if (!email && !phone) {
      return NextResponse.json({ error: "Email or phone is required" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { error } = await supabase.from("leads").insert({
      name,
      email,
      phone,
      message,
      business_id: listingId || null,
      city_slug: citySlug,
      category_slug: categorySlug,
      source: source || "contact_form",
      source_page: request.headers.get("referer"),
    });

    if (error) {
      console.error("Lead insert error:", error);
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Lead captured successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
