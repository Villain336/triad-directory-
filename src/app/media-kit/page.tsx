import Link from "next/link";
import { Metadata } from "next";
import {
  Download,
  BarChart3,
  Users,
  MapPin,
  Eye,
  Target,
  TrendingUp,
  CheckCircle,
  Phone,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SUPPORT_EMAIL, PHONE } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "Media Kit & Advertising Info",
  description:
    "Download the Triad Directory media kit. Audience demographics, traffic stats, advertising rates, and partnership opportunities.",
  path: "/media-kit",
  noIndex: true,
});

export default function MediaKitPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="container-main py-12 sm:py-16 text-center">
          <h1 className="text-3xl font-bold sm:text-5xl">
            Triad Directory Media Kit
          </h1>
          <p className="mt-4 text-lg text-primary-200 max-w-2xl mx-auto">
            Everything you need to know about advertising on the Triad&apos;s
            fastest-growing local business directory.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link href="/contact" className="btn-accent">
              Contact Sales
            </Link>
            <Link href="/pricing" className="btn-secondary text-white border-white/30 hover:bg-white/10">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <div className="container-main py-12">
        {/* Key Stats */}
        <section>
          <h2 className="section-heading text-center">By the Numbers</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Monthly Unique Visitors", value: "10,000+", icon: Users, growth: "+45% MoM" },
              { label: "Indexed Pages", value: "1,200+", icon: Eye, growth: "SEO optimized" },
              { label: "Triad Cities Covered", value: "31", icon: MapPin, growth: "Every city" },
              { label: "Service Categories", value: "37", icon: Target, growth: "Growing monthly" },
            ].map((stat) => (
              <div key={stat.label} className="card p-6 text-center">
                <stat.icon className="mx-auto h-8 w-8 text-primary-600" aria-hidden="true" />
                <p className="mt-3 text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
                <p className="mt-1 text-xs text-green-600 font-medium">{stat.growth}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Audience Profile */}
        <section className="mt-16">
          <h2 className="section-heading text-center">Our Audience</h2>
          <p className="section-subheading text-center">
            High-intent local consumers actively searching for services
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900">Demographics</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Age Range", "25-65 (primary: 30-55)"],
                  ["Household Income", "$55K-$150K average"],
                  ["Homeowners", "72% of visitors"],
                  ["Geography", "95% Piedmont Triad, NC"],
                  ["Device", "62% mobile, 38% desktop"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-gray-100 pb-2">
                    <dt className="font-medium text-gray-700">{label}</dt>
                    <dd className="text-gray-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900">User Intent</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Searching for a specific service", "68%"],
                  ["Comparing businesses", "45%"],
                  ["Ready to hire within 7 days", "72%"],
                  ["Will call or submit a form", "34%"],
                  ["Average pages per session", "3.8"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-gray-100 pb-2">
                    <dt className="font-medium text-gray-700">{label}</dt>
                    <dd className="font-semibold text-primary-700">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Ad Placements */}
        <section className="mt-16">
          <h2 className="section-heading text-center">Ad Placements & Rates</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Placement</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Size</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Monthly Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["Leaderboard Banner", "728x90", "Top of all pages", "$300-$500"],
                  ["Sidebar Rectangle", "300x250", "Category & listing pages", "$150-$300"],
                  ["Sponsored Listing", "In-feed", "Category search results", "$200-$400"],
                  ["Homepage Featured", "Card", "Homepage rotation", "$400-$600"],
                  ["Blog Sponsorship", "In-article", "Blog posts", "$200-$350"],
                  ["City Exclusive", "Banner + sidebar", "All pages for one city", "$500-$800"],
                  ["Category Exclusive", "Banner + sidebar", "All pages for one category", "$400-$700"],
                ].map(([placement, size, location, rate]) => (
                  <tr key={placement}>
                    <td className="py-3 px-4 font-medium text-gray-900">{placement}</td>
                    <td className="py-3 px-4 text-gray-600">{size}</td>
                    <td className="py-3 px-4 text-gray-600">{location}</td>
                    <td className="py-3 px-4 font-semibold text-primary-700">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Custom packages and volume discounts available. Contact us for a tailored proposal.
          </p>
        </section>

        {/* Agency Partner Program */}
        <section className="mt-16 rounded-2xl bg-primary-50 border border-primary-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Agency Partner Program
          </h2>
          <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
            Are you a marketing agency serving Triad businesses? Our partner program
            gives your clients preferred rates, priority placement, and dedicated support.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Preferred Pricing",
                desc: "Agency partners get 20-30% off standard rates for all client listings and ads.",
              },
              {
                title: "White-Label Reports",
                desc: "Branded performance reports you can share with your clients showing ROI.",
              },
              {
                title: "Priority Support",
                desc: "Dedicated account manager, priority listing setup, and fast-track verification.",
              },
            ].map((benefit) => (
              <div key={benefit.title} className="text-center">
                <CheckCircle className="mx-auto h-8 w-8 text-primary-600" aria-hidden="true" />
                <h3 className="mt-2 font-semibold text-gray-900">{benefit.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/partners" className="btn-primary">
              Apply for Partner Program
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ready to Advertise?</h2>
          <p className="mt-2 text-gray-600">
            Let&apos;s build a custom advertising plan for your business or agency.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-primary gap-2">
              Contact Sales
            </Link>
            <a href={`tel:${PHONE}`} className="btn-secondary gap-2">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {PHONE}
            </a>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Or email us at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
