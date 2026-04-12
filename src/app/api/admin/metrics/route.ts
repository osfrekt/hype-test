import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = ["osf@rekt.com"];

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  starter: 49,
  pro: 149,
  team: 349,
};

export async function GET(request: Request) {
  // Auth check: either CRON_SECRET header or admin Supabase auth
  const cronSecret = request.headers.get("x-cron-secret");
  const envCronSecret = process.env.CRON_SECRET;

  if (cronSecret && envCronSecret && cronSecret === envCronSecret) {
    // Authenticated via cron secret
  } else {
    // Check Supabase auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email || !ADMIN_EMAILS.includes(user.email)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const admin = createAdminClient();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // --- Users ---
  const { count: totalUsers } = await admin.from("users").select("*", { count: "exact", head: true });

  // Users by plan
  const { data: usersData } = await admin.from("users").select("plan");
  const planCounts: Record<string, number> = { free: 0, starter: 0, pro: 0, team: 0 };
  (usersData || []).forEach((u: { plan: string }) => {
    planCounts[u.plan] = (planCounts[u.plan] || 0) + 1;
  });
  const usersByPlan = Object.entries(planCounts).map(([plan, count]) => ({ plan, count }));

  // MRR estimate
  const mrrEstimate = Object.entries(planCounts).reduce(
    (sum, [plan, count]) => sum + (PLAN_PRICES[plan] || 0) * count,
    0
  );

  // Signups
  const { count: signupsToday } = await admin.from("users").select("*", { count: "exact", head: true }).gte("created_at", todayStart);
  const { count: signupsThisWeek } = await admin.from("users").select("*", { count: "exact", head: true }).gte("created_at", weekStart);
  const { count: signupsThisMonth } = await admin.from("users").select("*", { count: "exact", head: true }).gte("created_at", monthStart);

  // --- Research Runs ---
  const { count: totalResearchRuns } = await admin.from("research_results").select("*", { count: "exact", head: true });
  const { count: runsToday } = await admin.from("research_results").select("*", { count: "exact", head: true }).gte("created_at", todayStart);
  const { count: runsThisWeek } = await admin.from("research_results").select("*", { count: "exact", head: true }).gte("created_at", weekStart);
  const { count: runsThisMonth } = await admin.from("research_results").select("*", { count: "exact", head: true }).gte("created_at", monthStart);

  // Runs by tool type
  const toolTables = [
    { table: "research_results", tool: "Consumer Research" },
    { table: "ab_test_results", tool: "A/B Test" },
    { table: "name_test_results", tool: "Name Test" },
    { table: "pricing_test_results", tool: "Pricing Test" },
    { table: "audience_test_results", tool: "Audience Test" },
    { table: "ad_test_results", tool: "Ad Test" },
    { table: "logo_test_results", tool: "Logo Test" },
    { table: "discovery_results", tool: "Discovery" },
    { table: "competitive_results", tool: "Competitive" },
    { table: "market_research_results", tool: "Market Research" },
  ];

  const runsByTool: { tool: string; count: number }[] = [];
  for (const { table, tool } of toolTables) {
    try {
      const { count } = await admin.from(table).select("*", { count: "exact", head: true });
      if (count && count > 0) {
        runsByTool.push({ tool, count });
      }
    } catch {
      // Table may not exist
    }
  }
  runsByTool.sort((a, b) => b.count - a.count);

  // Average runs per user per month
  const totalAllRuns = runsByTool.reduce((sum, t) => sum + t.count, 0);
  const avgRunsPerUser = totalUsers && totalUsers > 0 ? totalAllRuns / totalUsers : 0;

  // --- Engagement ---
  const { data: active7 } = await admin.from("research_results").select("email").gte("created_at", weekStart);
  const activeUsersLast7 = new Set((active7 || []).map((r: { email: string }) => r.email).filter(Boolean)).size;

  const { data: active30 } = await admin.from("research_results").select("email").gte("created_at", monthStart);
  const activeUsersLast30 = new Set((active30 || []).map((r: { email: string }) => r.email).filter(Boolean)).size;

  // Repeat users
  const { data: allEmails } = await admin.from("research_results").select("email");
  const emailCounts: Record<string, number> = {};
  (allEmails || []).forEach((r: { email: string }) => {
    if (r.email) emailCounts[r.email] = (emailCounts[r.email] || 0) + 1;
  });
  const repeatUsers = Object.values(emailCounts).filter((c) => c > 1).length;

  // --- Top categories ---
  const { data: categoriesData } = await admin.from("research_results").select("input").limit(500);
  const catCounts: Record<string, number> = {};
  (categoriesData || []).forEach((r: { input: { category?: string } }) => {
    const cat = r.input?.category;
    if (cat) catCounts[cat] = (catCounts[cat] || 0) + 1;
  });
  const topCategories = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([category, count]) => ({ category, count }));

  // --- Recent activity ---
  const recentActivity: { timestamp: string; email: string; productName: string; toolType: string }[] = [];

  // Gather from multiple tables
  const activitySources = [
    { table: "research_results", tool: "Consumer Research", nameField: "productName" },
    { table: "ab_test_results", tool: "A/B Test", nameField: "productName" },
    { table: "name_test_results", tool: "Name Test", nameField: "brandName" },
    { table: "pricing_test_results", tool: "Pricing Test", nameField: "productName" },
    { table: "audience_test_results", tool: "Audience Test", nameField: "productName" },
    { table: "ad_test_results", tool: "Ad Test", nameField: "brandName" },
    { table: "logo_test_results", tool: "Logo Test", nameField: "brandName" },
    { table: "discovery_results", tool: "Discovery", nameField: "brandName" },
    { table: "competitive_results", tool: "Competitive", nameField: "productName" },
    { table: "market_research_results", tool: "Market Research", nameField: "category" },
  ];

  for (const { table, tool, nameField } of activitySources) {
    try {
      const { data } = await admin
        .from(table)
        .select("email, input, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (data) {
        for (const row of data) {
          const r = row as { email: string; input: Record<string, string>; created_at: string };
          recentActivity.push({
            timestamp: r.created_at,
            email: r.email || "anonymous",
            productName: r.input?.[nameField] || r.input?.productName || r.input?.brandName || r.input?.category || "Untitled",
            toolType: tool,
          });
        }
      }
    } catch {
      // Table may not exist
    }
  }

  recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return Response.json({
    totalUsers: totalUsers || 0,
    usersByPlan,
    signupsToday: signupsToday || 0,
    signupsThisWeek: signupsThisWeek || 0,
    signupsThisMonth: signupsThisMonth || 0,
    mrrEstimate,
    totalResearchRuns: totalResearchRuns || 0,
    runsToday: runsToday || 0,
    runsThisWeek: runsThisWeek || 0,
    runsThisMonth: runsThisMonth || 0,
    runsByTool,
    avgRunsPerUser: Math.round(avgRunsPerUser * 10) / 10,
    activeUsersLast7,
    activeUsersLast30,
    repeatUsers,
    topCategories,
    recentActivity: recentActivity.slice(0, 20),
  });
}
