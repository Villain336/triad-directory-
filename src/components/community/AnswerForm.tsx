"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Send, CheckCircle, Building, LogIn, ChevronDown, User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";

interface AnswerFormProps {
  questionId: string;
  questionTitle: string;
  onAnswerPosted?: (answer: {
    id: string;
    authorName: string;
    body: string;
    isBusinessOwner: boolean;
    businessName?: string;
    upvotes: number;
    isAccepted: boolean;
    createdAt: string;
  }) => void;
}

type AuthState = "loading" | "loggedIn" | "anonymous";

export default function AnswerForm({ questionId, onAnswerPosted }: AnswerFormProps) {
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userBusiness, setUserBusiness] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [body, setBody] = useState("");
  const MIN_CHARS = 30;

  // Anonymous mode toggle
  const [showAnonymousForm, setShowAnonymousForm] = useState(false);
  const [anonName, setAnonName] = useState("");
  const [anonEmail, setAnonEmail] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setAuthState("anonymous");
        return;
      }

      setUserId(user.id);

      // Fetch profile
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      setUserName(profile?.full_name || user.email?.split("@")[0] || "Community Member");
      setUserAvatar(profile?.avatar_url || null);

      // Check if user owns a business
      const { data: org } = await supabase
        .from("organizations")
        .select("name")
        .eq("owner_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (org?.name) setUserBusiness(org.name);

      setAuthState("loggedIn");
    }

    checkAuth();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (body.trim().length < MIN_CHARS) return;

    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        type: "answer",
        questionId,
        body: body.trim(),
        isBusinessOwner: !!userBusiness,
        businessName: userBusiness || undefined,
      };

      if (authState === "anonymous") {
        payload.authorName = anonName.trim();
        payload.authorEmail = anonEmail.trim();
      }

      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to post answer. Please try again.");
        return;
      }

      setSubmitted(true);

      if (onAnswerPosted && data.id) {
        onAnswerPosted({
          id: data.id,
          authorName: authState === "loggedIn" ? userName : anonName,
          body: body.trim(),
          isBusinessOwner: !!userBusiness,
          businessName: userBusiness || undefined,
          upvotes: 0,
          isAccepted: false,
          createdAt: new Date().toISOString(),
        });
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card p-6 text-center bg-green-50 border-green-200">
        <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
        <h3 className="mt-3 text-lg font-semibold text-gray-900">Answer Submitted!</h3>
        <p className="mt-1 text-sm text-gray-600">
          {authState === "loggedIn"
            ? "Your answer is now live. Thank you for helping the Triad community!"
            : "Your answer will appear after a quick review. Thank you!"}
        </p>
      </div>
    );
  }

  // Loading state
  if (authState === "loading") {
    return (
      <div className="card p-6">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-32 w-full bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  // Not logged in: show sign-in prompt + optional anonymous form
  if (authState === "anonymous") {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900">Your Answer</h3>
        <p className="mt-1 text-sm text-gray-500">Share your knowledge — help a Triad neighbor out.</p>

        <div className="mt-5 rounded-xl border-2 border-dashed border-primary-200 bg-primary-50 p-5 text-center">
          <LogIn className="mx-auto h-8 w-8 text-primary-500 mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-900">Sign in to answer this question</p>
          <p className="mt-1 text-xs text-gray-500">Your answer posts instantly and earns you reputation.</p>
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
            className="btn-primary mt-4 inline-flex items-center gap-2 text-sm"
          >
            <LogIn className="h-4 w-4" />
            Sign In to Answer
          </Link>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowAnonymousForm(!showAnonymousForm)}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
          >
            or answer anonymously
            <ChevronDown className={`h-3 w-3 transition-transform ${showAnonymousForm ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showAnonymousForm && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <textarea
                ref={textareaRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={5}
                placeholder="Write your answer... Include specific details, personal experience, or professional expertise."
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className={body.length < MIN_CHARS ? "text-amber-600" : "text-gray-400"}>
                  {body.length < MIN_CHARS
                    ? `${MIN_CHARS - body.length} more characters needed`
                    : `${body.length} characters`}
                </span>
                <span className="text-gray-400">{body.length}/2000</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="anonName" className="block text-xs font-medium text-gray-600">
                  Display Name *
                </label>
                <input
                  type="text"
                  id="anonName"
                  value={anonName}
                  onChange={(e) => setAnonName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Your name or username"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="anonEmail" className="block text-xs font-medium text-gray-600">
                  Email * (not displayed)
                </label>
                <input
                  type="email"
                  id="anonEmail"
                  value={anonEmail}
                  onChange={(e) => setAnonEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 rounded-lg bg-red-50 px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || body.trim().length < MIN_CHARS}
              className="btn-primary w-full gap-2 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {loading ? "Submitting..." : "Post Answer (Pending Review)"}
            </button>
          </form>
        )}
      </div>
    );
  }

  // Logged in
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900">Your Answer</h3>
      <p className="mt-1 text-sm text-gray-500">Share your knowledge — help a Triad neighbor out.</p>

      {/* User identity display */}
      <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
        {userAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={userAvatar}
            alt={userName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="h-4 w-4 text-primary-600" aria-hidden="true" />
          </div>
        )}
        <div>
          <span className="text-sm font-medium text-gray-900">Answering as {userName}</span>
          {userBusiness && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
              <Building className="h-3 w-3" aria-hidden="true" />
              {userBusiness}
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={5}
            placeholder="Write your answer... Include specific details, personal experience, or professional expertise."
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className={body.length < MIN_CHARS ? "text-amber-600" : "text-green-600"}>
              {body.length < MIN_CHARS
                ? `${MIN_CHARS - body.length} more characters needed`
                : `Minimum length met`}
            </span>
            <span className="text-gray-400">{body.length}/2000</span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 rounded-lg bg-red-50 px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || body.trim().length < MIN_CHARS}
          className="btn-primary w-full gap-2 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {loading ? "Submitting..." : "Post Your Answer"}
        </button>
      </form>
    </div>
  );
}
