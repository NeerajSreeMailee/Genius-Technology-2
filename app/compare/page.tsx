"use client"

import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductComparisonTable } from "@/components/product-comparison-table"
import { useComparison } from "@/contexts/comparison-context"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product } from "@/types"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function ComparePage() {
  const { comparisonProductIds, clearComparison, setComparisonProducts, comparisonProducts } = useComparison()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      if (comparisonProductIds.length === 0) {
        setComparisonProducts([])
        setLoading(false)
        return
      }

      // Filter out products already in comparisonProducts to avoid re-fetching
      const productsToFetch = comparisonProductIds.filter((id) => !comparisonProducts.some((p) => p.id === id))

      if (productsToFetch.length === 0 && comparisonProductIds.length === comparisonProducts.length) {
        setLoading(false)
        return // All products already fetched and in context
      }

      setLoading(true)
      const fetchedProducts: Product[] = [...comparisonProducts] // Start with already fetched products

      for (const id of productsToFetch) {
        const productRef = doc(db, "products", id)
        const productSnap = await getDoc(productRef)
        if (productSnap.exists()) {
          fetchedProducts.push({
            id: productSnap.id,
            ...productSnap.data(),
            createdAt: productSnap.data().createdAt?.toDate(),
            updatedAt: productSnap.data().updatedAt?.toDate(),
          } as Product)
        }
      }
      setComparisonProducts(fetchedProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [comparisonProductIds, setComparisonProducts, comparisonProducts])

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Compare Products", href: "/compare" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Comparison</h1>

        {loading ? (
          <div className="text-center py-8">Loading products for comparison...</div>
        ) : comparisonProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p className="mb-4">No products selected for comparison.</p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button variant="outline" onClick={clearComparison}>
                Clear All Products
              </Button>
            </div>
            <ProductComparisonTable products={comparisonProducts} />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
