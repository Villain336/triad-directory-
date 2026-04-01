"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface VoteButtonProps {
  targetId: string;
  targetType: "question" | "answer";
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote: "up" | "down" | null;
  isLoggedIn: boolean;
  orientation?: "vertical" | "horizontal";
}

export default function VoteButton({
  targetId,
  targetType,
  initialUpvotes,
  initialDownvotes,
  initialUserVote,
  isLoggedIn,
  orientation = "vertical",
}: VoteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(initialUserVote);
  const [pending, setPending] = useState(false);

  const score = upvotes - downvotes;

  async function handleVote(direction: "up" | "down") {
    if (!isLoggedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (pending) return;

    // Optimistic update
    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;
    const prevUserVote = userVote;

    let nextUpvotes = upvotes;
    let nextDownvotes = downvotes;
    let nextUserVote: "up" | "down" | null = direction;

    if (direction === "up") {
      if (userVote === "up") {
        // remove vote
        nextUpvotes = upvotes - 1;
        nextUserVote = null;
      } else {
        nextUpvotes = upvotes + 1;
        if (userVote === "down") nextDownvotes = downvotes - 1;
      }
    } else {
      if (userVote === "down") {
        // remove vote
        nextDownvotes = downvotes - 1;
        nextUserVote = null;
      } else {
        nextDownvotes = downvotes + 1;
        if (userVote === "up") nextUpvotes = upvotes - 1;
      }
    }

    setUpvotes(nextUpvotes);
    setDownvotes(nextDownvotes);
    setUserVote(nextUserVote);
    setPending(true);

    try {
      const res = await fetch("/api/community/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId,
          targetType,
          direction: nextUserVote === null ? "remove" : direction,
        }),
      });

      if (!res.ok) {
        throw new Error("Vote failed");
      }
    } catch {
      // Revert on error
      setUpvotes(prevUpvotes);
      setDownvotes(prevDownvotes);
      setUserVote(prevUserVote);
    } finally {
      setPending(false);
    }
  }

  if (orientation === "horizontal") {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleVote("up")}
          disabled={pending}
          aria-label="Upvote"
          className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium transition-colors ${
            userVote === "up"
              ? "bg-green-100 text-green-700"
              : "text-gray-400 hover:text-green-600 hover:bg-green-50"
          } disabled:opacity-50`}
        >
          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <span
          className={`text-sm font-bold tabular-nums ${
            score > 0
              ? "text-green-700"
              : score < 0
              ? "text-red-600"
              : "text-gray-500"
          }`}
        >
          {score}
        </span>
        <button
          onClick={() => handleVote("down")}
          disabled={pending}
          aria-label="Downvote"
          className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium transition-colors ${
            userVote === "down"
              ? "bg-red-100 text-red-700"
              : "text-gray-400 hover:text-red-600 hover:bg-red-50"
          } disabled:opacity-50`}
        >
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote("up")}
        disabled={pending}
        aria-label="Upvote"
        className={`rounded p-1.5 transition-colors ${
          userVote === "up"
            ? "bg-green-100 text-green-700"
            : "text-gray-400 hover:text-green-600 hover:bg-green-50"
        } disabled:opacity-50`}
      >
        <ChevronUp className="h-5 w-5" aria-hidden="true" />
      </button>
      <span
        className={`text-sm font-bold tabular-nums ${
          score > 0
            ? "text-green-700"
            : score < 0
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {score}
      </span>
      <button
        onClick={() => handleVote("down")}
        disabled={pending}
        aria-label="Downvote"
        className={`rounded p-1.5 transition-colors ${
          userVote === "down"
            ? "bg-red-100 text-red-700"
            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
        } disabled:opacity-50`}
      >
        <ChevronDown className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
