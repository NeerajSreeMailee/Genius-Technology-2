import { Suspense, lazy } from "react"
import { OfferBanner } from "@/components/offer-banner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"

// Lazy load components that are below the fold
const TrendingDeals = lazy(() => import("@/components/trending-deals").then(module => ({ default: module.TrendingDeals })))
const ShopByBrand = lazy(() => import("@/components/shop-by-brand").then(module => ({ default: module.ShopByBrand })))
const ShopByCategory = lazy(() => import("@/components/shop-by-category").then(module => ({ default: module.ShopByCategory })))
const CustomerTestimonials = lazy(() => import("@/components/customer-testimonials").then(module => ({ default: module.CustomerTestimonials })))

// Loading component for Suspense fallbacks
function ComponentLoader({ height = "400px" }: { height?: string }) {
  return (
    <div className="flex justify-center items-center" style={{ height }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004AAD]"></div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <OfferBanner />
      <Header />
      <main>
        <HeroSection />
        
        <Suspense fallback={<ComponentLoader height="600px" />}>
          <TrendingDeals />
        </Suspense>
        
        <Suspense fallback={<ComponentLoader height="400px" />}>
          <ShopByBrand />
        </Suspense>
        
        <Suspense fallback={<ComponentLoader height="400px" />}>
          <ShopByCategory />
        </Suspense>
        
        <Suspense fallback={<ComponentLoader height="300px" />}>
          <CustomerTestimonials />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}