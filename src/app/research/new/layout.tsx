import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Research — HypeTest",
  description:
    "Run AI-simulated consumer research for any product. Get purchase intent, willingness-to-pay, and feature importance in minutes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
