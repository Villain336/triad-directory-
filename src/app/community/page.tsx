"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MessageCircle,
  CheckCircle,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { categories } from "@/lib/data/categories";
import { cities } from "@/lib/data/cities";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import VoteButton from "@/components/community/VoteButton";
import UserBadge from "@/components/community/UserBadge";

type SortOption = "newest" | "popular" | "unanswered";

interface Question {
  id: string;
  slug: string;
  title: string;
  body: string;
  authorName: string;
  authorId?: string;
  isBusinessOwner?: boolean;
  businessName?: string;
  businessSlug?: string;
  reputation?: number;
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  answerCount: number;
  isResolved: boolean;
  tags: string[];
  citySlug?: string;
  categorySlug?: string;
  viewCount: number;
  createdAt: string;
}

interface CommunityStats {
  totalQuestions: number;
  totalAnswers: number;
  totalResolved: number;
}

interface ApiResponse {
  questions: Question[];
  stats: CommunityStats;
  total: number;
  page: number;
  totalPages: number;
}

const LIMIT = 20;

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  popular: "Most Upvoted",
  unanswered: "Unanswered",
};

export default function CommunityPage() {
  const [sort, setSort] = useState<SortOption>("newest");
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sort,
        page: String(page),
        limit: String(LIMIT),
      });
      if (cityFilter) params.set("city", cityFilter);
      if (categoryFilter) params.set("category", categoryFilter);

      const res = await fetch(`/api/community?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, [sort, page, cityFilter, categoryFilter]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Reset page when filters/sort change
  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  };
  const handleCityChange = (val: string) => {
    setCityFilter(val);
    setPage(1);
  };
  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setPage(1);
  };

  const stats = data?.stats ?? { totalQuestions: 0, totalAnswers: 0, totalResolved: 0 };
  const questions = data?.questions ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <>
      {/* Hero */}
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
            <Link
              href={isLoggedIn ? "/community/ask" : "/auth/login?redirect=/community/ask"}
              className="btn-accent"
            >
              Ask a Question
            </Link>
          </div>

          {/* Real-time stats */}
          <div className="mt-8 flex gap-8 text-sm">
            <div>
              <span className="text-2xl font-bold text-white">{stats.totalQuestions}</span>
              <span className="block text-primary-300">Questions</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">{stats.totalAnswers}</span>
              <span className="block text-primary-300">Answers</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">{stats.totalResolved}</span>
              <span className="block text-primary-300">Resolved</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-main py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Sort tabs + Filter bar */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
                <div className="flex gap-2 text-sm">
                  {(["newest", "popular", "unanswered"] as SortOption[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSortChange(s)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        sort === s
                          ? "bg-primary-50 text-primary-700"
                          : "bg-beige-100 text-beige-700 hover:bg-primary-50 hover:text-primary-700"
                      }`}
                    >
                      {SORT_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-3 flex-wrap">
                <select
                  value={cityFilter}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city.slug} value={city.slug}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Questions List */}
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="card p-5 animate-pulse">
                    <div className="flex gap-4">
                      <div className="hidden sm:flex flex-col gap-3 min-w-[60px]">
                        <div className="h-8 w-10 bg-gray-100 rounded" />
                        <div className="h-8 w-10 bg-gray-100 rounded" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-100 rounded w-3/4" />
                        <div className="h-4 bg-gray-100 rounded w-full" />
                        <div className="h-4 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : questions.length === 0 ? (
              <div className="card p-10 text-center text-gray-500">
                <MessageCircle className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p className="font-medium">No questions found</p>
                <p className="text-sm mt-1">Try changing your filters or be the first to ask!</p>
                <Link
                  href={isLoggedIn ? "/community/ask" : "/auth/login?redirect=/community/ask"}
                  className="btn-primary mt-4 inline-flex"
                >
                  Ask a Question
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <article
                    key={q.id}
                    className="card p-5 hover:border-primary-200 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Vote + Answer Counts */}
                      <div className="hidden sm:flex flex-col items-center gap-3 pt-1 min-w-[60px]">
                        <VoteButton
                          targetId={q.id}
                          targetType="question"
                          initialUpvotes={q.upvotes}
                          initialDownvotes={q.downvotes}
                          initialUserVote={q.userVote}
                          isLoggedIn={isLoggedIn}
                        />
                        <div
                          className={`text-center rounded-md px-2 py-1 ${
                            q.isResolved
                              ? "bg-green-50 border border-green-200"
                              : q.answerCount > 0
                              ? "bg-amber-50 border border-amber-200"
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <span
                            className={`text-sm font-bold block ${
                              q.isResolved
                                ? "text-green-700"
                                : q.answerCount > 0
                                ? "text-amber-700"
                                : "text-gray-500"
                            }`}
                          >
                            {q.answerCount}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {q.answerCount === 1 ? "answer" : "answers"}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
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

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <UserBadge
                            authorName={q.authorName}
                            authorId={q.authorId}
                            isBusinessOwner={q.isBusinessOwner}
                            businessName={q.businessName}
                            businessSlug={q.businessSlug}
                            reputation={q.reputation}
                            createdAt={q.createdAt}
                            verb="asked"
                          />

                          {/* Mobile vote/answer counts */}
                          <span className="flex items-center gap-1 text-xs text-gray-400 sm:hidden">
                            <MessageCircle className="h-3 w-3" aria-hidden="true" />
                            {q.answerCount}
                          </span>

                          {q.viewCount > 0 && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Eye className="h-3 w-3" aria-hidden="true" />
                              {q.viewCount} views
                            </span>
                          )}
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
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (page <= 4) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = page - 3 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                          pageNum === page
                            ? "bg-primary-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <CommunitySidebar />
        </div>
      </div>
    </>
  );
}
