import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
            </svg>
          </div>
          <span className="font-semibold text-navy text-lg tracking-tight">
            HypeTest
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link
            href="/methodology"
            className="hover:text-foreground transition-colors"
          >
            Methodology
          </Link>
          <Link
            href="/pricing"
            className="hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/research/new"
            className="inline-flex items-center justify-center rounded-lg bg-navy text-white text-sm font-medium px-4 h-9 hover:bg-navy-light transition-colors"
          >
            Try it free
          </Link>
        </div>
      </div>
    </header>
  );
}
