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
  referral_code: string | null;
  referred_by: string | null;
  bonus_runs: number;
}

function generateReferralCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
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
    // Generate referral code if missing
    if (!existing.referral_code) {
      await supabase
        .from("users")
        .update({ referral_code: generateReferralCode() })
        .eq("email", email);
      existing.referral_code = existing.referral_code || generateReferralCode();
    }

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
      referral_code: generateReferralCode(),
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
  // Admin users get unlimited access
  const { isAdminEmail } = await import("./admin");
  if (await isAdminEmail(email)) {
    return { allowed: true, remaining: 999, limit: 999, plan: "team" };
  }

  const { PLANS } = await import("./lemonsqueezy");
  const user = await getOrCreateUser(email);
  const plan = PLANS[user.plan] || PLANS.free;
  const baseLimit = type === "research" ? plan.researchLimit : plan.discoveryLimit;
  const bonusRuns = user.bonus_runs || 0;
  const effectiveLimit = type === "research" ? baseLimit + bonusRuns : baseLimit;

  const used = type === "research" ? user.research_count_this_month : user.discovery_count_this_month;
  const remaining = Math.max(0, effectiveLimit - used);

  return { allowed: remaining > 0, remaining, limit: effectiveLimit, plan: user.plan };
}

export async function processReferral(referredEmail: string, referralCode: string): Promise<boolean> {
  const supabase = await createClient();

  // Find the referrer by their referral code
  const { data: referrer } = await supabase
    .from("users")
    .select("email")
    .eq("referral_code", referralCode)
    .single();

  if (!referrer || referrer.email === referredEmail) return false;

  // Check if referral already exists
  const { data: existingReferral } = await supabase
    .from("referrals")
    .select("id")
    .eq("referred_email", referredEmail)
    .single();

  if (existingReferral) return false;

  // Create referral record
  await supabase.from("referrals").insert({
    referrer_email: referrer.email,
    referred_email: referredEmail,
    status: "completed",
    bonus_runs_awarded: true,
  });

  // Award 3 bonus runs to referrer
  await supabase.rpc("increment_bonus_runs", { user_email: referrer.email, bonus: 3 });

  // Award 3 bonus runs to referred user
  await supabase.rpc("increment_bonus_runs", { user_email: referredEmail, bonus: 3 });

  // Set referred_by on the new user
  await supabase
    .from("users")
    .update({ referred_by: referralCode })
    .eq("email", referredEmail);

  return true;
}
