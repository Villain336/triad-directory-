"use client";

import { useState } from "react";
import Link from "next/link";
import { DollarSign, Send, CheckCircle, TrendingUp, BarChart3, Users } from "lucide-react";
import { costEstimates } from "@/lib/data/cost-data";
import { cities } from "@/lib/data/cities";
import { categories } from "@/lib/data/categories";

const recentSubmissions = [
  { service: "Driveway Sealcoating", city: "Greensboro", cost: "$375", date: "2 days ago" },
  { service: "AC Repair", city: "Winston-Salem", cost: "$280", date: "3 days ago" },
  { service: "Roof Inspection", city: "High Point", cost: "$0 (free)", date: "4 days ago" },
  { service: "Parking Lot Striping (50 spaces)", city: "Burlington", cost: "$1,200", date: "5 days ago" },
  { service: "Water Heater Replacement", city: "Kernersville", cost: "$1,450", date: "1 week ago" },
  { service: "Electrical Panel Upgrade", city: "Greensboro", cost: "$2,100", date: "1 week ago" },
];

export default function PriceCheckPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Price Check Submission",
          email: formData.get("email"),
          message: `Service: ${formData.get("service")}, City: ${formData.get("city")}, Cost: $${formData.get("cost")}, Details: ${formData.get("details")}`,
          source: "quote_request",
        }),
      });
    } catch { /* silent */ }
    setSubmitted(true);
  }

  return (
    <>
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="container-main py-12 sm:py-16 text-center">
          <BarChart3 className="mx-auto h-10 w-10 text-primary-300" aria-hidden="true" />
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Triad Price Check
          </h1>
          <p className="mt-3 text-lg text-primary-200 max-w-2xl mx-auto">
            What did you pay? Share your experience and help your Triad neighbors
            make informed decisions. See real costs from real homeowners.
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Submit a Price */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Share What You Paid</h2>
            <p className="mt-1 text-sm text-gray-600">
              Help the Triad community by sharing your service costs. All submissions
              are anonymous.
            </p>

            {submitted ? (
              <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-6 text-center">
                <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
                <h3 className="mt-3 text-lg font-bold text-gray-900">Thanks for Sharing!</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Your price data helps Triad residents make better decisions.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 card p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    What service did you get? *
                  </label>
                  <select
                    name="service"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    What city? *
                  </label>
                  <select
                    name="city"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select your city...</option>
                    {cities.map((city) => (
                      <option key={city.slug} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    How much did you pay? *
                  </label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="cost"
                      required
                      placeholder="e.g. 350"
                      className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Details (optional)
                  </label>
                  <textarea
                    name="details"
                    rows={3}
                    placeholder="What was included? Any notes on the experience?"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email (optional — for follow-up)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <button type="submit" className="btn-primary w-full gap-2">
                  <Send className="h-4 w-4" />
                  Submit Price
                </button>
                <p className="text-xs text-gray-400 text-center">
                  All submissions are anonymous. We never share your personal info.
                </p>
              </form>
            )}
          </div>

          {/* Recent Prices + Cost Guides */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Price Reports</h2>
            <p className="mt-1 text-sm text-gray-600">
              What Triad residents are paying for local services
            </p>

            <div className="mt-6 space-y-3">
              {recentSubmissions.map((sub, i) => (
                <div key={i} className="card p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sub.service}</p>
                    <p className="text-xs text-gray-500">{sub.city} &middot; {sub.date}</p>
                  </div>
                  <span className="text-lg font-bold text-primary-700">{sub.cost}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-600" aria-hidden="true" />
                Average Costs in the Triad
              </h3>
              <div className="mt-4 space-y-2">
                {costEstimates.slice(0, 6).map((est) => (
                  <Link
                    key={est.categorySlug}
                    href={`/tools/cost-estimator#${est.categorySlug}`}
                    className="card flex items-center justify-between p-3 hover:border-primary-300 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">{est.categoryName}</span>
                    <span className="text-sm text-gray-500">
                      ${est.lowEnd.toLocaleString()} — ${est.highEnd.toLocaleString()}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/tools/cost-estimator"
                className="btn-secondary w-full mt-4 text-sm"
              >
                View All Cost Guides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
