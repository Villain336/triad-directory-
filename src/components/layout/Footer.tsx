import Link from "next/link";
import { MapPin } from "lucide-react";
import { SITE_NAME, SUPPORT_EMAIL, PHONE } from "@/lib/constants";
import { cities } from "@/lib/data/cities";
import { getFeaturedCategories } from "@/lib/data/categories";

export default function Footer() {
  const featuredCategories = getFeaturedCategories();
  const majorCities = cities.filter((c) => c.featured);
  const otherCities = cities.filter((c) => !c.featured).slice(0, 12);

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      {/* CTA Banner */}
      <div className="bg-primary-700">
        <div className="container-main py-10 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Grow Your Business?
          </h2>
          <p className="mt-2 text-primary-200">
            Get found by thousands of customers searching for services in the Triad
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/advertise" className="btn-accent">
              View Advertising Options
            </Link>
            <Link
              href="/claim-listing"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Claim Your Free Listing
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Links - SEO Rich */}
      <div className="container-main py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* About */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold text-gray-900">{SITE_NAME}</span>
            </Link>
            <p className="mt-3 text-sm text-gray-600">
              North Carolina&apos;s most comprehensive service business directory.
              Connecting customers with trusted pros across the Triad, Triangle & beyond.
            </p>
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-primary-600">
                  {SUPPORT_EMAIL}
                </a>
              </p>
              <p>
                <a href={`tel:${PHONE}`} className="hover:text-primary-600">
                  {PHONE}
                </a>
              </p>
            </div>
          </div>

          {/* Major Cities */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Major Cities
            </h3>
            <ul className="mt-3 space-y-2">
              {majorCities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className="text-sm text-gray-600 hover:text-primary-600"
                  >
                    {city.name}, NC
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Cities */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              More Cities
            </h3>
            <ul className="mt-3 space-y-2">
              {otherCities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className="text-sm text-gray-600 hover:text-primary-600"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Popular Services
            </h3>
            <ul className="mt-3 space-y-2">
              {featuredCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-gray-600 hover:text-primary-600"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Resources
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-primary-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-primary-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-gray-600 hover:text-primary-600">
                  Community Q&A
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-sm text-gray-600 hover:text-primary-600">
                  Deals & Promotions
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="text-sm text-gray-600 hover:text-primary-600">
                  Emergency Services
                </Link>
              </li>
              <li>
                <Link href="/tools/cost-estimator" className="text-sm text-gray-600 hover:text-primary-600">
                  Cost Estimator
                </Link>
              </li>
              <li>
                <Link href="/price-check" className="text-sm text-gray-600 hover:text-primary-600">
                  Price Check
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm text-gray-600 hover:text-primary-600">
                  Compare Businesses
                </Link>
              </li>
              <li>
                <Link href="/request-service" className="text-sm text-gray-600 hover:text-primary-600">
                  Request a Service
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-sm text-gray-600 hover:text-primary-600">
                  Advertise
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-primary-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/claim-listing"
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  Claim Listing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom SEO City Links */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Serving all Triad communities:</strong>{" "}
            {cities.map((city, i) => (
              <span key={city.slug}>
                <Link href={`/${city.slug}`} className="hover:text-primary-600">
                  {city.name}
                </Link>
                {i < cities.length - 1 ? " • " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 bg-gray-100">
        <div className="container-main flex flex-col sm:flex-row items-center justify-between py-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <Link href="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-700">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
