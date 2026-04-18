import domains from "disposable-email-domains";

const disposableSet = new Set<string>(domains);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string | null | undefined): boolean {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  return trimmed.length > 0 && trimmed.length <= 320 && EMAIL_RE.test(trimmed);
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? disposableSet.has(domain) : true;
}

export function normalizeEmail(email: string): string {
  const [local, domain] = email.toLowerCase().split("@");
  if (!domain) return email.toLowerCase();
  // Strip +alias for Gmail (also remove dots, which Gmail ignores)
  if (domain === "gmail.com" || domain === "googlemail.com") {
    return local.split("+")[0].replace(/\./g, "") + "@" + domain;
  }
  // Strip +alias for other providers
  return local.split("+")[0] + "@" + domain;
}
