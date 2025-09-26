"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { useMobileCollectionItems } from "@/lib/firebase-hooks"
import type { StaticImageData } from "next/image"

interface Deal {
  id: string
  name: string
  brand?: string
  image: string
  originalPrice: number
  salePrice: number
  discount: number
  rating: number
  reviewCount: number
  timeLeft: number // in seconds
  stock: number
  sold?: number
}

export function TrendingDeals() {
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const { mobiles, loading, error } = useMobileCollectionItems(6)
  const [deals, setDeals] = useState<Deal[]>([])

  // Transform mobile data to deals format
  useEffect(() => {
    if (mobiles && mobiles.length > 0) {
      const transformedDeals = mobiles.map((mobile: any) => {
        const originalPrice = mobile.originalPrice || mobile.price * 1.2 || 0
        const salePrice = mobile.price || mobile.salePrice || 0
        const discount = originalPrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0
        
        return {
          id: mobile.id,
          name: mobile.name || 'Unnamed Product',
          brand: mobile.brand || mobile.Brand || '',
          image: (mobile.images && mobile.images[0]) || mobile.image || '/placeholder.svg',
          originalPrice: originalPrice,
          salePrice: salePrice,
          discount: discount,
          timeLeft: Math.floor(Math.random() * 86400) + 3600, // Random time between 1-25 hours
          stock: mobile.stock || 1,
          sold: Math.floor(Math.random() * 50) + 10, // Random sold count
        }
      }).filter(deal => deal.salePrice > 0) // Only show products with valid prices
      
      setDeals(transformedDeals)
    }
  }, [mobiles])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAddToCart = (deal: Deal) => {
    addItem({
      id: deal.id,
      productId: deal.id,
      name: deal.name,
      price: deal.salePrice,
      image: deal.image,
      maxQuantity: deal.stock,
    })
    
    toast({
      title: "Added to Cart!",
      description: `${deal.name} has been added to your cart.`,
    })
  }

  const handleAddToWishlist = (deal: Deal) => {
    addToWishlist({
      id: deal.id,
      productId: deal.id,
      name: deal.name,
      price: deal.salePrice,
      image: deal.image,
    })
    
    toast({
      title: isInWishlist(deal.id) ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${deal.name} has been ${isInWishlist(deal.id) ? "removed from" : "added to"} your wishlist.`,
    })
  }

  return (
  <section className="py-16 bg-gradient-to-b from-[#FFFBEA] to-white">
      <div className="container-custom">
        <div className="flex items-start justify-between">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-[36px] font-bold text-[#004AAD] mb-4">Trending Deals</h2>
            <p className="text-[16px] text-[#333333]-600 mb-8 max-w-[750px]">Score unbeatable prices on top-rated tech—but hurry, these offers are ticking away fast. With exclusive discounts and a live countdown, now’s the time to grab your next gadget before the clock runs out.</p>
          </div>

          {/* Button */}
          <button className="hidden lg:block bg-[#FFCC01] text-white px-6 py-3 rounded-full shadow-lg w-[150px]">view all</button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004AAD]"></div>
            <span className="ml-2 text-[#004AAD]">Loading deals...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading deals: {error}</p>
          </div>
        )}

        {/* Deals Grid */}
        {!loading && !error && deals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-8">
            {deals.map((deal) => (
              <Link key={deal.id} href={`/mobile/${deal.id}`} className="block group focus:outline-none focus:ring-2 focus:ring-[#004AAD] rounded-2xl">
                <DealCard
                  deal={deal}
                  onAddToCart={(e) => { e.stopPropagation(); handleAddToCart(deal); }}
                  onAddToWishlist={(e) => { e.stopPropagation(); handleAddToWishlist(deal); }}
                  isInWishlist={isInWishlist(deal.id)}
                  formatTime={formatTime}
                />
              </Link>
            ))}
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && deals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No deals available at the moment.</p>
          </div>
        )}

        {/* View All Button
        <div className="text-center">
          <Link href="/deals">
            <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
              View All Deals →
            </Button>
          </Link>
        </div> */}
      </div>
    </section>
  )
}

function DealCard({
  deal,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  formatTime,
}: {
  deal: Deal
  onAddToCart: (e: React.MouseEvent) => void
  onAddToWishlist: (e: React.MouseEvent) => void
  isInWishlist: boolean
  formatTime: (seconds: number) => string
}) {
  const [timeLeft, setTimeLeft] = useState(deal.timeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate progress percent
  const total = deal.stock + (deal.sold || 0);
  const percent = total > 0 && deal.sold ? Math.round((deal.sold / total) * 100) : 0;
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.10)] border border-[#ECECEC] flex flex-col min-h-[480px]">
      {/* Top Row: Timer & Wishlist */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center">
          <div className="bg-[#004AAD] rounded-full px-4 py-1 flex items-center text-white text-base font-semibold">
            <Clock size={18} className="mr-2 text-white" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <button
          onClick={onAddToWishlist}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-[#FFCC01] hover:text-[#004AAD] transition-colors duration-200 border border-[#ECECEC]"
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={22} className={isInWishlist ? "text-[#004AAD] fill-[#FFCC01]" : "text-[#004AAD]"} />
        </button>
      </div>

      {/* Product Image */}
      <div className="flex items-center justify-center h-40 mt-2 mb-2">
        <Image
          src={deal.image || "/placeholder.svg"}
          alt={deal.name}
          width={150}
          height={150}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-6">
        {/* Badges Row */}
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#004AAD] text-white text-xs font-bold px-3 py-1 rounded-full">{deal.discount}% off</span>
          <span className="text-[#004AAD] text-xs font-bold">Limited Time Deal</span>
        </div>
        {/* Product Name */}
        <h3 className="font-bold text-[#004AAD] text-lg mb-1">{deal.name}</h3>
        {/* Brand */}
        {deal.brand && (
          <p className="text-sm text-[#4A6FA1] mb-2">{deal.brand}</p>
        )}
        {/* Price Row */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-[#004AAD] text-xl font-bold mr-2">₹{deal.salePrice}</span>
            <span className="text-gray-400 line-through text-sm">₹{deal.originalPrice}</span>
          </div>
          <Button
            onClick={onAddToCart}
            className="w-10 h-10 p-0 bg-[#004AAD] hover:bg-[#FFCC01] text-white hover:text-[#004AAD] rounded-full flex items-center justify-center text-xl font-bold shadow-none"
            disabled={deal.stock === 0}
            title={deal.stock === 0 ? 'Out of Stock' : 'Add to cart'}
          >
            +
          </Button>
        </div>
        {/* Progress Bar - only show if sold data is available */}
        {deal.sold && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 rounded-full bg-[#E0E0E0] overflow-hidden">
              <div
                className="h-2 rounded-full bg-[#004AAD]"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <span className="text-xs text-[#004AAD] font-bold">{percent}% sold</span>
          </div>
        )}
      </div>
    </div>
  );
}
