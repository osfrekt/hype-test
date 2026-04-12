"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">
              Reset your password
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {sent ? (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-600 dark:text-emerald-400"
                  >
                    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-primary mb-2">
                  Check your email
                </h2>
                <p className="text-sm text-muted-foreground">
                  We sent a password reset link to <strong>{email}</strong>.
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  Check your spam folder if you don&apos;t see it.
                </p>
                <Link href="/login">
                  <Button variant="outline" className="mt-6">
                    Back to login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive text-center">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send reset link"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Back to login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
