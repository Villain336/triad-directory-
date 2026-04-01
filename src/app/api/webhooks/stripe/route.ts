import { NextRequest, NextResponse } from "next/server";
import { getStripe, getTierFromPriceId } from "@/lib/stripe/config";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = await getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServerClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const { businessId, tier, addon } = session.metadata;

      if (addon === "featuredBoost") {
        // Activate 7-day featured boost
        const boostEnd = new Date();
        boostEnd.setDate(boostEnd.getDate() + 7);

        await supabase.from("boosts").insert({
          business_id: businessId,
          type: "featured",
          starts_at: new Date().toISOString(),
          ends_at: boostEnd.toISOString(),
          stripe_session_id: session.id,
          status: "active",
        });

        await supabase
          .from("businesses")
          .update({ is_featured: true })
          .eq("id", businessId);
      } else if (addon === "bannerAd") {
        // Create banner ad record
        await supabase.from("banner_ads").insert({
          business_id: businessId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          status: "active",
          starts_at: new Date().toISOString(),
        });
      } else if (addon === "leadPack10" || addon === "leadPack25" || addon === "leadPack50") {
        // Credit lead pack purchase
        const leadPackCredits: Record<string, number> = {
          leadPack10: 10,
          leadPack25: 25,
          leadPack50: 50,
        };
        const packSize = leadPackCredits[addon];
        const amountPaid = session.amount_total ?? 0;

        // Upsert lead_credits: increment total_purchased and balance
        const { data: existing } = await supabase
          .from("lead_credits")
          .select("total_purchased, balance")
          .eq("business_id", businessId)
          .single();

        if (existing) {
          await supabase
            .from("lead_credits")
            .update({
              total_purchased: existing.total_purchased + packSize,
              balance: existing.balance + packSize,
            })
            .eq("business_id", businessId);
        } else {
          await supabase.from("lead_credits").insert({
            business_id: businessId,
            total_purchased: packSize,
            total_used: 0,
            balance: packSize,
          });
        }

        // Record purchase history
        await supabase.from("lead_credit_purchases").insert({
          business_id: businessId,
          pack_size: packSize,
          amount_paid: amountPaid,
          stripe_session_id: session.id,
          purchased_at: new Date().toISOString(),
        });
      } else if (tier) {
        // Create subscription record
        await supabase.from("subscriptions").insert({
          business_id: businessId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          tier,
          status: "active",
        });

        // Upgrade business tier
        await supabase
          .from("businesses")
          .update({ tier, is_verified: true, is_featured: tier === "premium" || tier === "elite" })
          .eq("id", businessId);
      }

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as any;
      const priceId = subscription.items.data[0]?.price?.id;
      const tier = getTierFromPriceId(priceId);

      await supabase
        .from("subscriptions")
        .update({
          tier,
          status: subscription.status === "active" ? "active" : subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        })
        .eq("stripe_subscription_id", subscription.id);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;

      // Downgrade to free
      const { data: sub } = await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id)
        .select("business_id")
        .single();

      if (sub) {
        await supabase
          .from("businesses")
          .update({ tier: "free", is_featured: false })
          .eq("id", sub.business_id);
      }

      // Also cancel any banner ads tied to this subscription
      await supabase
        .from("banner_ads")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);

      break;
    }
  }

  return NextResponse.json({ received: true });
}
