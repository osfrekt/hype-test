import { runResearch } from "@/lib/research-engine";
import type { ResearchInput } from "@/types/research";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const body: ResearchInput = await request.json();

    if (!body.productName?.trim() || !body.productDescription?.trim()) {
      return Response.json(
        { error: "Product name and description are required" },
        { status: 400 }
      );
    }

    const result = await runResearch(body);

    return Response.json(result);
  } catch (error) {
    console.error("Research engine error:", error);
    return Response.json(
      { error: "Research failed. Please try again." },
      { status: 500 }
    );
  }
}
