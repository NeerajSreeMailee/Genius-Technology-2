"use client"

import { useEffect } from "react"

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  cls: number | null // Cumulative Layout Shift
  fid: number | null // First Input Delay
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run performance monitoring in development or when needed
    if (process.env.NODE_ENV !== 'production') {
      const metrics: PerformanceMetrics = {
        fcp: null,
        lcp: null,
        cls: null,
        fid: null
      }

      // Measure First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime
            console.log('🎨 First Contentful Paint:', entry.startTime.toFixed(2), 'ms')
          }
        }
      })
      
      try {
        observer.observe({ entryTypes: ['paint'] })
      } catch (e) {
        console.warn('Performance Observer not supported')
      }

      // Measure Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        metrics.lcp = lastEntry.startTime
        console.log('🖼️ Largest Contentful Paint:', lastEntry.startTime.toFixed(2), 'ms')
      })

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.warn('LCP Observer not supported')
      }

      // Measure Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        metrics.cls = clsValue
        console.log('📐 Cumulative Layout Shift:', clsValue.toFixed(4))
      })

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('CLS Observer not supported')
      }

      // Log overall performance after page load
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        console.log('📊 Mobile Performance Summary:')
        console.log('- DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms')
        console.log('- Page Load Complete:', navigation.loadEventEnd - navigation.loadEventStart, 'ms')
        console.log('- First Contentful Paint:', metrics.fcp ? metrics.fcp.toFixed(2) + ' ms' : 'Not measured')
        console.log('- Largest Contentful Paint:', metrics.lcp ? metrics.lcp.toFixed(2) + ' ms' : 'Not measured')
        console.log('- Cumulative Layout Shift:', metrics.cls ? metrics.cls.toFixed(4) : 'Not measured')
        
        // Mobile-specific metrics
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())
        console.log('- Device Type:', isMobile ? 'Mobile' : 'Desktop')
        console.log('- Connection:', (navigator as any).connection ? (navigator as any).connection.effectiveType : 'Unknown')
        console.log('- Memory:', (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) + ' MB' : 'Unknown')
      }, 3000)

      return () => {
        observer.disconnect()
        lcpObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  return null // This component doesn't render anything
}

// Export for production build optimization
export function OptimizedPerformanceMonitor() {
  // In production, only return null to avoid any performance overhead
  if (process.env.NODE_ENV === 'production') {
    return null
  }
  
  return <PerformanceMonitor />
}