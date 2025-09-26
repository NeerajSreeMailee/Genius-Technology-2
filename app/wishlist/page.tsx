"use client"

import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingCart, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function WishlistPage() {
  const { items: wishlistItems, removeItem } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      productId: product.productId,
      name: product.name,
      price: product.price,
      image: product.image,
      maxQuantity: 10,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <>
      <Header/>
      <div className="min-h-[59vh] container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="text-center py-12 border-0 shadow-none">
            <CardContent>
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-4">Start adding products you love!</p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
      </div>
      <Footer/>
      </>
    )
  }

  return (
<>
<Header/>
    <div className="py-8 px-4 max-w-6xl mx-auto min-h-screen pt-32">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((product: any) => {
          // ✅ Safe fallback for image
          const productImage =
          product?.image || "/placeholder.svg?height=250&width=250&query=product"
          
          return (
            <Card key={product.id} className="group hover:shadow-lg transition">
              <CardContent className="p-4 flex flex-col">
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={productImage}
                    alt={product?.name || "Product"}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>

                <Link href={`/mobile/${encodeURIComponent(product.productId)}`}>
                  <h3 className="font-semibold text-lg hover:text-blue-600 transition line-clamp-2">
                    {product?.name || "Unnamed Product"}
                  </h3>
                </Link>

               

                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-lg font-bold text-green-600">
                    ₹{product?.price?.toLocaleString() || "N/A"}
                  </span>
                  {product?.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      removeItem(product.productId)
                      toast({
                        title: "Removed from wishlist",
                        description: `${product?.name} has been removed.`,
                      })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
    <Footer/>
    </>
  )
}