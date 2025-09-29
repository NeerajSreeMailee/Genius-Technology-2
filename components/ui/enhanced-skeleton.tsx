"use client"

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
}

// Mobile-optimized product card skeleton
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Image skeleton */}
        <Skeleton className="h-48 w-full" />
        
        <div className="p-4 space-y-3">
          {/* Title skeleton */}
          <Skeleton className="h-4 w-3/4" />
          
          {/* Price skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          {/* Rating skeleton */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
            <Skeleton className="h-3 w-8 ml-1" />
          </div>
          
          {/* Button skeleton */}
          <Skeleton className="h-9 w-full mt-3" />
        </div>
      </div>
    </div>
  )
}

// Mobile product details skeleton
export function ProductDetailsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pt-24">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center space-x-2 mb-6">
          <Skeleton className="h-4 w-16" />
          <span className="text-gray-400">/</span>
          <Skeleton className="h-4 w-20" />
          <span className="text-gray-400">/</span>
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image gallery skeleton */}
          <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-16 lg:w-12 lg:h-12 rounded-md flex-shrink-0" />
            ))}
          </div>

          {/* Main image skeleton */}
          <div className="lg:col-span-5">
            <Skeleton className="w-full h-[400px] lg:h-[500px] rounded-xl" />
          </div>

          {/* Product details skeleton */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
              {/* Title and brand */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-40" />
              </div>

              {/* Features */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Grid skeleton for product listings
export function GridSkeleton({ 
  columns = 4, 
  rows = 3, 
  className 
}: { 
  columns?: number
  rows?: number
  className?: string 
}) {
  const itemCount = columns * rows

  return (
    <div className={cn(
      "grid gap-6",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 sm:grid-cols-2",
      columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      className
    )}>
      {Array.from({ length: itemCount }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Fast loading skeleton for immediate display
export function FastSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-gray-200 rounded animate-pulse", className)} />
  )
}

// Header skeleton
export function HeaderSkeleton() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-[30px] bg-primary h-[70px] sm:h-[80px] lg:h-[100px]">
        <Skeleton className="w-[100px] h-[60px] sm:w-[120px] sm:h-[72px] lg:w-[150px] lg:h-[90px]" />
        
        <div className="hidden lg:flex items-center space-x-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        
        <Skeleton className="hidden md:block w-96 h-10 rounded-full" />
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="lg:hidden w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

export { Skeleton }