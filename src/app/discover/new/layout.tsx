import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Discovery — HypeTest",
  description:
    "Discover product opportunities for your brand. AI generates and tests concepts with simulated consumer panels.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
