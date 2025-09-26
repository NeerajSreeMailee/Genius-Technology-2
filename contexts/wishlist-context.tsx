"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import type { WishlistItem } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { SafeStorage } from "@/lib/performance-optimization"

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, "addedAt">) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const { toast } = useToast()

  // 🔹 Load wishlist from localStorage safely
  useEffect(() => {
    try {
      const savedWishlist = SafeStorage.getItem("genius-wishlist")
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist) as WishlistItem[]
        if (Array.isArray(parsed)) {
          // Convert string dates back to Date objects
          const itemsWithDates = parsed.map(item => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }))
          setItems(itemsWithDates)
        }
      }
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage:", error)
      SafeStorage.removeItem("genius-wishlist") // reset corrupted storage
    }
  }, [])

  // 🔹 Save wishlist to localStorage whenever items change with debouncing
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        // Convert Date objects to strings for localStorage
        const itemsToSave = items.map(item => ({
          ...item,
          addedAt: item.addedAt instanceof Date ? item.addedAt.toISOString() : item.addedAt
        }))
        SafeStorage.setItem("genius-wishlist", JSON.stringify(itemsToSave))
      }, 100) // Debounce localStorage writes
      
      return () => clearTimeout(timer)
    } catch (error) {
      console.error("Failed to save wishlist:", error)
    }
  }, [items])

  // 🔹 Add item to wishlist
  const addItem = useCallback((newItem: Omit<WishlistItem, "addedAt">) => {
    setItems((currentItems) => {
      const exists = currentItems.some((item) => item.productId === newItem.productId)

      if (exists) {
        toast({
          title: "Already in wishlist",
          description: `${newItem.name} is already saved`,
          variant: "destructive",
        })
        return currentItems
      }

      toast({
        title: "Added to wishlist",
        description: `${newItem.name} has been saved`,
      })

      return [...currentItems, { ...newItem, addedAt: new Date() }]
    })
  }, [toast])

  // 🔹 Remove item from wishlist
  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) => {
      const item = currentItems.find((i) => i.productId === productId)
      if (item) {
        toast({
          title: "Removed from wishlist",
          description: `${item.name} has been removed`,
        })
      }
      return currentItems.filter((i) => i.productId !== productId)
    })
  }, [toast])

  // 🔹 Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  )

  // 🔹 Clear wishlist with confirmation
  const clearWishlist = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      setItems([])
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed",
      })
    }
  }, [toast])

  // Memoize context value to prevent unnecessary re-renders
  const value: WishlistContextType = useMemo(() => ({
    items,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist,
  }), [items])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}