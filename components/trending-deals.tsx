"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { useMobileCollectionItems } from "@/lib/firebase-hooks"
import { useIsMobile, useMobileIntersectionObserver, getMobileImageProps } from "@/lib/mobile-utils"
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

export const TrendingDeals = memo(function TrendingDeals() {
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const { isMobile, isLoading: mobileLoading } = useIsMobile()
  
  // Reduce items on mobile for better performance
  const itemLimit = isMobile ? 4 : 6
  const { mobiles, loading, error } = useMobileCollectionItems(itemLimit)
  
  // Use single state update instead of separate timer states
  const [currentTime, setCurrentTime] = useState(Date.now())
  
  // Update time less frequently on mobile to reduce CPU usage
  useEffect(() => {
    if (mobileLoading) return
    
    const interval = isMobile ? 3000 : 1000 // Update every 3 seconds on mobile vs 1 second on desktop
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, interval)
    return () => clearInterval(timer)
  }, [isMobile, mobileLoading])

  // Memoize transformed deals to prevent unnecessary recalculations
  const deals = useMemo(() => {
    if (!mobiles || mobiles.length === 0) return []
    
    return mobiles.map((mobile: any) => {
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
        rating: mobile.rating || 4.5,
        reviewCount: mobile.reviewCount || Math.floor(Math.random() * 200) + 50,
        timeLeft: Math.floor(Math.random() * 86400) + 3600, // Random time between 1-25 hours
        stock: mobile.stock || 1,
        sold: Math.floor(Math.random() * 50) + 10, // Random sold count
      }
    }).filter(deal => deal.salePrice > 0) // Only show products with valid prices
  }, [mobiles])

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

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
      title: isInWishlist(deal.id) ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${deal.name} has been ${isInWishlist(deal.id) ? "removed from" : "added to"} your wishlist.`,
    })
  }, [addToWishlist, toast, isInWishlist])

  // Loading skeleton component - simplified for mobile
  const LoadingSkeleton = () => (
    <div className={`grid gap-4 mb-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'}`}>
      {[...Array(isMobile ? 2 : 6)].map((_, index) => (
        <div key={index} className={`bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.10)] border border-[#ECECEC] flex flex-col animate-pulse ${isMobile ? 'min-h-[300px]' : 'min-h-[480px]'}`}>
          <div className="px-6 pt-6 pb-2">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className={`bg-gray-200 rounded mb-4 ${isMobile ? 'h-24' : 'h-40'}`}></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )

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
        {loading && <LoadingSkeleton />}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading deals: {error}</p>
          </div>
        )}

        {/* Deals Grid - Mobile optimized */}
        {!loading && !error && deals.length > 0 && (
          <div className={`grid gap-4 mb-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'}`}>
            {deals.map((deal, index) => (
              <Link key={deal.id} href={`/mobile/${deal.id}`} className="block group focus:outline-none focus:ring-2 focus:ring-[#004AAD] rounded-2xl">
                <MobileDealCard
                  deal={deal}
                  onAddToCart={(e: React.MouseEvent) => { e.stopPropagation(); handleAddToCart(deal); }}
                  onAddToWishlist={(e: React.MouseEvent) => { e.stopPropagation(); handleAddToWishlist(deal); }}
                  isInWishlist={isInWishlist(deal.id)}
                  formatTime={formatTime}
                  currentTime={currentTime}
                  isMobile={isMobile}
                  isLazyLoaded={isMobile && index > 1} // Only lazy load cards below the fold on mobile
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
      </div>
    </section>
  )
})

const MobileDealCard = memo(function MobileDealCard({
  deal,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  formatTime,
  currentTime,
  isMobile,
  isLazyLoaded = false,
}: {
  deal: Deal
  onAddToCart: (e: React.MouseEvent) => void
  onAddToWishlist: (e: React.MouseEvent) => void
  isInWishlist: boolean
  formatTime: (seconds: number) => string
  currentTime: number
  isMobile: boolean
  isLazyLoaded?: boolean
}) {
  const [setRef, isInView] = useMobileIntersectionObserver()
  
  // Calculate time left based on current time instead of individual timers
  const timeLeft = useMemo(() => {
    const elapsed = Math.floor((currentTime - Date.now()) / 1000)
    return Math.max(0, deal.timeLeft + elapsed)
  }, [currentTime, deal.timeLeft])

  // Calculate progress percent
  const percent = useMemo(() => {
    const total = deal.stock + (deal.sold || 0)
    return total > 0 && deal.sold ? Math.round((deal.sold / total) * 100) : 0
  }, [deal.stock, deal.sold])

  // Don't render until in view if lazy loaded
  if (isLazyLoaded && !isInView) {
    return (
      <div 
        ref={setRef} 
        className={`bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.10)] border border-[#ECECEC] flex flex-col ${isMobile ? 'min-h-[300px]' : 'min-h-[480px]'} animate-pulse`}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#004AAD] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={setRef}
      className={`bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.10)] border border-[#ECECEC] flex flex-col ${isMobile ? 'min-h-[300px]' : 'min-h-[480px]'}`}
      style={isMobile ? { willChange: 'auto' } : undefined} // Optimize for mobile
    >
      {/* Top Row: Timer & Wishlist - Simplified on mobile */}
      <div className={`flex items-center justify-between px-4 pt-4 ${isMobile ? 'px-3 pt-3' : 'px-6 pt-6'}`}>
        {!isMobile && ( // Hide timer on mobile to reduce CPU usage
          <div className="flex items-center">
            <div className="bg-[#004AAD] rounded-full px-3 py-1 flex items-center text-white text-sm font-semibold">
              <Clock size={16} className="mr-1 text-white" />
              {formatTime(timeLeft)}
            </div>
          </div>
        )}
        <button
          onClick={onAddToWishlist}
          className={`flex items-center justify-center rounded-full bg-white shadow hover:bg-[#FFCC01] hover:text-[#004AAD] transition-colors duration-200 border border-[#ECECEC] ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          style={isMobile ? { touchAction: 'manipulation' } : undefined} // Optimize for touch
        >
          <Heart size={isMobile ? 18 : 22} className={isInWishlist ? "text-[#004AAD] fill-[#FFCC01]" : "text-[#004AAD]"} />
        </button>
      </div>

      {/* Product Image - Smaller on mobile */}
      <div className={`flex items-center justify-center mt-2 mb-2 ${isMobile ? 'h-24' : 'h-40'}`}>
        <Image
          {...getMobileImageProps(deal.image || "/placeholder.svg", deal.name, isMobile)}
          width={isMobile ? 80 : 150}
          height={isMobile ? 80 : 150}
          className="object-contain"
        />
      </div>

      {/* Content - Condensed on mobile */}
      <div className={`flex-1 flex flex-col pb-4 ${isMobile ? 'px-3' : 'px-6 pb-6'}`}>
        {/* Badges Row */}
        <div className={`flex items-center gap-2 mb-2 ${isMobile ? 'gap-1 mb-1' : ''}`}>
          <span className={`bg-[#004AAD] text-white font-bold px-2 py-1 rounded-full ${isMobile ? 'text-xs px-2' : 'text-xs px-3'}`}>
            {deal.discount}% off
          </span>
          {!isMobile && (
            <span className="text-[#004AAD] text-xs font-bold">Limited Time Deal</span>
          )}
        </div>
        
        {/* Product Name - Truncated on mobile */}
        <h3 className={`font-bold text-[#004AAD] mb-1 ${isMobile ? 'text-sm line-clamp-2' : 'text-lg'}`}>
          {deal.name}
        </h3>
        
        {/* Brand - Hidden on mobile to save space */}
        {!isMobile && deal.brand && (
          <p className="text-sm text-[#4A6FA1] mb-2">{deal.brand}</p>
        )}
        
        {/* Price Row */}
        <div className={`flex items-end justify-between mb-2 ${isMobile ? 'mb-1' : ''}`}>
          <div>
            <span className={`text-[#004AAD] font-bold mr-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              ₹{deal.salePrice}
            </span>
            <span className={`text-gray-400 line-through ${isMobile ? 'text-xs' : 'text-sm'}`}>
              ₹{deal.originalPrice}
            </span>
          </div>
          <Button
            onClick={onAddToCart}
            className={`p-0 bg-[#004AAD] hover:bg-[#FFCC01] text-white hover:text-[#004AAD] rounded-full flex items-center justify-center font-bold shadow-none ${isMobile ? 'w-8 h-8 text-lg' : 'w-10 h-10 text-xl'}`}
            disabled={deal.stock === 0}
            title={deal.stock === 0 ? 'Out of Stock' : 'Add to cart'}
            style={isMobile ? { touchAction: 'manipulation' } : undefined}
          >
            +
          </Button>
        </div>
        
        {/* Progress Bar - Simplified on mobile */}
        {deal.sold && !isMobile && (
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
  )
})
