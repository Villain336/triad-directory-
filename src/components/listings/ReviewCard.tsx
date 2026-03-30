import { Star, CheckCircle, MessageSquare } from "lucide-react";
import { Review } from "@/lib/data/sample-reviews";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{review.authorName}</span>
            {review.isVerified && (
              <span className="flex items-center gap-0.5 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
                aria-hidden="true"
              />
            ))}
            <span className="ml-1 text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{review.content}</p>

      {review.ownerResponse && (
        <div className="mt-3 ml-4 rounded-lg bg-gray-50 border border-gray-100 p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
            <MessageSquare className="h-3 w-3" aria-hidden="true" />
            Business Response
            {review.ownerResponseDate && (
              <span className="text-gray-400">
                {" "}
                &middot;{" "}
                {new Date(review.ownerResponseDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600">{review.ownerResponse}</p>
        </div>
      )}
    </div>
  );
}
