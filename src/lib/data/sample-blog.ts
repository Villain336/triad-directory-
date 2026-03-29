import { BlogPost } from "@/types/blog";

export const sampleBlogPosts: BlogPost[] = [
  {
    slug: "best-plumbers-greensboro-2024",
    title: "10 Best Plumbers in Greensboro, NC (2024 Guide)",
    excerpt:
      "Looking for a reliable plumber in Greensboro? We've compiled the top-rated plumbing companies based on customer reviews, licensing, and service quality.",
    content: `Finding a trustworthy plumber in Greensboro, NC doesn't have to be stressful. Whether you're dealing with a leaky faucet, need a water heater replacement, or require emergency plumbing service, the Triad has excellent professionals ready to help.

## What to Look for in a Greensboro Plumber

When choosing a plumber in Greensboro, consider these key factors:

- **Licensing**: North Carolina requires plumbers to hold a valid state license. Always ask for their license number.
- **Insurance**: Verify that the plumber carries both liability insurance and workers' compensation.
- **Reviews**: Check online reviews on Triad Directory, Google, and the BBB.
- **Experience**: Look for plumbers with at least 5 years of experience in the Triad area.
- **Pricing**: Get at least 3 written estimates before committing to a service.

## Emergency Plumbing Tips

If you're dealing with a plumbing emergency in Greensboro:

1. Turn off the main water supply valve
2. Open faucets to relieve pressure
3. Call an emergency plumber immediately
4. Document any damage for insurance purposes

## Why Use Triad Directory

Triad Directory connects you with verified, licensed plumbers in Greensboro. Every premium-listed plumber has been vetted for licensing, insurance, and customer satisfaction. Use our directory to compare ratings, read reviews, and request free quotes.`,
    author: "Triad Directory Team",
    publishedAt: "2024-11-15",
    coverImage: "/images/blog/plumber-greensboro.jpg",
    tags: ["plumbing", "greensboro", "home services", "guide"],
    citySlug: "greensboro",
    categorySlug: "plumbers",
    metaTitle: "10 Best Plumbers in Greensboro, NC (2024) | Triad Directory",
    metaDescription:
      "Find the best plumbers in Greensboro, NC. Read reviews, compare ratings, and get free quotes from top-rated licensed plumbers near you.",
  },
  {
    slug: "hvac-maintenance-tips-triad",
    title: "HVAC Maintenance Tips for Triad Homeowners",
    excerpt:
      "Keep your heating and cooling system running efficiently with these essential HVAC maintenance tips for the Piedmont Triad's unique climate.",
    content: `The Piedmont Triad's climate puts unique demands on your HVAC system. Hot, humid summers and cold winters mean your system works hard year-round. Here's how to keep it running efficiently.

## Seasonal Maintenance Checklist

### Spring (Before Cooling Season)
- Replace or clean air filters
- Clear debris from outdoor condensing unit
- Check refrigerant levels
- Test thermostat calibration
- Clean evaporator and condenser coils

### Fall (Before Heating Season)
- Replace air filters again
- Inspect heat exchanger for cracks
- Check gas connections and burner
- Test carbon monoxide detectors
- Schedule professional tune-up

## When to Call a Professional

While some maintenance tasks are DIY-friendly, you should call a licensed HVAC technician in the Triad for:

- Refrigerant handling (requires EPA certification)
- Electrical component repair
- Heat exchanger inspection
- Ductwork modifications
- New system installation

## Finding HVAC Service in the Triad

Browse our directory for top-rated HVAC companies in every Triad city. All premium-listed HVAC companies are NATE-certified and carry proper licensing and insurance.`,
    author: "Triad Directory Team",
    publishedAt: "2024-10-20",
    tags: ["hvac", "home maintenance", "tips", "triad"],
    metaTitle: "HVAC Maintenance Tips for Triad NC Homeowners | Triad Directory",
    metaDescription:
      "Essential HVAC maintenance tips for Piedmont Triad homeowners. Learn how to keep your heating and cooling system efficient in NC's climate.",
  },
  {
    slug: "support-local-business-triad",
    title: "Why Supporting Local Businesses Matters in the Triad",
    excerpt:
      "Discover the economic and community impact of choosing local businesses in the Piedmont Triad over national chains.",
    content: `When you choose a local business in the Triad, you're doing more than making a purchase — you're investing in your community. Here's why supporting local businesses in Greensboro, Winston-Salem, High Point, and across the Triad matters.

## The Economic Impact

Studies show that for every $100 spent at a local business, approximately $68 stays in the community. Compare that to just $43 for national chains. That means:

- More local jobs
- Higher tax revenue for Triad communities
- Stronger local economy
- More unique character for our cities

## Local Businesses Build Community

Local business owners are your neighbors. They sponsor Little League teams, donate to school fundraisers, and invest in making the Triad a better place to live. When you hire a local plumber, contractor, or service provider, you're building a relationship with someone who has a stake in doing great work.

## How Triad Directory Helps

Triad Directory exists to connect Triad residents with the best local businesses in their community. Our directory covers every city in the Piedmont Triad, from Greensboro and Winston-Salem to Thomasville, Kernersville, and beyond.`,
    author: "Triad Directory Team",
    publishedAt: "2024-09-05",
    tags: ["local business", "community", "triad", "economy"],
    metaTitle: "Why Supporting Local Triad Businesses Matters | Triad Directory",
    metaDescription:
      "Learn why choosing local businesses in the Piedmont Triad strengthens our community. Shop local in Greensboro, Winston-Salem, High Point & more.",
  },
  {
    slug: "hiring-contractor-guide-nc",
    title: "Complete Guide to Hiring a Contractor in North Carolina",
    excerpt:
      "Everything you need to know about hiring a licensed contractor in NC, from checking credentials to understanding contracts and permits.",
    content: `Hiring a contractor in North Carolina requires due diligence. Whether you're renovating your kitchen in Greensboro or building an addition in Winston-Salem, this guide covers everything you need to know.

## Verify Licensing

North Carolina requires general contractors to be licensed by the NC Licensing Board for General Contractors for any project over $30,000. Check credentials at:
- NC Licensing Board for General Contractors
- NC State Board of Examiners of Plumbing, Heating & Fire Sprinkler Contractors
- NC Board of Examiners of Electrical Contractors

## Get Multiple Estimates

Always get at least 3 written estimates from licensed contractors in the Triad. Each estimate should include:
- Detailed scope of work
- Materials specifications
- Timeline with milestones
- Payment schedule
- Warranty information

## Check References and Reviews

Ask for at least 3 references from recent projects in the Triad area. Also check:
- Triad Directory reviews and ratings
- BBB accreditation
- Google reviews
- NC Licensing Board complaint history

## Understand Your Contract

Before signing, make sure your contract includes:
- Start and completion dates
- Detailed payment schedule (never pay more than 1/3 upfront)
- Change order procedures
- Dispute resolution process
- Lien waiver requirements`,
    author: "Triad Directory Team",
    publishedAt: "2024-08-12",
    tags: ["contractors", "guide", "north carolina", "home improvement"],
    categorySlug: "general-contractors",
    metaTitle: "Complete Guide to Hiring a Contractor in NC | Triad Directory",
    metaDescription:
      "Everything you need to know about hiring a licensed contractor in North Carolina. Tips for Triad homeowners on vetting, contracts, and permits.",
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return sampleBlogPosts.find((p) => p.slug === slug);
}

export function getRecentBlogPosts(count: number = 10): BlogPost[] {
  return [...sampleBlogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}
