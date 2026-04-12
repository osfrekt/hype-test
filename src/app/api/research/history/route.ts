import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/rate-limit";

const isRateLimited = createRateLimiter(10);

export async function GET(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many requests. Please wait a few minutes." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const product = searchParams.get("product");

  if (!email || !product) {
    return Response.json(
      { error: "email and product query params are required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("research_results")
      .select("id, input, purchase_intent, wtp_range, created_at")
      .eq("email", email)
      .ilike("input->>productName", product)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Research history query error:", error);
      return Response.json({ error: "Failed to fetch history" }, { status: 500 });
    }

    const results = (data ?? []).map((row) => ({
      id: row.id,
      productName: row.input?.productName,
      intentScore: row.purchase_intent?.score,
      wtpMid: row.wtp_range?.mid,
      createdAt: row.created_at,
    }));

    return Response.json({ results });
  } catch (err) {
    console.error("Research history error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
