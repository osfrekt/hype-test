import { stripe } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return Response.json({ error: "Email required" }, { status: 400 });

    const user = await getOrCreateUser(email);
    if (!user.stripe_customer_id) {
      return Response.json({ error: "No active subscription" }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: "https://hypetest.ai/account",
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return Response.json({ error: "Failed to get portal" }, { status: 500 });
  }
}
