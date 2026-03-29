"use client";

import { useState, useMemo } from "react";
import { Filter, X, Star, CheckCircle } from "lucide-react";
import { cities } from "@/lib/data/cities";
import { categories } from "@/lib/data/categories";

interface SearchFiltersProps {
  onFilter: (filters: FilterState) => void;
  initialCity?: string;
  initialCategory?: string;
}

export interface FilterState {
  city: string;
  category: string;
  minRating: number;
  verifiedOnly: boolean;
  premiumOnly: boolean;
}

export default function SearchFilters({
  onFilter,
  initialCity = "",
  initialCategory = "",
}: SearchFiltersProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    city: initialCity,
    category: initialCategory,
    minRating: 0,
    verifiedOnly: false,
    premiumOnly: false,
  });

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.city) count++;
    if (filters.category) count++;
    if (filters.minRating > 0) count++;
    if (filters.verifiedOnly) count++;
    if (filters.premiumOnly) count++;
    return count;
  }, [filters]);

  function updateFilter(key: keyof FilterState, value: string | number | boolean) {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  }

  function clearAll() {
    const cleared: FilterState = {
      city: "",
      category: "",
      minRating: 0,
      verifiedOnly: false,
      premiumOnly: false,
    };
    setFilters(cleared);
    onFilter(cleared);
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(!open)}
          className="btn-secondary gap-2 text-sm"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" /> Clear all
          </button>
        )}

        {/* Quick filter chips */}
        <div className="hidden sm:flex gap-2">
          {[4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => updateFilter("minRating", filters.minRating === rating ? 0 : rating)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                filters.minRating === rating
                  ? "border-accent-400 bg-accent-50 text-accent-800"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <Star className="h-3 w-3 fill-accent-400 text-accent-400" aria-hidden="true" />
              {rating}+
            </button>
          ))}
          <button
            onClick={() => updateFilter("verifiedOnly", !filters.verifiedOnly)}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              filters.verifiedOnly
                ? "border-green-400 bg-green-50 text-green-800"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <CheckCircle className="h-3 w-3" aria-hidden="true" />
            Verified
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {open && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
              <select
                value={filters.city}
                onChange={(e) => updateFilter("city", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city.slug} value={city.slug}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Minimum Rating
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => updateFilter("minRating", Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={3.5}>3.5+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 pt-5">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => updateFilter("verifiedOnly", e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Verified Only
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.premiumOnly}
                  onChange={(e) => updateFilter("premiumOnly", e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Premium Only
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
