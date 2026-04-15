import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

// Re-export as stripe for convenience in route handlers
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = {
  free: { name: "Free", researchLimit: 3, discoveryLimit: 0, price: 0 },
  starter: { name: "Starter", researchLimit: 30, discoveryLimit: 10, price: 4900 },
  pro: { name: "Pro", researchLimit: 100, discoveryLimit: 50, price: 14900 },
  team: { name: "Team", researchLimit: 500, discoveryLimit: 200, price: 34900 },
} as const;

export type PlanId = keyof typeof PLANS;

export const PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
  team: process.env.STRIPE_TEAM_PRICE_ID,
};
