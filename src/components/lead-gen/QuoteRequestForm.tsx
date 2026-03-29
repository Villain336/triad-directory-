"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Send, CheckCircle, MapPin, Wrench } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { cities } from "@/lib/data/cities";

interface QuoteRequestFormProps {
  defaultCity?: string;
  defaultCategory?: string;
}

export default function QuoteRequestForm({
  defaultCity,
  defaultCategory,
}: QuoteRequestFormProps) {
  const [step, setStep] = useState(defaultCategory ? (defaultCity ? 3 : 2) : 1);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory || "");
  const [selectedCity, setSelectedCity] = useState(defaultCity || "");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const categoryName = categories.find((c) => c.slug === selectedCategory)?.name || "";
  const cityName = cities.find((c) => c.slug === selectedCity)?.name || "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
          citySlug: selectedCity,
          categorySlug: selectedCategory,
          source: "quote_request",
        }),
      });
      setSubmitted(true);
    } catch {
      // Handle silently
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-3 text-lg font-bold text-gray-900">Quotes Are On the Way!</h3>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;re connecting you with top-rated {categoryName.toLowerCase()} in {cityName}.
          Expect responses within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-primary-50 border border-primary-200 p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Get Free Quotes from Local Pros
        </h3>
        <p className="text-sm text-gray-600">
          Tell us what you need — we&apos;ll match you with top-rated professionals
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= s
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`h-0.5 w-8 ${
                  step > s ? "bg-primary-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Service */}
      {step === 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Wrench className="inline h-4 w-4 mr-1" aria-hidden="true" />
            What service do you need?
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Select a service...</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => selectedCategory && setStep(2)}
            disabled={!selectedCategory}
            className="btn-primary w-full mt-4 gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" aria-hidden="true" />
            Where are you located?
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Select your city...</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}, NC
              </option>
            ))}
          </select>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1 gap-1">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => selectedCity && setStep(3)}
              disabled={!selectedCity}
              className="btn-primary flex-1 gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact Info */}
      {step === 3 && (
        <form onSubmit={handleSubmit}>
          {(categoryName || cityName) && (
            <p className="text-sm text-primary-700 font-medium mb-3 text-center">
              {categoryName && cityName
                ? `Getting quotes for ${categoryName} in ${cityName}`
                : categoryName || cityName}
            </p>
          )}
          <div className="space-y-3">
            <input
              type="text"
              name="name"
              required
              placeholder="Your full name *"
              autoComplete="name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <input
              type="tel"
              name="phone"
              required
              placeholder="Phone number *"
              autoComplete="tel"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email address *"
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <textarea
              name="message"
              rows={3}
              placeholder="Describe what you need..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="mt-4 flex gap-2">
            {!defaultCategory && (
              <button type="button" onClick={() => setStep(2)} className="btn-secondary gap-1">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 gap-2"
            >
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Get Free Quotes"}
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-400 text-center">
            Free, no obligation. Typically 2-3 quotes within 24 hours.
          </p>
        </form>
      )}
    </div>
  );
}
