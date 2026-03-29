import Link from "next/link";
import { Metadata } from "next";
import {
  TrendingUp,
  Eye,
  Phone,
  Mail,
  BarChart3,
  Target,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Advertise Your Business",
  description:
    "Get your business in front of thousands of Triad residents. Premium listings, banner ads, and sponsored placements available. Grow your leads today.",
  path: "/advertise",
});

export default function AdvertisePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="container-main py-16 sm:py-20 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Grow Your Business with <span className="text-accent-400">Triad Directory</span>
          </h1>
          <p className="mt-4 text-lg text-primary-200 max-w-2xl mx-auto">
            Get found by thousands of customers actively searching for services in
            Greensboro, Winston-Salem, High Point, and across the Piedmont Triad.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pricing" className="btn-accent text-base px-8 py-4">
              View Pricing Plans
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200">
        <div className="container-main py-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary-600">10,000+</p>
              <p className="mt-1 text-sm text-gray-500">Monthly Visitors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">30+</p>
              <p className="mt-1 text-sm text-gray-500">Triad Cities Covered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">500+</p>
              <p className="mt-1 text-sm text-gray-500">Listed Businesses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">36+</p>
              <p className="mt-1 text-sm text-gray-500">Service Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Options */}
      <section className="py-16">
        <div className="container-main">
          <h2 className="section-heading text-center">Advertising Options</h2>
          <p className="section-subheading text-center">
            Multiple ways to get in front of your ideal customers
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Premium Listing */}
            <div className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Premium Listings</h3>
              <p className="mt-2 text-sm text-gray-600">
                Stand out from the competition with an enhanced business profile.
                Appear at the top of search results in your city and category.
              </p>
              <ul className="mt-4 space-y-2 text-left text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  Priority placement in listings
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  Enhanced profile with photos & gallery
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  Verified badge & trust signals
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  Lead tracking & analytics dashboard
                </li>
              </ul>
              <Link href="/pricing" className="btn-accent w-full mt-6">
                View Plans
              </Link>
            </div>

            {/* Banner Ads */}
            <div className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Banner Advertising</h3>
              <p className="mt-2 text-sm text-gray-600">
                High-visibility banner placements across the directory. Target
                specific cities, categories, or run site-wide campaigns.
              </p>
              <ul className="mt-4 space-y-2 text-left text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  Leaderboard (728x90) placements
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  Sidebar (300x250) placements
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  Geo-targeted by city or county
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  Impression and click reporting
                </li>
              </ul>
              <Link href="/contact" className="btn-primary w-full mt-6">
                Contact Sales
              </Link>
            </div>

            {/* Sponsored Content */}
            <div className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Sponsored Content</h3>
              <p className="mt-2 text-sm text-gray-600">
                Sponsored blog posts and featured articles that position your
                business as an industry authority in the Triad.
              </p>
              <ul className="mt-4 space-y-2 text-left text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  SEO-optimized blog articles
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  Permanent link to your listing
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  Social media promotion
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  Featured on homepage rotation
                </li>
              </ul>
              <Link href="/contact" className="btn-primary w-full mt-6">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Advertise */}
      <section className="bg-gray-50 py-16">
        <div className="container-main">
          <h2 className="section-heading text-center">Why Advertise on Triad Directory?</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Targeted Local Traffic",
                desc: "Reach customers actively searching for services in your exact city and category.",
              },
              {
                icon: BarChart3,
                title: "Measurable Results",
                desc: "Track views, clicks, calls, and form submissions with our analytics dashboard.",
              },
              {
                icon: Users,
                title: "Quality Leads",
                desc: "Our visitors are high-intent buyers looking for specific services right now.",
              },
              {
                icon: Eye,
                title: "SEO Benefits",
                desc: "Premium listings get enhanced visibility in Google search results for your area.",
              },
              {
                icon: Phone,
                title: "Direct Connections",
                desc: "Click-to-call, contact forms, and quote requests sent directly to you.",
              },
              {
                icon: Mail,
                title: "Dedicated Support",
                desc: "Our team helps you optimize your listing and maximize your ROI.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 py-12 text-white text-center">
        <div className="container-main">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mt-2 text-primary-200">
            Join hundreds of Triad businesses growing with our directory.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pricing" className="btn-accent">
              View Pricing
            </Link>
            <Link href="/claim-listing" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Start with a Free Listing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
