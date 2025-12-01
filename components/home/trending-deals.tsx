"use client"

import { useState, useEffect, useMemo, memo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { StaticImageData } from "next/image"

export interface Deal {
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

// ✅ OPTIMIZATION 6: Extract skeleton component to prevent recreation on each render
export const DealCardSkeleton = memo(function DealCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.10)] border border-[#ECECEC] flex flex-col min-h-[480px]">
      {/* Top Row Skeleton */}
      <div className="flex items-center justify-between px-6 pt-6">
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Image Skeleton */}
      <div className="flex items-center justify-center h-40 mt-2 mb-2 px-6">
        <Skeleton className="h-32 w-32 rounded-lg" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col px-6 pb-6 space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        <div className="flex justify-between items-end pt-2">
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        <div className="pt-2">
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-16 mt-2" />
        </div>
      </div>
    </div>
  )
})

interface TrendingDealsProps {
  deals: Deal[]
}

export function TrendingDeals({ deals }: TrendingDealsProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()


  // ✅ OPTIMIZATION 1: Memoize wishlist status - calculated once per render instead of per card
  const wishlistMap = useMemo(() => {
    const map = new Map<string, boolean>()
    deals.forEach(deal => {
      map.set(deal.id, isInWishlist(deal.id))
    })
    return map
  }, [deals, isInWishlist])

  // ✅ OPTIMIZATION 2: Stable callbacks - Event handlers wrapped in useCallback
  const handleAddToCart = useCallback((deal: Deal) => {
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
  }, [addItem, toast])

  const handleAddToWishlist = useCallback((deal: Deal) => {
    addToWishlist({
      id: deal.id,
      productId: deal.id,
      name: deal.name,
      price: deal.salePrice,
      image: deal.image,
    })

    toast({
      title: "Wishlist Updated",
      description: `${deal.name} has been updated in your wishlist.`,
    })
  }, [addToWishlist, toast])

  return (
    <section className="py-16 bg-gradient-to-b from-[#FFFBEA] to-white">
      <div className="container-custom">
        <div className="flex items-start justify-between">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-[36px] font-bold text-[#004AAD] mb-4">Trending Deals</h2>
            <p className="text-[16px] text-[#333333]-600 mb-8 max-w-[750px]">Score unbeatable prices on top-rated tech—but hurry, these offers are ticking away fast. With exclusive discounts and a live countdown, now's the time to grab your next gadget before the clock runs out.</p>
          </div>

          {/* Button */}
          <button className="hidden lg:block bg-[#FFCC01] text-white px-6 py-3 rounded-full shadow-lg w-[150px]">view all</button>
        </div>

        {/* Deals Grid */}
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-8">
            {deals.map((deal, index) => (
              <Link key={deal.id} href={`/mobile/${deal.id}`} className="block group focus:outline-none focus:ring-2 focus:ring-[#004AAD] rounded-2xl">
                <DealCard
                  deal={deal}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  isInWishlist={wishlistMap.get(deal.id) || false}
                  isPriority={index < 3} // ✅ OPTIMIZATION 5: First 3 images load with priority
                />
              </Link>
            ))}
          </div>
        ) : (
          /* No Data State */
          <div className="text-center py-12">
            <p className="text-gray-500">No deals available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

const DealTimer = memo(function DealTimer({ initialTime }: { initialTime: number }) {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // ✅ OPTIMIZATION 4: Optimized timer formatting - wrapped in useMemo
  const formattedTime = useMemo(() => {
    const hours = Math.floor(timeLeft / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const secs = timeLeft % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [timeLeft])

  return (
    <div className="bg-[#004AAD] rounded-full px-4 py-1 flex items-center text-white text-base font-semibold">
      <Clock size={18} className="mr-2 text-white" />
      {formattedTime}
    </div>
  )
})

// ✅ OPTIMIZATION 3: Custom memo comparison - DealCard only re-renders when necessary data changes
const DealCard = memo(function DealCard({
  deal,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  isPriority = false,
}: {
  deal: Deal
  onAddToCart: (deal: Deal) => void
  onAddToWishlist: (deal: Deal) => void
  isInWishlist: boolean
  isPriority?: boolean
}) {
  // Memoize progress calculation
  const progressData = useMemo(() => {
    const total = deal.stock + (deal.sold || 0)
    const percent = total > 0 && deal.sold ? Math.round((deal.sold / total) * 100) : 0
    return { total, percent }
  }, [deal.stock, deal.sold])

  // Stable event handlers
  const handleWishlistClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToWishlist(deal)
  }, [deal, onAddToWishlist])

  const handleCartClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart(deal)
  }, [deal, onAddToCart])

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.10)] border border-[#ECECEC] flex flex-col min-h-[480px]">
      {/* Top Row: Timer & Wishlist */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center">
          <DealTimer initialTime={deal.timeLeft} />
        </div>
        <button
          onClick={handleWishlistClick}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-[#FFCC01] hover:text-[#004AAD] transition-colors duration-200 border border-[#ECECEC]"
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={22} className={isInWishlist ? "text-[#004AAD] fill-[#FFCC01]" : "text-[#004AAD]"} />
        </button>
      </div>

      {/* Product Image */}
      <div className="flex items-center justify-center h-40 mt-2 mb-2 relative">
        <Image
          src={deal.image || "/placeholder.svg"}
          alt={deal.name}
          width={150}
          height={150}
          priority={isPriority} // ✅ OPTIMIZATION 5: Priority loading for first 3 images
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
          style={{ width: 'auto', height: '100%' }}
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
        <h3 className="font-bold text-[#004AAD] text-lg mb-1 line-clamp-2">{deal.name}</h3>
        {/* Brand */}
        {deal.brand && (
          <p className="text-sm text-[#4A6FA1] mb-2">{deal.brand}</p>
        )}
        {/* Price Row */}
        <div className="flex items-end justify-between mb-2 mt-auto">
          <div>
            <span className="text-[#004AAD] text-xl font-bold mr-2">₹{deal.salePrice}</span>
            <span className="text-gray-400 line-through text-sm">₹{deal.originalPrice}</span>
          </div>
          <Button
            onClick={handleCartClick}
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
                style={{ width: `${progressData.percent}%` }}
              ></div>
            </div>
            <span className="text-xs text-[#004AAD] font-bold">{progressData.percent}% sold</span>
          </div>
        )}
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // ✅ OPTIMIZATION 3: Custom comparison function - only re-render if these specific props change
  return (
    prevProps.deal.id === nextProps.deal.id &&
    prevProps.deal.name === nextProps.deal.name &&
    prevProps.deal.salePrice === nextProps.deal.salePrice &&
    prevProps.deal.originalPrice === nextProps.deal.originalPrice &&
    prevProps.deal.discount === nextProps.deal.discount &&
    prevProps.deal.stock === nextProps.deal.stock &&
    prevProps.deal.sold === nextProps.deal.sold &&
    prevProps.deal.image === nextProps.deal.image &&
    prevProps.isInWishlist === nextProps.isInWishlist &&
    prevProps.isPriority === nextProps.isPriority &&
    prevProps.onAddToCart === nextProps.onAddToCart &&
    prevProps.onAddToWishlist === nextProps.onAddToWishlist
  )
})
