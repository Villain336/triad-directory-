export interface Question {
  id: string;
  title: string;
  body: string;
  authorName: string;
  citySlug?: string;
  categorySlug?: string;
  tags: string[];
  upvotes: number;
  answerCount: number;
  createdAt: string;
  slug: string;
  isResolved: boolean;
}

export interface Answer {
  id: string;
  questionId: string;
  authorName: string;
  body: string;
  isBusinessOwner: boolean;
  businessName?: string;
  businessSlug?: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: string;
}

export const sampleQuestions: Question[] = [
  {
    id: "q1",
    title: "Best time to seal a driveway in the Triad?",
    body: "We just moved to Greensboro and our driveway is looking rough. When is the best time of year to get it sealed? Any recommendations for paving companies?",
    authorName: "NewToGSO",
    citySlug: "greensboro",
    categorySlug: "paving-striping",
    tags: ["paving", "driveway", "sealcoating", "greensboro"],
    upvotes: 24,
    answerCount: 3,
    createdAt: "2024-05-15",
    slug: "best-time-seal-driveway-triad",
    isResolved: true,
  },
  {
    id: "q2",
    title: "How much should a roof replacement cost in Winston-Salem?",
    body: "I got a quote for $12,000 for a full shingle roof replacement on a 1,800 sq ft ranch. Is that reasonable for the Triad area? House is single story, no issues with the decking.",
    authorName: "WSHomeowner",
    citySlug: "winston-salem",
    categorySlug: "roofing",
    tags: ["roofing", "pricing", "winston-salem"],
    upvotes: 31,
    answerCount: 5,
    createdAt: "2024-05-08",
    slug: "roof-replacement-cost-winston-salem",
    isResolved: true,
  },
  {
    id: "q3",
    title: "Reliable HVAC company for older homes in High Point?",
    body: "Our 1960s ranch in High Point needs a complete HVAC overhaul. The current system is original. Looking for someone who has experience with older homes and can handle ductwork modifications. Any suggestions?",
    authorName: "HPResident",
    citySlug: "high-point",
    categorySlug: "hvac",
    tags: ["hvac", "old-homes", "high-point", "ductwork"],
    upvotes: 18,
    answerCount: 4,
    createdAt: "2024-04-28",
    slug: "reliable-hvac-older-homes-high-point",
    isResolved: false,
  },
  {
    id: "q4",
    title: "Do I need a permit for a fence in Guilford County?",
    body: "Planning to install a 6ft privacy fence in my backyard in Greensboro. Do I need a permit from the city? Any fence companies that handle the permit process?",
    authorName: "FenceQuestion",
    citySlug: "greensboro",
    categorySlug: "fencing",
    tags: ["fencing", "permits", "greensboro", "guilford-county"],
    upvotes: 42,
    answerCount: 6,
    createdAt: "2024-04-15",
    slug: "permit-fence-guilford-county",
    isResolved: true,
  },
  {
    id: "q5",
    title: "Electrician recommendations for EV charger install in Kernersville?",
    body: "Just got a new EV and need a Level 2 charger installed in my garage in Kernersville. Need someone who knows the code requirements and can handle the panel upgrade if needed.",
    authorName: "EVDriver336",
    citySlug: "kernersville",
    categorySlug: "electricians",
    tags: ["electrician", "ev-charger", "kernersville"],
    upvotes: 15,
    answerCount: 3,
    createdAt: "2024-06-01",
    slug: "ev-charger-install-kernersville",
    isResolved: false,
  },
  {
    id: "q6",
    title: "Parking lot striping regulations for ADA compliance in NC?",
    body: "We own a small retail strip in Burlington and need to restripe our lot. What are the ADA requirements for handicap spaces, access aisles, and signage in North Carolina? Do I need a certain number of van-accessible spaces?",
    authorName: "BurlingtonBizOwner",
    citySlug: "burlington",
    categorySlug: "paving-striping",
    tags: ["paving", "ada-compliance", "parking-lot", "burlington", "striping"],
    upvotes: 37,
    answerCount: 4,
    createdAt: "2024-06-10",
    slug: "parking-lot-ada-compliance-nc",
    isResolved: true,
  },
  {
    id: "q7",
    title: "Water pressure suddenly dropped — what should I check first?",
    body: "Our water pressure dropped significantly yesterday in our Clemmons home. It's affecting all faucets and showers. What should I check before calling a plumber? Want to make sure it's not something simple I can fix myself.",
    authorName: "ClemmonsResident",
    citySlug: "clemmons",
    categorySlug: "plumbers",
    tags: ["plumbing", "water-pressure", "clemmons", "diy"],
    upvotes: 28,
    answerCount: 5,
    createdAt: "2024-05-22",
    slug: "water-pressure-dropped-check-first",
    isResolved: true,
  },
  {
    id: "q8",
    title: "Best kitchen countertop material for the budget-conscious?",
    body: "Doing a kitchen remodel in Thomasville. Looking at quartz vs granite vs butcher block. What's the best value for a family kitchen that gets heavy use? Budget is around $3,000-4,000 for countertops.",
    authorName: "KitchenReno2024",
    citySlug: "thomasville",
    categorySlug: "kitchen-remodeling",
    tags: ["kitchen", "countertops", "remodeling", "thomasville", "budget"],
    upvotes: 19,
    answerCount: 3,
    createdAt: "2024-05-30",
    slug: "best-kitchen-countertop-budget",
    isResolved: false,
  },
  {
    id: "q9",
    title: "How often should you service your HVAC in the Triad?",
    body: "New homeowner here in Greensboro. Our home inspector said we should get our HVAC serviced twice a year. Is that really necessary or just a way for HVAC companies to make money? The system is only 5 years old.",
    authorName: "FirstTimeOwner",
    citySlug: "greensboro",
    categorySlug: "hvac",
    tags: ["hvac", "maintenance", "greensboro", "new-homeowner"],
    upvotes: 33,
    answerCount: 6,
    createdAt: "2024-04-05",
    slug: "how-often-service-hvac-triad",
    isResolved: true,
  },
  {
    id: "q10",
    title: "Recommendations for commercial pressure washing in Winston-Salem?",
    body: "Need our restaurant exterior, sidewalk, and dumpster pad pressure washed. Looking for someone who does commercial work and can come on a Sunday when we're closed. Downtown Winston-Salem area.",
    authorName: "RestaurantOwnerWS",
    citySlug: "winston-salem",
    categorySlug: "cleaning-services",
    tags: ["pressure-washing", "commercial", "winston-salem", "restaurant"],
    upvotes: 11,
    answerCount: 2,
    createdAt: "2024-06-05",
    slug: "commercial-pressure-washing-winston-salem",
    isResolved: false,
  },
];

export const sampleAnswers: Answer[] = [
  // Q1 answers
  {
    id: "a1",
    questionId: "q1",
    authorName: "Triad Paving & Striping Co.",
    body: "Great question! The best time to sealcoat in the Triad is late spring through early fall — you need consistent temperatures above 50°F and at least 24 hours of dry weather. We typically recommend April through October. Avoid winter months as the sealant won't cure properly. For a standard residential driveway, expect to pay $200-$500 for professional sealcoating.",
    isBusinessOwner: true,
    businessName: "Triad Paving & Striping Co.",
    businessSlug: "triad-paving-striping-co",
    upvotes: 18,
    isAccepted: true,
    createdAt: "2024-05-16",
  },
  {
    id: "a2",
    questionId: "q1",
    authorName: "TriadLocal",
    body: "We had ours done last September and it came out great. Make sure the company cleans and fills any cracks before sealing — that's the sign of a quality job. We paid about $350 for a 2-car driveway.",
    isBusinessOwner: false,
    upvotes: 12,
    isAccepted: false,
    createdAt: "2024-05-17",
  },
  {
    id: "a1c",
    questionId: "q1",
    authorName: "DrivewayDIYer",
    body: "You can also rent a sealcoat sprayer from Home Depot and do it yourself for about $100-$150 in materials. But honestly, for a first-timer, I'd hire a pro. It's messier than it looks and a bad seal job can look worse than no seal at all.",
    isBusinessOwner: false,
    upvotes: 8,
    isAccepted: false,
    createdAt: "2024-05-18",
  },
  // Q2 answers
  {
    id: "a3",
    questionId: "q2",
    authorName: "Salem Roofing & Exteriors",
    body: "$12,000 is within a reasonable range for an 1,800 sq ft single-story ranch in the Triad. The final cost depends on shingle brand (architectural vs. 3-tab), the number of existing layers to tear off, and whether any decking needs replacement. Always make sure your roofer is GAF or CertainTeed certified — this affects your warranty significantly. We offer free inspections if you'd like a second opinion.",
    isBusinessOwner: true,
    businessName: "Salem Roofing & Exteriors",
    businessSlug: "salem-roofing-exteriors",
    upvotes: 22,
    isAccepted: true,
    createdAt: "2024-05-09",
  },
  {
    id: "a3b",
    questionId: "q2",
    authorName: "WSRoofVet",
    body: "Make sure to get at least 3 quotes. I got quotes of $9,500, $12,000, and $14,500 for my similar-sized ranch last year. The $9,500 one was using 3-tab shingles, the others were architectural. I went with the $12k quote and very happy with the result. Also — check if they include gutter apron replacement, that's often missed.",
    isBusinessOwner: false,
    upvotes: 16,
    isAccepted: false,
    createdAt: "2024-05-10",
  },
  // Q4 answers
  {
    id: "a4",
    questionId: "q4",
    authorName: "TriadPermitGuru",
    body: "Yes, Greensboro requires a fence permit for fences over 3 feet in the front yard or over 7 feet anywhere. A standard 6ft privacy fence in the backyard typically doesn't need a permit UNLESS you're in a historic district or your property has specific zoning restrictions. Check with the Greensboro Planning Department at (336) 373-2149. Also check your HOA rules if applicable — they often have their own fence requirements.",
    isBusinessOwner: false,
    upvotes: 35,
    isAccepted: true,
    createdAt: "2024-04-16",
  },
  {
    id: "a4b",
    questionId: "q4",
    authorName: "GSOFenceGuy",
    body: "As a fence installer in Guilford County — TriadPermitGuru is correct. One thing to add: you MUST have a survey or at minimum know your property lines. The #1 fence dispute we see is people building on their neighbor's property. Spend the $300-$400 on a survey. It'll save you thousands in headaches.",
    isBusinessOwner: true,
    businessName: "Triad Fence Co",
    upvotes: 28,
    isAccepted: false,
    createdAt: "2024-04-17",
  },
  // Q6 answers
  {
    id: "a6a",
    questionId: "q6",
    authorName: "Triad Paving & Striping Co.",
    body: "Great question — ADA compliance is critical and non-compliance can result in fines and lawsuits. Here are the basics for NC:\n\n• 1-25 total spaces: 1 accessible space required\n• 26-50 spaces: 2 accessible spaces\n• 1 in every 6 accessible spaces must be van-accessible (8ft wide with 8ft access aisle)\n• Standard accessible spaces: 8ft wide with 5ft access aisle\n• All spaces need proper signage (mounted 60\" minimum height)\n• Access aisles must connect to an accessible route to the building entrance\n• Slope cannot exceed 1:48 in any direction\n\nWe handle full ADA-compliant restriping and can do a free compliance audit of your lot before we start.",
    isBusinessOwner: true,
    businessName: "Triad Paving & Striping Co.",
    businessSlug: "triad-paving-striping-co",
    upvotes: 41,
    isAccepted: true,
    createdAt: "2024-06-11",
  },
  {
    id: "a6b",
    questionId: "q6",
    authorName: "ADAConsultantNC",
    body: "Good info from Triad Paving. I'd add: don't forget about the van-accessible spaces requirement. If you only have 1 accessible space, it MUST be van-accessible with an 8ft access aisle. Also, NC follows the federal ADA Standards for Accessible Design — you can find the full table at ada.gov. Some local jurisdictions have additional requirements beyond federal minimums.",
    isBusinessOwner: false,
    upvotes: 19,
    isAccepted: false,
    createdAt: "2024-06-12",
  },
  // Q7 answers
  {
    id: "a7a",
    questionId: "q7",
    authorName: "Triad Master Plumbing",
    body: "Before calling a plumber, here's your checklist:\n\n1. Check the main shutoff valve — make sure it's fully open\n2. Check the pressure regulator (brass bell-shaped device near the main line) — they fail every 10-15 years\n3. Ask your neighbors if they're experiencing the same issue — could be a city water main issue\n4. Check for visible leaks under sinks, around toilets, and at the water heater\n5. Check your water meter — if it's spinning when all faucets are off, you have a leak\n\nIf it's affecting the whole house simultaneously, it's most likely the pressure regulator or a main line issue. A plumber can diagnose this in about 30 minutes.",
    isBusinessOwner: true,
    businessName: "Triad Master Plumbing",
    businessSlug: "triad-master-plumbing",
    upvotes: 32,
    isAccepted: true,
    createdAt: "2024-05-23",
  },
  // Q9 answers
  {
    id: "a9a",
    questionId: "q9",
    authorName: "Twin City HVAC Solutions",
    body: "Your home inspector is right — twice a year is the standard recommendation, and it's not just a money grab. Here's why:\n\n**Spring tune-up (AC):** Clean coils, check refrigerant, test capacitor, clear drain line. A dirty coil can reduce efficiency by 30% and increase your electric bill by $20-40/month in summer.\n\n**Fall tune-up (Heat):** Inspect heat exchanger (cracked = carbon monoxide risk), clean burners, test safety switches. This is literally a safety check.\n\nAt 5 years old, your system is fine, but skipping maintenance is how a 15-year system becomes a 10-year system. Most manufacturer warranties require annual maintenance to stay valid — check your warranty paperwork.\n\nBudget $150-$200/year for both visits. Many companies offer maintenance plans for $120-$170/year that include priority scheduling and repair discounts.",
    isBusinessOwner: true,
    businessName: "Twin City HVAC Solutions",
    businessSlug: "twin-city-hvac-solutions",
    upvotes: 38,
    isAccepted: true,
    createdAt: "2024-04-06",
  },
  {
    id: "a9b",
    questionId: "q9",
    authorName: "HVACskeptic",
    body: "Honest answer: once a year is probably fine for a 5-year-old system. Spring before AC season is the most important one. The fall check is more critical for older systems where the heat exchanger could be cracking. That said, spending $75-$100 per visit for peace of mind isn't unreasonable.",
    isBusinessOwner: false,
    upvotes: 14,
    isAccepted: false,
    createdAt: "2024-04-07",
  },
];

export function getQuestionBySlug(slug: string): Question | undefined {
  return sampleQuestions.find((q) => q.slug === slug);
}

export function getAnswersByQuestionId(questionId: string): Answer[] {
  return sampleAnswers
    .filter((a) => a.questionId === questionId)
    .sort((a, b) => {
      if (a.isAccepted && !b.isAccepted) return -1;
      if (!a.isAccepted && b.isAccepted) return 1;
      return b.upvotes - a.upvotes;
    });
}

export function getRecentQuestions(count: number = 10): Question[] {
  return [...sampleQuestions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

export function getQuestionsByTag(tag: string): Question[] {
  return sampleQuestions.filter((q) => q.tags.includes(tag));
}

export function getQuestionsByCity(citySlug: string): Question[] {
  return sampleQuestions.filter((q) => q.citySlug === citySlug);
}

export function getPopularTags(): { tag: string; count: number }[] {
  const tagCounts: Record<string, number> = {};
  sampleQuestions.forEach((q) => {
    q.tags.forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getTopContributors(): { name: string; answers: number; isBusinessOwner: boolean }[] {
  const contributors: Record<string, { answers: number; isBusinessOwner: boolean }> = {};
  sampleAnswers.forEach((a) => {
    if (!contributors[a.authorName]) {
      contributors[a.authorName] = { answers: 0, isBusinessOwner: a.isBusinessOwner };
    }
    contributors[a.authorName].answers++;
  });
  return Object.entries(contributors)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.answers - a.answers);
}
