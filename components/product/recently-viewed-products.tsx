"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface RecentlyViewedProductsProps {
  products: Product[]
}

export function RecentlyViewedProducts({ products }: RecentlyViewedProductsProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/product/${product.id}`} className="block">
              <div className="relative w-full aspect-square">
                <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-gray-600 text-sm truncate">{product.brand}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>
                    {product.rating.toFixed(1)} ({product.reviews})
                  </span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}
