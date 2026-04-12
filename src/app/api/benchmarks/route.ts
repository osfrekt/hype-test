import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return Response.json({ error: "Category required" }, { status: 400 });
  }

  const supabase = await createClient();

  // Get all results for this category
  const { data } = await supabase
    .from("research_results")
    .select("purchase_intent, wtp_range, nps_score")
    .eq("input->>category", category)
    .not("purchase_intent", "is", null);

  if (!data || data.length < 3) {
    // Not enough data for meaningful benchmarks
    return Response.json({ benchmarks: null, sampleSize: data?.length ?? 0 });
  }

  // Compute averages
  const intentScores = data
    .map((d) => d.purchase_intent?.score)
    .filter((v): v is number => typeof v === "number");
  const wtpMids = data
    .map((d) => d.wtp_range?.mid)
    .filter((v): v is number => typeof v === "number");
  const npsScores = data
    .map((d) => d.nps_score)
    .filter((v): v is number => v !== null && v !== undefined);

  const avg = (arr: number[]) =>
    arr.length
      ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
      : null;

  return Response.json({
    benchmarks: {
      avgIntent: avg(intentScores),
      avgWtp: avg(wtpMids),
      avgNps: avg(npsScores),
      sampleSize: data.length,
    },
  });
}
