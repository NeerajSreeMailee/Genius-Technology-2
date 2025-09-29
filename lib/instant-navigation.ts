"use client"

// NavigationPreloader for background data preloading
export class NavigationPreloader {
  private static instance: NavigationPreloader
  private preloadQueue: Set<string> = new Set()
  private isPreloading = false

  static getInstance(): NavigationPreloader {
    if (!NavigationPreloader.instance) {
      NavigationPreloader.instance = new NavigationPreloader()
    }
    return NavigationPreloader.instance
  }

  // Preload product data
  async preloadProduct(productId: string): Promise<void> {
    const dataKey = `product_${productId}`
    
    if (this.preloadQueue.has(dataKey)) return
    this.preloadQueue.add(dataKey)
    
    try {
      const { getmobileCollection } = await import('./firebase-collections')
      await getmobileCollection(productId)
    } catch (error) {
      console.warn(`Failed to preload product ${productId}:`, error)
    } finally {
      this.preloadQueue.delete(dataKey)
    }
  }

  // Preload category data
  async preloadCategory(category: string): Promise<void> {
    const dataKey = `category_${category}`
    
    if (this.preloadQueue.has(dataKey)) return
    this.preloadQueue.add(dataKey)
    
    try {
      const { getMobileCollectionByCategory } = await import('./firebase-collections')
      await getMobileCollectionByCategory(category)
    } catch (error) {
      console.warn(`Failed to preload category ${category}:`, error)
    } finally {
      this.preloadQueue.delete(dataKey)
    }
  }

  // Handle link hover for preloading
  handleLinkHover(href: string): void {
    try {
      const url = new URL(href, window.location.origin)
      const pathSegments = url.pathname.split('/').filter(Boolean)

      // Handle mobile product pages
      if (pathSegments[0] === 'mobile' && pathSegments[1]) {
        this.preloadProduct(pathSegments[1])
      }

      // Handle category pages
      if (pathSegments[0] === 'category' && pathSegments[1]) {
        this.preloadCategory(pathSegments[1])
      }

      // Handle products by category
      if (pathSegments[0] === 'products' && pathSegments[1]) {
        this.preloadCategory(pathSegments[1])
      }
    } catch (error) {
      // Invalid URL, ignore
    }
  }

  // Smart preloading based on user behavior
  setupHoverPreloading(): void {
    if (typeof window === 'undefined') return

    // Preload on link hover
    document.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement
      
      if (link && link.href) {
        this.handleLinkHover(link.href)
      }
    })

    // Preload on touch start (mobile)
    document.addEventListener('touchstart', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement
      
      if (link && link.href) {
        this.handleLinkHover(link.href)
      }
    }, { passive: true })
  }

  // Initialize preloading system
  initialize(): void {
    this.setupHoverPreloading()
  }
}

// Hook for instant navigation
export function useInstantNavigation() {
  const preloader = NavigationPreloader.getInstance()
  
  return {
    preloadProduct: (id: string) => preloader.preloadProduct(id),
    preloadCategory: (category: string) => preloader.preloadCategory(category),
    initialize: () => preloader.initialize()
  }
}