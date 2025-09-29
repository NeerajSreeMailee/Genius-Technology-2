"use client"

import { useState, useEffect } from "react"

// Mobile detection hook
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      const isTouch = 'ontouchstart' in window
      const isSmallScreen = window.innerWidth <= 768
      
      return mobileRegex.test(userAgent.toLowerCase()) || (isTouch && isSmallScreen)
    }

    setIsMobile(checkIfMobile())
    setIsLoading(false)

    const handleResize = () => {
      setIsMobile(checkIfMobile())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { isMobile, isLoading }
}

// Mobile-optimized intersection observer for lazy loading
export function useMobileIntersectionObserver() {
  const [isInView, setIsInView] = useState(false)
  const [ref, setRef] = useState<Element | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        rootMargin: '50px', // Load slightly before entering viewport on mobile
        threshold: 0.1 // Trigger earlier on mobile
      }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref])

  return [setRef, isInView] as const
}

// Debounce function for mobile performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Mobile-optimized image loading
export function getMobileImageProps(src: string, alt: string, isMobile: boolean) {
  return {
    src,
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    ...(isMobile && {
      sizes: '(max-width: 768px) 150px, 200px',
      style: { 
        willChange: 'auto', // Prevent unnecessary compositing layers on mobile
      }
    })
  }
}