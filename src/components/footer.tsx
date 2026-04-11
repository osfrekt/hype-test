"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Footer() {
  const [year, setYear] = useState("");
  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);
  return (
    <footer className="border-t border-border/50 bg-card mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-navy flex items-center justify-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                </svg>
              </div>
              <span className="font-semibold text-primary text-sm">HypeTest</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Consumer research in minutes, not months. Grounded in academic
              research.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">Product</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/methodology" className="hover:text-foreground transition-colors">
                Methodology
              </Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">Research</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href="https://www.hbs.edu/ris/Publication%20Files/23-062_b8e4c6b3-27b2-4131-929a-85636faf8024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Brand, Israeli & Ngwe (2025)
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/50 text-xs text-muted-foreground">
          &copy; {year} HypeTest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
