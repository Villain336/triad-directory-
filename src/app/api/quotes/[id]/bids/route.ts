import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Quote request ID is required" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("quote_bids")
      .select("*")
      .eq("quote_request_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Quote bids fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Quote request ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { business_id, business_name, amount, message, estimated_timeline } = body;

    if (!business_name || amount === undefined || amount === null || !message) {
      return NextResponse.json(
        { error: "Missing required fields: business_name, amount, message" },
        { status: 400 }
      );
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      return NextResponse.json({ error: "amount must be a non-negative number" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Verify the quote request exists and is open
    const { data: quoteRequest, error: quoteError } = await supabase
      .from("quote_requests")
      .select("id, status")
      .eq("id", id)
      .single();

    if (quoteError || !quoteRequest) {
      return NextResponse.json({ error: "Quote request not found" }, { status: 404 });
    }

    if (quoteRequest.status !== "open") {
      return NextResponse.json({ error: "Quote request is no longer accepting bids" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("quote_bids")
      .insert({
        quote_request_id: id,
        business_id: business_id || null,
        business_name,
        amount: numericAmount,
        message,
        estimated_timeline: estimated_timeline || null,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Quote bid insert error:", error);
      return NextResponse.json({ error: "Failed to create bid" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
