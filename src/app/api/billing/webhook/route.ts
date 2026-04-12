import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

    // Verify signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody);
    const digest = hmac.digest("hex");

    if (digest !== signature) {
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const customData = event.meta?.custom_data;
    const email = customData?.email;
    const plan = customData?.plan;
    const subscriptionId = String(event.data?.id);
    const customerId = String(event.data?.attributes?.customer_id);

    const supabase = createAdminClient();

    switch (eventName) {
      case "subscription_created": {
        if (email && plan) {
          await supabase.from("users").update({
            plan,
            stripe_customer_id: customerId, // reuse column for LS customer ID
            stripe_subscription_id: subscriptionId, // reuse for LS subscription ID
            updated_at: new Date().toISOString(),
          }).eq("email", email);
        }
        break;
      }
      case "subscription_updated": {
        const status = event.data?.attributes?.status;
        if (status === "active" && email) {
          await supabase.from("users").update({
            stripe_subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          }).eq("email", email);
        } else if (status === "cancelled" || status === "expired") {
          // Find user by subscription ID
          const { data: user } = await supabase.from("users")
            .select("email")
            .eq("stripe_subscription_id", subscriptionId)
            .single();
          if (user) {
            await supabase.from("users").update({
              plan: "free",
              stripe_subscription_id: null,
              updated_at: new Date().toISOString(),
            }).eq("email", user.email);
          }
        }
        break;
      }
      case "subscription_cancelled":
      case "subscription_expired": {
        const { data: user } = await supabase.from("users")
          .select("email")
          .eq("stripe_subscription_id", subscriptionId)
          .single();
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
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
