import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 30;

const URL_RE = /^https?:\/\/.+/;

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (!url || !URL_RE.test(url)) {
      return Response.json(
        { error: "Please enter a valid URL starting with http:// or https://" },
        { status: 400 }
      );
    }

    // Fetch the page
    const pageRes = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; HypeTest/1.0; +https://hypetest.ai)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!pageRes.ok) {
      return Response.json(
        { error: `Could not fetch that URL (status ${pageRes.status})` },
        { status: 422 }
      );
    }

    const html = await pageRes.text();

    // Strip HTML to plain text — keep it simple
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#\d+;/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);

    if (text.length < 50) {
      return Response.json(
        { error: "Could not extract enough content from that page." },
        { status: 422 }
      );
    }

    // Ask Claude to extract product info into structured fields
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 700,
      messages: [
        {
          role: "user",
          content: `Extract product information from this webpage content. Return ONLY a JSON object with ALL of these fields (use empty string or null if not found, but try hard to infer from context):

{
  "productName": "the product name",
  "problem": "1-2 sentences: what problem does this product solve for consumers?",
  "feature1": "the most important feature or benefit (short phrase)",
  "feature2": "the second most important feature or benefit (short phrase)",
  "feature3": "the third most important feature or benefit (short phrase)",
  "differentiator": "1-2 sentences: what makes this different from competitors?",
  "category": "one of: food & beverage, health & wellness, technology, fashion & apparel, home & garden, beauty & personal care, education, finance, other",
  "priceMin": number or null (the lowest price shown or inferred),
  "priceMax": number or null (the highest price shown or inferred),
  "priceUnit": "one of: per unit, per pack, per serving, per month, per subscription — pick the most appropriate",
  "unitsPerPack": number or null (e.g. 30 if '30 servings per tub'),
  "competitors": "comma-separated competitor product/brand names if mentioned or obvious from context, or empty string",
  "targetMarket": "who is the target customer? infer from language, imagery, and positioning. e.g. 'Health-conscious adults 25-40, fitness enthusiasts'"
}

Webpage content:
${text}`,
        },
      ],
    });

    const aiText =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json(
        { error: "Could not extract product information from that page." },
        { status: 422 }
      );
    }

    const extracted = JSON.parse(jsonMatch[0]);

    return Response.json({
      productName: extracted.productName || "",
      problem: extracted.problem || "",
      feature1: extracted.feature1 || "",
      feature2: extracted.feature2 || "",
      feature3: extracted.feature3 || "",
      differentiator: extracted.differentiator || "",
      category: extracted.category || "",
      priceMin: extracted.priceMin ?? null,
      priceMax: extracted.priceMax ?? null,
      priceUnit: extracted.priceUnit || "",
      unitsPerPack: extracted.unitsPerPack ?? null,
      competitors: extracted.competitors || "",
      targetMarket: extracted.targetMarket || "",
    });
  } catch (error) {
    console.error("Extract product error:", error);
    const message =
      error instanceof Error && error.name === "TimeoutError"
        ? "That URL took too long to load."
        : "Failed to extract product info. Check the URL and try again.";
    return Response.json({ error: message }, { status: 500 });
  }
}
