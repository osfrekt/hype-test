import domains from "disposable-email-domains";

const disposableSet = new Set<string>(domains);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? disposableSet.has(domain) : true;
}
