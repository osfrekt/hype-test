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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-foreground" viewBox="0 0 200 200" fill="none">
                <circle cx="88" cy="88" r="48" stroke="currentColor" strokeWidth="10" />
                <line x1="122" y1="122" x2="160" y2="160" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
                <rect x="64" y="98" width="10" height="22" rx="2" fill="#0e7490" opacity="0.7" />
                <rect x="78" y="82" width="10" height="38" rx="2" fill="#0891b2" />
                <rect x="92" y="90" width="10" height="30" rx="2" fill="#0e7490" opacity="0.7" />
                <rect x="106" y="72" width="10" height="48" rx="2" fill="#0891b2" opacity="0.85" />
              </svg>
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
              <Link href="/case-studies/rekt" className="hover:text-foreground transition-colors">
                Case Studies
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">Research</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="https://www.hbs.edu/ris/Publication%20Files/23-062_b8e4c6b3-27b2-4131-929a-85636faf8024.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Brand, Israeli & Ngwe (2025)
              </a>
              <a href="https://onlinelibrary.wiley.com/doi/10.1002/mar.21982" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Sarstedt et al. (2024)
              </a>
              <a href="https://www.bain.com/insights/how-synthetic-customers-bring-companies-closer-to-the-real-ones/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Bain & Company (2025)
              </a>
              <a href="https://nielseniq.com/global/en/insights/education/2024/the-rise-of-synthetic-respondents/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                NielsenIQ (2024)
              </a>
              <Link href="/methodology" className="hover:text-foreground transition-colors">
                View all research
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/privacy#your-rights" className="hover:text-foreground transition-colors">
                Do Not Sell My Info
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/50 text-xs text-muted-foreground">
          &copy; {year} Rekt Brands Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
