import { createClient } from "@/lib/supabase/server";
import { checkQuota, incrementUsage, getOrCreateUser } from "@/lib/users";
import { isAdminEmail } from "@/lib/admin";
import { runResearch } from "@/lib/research-engine";
import { sendResearchReport } from "@/lib/email";
import type { ResearchInput } from "@/types/research";

export const maxDuration = 300;

interface EnhanceRequest {
  originalResultId: string;
  toolType: string;
  originalInput: ResearchInput;
  topConcerns: string[];
  topPositives: string[];
  verbatims: { text: string }[];
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

    // Quota check — counts as a research run
    if (!admin) {
      const quota = await checkQuota(email, "research");
      if (!quota.allowed) {
        return Response.json(
          { error: `You've used all ${quota.limit} research runs this month.` },
          { status: 403 }
        );
      }
    }

    const body: EnhanceRequest = await request.json();
    const { originalInput, topConcerns, topPositives, featureImportance } = body;

    if (!originalInput?.productName || !originalInput?.productDescription) {
      return Response.json({ error: "Original input data is required" }, { status: 400 });
    }

    // Build enhanced description that addresses the feedback
    const concernsList = (topConcerns || []).slice(0, 5).join("; ");
    const positivesList = (topPositives || []).slice(0, 5).join("; ");
    const topFeatures = (featureImportance || [])
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((f) => f.feature)
      .join("; ");

    const enhancedDescription = `${originalInput.productDescription}

ENHANCED POSITIONING (based on consumer feedback from previous research):
- Address these consumer concerns: ${concernsList || "None identified"}
- Double down on these strengths: ${positivesList || "None identified"}
- Prioritise these features in messaging: ${topFeatures || "None identified"}
- This is a second-round test with an improved product positioning based on real consumer feedback.`;

    const enhancedInput: ResearchInput = {
      ...originalInput,
      productDescription: enhancedDescription,
    };

    const result = await runResearch(enhancedInput);

    // Persist to Supabase
    const userName = user.user_metadata?.name || user.user_metadata?.full_name || null;

    const { error: insertError } = await supabase.from("research_results").insert({
      id: result.id,
      input: enhancedInput,
      panel_size: result.panelSize,
      purchase_intent: result.purchaseIntent,
      wtp_range: result.wtpRange,
      feature_importance: result.featureImportance,
      top_concerns: result.topConcerns,
      top_positives: result.topPositives,
      verbatims: result.verbatims,
      methodology: result.methodology,
      competitive_position: result.competitivePosition || null,
      segment_breakdown: result.segmentBreakdown || null,
      purchase_frequency: result.purchaseFrequency || null,
      channel_preference: result.channelPreference || null,
      nps_score: result.npsScore ?? null,
      top_words: result.topWords || null,
      usage_occasions: result.usageOccasions || null,
      purchase_barriers: result.purchaseBarriers || null,
      improvements: result.improvements || null,
      price_sensitivity: result.priceSensitivity || null,
      persona_deep_dives: result.personaDeepDives || null,
      email,
      user_name: userName,
      status: result.status,
      created_at: result.createdAt,
    });

    if (insertError) {
      console.error("Failed to persist enhanced result:", insertError);
    }

    // Increment usage
    await incrementUsage(email, "research").catch(console.error);
    await getOrCreateUser(email).catch(console.error);

    // Email the report
    sendResearchReport(email, originalInput.productName, result.id).catch(console.error);

    return Response.json(result);
  } catch (error) {
    console.error("Enhance error:", error);
    return Response.json({ error: "Enhancement failed. Please try again." }, { status: 500 });
  }
}
