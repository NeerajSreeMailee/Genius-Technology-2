"use client"

import { useEffect } from 'react'

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in development or when performance monitoring is needed
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      
      // Track page load performance
      const measurePageLoad = () => {
        if ('performance' in window && 'getEntriesByType' in performance) {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          
          if (navigation) {
            console.log('📊 Page Load Performance:')
            console.log(`• DNS Lookup: ${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`)
            console.log(`• TCP Connection: ${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`)
            console.log(`• Request: ${(navigation.responseStart - navigation.requestStart).toFixed(2)}ms`)
            console.log(`• Response: ${(navigation.responseEnd - navigation.responseStart).toFixed(2)}ms`)
            console.log(`• DOM Processing: ${(navigation.domContentLoadedEventEnd - navigation.responseEnd).toFixed(2)}ms`)
            console.log(`• Total Load Time: ${(navigation.loadEventEnd - navigation.fetchStart).toFixed(2)}ms`)
            console.log(`• First Contentful Paint: ${navigation.loadEventEnd ? 'Completed' : 'In Progress'}`)
          }
        }
      }

      // Track resource loading
      const measureResources = () => {
        if ('performance' in window && 'getEntriesByType' in performance) {
          const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
          
          const imageResources = resources.filter(resource => 
            resource.initiatorType === 'img' || 
            resource.name.includes('.jpg') || 
            resource.name.includes('.png') || 
            resource.name.includes('.webp')
          )
          
          const slowImages = imageResources.filter(img => img.duration > 500)
          
          if (slowImages.length > 0) {
            console.warn('🐌 Slow loading images detected:')
            slowImages.forEach(img => {
              console.warn(`• ${img.name}: ${img.duration.toFixed(2)}ms`)
            })
          }
        }
      }

      // Measure Core Web Vitals
      const measureCoreWebVitals = () => {
        if ('web-vital' in window) {
          // This would integrate with a proper web vitals library
          // For now, we'll do basic performance tracking
          console.log('🎯 Core Web Vitals monitoring enabled')
        }
      }

      // Track mobile-specific performance
      const measureMobilePerformance = () => {
        if (window.innerWidth < 768) {
          const paintEntries = performance.getEntriesByType('paint')
          paintEntries.forEach(entry => {
            console.log(`📱 Mobile ${entry.name}: ${entry.startTime.toFixed(2)}ms`)
          })
        }
      }

      // Run measurements
      setTimeout(() => {
        measurePageLoad()
        measureResources()
        measureCoreWebVitals()
        measureMobilePerformance()
      }, 1000)

      // Monitor FPS for mobile devices
      let frameCount = 0
      let lastTime = performance.now()
      
      const measureFPS = () => {
        frameCount++
        const currentTime = performance.now()
        
        if (currentTime >= lastTime + 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
          
          if (window.innerWidth < 768 && fps < 30) {
            console.warn(`📱 Low FPS detected on mobile: ${fps}fps`)
          }
          
          frameCount = 0
          lastTime = currentTime
        }
        
        requestAnimationFrame(measureFPS)
      }
      
      requestAnimationFrame(measureFPS)

      // Track memory usage on mobile
      const trackMemoryUsage = () => {
        if ('memory' in performance && window.innerWidth < 768) {
          const memory = (performance as any).memory
          if (memory) {
            const usedMB = Math.round(memory.usedJSHeapSize / 1048576)
            const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576)
            
            if (usedMB > limitMB * 0.8) {
              console.warn(`📱 High memory usage on mobile: ${usedMB}MB / ${limitMB}MB`)
            }
          }
        }
      }

      const memoryInterval = setInterval(trackMemoryUsage, 5000)
      
      return () => {
        clearInterval(memoryInterval)
      }
    }
  }, [])

  return null // This component doesn't render anything
}

// Utility to log loading performance
export const logLoadingTime = (label: string, startTime: number) => {
  const endTime = performance.now()
  const loadTime = endTime - startTime
  
  if (loadTime > 100) {
    console.warn(`⏱️ Slow loading detected - ${label}: ${loadTime.toFixed(2)}ms`)
  } else {
    console.log(`✅ Fast loading - ${label}: ${loadTime.toFixed(2)}ms`)
  }
  
  return loadTime
}