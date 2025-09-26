"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, ShoppingCart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import Product1 from '../public/Product1.png'
import Product2 from '../public/Product2.png'

import type { StaticImageData } from "next/image"

interface Deal {
  id: string
  name: string
  brand: string
  image: string | StaticImageData
  originalPrice: number
  salePrice: number
  discount: number
  rating: number
  reviewCount: number
  timeLeft: number // in seconds
  stock: number
  sold: number
}

export function FeaturedProducts() {
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()

  const [deals] = useState<Deal[]>([
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      brand: "SoundMax",
      image: Product1,
      originalPrice: 2999,
      salePrice: 1499,
      discount: 50,
      rating: 4.5,
      reviewCount: 234,
      timeLeft: 86400, // 24 hours
      stock: 60,
      sold: 45,
    },
    {
      id: "2",
      name: "Fast Charging Power Bank 20000mAh",
      brand: "PowerPro",
      image: Product2,
      originalPrice: 3499,
      salePrice: 1999,
      discount: 43,
      rating: 4.3,
      reviewCount: 189,
      timeLeft: 43200, // 12 hours
      stock: 40,
      sold: 20,
    },
    {
      id: "3",
      name: "Wireless Car Charger Mount",
      brand: "AutoTech",
      image: Product1,
      originalPrice: 1999,
      salePrice: 999,
      discount: 50,
      rating: 4.2,
      reviewCount: 156,
      timeLeft: 21600, // 6 hours
      stock: 80,
      sold: 60,
    },
    {
      id: "4",
      name: "Premium Phone Case with Stand",
      brand: "CaseMaster",
      image: "/placeholder.svg?height=200&width=200&text=Phone+Case",
      originalPrice: 1299,
      salePrice: 699,
      discount: 46,
      rating: 4.4,
      reviewCount: 298,
      timeLeft: 64800, // 18 hours
      stock: 100,
      sold: 25,
    },
    {
      id: "5",
      name: "Bluetooth Wireless Speaker",
      brand: "AudioMax",
      image: "/placeholder.svg?height=200&width=200&text=Speaker",
      originalPrice: 4999,
      salePrice: 2499,
      discount: 50,
      rating: 4.6,
      reviewCount: 412,
      timeLeft: 32400, // 9 hours
      stock: 50,
      sold: 10,
    },
  ])

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
  }

  const handleAddToWishlist = (deal: Deal) => {
    addToWishlist({
      id: deal.id,
      productId: deal.id,
      name: deal.name,
      price: deal.salePrice,
      image: deal.image,
    })
  }

  return (
  <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="flex items-start justify-between">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-[36px] font-bold text-[#004AAD] mb-4">Features Products</h2>
            <p className="text-[16px] text-[#333333]-600 mb-8 max-w-[750px]">Discover the latest arrivals in cutting-edge electronics—from sleek smartphones to powerful laptops. Handpicked for performance, style, and value, these new additions are ready to elevate your everyday experience. Be the first to explore what’s trending now.</p>
          </div>

          {/* Button */}
          <button className="hiddle lg:block bg-[#FFCC01] text-white px-6 py-3 rounded-full shadow-lg w-[150px] ">view all</button>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-8">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onAddToCart={() => handleAddToCart(deal)}
              onAddToWishlist={() => handleAddToWishlist(deal)}
              isInWishlist={isInWishlist(deal.id)}
              formatTime={formatTime}
            />
          ))}
        </div>

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
  onAddToCart: () => void
  onAddToWishlist: () => void
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
  const total = deal.stock + deal.sold;
  const percent = total > 0 ? Math.round((deal.sold / total) * 100) : 0;
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
        {/* Rating */}
        <div className="flex items-center mb-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < Math.floor(deal.rating) ? "text-[#FFCC01] fill-[#FFCC01]" : "text-gray-300"}
            />
          ))}
        </div>
        {/* Product Name */}
        <h3 className="font-bold text-[#004AAD] text-lg mb-1">{deal.name}</h3>
        {/* Description */}
        <p className="text-sm text-[#4A6FA1] mb-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
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
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-2 rounded-full bg-[#E0E0E0] overflow-hidden">
            <div
              className="h-2 rounded-full bg-[#004AAD]"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <span className="text-xs text-[#004AAD] font-bold">{percent}% sold</span>
        </div>
      </div>
    </div>
  );
}
