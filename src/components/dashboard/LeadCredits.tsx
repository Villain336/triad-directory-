"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingDown, ShoppingCart, Clock } from "lucide-react";
import CheckoutButton from "@/components/CheckoutButton";

interface LeadCreditUsage {
  lead_id: string;
  deducted_at: string;
}

interface LeadCreditsData {
  balance: number;
  totalPurchased: number;
  totalUsed: number;
  history: LeadCreditUsage[];
}

interface LeadCreditsProps {
  businessId: string;
}

const LEAD_PACKS = [
  {
    addon: "leadPack10",
    leads: 10,
    price: 49,
    perLead: "4.90",
    badge: null,
  },
  {
    addon: "leadPack25",
    leads: 25,
    price: 99,
    perLead: "3.96",
    badge: "Best Value",
  },
  {
    addon: "leadPack50",
    leads: 50,
    price: 149,
    perLead: "2.98",
    badge: "Most Popular",
  },
];

export default function LeadCredits({ businessId }: LeadCreditsProps) {
  const [data, setData] = useState<LeadCreditsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;
    fetch(`/api/leads/credits?businessId=${encodeURIComponent(businessId)}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() =>
        setData({ balance: 0, totalPurchased: 0, totalUsed: 0, history: [] })
      )
      .finally(() => setLoading(false));
  }, [businessId]);

  const balance = data?.balance ?? 0;
  const totalPurchased = data?.totalPurchased ?? 0;
  const totalUsed = data?.totalUsed ?? 0;
  const usedPercent = totalPurchased > 0 ? Math.round((totalUsed / totalPurchased) * 100) : 0;

  return (
    <div className="card p-5">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Zap className="h-5 w-5 text-amber-500" aria-hidden="true" />
        Lead Credits
      </h2>

      {/* Balance Display */}
      <div className="mt-4 text-center">
        {loading ? (
          <div className="h-14 flex items-center justify-center">
            <div className="h-5 w-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <p className="text-5xl font-bold text-gray-900">{balance}</p>
            <p className="mt-1 text-sm text-gray-500">credits available</p>
          </>
        )}
      </div>

      {/* Usage Bar */}
      {totalPurchased > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 flex items-center gap-1">
              <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
              {totalUsed} of {totalPurchased} used
            </span>
            <span className="font-medium text-gray-900">{usedPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                usedPercent >= 80
                  ? "bg-red-500"
                  : usedPercent >= 50
                  ? "bg-amber-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${usedPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Buy More Credits */}
      <div className="mt-5 pt-5 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-3">
          <ShoppingCart className="h-4 w-4 text-gray-500" aria-hidden="true" />
          Buy More Credits
        </h3>
        <div className="space-y-2">
          {LEAD_PACKS.map((pack) => (
            <div
              key={pack.addon}
              className={`relative rounded-lg border p-3 ${
                pack.badge === "Best Value"
                  ? "border-primary-300 bg-primary-50"
                  : pack.badge === "Most Popular"
                  ? "border-amber-300 bg-amber-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {pack.badge && (
                <span
                  className={`absolute -top-2 right-3 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    pack.badge === "Best Value"
                      ? "bg-primary-600 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {pack.badge}
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {pack.leads} leads
                  </p>
                  <p className="text-xs text-gray-500">${pack.perLead}/lead</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-gray-900">
                    ${pack.price}
                  </span>
                  <CheckoutButton
                    addon={pack.addon}
                    label="Buy"
                    className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                      pack.badge === "Best Value"
                        ? "bg-primary-600 text-white hover:bg-primary-700"
                        : pack.badge === "Most Popular"
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-gray-800 text-white hover:bg-gray-900"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Usage */}
      {data && data.history.length > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-3">
            <Clock className="h-4 w-4 text-gray-500" aria-hidden="true" />
            Recent Usage
          </h3>
          <div className="space-y-2">
            {data.history.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs text-gray-600"
              >
                <span className="truncate max-w-[140px]">
                  Lead #{item.lead_id.slice(0, 8)}
                </span>
                <span className="text-gray-400 shrink-0 ml-2">
                  {new Date(item.deducted_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
