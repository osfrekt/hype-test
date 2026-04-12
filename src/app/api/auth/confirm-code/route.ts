import { checkCode, consumeCode } from "@/lib/verification-store";
import { generateVerificationToken } from "@/lib/magic-link";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
    const code = typeof body.code === "string" ? body.code.trim() : null;

    if (!email || !code) {
      return Response.json({ error: "Email and code are required" }, { status: 400 });
    }

    if (!checkCode(email, code)) {
      return Response.json(
        { error: "Invalid or expired code. Please request a new one." },
        { status: 400 }
      );
    }

    // Consume the code so it can't be reused
    consumeCode(email);

    // Generate a verification token (30min JWT)
    const verificationToken = generateVerificationToken(email);

    return Response.json({ verificationToken });
  } catch (error) {
    console.error("Confirm code error:", error);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
