"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Send, CheckCircle, ArrowLeft, HelpCircle, Lightbulb } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { categories } from "@/lib/data/categories";
import { cities } from "@/lib/data/cities";

const MIN_BODY_CHARS = 30;
const MAX_TAGS = 5;

export default function AskQuestionPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        setCurrentUser({
          id: user.id,
          name: profile?.full_name ?? user.email?.split("@")[0] ?? "",
          email: user.email ?? "",
        });
      }
      setAuthLoading(false);
    });
  }, []);

  function addTag() {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !tags.includes(tag) && tags.length < MAX_TAGS) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (body.trim().length < MIN_BODY_CHARS) {
      setError(`Please add at least ${MIN_BODY_CHARS} characters to the details field.`);
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      // Get auth session token if available
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const payload: Record<string, unknown> = {
        type: "question",
        title: formData.get("title"),
        body,
        citySlug: formData.get("citySlug") || undefined,
        categorySlug: formData.get("categorySlug") || undefined,
        tags,
      };

      // If not logged in, include author info from form fields
      if (!currentUser) {
        payload.authorName = formData.get("authorName");
        payload.authorEmail = formData.get("authorEmail");
      }

      const res = await fetch("/api/community", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.slug) {
        router.push(`/community/${data.slug}`);
      } else if (data.success) {
        router.push("/community");
      } else {
        setError(data.error || "Failed to submit question. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="container-main py-20 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-100 rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-10">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to Community
      </Link>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary-600" aria-hidden="true" />
            Ask the Triad Community
          </h1>
          <p className="mt-1 text-gray-600">
            Get answers from local pros, business owners, and neighbors.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 card p-6 space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Question Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                maxLength={150}
                placeholder="e.g., Best time to seal a driveway in the Triad?"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                Be specific — clear questions get better answers
              </p>
            </div>

            {/* Body */}
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                Details *
              </label>
              <textarea
                id="body"
                name="body"
                required
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Include relevant details: your city, what you've already tried, your budget, timeline, etc."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                <span
                  className={
                    body.length < MIN_BODY_CHARS ? "text-amber-600" : "text-green-600"
                  }
                >
                  {body.length < MIN_BODY_CHARS
                    ? `${MIN_BODY_CHARS - body.length} more characters needed`
                    : "Looks good!"}
                </span>
                <span className="text-gray-400">{body.length} / min {MIN_BODY_CHARS}</span>
              </div>
            </div>

            {/* City + Category */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="citySlug" className="block text-sm font-medium text-gray-700">
                  City (optional)
                </label>
                <select
                  id="citySlug"
                  name="citySlug"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Select a city...</option>
                  {cities.map((city) => (
                    <option key={city.slug} value={city.slug}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="categorySlug" className="block text-sm font-medium text-gray-700">
                  Category (optional)
                </label>
                <select
                  id="categorySlug"
                  name="categorySlug"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags (up to {MAX_TAGS})
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  disabled={tags.length >= MAX_TAGS}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={tags.length >= MAX_TAGS}
                  className="btn-secondary !py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-beige-100 px-3 py-1 text-xs text-beige-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-beige-500 hover:text-red-500"
                        aria-label={`Remove tag ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-400">
                {tags.length}/{MAX_TAGS} tags added
              </p>
            </div>

            {/* Author Info — only shown when NOT logged in */}
            {!currentUser && (
              <div className="border-t border-gray-200 pt-5">
                <p className="text-sm font-medium text-gray-700 mb-1">Your Info</p>
                <p className="text-xs text-gray-500 mb-3">
                  <Link href="/auth/login?redirect=/community/ask" className="text-primary-600 hover:underline">
                    Sign in
                  </Link>{" "}
                  to post with your profile, or continue as a guest below.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="authorName" className="block text-xs font-medium text-gray-600">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      id="authorName"
                      name="authorName"
                      required
                      placeholder="TriadResident123"
                      autoComplete="name"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="authorEmail" className="block text-xs font-medium text-gray-600">
                      Email * (not displayed)
                    </label>
                    <input
                      type="email"
                      id="authorEmail"
                      name="authorEmail"
                      required
                      placeholder="your@email.com"
                      autoComplete="email"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Logged-in user preview */}
            {currentUser && (
              <div className="border-t border-gray-200 pt-5">
                <p className="text-sm text-gray-600">
                  Posting as{" "}
                  <strong className="text-gray-900">{currentUser.name}</strong>{" "}
                  <span className="text-gray-400">({currentUser.email})</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full gap-2 disabled:opacity-60"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {loading ? "Submitting..." : "Post Your Question"}
            </button>
          </form>
        </div>

        {/* Tips Sidebar */}
        <aside className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" />
              Tips for a Great Question
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-bold text-primary-600 shrink-0">1.</span>
                <span>
                  <strong>Be specific</strong> — &quot;Best plumber in Greensboro for tankless water
                  heater install?&quot; beats &quot;Need a plumber&quot;
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600 shrink-0">2.</span>
                <span>
                  <strong>Include your city</strong> — Triad answers vary by location, permits, and
                  regulations
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600 shrink-0">3.</span>
                <span>
                  <strong>Share context</strong> — budget, home age, timeline, what you&apos;ve
                  already tried
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600 shrink-0">4.</span>
                <span>
                  <strong>One topic per question</strong> — separate questions get better answers
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600 shrink-0">5.</span>
                <span>
                  <strong>Add tags</strong> — helps local pros find and answer your question
                </span>
              </li>
            </ul>
          </div>

          {!currentUser && (
            <div className="card p-5 bg-primary-50 border-primary-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary-600" aria-hidden="true" />
                Sign in for full access
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Track your questions, get notified of answers, and build your community reputation.
              </p>
              <Link
                href="/auth/login?redirect=/community/ask"
                className="btn-primary w-full mt-3 text-sm"
              >
                Sign In
              </Link>
            </div>
          )}

          <div className="card p-5">
            <h3 className="font-semibold text-gray-900">Are You a Business Owner?</h3>
            <p className="mt-1 text-sm text-gray-500">
              Premium listed businesses get a &quot;Business Owner&quot; badge on their answers,
              plus a link to their listing.
            </p>
            <Link href="/claim-listing" className="btn-primary w-full mt-3 text-sm">
              Claim Your Listing
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
