"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Award,
  MessageCircle,
  ThumbsUp,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  Star,
  Flame,
  Shield,
  Users,
} from "lucide-react";
import QuestionCard, { QuestionData } from "@/components/community/QuestionCard";

interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  memberSince: string;
}

interface UserStats {
  totalQuestions: number;
  totalAnswers: number;
  totalUpvotesReceived: number;
  acceptedAnswers: number;
  reputation: number;
}

interface ActivityQuestion {
  type: "question";
  id: string;
  title: string;
  slug: string;
  upvotes: number;
  created_at: string;
}

interface ActivityAnswer {
  type: "answer";
  id: string;
  question_id: string;
  upvotes: number;
  is_accepted: boolean;
  created_at: string;
}

type Activity = ActivityQuestion | ActivityAnswer;

interface RawQuestion {
  id: string;
  title: string;
  slug: string;
  body?: string;
  upvotes: number;
  answer_count?: number;
  is_resolved: boolean;
  created_at: string;
  tags?: string[];
}

interface RawAnswer {
  id: string;
  question_id: string;
  body?: string;
  upvotes: number;
  is_accepted: boolean;
  created_at: string;
  community_questions?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

// Badge config
const BADGE_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; description: string }
> = {
  "New Member": {
    icon: <Users className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-700",
    description: "Just joined the community",
  },
  Newcomer: {
    icon: <Users className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-700",
    description: "Getting started",
  },
  Helper: {
    icon: <Star className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-700",
    description: "Consistently helpful answers",
  },
  Contributor: {
    icon: <Flame className="h-4 w-4" />,
    color: "bg-amber-100 text-amber-700",
    description: "Active contributor to the community",
  },
  Expert: {
    icon: <Award className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-700",
    description: "Recognized local expert",
  },
  "Community Leader": {
    icon: <Shield className="h-4 w-4" />,
    color: "bg-primary-100 text-primary-700",
    description: "Trusted community leader",
  },
  "First Solution": {
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-green-100 text-green-700",
    description: "First accepted answer",
  },
  "Problem Solver": {
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-green-100 text-green-700",
    description: "10+ accepted answers",
  },
  "Solution Provider": {
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-green-100 text-green-700",
    description: "50+ accepted answers",
  },
  "Active Answerer": {
    icon: <MessageCircle className="h-4 w-4" />,
    color: "bg-indigo-100 text-indigo-700",
    description: "25+ answers posted",
  },
  "Prolific Answerer": {
    icon: <MessageCircle className="h-4 w-4" />,
    color: "bg-indigo-100 text-indigo-700",
    description: "100+ answers posted",
  },
};

function reputationLabel(rep: number) {
  if (rep >= 1000) return "Expert";
  if (rep >= 500) return "Contributor";
  if (rep >= 100) return "Helper";
  if (rep >= 10) return "Newcomer";
  return "New Member";
}

type Tab = "questions" | "answers";

export default function CommunityUserPage() {
  const params = useParams();
  const userId =
    typeof params.userId === "string" ? params.userId : (params.userId as string[])[0];

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [questions, setQuestions] = useState<RawQuestion[]>([]);
  const [answers, setAnswers] = useState<RawAnswer[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [tab, setTab] = useState<Tab>("questions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/community/user/${userId}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError("User not found.");
          } else {
            throw new Error("API error");
          }
          return;
        }

        const data = await res.json();

        setProfile(data.profile);
        setStats(data.stats);
        setBadges(data.badges || []);
        setActivity(data.recentActivity || []);

        // The detailed lists come from a second fetch if needed;
        // the main route returns summary data. We'll fetch lists separately.
        await fetchUserContent();
      } catch {
        setError("Failed to load user profile. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    async function fetchUserContent() {
      try {
        // Fetch questions
        const qRes = await fetch(
          `/api/community?author=${userId}&limit=50&sort=newest`
        );
        if (qRes.ok) {
          const qData = await qRes.json();
          if (qData.questions) setQuestions(qData.questions);
        }
      } catch {
        // Non-critical — swallow
      }
    }

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) {
    return (
      <div className="container-main py-12">
        <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !profile || !stats) {
    return (
      <div className="container-main py-20 text-center">
        <User className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-900">{error || "User not found"}</h1>
        <p className="mt-2 text-sm text-gray-500">
          This user profile may not exist or may have been removed.
        </p>
        <Link href="/community" className="btn-primary mt-6 inline-block">
          Back to Community
        </Link>
      </div>
    );
  }

  const memberSinceYear = new Date(profile.memberSince).getFullYear();
  const repLabel = reputationLabel(stats.reputation);

  // Map questions for QuestionCard
  const questionCards: QuestionData[] = questions.map((q) => ({
    id: q.id,
    title: q.title,
    body: q.body || "",
    slug: q.slug,
    authorName: profile.name,
    tags: q.tags || [],
    upvotes: q.upvotes,
    answerCount: q.answer_count || 0,
    isResolved: q.is_resolved,
    createdAt: q.created_at,
  }));

  return (
    <div className="container-main py-10 pb-16">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Community
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Profile card */}
        <div className="lg:col-span-1 space-y-5">
          {/* Profile */}
          <div className="card p-6 text-center">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="mx-auto h-20 w-20 rounded-full object-cover border-4 border-primary-100"
              />
            ) : (
              <div className="mx-auto h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center border-4 border-primary-200">
                <User className="h-10 w-10 text-primary-500" aria-hidden="true" />
              </div>
            )}
            <h1 className="mt-3 text-xl font-bold text-gray-900">{profile.name}</h1>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              {stats.reputation} rep · {repLabel}
            </div>
            <p className="mt-2 text-xs text-gray-400">Member since {memberSinceYear}</p>
          </div>

          {/* Stats */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Stats
            </h2>
            <ul className="space-y-2.5">
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <HelpCircle className="h-4 w-4 text-primary-500" />
                  Questions asked
                </span>
                <strong className="text-gray-900">{stats.totalQuestions}</strong>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  Answers given
                </span>
                <strong className="text-gray-900">{stats.totalAnswers}</strong>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Accepted answers
                </span>
                <strong className="text-gray-900">{stats.acceptedAnswers}</strong>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <ThumbsUp className="h-4 w-4 text-amber-500" />
                  Total upvotes
                </span>
                <strong className="text-gray-900">{stats.totalUpvotesReceived}</strong>
              </li>
            </ul>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-1">
                <Award className="h-4 w-4 text-amber-500" />
                Badges Earned
              </h2>
              <div className="space-y-2">
                {badges.map((badge) => {
                  const config = BADGE_CONFIG[badge];
                  return (
                    <div
                      key={badge}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium mr-2 mb-1 ${
                        config ? config.color : "bg-gray-100 text-gray-700"
                      }`}
                      title={config?.description}
                    >
                      {config?.icon}
                      {badge}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Tab content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 mb-6">
            {(["questions", "answers"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === t
                    ? "border-primary-600 text-primary-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "questions"
                  ? `Questions (${stats.totalQuestions})`
                  : `Answers (${stats.totalAnswers})`}
              </button>
            ))}
          </div>

          {/* Questions Tab */}
          {tab === "questions" && (
            <div>
              {questionCards.length > 0 ? (
                <div className="space-y-4">
                  {questionCards.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-gray-200 p-10 text-center">
                  <HelpCircle className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No questions yet</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {profile.name} hasn&apos;t asked any questions yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Answers Tab */}
          {tab === "answers" && (
            <div>
              {answers.length > 0 ? (
                <div className="space-y-4">
                  {answers.map((a) => {
                    const linkedQuestion = a.community_questions;
                    return (
                      <div
                        key={a.id}
                        className={`card p-5 ${
                          a.is_accepted
                            ? "border-green-200 bg-green-50/30"
                            : ""
                        }`}
                      >
                        {a.is_accepted && (
                          <div className="flex items-center gap-1 text-xs font-semibold text-green-700 mb-2">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Accepted Answer
                          </div>
                        )}
                        {linkedQuestion && (
                          <Link
                            href={`/community/${linkedQuestion.slug}`}
                            className="text-sm font-semibold text-primary-700 hover:underline block mb-2"
                          >
                            Re: {linkedQuestion.title}
                          </Link>
                        )}
                        {a.body && (
                          <p className="text-sm text-gray-700 line-clamp-3">{a.body}</p>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {a.upvotes} upvotes
                          </span>
                          <span>
                            {new Date(a.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-gray-200 p-10 text-center">
                  <MessageCircle className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No answers yet</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {profile.name} hasn&apos;t answered any questions yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recent Activity Feed */}
          {activity.length > 0 && tab === "questions" && (
            <div className="mt-8">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                Recent Activity
              </h2>
              <ul className="space-y-2">
                {activity.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span
                      className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                        item.type === "question"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.type === "question" ? "Q" : "A"}
                    </span>
                    <div className="flex-1 min-w-0">
                      {item.type === "question" ? (
                        <Link
                          href={`/community/${item.slug}`}
                          className="text-gray-700 hover:text-primary-600 line-clamp-1"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <Link
                          href={`/community/${item.question_id}`}
                          className="text-gray-700 hover:text-primary-600 line-clamp-1"
                        >
                          Answered a question
                          {item.is_accepted && (
                            <span className="ml-1.5 text-green-600 text-xs">(Accepted)</span>
                          )}
                        </Link>
                      )}
                      <span className="block text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <span className="shrink-0 flex items-center gap-1 text-xs text-gray-400">
                      <ThumbsUp className="h-3 w-3" />
                      {item.upvotes}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
