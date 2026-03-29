import Link from "next/link";
import { Star, Phone, MapPin, Sparkles } from "lucide-react";
import { Listing } from "@/types/listing";
import { formatPhone } from "@/lib/utils";

interface SponsoredListingProps {
  listing: Listing;
}

export default function SponsoredListing({ listing }: SponsoredListingProps) {
  const profileUrl = `/${listing.citySlug}/${listing.categorySlug}/${listing.slug}`;

  return (
    <div className="card overflow-hidden border-primary-200 bg-primary-50/30">
      <div className="flex items-center gap-1.5 bg-primary-100 px-4 py-1.5 text-xs font-semibold text-primary-700">
        <Sparkles className="h-3.5 w-3.5" />
        Sponsored
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={profileUrl}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                {listing.businessName}
              </h3>
            </Link>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              {listing.city}, NC
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
            <span className="font-semibold">{listing.rating}</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">{listing.shortDescription}</p>
        <div className="mt-4 flex gap-3">
          <a href={`tel:${listing.phone}`} className="btn-primary flex-1 !py-2 text-xs gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            {formatPhone(listing.phone)}
          </a>
          <Link href={profileUrl} className="btn-secondary flex-1 !py-2 text-xs">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
