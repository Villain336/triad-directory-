import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Users, Shield, Heart } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "About Us",
  description:
    "Learn about Triad Directory, the Piedmont Triad's most comprehensive business and services directory. Connecting local customers with trusted businesses.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container-main py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="section-heading">About {SITE_NAME}</h1>
        <div className="mt-8 prose prose-gray max-w-none">
          <p className="text-lg text-gray-600">
            {SITE_NAME} is the Piedmont Triad&apos;s most comprehensive business and services
            directory. We connect local customers with trusted businesses across
            Greensboro, Winston-Salem, High Point, and 30+ communities throughout the
            region.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is simple: make it easy for Triad residents to find the best
            local businesses, and help local businesses grow by connecting them with
            customers who need their services.
          </p>

          <h2>Why We Built This</h2>
          <p>
            The Piedmont Triad is home to over 1.6 million people across multiple
            counties and dozens of cities. Finding a trusted, licensed service provider
            shouldn&apos;t require hours of searching. We created {SITE_NAME} to be the
            single source of truth for local business discovery in our region.
          </p>

          <h2>What Makes Us Different</h2>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {[
            {
              icon: MapPin,
              title: "Hyper-Local Focus",
              desc: "We cover every city and town in the Triad, not just the big three. From Summerfield to Randleman, every community matters.",
            },
            {
              icon: Shield,
              title: "Verified Businesses",
              desc: "Premium-listed businesses are verified for licensing, insurance, and quality. We do the vetting so you don't have to.",
            },
            {
              icon: Users,
              title: "Community-Driven",
              desc: "Real reviews from real Triad residents. No fake reviews, no paid rankings. Honest recommendations you can trust.",
            },
            {
              icon: Heart,
              title: "Built for the Triad",
              desc: "We live and work in the Triad. We understand the local market and what our neighbors need.",
            },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <item.icon className="h-8 w-8 text-primary-600" />
              <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-primary-50 border border-primary-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Own a Business in the Triad?</h2>
          <p className="mt-2 text-gray-600">
            Get listed for free and start reaching new customers today.
          </p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link href="/claim-listing" className="btn-primary">
              Claim Your Listing
            </Link>
            <Link href="/advertise" className="btn-secondary">
              Advertising Options
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
