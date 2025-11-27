import { Suspense } from "react"
import dynamic from 'next/dynamic'

// Static imports for above-the-fold content
import { HeroSection } from "@/components/hero-section"

// Dynamic imports for below-the-fold content
const TrendingDeals = dynamic(() => import("@/components/trending-deals"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
})

const ShopByBrand = dynamic(() => import("@/components/shop-by-brand"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />
})

const ShopByCategory = dynamic(() => import("@/components/shop-by-category"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />
})

const CustomerTestimonials = dynamic(() => import("@/components/customer-testimonials"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
})

// Loading skeletons for each component
function HeroSectionSkeleton() {
  return (
    <div className="h-[685px] bg-gray-200 animate-pulse mt-[50px]" />
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
        <TrendingDeals />
      </Suspense>
      
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100" />}>
        <ShopByBrand />
      </Suspense>
      
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100" />}>
        <ShopByCategory />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
        <CustomerTestimonials />
      </Suspense>
    </>
  )
}
