import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function stripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return _stripe;
}

export const PLANS = {
  free: { name: "Free", researchLimit: 3, discoveryLimit: 0, price: 0 },
  starter: { name: "Starter", researchLimit: 15, discoveryLimit: 3, price: 4900 },
  pro: { name: "Pro", researchLimit: -1, discoveryLimit: -1, price: 14900 }, // -1 = unlimited
  team: { name: "Team", researchLimit: -1, discoveryLimit: -1, price: 34900 },
} as const;

export type PlanId = keyof typeof PLANS;
