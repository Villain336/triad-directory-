import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "How We Verify Listings",
  description:
    "NCSB's verification methodology: NC business registration, license validation, insurance, and first-party review authenticity. Re-verified every quarter.",
  path: "/how-we-verify",
});

const LAST_UPDATED = new Date().toISOString().slice(0, 10);

export default function HowWeVerifyPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "How we verify", url: "/how-we-verify" },
        ])}
      />

      <div className="container-main">
        <Breadcrumbs items={[{ label: "How we verify" }]} />
      </div>

      <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container-main py-10 sm:py-14">
          <h1 className="text-3xl font-bold sm:text-4xl">How {SITE_NAME} Verifies Listings</h1>
          <p className="mt-3 max-w-2xl text-primary-200 text-lg">
            Every business on NCSB is independently verified before it appears. Here's
            exactly what we check — and what happens if a business stops meeting the bar.
          </p>
          <p className="mt-2 text-xs text-primary-300">
            Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        <article className="prose prose-gray max-w-3xl">
          <h2>The short version</h2>
          <p>
            A business is <strong>not listed</strong> on NCSB until we've confirmed four things:
          </p>
          <ol>
            <li>Active North Carolina business registration</li>
            <li>
              Any applicable state or municipal license is current and in good standing
            </li>
            <li>General liability insurance (or the trade-specific equivalent)</li>
            <li>
              First-party customer reviews — not scraped from third-party sites
            </li>
          </ol>
          <p>
            Verification is re-run every 90 days. A lapse in any of the four above
            causes the listing to be unpublished until the issue is resolved.
          </p>

          <h2>The long version</h2>

          <h3>1. Business registration</h3>
          <p>
            We look up each business directly in the{" "}
            <a href="https://www.sosnc.gov/online_services/search/by_title/_Business_Registration" rel="noopener noreferrer">
              NC Secretary of State business registry
            </a>{" "}
            and confirm the name, address, and registered agent match what the
            business submits. Sole proprietors who operate under a "doing business
            as" (DBA) name must have a DBA filed with the county register of deeds.
          </p>

          <h3>2. License verification</h3>
          <p>
            NC regulates most skilled trades at the state level. We check license
            status with the appropriate licensing authority for each trade:
          </p>
          <ul>
            <li>
              <strong>Plumbers, electricians, HVAC:</strong>{" "}
              <a href="https://ncbeec.org/" rel="noopener noreferrer">NC Board of Examiners of Electrical Contractors</a>,{" "}
              <a href="https://www.nclicensing.org/" rel="noopener noreferrer">NC State Board of Examiners of Plumbing, Heating and Fire Sprinkler Contractors</a>
            </li>
            <li>
              <strong>General contractors (jobs over $30,000):</strong>{" "}
              <a href="https://www.nclbgc.org/" rel="noopener noreferrer">NC Licensing Board for General Contractors</a>
            </li>
            <li>
              <strong>Landscape contractors:</strong>{" "}
              <a href="https://nclclb.com/" rel="noopener noreferrer">NC Landscape Contractors' Licensing Board</a>
            </li>
            <li>
              <strong>Pest control:</strong>{" "}
              <a href="https://www.ncagr.gov/SPCAP/Pest/" rel="noopener noreferrer">NC Structural Pest Control Division</a>
            </li>
          </ul>
          <p>
            If the license is expired, suspended, or revoked, the listing is
            unpublished automatically.
          </p>

          <h3>3. Insurance</h3>
          <p>
            We require a current Certificate of Insurance (COI) showing general
            liability coverage. Commercial auto and workers' compensation are
            verified where applicable to the trade (e.g., for roofers, tree service,
            and electrical contractors).
          </p>

          <h3>4. Review authenticity</h3>
          <p>
            All reviews on NCSB are first-party — submitted through our review form
            by verified customers of the business. We do not import reviews from
            Google, Yelp, or Facebook. Reviews are time-stamped, tied to a verified
            email or phone number, and subject to removal if the business disputes
            authenticity and the reviewer cannot confirm the transaction.
          </p>

          <h2>Ongoing monitoring</h2>
          <p>
            Every 90 days we re-run the full check. We also monitor:
          </p>
          <ul>
            <li>NC Attorney General consumer complaints database</li>
            <li>
              Licensing board disciplinary actions (posted publicly by each board)
            </li>
            <li>
              A threshold of sub-3-star reviews in a rolling 90-day window (triggers
              manual review before re-verification)
            </li>
          </ul>

          <h2>When a listing is unpublished</h2>
          <p>
            If a business fails re-verification, the listing is unpublished but not
            deleted. The business is notified and given 14 days to resolve the issue
            (e.g., renew a lapsed license, provide an updated COI). If the issue is
            resolved, the listing goes back up with a note on the profile showing the
            verification gap so customers have full transparency.
          </p>

          <h2>Are you a business that should be listed?</h2>
          <p>
            If you're a licensed, insured service business in North Carolina and you
            don't see yourself on NCSB yet, you can{" "}
            <Link href="/claim-listing">add your business free</Link> and we'll begin
            the verification process. Most listings go live within 3 business days.
          </p>

          <h2>Questions or disputes</h2>
          <p>
            If you believe a listing on NCSB fails to meet the verification bar —
            license is expired, insurance isn't current, or reviews appear
            inauthentic — email{" "}
            <a href="mailto:hello@ncservicebusinesses.com">
              hello@ncservicebusinesses.com
            </a>
            . We investigate every report.
          </p>
        </article>
      </div>
    </>
  );
}
