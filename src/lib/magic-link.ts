import jwt from "jsonwebtoken";

function getSecret(): string {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (!secret) throw new Error("MAGIC_LINK_SECRET environment variable is required");
  return secret;
}

export function generateMagicToken(email: string): string {
  return jwt.sign({ email }, getSecret(), { expiresIn: "1h" });
}

export function verifyMagicToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, getSecret()) as { email: string };
    return decoded;
  } catch {
    return null;
  }
}

export function generateVerificationToken(email: string): string {
  return jwt.sign({ email, type: "email-verify" }, getSecret(), { expiresIn: "30m" });
}

export function verifyVerificationToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, getSecret()) as { email: string; type: string };
    if (decoded.type !== "email-verify") return null;
    return { email: decoded.email };
  } catch {
    return null;
  }
}
