import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("platform_ad_results")
      .select("input, platform_label")
      .eq("id", id)
      .single();

    if (data) {
      const brandName = data.input?.brandName || "Platform Ad";
      const platformLabel = data.platform_label || "Ad";
      return {
        title: `HypeTest Platform Ad: ${brandName} on ${platformLabel}`,
        description: `Platform ad analysis for ${brandName} on ${platformLabel}. AI-simulated consumer panel results.`,
        openGraph: {
          title: `HypeTest Platform Ad: ${brandName} on ${platformLabel}`,
          description: `Platform ad analysis results | AI-simulated consumer research`,
        },
        robots: { index: false, follow: false },
      };
    }
  } catch {
    // fall through
  }

  return {
    title: "HypeTest Platform Ad Results",
    description: "AI-simulated platform ad analysis results",
    robots: { index: false, follow: false },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
