import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AgencyCTAProps {
  variant?: "inline" | "banner" | "sidebar";
  cityName?: string;
  categoryName?: string;
}

export default function AgencyCTA({ variant = "inline", cityName, categoryName }: AgencyCTAProps) {
  if (variant === "banner") {
    return (
      <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: "#faf8f5" }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/IMG_2445.png" alt="Launchabl" className="h-14 w-auto" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Want Your Business at the Top?</h3>
              <p className="mt-0.5 text-sm text-gray-600">
                Websites, SEO, and ads for NC service businesses.
              </p>
            </div>
          </div>
          <Link href="/marketing" className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors gap-1.5 shrink-0">
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="rounded-xl overflow-hidden border border-orange-100" style={{ backgroundColor: "#faf8f5" }}>
        <div className="p-5">
          <img src="/IMG_2445.png" alt="Launchabl" className="h-14 w-auto" />
          <h3 className="mt-3 font-bold text-gray-900">Grow Your Business</h3>
          <p className="mt-1 text-sm text-gray-600">
            Get a premium listing, custom website, and SEO strategy.
          </p>
          <Link href="/marketing" className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors gap-1.5">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // inline — bottom of service pages
  return (
    <div className="rounded-xl border border-orange-100 p-5 sm:p-6" style={{ backgroundColor: "#faf8f5" }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <img src="/IMG_2445.png" alt="Launchabl" className="h-14 w-auto shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900">
              {categoryName && cityName
                ? `Want more ${categoryName.toLowerCase()} leads in ${cityName}?`
                : "Need help getting more customers?"}
            </h3>
            <p className="mt-0.5 text-sm text-gray-600">
              We build websites and run SEO for NC service businesses.
            </p>
          </div>
        </div>
        <Link
          href="/marketing"
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors gap-1.5 shrink-0"
        >
          Marketing Help <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
