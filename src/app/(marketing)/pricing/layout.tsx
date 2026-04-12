import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | HypeTest",
  description:
    "HypeTest pricing plans. Run AI-simulated consumer research for any product or idea.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
