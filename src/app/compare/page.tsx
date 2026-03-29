"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  Phone,
  CheckCircle,
  X,
  Plus,
  Crown,
  Calendar,
  Shield,
  MapPin,
} from "lucide-react";
import { sampleListings } from "@/lib/data/sample-listings";
import { formatPhone } from "@/lib/utils";
import type { Listing } from "@/types/listing";

export default function ComparePage() {
  const [selected, setSelected] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = searchQuery.length >= 2
    ? sampleListings.filter(
        (l) =>
          l.businessName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selected.find((s) => s.id === l.id)
      )
    : [];

  function addBusiness(listing: Listing) {
    if (selected.length < 3) {
      setSelected([...selected, listing]);
      setSearchQuery("");
    }
  }

  function removeBusiness(id: string) {
    setSelected(selected.filter((s) => s.id !== id));
  }

  return (
    <div className="container-main py-10">
      <h1 className="section-heading">Compare Businesses</h1>
      <p className="section-subheading">
        Select up to 3 businesses to compare side-by-side
      </p>

      {/* Business Selector */}
      {selected.length < 3 && (
        <div className="mt-6 relative max-w-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a business to add..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg z-10 max-h-60 overflow-y-auto">
              {searchResults.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => addBusiness(listing)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <Plus className="h-4 w-4 text-primary-600 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {listing.businessName}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {listing.city}, NC &middot; {listing.rating} ★
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comparison Table */}
      {selected.length > 0 ? (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-48 p-3 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                  &nbsp;
                </th>
                {selected.map((biz) => (
                  <th
                    key={biz.id}
                    className="min-w-[220px] p-3 text-left border-b border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/${biz.citySlug}/${biz.categorySlug}/${biz.slug}`}
                          className="text-sm font-bold text-gray-900 hover:text-primary-600"
                        >
                          {biz.businessName}
                        </Link>
                        {(biz.tier === "premium" || biz.tier === "elite") && (
                          <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs text-accent-700">
                            <Crown className="h-3 w-3" aria-hidden="true" /> Premium
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeBusiness(biz.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                        aria-label={`Remove ${biz.businessName}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <CompareRow label="Rating" icon={Star}>
                {selected.map((biz) => (
                  <td key={biz.id} className="p-3 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent-400 text-accent-400" aria-hidden="true" />
                      <span className="font-semibold">{biz.rating}</span>
                      <span className="text-gray-500">({biz.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </CompareRow>
              <CompareRow label="Location" icon={MapPin}>
                {selected.map((biz) => (
                  <td key={biz.id} className="p-3 border-b border-gray-100">
                    {biz.city}, NC {biz.zip}
                  </td>
                ))}
              </CompareRow>
              <CompareRow label="Verified" icon={CheckCircle}>
                {selected.map((biz) => (
                  <td key={biz.id} className="p-3 border-b border-gray-100">
                    {biz.isVerified ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" aria-hidden="true" /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                ))}
              </CompareRow>
              <CompareRow label="Established" icon={Calendar}>
                {selected.map((biz) => (
                  <td key={biz.id} className="p-3 border-b border-gray-100">
                    {biz.yearEstablished
                      ? `${biz.yearEstablished} (${new Date().getFullYear() - biz.yearEstablished} yrs)`
                      : "—"}
                  </td>
                ))}
              </CompareRow>
              <CompareRow label="License" icon={Shield}>
                {selected.map((biz) => (
                  <td key={biz.id} className="p-3 border-b border-gray-100">
                    {biz.licenseNumber || "—"}
                  </td>
                ))}
              </CompareRow>
              <CompareRow label="Specialties" icon={Star}>
                {selected.map((biz) => (
                  <td key={biz.id} className="p-3 border-b border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {biz.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </CompareRow>
              <CompareRow label="Phone" icon={Phone}>
                {selected.map((biz) => (
                  <td key={biz.id} className="p-3 border-b border-gray-100">
                    <a
                      href={`tel:${biz.phone}`}
                      className="text-primary-600 hover:underline"
                    >
                      {formatPhone(biz.phone)}
                    </a>
                  </td>
                ))}
              </CompareRow>
              {/* CTA Row */}
              <tr>
                <td className="p-3" />
                {selected.map((biz) => (
                  <td key={biz.id} className="p-3">
                    <div className="space-y-2">
                      <a
                        href={`tel:${biz.phone}`}
                        className="btn-primary w-full gap-2 text-xs !py-2"
                      >
                        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                        Call Now
                      </a>
                      <Link
                        href={`/${biz.citySlug}/${biz.categorySlug}/${biz.slug}`}
                        className="btn-secondary w-full text-xs !py-2"
                      >
                        View Profile
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-12 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <Plus className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 text-gray-500">
            Search and add businesses above to start comparing
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Compare ratings, reviews, credentials, and specialties side-by-side
          </p>
        </div>
      )}
    </div>
  );
}

function CompareRow({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <td className="p-3 border-b border-gray-100 font-medium text-gray-700">
        <span className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
          {label}
        </span>
      </td>
      {children}
    </tr>
  );
}
