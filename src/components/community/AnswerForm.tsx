"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

interface AnswerFormProps {
  questionId: string;
  questionTitle: string;
}

export default function AnswerForm({ questionId, questionTitle }: AnswerFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "answer",
          questionId,
          body: formData.get("body"),
          authorName: formData.get("authorName"),
          authorEmail: formData.get("authorEmail"),
          isBusinessOwner,
          businessName: isBusinessOwner ? formData.get("businessName") : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
    } catch {
      // Handle silently
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card p-6 text-center bg-green-50 border-green-200">
        <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
        <h3 className="mt-3 text-lg font-semibold text-gray-900">Answer Submitted!</h3>
        <p className="mt-1 text-sm text-gray-600">
          Your answer will appear after review. Thank you for helping the Triad community!
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900">Your Answer</h3>
      <p className="mt-1 text-sm text-gray-500">
        Share your knowledge — help a Triad neighbor out.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <textarea
            name="body"
            required
            rows={5}
            placeholder="Write your answer... Include specific details, personal experience, or professional expertise."
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Business owner toggle */}
        <div className="rounded-lg bg-beige-50 border border-beige-200 p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isBusinessOwner}
              onChange={(e) => setIsBusinessOwner(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                I&apos;m a business owner answering this question
              </span>
              <span className="block text-xs text-gray-500">
                Your answer will display a &quot;Business Owner&quot; badge and link to your listing
              </span>
            </div>
          </label>

          {isBusinessOwner && (
            <div className="mt-3">
              <input
                type="text"
                name="businessName"
                placeholder="Your business name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          )}
        </div>

        {/* Author info */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="answerAuthorName" className="block text-xs font-medium text-gray-600">
              Display Name *
            </label>
            <input
              type="text"
              id="answerAuthorName"
              name="authorName"
              required
              autoComplete="name"
              placeholder="Your name or username"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="answerAuthorEmail" className="block text-xs font-medium text-gray-600">
              Email * (not displayed)
            </label>
            <input
              type="email"
              id="answerAuthorEmail"
              name="authorEmail"
              required
              autoComplete="email"
              placeholder="your@email.com"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
          <Send className="h-4 w-4" />
          {loading ? "Submitting..." : "Post Your Answer"}
        </button>
      </form>
    </div>
  );
}
