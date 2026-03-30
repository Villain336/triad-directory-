import Link from "next/link";
import { Building, ExternalLink, Star, MapPin, Search } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 60;

async function getListings(search?: string) {
  const supabase = createServerClient();
  let query = supabase
    .from("businesses")
    .select("id, name, slug, city_name, phone, rating, review_count, tier, status, data_source, created_at, categories!inner(name, slug), cities!inner(slug)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data } = await query;
  return data || [];
}

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const listings = await getListings(searchParams.q);

  return (
    <div className="container-main py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
          <p className="mt-1 text-sm text-gray-500">{listings.length} businesses</p>
        </div>
      </div>

      {/* Search */}
      <form className="mt-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search listings..."
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </form>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-3 px-4 text-left font-medium text-gray-700">Business</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">City</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Category</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Rating</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Tier</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Source</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listings.map((listing: any) => (
              <tr key={listing.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{listing.name}</div>
                  <div className="text-xs text-gray-500">{listing.phone}</div>
                </td>
                <td className="py-3 px-4 text-gray-600">{listing.city_name}</td>
                <td className="py-3 px-4 text-gray-600">{listing.categories?.name}</td>
                <td className="py-3 px-4">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {listing.rating} ({listing.review_count})
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    listing.tier === "premium" ? "bg-amber-100 text-amber-800" :
                    listing.tier === "elite" ? "bg-purple-100 text-purple-800" :
                    listing.tier === "basic" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {listing.tier}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-500">{listing.data_source || "manual"}</td>
                <td className="py-3 px-4">
                  <Link
                    href={`/${listing.cities?.slug}/${listing.categories?.slug}/${listing.slug}`}
                    className="text-primary-600 hover:underline text-xs flex items-center gap-1"
                    target="_blank"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
