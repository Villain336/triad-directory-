"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Tag,
  DollarSign,
  Clock,
  Calendar,
  MessageSquare,
  Send,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import BidCard, { Bid } from "@/components/quotes/BidCard";

interface QuoteDetail {
  id: string;
  title: string;
  description: string;
  category_slug: string;
  city_slug: string;
  budget_range: string | null;
  timeline: string | null;
  status: string;
  created_at: string;
  customer_name: string;
}

const budgetLabels: Record<string, string> = {
  "under-500": "Under $500",
  "500-1000": "$500 – $1,000",
  "1000-5000": "$1,000 – $5,000",
  "5000-10000": "$5,000 – $10,000",
  "10000-plus": "$10,000+",
};

const timelineLabels: Record<string, string> = {
  asap: "ASAP",
  "this-week": "This Week",
  "this-month": "This Month",
  flexible: "Flexible",
};

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";

export default function QuoteDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Bid form
  const [bidLoading, setBidLoading] = useState(false);
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [bidError, setBidError] = useState("");

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Fetch quote request details
      const quotesRes = await fetch(`/api/quotes?status=`);
      const quotesJson = await quotesRes.json();
      const allQuotes: QuoteDetail[] = quotesJson.data ?? [];
      const found = allQuotes.find((q) => q.id === id);
      if (!found) {
        setNotFound(true);
        return;
      }
      setQuote(found);

      // Fetch bids
      const bidsRes = await fetch(`/api/quotes/${id}/bids`);
      const bidsJson = await bidsRes.json();
      setBids(bidsJson.data ?? []);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleBidSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBidLoading(true);
    setBidError("");

    const fd = new FormData(e.currentTarget);
    const body = {
      business_name: fd.get("business_name"),
      amount: parseFloat(fd.get("amount") as string),
      message: fd.get("message"),
      estimated_timeline: fd.get("estimated_timeline") || undefined,
    };

    try {
      const res = await fetch(`/api/quotes/${id}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to submit bid");
      }
      setBidSubmitted(true);
      // Refresh bids list
      const bidsRes = await fetch(`/api/quotes/${id}/bids`);
      const bidsJson = await bidsRes.json();
      setBids(bidsJson.data ?? []);
    } catch (err) {
      setBidError(err instanceof Error ? err.message : "Failed to submit bid");
    } finally {
      setBidLoading(false);
    }
  }

  async function handleAcceptBid(bidId: string) {
    // In a full implementation this would call a PATCH endpoint.
    // For now we optimistically update the UI.
    setBids((prev) =>
      prev.map((b) =>
        b.id === bidId ? { ...b, status: "accepted" } : { ...b, status: "pending" }
      )
    );
  }

  if (loading) {
    return (
      <div className="container-main py-20 text-center text-gray-500">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary-400 mb-3" />
        Loading quote details...
      </div>
    );
  }

  if (notFound || !quote) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-lg font-semibold text-gray-700">Quote request not found.</p>
        <Link href="/quotes" className="mt-4 inline-block btn-secondary">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      {/* Back link */}
      <Link
        href="/quotes"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ── Left column: quote details + bids ─────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote card */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1 className="text-xl font-bold text-gray-900 leading-snug flex-1">
                {quote.title}
              </h1>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  quote.status === "open"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {quote.status === "open" ? "Open" : quote.status}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                <Tag className="h-3 w-3" />
                {formatSlug(quote.category_slug)}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-beige-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                <MapPin className="h-3 w-3" />
                {formatSlug(quote.city_slug)}, NC
              </span>
              {quote.budget_range && (
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  <DollarSign className="h-3 w-3" />
                  {budgetLabels[quote.budget_range] ?? quote.budget_range}
                </span>
              )}
              {quote.timeline && (
                <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  <Clock className="h-3 w-3" />
                  {timelineLabels[quote.timeline] ?? quote.timeline}
                </span>
              )}
            </div>

            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {quote.description}
            </p>

            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Posted {formatDate(quote.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {bids.length} {bids.length === 1 ? "bid" : "bids"} received
              </span>
            </div>
          </div>

          {/* Bids */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {bids.length === 0
                ? "No bids yet"
                : `${bids.length} ${bids.length === 1 ? "Bid" : "Bids"} Received`}
            </h2>
            {bids.length === 0 ? (
              <div className="card p-8 text-center text-gray-500">
                <MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm">
                  No bids yet. Be the first to submit a bid!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <BidCard
                    key={bid.id}
                    bid={bid}
                    showAccept={quote.status === "open"}
                    onAccept={handleAcceptBid}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: bid form ──────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            {quote.status !== "open" ? (
              <div className="card p-6 text-center text-gray-500">
                <CheckCircle className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p className="font-medium text-gray-700">
                  This job is no longer accepting bids.
                </p>
              </div>
            ) : bidSubmitted ? (
              <div className="card p-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-bold text-gray-900">Bid Submitted!</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Your bid has been sent to the customer. Good luck!
                </p>
              </div>
            ) : (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Submit Your Bid
                </h3>
                <p className="text-sm text-gray-600 mb-5">
                  Stand out with a compelling pitch and competitive price.
                </p>

                <form onSubmit={handleBidSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business name *
                    </label>
                    <input
                      type="text"
                      name="business_name"
                      required
                      placeholder="Your business name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bid amount ($) *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      required
                      min="1"
                      step="0.01"
                      placeholder="e.g., 850"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Estimated timeline
                    </label>
                    <input
                      type="text"
                      name="estimated_timeline"
                      placeholder="e.g., 2–3 days, 1 week"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Your pitch *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell the customer why you're the best fit — your experience, approach, and what's included in your price."
                      className={inputClass}
                    />
                  </div>

                  {bidError && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
                      {bidError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={bidLoading}
                    className="btn-primary w-full gap-2 !py-3"
                  >
                    <Send className="h-4 w-4" />
                    {bidLoading ? "Submitting..." : "Submit Bid"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
