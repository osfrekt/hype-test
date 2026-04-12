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
      .from("ad_test_results")
      .select("input, results")
      .eq("id", id)
      .single();

    if (data) {
      const brandName = data.input?.brandName || "Ad Test";
      const creativeCount = data.results?.length || 0;
      return {
        title: `HypeTest Ad Test: ${brandName}`,
        description: `Ad creative test results for ${brandName}. ${creativeCount} creative(s) tested with AI-simulated panel of 50 consumers.`,
        openGraph: {
          title: `HypeTest Ad Test: ${brandName}`,
          description: `Ad creative testing results | AI-simulated consumer research`,
        },
        robots: { index: false, follow: false },
      };
    }
  } catch {
    // fall through
  }

  return {
    title: "HypeTest Ad Test Results",
    description: "AI-simulated ad creative testing results",
    robots: { index: false, follow: false },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
