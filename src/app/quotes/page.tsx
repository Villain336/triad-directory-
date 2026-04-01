"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Send,
  CheckCircle,
  Briefcase,
  Filter,
  RefreshCw,
} from "lucide-react";
import { categories } from "@/lib/data/categories";
import { cities } from "@/lib/data/cities";
import QuoteCard, { QuoteRequest } from "@/components/quotes/QuoteCard";

const budgetOptions = [
  { value: "under-500", label: "Under $500" },
  { value: "500-1000", label: "$500 – $1,000" },
  { value: "1000-5000", label: "$1,000 – $5,000" },
  { value: "5000-10000", label: "$5,000 – $10,000" },
  { value: "10000-plus", label: "$10,000+" },
];

const timelineOptions = [
  { value: "asap", label: "ASAP" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "flexible", label: "Flexible" },
];

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState<"request" | "browse">("request");

  // ── Request form state ──────────────────────────────────────────────────────
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleRequestSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const fd = new FormData(e.currentTarget);
    const body = {
      customer_name: fd.get("customer_name"),
      customer_email: fd.get("customer_email"),
      customer_phone: fd.get("customer_phone"),
      category_slug: fd.get("category_slug"),
      city_slug: fd.get("city_slug"),
      title: fd.get("title"),
      description: fd.get("description"),
      budget_range: fd.get("budget_range") || undefined,
      timeline: fd.get("timeline") || undefined,
    };

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Something went wrong");
      }
      setFormSubmitted(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  }

  // ── Browse / filter state ───────────────────────────────────────────────────
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const fetchQuotes = useCallback(async () => {
    setBrowseLoading(true);
    try {
      const params = new URLSearchParams({ status: "open" });
      if (filterCategory) params.set("category", filterCategory);
      if (filterCity) params.set("city", filterCity);
      const res = await fetch(`/api/quotes?${params}`);
      const json = await res.json();
      setQuotes(json.data ?? []);
    } catch {
      // silently fail
    } finally {
      setBrowseLoading(false);
    }
  }, [filterCategory, filterCity]);

  useEffect(() => {
    if (activeTab === "browse") {
      fetchQuotes();
    }
  }, [activeTab, fetchQuotes]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="container-main py-12 sm:py-16 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Quote Marketplace
          </h1>
          <p className="mt-4 text-lg text-primary-200 max-w-2xl mx-auto">
            Post your project and get competitive bids from local pros — or
            browse open jobs and win new business.
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        {/* Tab Selector */}
        <div className="flex rounded-xl bg-beige-100 p-1 max-w-md mx-auto mb-10">
          <button
            onClick={() => setActiveTab("request")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
              activeTab === "request"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            I Need a Service
          </button>
          <button
            onClick={() => setActiveTab("browse")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
              activeTab === "browse"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Briefcase className="h-4 w-4" aria-hidden="true" />
            I&apos;m a Business
          </button>
        </div>

        {/* ── REQUEST TAB ─────────────────────────────────────────────────── */}
        {activeTab === "request" && (
          <div className="max-w-2xl mx-auto">
            {formSubmitted ? (
              <div className="text-center py-16">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Quote Request Posted!
                </h2>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  Local pros can now see your project and submit competitive
                  bids. You&apos;ll receive responses shortly.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setActiveTab("browse");
                  }}
                  className="mt-6 btn-secondary"
                >
                  Browse Open Jobs
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Post Your Project
                  </h2>
                  <p className="mt-1 text-gray-600">
                    Describe what you need and qualified local pros will submit
                    competitive bids.
                  </p>
                </div>

                <form
                  onSubmit={handleRequestSubmit}
                  className="card p-6 space-y-5"
                >
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Project title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="e.g., Replace kitchen faucet, Paint living room, Remove large oak tree"
                      className={inputClass}
                    />
                  </div>

                  {/* Category + City */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category *
                      </label>
                      <select name="category_slug" required className={inputClass}>
                        <option value="">Select a category...</option>
                        {categories.map((cat) => (
                          <option key={cat.slug} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Your city *
                      </label>
                      <select name="city_slug" required className={inputClass}>
                        <option value="">Select your city...</option>
                        <optgroup label="Piedmont Triad">
                          {cities
                            .filter((c) => c.region === "triad")
                            .map((city) => (
                              <option key={city.slug} value={city.slug}>
                                {city.name}
                              </option>
                            ))}
                        </optgroup>
                        <optgroup label="Research Triangle">
                          {cities
                            .filter((c) => c.region === "triangle")
                            .map((city) => (
                              <option key={city.slug} value={city.slug}>
                                {city.name}
                              </option>
                            ))}
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Detailed description *
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      placeholder="Describe the work in detail — scope, materials, any special requirements, access notes, etc."
                      className={inputClass}
                    />
                  </div>

                  {/* Budget + Timeline */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Budget range
                      </label>
                      <select name="budget_range" className={inputClass}>
                        <option value="">Not sure yet</option>
                        {budgetOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Timeline
                      </label>
                      <select name="timeline" className={inputClass}>
                        <option value="">Flexible</option>
                        {timelineOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="border-t border-gray-200 pt-5">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Your Contact Info
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        name="customer_name"
                        required
                        placeholder="Full name *"
                        autoComplete="name"
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                      <input
                        type="tel"
                        name="customer_phone"
                        placeholder="Phone number"
                        autoComplete="tel"
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <input
                      type="email"
                      name="customer_email"
                      required
                      placeholder="Email address *"
                      autoComplete="email"
                      className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>

                  {formError && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="btn-primary w-full gap-2 !py-3"
                  >
                    <Send className="h-4 w-4" />
                    {formLoading ? "Posting..." : "Post My Project — Get Bids"}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Free to post. Local pros will compete for your business.
                  </p>
                </form>
              </>
            )}
          </div>
        )}

        {/* ── BROWSE TAB ──────────────────────────────────────────────────── */}
        {activeTab === "browse" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Browse Open Jobs
              </h2>
              <p className="mt-1 text-gray-600">
                Find projects that match your skills and submit a competitive
                bid.
              </p>
            </div>

            {/* Filter bar */}
            <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
              <Filter className="h-4 w-4 text-gray-500 mt-1 shrink-0" />
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  City
                </label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">All cities</option>
                  <optgroup label="Piedmont Triad">
                    {cities
                      .filter((c) => c.region === "triad")
                      .map((city) => (
                        <option key={city.slug} value={city.slug}>
                          {city.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Research Triangle">
                    {cities
                      .filter((c) => c.region === "triangle")
                      .map((city) => (
                        <option key={city.slug} value={city.slug}>
                          {city.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
              <button
                onClick={fetchQuotes}
                className="btn-secondary !py-2 gap-1.5 text-sm shrink-0"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>

            {/* Results */}
            {browseLoading ? (
              <div className="py-16 text-center text-gray-500">
                <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary-400 mb-3" />
                Loading open jobs...
              </div>
            ) : quotes.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="font-medium text-gray-700">No open jobs found</p>
                <p className="text-sm mt-1">
                  Try adjusting your filters or check back soon.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quotes.map((quote) => (
                  <QuoteCard key={quote.id} quote={quote} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
