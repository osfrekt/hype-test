import { stripe } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/users";
import { createClient } from "@/lib/supabase/server";

const PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
  team: process.env.STRIPE_TEAM_PRICE_ID,
};

export async function POST(request: Request) {
  const { email, plan } = await request.json();

  if (!email || !plan || !PRICE_IDS[plan]) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const user = await getOrCreateUser(email);

  // Get or create Stripe customer
  let customerId = user.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe().customers.create({
      email,
      name: user.name || undefined,
      metadata: { company: user.company || "", role: user.role || "" },
    });
    customerId = customer.id;

    const supabase = await createClient();
    await supabase.from("users").update({ stripe_customer_id: customerId }).eq("email", email);
  }

  const session = await stripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: PRICE_IDS[plan]!, quantity: 1 }],
    success_url: `https://hypetest.ai/account?checkout=success`,
    cancel_url: `https://hypetest.ai/pricing?checkout=cancelled`,
    metadata: { email, plan },
  });

  return Response.json({ url: session.url });
}
