import { Listing } from "@/types/listing";

export const sampleListings: Listing[] = [
  // Greensboro Premium
  {
    id: "1",
    businessName: "Triad Master Plumbing",
    slug: "triad-master-plumbing",
    description:
      "Triad Master Plumbing has served Greensboro and the surrounding Triad area for over 25 years. We specialize in residential and commercial plumbing, including emergency repairs, water heater installation, drain cleaning, and bathroom remodeling. Our licensed plumbers are available 24/7 for emergency calls. We pride ourselves on transparent pricing, quality workmanship, and exceptional customer service. Fully licensed, bonded, and insured.",
    shortDescription:
      "24/7 licensed plumbing services in Greensboro. Emergency repairs, water heaters, drain cleaning & remodeling.",
    citySlug: "greensboro",
    categorySlug: "plumbers",
    tier: "premium",
    phone: "3365551001",
    email: "info@triadmasterplumbing.com",
    website: "https://triadmasterplumbing.com",
    address: "2401 Gate City Blvd",
    city: "Greensboro",
    state: "NC",
    zip: "27403",
    latitude: 36.0544,
    longitude: -79.8108,
    rating: 4.9,
    reviewCount: 247,
    yearEstablished: 1999,
    licenseNumber: "NC-29481",
    isVerified: true,
    isFeatured: true,
    tags: ["24/7 emergency", "licensed", "water heaters", "drain cleaning", "remodeling"],
    imageUrl: "/images/listings/plumbing-hero.jpg",
    hours: {
      monday: "7:00 AM - 7:00 PM",
      tuesday: "7:00 AM - 7:00 PM",
      wednesday: "7:00 AM - 7:00 PM",
      thursday: "7:00 AM - 7:00 PM",
      friday: "7:00 AM - 7:00 PM",
      saturday: "8:00 AM - 4:00 PM",
      sunday: "Emergency Only",
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-06-01",
  },
  {
    id: "2",
    businessName: "Carolina Electric Pro",
    slug: "carolina-electric-pro",
    description:
      "Carolina Electric Pro provides expert electrical services throughout Greensboro and the Piedmont Triad. From panel upgrades and rewiring to EV charger installation and smart home setups, our master electricians handle it all. Family-owned and operated since 2005.",
    shortDescription:
      "Master electricians in Greensboro. Panel upgrades, rewiring, EV chargers & smart home installation.",
    citySlug: "greensboro",
    categorySlug: "electricians",
    tier: "premium",
    phone: "3365551002",
    email: "service@carolinaelectricpro.com",
    website: "https://carolinaelectricpro.com",
    address: "1800 Battleground Ave",
    city: "Greensboro",
    state: "NC",
    zip: "27408",
    rating: 4.8,
    reviewCount: 183,
    yearEstablished: 2005,
    licenseNumber: "NC-31205",
    isVerified: true,
    isFeatured: true,
    tags: ["master electrician", "EV chargers", "panel upgrades", "smart home"],
    hours: {
      monday: "7:30 AM - 6:00 PM",
      tuesday: "7:30 AM - 6:00 PM",
      wednesday: "7:30 AM - 6:00 PM",
      thursday: "7:30 AM - 6:00 PM",
      friday: "7:30 AM - 6:00 PM",
      saturday: "9:00 AM - 2:00 PM",
      sunday: "Closed",
    },
    createdAt: "2024-01-20",
    updatedAt: "2024-06-01",
  },
  // Winston-Salem Premium
  {
    id: "3",
    businessName: "Twin City HVAC Solutions",
    slug: "twin-city-hvac-solutions",
    description:
      "Twin City HVAC Solutions is Winston-Salem's trusted heating and cooling company. We install, repair, and maintain all HVAC systems including central air, heat pumps, ductless mini-splits, and furnaces. Our NATE-certified technicians offer same-day service and free estimates on new installations.",
    shortDescription:
      "Winston-Salem's top HVAC company. AC repair, heat pumps, furnaces & ductless mini-splits. Free estimates.",
    citySlug: "winston-salem",
    categorySlug: "hvac",
    tier: "premium",
    phone: "3365551003",
    email: "info@twincityhvac.com",
    website: "https://twincityhvac.com",
    address: "3600 Reynolda Rd",
    city: "Winston-Salem",
    state: "NC",
    zip: "27106",
    rating: 4.9,
    reviewCount: 312,
    yearEstablished: 2001,
    isVerified: true,
    isFeatured: true,
    tags: ["NATE certified", "same-day service", "free estimates", "heat pumps", "AC repair"],
    hours: {
      monday: "7:00 AM - 8:00 PM",
      tuesday: "7:00 AM - 8:00 PM",
      wednesday: "7:00 AM - 8:00 PM",
      thursday: "7:00 AM - 8:00 PM",
      friday: "7:00 AM - 8:00 PM",
      saturday: "8:00 AM - 5:00 PM",
      sunday: "Emergency Only",
    },
    createdAt: "2024-02-01",
    updatedAt: "2024-06-01",
  },
  {
    id: "4",
    businessName: "Salem Roofing & Exteriors",
    slug: "salem-roofing-exteriors",
    description:
      "Salem Roofing & Exteriors is a full-service roofing company in Winston-Salem specializing in residential and commercial roofing. We handle shingle replacement, metal roofing, flat roofs, storm damage repair, and gutter installation. GAF Master Elite certified.",
    shortDescription:
      "GAF Master Elite roofer in Winston-Salem. Shingle, metal & flat roofing. Storm damage specialists.",
    citySlug: "winston-salem",
    categorySlug: "roofing",
    tier: "premium",
    phone: "3365551004",
    email: "info@salemroofing.com",
    address: "4200 Country Club Rd",
    city: "Winston-Salem",
    state: "NC",
    zip: "27104",
    rating: 4.7,
    reviewCount: 156,
    yearEstablished: 2008,
    isVerified: true,
    isFeatured: true,
    tags: ["GAF certified", "storm damage", "metal roofing", "gutters", "free inspection"],
    createdAt: "2024-02-10",
    updatedAt: "2024-06-01",
  },
  // High Point
  {
    id: "5",
    businessName: "Furniture City Contractors",
    slug: "furniture-city-contractors",
    description:
      "Furniture City Contractors is High Point's premier general contracting firm. We specialize in home additions, kitchen and bathroom remodeling, custom builds, and commercial renovations. Over 20 years of experience building in the Triad.",
    shortDescription:
      "High Point's top general contractor. Home additions, remodeling & custom builds. 20+ years experience.",
    citySlug: "high-point",
    categorySlug: "general-contractors",
    tier: "premium",
    phone: "3365551005",
    email: "build@furniturecitycontractors.com",
    address: "1500 N Main St",
    city: "High Point",
    state: "NC",
    zip: "27262",
    rating: 4.8,
    reviewCount: 89,
    yearEstablished: 2003,
    licenseNumber: "NC-45201",
    isVerified: true,
    isFeatured: true,
    tags: ["licensed contractor", "remodeling", "additions", "commercial", "custom builds"],
    createdAt: "2024-02-15",
    updatedAt: "2024-06-01",
  },
  // Standard Listings
  {
    id: "6",
    businessName: "Quick Fix Plumbing",
    slug: "quick-fix-plumbing",
    description:
      "Quick Fix Plumbing offers affordable plumbing services in Greensboro and surrounding areas. Specializing in drain cleaning, leak repairs, and water heater service.",
    shortDescription: "Affordable plumbing services in Greensboro. Drain cleaning & leak repairs.",
    citySlug: "greensboro",
    categorySlug: "plumbers",
    tier: "basic",
    phone: "3365551006",
    email: "quickfixplumbing@email.com",
    address: "500 S Elm St",
    city: "Greensboro",
    state: "NC",
    zip: "27406",
    rating: 4.3,
    reviewCount: 67,
    isVerified: false,
    isFeatured: false,
    tags: ["affordable", "drain cleaning", "leak repair"],
    createdAt: "2024-03-01",
    updatedAt: "2024-06-01",
  },
  {
    id: "7",
    businessName: "Blue Ridge Landscaping",
    slug: "blue-ridge-landscaping",
    description:
      "Blue Ridge Landscaping provides full-service lawn care and landscape design in Winston-Salem. From weekly mowing to complete landscape overhauls, we do it all.",
    shortDescription:
      "Full-service landscaping in Winston-Salem. Lawn care, design & maintenance.",
    citySlug: "winston-salem",
    categorySlug: "landscaping",
    tier: "basic",
    phone: "3365551007",
    email: "info@blueridgelandscaping.com",
    address: "2200 Silas Creek Pkwy",
    city: "Winston-Salem",
    state: "NC",
    zip: "27103",
    rating: 4.5,
    reviewCount: 93,
    isVerified: true,
    isFeatured: false,
    tags: ["lawn care", "landscape design", "mulching", "irrigation"],
    createdAt: "2024-03-05",
    updatedAt: "2024-06-01",
  },
  {
    id: "8",
    businessName: "Kernersville Auto Care",
    slug: "kernersville-auto-care",
    description:
      "Kernersville Auto Care is your trusted neighborhood mechanic. We handle everything from oil changes and brake service to engine diagnostics and transmission repair.",
    shortDescription:
      "Trusted auto repair in Kernersville. Oil changes, brakes, diagnostics & more.",
    citySlug: "kernersville",
    categorySlug: "auto-repair",
    tier: "basic",
    phone: "3365551008",
    email: "service@kernersvilleautocare.com",
    address: "130 E Mountain St",
    city: "Kernersville",
    state: "NC",
    zip: "27284",
    rating: 4.6,
    reviewCount: 128,
    yearEstablished: 2010,
    isVerified: true,
    isFeatured: false,
    tags: ["oil change", "brakes", "diagnostics", "transmission"],
    createdAt: "2024-03-10",
    updatedAt: "2024-06-01",
  },
  {
    id: "9",
    businessName: "Piedmont Dental Group",
    slug: "piedmont-dental-group",
    description:
      "Piedmont Dental Group offers comprehensive dental care in Burlington. Services include cleanings, fillings, crowns, implants, and cosmetic dentistry. Accepting new patients.",
    shortDescription:
      "Comprehensive dental care in Burlington. Cleanings, implants & cosmetic dentistry.",
    citySlug: "burlington",
    categorySlug: "dentists",
    tier: "premium",
    phone: "3365551009",
    email: "appointments@piedmontdental.com",
    website: "https://piedmontdentalgroup.com",
    address: "2800 S Church St",
    city: "Burlington",
    state: "NC",
    zip: "27215",
    rating: 4.8,
    reviewCount: 201,
    yearEstablished: 1995,
    isVerified: true,
    isFeatured: true,
    tags: ["cosmetic dentistry", "implants", "family dentist", "new patients welcome"],
    createdAt: "2024-03-15",
    updatedAt: "2024-06-01",
  },
  {
    id: "10",
    businessName: "Triad Clean Team",
    slug: "triad-clean-team",
    description:
      "Triad Clean Team provides residential and commercial cleaning services across the Triad. Regular housekeeping, deep cleaning, move-in/move-out cleaning, and office janitorial services.",
    shortDescription:
      "Residential & commercial cleaning across the Triad. Deep cleaning & janitorial services.",
    citySlug: "greensboro",
    categorySlug: "cleaning-services",
    tier: "basic",
    phone: "3365551010",
    email: "book@triadcleanteam.com",
    address: "3100 W Friendly Ave",
    city: "Greensboro",
    state: "NC",
    zip: "27410",
    rating: 4.4,
    reviewCount: 76,
    isVerified: true,
    isFeatured: false,
    tags: ["deep cleaning", "move-out cleaning", "office cleaning", "weekly service"],
    createdAt: "2024-04-01",
    updatedAt: "2024-06-01",
  },
  {
    id: "11",
    businessName: "Thomasville Family Law",
    slug: "thomasville-family-law",
    description:
      "Thomasville Family Law specializes in family law matters including divorce, custody, child support, and adoption. Compassionate legal representation in Davidson County.",
    shortDescription:
      "Family law attorneys in Thomasville. Divorce, custody & adoption services.",
    citySlug: "thomasville",
    categorySlug: "attorneys",
    tier: "premium",
    phone: "3365551011",
    email: "consult@thomasvillefamilylaw.com",
    website: "https://thomasvillefamilylaw.com",
    address: "100 E Main St",
    city: "Thomasville",
    state: "NC",
    zip: "27360",
    rating: 4.9,
    reviewCount: 64,
    yearEstablished: 2012,
    isVerified: true,
    isFeatured: true,
    tags: ["family law", "divorce", "custody", "adoption", "free consultation"],
    createdAt: "2024-04-05",
    updatedAt: "2024-06-01",
  },
  {
    id: "12",
    businessName: "Asheboro Handyman Services",
    slug: "asheboro-handyman-services",
    description:
      "Asheboro Handyman Services handles all your home repair needs. From drywall and painting to deck repair and fixture installation. No job too small.",
    shortDescription:
      "Reliable handyman services in Asheboro. Drywall, painting, decks & more.",
    citySlug: "asheboro",
    categorySlug: "handyman",
    tier: "free",
    phone: "3365551012",
    email: "jobs@ashebrohandyman.com",
    address: "200 S Fayetteville St",
    city: "Asheboro",
    state: "NC",
    zip: "27203",
    rating: 4.2,
    reviewCount: 34,
    isVerified: false,
    isFeatured: false,
    tags: ["drywall", "painting", "deck repair", "small jobs"],
    createdAt: "2024-04-10",
    updatedAt: "2024-06-01",
  },
];

export function getListingsByCity(citySlug: string): Listing[] {
  return sampleListings.filter((l) => l.citySlug === citySlug);
}

export function getListingsByCategory(categorySlug: string): Listing[] {
  return sampleListings.filter((l) => l.categorySlug === categorySlug);
}

export function getListingsByCityAndCategory(citySlug: string, categorySlug: string): Listing[] {
  return sampleListings.filter((l) => l.citySlug === citySlug && l.categorySlug === categorySlug);
}

export function getListingBySlug(slug: string): Listing | undefined {
  return sampleListings.find((l) => l.slug === slug);
}

export function getFeaturedListings(): Listing[] {
  return sampleListings.filter((l) => l.isFeatured);
}

export function searchListings(query: string): Listing[] {
  const q = query.toLowerCase();
  return sampleListings.filter(
    (l) =>
      l.businessName.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q))
  );
}
