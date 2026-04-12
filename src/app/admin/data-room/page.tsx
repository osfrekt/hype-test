"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAILS = ["osf@rekt.com"];

interface Metrics {
  totalUsers: number;
  usersByPlan: { plan: string; count: number }[];
  signupsToday: number;
  signupsThisWeek: number;
  signupsThisMonth: number;
  mrrEstimate: number;
  totalResearchRuns: number;
  runsToday: number;
  runsThisWeek: number;
  runsThisMonth: number;
  runsByTool: { tool: string; count: number }[];
  avgRunsPerUser: number;
  activeUsersLast7: number;
  activeUsersLast30: number;
  repeatUsers: number;
  topCategories: { category: string; count: number }[];
  recentActivity: {
    timestamp: string;
    email: string;
    productName: string;
    toolType: string;
  }[];
}

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  starter: 49,
  pro: 149,
  team: 349,
};

export default function DataRoomPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadMetrics = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
        setLastUpdated(new Date());
      }
    } catch {
      // metrics fetch failed
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.email || !ADMIN_EMAILS.includes(user.email)) {
        router.replace("/");
        return;
      }

      setAuthorized(true);
      setLoading(false);
      loadMetrics();
    }
    checkAuth();
  }, [router, loadMetrics]);

  if (loading || !authorized) {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </>
    );
  }

  if (!metrics) {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading metrics...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Data Room</h1>
              <p className="text-sm text-muted-foreground">
                Internal business metrics dashboard
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <p className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={loadMetrics}
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Revenue & Users */}
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Revenue &amp; Users
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Total Users" value={metrics.totalUsers.toLocaleString()} />
              <MetricCard label="MRR Estimate" value={`$${metrics.mrrEstimate.toLocaleString()}`} />
              <MetricCard label="Signups Today" value={metrics.signupsToday.toString()} />
              <MetricCard label="Signups This Month" value={metrics.signupsThisMonth.toString()} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {metrics.usersByPlan.map((p) => (
                <MetricCard
                  key={p.plan}
                  label={`${p.plan.charAt(0).toUpperCase() + p.plan.slice(1)} Users`}
                  value={p.count.toString()}
                />
              ))}
            </div>
          </section>

          {/* Usage */}
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Usage
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Total Research Runs" value={metrics.totalResearchRuns.toLocaleString()} />
              <MetricCard label="Runs Today" value={metrics.runsToday.toString()} />
              <MetricCard label="Runs This Week" value={metrics.runsThisWeek.toString()} />
              <MetricCard label="Runs This Month" value={metrics.runsThisMonth.toString()} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {metrics.runsByTool.map((t) => (
                <MetricCard key={t.tool} label={t.tool} value={t.count.toString()} />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <MetricCard label="Avg Runs/User/Month" value={metrics.avgRunsPerUser.toFixed(1)} />
            </div>
          </section>

          {/* Engagement */}
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Engagement
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Active (7d)" value={metrics.activeUsersLast7.toString()} />
              <MetricCard label="Active (30d)" value={metrics.activeUsersLast30.toString()} />
              <MetricCard label="Repeat Users (>1 run)" value={metrics.repeatUsers.toString()} />
            </div>
          </section>

          {/* Top Categories */}
          {metrics.topCategories.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Top Categories Tested
              </h2>
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {metrics.topCategories.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{cat.category}</span>
                        <Badge variant="secondary" className="text-xs">{cat.count} runs</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Recent Activity */}
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Recent Activity
            </h2>
            <Card>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Time</th>
                        <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">User</th>
                        <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Product</th>
                        <th className="text-left py-2 text-xs font-medium text-muted-foreground">Tool</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.recentActivity.map((activity, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2 pr-4 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(activity.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                            {new Date(activity.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="py-2 pr-4 text-xs text-foreground">{activity.email}</td>
                          <td className="py-2 pr-4 text-xs text-foreground">{activity.productName}</td>
                          <td className="py-2">
                            <Badge variant="outline" className="text-[10px]">{activity.toolType}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {metrics.recentActivity.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="text-xl font-bold text-primary tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
