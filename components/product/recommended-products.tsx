"use client"

import { useState, useEffect } from "react"
import { collection, query, where, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product } from "@/types"
import { ProductCard } from "@/components/product-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RecommendedProductsProps {
  currentProductId: string
  category: string
}

export function RecommendedProducts({ currentProductId, category }: RecommendedProductsProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setLoading(true)
      try {
        const productsRef = collection(db, "products")
        // Fetch products from the same category, excluding the current product
        const q = query(
          productsRef,
          where("category", "==", category),
          where("id", "!=", currentProductId), // Exclude current product
          limit(4), // Limit to 4 recommendations
        )
        const querySnapshot = await getDocs(q)
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Product[]
        setRecommendedProducts(productsData)
      } catch (error) {
        console.error("Error fetching recommended products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchRecommendedProducts()
    }
  }, [currentProductId, category])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (recommendedProducts.length === 0) {
    return null // Don't show section if no recommendations
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers Also Bought</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
