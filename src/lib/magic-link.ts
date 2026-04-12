import jwt from "jsonwebtoken";

const SECRET = process.env.MAGIC_LINK_SECRET || process.env.ANTHROPIC_API_KEY!;

export function generateMagicToken(email: string): string {
  return jwt.sign({ email }, SECRET, { expiresIn: "1h" });
}

export function verifyMagicToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, SECRET) as { email: string };
    return decoded;
  } catch {
    return null;
  }
}

export function generateVerificationToken(email: string): string {
  return jwt.sign({ email, type: "email-verify" }, SECRET, { expiresIn: "30m" });
}

export function verifyVerificationToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, SECRET) as { email: string; type: string };
    if (decoded.type !== "email-verify") return null;
    return { email: decoded.email };
  } catch {
    return null;
  }
}
