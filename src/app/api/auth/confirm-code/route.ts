import { checkCode, consumeCode } from "@/lib/verification-store";
import { generateVerificationToken } from "@/lib/magic-link";
import { createRateLimiter } from "@/lib/rate-limit";

const isRateLimited = createRateLimiter(5);

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return Response.json({ error: "Too many attempts" }, { status: 429 });
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
    const code = typeof body.code === "string" ? body.code.trim() : null;

    if (!email || !code) {
      return Response.json({ error: "Email and code are required" }, { status: 400 });
    }

    if (!(await checkCode(email, code))) {
      return Response.json(
        { error: "Invalid or expired code. Please request a new one." },
        { status: 400 }
      );
    }

    // Consume the code so it can't be reused
    await consumeCode(email);

    // Generate a verification token (30min JWT)
    const verificationToken = generateVerificationToken(email);

    return Response.json({ verificationToken });
  } catch (error) {
    console.error("Confirm code error:", error);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
