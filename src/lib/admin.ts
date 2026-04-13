import { createAdminClient } from "@/lib/supabase/admin";

const MASTER_EMAIL = "osf@rekt.com";

export function isMasterAdmin(email: string): boolean {
  return email === MASTER_EMAIL;
}

export async function isAdminEmail(email: string): Promise<boolean> {
  if (email === MASTER_EMAIL) return true;

  const admin = createAdminClient();
  const { data } = await admin
    .from("admin_users")
    .select("email")
    .eq("email", email)
    .single();

  return !!data;
}

export async function getAdminRole(email: string): Promise<"master" | "admin" | null> {
  if (email === MASTER_EMAIL) return "master";

  const admin = createAdminClient();
  const { data } = await admin
    .from("admin_users")
    .select("role")
    .eq("email", email)
    .single();

  if (!data) return null;
  return data.role === "master" ? "master" : "admin";
}

export async function listAdminUsers(): Promise<{ email: string; role: string; addedBy: string; createdAt: string }[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("admin_users")
    .select("email, role, added_by, created_at")
    .order("created_at", { ascending: true });

  return (data || []).map((row: { email: string; role: string; added_by: string; created_at: string }) => ({
    email: row.email,
    role: row.role,
    addedBy: row.added_by,
    createdAt: row.created_at,
  }));
}

export async function addAdminUser(email: string, addedBy: string): Promise<{ success: boolean; error?: string }> {
  if (!isMasterAdmin(addedBy)) {
    return { success: false, error: "Only the master account can add admin users" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_users")
    .insert({ email: email.toLowerCase().trim(), role: "admin", added_by: addedBy });

  if (error) {
    if (error.code === "23505") return { success: false, error: "This email is already an admin" };
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function removeAdminUser(email: string, removedBy: string): Promise<{ success: boolean; error?: string }> {
  if (!isMasterAdmin(removedBy)) {
    return { success: false, error: "Only the master account can remove admin users" };
  }

  if (email === MASTER_EMAIL) {
    return { success: false, error: "Cannot remove the master account" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_users")
    .delete()
    .eq("email", email);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
