import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

interface AgencyCTAProps {
  variant?: "inline" | "banner" | "sidebar";
  cityName?: string;
  categoryName?: string;
}

export default function AgencyCTA({ variant = "inline", cityName, categoryName }: AgencyCTAProps) {
  if (variant === "banner") {
    return (
      <div className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Want Your Business at the Top?</h3>
            <p className="mt-1 text-sm text-gray-300">
              Our marketing team builds websites, runs SEO, and generates leads for NC service businesses.
            </p>
          </div>
          <Link href="/marketing" className="btn-accent shrink-0 gap-1.5">
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="card p-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700">
        <TrendingUp className="h-6 w-6 text-accent-400" aria-hidden="true" />
        <h3 className="mt-2 font-bold">Grow Your Business</h3>
        <p className="mt-1 text-sm text-gray-300">
          Get a premium listing, custom website, and SEO strategy from our marketing team.
        </p>
        <Link href="/marketing" className="btn-accent w-full mt-3 text-sm">
          Get Started
        </Link>
      </div>
    );
  }

  // inline (default) — goes under category listings
  return (
    <div className="rounded-xl border border-beige-300 bg-beige-100 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            {categoryName && cityName
              ? `Want more ${categoryName.toLowerCase()} leads in ${cityName}?`
              : "Want more leads from this directory?"}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Premium listings get 10x more visibility. Our team also builds websites and runs SEO campaigns for NC service businesses.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/pricing" className="btn-primary text-sm !py-2">
            Go Premium
          </Link>
          <Link href="/marketing" className="btn-secondary text-sm !py-2">
            Marketing Help
          </Link>
        </div>
      </div>
    </div>
  );
}
