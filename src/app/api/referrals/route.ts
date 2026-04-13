import { processReferral } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const { email, referralCode } = await request.json();

    if (!email || !referralCode) {
      return Response.json({ error: "Missing email or referral code" }, { status: 400 });
    }

    const success = await processReferral(email, referralCode);

    return Response.json({ success });
  } catch (error) {
    console.error("Referral error:", error);
    return Response.json({ error: "Failed to process referral" }, { status: 500 });
  }
}
