"use client";
import { useState, useEffect } from "react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50"
      data-print-hide
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          We use browser storage to cache your research results locally. We do
          not use tracking cookies.{" "}
          <a href="/privacy" className="text-teal hover:underline">
            Privacy Policy
          </a>
        </p>
        <button
          onClick={() => {
            localStorage.setItem("cookie-consent", "accepted");
            setShow(false);
          }}
          className="shrink-0 rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 h-9 hover:bg-primary/90 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
