import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 30;

const URL_RE = /^https?:\/\/.+/;

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!url && !query) {
      return Response.json(
        { error: "Please provide a URL or brand name to look up." },
        { status: 400 }
      );
    }

    let aiText = "";

    if (url) {
      // URL mode: fetch page and extract brand info
      if (!URL_RE.test(url)) {
        return Response.json(
          { error: "Please enter a valid URL starting with http:// or https://" },
          { status: 400 }
        );
      }

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

      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: `Extract brand information from this webpage content. Return ONLY a JSON object:

{
  "brandName": "the brand/company name",
  "brandDescription": "2-3 sentences: the brand's positioning, values, mission, and what they're known for",
  "category": "one of: food & beverage, health & wellness, technology, fashion & apparel, home & garden, beauty & personal care, education, finance, other",
  "targetAudience": "who is their target customer? infer from brand positioning and language",
  "existingProducts": "comma-separated list of their current products/product lines if identifiable",
  "priceRange": { "min": number or null, "max": number or null }
}

Webpage content:
${text}`,
          },
        ],
      });

      aiText =
        response.content[0].type === "text" ? response.content[0].text : "";
    } else {
      // Search mode: use Claude's knowledge
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: `You are a brand research assistant. The user is looking up the brand: '${query}'. Based on your knowledge, provide brand information. If you don't know this brand, make reasonable inferences from the name. Return ONLY a JSON object:

{
  "brandName": "the brand/company name",
  "brandDescription": "2-3 sentences: the brand's positioning, values, mission, and what they're known for",
  "category": "one of: food & beverage, health & wellness, technology, fashion & apparel, home & garden, beauty & personal care, education, finance, other",
  "targetAudience": "who is their target customer? infer from brand positioning and language",
  "existingProducts": "comma-separated list of their current products/product lines if identifiable",
  "priceRange": { "min": number or null, "max": number or null }
}`,
          },
        ],
      });

      aiText =
        response.content[0].type === "text" ? response.content[0].text : "";
    }

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json(
        { error: "Could not extract brand information." },
        { status: 422 }
      );
    }

    const extracted = JSON.parse(jsonMatch[0]);

    return Response.json({
      brandName: extracted.brandName || "",
      brandDescription: extracted.brandDescription || "",
      category: extracted.category || "",
      targetAudience: extracted.targetAudience || "",
      existingProducts: extracted.existingProducts || "",
      priceMin: extracted.priceRange?.min ?? null,
      priceMax: extracted.priceRange?.max ?? null,
    });
  } catch (error) {
    console.error("Extract brand error:", error);
    const message =
      error instanceof Error && error.name === "TimeoutError"
        ? "That URL took too long to load."
        : "Failed to extract brand info. Check the input and try again.";
    return Response.json({ error: message }, { status: 500 });
  }
}
