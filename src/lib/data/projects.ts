export interface Project {
  id: string;
  listingId: string;
  businessName: string;
  title: string;
  description: string;
  categorySlug: string;
  citySlug: string;
  beforeDescription: string;
  afterDescription: string;
  cost?: string;
  duration?: string;
  tags: string[];
  createdAt: string;
}

export const sampleProjects: Project[] = [
  {
    id: "p1",
    listingId: "1",
    businessName: "Triad Master Plumbing",
    title: "Complete Bathroom Remodel — Master Bath",
    description: "Full master bathroom remodel including new tile, fixtures, vanity, and shower conversion from tub. Modern farmhouse style.",
    categorySlug: "plumbers",
    citySlug: "greensboro",
    beforeDescription: "Outdated 1990s bathroom with worn tile, leaking fixtures, and a tub/shower combo that no longer drained properly.",
    afterDescription: "Modern walk-in shower with frameless glass, new vanity with quartz countertop, updated plumbing throughout, and heated tile floor.",
    cost: "$8,500",
    duration: "2 weeks",
    tags: ["bathroom remodel", "shower conversion", "modern"],
    createdAt: "2024-03-15",
  },
  {
    id: "p2",
    listingId: "13",
    businessName: "Triad Paving & Striping Co.",
    title: "Shopping Center Parking Lot — Full Repave & Stripe",
    description: "Complete tear-out and repave of a 150-space shopping center parking lot with new ADA-compliant striping, handicap spaces, fire lanes, and directional arrows.",
    categorySlug: "paving-striping",
    citySlug: "greensboro",
    beforeDescription: "Severely deteriorated asphalt with large potholes, faded markings, and non-compliant ADA access. The lot was causing customer complaints and liability concerns.",
    afterDescription: "Smooth new asphalt with crisp white and yellow striping, properly marked handicap spaces with signage, fresh fire lane markings, and new wheel stops throughout.",
    cost: "$45,000",
    duration: "5 days",
    tags: ["parking lot", "commercial", "ADA compliance", "striping"],
    createdAt: "2024-04-20",
  },
  {
    id: "p3",
    listingId: "5",
    businessName: "Furniture City Contractors",
    title: "Kitchen Renovation — Open Concept Conversion",
    description: "Removed a load-bearing wall to create an open concept kitchen/living area. Custom cabinetry, quartz countertops, and a 10-foot island.",
    categorySlug: "general-contractors",
    citySlug: "high-point",
    beforeDescription: "Closed-off galley kitchen with dated oak cabinets, laminate counters, and a wall separating it from the living room.",
    afterDescription: "Stunning open-concept layout with shaker-style white cabinets, waterfall quartz island, pendant lighting, and hardwood floors extending from kitchen to living area.",
    cost: "$42,000",
    duration: "6 weeks",
    tags: ["kitchen remodel", "open concept", "custom cabinetry"],
    createdAt: "2024-02-10",
  },
];

export function getProjectsByListingId(listingId: string): Project[] {
  return sampleProjects.filter((p) => p.listingId === listingId);
}
