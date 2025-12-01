import { Suspense } from "react"
import dynamic from 'next/dynamic'

// Static imports for above-the-fold content
import { HeroSection } from "@/components/home/hero-section"

import { TrendingDealsContainer } from "@/components/home/trending-deals-container"

import { ShopByBrandContainer } from "@/components/home/shop-by-brand-container"
import { ShopByBrandSkeleton } from "@/components/home/shop-by-brand"

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
        <TrendingDealsContainer />
      </Suspense>

      <Suspense fallback={<ShopByBrandSkeleton />}>
        <ShopByBrandContainer />
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
