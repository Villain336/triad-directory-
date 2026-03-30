import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Star, MapPin, TrendingUp } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Case Studies - Real Results for NC Service Businesses",
  description:
    "See how NC service businesses grew their customer base with premium listings, websites, and SEO from Launchabl + NC Service Businesses.",
  path: "/case-studies",
});

const studies = [
  {
    slug: "garrico-plumbing",
    business: "Garrico Plumbing LLC",
    city: "Raleigh, NC",
    category: "Plumbing",
    heroStat: "5.0",
    heroLabel: "Google Rating · 134 Reviews",
    challenge: "Needed to stand out in a competitive Raleigh plumbing market with dozens of established companies.",
    solution: "Premium directory listing with verified badges, review management strategy, and local SEO optimization.",
    results: [
      "134 five-star Google reviews",
      "Top placement for 'plumber Raleigh NC' searches",
      "Premium verified listing driving consistent leads",
      "5.0 star rating — highest in the Raleigh market",
    ],
  },
  {
    slug: "atlas-parking-lot",
    business: "Atlas Parking Lot Solutions",
    city: "Greensboro, NC",
    category: "Paving & Striping",
    heroStat: "2 Markets",
    heroLabel: "Triad + Triangle Coverage",
    challenge: "Needed online visibility across both the Triad and Triangle regions to serve commercial clients statewide.",
    solution: "Multi-city premium listings, professional website at atlaslotcare.com, and targeted content strategy.",
    results: [
      "Premium listings in both Raleigh and Greensboro markets",
      "Professional website showcasing services and projects",
      "Visibility for commercial paving, striping, and sealcoating searches",
      "Positioned as NC's go-to parking lot maintenance company",
    ],
  },
  {
    slug: "cagles-pressure-washing",
    business: "Cagle's Pressure Washing",
    city: "Asheboro, NC",
    category: "Pressure Washing",
    heroStat: "#1",
    heroLabel: "In Asheboro Pressure Washing",
    challenge: "New business needing online presence and credibility in a smaller market with limited competition but also limited search volume.",
    solution: "New website build, premium directory listing, and local SEO strategy targeting Randolph County and surrounding areas.",
    results: [
      "Professional website under development",
      "Premium listing as the top pressure washer in Asheboro",
      "Targeting all of Randolph County for service area coverage",
      "Building review base and local authority from day one",
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container-main py-12 sm:py-16">
          <h1 className="text-3xl font-bold sm:text-4xl">Case Studies</h1>
          <p className="mt-3 text-lg text-gray-300 max-w-2xl">
            Real results for real NC service businesses. See how our clients
            grew their customer base with premium listings and marketing.
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        <div className="space-y-8">
          {studies.map((study) => (
            <article key={study.slug} className="card overflow-hidden">
              <div className="grid md:grid-cols-3">
                {/* Left — Hero Stat */}
                <div className="bg-primary-50 p-8 flex flex-col items-center justify-center text-center">
                  <p className="text-5xl font-bold text-primary-700">{study.heroStat}</p>
                  <p className="mt-1 text-sm text-primary-600">{study.heroLabel}</p>
                  <div className="mt-4">
                    <p className="font-bold text-gray-900">{study.business}</p>
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {study.city}
                    </p>
                    <p className="text-xs text-gray-400">{study.category}</p>
                  </div>
                </div>

                {/* Right — Details */}
                <div className="md:col-span-2 p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900">{study.business}</h2>

                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Challenge</h3>
                    <p className="mt-1 text-sm text-gray-600">{study.challenge}</p>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Solution</h3>
                    <p className="mt-1 text-sm text-gray-600">{study.solution}</p>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Results</h3>
                    <ul className="mt-2 space-y-1.5">
                      {study.results.map((result) => (
                        <li key={result} className="flex items-start gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 mt-0.5 text-green-500 shrink-0" aria-hidden="true" />
                          <span className="text-gray-700">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl p-8 text-center border border-orange-100" style={{ backgroundColor: "#faf8f5" }}>
          <img src="/IMG_2445.png" alt="Launchabl" className="h-14 w-auto mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900">Want Results Like These?</h2>
          <p className="mt-2 text-gray-600 max-w-lg mx-auto">
            We help NC service businesses get found online, generate leads, and grow revenue.
            Free consultation — no strings attached.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <a href="https://launchabl.io" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors gap-1.5">
              Book Free Consultation <ArrowRight className="h-4 w-4" />
            </a>
            <Link href="/marketing" className="inline-flex items-center justify-center rounded-lg border border-orange-300 px-6 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors">
              View Services
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
