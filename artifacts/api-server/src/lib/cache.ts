/**
 * In-memory cache for expensive, static computations.
 * Visa data never changes at runtime, so we compute once and cache forever.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  getOrSet<T>(key: string, factory: () => T, ttlMs: number): T {
    const cached = this.get<T>(key);
    if (cached !== undefined) return cached;
    const value = factory();
    this.set(key, value, ttlMs);
    return value;
  }

  size(): number {
    return this.store.size;
  }
}

// Singleton — shared across the entire server process
export const cache = new MemoryCache();

// TTLs
export const TTL = {
  FOREVER: 365 * 24 * 60 * 60 * 1000,       // visa data never changes
  ONE_HOUR: 60 * 60 * 1000,
  FIVE_MIN: 5 * 60 * 1000,
} as const;
