"use client"

import { useState, useEffect, useCallback } from "react"
import { SafeStorage } from "./performance-optimization"

// Cache manager with TTL support - Enhanced for sub-1-second performance
class CacheManager {
  private static instance: CacheManager
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private requestMap = new Map<string, Promise<any>>()

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  set(key: string, data: any, ttlMinutes = 10): void {
    const ttl = ttlMinutes * 60 * 1000 // Convert to milliseconds
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })

    // Also store in localStorage for persistence across sessions
    try {
      SafeStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        ttl
      }))
    } catch (error) {
      console.warn('Failed to store cache in localStorage:', error)
    }
  }

  get(key: string): any | null {
    // Check memory cache first (fastest)
    const memoryCached = this.cache.get(key)
    if (memoryCached && this.isValid(memoryCached)) {
      return memoryCached.data
    }

    // Check localStorage cache (slower but persistent)
    try {
      const stored = SafeStorage.getItem(`cache_${key}`)
      if (stored) {
        const cached = JSON.parse(stored)
        if (this.isValid(cached)) {
          // Restore to memory cache for next access
          this.cache.set(key, cached)
          return cached.data
        } else {
          // Remove expired cache
          SafeStorage.removeItem(`cache_${key}`)
        }
      }
    } catch (error) {
      console.warn('Failed to read cache from localStorage:', error)
    }

    return null
  }

  // Instant cache check without localStorage fallback
  getInstant(key: string): any | null {
    const memoryCached = this.cache.get(key)
    return memoryCached && this.isValid(memoryCached) ? memoryCached.data : null
  }

  // Prevent duplicate requests
  async getOrFetch<T>(key: string, fetcher: () => Promise<T>, ttlMinutes = 10): Promise<T> {
    // Return cached data immediately if available
    const cached = this.get(key)
    if (cached) {
      return cached
    }

    // Check if request is already in progress
    const existingRequest = this.requestMap.get(key)
    if (existingRequest) {
      return existingRequest
    }

    // Start new request
    const request = fetcher().then(data => {
      this.set(key, data, ttlMinutes)
      this.requestMap.delete(key)
      return data
    }).catch(error => {
      this.requestMap.delete(key)
      throw error
    })

    this.requestMap.set(key, request)
    return request
  }

  private isValid(cached: { timestamp: number; ttl: number }): boolean {
    return Date.now() - cached.timestamp < cached.ttl
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key)
      this.requestMap.delete(key)
      SafeStorage.removeItem(`cache_${key}`)
    } else {
      this.cache.clear()
      this.requestMap.clear()
      // Clear all cache items from localStorage
      try {
        const keys = Object.keys(localStorage)
        keys.forEach(k => {
          if (k.startsWith('cache_')) {
            SafeStorage.removeItem(k)
          }
        })
      } catch (error) {
        console.warn('Failed to clear localStorage cache:', error)
      }
    }
  }

  // Preload data in background
  preload(key: string, fetcher: () => Promise<any>, ttlMinutes = 10): void {
    if (!this.get(key)) {
      this.getOrFetch(key, fetcher, ttlMinutes).catch(error => {
        console.warn('Background preload failed:', error)
      })
    }
  }
}

// Ultra-fast data fetching hooks with instant loading
export function useFastProduct(productId: string, initialData?: any) {
  const [data, setData] = useState<any>(initialData || null)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const cache = CacheManager.getInstance()

  const fetchData = useCallback(async (force = false) => {
    const cacheKey = `product_${productId}`
    
    // INSTANT: Return cached data immediately
    if (!force) {
      const cached = cache.getInstant(cacheKey)
      if (cached) {
        setData(cached)
        setLoading(false)
        return cached
      }
    }

    try {
      setError(null)
      
      // Use getOrFetch to prevent duplicate requests
      const result = await cache.getOrFetch(
        cacheKey,
        async () => {
          const { getmobileCollection } = await import('./firebase-collections')
          return await getmobileCollection(productId)
        },
        10 // 10 minute cache
      )
      
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product'
      setError(errorMessage)
      console.error('Fast product fetch error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [productId, cache])

  useEffect(() => {
    // If we have initial data, cache it and don't fetch
    if (initialData) {
      const cacheKey = `product_${productId}`
      cache.set(cacheKey, initialData, 10)
      setData(initialData)
      setLoading(false)
      return
    }
    
    if (productId) {
      fetchData()
    }
  }, [productId, fetchData, initialData, cache])

  return { 
    data, 
    loading, 
    error, 
    refetch: () => fetchData(true),
    clearCache: () => cache.clear(`product_${productId}`)
  }
}

// Batch fetching for better performance
export function useFastProducts(productIds: string[]) {
  const [data, setData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cache = CacheManager.getInstance()

  const fetchBatch = useCallback(async (ids: string[]) => {
    try {
      setLoading(true)
      setError(null)

      const results: Record<string, any> = {}
      const uncachedIds: string[] = []

      // Check cache first
      ids.forEach(id => {
        const cached = cache.get(`product_${id}`)
        if (cached) {
          results[id] = cached
        } else {
          uncachedIds.push(id)
        }
      })

      // Fetch uncached items in parallel
      if (uncachedIds.length > 0) {
        const { getMobileCollectionItems } = await import('./firebase-collections')
        
        const promises = uncachedIds.map(async (id) => {
          try {
            const result = await getMobileCollectionItems()
            const item = result.find((item: any) => item.id === id)
            if (item) {
              cache.set(`product_${id}`, item, 10)
              return { id, data: item }
            }
            return { id, data: null }
          } catch (err) {
            console.error(`Failed to fetch product ${id}:`, err)
            return { id, data: null }
          }
        })

        const fetchedResults = await Promise.all(promises)
        fetchedResults.forEach(({ id, data }) => {
          if (data) {
            results[id] = data
          }
        })
      }

      setData(results)
      return results
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
      setError(errorMessage)
      console.error('Batch fetch error:', err)
      return {}
    } finally {
      setLoading(false)
    }
  }, [cache])

  useEffect(() => {
    if (productIds.length > 0) {
      fetchBatch(productIds)
    }
  }, [productIds, fetchBatch])

  return { 
    data, 
    loading, 
    error, 
    refetch: () => fetchBatch(productIds)
  }
}

// Performance-optimized mobile collection hook
export function useFastMobileCollection(mobileId: string, initialData?: any) {
  const { data: mobile, loading, error, refetch, clearCache } = useFastProduct(mobileId, initialData)

  return { 
    mobile, 
    loading, 
    error, 
    refetch, 
    clearCache 
  }
}

// Hook for related products with caching
export function useFastRelatedProducts(category: string, excludeId?: string) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cache = CacheManager.getInstance()

  useEffect(() => {
    const fetchRelated = async () => {
      const cacheKey = `related_${category}_${excludeId || 'all'}`
      
      // Check cache first
      const cached = cache.get(cacheKey)
      if (cached) {
        setProducts(cached)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const { getMobileCollectionByCategory } = await import('./firebase-collections')
        const result = await getMobileCollectionByCategory(category)
        
        // Filter out current product if excludeId provided
        const filtered = excludeId 
          ? result.filter((item: any) => item.id !== excludeId)
          : result

        // Limit to 6 items for performance
        const limited = filtered.slice(0, 6)
        
        // Cache for 15 minutes
        cache.set(cacheKey, limited, 15)
        setProducts(limited)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch related products'
        setError(errorMessage)
        console.error('Related products fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchRelated()
    }
  }, [category, excludeId, cache])

  return { products, loading, error }
}