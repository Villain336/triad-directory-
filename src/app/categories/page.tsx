import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { getFeaturedCities } from "@/lib/data/cities";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "All Business Categories",
  description:
    "Browse all business and service categories in the Piedmont Triad. Find plumbers, electricians, HVAC, contractors, restaurants, attorneys, and more.",
  path: "/categories",
});

export default function CategoriesPage() {
  const featuredCities = getFeaturedCities();

  return (
    <div className="container-main py-10">
      <h1 className="section-heading">All Service Categories</h1>
      <p className="section-subheading">
        Browse every type of business and service available in the Triad
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <div key={cat.slug} className="card p-5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Search className="h-5 w-5" />
            </div>
            <h2 className="mt-3 font-semibold text-gray-900">{cat.name}</h2>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{cat.description}</p>
            <div className="mt-3 space-y-1">
              {featuredCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}/${cat.slug}`}
                  className="block text-xs text-primary-600 hover:text-primary-800"
                >
                  {cat.name} in {city.name} →
                </Link>
              ))}
            </div>
            <Link
              href={`/categories/${cat.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
