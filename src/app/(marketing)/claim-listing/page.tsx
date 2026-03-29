import { Metadata } from "next";
import { CheckCircle, Shield, TrendingUp, Clock } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import ContactForm from "@/components/lead-gen/ContactForm";

export const metadata: Metadata = generatePageMetadata({
  title: "Claim Your Business Listing",
  description:
    "Claim your free business listing on Triad Directory. Get found by thousands of customers in Greensboro, Winston-Salem, High Point, and across the Triad.",
  path: "/claim-listing",
});

export default function ClaimListingPage() {
  return (
    <div className="container-main py-12">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Claim Your Free Business Listing
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Get your business listed in the Triad&apos;s most comprehensive directory. It
            takes less than 5 minutes and it&apos;s completely free.
          </p>

          <div className="mt-8 space-y-6">
            {[
              {
                icon: Clock,
                title: "Quick Setup",
                desc: "Your listing goes live within 24 hours of submission.",
              },
              {
                icon: Shield,
                title: "Free Forever",
                desc: "Our basic listing tier is completely free with no hidden fees.",
              },
              {
                icon: CheckCircle,
                title: "Get Verified",
                desc: "Verified badges build trust and increase click-through rates.",
              },
              {
                icon: TrendingUp,
                title: "Grow Your Business",
                desc: "Upgrade anytime to Premium for enhanced visibility and lead tracking.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:sticky lg:top-24">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
