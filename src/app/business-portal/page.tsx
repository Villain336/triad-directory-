import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import {
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
  ArrowUpRight,
  Settings,
  Shield,
  Image,
  Zap,
  Calendar,
  Target,
  LineChart,
  Lock,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getUser } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata: Metadata = generatePageMetadata({
  title: "Business Portal - Manage Your Listing",
  description:
    "Manage your NC Service Businesses listing. Edit your profile, view leads, track analytics, and respond to reviews.",
  path: "/business-portal",
  noIndex: true,
});

// ---------- helpers ----------
function tierRank(tier: string) {
  if (tier === "premium") return 2;
  if (tier === "basic") return 1;
  return 0;
}

function tierLabel(tier: string) {
  if (tier === "premium") return "Premium";
  if (tier === "basic") return "Basic";
  return "Free";
}

function tierColor(tier: string) {
  if (tier === "premium") return "amber";
  if (tier === "basic") return "primary";
  return "gray";
}

// ---------- demo data ----------
const demoStats = {
  views: 1247,
  viewsChange: 12,
  calls: 34,
  callsChange: 8,
  forms: 18,
  formsChange: 23,
  clicks: 89,
  clicksChange: -3,
};

const recentLeads = [
  { id: 1, name: "John D.", type: "Phone Call", date: "2 hours ago", icon: "phone" },
  { id: 2, name: "Sarah M.", type: "Contact Form", date: "5 hours ago", icon: "form" },
  { id: 3, name: "Michael R.", type: "Phone Call", date: "Yesterday", icon: "phone" },
  { id: 4, name: "Emily T.", type: "Contact Form", date: "Yesterday", icon: "form" },
  { id: 5, name: "David W.", type: "Website Click", date: "2 days ago", icon: "click" },
];

// ---------- page ----------
export default async function BusinessPortalPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login?redirect=/business-portal");

  const supabase = createServerClient();

  // Fetch user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*, organizations(*)")
    .eq("id", user.id)
    .single();

  // Fetch linked business (if any)
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  // Fetch subscription
  const { data: subscription } = business
    ? await supabase
        .from("subscriptions")
        .select("*")
        .eq("business_id", business.id)
        .eq("status", "active")
        .single()
    : { data: null };

  const tier: string = business?.tier || "free";
  const rank = tierRank(tier);
  const isPremium = rank >= 2;
  const isBasic = rank >= 1;
  const businessName = business?.name || profile?.full_name || user.email?.split("@")[0] || "Your Business";

  // No business linked yet — onboarding
  if (!business) {
    return <OnboardingView userName={profile?.full_name || user.email || ""} />;
  }

  return (
    <div className={isPremium ? "min-h-screen bg-gradient-to-b from-amber-50/40 to-white" : ""}>
      <div className="container-main py-8">
        {/* ───────── HEADER ───────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* avatar / logo */}
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white ${
                isPremium
                  ? "bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-200"
                  : isBasic
                  ? "bg-primary-600"
                  : "bg-gray-500"
              }`}
            >
              {businessName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{businessName}</h1>
                {isBasic && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isPremium
                        ? "bg-amber-100 text-amber-800"
                        : "bg-primary-100 text-primary-800"
                    }`}
                  >
                    <Crown className="h-3 w-3" />
                    {tierLabel(tier)}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                {business.city_name || "NC"} &middot; {tierLabel(tier)} Plan
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/business-portal/edit"
              className="btn-secondary text-sm gap-1.5"
            >
              <Settings className="h-4 w-4" />
              Edit Listing
            </Link>
            {!isPremium && (
              <CheckoutButton
                tier={isBasic ? "premium" : "basic"}
                label={isBasic ? "Upgrade to Premium" : "Upgrade to Basic"}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
              />
            )}
          </div>
        </div>

        {/* ───────── PREMIUM BANNER ───────── */}
        {isPremium && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/60 p-5">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-amber-500" />
              <div>
                <p className="font-semibold text-amber-900">Premium Business Portal</p>
                <p className="text-sm text-amber-700">
                  You have full access to analytics, lead tracking, priority placement, and all premium tools.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ───────── STATS (Basic + Premium) ───────── */}
        {isBasic ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Profile Views", value: demoStats.views, change: demoStats.viewsChange, icon: Eye, color: "text-blue-600 bg-blue-50" },
              { label: "Phone Calls", value: demoStats.calls, change: demoStats.callsChange, icon: Phone, color: "text-green-600 bg-green-50" },
              { label: "Form Submissions", value: demoStats.forms, change: demoStats.formsChange, icon: MessageSquare, color: "text-purple-600 bg-purple-50" },
              { label: "Website Clicks", value: demoStats.clicks, change: demoStats.clicksChange, icon: ArrowUpRight, color: "text-amber-600 bg-amber-50" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl border p-5 ${
                  isPremium
                    ? "bg-white border-amber-100 shadow-sm"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-sm font-medium ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stat.change >= 0 ? "+" : ""}{stat.change}%
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xs text-gray-400">Last 30 days</p>
              </div>
            ))}
          </div>
        ) : (
          /* Free tier — locked stats teaser */
          <div className="mt-8 relative">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 opacity-40 pointer-events-none select-none">
              {["Profile Views", "Phone Calls", "Form Submissions", "Website Clicks"].map((label) => (
                <div key={label} className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="h-8 w-8 rounded-lg bg-gray-100" />
                  <p className="mt-3 text-2xl font-bold text-gray-300">---</p>
                  <p className="text-sm text-gray-400">{label}</p>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-xl bg-white border border-gray-200 shadow-lg p-6 text-center max-w-sm">
                <Lock className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 font-semibold text-gray-900">Unlock Analytics</p>
                <p className="mt-1 text-sm text-gray-500">
                  Upgrade to Basic or Premium to see real-time stats on views, calls, and leads.
                </p>
                <CheckoutButton
                  tier="basic"
                  label="Upgrade to Basic — $49/mo"
                  className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* ───────── MAIN GRID ───────── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* LEFT COL (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* LEADS TABLE */}
            <div className={`rounded-xl border p-5 ${isPremium ? "bg-white border-amber-100 shadow-sm" : "bg-white border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary-600" />
                  Recent Leads
                </h2>
                {isBasic && (
                  <span className="text-sm text-primary-600 cursor-pointer hover:underline">View All</span>
                )}
              </div>

              {isBasic ? (
                <div className="mt-4 divide-y divide-gray-100">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center gap-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        {lead.icon === "phone" ? <Phone className="h-4 w-4" /> : lead.icon === "form" ? <MessageSquare className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.type}</p>
                      </div>
                      <span className="text-xs text-gray-400">{lead.date}</span>
                      {isPremium && (
                        <button className="text-xs text-primary-600 hover:underline font-medium">View</button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
                  <Users className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Lead details available on Basic and Premium plans.</p>
                  <CheckoutButton
                    tier="basic"
                    label="Upgrade to see leads"
                    className="mt-3 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* REVIEWS (all tiers can see, premium gets respond) */}
            <div className={`rounded-xl border p-5 ${isPremium ? "bg-white border-amber-100 shadow-sm" : "bg-white border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Reviews
                </h2>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{business.rating || "4.8"}</p>
                  <p className="text-xs text-gray-500">{business.review_count || 0} reviews</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(business.rating || 4.8) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                  />
                ))}
              </div>
              {isPremium ? (
                <p className="mt-3 text-sm text-gray-600">
                  You can respond to reviews directly from your listing page. Premium members get priority review display.
                </p>
              ) : isBasic ? (
                <p className="mt-3 text-sm text-gray-600">
                  Customers can leave reviews on your listing. Upgrade to Premium to respond publicly.
                </p>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  Upgrade to see detailed review analytics and respond to customers.
                </p>
              )}
            </div>

            {/* PREMIUM: ADVANCED ANALYTICS */}
            {isPremium && (
              <div className="rounded-xl border border-amber-100 bg-white shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-amber-600" />
                  Performance Analytics
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Conversion Rate", value: "3.2%", sub: "Form fills / views", trend: "+0.4%" },
                    { label: "Avg. Response Time", value: "2.3 hrs", sub: "To new leads", trend: "-12 min" },
                    { label: "Search Impressions", value: "4,891", sub: "In your categories", trend: "+18%" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg bg-amber-50/50 border border-amber-100 p-4">
                      <p className="text-xs text-gray-500">{m.label}</p>
                      <p className="mt-1 text-xl font-bold text-gray-900">{m.value}</p>
                      <p className="text-xs text-gray-400">{m.sub}</p>
                      <p className="mt-1 text-xs font-medium text-green-600">{m.trend}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PREMIUM: COMPETITOR INSIGHTS */}
            {isPremium && (
              <div className="rounded-xl border border-amber-100 bg-white shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-600" />
                  Competitor Insights
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  See how your listing compares to other businesses in your category and city.
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Your ranking in category", value: "#2 of 18" },
                    { label: "Your rating vs. average", value: `${business.rating || 4.8} vs 4.2` },
                    { label: "Your review count vs. avg", value: `${business.review_count || 247} vs 34` },
                    { label: "Profile completeness", value: "92% (top 10%)" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COL (1/3) */}
          <div className="space-y-6">
            {/* LISTING HEALTH */}
            <div className={`rounded-xl border p-5 ${isPremium ? "bg-white border-amber-100 shadow-sm" : "bg-white border-gray-200"}`}>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Listing Health
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Profile completeness", value: 85 },
                  { label: "Photo quality", value: isPremium ? 90 : isBasic ? 60 : 20 },
                  { label: "Review response rate", value: isPremium ? 100 : 0 },
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
                          metric.value >= 80 ? "bg-green-500" : metric.value >= 50 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className={`rounded-xl border p-5 ${isPremium ? "bg-white border-amber-100 shadow-sm" : "bg-white border-gray-200"}`}>
              <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/business-portal/edit" className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50 transition-colors">
                  <Edit className="h-4 w-4 text-primary-600" />
                  <span className="font-medium text-gray-700">Edit Profile</span>
                </Link>
                {isBasic && (
                  <Link href="/business-portal/leads" className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50 transition-colors">
                    <Mail className="h-4 w-4 text-primary-600" />
                    <span className="font-medium text-gray-700">View All Leads</span>
                  </Link>
                )}
                {isPremium && (
                  <>
                    <Link href="/business-portal/analytics" className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-sm hover:bg-amber-50 transition-colors">
                      <BarChart3 className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-800">Full Analytics</span>
                    </Link>
                    <Link href="/business-portal/photos" className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-sm hover:bg-amber-50 transition-colors">
                      <Image className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-800">Manage Photos</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* BOOST (Basic + Premium) */}
            {isBasic && (
              <div className={`rounded-xl border p-5 ${isPremium ? "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200" : "bg-white border-gray-200"}`}>
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Boost Your Listing
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Get featured at the top of search results for 7 days.
                </p>
                <CheckoutButton
                  addon="featuredBoost"
                  label="Boost for $29"
                  className="mt-3 w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
                />
              </div>
            )}

            {/* YOUR PLAN */}
            <div className={`rounded-xl border p-5 ${isPremium ? "bg-gradient-to-br from-amber-50 to-white border-amber-200" : "bg-white border-gray-200"}`}>
              <h2 className="font-semibold text-gray-900">Your Plan</h2>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                  isPremium ? "bg-amber-100 text-amber-800" : isBasic ? "bg-primary-100 text-primary-800" : "bg-gray-100 text-gray-700"
                }`}>
                  {isPremium && <Crown className="h-3.5 w-3.5" />}
                  {tierLabel(tier)}
                </span>
                {subscription && (
                  <span className="text-xs text-gray-400">
                    Renews {new Date(subscription.current_period_end || Date.now()).toLocaleDateString()}
                  </span>
                )}
              </div>

              {!isPremium && (
                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-gray-600">
                    {isBasic
                      ? "Unlock competitor insights, advanced analytics, and photo gallery by upgrading to Premium."
                      : "Upgrade to get analytics, lead tracking, priority placement, and more."}
                  </p>
                  <CheckoutButton
                    tier={isBasic ? "premium" : "basic"}
                    label={isBasic ? "Go Premium — $99/mo" : "Upgrade to Basic — $49/mo"}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                      isBasic ? "bg-amber-500 hover:bg-amber-600" : "bg-primary-600 hover:bg-primary-700"
                    }`}
                  />
                </div>
              )}
            </div>

            {/* FEATURE UNLOCK LIST — show what next tier unlocks */}
            {!isPremium && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h2 className="font-semibold text-gray-900 text-sm">
                  {isBasic ? "Unlock with Premium" : "Unlock with Basic"}
                </h2>
                <ul className="mt-3 space-y-2">
                  {(isBasic
                    ? [
                        "Advanced performance analytics",
                        "Competitor insights & ranking",
                        "Photo gallery management",
                        "Priority homepage placement",
                        "Review response capabilities",
                        "Sponsored blog mentions",
                      ]
                    : [
                        "Real-time analytics dashboard",
                        "Lead tracking & notifications",
                        "Verified badge",
                        "Priority search placement",
                        "Up to 5 photo uploads",
                        "Basic lead tracking",
                      ]
                  ).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Onboarding (no business linked) ----------
function OnboardingView({ userName }: { userName: string }) {
  return (
    <div className="container-main py-12">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <Shield className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}!
        </h1>
        <p className="mt-2 text-gray-600">
          Your account is set up. Now let&apos;s link it to your business listing.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-lg">
        {/* Search for business */}
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-6">
          <h2 className="text-lg font-bold text-gray-900">Claim Your Business</h2>
          <p className="mt-1 text-sm text-gray-600">
            Search for your business below. Once verified, you&apos;ll get full access to your portal.
          </p>
          <form className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search for your business name..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button type="submit" className="btn-primary shrink-0">Search</button>
          </form>
          <p className="mt-2 text-xs text-gray-400">
            Can&apos;t find your business?{" "}
            <Link href="/request-service" className="text-primary-600 hover:underline">Add it here</Link>
          </p>
        </div>

        {/* Or choose a plan */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-center">
          <h3 className="font-semibold text-gray-900">Choose a Plan</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started with a free listing or upgrade for premium features.
          </p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link href="/claim-listing" className="btn-secondary text-sm">
              Free Listing
            </Link>
            <Link href="/pricing" className="btn-primary text-sm gap-1.5">
              View Plans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
