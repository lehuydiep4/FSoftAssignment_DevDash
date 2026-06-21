/**
 * Generic debounce utility function with proper TypeScript types.
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export interface Identifiable {
  id: string | number;
}

/**
 * A generic class representing a cache in LocalStorage.
 * T represents the data structure of the cached items and is constrained to extend `Identifiable`.
 */
export class LocalStorageCache<T extends Identifiable> {
  private readonly key: string;
  private readonly ttlMs: number;

  constructor(key: string, ttlMinutes = 10) {
    this.key = key;
    this.ttlMs = ttlMinutes * 60 * 1000;
  }

  private getCache(): Record<string | number, { data: T; timestamp: number }> {
    try {
      const item = localStorage.getItem(this.key);
      return item ? JSON.parse(item) : {};
    } catch {
      return {};
    }
  }

  private setCache(cache: Record<string | number, { data: T; timestamp: number }>): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(cache));
    } catch {
      // Catch storage quota warnings or disabled localStorage in private mode
    }
  }

  /**
   * Retrieves an item from cache. Returns null if missing or expired.
   */
  get(id: string | number): T | null {
    const cache = this.getCache();
    const cached = cache[id];
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.ttlMs;
    if (isExpired) {
      this.remove(id);
      return null;
    }

    return cached.data;
  }

  /**
   * Stores an item in cache with the current timestamp.
   */
  set(id: string | number, data: T): void {
    const cache = this.getCache();
    cache[id] = { data, timestamp: Date.now() };
    this.setCache(cache);
  }

  /**
   * Removes an item from cache.
   */
  remove(id: string | number): void {
    const cache = this.getCache();
    delete cache[id];
    this.setCache(cache);
  }

  /**
   * Clears the entire cache collection.
   */
  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {}
  }
}

