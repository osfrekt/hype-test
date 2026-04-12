import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | HypeTest",
  description: "Your HypeTest research dashboard. Run research, view past reports, and manage your account.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
