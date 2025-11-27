import { Suspense } from "react"
import dynamic from 'next/dynamic'

// Static imports for above-the-fold content
import { HeroSection } from "@/components/home/hero-section"

// Dynamic imports for below-the-fold content - FIX: Handle named exports
const TrendingDeals = dynamic(
  () => import("@/components/home/trending-deals").then(mod => mod.TrendingDeals),
  { loading: () => <div className="h-96 animate-pulse bg-gray-100" /> }
)

const ShopByBrand = dynamic(
  () => import("@/components/home/shop-by-brand").then(mod => mod.ShopByBrand),
  { loading: () => <div className="h-64 animate-pulse bg-gray-100" /> }
)

const ShopByCategory = dynamic(
  () => import("@/components/home/shop-by-category").then(mod => mod.ShopByCategory),
  { loading: () => <div className="h-64 animate-pulse bg-gray-100" /> }
)

const CustomerTestimonials = dynamic(
  () => import("@/components/home/customer-testimonials").then(mod => mod.CustomerTestimonials),
  { loading: () => <div className="h-96 animate-pulse bg-gray-100" /> }
)

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
