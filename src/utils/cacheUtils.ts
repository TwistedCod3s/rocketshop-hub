
/**
 * A simple in-memory cache with TTL support
 */
export class MemoryCache {
  private cache: Map<string, { value: any; expiry: number }> = new Map();
  
  /**
   * Get a value from cache
   * @param key The cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    // Return undefined if item doesn't exist or has expired
    if (!item || item.expiry < Date.now()) {
      if (item) {
        this.cache.delete(key); // Clean up expired items
      }
      return undefined;
    }
    
    return item.value as T;
  }
  
  /**
   * Set a value in the cache with TTL
   * @param key The cache key
   * @param value The value to cache
   * @param ttlMs Time-to-live in milliseconds (default: 5 minutes)
   */
  set(key: string, value: any, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs
    });
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * @param key The cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item || item.expiry < Date.now()) {
      if (item) {
        this.cache.delete(key); // Clean up expired items
      }
      return false;
    }
    return true;
  }
  
  /**
   * Remove a key from the cache
   * @param key The cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Create a global cache instance to be used throughout the app
export const globalCache = new MemoryCache();
