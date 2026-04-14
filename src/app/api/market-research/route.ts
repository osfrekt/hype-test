import { runMarketResearch } from "@/lib/market-research-engine";
import { createClient } from "@/lib/supabase/server";
import { sendMarketResearchReport } from "@/lib/email";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkQuota, incrementUsage, getOrCreateUser } from "@/lib/users";
import { isDisposableEmail } from "@/lib/email-validation";
import { verifyVerificationToken } from "@/lib/magic-link";
import type { MarketResearchInput } from "@/types/market-research";

export const maxDuration = 120;

const isRateLimited = createRateLimiter(3);
const isEmailRateLimited = createRateLimiter(5);

const MAX_CATEGORY_LENGTH = 300;
const MAX_QUESTIONS_LENGTH = 2000;

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 10_000) {
      return Response.json({ error: "Request body too large" }, { status: 413 });
    }

    const body: MarketResearchInput & {
      email?: string;
      userName?: string;
      userCompany?: string;
      userRole?: string;
      verificationToken?: string;
    } = await request.json();

    const category = body.category?.trim().slice(0, MAX_CATEGORY_LENGTH);
    const geography = body.geography?.trim().slice(0, 100);
    const questions = body.questions?.trim().slice(0, MAX_QUESTIONS_LENGTH);

    if (!category || !geography) {
      return Response.json(
        { error: "Industry/category and geography are required" },
        { status: 400 }
      );
    }

    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : null;

    if (email && isDisposableEmail(email)) {
      return Response.json(
        { error: "Please use a work or personal email address. Disposable email addresses are not accepted." },
        { status: 400 }
      );
    }

    // Email verification — skip for authenticated Supabase users
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const isAuthenticated = !!authUser?.email;

    if (!isAuthenticated) {
      const verificationToken = typeof body.verificationToken === "string" ? body.verificationToken : null;
      if (!verificationToken) {
        return Response.json({ error: "Email verification required" }, { status: 401 });
      }
      const verified = verifyVerificationToken(verificationToken);
      if (!verified || verified.email !== email?.toLowerCase()) {
        return Response.json(
          { error: "Invalid or expired verification. Please verify your email again." },
          { status: 401 }
        );
      }
    }

    if (email && isEmailRateLimited(email)) {
      return Response.json({ error: "Too many requests from this email." }, { status: 429 });
    }

    if (email) {
      const quota = await checkQuota(email, "research");
      if (!quota.allowed) {
        return Response.json({
          error: `You've used all ${quota.limit} research runs this month on the ${quota.plan} plan. Upgrade at hypetest.ai/pricing for more.`,
        }, { status: 403 });
      }
    }

    const sanitizedInput: MarketResearchInput = {
      category,
      geography,
      questions: questions || "",
    };

    const result = await runMarketResearch(sanitizedInput);

    // Persist to Supabase
    const userName = typeof body.userName === "string" ? body.userName.trim().slice(0, 200) : null;
    const userCompany = typeof body.userCompany === "string" ? body.userCompany.trim().slice(0, 200) : null;
    const userRole = typeof body.userRole === "string" ? body.userRole.trim().slice(0, 100) : null;

    persistResult(result, email).catch((err) =>
      console.error("Failed to persist market research result:", err)
    );

    if (email) {
      getOrCreateUser(email, userName || undefined, userCompany || undefined, userRole || undefined).catch(console.error);
      incrementUsage(email, "research").catch(console.error);

      sendMarketResearchReport(email, sanitizedInput.category, result.id).catch(
        (err) => console.error("Failed to send market research email:", err)
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("Market research engine error:", error);
    return Response.json({ error: "Market research failed. Please try again." }, { status: 500 });
  }
}

async function persistResult(result: import("@/types/market-research").MarketResearchResult, email: string | null) {
  const supabase = await createClient();
  const { error } = await supabase.from("market_research_results").insert({
    id: result.id,
    input: result.input,
    market_overview: result.marketOverview,
    market_size: result.marketSize,
    key_trends: result.keyTrends,
    consumer_insights: result.consumerInsights,
    competitive_landscape: result.competitiveLandscape,
    pricing_landscape: result.pricingLandscape,
    gaps: result.gaps,
    threats: result.threats,
    recommendations: result.recommendations,
    email,
    status: result.status,
    created_at: result.createdAt,
  });
  if (error) throw error;
}
