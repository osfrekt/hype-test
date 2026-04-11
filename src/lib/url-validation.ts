export function isValidPublicUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) return false;

    const hostname = parsed.hostname.toLowerCase();

    // Block private/reserved ranges
    if (
      hostname === "localhost" ||
      hostname === "0.0.0.0" ||
      /^127\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^10\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[01])\./.test(hostname) ||
      /^169\.254\./.test(hostname) ||
      hostname === "::1" ||
      hostname === "[::1]" ||
      /^fc00:/i.test(hostname) ||
      /^fd00:/i.test(hostname) ||
      /^fe80:/i.test(hostname) ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return false;
    }

    // Block metadata endpoints
    if (
      hostname === "metadata.google.internal" ||
      hostname === "metadata.google.com"
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
