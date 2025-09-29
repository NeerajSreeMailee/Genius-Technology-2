"use client"

import React, { useState, useEffect } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { ComparisonProvider } from "@/contexts/comparison-context"
import { Toaster } from "@/components/ui/toaster"
import { BackgroundPatterns } from "@/components/background-patterns"
import { MobilePerformanceOptimizer } from "@/components/mobile-performance-optimizer"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { useInstantNavigation } from "@/lib/instant-navigation"

interface LayoutClientProps {
  children: React.ReactNode
}

export function LayoutClient({ children }: LayoutClientProps) {
  const [isMobile, setIsMobile] = useState(false)
  const { initialize } = useInstantNavigation()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Initialize instant navigation
    initialize()
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      <PerformanceMonitor />
      <MobilePerformanceOptimizer />
      <BackgroundPatterns variant={isMobile ? "mobile" : "default"} />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ComparisonProvider>
              {children}
              <Toaster />
            </ComparisonProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </>
  )
}