import Link from "next/link";
import { Metadata } from "next";
import { MessageCircle, ThumbsUp, HelpCircle, Users, CheckCircle, Filter } from "lucide-react";
import { getRecentQuestions } from "@/lib/data/community";
import { generatePageMetadata } from "@/lib/seo/metadata";
import CommunitySidebar from "@/components/community/CommunitySidebar";

export const metadata: Metadata = generatePageMetadata({
  title: "Community Q&A - Ask the Triad",
  description:
    "Ask questions, get answers from local experts and neighbors. The Triad's community forum for home services, contractors, and local business recommendations.",
  path: "/community",
});

export default function CommunityPage() {
  const questions = getRecentQuestions(10);

  const stats = {
    questions: questions.length,
    answers: questions.reduce((sum, q) => sum + q.answerCount, 0),
    resolved: questions.filter((q) => q.isResolved).length,
  };

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
          <div className="mt-6 flex gap-3">
            <Link href="/community/ask" className="btn-accent">
              Ask a Question
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 flex gap-8 text-sm">
            <div>
              <span className="text-2xl font-bold text-white">{stats.questions}</span>
              <span className="block text-primary-300">Questions</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">{stats.answers}</span>
              <span className="block text-primary-300">Answers</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">{stats.resolved}</span>
              <span className="block text-primary-300">Resolved</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-main py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Sort/Filter Bar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Questions
              </h2>
              <div className="flex gap-2 text-sm">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                  Newest
                </span>
                <span className="rounded-full bg-beige-100 px-3 py-1 text-xs font-medium text-beige-700 cursor-pointer hover:bg-primary-50 hover:text-primary-700 transition-colors">
                  Most Upvoted
                </span>
                <span className="rounded-full bg-beige-100 px-3 py-1 text-xs font-medium text-beige-700 cursor-pointer hover:bg-primary-50 hover:text-primary-700 transition-colors">
                  Unanswered
                </span>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((q) => (
                <article key={q.id} className="card p-5 hover:border-primary-200 transition-colors">
                  <div className="flex gap-4">
                    {/* Vote + Answer Counts */}
                    <div className="hidden sm:flex flex-col items-center gap-3 pt-1 min-w-[60px]">
                      <div className="text-center">
                        <span className="text-sm font-bold text-gray-700 block">{q.upvotes}</span>
                        <span className="text-[10px] text-gray-400">votes</span>
                      </div>
                      <div className={`text-center rounded-md px-2 py-1 ${
                        q.isResolved
                          ? "bg-green-50 border border-green-200"
                          : q.answerCount > 0
                            ? "bg-beige-50 border border-beige-200"
                            : "bg-gray-50 border border-gray-200"
                      }`}>
                        <span className={`text-sm font-bold block ${
                          q.isResolved ? "text-green-700" : q.answerCount > 0 ? "text-beige-700" : "text-gray-500"
                        }`}>
                          {q.answerCount}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {q.answerCount === 1 ? "answer" : "answers"}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <Link href={`/community/${q.slug}`} className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                            {q.title}
                          </h3>
                        </Link>
                        {q.isResolved && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 shrink-0">
                            <CheckCircle className="h-3 w-3" aria-hidden="true" />
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{q.body}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span>by <strong className="text-gray-700">{q.authorName}</strong></span>
                        <span>
                          {new Date(q.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1 sm:hidden">
                          <ThumbsUp className="h-3 w-3" aria-hidden="true" /> {q.upvotes}
                        </span>
                        <span className="flex items-center gap-1 sm:hidden">
                          <MessageCircle className="h-3 w-3" aria-hidden="true" /> {q.answerCount}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {q.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/community/tag/${tag}`}
                            className="rounded-full bg-beige-100 px-2.5 py-0.5 text-xs text-beige-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <CommunitySidebar />
        </div>
      </div>
    </>
  );
}
