import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const supabase = createServerClient();

    let query = supabase
      .from("quote_requests")
      .select("*, quote_bids(count)")
      .order("created_at", { ascending: false });

    if (city) query = query.eq("city_slug", city);
    if (category) query = query.eq("category_slug", category);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;

    if (error) {
      console.error("Quote requests fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch quote requests" }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      category_slug,
      city_slug,
      title,
      description,
      budget_range,
      timeline,
    } = body;

    if (!customer_name || !customer_email || !category_slug || !city_slug || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields: customer_name, customer_email, category_slug, city_slug, title, description" },
        { status: 400 }
      );
    }

    const validBudgets = ["under-500", "500-1000", "1000-5000", "5000-10000", "10000-plus"];
    if (budget_range && !validBudgets.includes(budget_range)) {
      return NextResponse.json({ error: "Invalid budget_range value" }, { status: 400 });
    }

    const validTimelines = ["asap", "this-week", "this-month", "flexible"];
    if (timeline && !validTimelines.includes(timeline)) {
      return NextResponse.json({ error: "Invalid timeline value" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        category_slug,
        city_slug,
        title,
        description,
        budget_range: budget_range || null,
        timeline: timeline || null,
        status: "open",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Quote request insert error:", error);
      return NextResponse.json({ error: "Failed to create quote request" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
