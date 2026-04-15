import { stripe, PRICE_IDS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

// Reverse lookup: price ID -> plan name
function planFromPriceId(priceId: string): string | null {
  for (const [plan, id] of Object.entries(PRICE_IDS)) {
    if (id === priceId) return plan;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET!;

    if (!signature) {
      return Response.json({ error: "Missing signature" }, { status: 401 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch {
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    const supabase = createAdminClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.metadata?.email || session.customer_email;
        const plan = session.metadata?.plan;
        const customerId = typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;
        const subscriptionId = typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

        if (email && plan && customerId) {
          await supabase.from("users").update({
            plan,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId || null,
            updated_at: new Date().toISOString(),
          }).eq("email", email);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;
        const status = subscription.status;

        if (status === "active") {
          // Check if plan changed (upgrade/downgrade)
          const priceId = subscription.items.data[0]?.price?.id;
          const newPlan = priceId ? planFromPriceId(priceId) : null;

          const update: Record<string, unknown> = {
            stripe_subscription_id: subscription.id,
            updated_at: new Date().toISOString(),
          };
          if (newPlan) update.plan = newPlan;

          await supabase.from("users").update(update)
            .eq("stripe_customer_id", customerId);
        } else if (status === "canceled" || status === "unpaid" || status === "past_due") {
          await supabase.from("users").update({
            plan: "free",
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          }).eq("stripe_customer_id", customerId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

        await supabase.from("users").update({
          plan: "free",
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        }).eq("stripe_customer_id", customerId);
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
