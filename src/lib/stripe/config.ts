import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia" as any,
});

export const PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_BASIC || "price_basic",
  premium: process.env.STRIPE_PRICE_PREMIUM || "price_premium",
  elite: process.env.STRIPE_PRICE_ELITE || "price_elite",
};

export function getTierFromPriceId(priceId: string): string {
  if (priceId === PRICE_IDS.basic) return "basic";
  if (priceId === PRICE_IDS.premium) return "premium";
  if (priceId === PRICE_IDS.elite) return "elite";
  return "free";
}
