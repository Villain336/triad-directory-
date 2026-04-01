import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

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

// GET /api/community/[id]/answers
// Returns paginated answers for a question, sorted: accepted first, then upvotes desc.
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    const supabase = buildSupabaseClient(request);

    // Resolve question id (supports id or slug)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let questionId = id;

    if (!isUuid) {
      const { data: question, error } = await supabase
        .from("community_questions")
        .select("id")
        .eq("slug", id)
        .single();

      if (error || !question) {
        return NextResponse.json({ error: "Question not found" }, { status: 404 });
      }
      questionId = question.id;
    }

    const { data: answers, error, count } = await supabase
      .from("community_answers")
      .select(
        "id, question_id, body, author_name, author_id, author_avatar_url, is_business_owner, business_name, upvotes, downvotes, is_accepted, created_at",
        { count: "exact" }
      )
      .eq("question_id", questionId)
      .eq("status", "active")
      .order("is_accepted", { ascending: false })
      .order("upvotes", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Answers fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch answers" }, { status: 500 });
    }

    return NextResponse.json({
      answers: answers || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    console.error("GET /api/community/[id]/answers error:", err);
    return NextResponse.json({ error: "Failed to fetch answers" }, { status: 500 });
  }
}

// POST /api/community/[id]/answers
// Auth-aware: authenticated users post immediately (active), anonymous users go to pending.
// If authenticated user owns a business, isBusinessOwner is auto-set.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = buildSupabaseClient(request);
    const user = await getAuthUser(request);

    const body = await request.json();
    const { body: answerBody, isBusinessOwner, businessName, authorName, authorEmail } = body;

    if (!answerBody) {
      return NextResponse.json({ error: "Answer body is required" }, { status: 400 });
    }

    // Resolve question id (supports id or slug)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let questionId = id;

    if (!isUuid) {
      const { data: question, error } = await supabase
        .from("community_questions")
        .select("id")
        .eq("slug", id)
        .single();

      if (error || !question) {
        return NextResponse.json({ error: "Question not found" }, { status: 404 });
      }
      questionId = question.id;
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

      // Auto-detect business ownership
      const { data: org } = await supabase
        .from("organizations")
        .select("id, name")
        .eq("owner_id", user.id)
        .eq("status", "active")
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

    const { data: inserted, error: insertError } = await supabase
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

    if (insertError) {
      console.error("Answer insert error:", insertError);
      return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
    }

    // Increment answer_count on the parent question
    await supabase.rpc("increment_answer_count", { question_id: questionId });

    return NextResponse.json({
      success: true,
      message: user ? "Answer posted!" : "Answer submitted for review!",
      id: inserted?.id,
    });
  } catch (err) {
    console.error("POST /api/community/[id]/answers error:", err);
    return NextResponse.json({ error: "Failed to post answer" }, { status: 500 });
  }
}
