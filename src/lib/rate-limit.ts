const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_MAP_SIZE = 10_000;

export function createRateLimiter(maxRequests: number) {
  const map = new Map<string, number[]>();

  return function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = map.get(ip) ?? [];
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (recent.length >= maxRequests) {
      map.set(ip, recent);
      return true;
    }

    recent.push(now);
    map.set(ip, recent);

    // Prevent memory leak: clear old entries when map gets too large
    if (map.size > MAX_MAP_SIZE) {
      for (const [key, val] of map) {
        const active = val.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
        if (active.length === 0) map.delete(key);
        else map.set(key, active);
        if (map.size <= MAX_MAP_SIZE / 2) break;
      }
    }

    return false;
  };
}
