import { Star } from "lucide-react";
import { Review } from "@/lib/data/sample-reviews";
import ReviewCard from "./ReviewCard";

interface ReviewSectionProps {
  reviews: Review[];
  businessName: string;
  averageRating: number;
  totalCount: number;
}

export default function ReviewSection({
  reviews,
  businessName,
  averageRating,
  totalCount,
}: ReviewSectionProps) {
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage:
      reviews.length > 0
        ? Math.round((reviews.filter((r) => r.rating === stars).length / reviews.length) * 100)
        : 0,
  }));

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900">
        Reviews for {businessName}
      </h2>

      {/* Rating Summary */}
      <div className="mt-4 flex flex-col sm:flex-row gap-6 rounded-xl bg-gray-50 border border-gray-200 p-5">
        <div className="text-center sm:text-left">
          <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
          <div className="mt-1 flex items-center gap-0.5 justify-center sm:justify-start">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(averageRating)
                    ? "fill-accent-400 text-accent-400"
                    : "fill-gray-200 text-gray-200"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">{totalCount} reviews</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {ratingDistribution.map((dist) => (
            <div key={dist.stars} className="flex items-center gap-2 text-sm">
              <span className="w-8 text-right text-gray-600">{dist.stars} ★</span>
              <div className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-400 transition-all"
                  style={{ width: `${dist.percentage}%` }}
                />
              </div>
              <span className="w-8 text-gray-400 text-xs">{dist.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      {reviews.length > 0 ? (
        <div className="mt-6 space-y-5">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-gray-500">No reviews yet. Be the first to review {businessName}!</p>
        </div>
      )}
    </section>
  );
}
