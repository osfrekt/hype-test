import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — HypeTest",
  description: "HypeTest terms of service.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
