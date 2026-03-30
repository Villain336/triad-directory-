import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, authorName, email, rating, content, photos } = body;

    // Validate required fields
    if (!businessId || !authorName || !email || !rating || !content) {
      return NextResponse.json(
        { error: "businessId, authorName, email, rating, and content are required." },
        { status: 400 }
      );
    }

    // Validate rating range
    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5." },
        { status: 400 }
      );
    }

    // Validate content length
    if (typeof content !== "string" || content.trim().length < 20) {
      return NextResponse.json(
        { error: "Review content must be at least 20 characters." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Insert review
    const { data: review, error: insertError } = await supabase
      .from("reviews")
      .insert({
        business_id: businessId,
        author_name: authorName.trim(),
        email: email.trim().toLowerCase(),
        rating: numRating,
        content: content.trim(),
        photos: Array.isArray(photos) ? photos : [],
        is_verified: false,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Review insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save review. Please try again." },
        { status: 500 }
      );
    }

    // Recalculate and update business rating + review_count from approved reviews
    const { data: approvedReviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("business_id", businessId)
      .eq("status", "approved");

    if (approvedReviews && approvedReviews.length > 0) {
      const avg =
        approvedReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
        approvedReviews.length;

      await supabase
        .from("businesses")
        .update({
          rating: Math.round(avg * 10) / 10,
          review_count: approvedReviews.length,
        })
        .eq("id", businessId);
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    console.error("Reviews API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId query parameter is required." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("business_id", businessId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch reviews." }, { status: 500 });
    }

    return NextResponse.json({ reviews: reviews ?? [] });
  } catch (err) {
    console.error("Reviews GET error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
