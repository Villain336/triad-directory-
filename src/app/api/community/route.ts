import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;
    const supabase = createServerClient();

    if (type === "question") {
      const { title, body: questionBody, authorName, authorEmail, citySlug, categorySlug, tags } = body;

      if (!title || !questionBody || !authorName || !authorEmail) {
        return NextResponse.json({ error: "Title, body, name, and email are required" }, { status: 400 });
      }

      const slug = slugify(title) + "-" + Date.now().toString(36);

      const { error } = await supabase.from("community_questions").insert({
        title,
        body: questionBody,
        slug,
        author_name: authorName,
        author_email: authorEmail,
        city_slug: citySlug || null,
        category_slug: categorySlug || null,
        tags: tags || [],
        status: "pending",
      });

      if (error) {
        console.error("Question insert error:", error);
        return NextResponse.json({ error: "Failed to save question" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Question submitted!" });
    }

    if (type === "answer") {
      const { questionId, body: answerBody, authorName, authorEmail, isBusinessOwner, businessName } = body;

      if (!questionId || !answerBody || !authorName || !authorEmail) {
        return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
      }

      const { error } = await supabase.from("community_answers").insert({
        question_id: questionId,
        body: answerBody,
        author_name: authorName,
        author_email: authorEmail,
        is_business_owner: isBusinessOwner || false,
        business_name: businessName || null,
        status: "pending",
      });

      if (error) {
        console.error("Answer insert error:", error);
        return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Answer submitted!" });
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
