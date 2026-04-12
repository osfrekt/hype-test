import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { initLemonSqueezy } from "@/lib/lemonsqueezy";
import { getOrCreateUser } from "@/lib/users";

const VARIANT_IDS: Record<string, string | undefined> = {
  starter: process.env.LEMONSQUEEZY_STARTER_VARIANT_ID,
  pro: process.env.LEMONSQUEEZY_PRO_VARIANT_ID,
  team: process.env.LEMONSQUEEZY_TEAM_VARIANT_ID,
};

export async function POST(request: Request) {
  try {
    const { email, plan } = await request.json();

    if (!email || !plan || !VARIANT_IDS[plan]) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await getOrCreateUser(email);

    initLemonSqueezy();

    const storeId = process.env.LEMONSQUEEZY_STORE_ID!;
    const variantId = VARIANT_IDS[plan]!;

    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: {
        email,
        name: user.name || undefined,
        custom: { email, plan },
      },
      productOptions: {
        redirectUrl: "https://hypetest.ai/account?checkout=success",
      },
    });

    const url = checkout.data?.data?.attributes?.url;
    if (!url) {
      return Response.json({ error: "Failed to create checkout" }, { status: 500 });
    }

    return Response.json({ url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
