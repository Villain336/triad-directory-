"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, ChevronDown, MapPin, Phone } from "lucide-react";
import { cities, getFeaturedCities } from "@/lib/data/cities";
import { SITE_NAME, PHONE } from "@/lib/constants";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const featuredCities = getFeaturedCities();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-800 text-white">
        <div className="container-main flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href={`tel:${PHONE}`} className="flex items-center gap-1 hover:text-accent-300">
              <Phone className="h-3.5 w-3.5" />
              <span>{PHONE}</span>
            </a>
            <span className="hidden sm:inline text-primary-300">|</span>
            <span className="hidden sm:inline text-primary-200">
              Serving the Piedmont Triad, NC
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/advertise" className="hover:text-accent-300 transition-colors">
              Advertise With Us
            </Link>
            <Link
              href="/claim-listing"
              className="rounded bg-accent-500 px-3 py-1 text-xs font-semibold text-gray-900 hover:bg-accent-400 transition-colors"
            >
              Claim Your Listing
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container-main">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary-600" />
              <div>
                <span className="text-xl font-bold text-gray-900">{SITE_NAME}</span>
                <span className="hidden sm:block text-xs text-gray-500">
                  Greensboro • Winston-Salem • High Point
                </span>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form action="/search" method="GET" className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search businesses, services, or categories..."
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </form>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              <div
                className="relative"
                onMouseEnter={() => setCitiesOpen(true)}
                onMouseLeave={() => setCitiesOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary-600">
                  Cities <ChevronDown className="h-4 w-4" />
                </button>
                {citiesOpen && (
                  <div className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-gray-200 bg-white py-2 shadow-xl">
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Major Cities
                    </div>
                    {featuredCities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${city.slug}`}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                      >
                        {city.name}
                      </Link>
                    ))}
                    <hr className="my-1" />
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      All Cities
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {cities
                        .filter((c) => !c.featured)
                        .map((city) => (
                          <Link
                            key={city.slug}
                            href={`/${city.slug}`}
                            className="block px-3 py-1.5 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                          >
                            {city.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/categories"
                className="text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Categories
              </Link>
              <Link
                href="/community"
                className="text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Community
              </Link>
              <Link
                href="/deals"
                className="text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Deals
              </Link>
              <Link href="/advertise" className="btn-primary text-sm !py-2 !px-4">
                Get Listed
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <form action="/search" method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="q"
                placeholder="Search businesses..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </form>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="container-main py-4 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Major Cities
              </div>
              {featuredCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-1.5 text-sm text-gray-700"
                >
                  {city.name}
                </Link>
              ))}
              <hr />
              <Link
                href="/categories"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-sm font-medium text-gray-700"
              >
                All Categories
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-sm font-medium text-gray-700"
              >
                Blog
              </Link>
              <Link
                href="/advertise"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-sm font-medium text-primary-600"
              >
                Advertise With Us
              </Link>
              <Link
                href="/claim-listing"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full text-center"
              >
                Claim Your Listing
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
