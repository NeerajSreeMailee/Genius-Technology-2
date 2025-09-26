"use client"

import { useState, useEffect } from "react"
import { collection, query, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import type { Product } from "@/types"

export function InventoryAlerts() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Query products where stock is less than or equal to their minStockThreshold,
    // or a default of 10 if minStockThreshold is not set.
    // Firestore doesn't directly support `where("stock", "<=", "minStockThreshold")`
    // so we'll fetch all and filter client-side, or use a fixed threshold for the query.
    // For simplicity and real-time updates, we'll fetch all and filter.
    // For very large inventories, a cloud function might be better to pre-process alerts.
    const q = query(collection(db, "products")) // Fetch all products

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[]

        // Client-side filtering for low stock based on minStockThreshold
        const filteredLowStock = productsData.filter(
          (product) => product.stock <= (product.minStockThreshold ?? 10), // Use product's threshold or default to 10
        )
        setLowStockProducts(filteredLowStock)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching real-time low stock products:", error)
        setLoading(false)
      },
    )

    return () => unsubscribe() // Cleanup listener on unmount
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Inventory Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <span>Inventory Alerts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No low stock alerts</p>
          ) : (
            lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">SKU: {product.id.slice(-8)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                    {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
