"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"

interface ComparisonContextType {
  comparisonProductIds: string[]
  comparisonProducts: Product[] // This will be populated by fetching products based on IDs
  addToComparison: (product: Product) => void
  removeFromComparison: (productId: string) => void
  clearComparison: () => void
  isInComparison: (productId: string) => boolean
  setComparisonProducts: (products: Product[]) => void // To set fetched product details
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonProductIds, setComparisonProductIds] = useState<string[]>([])
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([])
  const { toast } = useToast()

  const addToComparison = useCallback(
    (product: Product) => {
      setComparisonProductIds((prevIds) => {
        if (prevIds.includes(product.id)) {
          toast({
            title: "Already in comparison",
            description: `${product.name} is already in your comparison list.`,
            variant: "default",
          })
          return prevIds
        }
        if (prevIds.length >= 4) {
          // Limit to 4 products for comparison
          toast({
            title: "Comparison Limit Reached",
            description: "You can compare a maximum of 4 products at a time. Please remove one to add another.",
            variant: "destructive",
          })
          return prevIds
        }
        toast({
          title: "Added to comparison",
          description: `${product.name} has been added for comparison.`,
          variant: "default",
        })
        return [...prevIds, product.id]
      })
    },
    [toast],
  )

  const removeFromComparison = useCallback(
    (productId: string) => {
      setComparisonProductIds((prevIds) => prevIds.filter((id) => id !== productId))
      setComparisonProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId))
      toast({
        title: "Removed from comparison",
        description: "Product removed from comparison list.",
        variant: "default",
      })
    },
    [toast],
  )

  const clearComparison = useCallback(() => {
    setComparisonProductIds([])
    setComparisonProducts([])
    toast({
      title: "Comparison cleared",
      description: "Your comparison list has been cleared.",
      variant: "default",
    })
  }, [toast])

  const isInComparison = useCallback(
    (productId: string) => {
      return comparisonProductIds.includes(productId)
    },
    [comparisonProductIds],
  )

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    comparisonProductIds,
    comparisonProducts,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    setComparisonProducts,
  }), [comparisonProductIds, comparisonProducts])

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider")
  }
  return context
}