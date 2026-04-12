import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export function initLemonSqueezy() {
  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });
}

export const PLANS = {
  free: { name: "Free", researchLimit: 3, discoveryLimit: 0, price: 0 },
  starter: { name: "Starter", researchLimit: 30, discoveryLimit: 10, price: 4900 },
  pro: { name: "Pro", researchLimit: 100, discoveryLimit: 50, price: 14900 },
  team: { name: "Team", researchLimit: 500, discoveryLimit: 200, price: 34900 },
} as const;

export type PlanId = keyof typeof PLANS;
