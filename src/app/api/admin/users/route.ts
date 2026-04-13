import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, isMasterAdmin, listAdminUsers, addAdminUser, removeAdminUser } from "@/lib/admin";

async function getAuthenticatedAdminEmail(request: Request): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const isAdmin = await isAdminEmail(user.email);
  return isAdmin ? user.email : null;
}

export async function GET(request: Request) {
  const email = await getAuthenticatedAdminEmail(request);
  if (!email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admins = await listAdminUsers();
  return Response.json({ admins, isMaster: isMasterAdmin(email) });
}

export async function POST(request: Request) {
  const email = await getAuthenticatedAdminEmail(request);
  if (!email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMasterAdmin(email)) {
    return Response.json({ error: "Only the master account can add admins" }, { status: 403 });
  }

  const body = await request.json();
  const newEmail = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";

  if (!newEmail || !newEmail.includes("@")) {
    return Response.json({ error: "Valid email is required" }, { status: 400 });
  }

  const result = await addAdminUser(newEmail, email);
  if (!result.success) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  const email = await getAuthenticatedAdminEmail(request);
  if (!email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMasterAdmin(email)) {
    return Response.json({ error: "Only the master account can remove admins" }, { status: 403 });
  }

  const body = await request.json();
  const targetEmail = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";

  if (!targetEmail) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  const result = await removeAdminUser(targetEmail, email);
  if (!result.success) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json({ success: true });
}
