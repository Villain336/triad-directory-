export interface Review {
  id: string;
  listingId: string;
  authorName: string;
  rating: number;
  content: string;
  isVerified: boolean;
  createdAt: string;
  ownerResponse?: string;
  ownerResponseDate?: string;
}

export const sampleReviews: Review[] = [
  {
    id: "r1",
    listingId: "1",
    authorName: "Sarah M.",
    rating: 5,
    content: "Triad Master Plumbing saved us during a weekend emergency. Our water heater burst and they were at our house within 45 minutes. Fair pricing, professional service, and they cleaned up after themselves. Highly recommend!",
    isVerified: true,
    createdAt: "2024-05-20",
    ownerResponse: "Thank you Sarah! We're glad we could help during such a stressful situation. We appreciate your trust in our team.",
    ownerResponseDate: "2024-05-21",
  },
  {
    id: "r2",
    listingId: "1",
    authorName: "James T.",
    rating: 5,
    content: "Used them for a complete bathroom remodel. The team was professional, on time, and the work quality was outstanding. They stayed within budget and finished on schedule.",
    isVerified: true,
    createdAt: "2024-04-15",
  },
  {
    id: "r3",
    listingId: "1",
    authorName: "Maria G.",
    rating: 4,
    content: "Good service for our kitchen sink replacement. Showed up on time and got the job done quickly. Only reason for 4 stars is the initial estimate was slightly lower than the final bill, but they explained the extra work needed.",
    isVerified: false,
    createdAt: "2024-03-28",
  },
  {
    id: "r4",
    listingId: "2",
    authorName: "David K.",
    rating: 5,
    content: "Carolina Electric Pro installed an EV charger in our garage. They handled the permit, did clean work, and explained everything. Best electricians in Greensboro hands down.",
    isVerified: true,
    createdAt: "2024-05-10",
    ownerResponse: "Thanks David! EV charger installations are one of our specialties. Enjoy the new charger!",
    ownerResponseDate: "2024-05-11",
  },
  {
    id: "r5",
    listingId: "2",
    authorName: "Lisa P.",
    rating: 5,
    content: "Had a panel upgrade done. These guys are the real deal — master electricians who know what they're doing. Everything passed inspection on the first try.",
    isVerified: true,
    createdAt: "2024-04-22",
  },
  {
    id: "r6",
    listingId: "3",
    authorName: "Robert H.",
    rating: 5,
    content: "Twin City HVAC installed a new heat pump system in our 1960s ranch. They were honest about what we needed, didn't try to upsell, and the install was flawless. Our energy bills dropped 30%.",
    isVerified: true,
    createdAt: "2024-05-25",
    ownerResponse: "Thanks Robert! Heat pump upgrades in older homes are a great investment. Happy to hear about your energy savings!",
    ownerResponseDate: "2024-05-26",
  },
  {
    id: "r7",
    listingId: "3",
    authorName: "Angela W.",
    rating: 5,
    content: "Same-day AC repair on the hottest day of the year. They diagnosed the issue in 20 minutes and had us cool again within an hour. Amazing service.",
    isVerified: true,
    createdAt: "2024-06-15",
  },
  {
    id: "r8",
    listingId: "3",
    authorName: "Tom B.",
    rating: 4,
    content: "Good HVAC company. Installed a ductless mini-split in our bonus room. Work was clean and professional. Scheduling took about a week which was the only downside.",
    isVerified: false,
    createdAt: "2024-03-10",
  },
  {
    id: "r9",
    listingId: "5",
    authorName: "Patricia N.",
    rating: 5,
    content: "Furniture City Contractors did a complete kitchen remodel for us. The attention to detail was incredible. Custom cabinets, quartz countertops, new flooring — all done perfectly.",
    isVerified: true,
    createdAt: "2024-04-05",
  },
  {
    id: "r10",
    listingId: "9",
    authorName: "Mark S.",
    rating: 5,
    content: "Dr. Chen and the team at Piedmont Dental are fantastic. They made my crown replacement painless and quick. The office is modern and everyone is so friendly. Best dentist in Burlington.",
    isVerified: true,
    createdAt: "2024-05-30",
  },
  {
    id: "r11",
    listingId: "13",
    authorName: "Mike C.",
    rating: 5,
    content: "Triad Paving restriped our entire 200-space parking lot in one day. Clean lines, ADA-compliant markings, and they even re-did our fire lane markings. Very professional crew. Will use again for sealcoating next spring.",
    isVerified: true,
    createdAt: "2024-05-18",
    ownerResponse: "Thanks Mike! We take pride in getting commercial jobs done fast without cutting corners. Looking forward to the sealcoating project!",
    ownerResponseDate: "2024-05-19",
  },
  {
    id: "r12",
    listingId: "13",
    authorName: "Karen L.",
    rating: 5,
    content: "Had our church parking lot paved and striped. They handled the whole project from tear-out to final striping. Great communication throughout and finished ahead of schedule. Fair price for excellent work.",
    isVerified: true,
    createdAt: "2024-04-02",
  },
];

export function getReviewsByListingId(listingId: string): Review[] {
  return sampleReviews.filter((r) => r.listingId === listingId);
}

export function getAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1));
}
