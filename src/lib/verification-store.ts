// Store verification codes in Supabase for persistence across serverless instances

import { createClient } from "@/lib/supabase/server";

export async function storeCode(email: string, code: string): Promise<void> {
  const supabase = await createClient();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // Upsert: replace any existing code for this email
  await supabase
    .from("verification_codes")
    .upsert(
      { email: email.toLowerCase(), code, expires_at: expiresAt },
      { onConflict: "email" }
    );
}

export async function checkCode(email: string, code: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("verification_codes")
    .select("code, expires_at")
    .eq("email", email.toLowerCase())
    .single();

  if (!data) return false;
  if (new Date(data.expires_at) < new Date()) {
    // Expired - clean up
    await supabase.from("verification_codes").delete().eq("email", email.toLowerCase());
    return false;
  }
  return data.code === code;
}

export async function consumeCode(email: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("verification_codes").delete().eq("email", email.toLowerCase());
}
