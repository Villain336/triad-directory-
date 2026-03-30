import { NextRequest, NextResponse } from "next/server";
import { stripe, getTierFromPriceId } from "@/lib/stripe/config";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

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
      const { businessId, tier } = session.metadata;

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

      break;
    }
  }

  return NextResponse.json({ received: true });
}
