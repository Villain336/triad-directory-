import Link from "next/link";
import { Metadata } from "next";
import { MessageCircle, ThumbsUp, ArrowRight, HelpCircle, Users } from "lucide-react";
import { getRecentQuestions } from "@/lib/data/community";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Community Q&A - Ask the Triad",
  description:
    "Ask questions, get answers from local experts and neighbors. The Triad's community forum for home services, contractors, and local business recommendations.",
  path: "/community",
});

export default function CommunityPage() {
  const questions = getRecentQuestions(10);

  return (
    <>
      <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container-main py-10 sm:py-14">
          <div className="flex items-center gap-2 text-primary-200 text-sm mb-2">
            <Users className="h-4 w-4" aria-hidden="true" />
            Community Forum
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Ask the Triad</h1>
          <p className="mt-3 max-w-2xl text-primary-200 text-lg">
            Get answers from local experts, business owners, and your neighbors.
            Ask anything about home services, contractors, and local businesses in
            the Piedmont Triad.
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        {/* Ask CTA */}
        <div className="mb-8 rounded-xl bg-beige-100 border border-beige-300 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary-600" aria-hidden="true" />
              Have a Question?
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Ask the community — get advice from local pros and homeowners who&apos;ve been there.
            </p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">
            Ask a Question
          </Link>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q) => (
            <article key={q.id} className="card p-5">
              <div className="flex gap-4">
                {/* Votes */}
                <div className="hidden sm:flex flex-col items-center gap-1 pt-1">
                  <ThumbsUp className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <span className="text-sm font-bold text-gray-700">{q.upvotes}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/community/${q.slug}`}>
                    <h2 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                      {q.title}
                    </h2>
                  </Link>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{q.body}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span>by {q.authorName}</span>
                    <span>&middot;</span>
                    <span>
                      {new Date(q.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" aria-hidden="true" />
                      {q.answerCount} answer{q.answerCount !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1 sm:hidden">
                      <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                      {q.upvotes}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-beige-100 px-2.5 py-0.5 text-xs text-beige-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
