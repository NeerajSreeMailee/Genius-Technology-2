"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function OfferBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const bannerState = localStorage.getItem("offer-banner-closed")
    if (bannerState === "true") {
      setIsVisible(false)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem("offer-banner-closed", "true")
  }

  if (!isVisible) return null

  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 overflow-hidden">
      <div
        className={`whitespace-nowrap ${isPaused ? "" : "animate-slide-left"}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <span className="inline-block text-sm font-semibold px-4">
          🎉 MEGA SALE! Up to 70% OFF on All Products | Free Shipping Above ₹499 🚚 | Use Code: GENIUS70 for Extra 10%
          OFF | Limited Time Offer! ⏰
        </span>
      </div>

      <button
        onClick={handleClose}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
        aria-label="Close banner"
      >
        <X size={16} className="text-white hover:text-yellow-300" />
      </button>
    </div>
  )
}
