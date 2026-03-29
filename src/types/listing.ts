export type ListingTier = "free" | "basic" | "premium" | "elite";

export interface Listing {
  id: string;
  businessName: string;
  slug: string;
  description: string;
  shortDescription: string;
  citySlug: string;
  categorySlug: string;
  tier: ListingTier;
  phone: string;
  email: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  galleryUrls?: string[];
  hours?: BusinessHours;
  rating: number;
  reviewCount: number;
  yearEstablished?: number;
  licenseNumber?: string;
  isVerified: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface ListingWithCity extends Listing {
  cityName: string;
  categoryName: string;
}
