"use client"

import { useEffect } from 'react'

export function MobilePerformanceOptimizer() {
  useEffect(() => {
    // Only run on mobile devices
    if (window.innerWidth >= 768) return

    // Disable smooth scrolling on mobile to improve performance
    document.documentElement.style.scrollBehavior = 'auto'
    
    // Reduce animation duration on mobile
    const style = document.createElement('style')
    style.textContent = `
      @media (max-width: 768px) {
        * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
        
        /* Force hardware acceleration for key elements */
        .floating-card,
        .glass-card,
        .product-card {
          transform: translateZ(0);
          will-change: transform;
        }
        
        /* Optimize scrolling performance */
        .container,
        .main,
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
          overflow-scrolling: touch;
        }
      }
    `
    document.head.appendChild(style)

    // Clean up on unmount
    return () => {
      document.head.removeChild(style)
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return null // This component doesn't render anything
}