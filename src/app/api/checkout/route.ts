import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICE_IDS, ADDON_PRICE_IDS } from "@/lib/stripe/config";
import { SITE_URL } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, businessId, email, addon } = body;

    // Handle add-on purchases (boost, banner ad)
    if (addon) {
      const addonPriceId = ADDON_PRICE_IDS[addon as keyof typeof ADDON_PRICE_IDS];
      if (!addonPriceId) {
        return NextResponse.json({ error: "Invalid add-on" }, { status: 400 });
      }

      const isRecurring = addon === "bannerAd";
      const session = await stripe.checkout.sessions.create({
        mode: isRecurring ? "subscription" : "payment",
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [{ price: addonPriceId, quantity: 1 }],
        metadata: { businessId, addon },
        success_url: `${SITE_URL}/dashboard?purchased=${addon}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}/pricing`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Handle tier subscriptions
    const priceId = PRICE_IDS[tier as keyof typeof PRICE_IDS];
    if (!priceId || tier === "free") {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { businessId, tier },
      success_url: `${SITE_URL}/business-portal?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
