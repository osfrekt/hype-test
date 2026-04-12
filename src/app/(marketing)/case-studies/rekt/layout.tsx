import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rekt Case Study | HypeTest",
  description:
    "How Rekt sold 1 million cans of sparkling water in year one, and how HypeTest's AI-simulated consumer research compared to actual market results.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
