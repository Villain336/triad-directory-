import { Listing } from "@/types/listing";
import ListingCard from "./ListingCard";

interface ListingGridProps {
  listings: Listing[];
  showCity?: boolean;
  emptyMessage?: string;
}

export default function ListingGrid({
  listings,
  showCity = false,
  emptyMessage = "No listings found.",
}: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // Sort: premium/elite first, then by rating
  const sorted = [...listings].sort((a, b) => {
    const tierOrder = { elite: 0, premium: 1, basic: 2, free: 3 };
    const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
    if (tierDiff !== 0) return tierDiff;
    return b.rating - a.rating;
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {sorted.map((listing) => (
        <ListingCard key={listing.id} listing={listing} showCity={showCity} />
      ))}
    </div>
  );
}
