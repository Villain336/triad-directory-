"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Tag, ArrowLeft, PenSquare, SortAsc } from "lucide-react";
import QuestionCard, { QuestionData } from "@/components/community/QuestionCard";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

type SortOption = "newest" | "popular";

function mapApiQuestion(q: Record<string, unknown>): QuestionData {
  return {
    id: String(q.id),
    title: String(q.title),
    body: String(q.body),
    slug: String(q.slug),
    authorName: String(q.author_name),
    tags: Array.isArray(q.tags) ? (q.tags as string[]) : [],
    upvotes: Number(q.upvotes) || 0,
    answerCount: Number(q.answer_count) || 0,
    views: q.views !== undefined ? Number(q.views) : undefined,
    isResolved: Boolean(q.is_resolved),
    createdAt: String(q.created_at),
  };
}

export default function TagPage() {
  const params = useParams();
  const rawTag = typeof params.tag === "string" ? params.tag : (params.tag as string[])[0];
  const tag = decodeURIComponent(rawTag);

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          tag,
          sort,
          limit: "50",
        });

        const res = await fetch(`/api/community?${params.toString()}`);

        if (!res.ok) {
          throw new Error("Failed to load questions");
        }

        const data = await res.json();

        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions.map(mapApiQuestion));
          setTotal(data.total ?? data.questions.length);
        } else {
          // Fallback: API might be unavailable (dev without DB), use static data
          const { getQuestionsByTag } = await import("@/lib/data/community");
          const staticQs = getQuestionsByTag(tag);

          const sorted = [...staticQs].sort((a, b) => {
            if (sort === "popular") return b.upvotes - a.upvotes;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          setQuestions(
            sorted.map((q) => ({
              id: q.id,
              title: q.title,
              body: q.body,
              slug: q.slug,
              authorName: q.authorName,
              tags: q.tags,
              upvotes: q.upvotes,
              answerCount: q.answerCount,
              isResolved: q.isResolved,
              createdAt: q.createdAt,
            }))
          );
          setTotal(sorted.length);
        }
      } catch {
        // Graceful fallback to static data
        try {
          const { getQuestionsByTag } = await import("@/lib/data/community");
          const staticQs = getQuestionsByTag(tag);

          const sorted = [...staticQs].sort((a, b) => {
            if (sort === "popular") return b.upvotes - a.upvotes;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          setQuestions(
            sorted.map((q) => ({
              id: q.id,
              title: q.title,
              body: q.body,
              slug: q.slug,
              authorName: q.authorName,
              tags: q.tags,
              upvotes: q.upvotes,
              answerCount: q.answerCount,
              isResolved: q.isResolved,
              createdAt: q.createdAt,
            }))
          );
          setTotal(sorted.length);
        } catch {
          setError("Failed to load questions for this tag.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [tag, sort]);

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Upvoted" },
  ];

  return (
    <>
      <div className="container-main">
        <Breadcrumbs
          items={[
            { label: "Community", href: "/community" },
            { label: `Tag: ${tag}` },
          ]}
        />
      </div>

      <div className="container-main pb-12">
        {/* Tag Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
              <Tag className="h-5 w-5 text-primary-600" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                &ldquo;{tag}&rdquo;
              </h1>
              <p className="text-sm text-gray-500">
                {total === null ? (
                  <span className="inline-block h-4 w-24 bg-gray-200 rounded animate-pulse" />
                ) : (
                  `${total} question${total !== 1 ? "s" : ""} tagged with this topic`
                )}
              </p>
            </div>
          </div>

          <Link
            href={`/community/ask?tag=${encodeURIComponent(tag)}`}
            className="btn-primary text-sm flex items-center gap-2 shrink-0"
          >
            <PenSquare className="h-4 w-4" />
            Ask a Question
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Sort Tabs */}
            <div className="flex items-center gap-2 mb-5">
              <SortAsc className="h-4 w-4 text-gray-400" aria-hidden="true" />
              <div className="flex gap-1.5">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      sort === opt.value
                        ? "bg-primary-600 text-white"
                        : "bg-beige-100 text-beige-700 hover:bg-primary-50 hover:text-primary-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions list */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="card p-5 animate-pulse">
                    <div className="flex gap-4">
                      <div className="hidden sm:flex flex-col gap-2 min-w-[56px]">
                        <div className="h-8 w-12 bg-gray-200 rounded" />
                        <div className="h-10 w-12 bg-gray-200 rounded" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={() => setSort(sort)}
                  className="btn-secondary mt-4 text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((q) => (
                  <QuestionCard key={q.id} question={q} highlightTag={tag} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                <Tag className="mx-auto h-10 w-10 text-gray-300 mb-3" aria-hidden="true" />
                <p className="text-gray-500 font-medium">
                  No questions found with tag &ldquo;{tag}&rdquo;
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Be the first to ask about this topic!
                </p>
                <Link
                  href={`/community/ask?tag=${encodeURIComponent(tag)}`}
                  className="btn-primary mt-5 text-sm"
                >
                  Ask the First Question
                </Link>
              </div>
            )}

            <div className="mt-6">
              <Link
                href="/community"
                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Community
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <CommunitySidebar />
        </div>
      </div>
    </>
  );
}
