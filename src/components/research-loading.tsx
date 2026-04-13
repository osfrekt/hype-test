"use client";

export function ResearchLoading({ stage, progress, subtitle }: { stage: string; progress: number; subtitle?: string }) {
  return (
    <div className="max-w-md mx-auto px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-6">
        <svg
          className="animate-spin text-teal"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-primary mb-2">
        Running your research
      </h2>
      <p className="text-sm text-muted-foreground mb-8">{stage}</p>
      <div className="w-full bg-muted rounded-full h-2 mb-3">
        <div
          className="bg-teal h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
