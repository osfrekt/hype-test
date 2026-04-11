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
