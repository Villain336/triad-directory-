"use client";

import Link from "next/link";
import { ThumbsUp, MessageCircle, CheckCircle, Eye } from "lucide-react";

export interface QuestionData {
  id: string;
  title: string;
  body: string;
  slug: string;
  authorName: string;
  tags: string[];
  upvotes: number;
  answerCount: number;
  views?: number;
  isResolved: boolean;
  createdAt: string;
}

interface QuestionCardProps {
  question: QuestionData;
  compact?: boolean;
  highlightTag?: string;
}

export default function QuestionCard({ question, compact = false, highlightTag }: QuestionCardProps) {
  const {
    title,
    body,
    slug,
    authorName,
    tags,
    upvotes,
    answerCount,
    views,
    isResolved,
    createdAt,
  } = question;

  return (
    <article className={`card hover:border-primary-200 transition-colors ${compact ? "p-4" : "p-5"}`}>
      <div className="flex gap-4">
        {/* Vote + Answer counts — hidden on mobile in compact mode */}
        <div className={`flex-col items-center gap-3 pt-1 min-w-[56px] ${compact ? "hidden sm:flex" : "hidden sm:flex"}`}>
          <div className="text-center">
            <span className={`font-bold text-gray-700 block ${compact ? "text-xs" : "text-sm"}`}>
              {upvotes}
            </span>
            <span className="text-[10px] text-gray-400">votes</span>
          </div>
          <div
            className={`text-center rounded-md px-2 py-1 ${
              isResolved
                ? "bg-green-50 border border-green-200"
                : answerCount > 0
                ? "bg-beige-50 border border-beige-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <span
              className={`font-bold block ${
                compact ? "text-xs" : "text-sm"
              } ${
                isResolved
                  ? "text-green-700"
                  : answerCount > 0
                  ? "text-beige-700"
                  : "text-gray-500"
              }`}
            >
              {answerCount}
            </span>
            <span className="text-[10px] text-gray-400">
              {answerCount === 1 ? "answer" : "answers"}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-2">
            <Link href={`/community/${slug}`} className="flex-1">
              <h3
                className={`font-semibold text-gray-900 hover:text-primary-600 transition-colors ${
                  compact ? "text-base" : "text-lg"
                }`}
              >
                {title}
              </h3>
            </Link>
            {isResolved && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-200 shrink-0">
                <CheckCircle className="h-3 w-3" aria-hidden="true" />
                Resolved
              </span>
            )}
          </div>

          {/* Body preview (only in non-compact mode) */}
          {!compact && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{body}</p>
          )}

          {/* Meta row */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span>
              by <strong className="text-gray-700">{authorName}</strong>
            </span>
            <span>
              {new Date(createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {/* Mobile: show counts inline */}
            <span className="flex items-center gap-1 sm:hidden">
              <ThumbsUp className="h-3 w-3" aria-hidden="true" />
              {upvotes}
            </span>
            <span className="flex items-center gap-1 sm:hidden">
              <MessageCircle className="h-3 w-3" aria-hidden="true" />
              {answerCount}
            </span>
            {views !== undefined && (
              <span className="hidden sm:flex items-center gap-1">
                <Eye className="h-3 w-3" aria-hidden="true" />
                {views} views
              </span>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/community/tag/${tag}`}
                  className={`rounded-full px-2.5 py-0.5 text-xs transition-colors ${
                    tag === highlightTag
                      ? "bg-primary-100 text-primary-700 font-medium"
                      : "bg-beige-100 text-beige-700 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
