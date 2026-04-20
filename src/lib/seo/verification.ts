import type { Metadata } from "next";

/**
 * Site-ownership verification for Google Search Console and Bing Webmaster Tools.
 *
 * Values are env-driven so verification strings can be rotated without a code
 * change. If an env var is unset, the corresponding meta tag is simply omitted
 * (Next.js drops empty values from the metadata.verification block).
 *
 *   NEXT_PUBLIC_GSC_VERIFICATION  — content value from GSC "HTML tag" method
 *                                   (the `google-site-verification` content).
 *   NEXT_PUBLIC_BING_VERIFICATION — content value from Bing Webmaster Tools
 *                                   "Meta tag" method (the `msvalidate.01`
 *                                   content).
 *
 * The public-prefixed names are intentional: these values are rendered in the
 * HTML head of every page and are not secrets.
 */
export function getVerificationMetadata(): Metadata["verification"] {
  const google = process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim();
  const bing = process.env.NEXT_PUBLIC_BING_VERIFICATION?.trim();

  const other: Record<string, string> = {};
  if (bing) other["msvalidate.01"] = bing;

  const verification: NonNullable<Metadata["verification"]> = {};
  if (google) verification.google = google;
  if (Object.keys(other).length > 0) verification.other = other;

  return Object.keys(verification).length > 0 ? verification : undefined;
}
