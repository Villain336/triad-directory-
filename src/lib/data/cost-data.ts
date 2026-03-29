export interface CostEstimate {
  categorySlug: string;
  categoryName: string;
  lowEnd: number;
  average: number;
  highEnd: number;
  unit: string;
  factors: string[];
  description: string;
}

export const costEstimates: CostEstimate[] = [
  {
    categorySlug: "plumbers",
    categoryName: "Plumbers",
    lowEnd: 150,
    average: 350,
    highEnd: 800,
    unit: "per job",
    factors: [
      "Type of repair (simple fix vs. major pipe work)",
      "Emergency vs. scheduled service",
      "Parts and materials needed",
      "Accessibility of plumbing",
      "Time of day / weekend rates",
    ],
    description:
      "Plumbing costs in the Triad vary based on the complexity of the job. Simple repairs like fixing a leaky faucet run $150-$250, while major work like water heater replacement or sewer line repair can cost $500-$2,000+.",
  },
  {
    categorySlug: "electricians",
    categoryName: "Electricians",
    lowEnd: 150,
    average: 400,
    highEnd: 1200,
    unit: "per job",
    factors: [
      "Scope of electrical work",
      "Panel upgrade vs. outlet installation",
      "Permit requirements",
      "Code compliance updates needed",
      "EV charger or specialty installation",
    ],
    description:
      "Electrical work in the Triad ranges from $150 for simple outlet work to $1,200+ for panel upgrades. EV charger installation typically runs $500-$1,500 including permits.",
  },
  {
    categorySlug: "hvac",
    categoryName: "HVAC",
    lowEnd: 150,
    average: 500,
    highEnd: 8000,
    unit: "per service",
    factors: [
      "Repair vs. full system replacement",
      "Type of system (central air, heat pump, ductless)",
      "Home square footage",
      "Ductwork condition",
      "Energy efficiency rating (SEER)",
    ],
    description:
      "HVAC costs in the Triad range from $150 for a tune-up to $4,000-$8,000 for a full system replacement. The Triad's hot summers and cold winters mean your HVAC system works hard year-round.",
  },
  {
    categorySlug: "roofing",
    categoryName: "Roofers",
    lowEnd: 300,
    average: 8000,
    highEnd: 20000,
    unit: "per project",
    factors: [
      "Roof size (square footage)",
      "Material type (asphalt, metal, tile)",
      "Number of layers to remove",
      "Roof pitch and complexity",
      "Storm damage vs. planned replacement",
    ],
    description:
      "Roofing in the Triad costs $3-$7 per square foot on average. A full roof replacement on a typical home runs $8,000-$15,000 for asphalt shingles, or $15,000-$25,000 for metal roofing.",
  },
  {
    categorySlug: "general-contractors",
    categoryName: "General Contractors",
    lowEnd: 5000,
    average: 30000,
    highEnd: 100000,
    unit: "per project",
    factors: [
      "Project scope and complexity",
      "Materials quality and selection",
      "Permits and inspections",
      "Subcontractor requirements",
      "Timeline and scheduling",
    ],
    description:
      "General contracting costs depend heavily on the project. Kitchen remodels in the Triad average $15,000-$50,000, bathroom remodels $8,000-$25,000, and home additions $100-$300 per square foot.",
  },
  {
    categorySlug: "landscaping",
    categoryName: "Landscaping",
    lowEnd: 50,
    average: 300,
    highEnd: 5000,
    unit: "per service",
    factors: [
      "Lawn size",
      "Service type (mowing, design, hardscape)",
      "Plant and material costs",
      "Seasonal timing",
      "Ongoing maintenance vs. one-time project",
    ],
    description:
      "Weekly lawn mowing in the Triad runs $30-$75 per visit. Full landscape design and installation projects range from $2,000-$10,000+ depending on scope.",
  },
  {
    categorySlug: "cleaning-services",
    categoryName: "Cleaning Services",
    lowEnd: 100,
    average: 200,
    highEnd: 400,
    unit: "per visit",
    factors: [
      "Home size (bedrooms/bathrooms)",
      "Type of cleaning (regular, deep, move-out)",
      "Frequency (weekly, bi-weekly, one-time)",
      "Special services (windows, carpets)",
      "Pet-related cleaning",
    ],
    description:
      "House cleaning in the Triad averages $120-$250 for a standard home. Deep cleaning and move-out cleaning runs $200-$400+. Weekly service discounts bring per-visit costs down 15-25%.",
  },
  {
    categorySlug: "painters",
    categoryName: "Painters",
    lowEnd: 300,
    average: 3000,
    highEnd: 8000,
    unit: "per project",
    factors: [
      "Interior vs. exterior",
      "Number of rooms / square footage",
      "Paint quality and brand",
      "Prep work required (patching, priming)",
      "Ceiling height and accessibility",
    ],
    description:
      "Interior painting in the Triad costs $2-$5 per square foot. A full interior paint job for an average home runs $2,500-$5,000. Exterior painting ranges from $3,000-$8,000.",
  },
];

export function getCostEstimateByCategory(slug: string): CostEstimate | undefined {
  return costEstimates.find((c) => c.categorySlug === slug);
}
