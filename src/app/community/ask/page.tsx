"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle, ArrowLeft, HelpCircle, Lightbulb } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { cities } from "@/lib/data/cities";

export default function AskQuestionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  function addTag() {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "question",
          title: formData.get("title"),
          body: formData.get("body"),
          authorName: formData.get("authorName"),
          authorEmail: formData.get("authorEmail"),
          citySlug: formData.get("citySlug") || undefined,
          categorySlug: formData.get("categorySlug") || undefined,
          tags,
        }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
    } catch {
      // Handle silently
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container-main py-20 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Question Submitted!</h1>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          Your question is being reviewed and will appear in the community shortly.
          You&apos;ll receive an email when answers come in.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/community" className="btn-primary">
            Back to Community
          </Link>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
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
        <ArrowLeft className="h-3.5 w-3.5" />
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
              <p className="mt-1 text-xs text-gray-400">Be specific — clear questions get better answers</p>
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
                placeholder="Include relevant details: your city, what you've already tried, your budget, timeline, etc."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
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
                    <option key={city.slug} value={city.slug}>{city.name}</option>
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
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags (up to 5)
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
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-secondary !py-2 text-sm"
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
            </div>

            {/* Author Info */}
            <div className="border-t border-gray-200 pt-5">
              <p className="text-sm font-medium text-gray-700 mb-3">Your Info</p>
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

            <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
              <Send className="h-4 w-4" />
              {loading ? "Submitting..." : "Post Your Question"}
            </button>
          </form>
        </div>

        {/* Tips Sidebar */}
        <aside className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent-500" aria-hidden="true" />
              Tips for a Great Question
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-bold text-primary-600 shrink-0">1.</span>
                <span><strong>Be specific</strong> — &quot;Best plumber in Greensboro for tankless water heater install?&quot; beats &quot;Need a plumber&quot;</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600 shrink-0">2.</span>
                <span><strong>Include your city</strong> — Triad answers vary by location, permits, and regulations</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600 shrink-0">3.</span>
                <span><strong>Share context</strong> — budget, home age, timeline, what you&apos;ve already tried</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600 shrink-0">4.</span>
                <span><strong>One topic per question</strong> — separate questions get better answers</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600 shrink-0">5.</span>
                <span><strong>Add tags</strong> — helps local pros find and answer your question</span>
              </li>
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-900">Are You a Business Owner?</h3>
            <p className="mt-1 text-sm text-gray-500">
              Premium listed businesses get a &quot;Business Owner&quot; badge on their answers, plus a link to their listing.
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
