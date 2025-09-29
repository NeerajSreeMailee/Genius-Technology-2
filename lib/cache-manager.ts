// Simple in-memory cache for Firebase data
class CacheManager {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()

  set(key: string, data: any, ttlMinutes: number = 5) {
    const timestamp = Date.now()
    const ttl = ttlMinutes * 60 * 1000 // Convert to milliseconds
    this.cache.set(key, { data, timestamp, ttl })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp > cached.ttl) {
      // Cache expired, remove it
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  has(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false

    const now = Date.now()
    if (now - cached.timestamp > cached.ttl) {
      // Cache expired, remove it
      this.cache.delete(key)
      return false
    }

    return true
  }

  clear() {
    this.cache.clear()
  }

  // Clear expired entries
  cleanup() {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const cacheManager = new CacheManager()

// Cleanup expired cache entries every 5 minutes
setInterval(() => {
  cacheManager.cleanup()
}, 5 * 60 * 1000)