"use client"

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  useNaturalDimensions?: boolean
  maxWidth?: number
  maxHeight?: number
  loading?: 'lazy' | 'eager'
  quality?: number
}

// Instant image cache for immediate display
class InstantImageCache {
  private static cache = new Map<string, string>()
  private static preloadQueue = new Set<string>()
  
  static get(src: string): string | null {
    return this.cache.get(src) || null
  }
  
  static set(src: string, optimizedSrc: string): void {
    this.cache.set(src, optimizedSrc)
  }
  
  static preload(src: string): void {
    if (this.preloadQueue.has(src) || this.cache.has(src)) return
    
    this.preloadQueue.add(src)
    
    // Use intersection observer for smart preloading
    const img = new window.Image()
    img.onload = () => {
      this.cache.set(src, src)
      this.preloadQueue.delete(src)
    }
    img.onerror = () => {
      this.preloadQueue.delete(src)
    }
    img.src = src
  }
  
  static preloadMultiple(srcs: string[]): void {
    // Limit concurrent preloads to avoid overwhelming the browser
    const batchSize = 3
    let index = 0
    
    const loadBatch = () => {
      const batch = srcs.slice(index, index + batchSize)
      batch.forEach(src => this.preload(src))
      index += batchSize
      
      if (index < srcs.length) {
        setTimeout(loadBatch, 100) // Stagger preloading
      }
    }
    
    loadBatch()
  }
}

export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 400,
  className = '',
  priority = false,
  useNaturalDimensions = false,
  maxWidth,
  maxHeight,
  loading = 'lazy',
  quality = 85
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  // Use placeholder for invalid URLs
  const imageSrc = imageError || !src || src.includes('gs://') 
    ? '/placeholder.svg' 
    : src

  // Instant loading check
  const cachedSrc = InstantImageCache.get(imageSrc)
  const isInstantLoad = !!cachedSrc

  useEffect(() => {
    if (isInstantLoad) {
      setIsLoading(false)
    }
  }, [isInstantLoad])

  if (useNaturalDimensions) {
    return (
      <div className={`relative ${className}`} style={{ maxWidth, maxHeight }}>
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          className="w-auto h-auto max-w-full max-h-full object-contain"
          onError={() => setImageError(true)}
          onLoad={() => {
            setIsLoading(false)
            InstantImageCache.set(src, imageSrc)
          }}
          loading={priority ? 'eager' : loading}
          style={{ maxWidth, maxHeight }}
          fetchPriority={priority ? 'high' : 'auto'}
        />
        {isLoading && !isInstantLoad && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-contain"
        priority={priority}
        onError={() => setImageError(true)}
        onLoad={() => {
          setIsLoading(false)
          InstantImageCache.set(src, imageSrc)
        }}
        loading={priority ? undefined : loading}
        quality={quality}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHw/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAhEQACAQIHAQAAAAAAAAAAAAABAgADBBEFITFBUYGhkf/aAAwDAQACEQMRAD8A0XqTjGJMZXNe8ATt1vrW3P7B4"
      />
      {isLoading && !isInstantLoad && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
    </div>
  )
}

// Ultra-fast image for immediate display
export function FastImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
}) {
  const [imageError, setImageError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const imageSrc = imageError || !src || src.includes('gs://') 
    ? '/placeholder.svg' 
    : src

  // Check if image is already cached
  const isInstantLoad = !!InstantImageCache.get(imageSrc)

  useEffect(() => {
    if (isInstantLoad) {
      setIsLoaded(true)
    }
  }, [isInstantLoad])

  return (
    <div className="relative">
      <img
        src={imageSrc}
        alt={alt}
        className={`object-contain transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        width={width}
        height={height}
        onError={() => setImageError(true)}
        onLoad={() => {
          setIsLoaded(true)
          InstantImageCache.set(src, imageSrc)
        }}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        style={{ width, height }}
      />
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
    </div>
  )
}

// Smart image preloader with priority management
export class ImagePreloader {
  private static priorityQueue: string[] = []
  private static lowPriorityQueue: string[] = []
  private static isProcessing = false
  
  static preload(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (InstantImageCache.get(src)) {
        resolve()
        return
      }

      const queue = priority === 'high' ? this.priorityQueue : this.lowPriorityQueue
      queue.push(src)
      
      this.processQueue()
      
      const img = new window.Image()
      img.onload = () => {
        InstantImageCache.set(src, src)
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }

  static preloadMultiple(srcs: string[], priority: 'high' | 'low' = 'low'): Promise<void[]> {
    // Use InstantImageCache for batch preloading
    InstantImageCache.preloadMultiple(srcs)
    
    return Promise.all(srcs.map(src => this.preload(src, priority)))
  }
  
  private static processQueue(): void {
    if (this.isProcessing) return
    
    this.isProcessing = true
    
    const processNext = () => {
      const nextSrc = this.priorityQueue.shift() || this.lowPriorityQueue.shift()
      
      if (nextSrc) {
        setTimeout(processNext, 50) // Throttle preloading
      } else {
        this.isProcessing = false
      }
    }
    
    processNext()
  }
  
  // Preload images in viewport
  static preloadInViewport(): void {
    if (typeof window === 'undefined') return
    
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.src
          if (src) {
            this.preload(src, 'high')
            imageObserver.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '50px' // Start loading 50px before the image enters viewport
    })
    
    images.forEach(img => imageObserver.observe(img))
  }
}