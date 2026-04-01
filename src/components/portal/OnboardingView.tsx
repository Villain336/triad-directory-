"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Shield,
  ArrowRight,
  CheckCircle,
  Building,
  Loader2,
  MapPin,
  Star,
} from "lucide-react";

interface Business {
  id: string;
  name: string;
  slug: string;
  city_name?: string;
  rating?: number;
  review_count?: number;
  category_name?: string;
}

interface OnboardingViewProps {
  userName: string;
  userId: string;
}

export default function OnboardingView({ userName, userId }: OnboardingViewProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Business[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearched(false);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
      setSearched(true);
    }
  }

  async function handleClaim(businessId: string) {
    setClaiming(businessId);
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, userId }),
      });
      if (res.ok) {
        setClaimed(true);
        // Reload the page to show the full portal
        window.location.reload();
      }
    } catch {
      setClaiming(null);
    }
  }

  if (claimed) {
    return (
      <div className="container-main py-16 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Business Claimed!</h1>
        <p className="mt-2 text-gray-600">Loading your portal...</p>
      </div>
    );
  }

  return (
    <div className="container-main py-12">
      {/* Welcome */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <Shield className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}!
        </h1>
        <p className="mt-2 text-gray-600">
          Your account is set up. Now let&apos;s connect it to your business listing.
        </p>
      </div>

      {/* Steps */}
      <div className="mx-auto mt-8 max-w-lg">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
              <CheckCircle className="h-4 w-4" />
            </span>
            <span className="text-green-700 font-medium">Account created</span>
          </div>
          <div className="h-px w-8 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-bold">2</span>
            <span className="text-primary-700 font-medium">Claim business</span>
          </div>
          <div className="h-px w-8 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-xs font-bold">3</span>
            <span className="text-gray-400">Manage listing</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-lg space-y-6">
        {/* Search */}
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Search className="h-5 w-5 text-primary-600" />
            Find Your Business
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Search our directory to claim your existing listing.
          </p>
          <form onSubmit={handleSearch} className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by business name..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button type="submit" disabled={searching} className="btn-primary shrink-0 gap-2">
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </button>
          </form>

          {/* Results */}
          {searching && (
            <div className="mt-4 text-center py-4">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary-500" />
              <p className="mt-2 text-sm text-gray-500">Searching...</p>
            </div>
          )}

          {searched && !searching && results.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">{results.length} businesses found:</p>
              {results.map((biz) => (
                <div key={biz.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{biz.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {biz.city_name && (
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          {biz.city_name}
                        </span>
                      )}
                      {biz.rating && (
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {biz.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleClaim(biz.id)}
                    disabled={claiming === biz.id}
                    className="shrink-0 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-60"
                  >
                    {claiming === biz.id ? "Claiming..." : "Claim"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {searched && !searching && results.length === 0 && (
            <div className="mt-4 rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
              <Building className="mx-auto h-6 w-6 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">
                No businesses found for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                You can add your business as a new listing below.
              </p>
            </div>
          )}
        </div>

        {/* Add new business */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-600" />
            Not in the Directory Yet?
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your business to NC Service Businesses for free.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Link href="/request-service" className="btn-primary text-sm flex-1 text-center gap-1.5">
              Add Your Business <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className="btn-secondary text-sm flex-1 text-center gap-1.5">
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
