import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — HypeTest",
  description: "HypeTest privacy policy. How we handle your data.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
