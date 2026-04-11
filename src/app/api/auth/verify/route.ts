import { verifyMagicToken } from "@/lib/magic-link";
import { getOrCreateUser } from "@/lib/users";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return Response.json({ error: "Token required" }, { status: 400 });
  }

  const decoded = verifyMagicToken(token);
  if (!decoded) {
    return Response.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const user = await getOrCreateUser(decoded.email);
  return Response.json({ user });
}
