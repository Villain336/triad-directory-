import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === "question") {
      const { title, body: questionBody, authorName, authorEmail, citySlug, categorySlug, tags } = body;

      if (!title || !questionBody || !authorName || !authorEmail) {
        return NextResponse.json({ error: "Title, body, name, and email are required" }, { status: 400 });
      }

      // In production: save to Supabase
      // const { data, error } = await supabase.from('community_questions').insert({
      //   title, body: questionBody, author_name: authorName, author_email: authorEmail,
      //   city_slug: citySlug, category_slug: categorySlug, tags, status: 'pending'
      // });

      console.log("New community question:", {
        title,
        authorName,
        authorEmail,
        citySlug,
        categorySlug,
        tags,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Question submitted! It will appear after review.",
      });
    }

    if (type === "answer") {
      const { questionId, body: answerBody, authorName, authorEmail, isBusinessOwner, businessName } = body;

      if (!questionId || !answerBody || !authorName || !authorEmail) {
        return NextResponse.json({ error: "Question ID, answer, name, and email are required" }, { status: 400 });
      }

      // In production: save to Supabase
      // const { data, error } = await supabase.from('community_answers').insert({
      //   question_id: questionId, body: answerBody, author_name: authorName,
      //   author_email: authorEmail, is_business_owner: isBusinessOwner,
      //   business_name: businessName, status: 'pending'
      // });

      console.log("New community answer:", {
        questionId,
        authorName,
        isBusinessOwner,
        businessName,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Answer submitted! It will appear after review.",
      });
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
