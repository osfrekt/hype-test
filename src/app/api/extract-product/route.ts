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
          "Mozilla/5.0 (compatible; HypeTest/1.0; +https://hype-test.vercel.app)",
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

    // Ask Claude to extract product info
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Extract product information from this webpage content. Return ONLY a JSON object with these fields:

{
  "productName": "the product name",
  "productDescription": "a 2-4 sentence description of the product, its features, and value proposition",
  "category": "one of: food & beverage, health & wellness, technology, fashion & apparel, home & garden, beauty & personal care, education, finance, other",
  "priceMin": number or null,
  "priceMax": number or null,
  "priceUnit": "the pricing unit if applicable (e.g. 'per drink', 'per 4-pack', '/month', 'per session'), or empty string",
  "competitors": "comma-separated competitor names if mentioned, or empty string",
  "targetMarket": "target audience description if apparent, or empty string"
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
      productDescription: extracted.productDescription || "",
      category: extracted.category || "",
      priceMin: extracted.priceMin ?? null,
      priceMax: extracted.priceMax ?? null,
      priceUnit: extracted.priceUnit || "",
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
