"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Share2,
  Eye,
  MessageCircle,
  Send,
  Building,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import VoteButton from "@/components/community/VoteButton";
import UserBadge from "@/components/community/UserBadge";

interface Answer {
  id: string;
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
  isAccepted: boolean;
  createdAt: string;
}

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
  answers: Answer[];
  relatedQuestions: {
    id: string;
    slug: string;
    title: string;
    upvotes: number;
    downvotes: number;
    answerCount: number;
    isResolved: boolean;
  }[];
}

type AnswerSort = "votes" | "newest";

export default function QuestionPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email?: string;
    name?: string;
    isBusinessOwner?: boolean;
    businessName?: string;
  } | null>(null);

  const [answerSort, setAnswerSort] = useState<AnswerSort>("votes");
  const [answerBody, setAnswerBody] = useState("");
  const [answerSubmitting, setAnswerSubmitting] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [answerError, setAnswerError] = useState("");
  const [showBusinessOption, setShowBusinessOption] = useState(false);
  const [markingResolved, setMarkingResolved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load auth state
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      // Try to fetch profile for name + business owner status
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      // Check if user owns a business
      const { data: biz } = await supabase
        .from("businesses")
        .select("name")
        .eq("owner_id", user.id)
        .maybeSingle();

      setCurrentUser({
        id: user.id,
        email: user.email,
        name: profile?.full_name ?? user.email?.split("@")[0],
        isBusinessOwner: !!biz,
        businessName: biz?.name ?? undefined,
      });
    });
  }, []);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/community/${slug}?by=slug`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setQuestion(json.question ?? json);
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const sortedAnswers = question
    ? [...question.answers].sort((a, b) => {
        if (answerSort === "votes") {
          return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
    : [];

  // Accepted answers always first
  const orderedAnswers = [
    ...sortedAnswers.filter((a) => a.isAccepted),
    ...sortedAnswers.filter((a) => !a.isAccepted),
  ];

  async function handleAcceptAnswer(answerId: string) {
    if (!currentUser || !question) return;
    try {
      const res = await fetch(`/api/community/${question.id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answerId }),
      });
      if (res.ok) {
        setQuestion((q) =>
          q
            ? {
                ...q,
                isResolved: true,
                answers: q.answers.map((a) => ({
                  ...a,
                  isAccepted: a.id === answerId,
                })),
              }
            : q
        );
      }
    } catch {
      // silent
    }
  }

  async function handleMarkResolved() {
    if (!question) return;
    setMarkingResolved(true);
    try {
      const res = await fetch(`/api/community/${question.id}/resolve`, {
        method: "POST",
      });
      if (res.ok) {
        setQuestion((q) => (q ? { ...q, isResolved: true } : q));
      }
    } finally {
      setMarkingResolved(false);
    }
  }

  async function handleSubmitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!question) return;
    if (answerBody.trim().length < 20) {
      setAnswerError("Answer must be at least 20 characters.");
      return;
    }
    setAnswerError("");
    setAnswerSubmitting(true);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "answer",
          questionId: question.id,
          body: answerBody,
          authorName: currentUser?.name,
          isBusinessOwner: showBusinessOption && currentUser?.isBusinessOwner,
          businessName: currentUser?.businessName,
        }),
      });
      if (res.ok) {
        setAnswerSubmitted(true);
        setAnswerBody("");
        // Refresh question to show new answer
        fetchQuestion();
      } else {
        setAnswerError("Failed to submit answer. Please try again.");
      }
    } catch {
      setAnswerError("Network error. Please try again.");
    } finally {
      setAnswerSubmitting(false);
    }
  }

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  }

  if (loading) {
    return (
      <div className="container-main py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-100 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="card p-6 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !question) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-gray-500">Question not found.</p>
        <Link href="/community" className="btn-primary mt-4 inline-flex">
          Back to Community
        </Link>
      </div>
    );
  }

  const isAuthor = currentUser?.id === question.authorId;

  return (
    <div className="container-main pb-12 pt-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/community" className="hover:text-primary-600">
          Community
        </Link>
        <span>/</span>
        <span className="text-gray-800 truncate max-w-xs">{question.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Question */}
          <article className="card p-6">
            <div className="flex gap-5">
              {/* Reddit-style vote column */}
              <div className="flex flex-col items-center pt-1">
                <VoteButton
                  targetId={question.id}
                  targetType="question"
                  initialUpvotes={question.upvotes}
                  initialDownvotes={question.downvotes}
                  initialUserVote={question.userVote}
                  isLoggedIn={!!currentUser}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900 flex-1">
                    {question.title}
                  </h1>
                  {question.isResolved && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200 shrink-0">
                      <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      Resolved
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <UserBadge
                    authorName={question.authorName}
                    authorId={question.authorId}
                    isBusinessOwner={question.isBusinessOwner}
                    businessName={question.businessName}
                    businessSlug={question.businessSlug}
                    reputation={question.reputation}
                    createdAt={question.createdAt}
                    verb="asked"
                  />
                </div>

                <p className="mt-5 text-gray-700 leading-relaxed whitespace-pre-line">
                  {question.body}
                </p>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {question.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/community/tag/${tag}`}
                      className="rounded-full bg-beige-100 px-3 py-1 text-xs text-beige-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                {/* Actions row */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 flex-wrap gap-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      {question.answerCount} {question.answerCount === 1 ? "answer" : "answers"}
                    </span>
                    {question.viewCount > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        {question.viewCount} views
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isAuthor && !question.isResolved && (
                      <button
                        onClick={handleMarkResolved}
                        disabled={markingResolved}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        {markingResolved ? "Marking..." : "Mark Resolved"}
                      </button>
                    )}
                    {isAuthor && (
                      <Link
                        href={`/community/${slug}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </Link>
                    )}
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {copySuccess ? "Copied!" : "Share"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Answers */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-lg font-bold text-gray-900">
                {question.answers.length} {question.answers.length === 1 ? "Answer" : "Answers"}
              </h2>
              <div className="flex gap-2">
                {(["votes", "newest"] as AnswerSort[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setAnswerSort(s)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      answerSort === s
                        ? "bg-primary-50 text-primary-700"
                        : "bg-beige-100 text-beige-700 hover:bg-primary-50 hover:text-primary-700"
                    }`}
                  >
                    {s === "votes" ? "Votes" : "Newest"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {orderedAnswers.map((answer) => (
                <div
                  key={answer.id}
                  className={`card p-5 ${
                    answer.isAccepted
                      ? "border-green-300 bg-green-50/30"
                      : answer.isBusinessOwner
                      ? "border-primary-200 bg-primary-50/20"
                      : ""
                  }`}
                >
                  {answer.isAccepted && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 mb-3">
                      <CheckCircle className="h-4 w-4" aria-hidden="true" />
                      Accepted Answer
                    </div>
                  )}

                  <div className="flex gap-5">
                    {/* Vote column */}
                    <div className="flex flex-col items-center pt-1">
                      <VoteButton
                        targetId={answer.id}
                        targetType="answer"
                        initialUpvotes={answer.upvotes}
                        initialDownvotes={answer.downvotes}
                        initialUserVote={answer.userVote}
                        isLoggedIn={!!currentUser}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <UserBadge
                        authorName={answer.authorName}
                        authorId={answer.authorId}
                        isBusinessOwner={answer.isBusinessOwner}
                        businessName={answer.businessName}
                        businessSlug={answer.businessSlug}
                        reputation={answer.reputation}
                        createdAt={answer.createdAt}
                        verb="answered"
                      />

                      <div className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {answer.body}
                      </div>

                      {/* Business owner detail link */}
                      {answer.isBusinessOwner && answer.businessSlug && (
                        <div className="mt-2">
                          <Link
                            href={`/listings/${answer.businessSlug}`}
                            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
                          >
                            <Building className="h-3 w-3" aria-hidden="true" />
                            View {answer.businessName || "their listing"}
                          </Link>
                        </div>
                      )}

                      {/* Accept button for question author */}
                      {isAuthor && !answer.isAccepted && (
                        <button
                          onClick={() => handleAcceptAnswer(answer.id)}
                          className="mt-3 inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
                        >
                          <CheckCircle className="h-3 w-3" aria-hidden="true" />
                          Accept this answer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Answer form */}
          <div className="mt-8">
            {currentUser ? (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900">Your Answer</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Share your knowledge — help a Triad neighbor out.
                </p>

                {answerSubmitted ? (
                  <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-6 text-center">
                    <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
                    <p className="mt-2 font-medium text-gray-900">Answer submitted!</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Thank you for helping the Triad community.
                    </p>
                    <button
                      onClick={() => setAnswerSubmitted(false)}
                      className="mt-3 text-xs text-primary-600 hover:underline"
                    >
                      Post another answer
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitAnswer} className="mt-4 space-y-4">
                    <div>
                      <textarea
                        value={answerBody}
                        onChange={(e) => setAnswerBody(e.target.value)}
                        rows={6}
                        placeholder="Write your answer... Include specific details, personal experience, or professional expertise."
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        required
                      />
                      <div className="mt-1 flex justify-between">
                        {answerError && (
                          <p className="text-xs text-red-500">{answerError}</p>
                        )}
                        <p className="text-xs text-gray-400 ml-auto">
                          {answerBody.length} chars (min 20)
                        </p>
                      </div>
                    </div>

                    {currentUser.isBusinessOwner && (
                      <div className="rounded-lg bg-beige-50 border border-beige-200 p-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showBusinessOption}
                            onChange={(e) => setShowBusinessOption(e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              Answer as a business owner
                            </span>
                            <span className="block text-xs text-gray-500">
                              Your answer will display a &quot;Business Owner&quot; badge
                            </span>
                          </div>
                        </label>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={answerSubmitting}
                      className="btn-primary w-full gap-2"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      {answerSubmitting ? "Submitting..." : "Post Your Answer"}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="card p-6 text-center bg-beige-50 border-beige-200">
                <MessageCircle className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p className="font-semibold text-gray-900">Sign in to answer</p>
                <p className="mt-1 text-sm text-gray-500">
                  Join the Triad community to share your knowledge and help neighbors.
                </p>
                <Link
                  href={`/auth/login?redirect=/community/${slug}`}
                  className="btn-primary mt-4 inline-flex"
                >
                  Sign In to Answer
                </Link>
              </div>
            )}
          </div>

          {/* Related Questions */}
          {question.relatedQuestions.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-bold text-gray-900">Related Questions</h3>
              <div className="mt-4 space-y-3">
                {question.relatedQuestions.map((rq) => (
                  <Link
                    key={rq.id}
                    href={`/community/${rq.slug}`}
                    className="card flex items-center gap-4 p-4 hover:border-primary-200 transition-colors"
                  >
                    <div className="text-center min-w-[40px]">
                      <span className="text-sm font-bold text-gray-700">
                        {rq.upvotes - rq.downvotes}
                      </span>
                      <span className="block text-[10px] text-gray-400">votes</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate">
                        {rq.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {rq.answerCount} {rq.answerCount === 1 ? "answer" : "answers"}
                        {rq.isResolved && " · Resolved"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Link
              href="/community"
              className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to Community
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <CommunitySidebar />
      </div>
    </div>
  );
}
