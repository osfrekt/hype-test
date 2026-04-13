"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ValidationRun {
  id: string;
  product_name: string;
  predicted_intent: number;
  actual_units: number | null;
  actual_revenue: number | null;
  actual_conversion: number | null;
  notes: string | null;
  created_at: string;
}

export default function ValidatePage() {
  const [runs, setRuns] = useState<ValidationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [productName, setProductName] = useState("");
  const [predictedIntent, setPredictedIntent] = useState("");
  const [actualUnits, setActualUnits] = useState("");
  const [actualRevenue, setActualRevenue] = useState("");
  const [actualConversion, setActualConversion] = useState("");
  const [notes, setNotes] = useState("");

  async function loadRuns() {
    try {
      const res = await fetch("/api/validation");
      const data = await res.json();
      setRuns(data.runs || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRuns();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          predictedIntent: parseFloat(predictedIntent),
          actualUnits: actualUnits ? parseInt(actualUnits) : null,
          actualRevenue: actualRevenue ? parseFloat(actualRevenue) : null,
          actualConversion: actualConversion ? parseFloat(actualConversion) : null,
          notes: notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      // Reset form and reload
      setProductName("");
      setPredictedIntent("");
      setActualUnits("");
      setActualRevenue("");
      setActualConversion("");
      setNotes("");
      await loadRuns();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  // Calculate accuracy score: average absolute difference between predicted intent and actual conversion
  const runsWithActual = runs.filter((r) => r.actual_conversion != null);
  const accuracyScore =
    runsWithActual.length > 0
      ? (
          runsWithActual.reduce(
            (sum, r) =>
              sum + Math.abs(r.predicted_intent - (r.actual_conversion ?? 0)),
            0
          ) / runsWithActual.length
        ).toFixed(1)
      : null;

  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Validation Tracker
          </h1>
          <p className="text-muted-foreground mb-8">
            Track how HypeTest predictions compare to real-world results.
          </p>

          {/* Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Log a validation run</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-primary block mb-1">
                      Product name *
                    </label>
                    <Input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Protein Bar X"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary block mb-1">
                      HypeTest predicted intent % *
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={predictedIntent}
                      onChange={(e) => setPredictedIntent(e.target.value)}
                      placeholder="e.g. 62.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary block mb-1">
                      Actual units sold
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={actualUnits}
                      onChange={(e) => setActualUnits(e.target.value)}
                      placeholder="e.g. 1200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary block mb-1">
                      Actual revenue
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={actualRevenue}
                      onChange={(e) => setActualRevenue(e.target.value)}
                      placeholder="e.g. 15000.00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary block mb-1">
                      Actual conversion rate %
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={actualConversion}
                      onChange={(e) => setActualConversion(e.target.value)}
                      placeholder="e.g. 58.0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary block mb-1">
                      Notes
                    </label>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Launched on Amazon, 2-week window"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Log validation run"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Accuracy Score */}
          {accuracyScore !== null && (
            <Card className="mb-8 border-teal/20 bg-teal/5">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Running Accuracy Score
                </p>
                <p className="text-3xl font-bold text-primary">
                  {accuracyScore}pp
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  average absolute difference between predicted intent and actual
                  conversion ({runsWithActual.length} run
                  {runsWithActual.length !== 1 ? "s" : ""} with actuals)
                </p>
              </CardContent>
            </Card>
          )}

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All validation runs</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : runs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No validation runs yet. Log your first one above.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 pr-4 font-medium text-muted-foreground">
                          Product
                        </th>
                        <th className="pb-2 pr-4 font-medium text-muted-foreground">
                          Predicted
                        </th>
                        <th className="pb-2 pr-4 font-medium text-muted-foreground">
                          Actual Conv.
                        </th>
                        <th className="pb-2 pr-4 font-medium text-muted-foreground">
                          Diff
                        </th>
                        <th className="pb-2 pr-4 font-medium text-muted-foreground">
                          Units
                        </th>
                        <th className="pb-2 pr-4 font-medium text-muted-foreground">
                          Revenue
                        </th>
                        <th className="pb-2 font-medium text-muted-foreground">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {runs.map((run) => {
                        const diff =
                          run.actual_conversion != null
                            ? (
                                run.actual_conversion - run.predicted_intent
                              ).toFixed(1)
                            : null;
                        return (
                          <tr
                            key={run.id}
                            className="border-b border-border/50"
                          >
                            <td className="py-2 pr-4 font-medium text-primary">
                              {run.product_name}
                            </td>
                            <td className="py-2 pr-4">
                              {run.predicted_intent}%
                            </td>
                            <td className="py-2 pr-4">
                              {run.actual_conversion != null
                                ? `${run.actual_conversion}%`
                                : "-"}
                            </td>
                            <td className="py-2 pr-4">
                              {diff != null ? (
                                <span
                                  className={
                                    parseFloat(diff) >= 0
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-red-600 dark:text-red-400"
                                  }
                                >
                                  {parseFloat(diff) >= 0 ? "+" : ""}
                                  {diff}pp
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="py-2 pr-4">
                              {run.actual_units ?? "-"}
                            </td>
                            <td className="py-2 pr-4">
                              {run.actual_revenue != null
                                ? `$${Number(run.actual_revenue).toLocaleString()}`
                                : "-"}
                            </td>
                            <td className="py-2 text-muted-foreground">
                              {run.notes ?? "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
