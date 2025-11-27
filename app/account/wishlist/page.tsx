"use client"

import { Header } from "@/components/layout/header"
import { useAuth } from "@/contexts/auth-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Loader2 } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth()
  const { items: wishlistItems } = useWishlist()

  // 🔹 Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-label="Loading wishlist" />
            <span className="text-lg text-gray-700">Loading your wishlist...</span>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // 🔹 User Not Logged In
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col ">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login to View Your Wishlist</h1>
          <p className="text-gray-600 mb-8">Your wishlist is saved to your account.</p>
          <Button asChild>
            <Link href="/login">Login Now</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  // 🔹 Wishlist Content
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">Products you've saved for later.</p>
        </header>

        {wishlistItems.length === 0 ? (
          // 🔹 Empty Wishlist
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-4">Start adding products you love!</p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          // 🔹 Wishlist Items
          <section aria-label="Wishlist items">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="relative aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <Image
                        src={item.image || "/placeholder.svg?height=250&width=250&query=product"}
                        alt={item.name || "Product"}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <Link href={`/mobile/${encodeURIComponent(item.productId)}`}>
                      <h3 className="font-semibold text-sm mb-2 hover:text-blue-600 transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-lg font-bold text-blue-600">₹{item.price.toLocaleString()}</p>
                    <Button className="w-full mt-3" size="sm" asChild>
                      <Link href={`/mobile/${encodeURIComponent(item.productId)}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}