import { stripe } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/users";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) return Response.json({ error: "Email required" }, { status: 400 });

  const user = await getOrCreateUser(email);
  if (!user.stripe_customer_id) {
    return Response.json({ error: "No billing account" }, { status: 404 });
  }

  const session = await stripe().billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: "https://hypetest.ai/account",
  });

  return Response.json({ url: session.url });
}
