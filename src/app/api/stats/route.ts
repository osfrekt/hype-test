import { createAdminClient } from "@/lib/supabase/admin";

const RESULT_TABLES = [
  "research_results",
  "ab_test_results",
  "name_test_results",
  "pricing_test_results",
  "audience_test_results",
  "ad_test_results",
  "logo_test_results",
  "discovery_results",
  "competitive_results",
  "market_research_results",
  "platform_ad_results",
];

let cachedCount: number | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

export async function GET() {
  const now = Date.now();
  if (cachedCount !== null && now - cacheTime < CACHE_TTL) {
    return Response.json({ count: cachedCount });
  }

  const admin = createAdminClient();
  let total = 0;

  for (const table of RESULT_TABLES) {
    try {
      const { count } = await admin
        .from(table)
        .select("*", { count: "exact", head: true });
      if (count) total += count;
    } catch {
      // table may not exist yet
    }
  }

  cachedCount = total;
  cacheTime = now;

  return Response.json({ count: total });
}
