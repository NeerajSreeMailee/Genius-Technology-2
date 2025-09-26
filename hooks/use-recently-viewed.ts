"use client"

import { useState, useEffect, useCallback } from "react"
import type { Product } from "@/types"

const RECENTLY_VIEWED_KEY = "recentlyViewedProducts"
const MAX_RECENTLY_VIEWED = 5 // Limit to 5 products

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])

  useEffect(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
      if (stored) {
        setRecentlyViewed(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load recently viewed products from localStorage:", error)
    }
  }, [])

  const addRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists to move it to the front
      const filtered = prev.filter((p) => p.id !== product.id)
      const newRecentlyViewed = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED)
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newRecentlyViewed))
      } catch (error) {
        console.error("Failed to save recently viewed products to localStorage:", error)
      }
      return newRecentlyViewed
    })
  }, [])

  return { recentlyViewed, addRecentlyViewed }
}
