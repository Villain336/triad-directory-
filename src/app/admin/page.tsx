import Link from "next/link";
import {
  Building,
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  TrendingUp,
  Phone,
  Eye,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";

async function getAdminStats() {
  const supabase = createServerClient();

  const [businesses, leads, questions, reviews] = await Promise.all([
    supabase.from("businesses").select("id, tier, status, created_at", { count: "exact" }),
    supabase.from("leads").select("id, source, created_at", { count: "exact" }),
    supabase.from("community_questions").select("id, status", { count: "exact" }),
    supabase.from("reviews").select("id, status", { count: "exact" }),
  ]);

  return {
    totalListings: businesses.count || 0,
    totalLeads: leads.count || 0,
    totalQuestions: questions.count || 0,
    totalReviews: reviews.count || 0,
    pendingQuestions: questions.data?.filter((q) => q.status === "pending").length || 0,
    pendingReviews: reviews.data?.filter((r) => r.status === "pending").length || 0,
    recentLeads: leads.data?.slice(0, 5) || [],
  };
}

export const revalidate = 60;

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="container-main py-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">NC Service Businesses — Management Console</p>

      {/* Alert: Pending Items */}
      {(stats.pendingQuestions > 0 || stats.pendingReviews > 0) && (
        <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Items need review</p>
            <p className="text-sm text-amber-700">
              {stats.pendingQuestions > 0 && `${stats.pendingQuestions} pending questions`}
              {stats.pendingQuestions > 0 && stats.pendingReviews > 0 && " · "}
              {stats.pendingReviews > 0 && `${stats.pendingReviews} pending reviews`}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Listings", value: stats.totalListings, icon: Building, href: "/admin/listings", color: "text-blue-600 bg-blue-50" },
          { label: "Total Leads", value: stats.totalLeads, icon: Users, href: "/admin/leads", color: "text-green-600 bg-green-50" },
          { label: "Community Questions", value: stats.totalQuestions, icon: MessageSquare, href: "/admin/community", color: "text-purple-600 bg-purple-50" },
          { label: "Reviews", value: stats.totalReviews, icon: FileText, href: "/admin/analytics", color: "text-amber-600 bg-amber-50" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link href="/admin/listings" className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50">
              <Building className="h-4 w-4 text-gray-500" />
              Manage Listings
            </Link>
            <Link href="/admin/leads" className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50">
              <Users className="h-4 w-4 text-gray-500" />
              View Leads
            </Link>
            <Link href="/admin/community" className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              Moderate Q&A
            </Link>
            <Link href="/admin/blog" className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50">
              <FileText className="h-4 w-4 text-gray-500" />
              Manage Blog
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Free listings</span>
              <span className="font-medium">{stats.totalListings}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Premium listings</span>
              <span className="font-medium text-primary-600">0 (upgrade to unlock)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Active ads</span>
              <span className="font-medium">0</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
              <span className="font-medium text-gray-900">Monthly Revenue</span>
              <span className="text-lg font-bold text-primary-600">$0</span>
            </div>
            <p className="text-xs text-gray-400">Revenue tracking activates when Stripe is connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
