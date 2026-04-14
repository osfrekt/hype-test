import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const anthropic = new Anthropic();

interface EnhanceRequest {
  originalInput: {
    productName?: string;
    productDescription?: string;
    category?: string;
    priceUnit?: string;
    targetMarket?: string;
    competitors?: string;
  };
  topConcerns: string[];
  topPositives: string[];
  featureImportance: { feature: string; score: number }[];
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
      return Response.json({ error: "You must be logged in to use Enhance" }, { status: 401 });
    }

    const email = user.email;

    // Plan check — Pro+ only (unless admin)
    const admin = await isAdminEmail(email);
    if (!admin) {
      const { data: profile } = await supabase
        .from("users")
        .select("plan")
        .eq("email", email)
        .single();
      const plan = profile?.plan || "free";
      if (!["pro", "team"].includes(plan)) {
        return Response.json(
          { error: "Enhance is a Pro feature. Upgrade to use it." },
          { status: 403 }
        );
      }
    }

    const body: EnhanceRequest = await request.json();
    const { originalInput, topConcerns = [], topPositives = [], featureImportance = [] } = body;

    if (!originalInput?.productName || !originalInput?.productDescription) {
      return Response.json({ error: "Original input data is required" }, { status: 400 });
    }

    const topFeatures = featureImportance
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((f) => f.feature);

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `You are a product positioning expert. A consumer research panel tested this product and provided feedback. Rewrite the product description to be stronger and more compelling, incorporating the learnings from the research.

ORIGINAL PRODUCT DESCRIPTION:
${originalInput.productDescription}

CONSUMER FEEDBACK SUMMARY:
Top concerns (address these): ${topConcerns.slice(0, 5).join(" | ") || "None"}
Top strengths (lean into these): ${topPositives.slice(0, 5).join(" | ") || "None"}
Most valued features: ${topFeatures.join(", ") || "None identified"}

INSTRUCTIONS:
- Write a clean, polished product description that naturally addresses the concerns and emphasises the strengths
- Do NOT include any meta-commentary, section headers like "ENHANCED POSITIONING", or references to "consumer feedback"
- Do NOT list the concerns or strengths as bullet points
- Write it as if this is the original product description - natural, compelling, ready to test
- Keep approximately the same length as the original
- Maintain the same tone and style as the original
- Return ONLY the rewritten product description, nothing else`,
        },
      ],
    });

    const enhancedDescription =
      response.content[0].type === "text" ? response.content[0].text.trim() : "";

    if (!enhancedDescription) {
      return Response.json({ error: "Failed to generate enhanced description" }, { status: 500 });
    }

    return Response.json({
      productName: originalInput.productName,
      productDescription: enhancedDescription,
      category: originalInput.category || "",
      priceUnit: originalInput.priceUnit || "",
      targetMarket: originalInput.targetMarket || "",
      competitors: originalInput.competitors || "",
    });
  } catch (error) {
    console.error("Enhance error:", error);
    return Response.json({ error: "Enhancement failed. Please try again." }, { status: 500 });
  }
}
