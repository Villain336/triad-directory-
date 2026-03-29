"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

interface ContactFormProps {
  listingId?: string;
  listingName?: string;
  citySlug?: string;
  categorySlug?: string;
}

export default function ContactForm({
  listingId,
  listingName,
  citySlug,
  categorySlug,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      listingId,
      citySlug,
      categorySlug,
      source: listingId ? "contact_form" : "quote_request",
    };

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      // Handle silently - in production, add error state
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
        <h3 className="mt-3 text-lg font-semibold text-gray-900">Message Sent!</h3>
        <p className="mt-1 text-sm text-gray-600">
          {listingName
            ? `${listingName} will be in touch shortly.`
            : "We'll connect you with the best local providers."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {listingName ? `Contact ${listingName}` : "Get Free Quotes"}
      </h3>
      <p className="text-sm text-gray-500">
        {listingName
          ? "Send a message and they'll respond within 24 hours."
          : "Tell us what you need and get matched with top local providers."}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder={
            listingName
              ? `I'm interested in your services...`
              : "Describe what you need..."
          }
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
        <Send className="h-4 w-4" />
        {loading ? "Sending..." : "Send Message"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Your information is secure and never shared without your consent.
      </p>
    </form>
  );
}
