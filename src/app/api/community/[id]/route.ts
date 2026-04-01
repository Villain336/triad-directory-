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

// GET /api/community/[id]
// Returns a single question (by id or slug) with all its answers.
// Increments view count. If authenticated, includes userVote on question and each answer.
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = buildSupabaseClient(request);
    const user = await getAuthUser(request);

    // Fetch question by id or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const questionQuery = supabase
      .from("community_questions")
      .select(
        "id, title, body, slug, author_name, author_id, author_avatar_url, city_slug, category_slug, tags, upvotes, downvotes, answer_count, is_resolved, created_at, views"
      );

    const { data: question, error: questionError } = isUuid
      ? await questionQuery.eq("id", id).single()
      : await questionQuery.eq("slug", id).single();

    if (questionError || !question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Increment view count (fire-and-forget style — don't block on error)
    supabase
      .from("community_questions")
      .update({ views: (question.views || 0) + 1 })
      .eq("id", question.id)
      .then(({ error }) => {
        if (error) console.error("View increment error:", error);
      });

    // Fetch answers: accepted first, then ordered by upvotes desc
    const { data: answers, error: answersError } = await supabase
      .from("community_answers")
      .select(
        "id, question_id, body, author_name, author_id, author_avatar_url, is_business_owner, business_name, upvotes, downvotes, is_accepted, created_at"
      )
      .eq("question_id", question.id)
      .eq("status", "active")
      .order("is_accepted", { ascending: false })
      .order("upvotes", { ascending: false });

    if (answersError) {
      console.error("Answers fetch error:", answersError);
      return NextResponse.json({ error: "Failed to fetch answers" }, { status: 500 });
    }

    // If authenticated, fetch user's votes on the question and all answers
    let questionUserVote: string | null = null;
    const answerVoteMap: Record<string, string> = {};

    if (user) {
      const targetIds = [question.id, ...(answers || []).map((a) => a.id)];

      const { data: userVotes } = await supabase
        .from("community_votes")
        .select("target_id, target_type, vote_type")
        .eq("user_id", user.id)
        .in("target_id", targetIds);

      for (const vote of userVotes || []) {
        if (vote.target_type === "question" && vote.target_id === question.id) {
          questionUserVote = vote.vote_type;
        } else if (vote.target_type === "answer") {
          answerVoteMap[vote.target_id] = vote.vote_type;
        }
      }
    }

    const answersWithVotes = (answers || []).map((answer) => ({
      ...answer,
      userVote: user ? (answerVoteMap[answer.id] ?? null) : undefined,
    }));

    return NextResponse.json({
      question: {
        ...question,
        userVote: user ? questionUserVote : undefined,
      },
      answers: answersWithVotes,
    });
  } catch (err) {
    console.error("GET /api/community/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}

// PATCH /api/community/[id]
// Allowed by: author or admin
// Can update: title, body, tags, is_resolved
// Special action: { action: 'accept_answer', answerId: string }
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = buildSupabaseClient(request);
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Fetch the question
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const { data: question, error: questionError } = isUuid
      ? await supabase
          .from("community_questions")
          .select("id, author_id")
          .eq("id", id)
          .single()
      : await supabase
          .from("community_questions")
          .select("id, author_id")
          .eq("slug", id)
          .single();

    if (questionError || !question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Check if user is author or admin
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === "admin";
    const isAuthor = question.author_id === user.id;

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: "Not authorized to edit this question" }, { status: 403 });
    }

    const body = await request.json();
    const { action, answerId, title, body: questionBody, tags, is_resolved } = body;

    // Handle accept_answer action
    if (action === "accept_answer") {
      if (!answerId) {
        return NextResponse.json({ error: "answerId is required" }, { status: 400 });
      }

      // Clear any previously accepted answer on this question
      await supabase
        .from("community_answers")
        .update({ is_accepted: false })
        .eq("question_id", question.id);

      // Accept the specified answer
      const { error: acceptError } = await supabase
        .from("community_answers")
        .update({ is_accepted: true })
        .eq("id", answerId)
        .eq("question_id", question.id);

      if (acceptError) {
        console.error("Accept answer error:", acceptError);
        return NextResponse.json({ error: "Failed to accept answer" }, { status: 500 });
      }

      // Mark question as resolved
      await supabase
        .from("community_questions")
        .update({ is_resolved: true })
        .eq("id", question.id);

      return NextResponse.json({ success: true, message: "Answer accepted" });
    }

    // Regular field updates
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (questionBody !== undefined) updates.body = questionBody;
    if (tags !== undefined) updates.tags = tags;
    if (is_resolved !== undefined) updates.is_resolved = is_resolved;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const { data: updated, error: updateError } = await supabase
      .from("community_questions")
      .update(updates)
      .eq("id", question.id)
      .select("id, title, body, slug, tags, is_resolved, updated_at")
      .single();

    if (updateError) {
      console.error("Question update error:", updateError);
      return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
    }

    return NextResponse.json({ success: true, question: updated });
  } catch (err) {
    console.error("PATCH /api/community/[id] error:", err);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}
