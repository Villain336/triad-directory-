"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Send, CheckCircle } from "lucide-react";

interface ExitIntentModalProps {
  categoryName?: string;
  cityName?: string;
  citySlug?: string;
  categorySlug?: string;
}

export default function ExitIntentModal({
  categoryName,
  cityName,
  citySlug,
  categorySlug,
}: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed && !isOpen) {
        setIsOpen(true);
      }
    },
    [dismissed, isOpen]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  function handleDismiss() {
    setIsOpen(false);
    setDismissed(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          phone: formData.get("phone"),
          citySlug,
          categorySlug,
          source: "quote_request",
        }),
      });
    } catch {
      // Handle silently
    }
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setDismissed(true);
    }, 3000);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-3 text-lg font-bold text-gray-900">
              Quotes Are On the Way!
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              We&apos;ll connect you with top-rated pros shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">
                Before You Go...
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Get <strong>3 free quotes</strong> from top-rated{" "}
                {categoryName ? categoryName.toLowerCase() : "professionals"}
                {cityName ? ` in ${cityName}` : " in the Triad"}.
                No obligation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="email"
                name="email"
                required
                placeholder="Your email address"
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone number (optional)"
                autoComplete="tel"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button type="submit" className="btn-primary w-full gap-2 !py-3">
                <Send className="h-4 w-4" />
                Get Free Quotes
              </button>
            </form>

            <p className="mt-3 text-center text-xs text-gray-400">
              100% free. No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
