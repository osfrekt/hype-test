import { createClient } from "@/lib/supabase/server";
import { sendFollowUpEmail } from "@/lib/email";

export async function GET(request: Request) {
  // Simple auth check via secret header
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: pending } = await supabase
    .from("email_followups")
    .select("*")
    .eq("sent", false)
    .lte("send_at", now)
    .limit(50);

  if (!pending?.length) {
    return Response.json({ sent: 0 });
  }

  let sent = 0;
  for (const followup of pending) {
    try {
      await sendFollowUpEmail(
        followup.email,
        followup.product_name,
        followup.intent_score
      );
      await supabase
        .from("email_followups")
        .update({ sent: true })
        .eq("id", followup.id);
      sent++;
    } catch (err) {
      console.error("Follow-up email failed:", err);
    }
  }

  return Response.json({ sent });
}
