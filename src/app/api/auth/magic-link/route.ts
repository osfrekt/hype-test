import { createRateLimiter } from "@/lib/rate-limit";
import { generateMagicToken } from "@/lib/magic-link";
import { getOrCreateUser } from "@/lib/users";
import { Resend } from "resend";

const isRateLimited = createRateLimiter(3);

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return Response.json({ error: "Valid email required" }, { status: 400 });
  }

  // Ensure user exists
  await getOrCreateUser(email.trim());

  const token = generateMagicToken(email.trim());
  const url = `https://hypetest.ai/account?token=${token}`;

  // Send magic link email
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "HypeTest <reports@hypetest.ai>",
      to: email.trim(),
      subject: "Your HypeTest login link",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <strong style="font-size: 18px; color: #1a1f36;">HypeTest</strong>
          <h1 style="font-size: 22px; color: #1a1f36; margin: 24px 0 8px;">Your login link</h1>
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Click the button below to access your account. This link expires in 1 hour.
          </p>
          <a href="${url}" style="display: inline-block; background: #1a1f36; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
            Access my account
          </a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">
            If you didn't request this link, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px;">
            Rekt Brands Inc. | 1207 Delaware Ave, #4069, Wilmington, DE 19806
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send magic link:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  return Response.json({ success: true });
}
