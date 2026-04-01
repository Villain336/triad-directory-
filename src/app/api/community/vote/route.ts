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

// POST /api/community/vote
// Body: { targetId, targetType: 'question' | 'answer', voteType: 'up' | 'down' }
export async function POST(request: NextRequest) {
  try {
    const supabase = buildSupabaseClient(request);

    // Auth required
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required to vote" }, { status: 401 });
    }

    const body = await request.json();
    const { targetId, targetType, voteType } = body;

    if (!targetId || !targetType || !voteType) {
      return NextResponse.json({ error: "targetId, targetType, and voteType are required" }, { status: 400 });
    }

    if (!["question", "answer"].includes(targetType)) {
      return NextResponse.json({ error: "targetType must be 'question' or 'answer'" }, { status: 400 });
    }

    if (!["up", "down"].includes(voteType)) {
      return NextResponse.json({ error: "voteType must be 'up' or 'down'" }, { status: 400 });
    }

    // Check for an existing vote from this user on this target
    const { data: existingVote, error: fetchError } = await supabase
      .from("community_votes")
      .select("id, vote_type")
      .eq("user_id", user.id)
      .eq("target_id", targetId)
      .eq("target_type", targetType)
      .maybeSingle();

    if (fetchError) {
      console.error("Vote fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to check existing vote" }, { status: 500 });
    }

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Same vote — toggle off (remove it)
        const { error: deleteError } = await supabase
          .from("community_votes")
          .delete()
          .eq("id", existingVote.id);

        if (deleteError) {
          console.error("Vote delete error:", deleteError);
          return NextResponse.json({ error: "Failed to remove vote" }, { status: 500 });
        }
      } else {
        // Opposite vote — update it
        const { error: updateError } = await supabase
          .from("community_votes")
          .update({ vote_type: voteType })
          .eq("id", existingVote.id);

        if (updateError) {
          console.error("Vote update error:", updateError);
          return NextResponse.json({ error: "Failed to update vote" }, { status: 500 });
        }
      }
    } else {
      // No existing vote — insert new
      const { error: insertError } = await supabase.from("community_votes").insert({
        user_id: user.id,
        target_id: targetId,
        target_type: targetType,
        vote_type: voteType,
      });

      if (insertError) {
        console.error("Vote insert error:", insertError);
        return NextResponse.json({ error: "Failed to save vote" }, { status: 500 });
      }
    }

    // Recalculate vote counts from the votes table
    const { data: voteCounts, error: countError } = await supabase
      .from("community_votes")
      .select("vote_type")
      .eq("target_id", targetId)
      .eq("target_type", targetType);

    if (countError) {
      console.error("Vote count error:", countError);
      return NextResponse.json({ error: "Failed to recalculate votes" }, { status: 500 });
    }

    const upvotes = (voteCounts || []).filter((v) => v.vote_type === "up").length;
    const downvotes = (voteCounts || []).filter((v) => v.vote_type === "down").length;

    // Persist updated counts back to the target table
    const targetTable = targetType === "question" ? "community_questions" : "community_answers";
    await supabase.from(targetTable).update({ upvotes, downvotes }).eq("id", targetId);

    // Determine userVote after the operation
    const { data: currentVote } = await supabase
      .from("community_votes")
      .select("vote_type")
      .eq("user_id", user.id)
      .eq("target_id", targetId)
      .eq("target_type", targetType)
      .maybeSingle();

    return NextResponse.json({
      upvotes,
      downvotes,
      userVote: currentVote?.vote_type ?? null,
    });
  } catch (err) {
    console.error("POST /api/community/vote error:", err);
    return NextResponse.json({ error: "Failed to process vote" }, { status: 500 });
  }
}
