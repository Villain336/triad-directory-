import Link from "next/link";
import { Star, Phone, MapPin, CheckCircle, Crown } from "lucide-react";
import { Listing } from "@/types/listing";
import { formatPhone } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
  showCity?: boolean;
}

export default function ListingCard({ listing, showCity = false }: ListingCardProps) {
  const isPremium = listing.tier === "premium" || listing.tier === "elite";
  const profileUrl = `/${listing.citySlug}/${listing.categorySlug}/${listing.slug}`;

  return (
    <article
      className={`card overflow-hidden ${
        isPremium ? "ring-2 ring-accent-400 border-accent-300" : ""
      }`}
    >
      {isPremium && (
        <div className="flex items-center gap-1.5 bg-accent-50 px-4 py-1.5 text-xs font-semibold text-accent-800">
          <Crown className="h-3.5 w-3.5" />
          Premium Listing
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link href={profileUrl}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors truncate">
                {listing.businessName}
              </h3>
            </Link>
            <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
              {showCity && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {listing.city}, NC
                </span>
              )}
              {listing.isVerified && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
              <span className="text-sm font-semibold text-gray-900">{listing.rating}</span>
            </div>
            <span className="text-xs text-gray-500">
              {listing.reviewCount} review{listing.reviewCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{listing.shortDescription}</p>

        {/* Tags */}
        {listing.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {listing.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <a
            href={`tel:${listing.phone}`}
            className="btn-primary flex-1 !py-2 text-xs gap-1.5"
          >
            <Phone className="h-3.5 w-3.5" />
            {formatPhone(listing.phone)}
          </a>
          <Link href={profileUrl} className="btn-secondary flex-1 !py-2 text-xs">
            View Profile
          </Link>
        </div>

        {isPremium && listing.address && (
          <p className="mt-3 text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {listing.address}, {listing.city}, NC {listing.zip}
          </p>
        )}
      </div>
    </article>
  );
}
