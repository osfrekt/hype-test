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
      .from("discovery_results")
      .select("input, concepts")
      .eq("id", id)
      .single();

    if (data) {
      const brandName = data.input?.brandName || "Discovery Results";
      const conceptCount = Array.isArray(data.concepts) ? data.concepts.length : 0;
      return {
        title: `HypeTest Discovery: ${brandName}`,
        description: `Product discovery results for ${brandName}. ${conceptCount} concepts tested. AI-simulated consumer panel.`,
        openGraph: {
          title: `HypeTest Discovery: ${brandName}`,
          description: `${conceptCount} product concepts tested | AI-simulated consumer research`,
        },
        robots: { index: false, follow: false },
      };
    }
  } catch {
    // fall through
  }

  return {
    title: "HypeTest Discovery",
    description: "AI-simulated product discovery results",
    robots: { index: false, follow: false },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
