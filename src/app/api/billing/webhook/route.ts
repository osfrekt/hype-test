import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.metadata?.email;
      const plan = session.metadata?.plan;
      if (email && plan) {
        await supabase.from("users").update({
          plan,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          updated_at: new Date().toISOString(),
        }).eq("email", email);
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object;
      if (sub.status === "active") {
        const customerId = sub.customer as string;
        const { data: user } = await supabase.from("users").select("email").eq("stripe_customer_id", customerId).single();
        if (user) {
          await supabase.from("users").update({
            stripe_subscription_id: sub.id,
            updated_at: new Date().toISOString(),
          }).eq("email", user.email);
        }
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const customerId = sub.customer as string;
      const { data: user } = await supabase.from("users").select("email").eq("stripe_customer_id", customerId).single();
      if (user) {
        await supabase.from("users").update({
          plan: "free",
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        }).eq("email", user.email);
      }
      break;
    }
  }

  return Response.json({ received: true });
}
