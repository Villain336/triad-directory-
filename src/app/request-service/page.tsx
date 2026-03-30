"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Wrench,
  Send,
  CheckCircle,
  Users,
  Building,
  ArrowRight,
  HelpCircle,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { categories } from "@/lib/data/categories";
import { cities } from "@/lib/data/cities";

export default function RequestServicePage() {
  const [activeTab, setActiveTab] = useState<"find" | "offer">("find");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const data: Record<string, unknown> = {};
    formData.forEach((value, key) => { data[key] = value; });
    data.formType = activeTab;

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: activeTab === "find"
            ? `SERVICE REQUEST: ${data.serviceType || "Other"} | City: ${data.city} | Details: ${data.details} | Budget: ${data.budget} | Timeline: ${data.timeline}`
            : `PROVIDER APPLICATION: ${data.businessName} | Service: ${data.serviceCategory || data.customService} | City: ${data.serviceCity} | Experience: ${data.experience} | About: ${data.about}`,
          source: activeTab === "find" ? "quote_request" : "claim_listing",
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
      <div className="container-main py-20 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {activeTab === "find" ? "Request Submitted!" : "Application Received!"}
        </h1>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          {activeTab === "find"
            ? "We'll match you with qualified local pros and get you quotes within 24-48 hours."
            : "We'll review your information and get your listing set up within 48 hours. We'll email you with next steps."}
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/categories" className="btn-secondary">Browse Services</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Quote Marketplace Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container-main py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2 text-amber-800">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
            <span>
              <span className="font-semibold">New!</span> Try our Quote Marketplace — post your project and get competitive bids from local pros.
            </span>
          </div>
          <Link
            href="/quotes"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            Visit Quote Marketplace
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="container-main py-12 sm:py-16 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Request a Service
          </h1>
          <p className="mt-4 text-lg text-primary-200 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Tell us what you need — or if
            you&apos;re a service provider, get listed and start receiving leads.
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        {/* Tab Selector */}
        <div className="flex rounded-xl bg-beige-100 p-1 max-w-md mx-auto mb-10">
          <button
            onClick={() => setActiveTab("find")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
              activeTab === "find"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            I Need a Service
          </button>
          <button
            onClick={() => setActiveTab("offer")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
              activeTab === "offer"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Briefcase className="h-4 w-4" aria-hidden="true" />
            I Offer a Service
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* === FIND A SERVICE TAB === */}
          {activeTab === "find" && (
            <div>
              <div className="text-center mb-8">
                <HelpCircle className="mx-auto h-10 w-10 text-primary-600" aria-hidden="true" />
                <h2 className="mt-3 text-2xl font-bold text-gray-900">
                  Tell Us What You Need
                </h2>
                <p className="mt-1 text-gray-600">
                  Describe the service you&apos;re looking for and we&apos;ll connect you with
                  qualified local professionals — even if it&apos;s a niche we haven&apos;t
                  listed yet.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="card p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    What service do you need? *
                  </label>
                  <select
                    name="serviceType"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select a category (or choose Other below)</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.name}>{cat.name}</option>
                    ))}
                    <option value="other">Other — I&apos;ll describe below</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Describe what you need *
                  </label>
                  <textarea
                    name="details"
                    required
                    rows={4}
                    placeholder="Be specific — include the type of work, scope, any special requirements, etc. If your service isn't listed above, describe it here."
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Your city *
                    </label>
                    <select
                      name="city"
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="">Select your city...</option>
                      <optgroup label="Piedmont Triad">
                        {cities.filter((c) => c.region === "triad").map((city) => (
                          <option key={city.slug} value={city.name}>{city.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Research Triangle">
                        {cities.filter((c) => c.region === "triangle").map((city) => (
                          <option key={city.slug} value={city.name}>{city.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Budget range
                    </label>
                    <select
                      name="budget"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="">Not sure yet</option>
                      <option value="under-500">Under $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-5000">$1,000 - $5,000</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000-25000">$10,000 - $25,000</option>
                      <option value="25000-plus">$25,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Timeline</label>
                  <select
                    name="timeline"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="asap">ASAP / Emergency</option>
                    <option value="this-week">This week</option>
                    <option value="this-month">This month</option>
                    <option value="flexible">Flexible / Planning ahead</option>
                  </select>
                </div>

                <div className="border-t border-gray-200 pt-5">
                  <p className="text-sm font-medium text-gray-700 mb-3">Your Contact Info</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input type="text" name="name" required placeholder="Full name *" autoComplete="name" className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                    <input type="tel" name="phone" required placeholder="Phone number *" autoComplete="tel" className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                  </div>
                  <input type="email" name="email" required placeholder="Email address *" autoComplete="email" className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full gap-2 !py-3">
                  <Send className="h-4 w-4" />
                  {loading ? "Submitting..." : "Get Matched with Local Pros"}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Free, no obligation. We&apos;ll connect you with qualified professionals within 24-48 hours.
                </p>
              </form>
            </div>
          )}

          {/* === OFFER A SERVICE TAB === */}
          {activeTab === "offer" && (
            <div>
              <div className="text-center mb-8">
                <Briefcase className="mx-auto h-10 w-10 text-primary-600" aria-hidden="true" />
                <h2 className="mt-3 text-2xl font-bold text-gray-900">
                  Get Listed as a Service Provider
                </h2>
                <p className="mt-1 text-gray-600">
                  Whether you&apos;re a pressure washer, chimney sweep, pool cleaner, or
                  any other service pro — we want you in our directory. Don&apos;t see
                  your niche listed? Tell us and we&apos;ll add it.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="card p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    required
                    placeholder="Your business name"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Service Category
                  </label>
                  <select
                    name="serviceCategory"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select your category (or enter custom below)</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Don&apos;t see your service? Describe it
                  </label>
                  <input
                    type="text"
                    name="customService"
                    placeholder="e.g., Pool Cleaning, Chimney Sweep, Tree Removal, Septic Service..."
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    We&apos;ll create a new category for your service type if it doesn&apos;t exist yet.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Primary City *
                    </label>
                    <select
                      name="serviceCity"
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="">Select your city...</option>
                      <optgroup label="Piedmont Triad">
                        {cities.filter((c) => c.region === "triad").map((city) => (
                          <option key={city.slug} value={city.name}>{city.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Research Triangle">
                        {cities.filter((c) => c.region === "triangle").map((city) => (
                          <option key={city.slug} value={city.name}>{city.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Years in Business
                    </label>
                    <select
                      name="experience"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="new">Just getting started</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10-plus">10+ years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tell us about your business
                  </label>
                  <textarea
                    name="about"
                    rows={3}
                    placeholder="What services do you offer? What makes you stand out? What areas do you serve?"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div className="border-t border-gray-200 pt-5">
                  <p className="text-sm font-medium text-gray-700 mb-3">Your Contact Info</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input type="text" name="name" required placeholder="Your name *" autoComplete="name" className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                    <input type="tel" name="phone" required placeholder="Phone number *" autoComplete="tel" className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                  </div>
                  <input type="email" name="email" required placeholder="Email address *" autoComplete="email" className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full gap-2 !py-3">
                  <Send className="h-4 w-4" />
                  {loading ? "Submitting..." : "Submit Your Business"}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Basic listings are free. We&apos;ll set up your profile and notify you within 48 hours.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
