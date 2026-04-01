import type Stripe from "stripe";

let _stripe: Stripe | null = null;

export async function getStripe(): Promise<Stripe> {
  if (!_stripe) {
    const { default: StripeSDK } = await import("stripe");
    _stripe = new StripeSDK(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-12-18.acacia" as any,
    });
  }
  return _stripe;
}

export const PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_BASIC || "price_1TGaF3R69hwQuKhC7UJGV8cM",
  premium: process.env.STRIPE_PRICE_PREMIUM || "price_1TGaF4R69hwQuKhCCzhwnVYi",
};

export const ADDON_PRICE_IDS = {
  featuredBoost: process.env.STRIPE_PRICE_BOOST || "price_1TGaF6R69hwQuKhCsdttErbF",
  bannerAd: process.env.STRIPE_PRICE_BANNER || "price_1TGaF7R69hwQuKhCJtCpdEIE",
  leadPack10: process.env.STRIPE_PRICE_LEAD_10 || "price_1TGaWuR69hwQuKhC5uAx3cGs",
  leadPack25: process.env.STRIPE_PRICE_LEAD_25 || "price_1TGaWvR69hwQuKhCMQyjmSax",
  leadPack50: process.env.STRIPE_PRICE_LEAD_50 || "price_1TGaWvR69hwQuKhCtnzljUNe",
};

export function getTierFromPriceId(priceId: string): string {
  if (priceId === PRICE_IDS.basic) return "basic";
  if (priceId === PRICE_IDS.premium) return "premium";
  return "free";
}
