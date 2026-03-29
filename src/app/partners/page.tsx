import { Metadata } from "next";
import Link from "next/link";
import {
  Handshake,
  CheckCircle,
  Crown,
  BarChart3,
  Users,
  Shield,
  ArrowRight,
  Percent,
  FileText,
  HeadphonesIcon,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import ContactForm from "@/components/lead-gen/ContactForm";

export const metadata: Metadata = generatePageMetadata({
  title: "Agency Partner Program",
  description:
    "Marketing agencies: give your Triad clients the edge with preferred rates, priority placement, and white-label reporting on Triad Directory.",
  path: "/partners",
});

const partnerTiers = [
  {
    name: "Silver Partner",
    clients: "1-5 clients",
    discount: "20%",
    features: [
      "20% off all listing plans for clients",
      "Bulk listing setup assistance",
      "Monthly performance summary",
      "Co-branded client reports",
      "Standard support response time",
    ],
  },
  {
    name: "Gold Partner",
    clients: "6-15 clients",
    discount: "25%",
    features: [
      "25% off all listing plans for clients",
      "Dedicated account manager",
      "White-label performance dashboards",
      "Quarterly strategy reviews",
      "Priority listing setup (24hr)",
      "Free sidebar ad for your agency",
    ],
    popular: true,
  },
  {
    name: "Platinum Partner",
    clients: "16+ clients",
    discount: "30%",
    features: [
      "30% off all listing plans for clients",
      "Senior dedicated account manager",
      "Custom API access for reporting",
      "Monthly strategy calls",
      "Same-day listing setup",
      "Free banner ad for your agency",
      "Co-marketing opportunities",
      "Early access to new features",
    ],
  },
];

export default function PartnersPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="container-main py-12 sm:py-16">
          <div className="flex items-center gap-2 text-primary-200 text-sm mb-3">
            <Handshake className="h-5 w-5" aria-hidden="true" />
            For Marketing & SEO Agencies
          </div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            Agency Partner Program
          </h1>
          <p className="mt-4 text-lg text-primary-200 max-w-2xl">
            Give your Triad clients the competitive edge. Preferred rates, priority
            placement, white-label reporting, and a dedicated account manager — all
            designed for agencies managing multiple local businesses.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#apply" className="btn-accent">
              Apply Now
            </a>
            <Link href="/media-kit" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              View Media Kit
            </Link>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-12 border-b border-gray-200">
        <div className="container-main">
          <h2 className="section-heading text-center">Why Agencies Partner With Us</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Percent,
                title: "Volume Discounts",
                desc: "Save 20-30% on all client listings. The more clients you bring, the more you save.",
              },
              {
                icon: BarChart3,
                title: "White-Label Reporting",
                desc: "Branded dashboards showing views, calls, form submissions, and ROI for each client.",
              },
              {
                icon: HeadphonesIcon,
                title: "Dedicated Support",
                desc: "Your own account manager for fast setup, changes, and strategy optimization.",
              },
              {
                icon: Crown,
                title: "Priority Placement",
                desc: "Your clients get bumped to the top of search results in their category and city.",
              },
              {
                icon: FileText,
                title: "Streamlined Billing",
                desc: "One invoice for all clients. We handle billing, you focus on marketing.",
              },
              {
                icon: Shield,
                title: "Proven ROI",
                desc: "Directory listings complement your SEO work. Local citations boost domain authority.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Tiers */}
      <section className="py-12 bg-beige-50">
        <div className="container-main">
          <h2 className="section-heading text-center">Partner Tiers</h2>
          <p className="section-subheading text-center">
            Choose the tier that matches your agency size
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {partnerTiers.map((tier) => (
              <div
                key={tier.name}
                className={`card relative p-6 flex flex-col ${
                  tier.popular ? "ring-2 ring-primary-500 border-primary-500" : ""
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{tier.clients}</p>
                  <p className="mt-2 text-3xl font-bold text-primary-700">{tier.discount} off</p>
                  <p className="text-xs text-gray-500">on all client listings</p>
                </div>
                <ul className="mt-6 flex-1 space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" aria-hidden="true" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#apply"
                  className={`mt-6 w-full text-center ${
                    tier.popular ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-12">
        <div className="container-main max-w-2xl">
          <h2 className="section-heading text-center">Apply to Partner</h2>
          <p className="section-subheading text-center">
            Tell us about your agency and we&apos;ll set up your partner account within 48 hours.
          </p>
          <div className="mt-8 card p-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
