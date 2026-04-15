import { stripe, PRICE_IDS } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const { email, plan } = await request.json();

    if (!email || !plan || !PRICE_IDS[plan]) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await getOrCreateUser(email);

    // Reuse existing Stripe customer or create new one
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name: user.name || undefined,
        metadata: { plan },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: PRICE_IDS[plan]!,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: { email, plan },
      },
      automatic_tax: { enabled: true },
      customer_update: {
        address: "auto",
      },
      tax_id_collection: { enabled: true },
      success_url: "https://hypetest.ai/account?checkout=success",
      cancel_url: "https://hypetest.ai/pricing",
      metadata: { email, plan },
    });

    if (!session.url) {
      return Response.json({ error: "Failed to create checkout" }, { status: 500 });
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
