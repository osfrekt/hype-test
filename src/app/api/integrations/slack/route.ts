import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/rate-limit";

const isRateLimited = createRateLimiter(10);

export async function GET(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many requests." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json({ error: "email is required" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("slack_webhook_url")
      .eq("email", email)
      .single();

    if (error) {
      return Response.json({ slackWebhookUrl: null });
    }

    return Response.json({ slackWebhookUrl: data?.slack_webhook_url ?? null });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : null;
    const webhookUrl = typeof body.webhookUrl === "string" ? body.webhookUrl.trim() : null;

    if (!email) {
      return Response.json({ error: "email is required" }, { status: 400 });
    }

    // Validate webhook URL format if provided
    if (webhookUrl && !webhookUrl.startsWith("https://hooks.slack.com/")) {
      return Response.json(
        { error: "Invalid Slack webhook URL. It should start with https://hooks.slack.com/" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("users")
      .update({
        slack_webhook_url: webhookUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email);

    if (error) {
      console.error("Failed to save Slack webhook:", error);
      return Response.json({ error: "Failed to save webhook URL" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
