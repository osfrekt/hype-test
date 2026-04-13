import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return Response.json({ isAdmin: false });
  }

  const isAdmin = await isAdminEmail(user.email);
  return Response.json({ isAdmin });
}
