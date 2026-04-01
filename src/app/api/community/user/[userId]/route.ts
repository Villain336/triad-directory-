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

// Reputation formula:
//   (upvotes_on_answers * 10) + (upvotes_on_questions * 5) + (accepted_answers * 25)
function calculateReputation(
  answerUpvotes: number,
  questionUpvotes: number,
  acceptedAnswers: number
): number {
  return answerUpvotes * 10 + questionUpvotes * 5 + acceptedAnswers * 25;
}

// Badge thresholds
function computeBadges(reputation: number, totalAnswers: number, acceptedAnswers: number): string[] {
  const badges: string[] = [];

  if (reputation >= 1000) badges.push("Expert");
  else if (reputation >= 500) badges.push("Contributor");
  else if (reputation >= 100) badges.push("Helper");
  else if (reputation >= 10) badges.push("Newcomer");

  if (acceptedAnswers >= 50) badges.push("Solution Provider");
  else if (acceptedAnswers >= 10) badges.push("Problem Solver");
  else if (acceptedAnswers >= 1) badges.push("First Solution");

  if (totalAnswers >= 100) badges.push("Prolific Answerer");
  else if (totalAnswers >= 25) badges.push("Active Answerer");

  return badges;
}

// GET /api/community/user/[userId]
// Returns a user's community profile, stats, and recent activity.
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    const supabase = buildSupabaseClient(request);

    // Fetch basic user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, full_name, avatar_url, created_at")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all questions by user (active)
    const { data: questions, error: questionsError } = await supabase
      .from("community_questions")
      .select("id, title, slug, upvotes, created_at, answer_count, is_resolved")
      .eq("author_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (questionsError) {
      console.error("User questions fetch error:", questionsError);
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }

    // Fetch all answers by user (active)
    const { data: answers, error: answersError } = await supabase
      .from("community_answers")
      .select("id, question_id, upvotes, is_accepted, created_at")
      .eq("author_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (answersError) {
      console.error("User answers fetch error:", answersError);
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }

    const totalQuestions = (questions || []).length;
    const totalAnswers = (answers || []).length;

    const questionUpvotes = (questions || []).reduce((sum, q) => sum + (q.upvotes || 0), 0);
    const answerUpvotes = (answers || []).reduce((sum, a) => sum + (a.upvotes || 0), 0);
    const totalUpvotesReceived = questionUpvotes + answerUpvotes;

    const acceptedAnswers = (answers || []).filter((a) => a.is_accepted).length;

    const reputation = calculateReputation(answerUpvotes, questionUpvotes, acceptedAnswers);
    const badges = computeBadges(reputation, totalAnswers, acceptedAnswers);

    // Build recent activity: merge questions and answers, sort by created_at, take top 10
    const recentActivity = [
      ...(questions || []).slice(0, 10).map((q) => ({
        type: "question" as const,
        id: q.id,
        title: q.title,
        slug: q.slug,
        upvotes: q.upvotes,
        created_at: q.created_at,
      })),
      ...(answers || []).slice(0, 10).map((a) => ({
        type: "answer" as const,
        id: a.id,
        question_id: a.question_id,
        upvotes: a.upvotes,
        is_accepted: a.is_accepted,
        created_at: a.created_at,
      })),
    ]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    return NextResponse.json({
      profile: {
        id: profile.id,
        name: profile.full_name,
        avatarUrl: profile.avatar_url,
        memberSince: profile.created_at,
      },
      stats: {
        totalQuestions,
        totalAnswers,
        totalUpvotesReceived,
        acceptedAnswers,
        reputation,
      },
      badges,
      recentActivity,
    });
  } catch (err) {
    console.error("GET /api/community/user/[userId] error:", err);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}
