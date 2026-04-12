import { getSubscription } from "@lemonsqueezy/lemonsqueezy.js";
import { initLemonSqueezy } from "@/lib/lemonsqueezy";
import { getOrCreateUser } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return Response.json({ error: "Email required" }, { status: 400 });

    const user = await getOrCreateUser(email);
    if (!user.stripe_subscription_id) {
      return Response.json({ error: "No active subscription" }, { status: 404 });
    }

    initLemonSqueezy();

    const sub = await getSubscription(user.stripe_subscription_id);
    const portalUrl = sub.data?.data?.attributes?.urls?.customer_portal;

    if (!portalUrl) {
      return Response.json({ error: "Could not get portal URL" }, { status: 500 });
    }

    return Response.json({ url: portalUrl });
  } catch (error) {
    console.error("Portal error:", error);
    return Response.json({ error: "Failed to get portal" }, { status: 500 });
  }
}
