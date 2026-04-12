import { createRateLimiter } from "@/lib/rate-limit";
import { isDisposableEmail } from "@/lib/email-validation";
import { storeCode } from "@/lib/verification-store";
import { Resend } from "resend";

const isRateLimited = createRateLimiter(5);

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many verification requests. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (isDisposableEmail(email)) {
      return Response.json(
        { error: "Please use a work or personal email address. Disposable email addresses are not accepted." },
        { status: 400 }
      );
    }

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // Store code with 10min TTL
    await storeCode(email, code);

    // Send code via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "HypeTest <reports@hypetest.ai>",
      to: email,
      subject: "Your HypeTest verification code",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <div style="margin-bottom: 32px;">
            <strong style="font-size: 18px; color: #1a1f36;">HypeTest</strong>
          </div>
          <h1 style="font-size: 22px; color: #1a1f36; margin-bottom: 8px;">Your verification code</h1>
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Enter this code to verify your email and run your research:
          </p>
          <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1a1f36; font-family: monospace;">${code}</span>
          </div>
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
            This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Verify email error:", error);
    return Response.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}
