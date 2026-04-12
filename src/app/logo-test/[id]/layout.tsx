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
      .from("logo_test_results")
      .select("input, results")
      .eq("id", id)
      .single();

    if (data) {
      const brandName = data.input?.brandName || "Logo Test";
      const logoCount = data.results?.length || 0;
      return {
        title: `HypeTest Logo Test: ${brandName}`,
        description: `Logo test results for ${brandName}. ${logoCount} logo(s) tested with AI-simulated panel of 30 consumers.`,
        openGraph: {
          title: `HypeTest Logo Test: ${brandName}`,
          description: `Logo testing results | AI-simulated consumer research`,
        },
        robots: { index: false, follow: false },
      };
    }
  } catch {
    // fall through
  }

  return {
    title: "HypeTest Logo Test Results",
    description: "AI-simulated logo testing results",
    robots: { index: false, follow: false },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
