import Link from "next/link";
import { Metadata } from "next";
import {
  Globe,
  Search,
  BarChart3,
  Phone,
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  TrendingUp,
  Users,
  MousePointerClick,
  Target,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Marketing Services for NC Service Businesses",
  description:
    "Get more customers with a premium listing, professional website, local SEO, and Google Ads management. Built by Launchabl for NC service businesses.",
  path: "/marketing",
});

const services = [
  {
    icon: Globe,
    title: "Website Design & Development",
    desc: "Custom, mobile-first websites that convert visitors into calls. Built fast, optimized for Google, designed to make your phone ring.",
    features: ["Mobile-responsive design", "Click-to-call integration", "Google-optimized pages", "Contact forms that notify you instantly"],
  },
  {
    icon: Search,
    title: "Local SEO",
    desc: "Dominate Google Maps and local search results. We optimize your Google Business Profile, build citations, and create content that ranks.",
    features: ["Google Business Profile optimization", "Local citation building", "Review generation strategy", "Monthly ranking reports"],
  },
  {
    icon: MousePointerClick,
    title: "Google Ads Management",
    desc: "Targeted ads that put your business in front of customers searching for your services right now. No wasted spend.",
    features: ["Keyword research & targeting", "Ad copy that converts", "Call tracking & reporting", "Monthly optimization"],
  },
  {
    icon: Star,
    title: "Premium Directory Listing",
    desc: "Top placement on NC Service Businesses with verified badges, enhanced profile, reviews, and lead forwarding. Included with all packages.",
    features: ["Priority placement in search results", "Verified & Premium badges", "Lead notifications to your phone", "Performance analytics dashboard"],
  },
];

const caseStudies = [
  {
    business: "Garrico Plumbing",
    city: "Raleigh",
    category: "Plumbing",
    result: "134 five-star reviews and top placement for 'plumber Raleigh NC'",
    metric: "5.0",
    metricLabel: "Google Rating",
    slug: "garrico-plumbing",
  },
  {
    business: "Atlas Parking Lot Solutions",
    city: "Greensboro",
    category: "Paving & Striping",
    result: "Multi-city presence with premium listings across the Triad and Triangle",
    metric: "2",
    metricLabel: "Markets Covered",
    slug: "atlas-parking-lot",
  },
  {
    business: "Cagle's Pressure Washing",
    city: "Asheboro",
    category: "Pressure Washing",
    result: "New website build + premium directory listing serving all of Randolph County",
    metric: "1st",
    metricLabel: "In Category",
    slug: "cagles-pressure-washing",
  },
];

export default function MarketingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container-main py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-1.5 text-sm text-orange-300 border border-orange-500/30 mb-4">
              <img src="/launchabl-logo.png" alt="Launchabl" className="h-5 w-auto" />
              Powered by Launchabl
            </div>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Stop Waiting for the Phone to Ring.{" "}
              <span className="text-orange-400">Make It Ring.</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl">
              We build websites, run SEO campaigns, and manage ads for NC service
              businesses. Your competition is already online — let&apos;s make sure
              customers find you first.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="https://launchabl.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors gap-2"
              >
                <img src="/launchabl-logo.png" alt="" className="h-4 w-auto" />
                Book Free Consultation <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/case-studies" className="btn-secondary text-white border-white/20 hover:bg-white/10">
                See Our Results
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container-main py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">1,200+</p>
              <p className="text-sm text-gray-500">Businesses Listed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">48</p>
              <p className="text-sm text-gray-500">NC Cities Covered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">50+</p>
              <p className="text-sm text-gray-500">Service Categories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">100%</p>
              <p className="text-sm text-gray-500">NC Focused</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="section-heading">Everything Your Business Needs to Grow Online</h2>
            <p className="section-subheading">
              We handle the marketing so you can focus on the work. Each service
              builds on the others for maximum impact.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <service.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                </div>
                <p className="mt-3 text-sm text-gray-600">{service.desc}</p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" aria-hidden="true" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Preview */}
      <section className="bg-beige-100 py-16">
        <div className="container-main">
          <div className="text-center">
            <h2 className="section-heading">Real Results for Real NC Businesses</h2>
            <p className="section-subheading">
              Here&apos;s what happens when NC service businesses work with us
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {caseStudies.map((study) => (
              <div key={study.slug} className="card p-6 text-center">
                <p className="text-4xl font-bold text-primary-600">{study.metric}</p>
                <p className="text-sm text-gray-500">{study.metricLabel}</p>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{study.business}</h3>
                <p className="text-sm text-gray-500">{study.city} · {study.category}</p>
                <p className="mt-3 text-sm text-gray-600">{study.result}</p>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Read Case Study <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container-main max-w-3xl">
          <h2 className="section-heading text-center">How It Works</h2>
          <div className="mt-10 space-y-8">
            {[
              {
                step: "1",
                title: "Free Consultation",
                desc: "We learn about your business, goals, and current marketing. No pressure, no commitment — just an honest assessment of where you stand and what's possible.",
              },
              {
                step: "2",
                title: "Custom Strategy",
                desc: "We build a plan specific to your service, city, and competition. No cookie-cutter templates. You'll know exactly what we'll do, what it costs, and what results to expect.",
              },
              {
                step: "3",
                title: "We Build & Launch",
                desc: "Website, SEO, directory listing, ads — we handle everything. You get a premium listing on NC Service Businesses included with every package.",
              },
              {
                step: "4",
                title: "Leads Start Coming In",
                desc: "Your phone rings, forms fill up, and you see exactly where every lead comes from. Monthly reports show your ROI in plain numbers.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 text-white text-center">
        <div className="container-main">
          <img src="/launchabl-logo.png" alt="Launchabl" className="h-10 w-auto mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Ready to Get More Customers?</h2>
          <p className="mt-2 text-orange-100 max-w-xl mx-auto">
            Book a free consultation. We&apos;ll show you exactly how to get your
            business in front of more NC customers.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://launchabl.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-600 shadow-sm hover:bg-orange-50 transition-colors gap-2"
            >
              Book Free Consultation <ArrowRight className="h-4 w-4" />
            </a>
            <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              View Directory Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
