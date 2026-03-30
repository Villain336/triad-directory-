import Link from "next/link";
import { Metadata } from "next";
import {
  BarChart3,
  Phone,
  Eye,
  MessageSquare,
  TrendingUp,
  Star,
  Settings,
  Crown,
  ArrowUpRight,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Business Dashboard",
  description: "Manage your business listing, track leads, and monitor your performance on Triad Directory.",
  path: "/dashboard",
  noIndex: true,
});

const demoStats = {
  views: 1247,
  viewsChange: 12,
  calls: 34,
  callsChange: 8,
  formSubmissions: 18,
  formChange: 23,
  websiteClicks: 89,
  websiteChange: -3,
};

const recentLeads = [
  {
    id: 1,
    name: "John D.",
    type: "Phone Call",
    date: "2 hours ago",
    icon: Phone,
  },
  {
    id: 2,
    name: "Sarah M.",
    type: "Contact Form",
    date: "5 hours ago",
    icon: MessageSquare,
  },
  {
    id: 3,
    name: "Michael R.",
    type: "Phone Call",
    date: "Yesterday",
    icon: Phone,
  },
  {
    id: 4,
    name: "Emily T.",
    type: "Contact Form",
    date: "Yesterday",
    icon: MessageSquare,
  },
  {
    id: 5,
    name: "David W.",
    type: "Website Click",
    date: "2 days ago",
    icon: ArrowUpRight,
  },
];

export default function DashboardPage() {
  return (
    <div className="container-main py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your listing performance and manage your leads
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/edit" className="btn-secondary text-sm gap-1.5">
            <Settings className="h-4 w-4" aria-hidden="true" />
            Edit Listing
          </Link>
          <Link href="/pricing" className="btn-accent text-sm gap-1.5">
            <Crown className="h-4 w-4" aria-hidden="true" />
            Upgrade Plan
          </Link>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 rounded-xl bg-primary-50 border border-primary-200 p-4">
        <p className="text-sm text-primary-800">
          <strong>Demo Dashboard:</strong> This is a preview of the business owner
          dashboard. Claim your listing and sign up to access your real analytics
          and lead data.
        </p>
        <div className="mt-3 flex gap-2">
          <Link href="/claim-listing" className="btn-primary text-sm !py-2">
            Claim Your Listing
          </Link>
          <Link href="/pricing" className="btn-secondary text-sm !py-2">
            View Plans
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Profile Views",
            value: demoStats.views,
            change: demoStats.viewsChange,
            icon: Eye,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Phone Calls",
            value: demoStats.calls,
            change: demoStats.callsChange,
            icon: Phone,
            color: "text-green-600 bg-green-50",
          },
          {
            label: "Form Submissions",
            value: demoStats.formSubmissions,
            change: demoStats.formChange,
            icon: MessageSquare,
            color: "text-purple-600 bg-purple-50",
          },
          {
            label: "Website Clicks",
            value: demoStats.websiteClicks,
            change: demoStats.websiteChange,
            icon: ArrowUpRight,
            color: "text-amber-600 bg-amber-50",
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change >= 0 ? "+" : ""}
                {stat.change}%
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xs text-gray-400">Last 30 days</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Recent Leads */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
            <span className="text-sm text-primary-600 cursor-pointer hover:underline">
              View All
            </span>
          </div>
          <div className="mt-4 divide-y divide-gray-100">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <lead.icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.type}</p>
                </div>
                <span className="text-xs text-gray-400">{lead.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" aria-hidden="true" />
              Reviews Summary
            </h2>
            <div className="mt-4 text-center">
              <p className="text-4xl font-bold text-gray-900">4.9</p>
              <div className="mt-1 flex items-center justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">Based on 247 reviews</p>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" aria-hidden="true" />
              Listing Health
            </h2>
            <div className="mt-4 space-y-3">
              {[
                { label: "Profile completeness", value: 85 },
                { label: "Photo quality", value: 60 },
                { label: "Review response rate", value: 100 },
                { label: "Contact info accuracy", value: 100 },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{metric.label}</span>
                    <span className="font-medium text-gray-900">{metric.value}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        metric.value >= 80
                          ? "bg-green-500"
                          : metric.value >= 50
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/pricing"
              className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Upgrade to Premium for full analytics →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
