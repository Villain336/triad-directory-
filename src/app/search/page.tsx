import { Metadata } from "next";
import { Search as SearchIcon } from "lucide-react";
import { searchListings, getListings } from "@/lib/data/index";
import { generatePageMetadata } from "@/lib/seo/metadata";
import ListingGrid from "@/components/listings/ListingGrid";
import AdSlot from "@/components/ads/AdSlot";

interface SearchPageProps {
  searchParams: { q?: string };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = searchParams.q || "";
  return generatePageMetadata({
    title: query ? `Search Results for "${query}"` : "Search Businesses",
    description: `Search for local businesses and services across North Carolina. ${
      query ? `Results for "${query}".` : "Find plumbers, electricians, HVAC, and more."
    }`,
    path: `/search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    noIndex: true,
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const results = query ? await searchListings(query) : await getListings({ limit: 20 });

  return (
    <div className="container-main py-10">
      <div className="mb-8">
        <form action="/search" method="GET" className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search businesses, services, or categories..."
            className="w-full rounded-xl border border-gray-300 py-4 pl-12 pr-4 text-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </form>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">
        {query ? (
          <>
            Search Results for &quot;{query}&quot;{" "}
            <span className="text-lg font-normal text-gray-500">
              ({results.length} found)
            </span>
          </>
        ) : (
          "All Businesses"
        )}
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ListingGrid listings={results} showCity />
        </div>
        <aside className="space-y-6">
          <AdSlot position="sidebar" />
          <AdSlot position="sidebar" />
        </aside>
      </div>
    </div>
  );
}
