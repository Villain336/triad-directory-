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
}

export interface Answer {
  id: string;
  questionId: string;
  authorName: string;
  body: string;
  isBusinessOwner: boolean;
  businessName?: string;
  upvotes: number;
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
  },
  {
    id: "q3",
    title: "Reliable HVAC company for older homes in High Point?",
    body: "Our 1960s ranch in High Point needs a complete HVAC overhaul. The current system is original. Looking for someone who has experience with older homes and can handle ductwork modifications. Any suggestions?",
    authorName: "HPResident",
    citySlug: "high-point",
    categorySlug: "hvac",
    tags: ["hvac", "old homes", "high-point", "ductwork"],
    upvotes: 18,
    answerCount: 4,
    createdAt: "2024-04-28",
    slug: "reliable-hvac-older-homes-high-point",
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
  },
];

export const sampleAnswers: Answer[] = [
  {
    id: "a1",
    questionId: "q1",
    authorName: "Triad Paving & Striping Co.",
    body: "Great question! The best time to sealcoat in the Triad is late spring through early fall — you need consistent temperatures above 50°F and at least 24 hours of dry weather. We typically recommend April through October. Avoid winter months as the sealant won't cure properly. For a standard residential driveway, expect to pay $200-$500 for professional sealcoating.",
    isBusinessOwner: true,
    businessName: "Triad Paving & Striping Co.",
    upvotes: 18,
    createdAt: "2024-05-16",
  },
  {
    id: "a2",
    questionId: "q1",
    authorName: "TriadLocal",
    body: "We had ours done last September and it came out great. Make sure the company cleans and fills any cracks before sealing — that's the sign of a quality job. We paid about $350 for a 2-car driveway.",
    isBusinessOwner: false,
    upvotes: 12,
    createdAt: "2024-05-17",
  },
  {
    id: "a3",
    questionId: "q2",
    authorName: "Salem Roofing & Exteriors",
    body: "$12,000 is within a reasonable range for an 1,800 sq ft single-story ranch in the Triad. The final cost depends on shingle brand (architectural vs. 3-tab), the number of existing layers to tear off, and whether any decking needs replacement. Always make sure your roofer is GAF or CertainTeed certified — this affects your warranty significantly. We offer free inspections if you'd like a second opinion.",
    isBusinessOwner: true,
    businessName: "Salem Roofing & Exteriors",
    upvotes: 22,
    createdAt: "2024-05-09",
  },
  {
    id: "a4",
    questionId: "q4",
    authorName: "TriadPermitGuru",
    body: "Yes, Greensboro requires a fence permit for fences over 3 feet in the front yard or over 7 feet anywhere. A standard 6ft privacy fence in the backyard typically doesn't need a permit UNLESS you're in a historic district or your property has specific zoning restrictions. Check with the Greensboro Planning Department at (336) 373-2149. Also check your HOA rules if applicable — they often have their own fence requirements.",
    isBusinessOwner: false,
    upvotes: 35,
    createdAt: "2024-04-16",
  },
];

export function getQuestionBySlug(slug: string): Question | undefined {
  return sampleQuestions.find((q) => q.slug === slug);
}

export function getAnswersByQuestionId(questionId: string): Answer[] {
  return sampleAnswers.filter((a) => a.questionId === questionId);
}

export function getRecentQuestions(count: number = 10): Question[] {
  return [...sampleQuestions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}
