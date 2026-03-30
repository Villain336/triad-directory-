import { createServerClient } from "@/lib/supabase/server";
import { BarChart3, Eye, Phone, MessageSquare, TrendingUp, MapPin } from "lucide-react";

export const revalidate = 60;

async function getAnalytics() {
  const supabase = createServerClient();

  const [businesses, leads, clicks, cities] = await Promise.all([
    supabase.from("businesses").select("city_name, tier, rating", { count: "exact" }),
    supabase.from("leads").select("source, city_slug, created_at", { count: "exact" }),
    supabase.from("click_events").select("event_type", { count: "exact" }),
    supabase.from("businesses").select("city_name").then(({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach((b: any) => {
        counts[b.city_name] = (counts[b.city_name] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count);
    }),
  ]);

  const leadsBySource: Record<string, number> = {};
  leads.data?.forEach((l: any) => {
    leadsBySource[l.source] = (leadsBySource[l.source] || 0) + 1;
  });

  return {
    totalListings: businesses.count || 0,
    totalLeads: leads.count || 0,
    totalClicks: clicks.count || 0,
    avgRating: businesses.data?.length
      ? (businesses.data.reduce((sum: number, b: any) => sum + Number(b.rating || 0), 0) / businesses.data.length).toFixed(1)
      : "0",
    cityCounts: cities,
    leadsBySource,
  };
}

export default async function AdminAnalyticsPage() {
  const stats = await getAnalytics();

  return (
    <div className="container-main py-8">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <p className="mt-1 text-sm text-gray-500">Platform-wide metrics and performance</p>

      {/* Top Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Listings", value: stats.totalListings, icon: Eye, color: "text-blue-600 bg-blue-50" },
          { label: "Total Leads", value: stats.totalLeads, icon: MessageSquare, color: "text-green-600 bg-green-50" },
          { label: "Click Events", value: stats.totalClicks, icon: Phone, color: "text-purple-600 bg-purple-50" },
          { label: "Avg Rating", value: stats.avgRating, icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className={`inline-flex rounded-lg p-2 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Listings by City */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-600" />
            Listings by City
          </h2>
          <div className="mt-4 space-y-2">
            {stats.cityCounts.slice(0, 10).map(({ city, count }: any) => (
              <div key={city} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-32 truncate">{city}</span>
                <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: `${(count / (stats.cityCounts[0]?.count || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-10 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leads by Source */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Leads by Source
          </h2>
          <div className="mt-4 space-y-3">
            {Object.entries(stats.leadsBySource).length > 0 ? (
              Object.entries(stats.leadsBySource)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">{source.replace(/_/g, " ")}</span>
                    <span className="text-sm font-bold text-gray-900">{count as number}</span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-400">No leads yet. They&apos;ll appear when visitors submit forms.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
