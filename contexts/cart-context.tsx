"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react"
import type { CartItem } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { SafeStorage } from "@/lib/performance-optimization"

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  addToCart: (productId: string, quantity: number, price: number, selectedOptions?: Record<string, string>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  // Coupon management
  appliedCoupon: { code: string; discountAmount: number } | null
  applyCoupon: (code: string, discountAmount: number) => void
  removeCoupon: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null)
  const { toast } = useToast()

  // Load cart from localStorage on mount with error handling
  useEffect(() => {
    try {
      const savedCart = SafeStorage.getItem("genius-cart")
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
      
      // Load applied coupon from localStorage
      const savedCoupon = SafeStorage.getItem("genius-cart-coupon")
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon)
        if (parsed && typeof parsed === 'object') {
          setAppliedCoupon(parsed)
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
      SafeStorage.removeItem("genius-cart")
      SafeStorage.removeItem("genius-cart-coupon")
    }
  }, [])

  // Save cart to localStorage whenever items change with debouncing
  useEffect(() => {
    if (items.length > 0 || SafeStorage.getItem("genius-cart")) {
      try {
        const timer = setTimeout(() => {
          SafeStorage.setItem("genius-cart", JSON.stringify(items))
        }, 100) // Debounce localStorage writes
        
        return () => clearTimeout(timer)
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error)
      }
    }
  }, [items])

  // Save coupon to localStorage whenever it changes with debouncing
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        if (appliedCoupon) {
          SafeStorage.setItem("genius-cart-coupon", JSON.stringify(appliedCoupon))
        } else {
          SafeStorage.removeItem("genius-cart-coupon")
        }
      }, 100) // Debounce localStorage writes
      
      return () => clearTimeout(timer)
    } catch (error) {
      console.error("Failed to save coupon to localStorage:", error)
    }
  }, [appliedCoupon])

  const addToCart = useCallback((productId: string, quantity: number, price: number, selectedOptions?: Record<string, string>) => {
    const existingItem = items.find((item) => item.productId === productId)

    if (existingItem) {
      // Update quantity of existing item without stock limit check
      updateQuantity(productId, existingItem.quantity + quantity)
    } else {
      // Add new item with selectedOptions
      addItem({
        id: `${productId}-${Date.now()}`, // Unique ID for cart item
        productId,
        name: "Product", // This will be updated when product details are fetched
        price,
        image: "/placeholder.svg",
        maxQuantity: 999999, // Set a very high max quantity to effectively remove limits
        selectedOptions: selectedOptions || undefined
      })
    }
  }, [items])

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === newItem.productId)

      if (existingItem) {
        // Remove the quantity limit check and use the specified quantity
        toast({
          title: "Item updated",
          description: `${newItem.name} quantity increased`,
        })

        return currentItems.map((item) =>
          item.productId === newItem.productId ? { ...item, quantity: item.quantity + (newItem as any).quantity || 1 } : item,
        )
      }

      toast({
        title: "Added to cart",
        description: `${newItem.name} has been added to your cart`,
      })

      // Use the specified quantity or default to 1
      const quantity = (newItem as any).quantity || 1;
      return [...currentItems, { ...newItem, quantity }]
    })
  }, [toast])

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) => {
      const item = currentItems.find((item) => item.productId === productId)
      if (item) {
        toast({
          title: "Item removed",
          description: `${item.name} has been removed from your cart`,
        })
      }
      return currentItems.filter((item) => item.productId !== productId)
    })
  }, [toast])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.productId === productId) {
          // Remove the max quantity check
          return { ...item, quantity: quantity }
        }
        return item
      }),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setAppliedCoupon(null)
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }, [toast])

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [items])

  const applyCoupon = useCallback((code: string, discountAmount: number) => {
    setAppliedCoupon({ code, discountAmount })
  }, [])

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null)
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    items,
    addItem,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  }), [items, appliedCoupon])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}