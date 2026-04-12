// In-memory store for email verification codes
// Shared across API routes within the same server process

const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

export function storeCode(email: string, code: string): void {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  verificationCodes.set(email.toLowerCase(), { code, expiresAt });
  cleanExpired();
}

export function checkCode(email: string, code: string): boolean {
  const entry = verificationCodes.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    verificationCodes.delete(email.toLowerCase());
    return false;
  }
  return entry.code === code;
}

export function consumeCode(email: string): void {
  verificationCodes.delete(email.toLowerCase());
}

function cleanExpired() {
  const now = Date.now();
  for (const [key, val] of verificationCodes) {
    if (val.expiresAt <= now) verificationCodes.delete(key);
  }
}
