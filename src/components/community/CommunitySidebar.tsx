import Link from "next/link";
import { Tag, Users, Award, Building, TrendingUp } from "lucide-react";
import { getPopularTags, getTopContributors, getRecentQuestions } from "@/lib/data/community";
import AdSlot from "@/components/ads/AdSlot";

export default function CommunitySidebar() {
  const popularTags = getPopularTags().slice(0, 12);
  const topContributors = getTopContributors().slice(0, 5);
  const trendingQuestions = getRecentQuestions(3);

  return (
    <aside className="space-y-6">
      {/* Ask CTA */}
      <div className="card p-5 bg-primary-50 border-primary-200">
        <h3 className="font-semibold text-gray-900">Got a Question?</h3>
        <p className="mt-1 text-sm text-gray-600">
          Get free advice from local pros and neighbors.
        </p>
        <Link href="/community/ask" className="btn-primary w-full mt-3 text-sm">
          Ask a Question
        </Link>
      </div>

      {/* Popular Tags */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary-600" aria-hidden="true" />
          Popular Topics
        </h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {popularTags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/community/tag/${tag}`}
              className="inline-flex items-center gap-1 rounded-full bg-beige-100 px-3 py-1 text-xs text-beige-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              {tag}
              <span className="text-beige-500">({count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-600" aria-hidden="true" />
          Top Contributors
        </h3>
        <ul className="mt-3 space-y-2.5">
          {topContributors.map((contributor, i) => (
            <li key={contributor.name} className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-beige-100 text-xs font-bold text-beige-700">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate block">
                  {contributor.name}
                </span>
                <span className="text-xs text-gray-500">
                  {contributor.answers} answer{contributor.answers !== 1 ? "s" : ""}
                </span>
              </div>
              {contributor.isBusinessOwner && (
                <Building className="h-3.5 w-3.5 text-primary-500 shrink-0" aria-hidden="true" />
              )}
            </li>
          ))}
        </ul>
      </div>

      <AdSlot position="sidebar" />

      {/* Trending */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
          Trending Questions
        </h3>
        <ul className="mt-3 space-y-3">
          {trendingQuestions.map((q) => (
            <li key={q.id}>
              <Link
                href={`/community/${q.slug}`}
                className="text-sm text-gray-700 hover:text-primary-600 line-clamp-2"
              >
                {q.title}
              </Link>
              <span className="text-xs text-gray-400">{q.upvotes} upvotes</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Business CTA */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Building className="h-4 w-4 text-primary-600" aria-hidden="true" />
          Business Owners
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Answer questions to build authority. Premium members get a verified badge
          and link to their listing.
        </p>
        <Link href="/claim-listing" className="btn-secondary w-full mt-3 text-sm">
          Claim Your Listing
        </Link>
      </div>

      <AdSlot position="sidebar" />
    </aside>
  );
}
