import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology | HypeTest",
  description:
    "Learn how HypeTest simulates consumer panels using AI, grounded in Harvard Business School research on LLMs for market research.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
