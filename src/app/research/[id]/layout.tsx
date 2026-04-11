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
      .from("research_results")
      .select("input, purchase_intent")
      .eq("id", id)
      .single();

    if (data) {
      const name = data.input?.productName || "Research Results";
      const score = data.purchase_intent?.score ?? 0;
      return {
        title: `HypeTest Results: ${name}`,
        description: `Consumer research results for ${name}. Purchase intent: ${score}%. AI-simulated panel of 50 consumers.`,
        openGraph: {
          title: `HypeTest Results: ${name}`,
          description: `Purchase intent: ${score}% | AI-simulated consumer research`,
        },
        robots: { index: false, follow: false },
      };
    }
  } catch {
    // fall through
  }

  return {
    title: "HypeTest Results",
    description: "AI-simulated consumer research results",
    robots: { index: false, follow: false },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
