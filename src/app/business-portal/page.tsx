import Link from "next/link";
import { Metadata } from "next";
import {
  Building,
  Edit,
  BarChart3,
  Users,
  Star,
  Phone,
  Globe,
  Mail,
  Eye,
  TrendingUp,
  Crown,
  CheckCircle,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata: Metadata = generatePageMetadata({
  title: "Business Portal - Manage Your Listing",
  description: "Manage your NC Service Businesses listing. Edit your profile, view leads, track analytics, and respond to reviews.",
  path: "/business-portal",
  noIndex: true,
});

export default function BusinessPortalPage() {
  return (
    <div className="container-main py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Portal</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your listing, track leads, and grow your business
          </p>
        </div>
        <CheckoutButton
          tier="premium"
          label="Upgrade to Premium — $99/mo"
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
        />
      </div>

      {/* Claim or Login */}
      <div className="mt-6 rounded-xl bg-primary-50 border border-primary-200 p-6">
        <h2 className="text-lg font-bold text-gray-900">Claim Your Business</h2>
        <p className="mt-1 text-sm text-gray-600">
          Search for your business below to claim it. Once verified, you can edit
          your profile, respond to leads, and track your listing performance.
        </p>
        <form className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search for your business name..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button type="submit" className="btn-primary shrink-0">
            Search
          </button>
        </form>
        <p className="mt-2 text-xs text-gray-400">
          Can&apos;t find your business?{" "}
          <Link href="/request-service" className="text-primary-600 hover:underline">
            Add it here
          </Link>
        </p>
      </div>

      {/* What You Get */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">What Business Owners Get</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Edit,
              title: "Edit Your Profile",
              desc: "Update your business name, description, services, hours, photos, and contact info anytime.",
              free: true,
            },
            {
              icon: Users,
              title: "View Your Leads",
              desc: "See every person who contacted you through the directory. Name, phone, email, and message.",
              free: true,
            },
            {
              icon: MessageSquare,
              title: "Respond to Reviews",
              desc: "Reply to customer reviews to show you care. Responses are visible on your listing.",
              free: true,
            },
            {
              icon: Eye,
              title: "Listing Analytics",
              desc: "Track profile views, phone clicks, website clicks, and form submissions.",
              free: false,
            },
            {
              icon: Crown,
              title: "Priority Placement",
              desc: "Show up at the top of search results in your city and category. 10x more visibility.",
              free: false,
            },
            {
              icon: TrendingUp,
              title: "Monthly Reports",
              desc: "Get a detailed report showing your ROI — views, leads, and conversions.",
              free: false,
            },
          ].map((feature) => (
            <div key={feature.title} className="card p-5">
              <div className="flex items-center justify-between">
                <feature.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  feature.free
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {feature.free ? "Free" : "Premium"}
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-12 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-900">How to Claim Your Listing</h2>
        <div className="mt-6 space-y-6">
          {[
            {
              step: "1",
              title: "Search for your business",
              desc: "Use the search bar above to find your business in our directory.",
            },
            {
              step: "2",
              title: "Verify ownership",
              desc: "We'll send a verification code to your business phone or email on file.",
            },
            {
              step: "3",
              title: "Update your profile",
              desc: "Add your description, hours, photos, services, and specialties.",
            },
            {
              step: "4",
              title: "Start receiving leads",
              desc: "Get notified when customers contact you through the directory.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-0.5 text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Comparison */}
      <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Free vs Premium</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 font-medium text-gray-700">Feature</th>
              <th className="text-center py-2 font-medium text-gray-700 w-24">Free</th>
              <th className="text-center py-2 font-medium text-amber-700 w-24">Premium</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              ["Basic listing in directory", true, true],
              ["Business name & contact info", true, true],
              ["Edit your profile", true, true],
              ["Respond to reviews", true, true],
              ["Verified badge", false, true],
              ["Priority placement (top of results)", false, true],
              ["Photo gallery", false, true],
              ["Lead notifications to your phone", false, true],
              ["Analytics dashboard", false, true],
              ["Featured on homepage", false, true],
              ["Remove competitor ads from your page", false, true],
            ].map(([feature, free, premium]) => (
              <tr key={feature as string}>
                <td className="py-2 text-gray-700">{feature as string}</td>
                <td className="py-2 text-center">
                  {free ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="py-2 text-center">
                  {premium ? (
                    <CheckCircle className="h-4 w-4 text-amber-500 mx-auto" />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-center">
          <Link href="/pricing" className="btn-primary gap-1.5">
            View Pricing <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
