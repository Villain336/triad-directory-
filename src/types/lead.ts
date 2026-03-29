export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  listingId?: string;
  citySlug?: string;
  categorySlug?: string;
  source: "contact_form" | "quote_request" | "click_to_call" | "claim_listing" | "newsletter";
  createdAt: string;
}
