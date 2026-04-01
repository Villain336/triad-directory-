import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { slugify } from "@/lib/utils";

// Build an auth-aware Supabase client from the incoming request cookies
function buildSupabaseClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
}

async function getAuthUser(request: NextRequest) {
  const supabase = buildSupabaseClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// GET /api/community
// Query params: sort, tag, city, category, page, limit
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const sort = searchParams.get("sort") || "newest";
    const tag = searchParams.get("tag");
    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    const supabase = buildSupabaseClient(request);

    let query = supabase
      .from("community_questions")
      .select(
        "id, title, body, slug, author_name, author_id, author_avatar_url, city_slug, category_slug, tags, upvotes, downvotes, answer_count, is_resolved, created_at, views",
        { count: "exact" }
      )
      .eq("status", "active");

    // Filters
    if (tag) query = query.contains("tags", [tag]);
    if (city) query = query.eq("city_slug", city);
    if (category) query = query.eq("category_slug", category);

    // Sort
    if (sort === "popular") {
      query = query.order("upvotes", { ascending: false });
    } else if (sort === "unanswered") {
      query = query.eq("answer_count", 0).order("created_at", { ascending: false });
    } else {
      // newest (default)
      query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Community questions fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
    }

    return NextResponse.json({
      questions: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    console.error("GET /api/community error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// POST /api/community
// Body for question: { type: 'question', title, body, citySlug, categorySlug, tags, authorName?, authorEmail? }
// Body for answer:   { type: 'answer', questionId, body, isBusinessOwner?, businessName?, authorName?, authorEmail? }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    // Try to get the authenticated user
    const user = await getAuthUser(request);

    // Build an admin/anon Supabase client for DB writes (no auth needed for inserts)
    const supabase = buildSupabaseClient(request);

    if (type === "question") {
      const { title, body: questionBody, citySlug, categorySlug, tags, authorName, authorEmail } = body;

      if (!title || !questionBody) {
        return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
      }

      // Auth-aware author resolution
      let resolvedAuthorName: string;
      let resolvedAuthorEmail: string | null = null;
      let authorId: string | null = null;
      let authorAvatarUrl: string | null = null;
      let status: string;

      if (user) {
        // Fetch user profile for display name / avatar
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name, avatar_url, email")
          .eq("id", user.id)
          .single();

        resolvedAuthorName = profile?.full_name || user.email?.split("@")[0] || "Anonymous";
        resolvedAuthorEmail = profile?.email || user.email || null;
        authorId = user.id;
        authorAvatarUrl = profile?.avatar_url || null;
        status = "active";
      } else {
        if (!authorName || !authorEmail) {
          return NextResponse.json(
            { error: "Name and email are required for anonymous posting" },
            { status: 400 }
          );
        }
        resolvedAuthorName = authorName;
        resolvedAuthorEmail = authorEmail;
        status = "pending";
      }

      const slug = slugify(title) + "-" + Date.now().toString(36);

      const { data: inserted, error } = await supabase
        .from("community_questions")
        .insert({
          title,
          body: questionBody,
          slug,
          author_name: resolvedAuthorName,
          author_email: resolvedAuthorEmail,
          author_id: authorId,
          author_avatar_url: authorAvatarUrl,
          city_slug: citySlug || null,
          category_slug: categorySlug || null,
          tags: tags || [],
          status,
          upvotes: 0,
          downvotes: 0,
          answer_count: 0,
          views: 0,
          is_resolved: false,
        })
        .select("id, slug")
        .single();

      if (error) {
        console.error("Question insert error:", error);
        return NextResponse.json({ error: "Failed to save question" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: user ? "Question posted!" : "Question submitted for review!",
        id: inserted?.id,
        slug: inserted?.slug,
      });
    }

    if (type === "answer") {
      const { questionId, body: answerBody, isBusinessOwner, businessName, authorName, authorEmail } = body;

      if (!questionId || !answerBody) {
        return NextResponse.json({ error: "Question ID and body are required" }, { status: 400 });
      }

      let resolvedAuthorName: string;
      let resolvedAuthorEmail: string | null = null;
      let authorId: string | null = null;
      let authorAvatarUrl: string | null = null;
      let resolvedIsBusinessOwner = isBusinessOwner || false;
      let status: string;

      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name, avatar_url, email")
          .eq("id", user.id)
          .single();

        resolvedAuthorName = profile?.full_name || user.email?.split("@")[0] || "Anonymous";
        resolvedAuthorEmail = profile?.email || user.email || null;
        authorId = user.id;
        authorAvatarUrl = profile?.avatar_url || null;
        status = "active";

        // Check if user owns a business
        const { data: org } = await supabase
          .from("businesses")
          .select("id, name")
          .eq("owner_id", user.id)
          .maybeSingle();

        if (org) {
          resolvedIsBusinessOwner = true;
        }
      } else {
        if (!authorName || !authorEmail) {
          return NextResponse.json(
            { error: "Name and email are required for anonymous posting" },
            { status: 400 }
          );
        }
        resolvedAuthorName = authorName;
        resolvedAuthorEmail = authorEmail;
        status = "pending";
      }

      const { data: inserted, error } = await supabase
        .from("community_answers")
        .insert({
          question_id: questionId,
          body: answerBody,
          author_name: resolvedAuthorName,
          author_email: resolvedAuthorEmail,
          author_id: authorId,
          author_avatar_url: authorAvatarUrl,
          is_business_owner: resolvedIsBusinessOwner,
          business_name: businessName || null,
          status,
          upvotes: 0,
          downvotes: 0,
          is_accepted: false,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Answer insert error:", error);
        return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
      }

      // Increment answer_count on the parent question
      await supabase.rpc("increment_answer_count", { question_id: questionId });

      return NextResponse.json({
        success: true,
        message: user ? "Answer posted!" : "Answer submitted for review!",
        id: inserted?.id,
      });
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
  } catch (err) {
    console.error("POST /api/community error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
