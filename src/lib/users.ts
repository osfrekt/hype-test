import { createClient } from "@/lib/supabase/server";
import type { PlanId } from "./lemonsqueezy";

export interface User {
  email: string;
  name: string | null;
  company: string | null;
  role: string | null;
  company_size: string | null;
  plan: PlanId;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  research_count_this_month: number;
  discovery_count_this_month: number;
  month_reset_at: string;
  created_at: string;
}

export async function getOrCreateUser(email: string, name?: string, company?: string, role?: string, companySize?: string): Promise<User> {
  const supabase = await createClient();

  // Try to get existing user
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existing) {
    // Check if month needs reset
    const resetAt = new Date(existing.month_reset_at);
    if (new Date() >= resetAt) {
      const nextReset = new Date();
      nextReset.setMonth(nextReset.getMonth() + 1, 1);
      nextReset.setHours(0, 0, 0, 0);

      const { data: updated } = await supabase
        .from("users")
        .update({
          research_count_this_month: 0,
          discovery_count_this_month: 0,
          month_reset_at: nextReset.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)
        .select()
        .single();

      return updated as User;
    }
    return existing as User;
  }

  // Create new user
  const nextReset = new Date();
  nextReset.setMonth(nextReset.getMonth() + 1, 1);
  nextReset.setHours(0, 0, 0, 0);

  const { data: created } = await supabase
    .from("users")
    .insert({
      email,
      name: name || null,
      company: company || null,
      role: role || null,
      company_size: companySize || null,
      plan: "free",
      month_reset_at: nextReset.toISOString(),
    })
    .select()
    .single();

  return created as User;
}

export async function incrementUsage(email: string, type: "research" | "discovery"): Promise<void> {
  const supabase = await createClient();
  const column = type === "research" ? "research_count_this_month" : "discovery_count_this_month";

  // Use raw SQL to atomically increment
  await supabase.rpc("increment_usage", { user_email: email, usage_column: column });
}

export async function checkQuota(email: string, type: "research" | "discovery"): Promise<{ allowed: boolean; remaining: number; limit: number; plan: PlanId }> {
  const { PLANS } = await import("./lemonsqueezy");
  const user = await getOrCreateUser(email);
  const plan = PLANS[user.plan] || PLANS.free;
  const limit = type === "research" ? plan.researchLimit : plan.discoveryLimit;

  const used = type === "research" ? user.research_count_this_month : user.discovery_count_this_month;
  const remaining = Math.max(0, limit - used);

  return { allowed: remaining > 0, remaining, limit, plan: user.plan };
}
