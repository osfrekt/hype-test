import Anthropic from "@anthropic-ai/sdk";
import { createRateLimiter } from "@/lib/rate-limit";

const isRateLimited = createRateLimiter(10);

export const maxDuration = 30;

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    const { imageBase64 } = await request.json();

    if (!imageBase64 || !imageBase64.startsWith("data:image/")) {
      return Response.json({ error: "Valid image required" }, { status: 400 });
    }

    const match = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return Response.json({ error: "Invalid image format" }, { status: 400 });
    }

    const mediaType = match[1] as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
    const data = match[2];

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data },
            },
            {
              type: "text",
              text: `Describe this logo in 2-3 sentences for a consumer research panel. Include: the visual elements (shapes, icons, imagery), typography style (serif, sans-serif, bold, thin, etc.), color palette, and overall aesthetic. Be factual and specific, not subjective. Return ONLY the description, no preamble.`,
            },
          ],
        },
      ],
    });

    const description =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract colors mentioned
    const colorMatch = description.match(/(?:color[s]?|palette|hue[s]?)[:\s]+([^.]+)/i);
    const colors = colorMatch ? colorMatch[1].trim() : "";

    return Response.json({ description, colors });
  } catch (error) {
    console.error("Logo description error:", error);
    return Response.json({ error: "Failed to describe logo" }, { status: 500 });
  }
}
