export interface Deal {
  id: string;
  listingId: string;
  businessName: string;
  citySlug: string;
  categorySlug: string;
  title: string;
  description: string;
  discountType: "percent" | "fixed" | "free";
  discountValue: number;
  code?: string;
  expiresAt: string;
  terms: string;
  claimCount: number;
}

export const sampleDeals: Deal[] = [
  {
    id: "d1",
    listingId: "1",
    businessName: "Triad Master Plumbing",
    citySlug: "greensboro",
    categorySlug: "plumbers",
    title: "$50 Off Any Service Over $200",
    description: "New customers get $50 off their first plumbing service of $200 or more. Valid for all residential plumbing work.",
    discountType: "fixed",
    discountValue: 50,
    code: "TRIAD50",
    expiresAt: "2025-12-31",
    terms: "New customers only. Cannot be combined with other offers. Minimum service charge of $200.",
    claimCount: 47,
  },
  {
    id: "d2",
    listingId: "3",
    businessName: "Twin City HVAC Solutions",
    citySlug: "winston-salem",
    categorySlug: "hvac",
    title: "Free AC Diagnostic with Any Repair",
    description: "Get a complete AC system diagnostic ($89 value) free when you book any repair service.",
    discountType: "free",
    discountValue: 89,
    expiresAt: "2025-09-30",
    terms: "Valid for residential AC repairs only. One per household.",
    claimCount: 83,
  },
  {
    id: "d3",
    listingId: "13",
    businessName: "Triad Paving & Striping Co.",
    citySlug: "greensboro",
    categorySlug: "paving-striping",
    title: "15% Off Parking Lot Sealcoating",
    description: "Book your parking lot sealcoating this season and save 15%. Includes crack filling and clean-up.",
    discountType: "percent",
    discountValue: 15,
    code: "SEAL15",
    expiresAt: "2025-10-31",
    terms: "Commercial properties only. Minimum 5,000 sq ft. Must mention code at time of estimate.",
    claimCount: 22,
  },
  {
    id: "d4",
    listingId: "5",
    businessName: "Furniture City Contractors",
    citySlug: "high-point",
    categorySlug: "general-contractors",
    title: "Free Design Consultation for Kitchen Remodels",
    description: "Get a free in-home design consultation and 3D rendering for your kitchen remodel project. A $500 value.",
    discountType: "free",
    discountValue: 500,
    expiresAt: "2025-12-31",
    terms: "Projects over $10,000. High Point and surrounding areas. By appointment only.",
    claimCount: 31,
  },
];

export function getDealsByCity(citySlug: string): Deal[] {
  return sampleDeals.filter((d) => d.citySlug === citySlug);
}

export function getActiveDeals(): Deal[] {
  return sampleDeals.filter((d) => new Date(d.expiresAt) > new Date());
}
