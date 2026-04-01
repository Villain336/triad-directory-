"use client";

import { useState } from "react";
import { Star, PenLine, ChevronUp } from "lucide-react";
import { Review } from "@/lib/data/sample-reviews";
import ReviewCard from "./ReviewCard";
import WriteReviewForm from "./WriteReviewForm";

interface ReviewSectionProps {
  reviews: Review[];
  businessName: string;
  businessId: string;
  averageRating: number;
  totalCount: number;
}

export default function ReviewSection({
  reviews,
  businessName,
  businessId,
  averageRating,
  totalCount,
}: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);

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
      {/* Heading row with Write a Review button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-gray-900">
          Reviews for {businessName}
        </h2>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-1.5 rounded-lg border border-primary-600 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors"
          aria-expanded={showForm}
        >
          {showForm ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide Form
            </>
          ) : (
            <>
              <PenLine className="h-4 w-4" />
              Write a Review
            </>
          )}
        </button>
      </div>

      {/* Write Review Form */}
      {showForm && (
        <div className="mt-4">
          <WriteReviewForm
            businessId={businessId}
            businessName={businessName}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

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
                    ? "fill-amber-400 text-amber-400"
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
                  className="h-full rounded-full bg-amber-400 transition-all"
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
