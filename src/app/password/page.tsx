"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Set cookie and redirect
    document.cookie = `site-access=${password}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    const next = searchParams.get("next") || "/";
    // Small delay to ensure cookie is set
    setTimeout(() => {
      router.push(next);
      router.refresh();
    }, 100);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">HypeTest</h1>
          <p className="text-sm text-muted-foreground">Enter the password to access the site</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Password"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/50"
            autoFocus
          />
          {error && <p className="text-xs text-destructive">Incorrect password</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary text-primary-foreground font-medium py-3 text-sm hover:bg-primary/90 transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PasswordPage() {
  return (
    <Suspense>
      <PasswordForm />
    </Suspense>
  );
}
