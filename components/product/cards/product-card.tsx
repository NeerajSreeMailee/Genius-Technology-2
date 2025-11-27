"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useComparison } from "@/contexts/comparison-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Eye, GitCompare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { OptimizedImage } from "@/components/optimized-image"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { addToComparison, isInComparison } = useComparison()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: productName,
      price: productPrice,
      image: productImage,
      maxQuantity: product.stock || 10,
    })
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart.`,
    })
  }

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        name: productName,
        price: productPrice,
        image: productImage,
      })
      toast({
        title: "Added to wishlist",
        description: `${productName} has been added to your wishlist.`,
      })
    }
  }

  const handleAddToCompare = () => {
    if (!isInComparison(product.id)) {
      addToComparison(product)
      toast({
        title: "Added to comparison",
        description: `${product.name} has been added to the comparison list.`,
      })
    }
  }

  // Generate properly encoded URL for the product
  const productUrl = `/mobile/${encodeURIComponent(product.id)}`
  
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // ✅ Safe fallback for images - filter out invalid/gs:// URLs
  const productImage = (() => {
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      // Find first valid https:// image URL
      const validImage = product.images.find(img => 
        img && 
        typeof img === 'string' && 
        img.trim().length > 0 && 
        img.startsWith('https://')
      )
      if (validImage) {
        return validImage
      }
    }
    return "/placeholder.svg?height=250&width=250&query=product"
  })()

  // ✅ Safe fallbacks for product data - use transformed fields
  const productName = product?.name || 'Unnamed Product'
  const productDescription = product?.description || 'No description available'
  const productPrice = Number(product?.price || 0)
  const productOriginalPrice = Number(product?.originalPrice || 0)
  const productRating = Number(product?.rating || 4.0)
  const productReviewCount = Number(product?.reviewCount || 0)

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300 glass-card floating-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
              <OptimizedImage
                src={productImage}
                alt={product?.name || "Product"}
                className="object-contain rounded-lg"
                width={128}
                height={128}
                quality={80}
                loading="lazy"
              />
              {discount > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-600">-{discount}%</Badge>
              )}
            </div>

            <div className="flex-1 space-y-2">
            <Link href={productUrl}>
              <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-2">
                {productName}
              </h3>
            </Link>              <p className="text-gray-600 text-sm line-clamp-2">
                {productDescription}
              </p>

              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-green-600">
                  ₹{productPrice.toLocaleString()}
                </span>
                {productOriginalPrice > productPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{productOriginalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Button onClick={handleAddToCart} size="sm" className="floating-card">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleWishlist}
                  className={
                    isInWishlist(product.id)
                      ? "bg-red-50 text-red-600 border-red-200 floating-card"
                      : "floating-card"
                  }
                >
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Toggle Wishlist</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToCompare}
                  disabled={isInComparison(product.id)}
                  className={
                    isInComparison(product.id)
                      ? "bg-gray-100 text-gray-700 border-gray-200 floating-card"
                      : "floating-card"
                  }
                >
                  <GitCompare className="h-4 w-4" />
                  <span className="sr-only">Add to Compare</span>
                </Button>
                <Button variant="outline" size="sm" asChild className="floating-card">
                  <Link href={productUrl}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ✅ Grid view
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 glass-card floating-card relative overflow-hidden">
      {/* Decorative element for grid view */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full opacity-20"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-15"></div>
      
      {/* Additional textures and shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="diamond-bg w-full h-full"></div>
      </div>
      <div className="absolute top-4 right-4 w-8 h-8 border-2 border-amber-200 opacity-20 transform rotate-45"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 opacity-25"></div>
      
      <CardContent className="p-4 relative z-10">
        <div className="relative mb-4">
          <OptimizedImage
            src={productImage}
            alt={product?.name || "Product"}
            className="w-full h-48 object-contain rounded-lg"
            width={250}
            height={250}
            quality={80}
            loading="lazy"
          />

          {product.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-green-600">Featured</Badge>
          )}

          {discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-600">-{discount}%</Badge>
          )}

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className={`h-8 w-8 p-0 rounded-full ${
                isInWishlist(product.id) ? "bg-red-50 text-red-600" : ""
              } floating-card`}
              onClick={handleToggleWishlist}
              aria-label="Add to wishlist"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="h-8 w-8 p-0 rounded-full floating-card"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className={`h-8 w-8 p-0 rounded-full ${
                isInComparison(product.id) ? "bg-gray-100 text-gray-700" : ""
              } floating-card`}
              onClick={handleAddToCompare}
              disabled={isInComparison(product.id)}
              aria-label="Add to comparison"
            >
              <GitCompare className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-full floating-card"
              asChild
              aria-label="View details"
            >
              <Link href={productUrl}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Link href={productUrl}>
            <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {productName}
            </h3>
          </Link>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-green-600">
                ₹{productPrice.toLocaleString()}
              </span>
              {productOriginalPrice > productPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{productOriginalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <Button size="sm" className="w-full text-xs floating-card" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
