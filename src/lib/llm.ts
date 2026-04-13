import Anthropic from "@anthropic-ai/sdk";

interface LLMMessage {
  role: "user" | "assistant";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | {
            type: "image";
            source: { type: "base64"; media_type: string; data: string };
          }
      >;
}

interface LLMOptions {
  maxTokens: number;
  temperature?: number;
}

interface LLMResponse {
  text: string;
  provider: "anthropic" | "openai" | "google";
}

const anthropic = new Anthropic();

async function tryAnthropic(
  messages: LLMMessage[],
  options: LLMOptions
): Promise<LLMResponse> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: options.maxTokens,
    temperature: options.temperature ?? 1.0,
    messages: messages as Anthropic.MessageParam[],
  });
  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return { text, provider: "anthropic" };
}

async function tryOpenAI(
  messages: LLMMessage[],
  options: LLMOptions
): Promise<LLMResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey });

  // Convert messages to OpenAI format
  const openaiMessages = messages.map((m) => {
    if (typeof m.content === "string") {
      return { role: m.role as "user" | "assistant", content: m.content };
    }
    // Handle multimodal (image + text)
    const parts = (m.content as Array<Record<string, unknown>>).map(
      (part) => {
        if (part.type === "text")
          return { type: "text" as const, text: part.text as string };
        if (part.type === "image") {
          const source = part.source as {
            media_type: string;
            data: string;
          };
          return {
            type: "image_url" as const,
            image_url: {
              url: `data:${source.media_type};base64,${source.data}`,
            },
          };
        }
        return { type: "text" as const, text: "" };
      }
    );
    return { role: m.role as "user" | "assistant", content: parts };
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: options.maxTokens,
    temperature: options.temperature ?? 1.0,
    messages: openaiMessages as unknown as Parameters<
      typeof openai.chat.completions.create
    >[0]["messages"],
  });

  return {
    text: response.choices[0]?.message?.content || "",
    provider: "openai",
  };
}

async function tryGoogle(
  messages: LLMMessage[],
  options: LLMOptions
): Promise<LLMResponse> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY not set");

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Convert to Google format - concatenate text content
  const textContent = messages
    .map((m) => {
      if (typeof m.content === "string") return m.content;
      return (m.content as Array<Record<string, unknown>>)
        .filter((p) => p.type === "text")
        .map((p) => p.text as string)
        .join("\n");
    })
    .join("\n\n");

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: textContent }] }],
    generationConfig: {
      maxOutputTokens: options.maxTokens,
      temperature: options.temperature ?? 1.0,
    },
  });

  return { text: result.response.text(), provider: "google" };
}

export async function llmComplete(
  messages: LLMMessage[],
  options: LLMOptions
): Promise<LLMResponse> {
  // Try Anthropic first (primary)
  try {
    return await tryAnthropic(messages, options);
  } catch (error) {
    console.warn(
      "Anthropic failed, trying OpenAI fallback:",
      (error as Error).message
    );
  }

  // Try OpenAI (fallback 1)
  try {
    return await tryOpenAI(messages, options);
  } catch (error) {
    console.warn(
      "OpenAI failed, trying Google fallback:",
      (error as Error).message
    );
  }

  // Try Google (fallback 2)
  try {
    return await tryGoogle(messages, options);
  } catch (error) {
    console.error("All LLM providers failed:", (error as Error).message);
    throw new Error(
      "AI service temporarily unavailable. Please try again in a few minutes."
    );
  }
}

// Convenience function for simple text prompts (most common usage)
export async function llmText(
  prompt: string,
  options: LLMOptions
): Promise<LLMResponse> {
  return llmComplete([{ role: "user", content: prompt }], options);
}
