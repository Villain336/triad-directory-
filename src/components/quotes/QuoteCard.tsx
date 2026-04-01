import Link from "next/link";
import { MapPin, Tag, DollarSign, Clock, MessageSquare, Calendar } from "lucide-react";

export interface QuoteRequest {
  id: string;
  title: string;
  description: string;
  category_slug: string;
  city_slug: string;
  budget_range: string | null;
  timeline: string | null;
  status: string;
  created_at: string;
  quote_bids?: { count: number }[];
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

function formatCategorySlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatCitySlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface QuoteCardProps {
  quote: QuoteRequest;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const bidCount =
    Array.isArray(quote.quote_bids) && quote.quote_bids.length > 0
      ? (quote.quote_bids[0] as { count: number }).count
      : 0;

  return (
    <Link href={`/quotes/${quote.id}`} className="block group">
      <article className="card p-5 flex flex-col gap-3 group-hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-1">
            {quote.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              quote.status === "open"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {quote.status === "open" ? "Open" : quote.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{quote.description}</p>

        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
            <Tag className="h-3 w-3" />
            {formatCategorySlug(quote.category_slug)}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-beige-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
            <MapPin className="h-3 w-3" />
            {formatCitySlug(quote.city_slug)}, NC
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

        <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {bidCount} {bidCount === 1 ? "bid" : "bids"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(quote.created_at)}
          </span>
        </div>
      </article>
    </Link>
  );
}
