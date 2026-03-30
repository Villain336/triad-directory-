import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "Missing businessId" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("lead_credits")
    .select("business_id, total_purchased, total_used, balance")
    .eq("business_id", businessId)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({
      balance: 0,
      totalPurchased: 0,
      totalUsed: 0,
      history: [],
    });
  }

  const { data: history } = await supabase
    .from("lead_credit_usage")
    .select("lead_id, deducted_at")
    .eq("business_id", businessId)
    .order("deducted_at", { ascending: false })
    .limit(5);

  return NextResponse.json({
    balance: data.balance,
    totalPurchased: data.total_purchased,
    totalUsed: data.total_used,
    history: history ?? [],
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, leadId } = body;

    if (!businessId || !leadId) {
      return NextResponse.json(
        { error: "Missing businessId or leadId" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch current balance
    const { data: credits, error: fetchError } = await supabase
      .from("lead_credits")
      .select("balance, total_used")
      .eq("business_id", businessId)
      .single();

    if (fetchError || !credits) {
      return NextResponse.json({ error: "No credits found for this business" }, { status: 404 });
    }

    if (credits.balance <= 0) {
      return NextResponse.json({ error: "No credits remaining" }, { status: 402 });
    }

    // Decrement balance
    const { error: updateError } = await supabase
      .from("lead_credits")
      .update({
        balance: credits.balance - 1,
        total_used: credits.total_used + 1,
      })
      .eq("business_id", businessId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Record usage
    const { error: usageError } = await supabase
      .from("lead_credit_usage")
      .insert({
        business_id: businessId,
        lead_id: leadId,
        deducted_at: new Date().toISOString(),
      });

    if (usageError) {
      return NextResponse.json({ error: usageError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, newBalance: credits.balance - 1 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
