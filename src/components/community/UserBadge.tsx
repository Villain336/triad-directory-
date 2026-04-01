"use client";

import Link from "next/link";
import { Building, CheckCircle, Star } from "lucide-react";
import { getRelativeTime } from "@/lib/utils/relative-time";

interface UserBadgeProps {
  authorName: string;
  authorId?: string;
  isBusinessOwner?: boolean;
  businessName?: string;
  businessSlug?: string;
  reputation?: number;
  createdAt: string;
  verb?: string; // "asked", "answered", etc.
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getReputationFlair(reputation: number): {
  label: string;
  className: string;
  showStar?: boolean;
} | null {
  if (reputation <= 50) return null; // New Member — no badge
  if (reputation <= 200) {
    return { label: "Contributor", className: "bg-gray-100 text-gray-600" };
  }
  if (reputation <= 500) {
    return { label: "Expert", className: "bg-amber-100 text-amber-700" };
  }
  return {
    label: "Community Leader",
    className: "bg-yellow-100 text-yellow-700",
    showStar: true,
  };
}

export default function UserBadge({
  authorName,
  isBusinessOwner,
  businessName,
  businessSlug,
  reputation = 0,
  createdAt,
  verb = "asked",
}: UserBadgeProps) {
  const avatarColor = getAvatarColor(authorName);
  const initial = authorName.charAt(0).toUpperCase();
  const reputationFlair = getReputationFlair(reputation);
  const relativeTime = getRelativeTime(createdAt);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-semibold shrink-0 ${avatarColor}`}
        aria-hidden="true"
      >
        {initial}
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-gray-900 text-sm">{authorName}</span>

          {/* Reputation = 0-50 → "New Member" label (subtle) */}
          {reputation <= 50 && (
            <span className="text-xs text-gray-400">New Member</span>
          )}

          {/* Reputation flair */}
          {reputationFlair && (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${reputationFlair.className}`}
            >
              {reputationFlair.showStar && (
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
              )}
              {reputationFlair.label}
            </span>
          )}

          {/* Business Owner badge */}
          {isBusinessOwner && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              <Building className="h-3 w-3" aria-hidden="true" />
              {businessSlug && businessName ? (
                <Link
                  href={`/listings/${businessSlug}`}
                  className="hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {businessName}
                </Link>
              ) : (
                businessName || "Business Owner"
              )}
            </span>
          )}

          {/* Verified badge */}
          {isBusinessOwner && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
              <CheckCircle className="h-3 w-3" aria-hidden="true" />
              Verified
            </span>
          )}
        </div>

        <span className="text-xs text-gray-400">
          {verb} {relativeTime}
        </span>
      </div>
    </div>
  );
}
