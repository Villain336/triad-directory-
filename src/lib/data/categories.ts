export interface Category {
  name: string;
  slug: string;
  description: string;
  icon: string;
  parentSlug?: string;
  featured: boolean;
}

export const categories: Category[] = [
  // Home Services
  {
    name: "Plumbers",
    slug: "plumbers",
    description: "Licensed plumbers for repairs, installations, and emergency plumbing services",
    icon: "Wrench",
    featured: true,
  },
  {
    name: "Electricians",
    slug: "electricians",
    description: "Certified electricians for residential and commercial electrical work",
    icon: "Zap",
    featured: true,
  },
  {
    name: "HVAC",
    slug: "hvac",
    description: "Heating, ventilation, and air conditioning installation and repair",
    icon: "Thermometer",
    featured: true,
  },
  {
    name: "Roofers",
    slug: "roofing",
    description: "Professional roofing contractors for repairs, replacements, and new installations",
    icon: "Home",
    featured: true,
  },
  {
    name: "Painters",
    slug: "painters",
    description: "Interior and exterior painting services for homes and businesses",
    icon: "Paintbrush",
    featured: false,
  },
  {
    name: "Landscaping",
    slug: "landscaping",
    description: "Lawn care, landscape design, and outdoor maintenance services",
    icon: "TreePine",
    featured: true,
  },
  {
    name: "Cleaning Services",
    slug: "cleaning-services",
    description: "Residential and commercial cleaning, maid services, and deep cleaning",
    icon: "Sparkles",
    featured: true,
  },
  {
    name: "Pest Control",
    slug: "pest-control",
    description: "Pest extermination and prevention for homes and businesses",
    icon: "Bug",
    featured: false,
  },
  {
    name: "Fencing",
    slug: "fencing",
    description: "Fence installation, repair, and replacement services",
    icon: "Fence",
    featured: false,
  },
  {
    name: "Concrete & Masonry",
    slug: "concrete-masonry",
    description: "Concrete work, brick laying, and masonry services",
    icon: "Blocks",
    featured: false,
  },
  {
    name: "Handyman",
    slug: "handyman",
    description: "General home repairs, maintenance, and odd jobs",
    icon: "Hammer",
    featured: true,
  },
  {
    name: "Garage Doors",
    slug: "garage-doors",
    description: "Garage door installation, repair, and opener services",
    icon: "DoorOpen",
    featured: false,
  },
  // Professional Services
  {
    name: "Attorneys",
    slug: "attorneys",
    description: "Lawyers and legal services for all practice areas",
    icon: "Scale",
    featured: true,
  },
  {
    name: "Accountants",
    slug: "accountants",
    description: "CPAs, tax preparation, bookkeeping, and financial services",
    icon: "Calculator",
    featured: false,
  },
  {
    name: "Real Estate Agents",
    slug: "real-estate",
    description: "Real estate agents, brokers, and property management services",
    icon: "Building",
    featured: true,
  },
  {
    name: "Insurance",
    slug: "insurance",
    description: "Home, auto, life, and business insurance agents and agencies",
    icon: "Shield",
    featured: false,
  },
  {
    name: "Financial Advisors",
    slug: "financial-advisors",
    description: "Investment advisors, wealth management, and financial planning",
    icon: "TrendingUp",
    featured: false,
  },
  // Auto Services
  {
    name: "Auto Repair",
    slug: "auto-repair",
    description: "Mechanics, auto shops, and vehicle repair services",
    icon: "Car",
    featured: true,
  },
  {
    name: "Auto Body Shops",
    slug: "auto-body",
    description: "Collision repair, paint, and auto body work",
    icon: "Paintbrush",
    featured: false,
  },
  {
    name: "Towing",
    slug: "towing",
    description: "Emergency towing and roadside assistance services",
    icon: "Truck",
    featured: false,
  },
  // Health & Wellness
  {
    name: "Dentists",
    slug: "dentists",
    description: "General dentistry, cosmetic dentistry, and dental specialists",
    icon: "Smile",
    featured: true,
  },
  {
    name: "Chiropractors",
    slug: "chiropractors",
    description: "Chiropractic care and spinal adjustment services",
    icon: "Activity",
    featured: false,
  },
  {
    name: "Veterinarians",
    slug: "veterinarians",
    description: "Animal hospitals, vet clinics, and pet care services",
    icon: "Heart",
    featured: false,
  },
  {
    name: "Personal Trainers",
    slug: "personal-trainers",
    description: "Fitness trainers, gyms, and personal training services",
    icon: "Dumbbell",
    featured: false,
  },
  // Food & Dining
  {
    name: "Restaurants",
    slug: "restaurants",
    description: "Local restaurants, cafes, and dining establishments",
    icon: "UtensilsCrossed",
    featured: true,
  },
  {
    name: "Catering",
    slug: "catering",
    description: "Event catering, meal prep, and food service businesses",
    icon: "ChefHat",
    featured: false,
  },
  // Events & Entertainment
  {
    name: "Wedding Venues",
    slug: "wedding-venues",
    description: "Wedding venues, event spaces, and reception halls",
    icon: "Gem",
    featured: false,
  },
  {
    name: "Photographers",
    slug: "photographers",
    description: "Professional photography for weddings, events, and portraits",
    icon: "Camera",
    featured: false,
  },
  {
    name: "DJs & Entertainment",
    slug: "djs-entertainment",
    description: "DJs, live music, and entertainment for events and parties",
    icon: "Music",
    featured: false,
  },
  // Construction & Remodeling
  {
    name: "General Contractors",
    slug: "general-contractors",
    description: "Licensed general contractors for construction and building projects",
    icon: "HardHat",
    featured: true,
  },
  {
    name: "Kitchen Remodeling",
    slug: "kitchen-remodeling",
    description: "Kitchen renovation, cabinet installation, and countertop services",
    icon: "CookingPot",
    featured: false,
  },
  {
    name: "Bathroom Remodeling",
    slug: "bathroom-remodeling",
    description: "Bathroom renovation, tile work, and fixture installation",
    icon: "Bath",
    featured: false,
  },
  {
    name: "Flooring",
    slug: "flooring",
    description: "Hardwood, tile, carpet, and vinyl flooring installation",
    icon: "Layers",
    featured: false,
  },
  {
    name: "Windows & Doors",
    slug: "windows-doors",
    description: "Window and door installation, replacement, and repair",
    icon: "DoorOpen",
    featured: false,
  },
  // Technology
  {
    name: "IT Services",
    slug: "it-services",
    description: "Computer repair, IT support, and managed technology services",
    icon: "Monitor",
    featured: false,
  },
  {
    name: "Web Design",
    slug: "web-design",
    description: "Website design, development, and digital marketing services",
    icon: "Globe",
    featured: false,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getFeaturedCategories(): Category[] {
  return categories.filter((c) => c.featured);
}
