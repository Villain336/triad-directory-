import Link from "next/link";
import { Metadata } from "next";
import { Tag, Percent, Gift, Clock, Users } from "lucide-react";
import { getActiveDeals } from "@/lib/data/deals";
import { generatePageMetadata } from "@/lib/seo/metadata";
import AdSlot from "@/components/ads/AdSlot";

export const metadata: Metadata = generatePageMetadata({
  title: "Local Deals & Promotions",
  description:
    "Save money on home services in the Piedmont Triad. Exclusive deals and promotions from verified local businesses in Greensboro, Winston-Salem, High Point, and more.",
  path: "/deals",
});

export default function DealsPage() {
  const deals = getActiveDeals();

  return (
    <>
      <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container-main py-10 sm:py-14">
          <div className="flex items-center gap-2 text-primary-200 text-sm mb-2">
            <Tag className="h-4 w-4" aria-hidden="true" />
            Exclusive Offers
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Local Deals & Promotions
          </h1>
          <p className="mt-3 max-w-2xl text-primary-200 text-lg">
            Save money on home services, repairs, and more from verified Triad businesses.
            These deals are exclusive to Triad Directory.
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {deals.map((deal) => (
              <article key={deal.id} className="card overflow-hidden">
                <div className="flex items-center gap-2 bg-primary-50 border-b border-primary-100 px-5 py-2">
                  {deal.discountType === "percent" ? (
                    <Percent className="h-4 w-4 text-primary-600" aria-hidden="true" />
                  ) : deal.discountType === "free" ? (
                    <Gift className="h-4 w-4 text-green-600" aria-hidden="true" />
                  ) : (
                    <Tag className="h-4 w-4 text-primary-600" aria-hidden="true" />
                  )}
                  <span className="text-sm font-semibold text-primary-700">
                    {deal.discountType === "percent"
                      ? `${deal.discountValue}% Off`
                      : deal.discountType === "free"
                        ? `$${deal.discountValue} Value — FREE`
                        : `$${deal.discountValue} Off`}
                  </span>
                </div>
                <div className="p-5">
                  <Link
                    href={`/${deal.citySlug}/${deal.categorySlug}`}
                    className="text-xs text-gray-500 hover:text-primary-600"
                  >
                    {deal.businessName} &middot; {deal.citySlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Link>
                  <h2 className="mt-1 text-xl font-bold text-gray-900">{deal.title}</h2>
                  <p className="mt-2 text-sm text-gray-600">{deal.description}</p>

                  {deal.code && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-beige-100 border border-beige-300 px-4 py-2">
                      <span className="text-xs text-gray-500">Use code:</span>
                      <span className="font-mono font-bold text-primary-700">{deal.code}</span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      Expires {new Date(deal.expiresAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" aria-hidden="true" />
                      {deal.claimCount} claimed
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-gray-400">{deal.terms}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900">For Business Owners</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create exclusive deals to attract new customers. Premium members
                can post unlimited promotions.
              </p>
              <Link href="/pricing" className="btn-primary w-full mt-3 text-sm">
                Get Premium
              </Link>
            </div>
            <AdSlot position="sidebar" />
            <AdSlot position="sidebar" />
          </aside>
        </div>
      </div>
    </>
  );
}
