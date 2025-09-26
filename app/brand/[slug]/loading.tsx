import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-inner relative overflow-hidden pt-16">
      {/* ===== Loading State Background Patterns ===== */}
      
      {/* Layer 1: Subtle Noise Texture (Base) */}
      <div className="absolute inset-0 opacity-20">
        <div className="noise-texture-bg w-full h-full"></div>
      </div>
      
      {/* Layer 2: Floating Dots Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="floating-dots-bg w-full h-full"></div>
      </div>
      
      {/* Layer 3: Liquid Blobs Effect with Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="liquid-blobs-bg w-full h-full"></div>
      </div>
      
      {/* Layer 4: Gradient Waves with Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="gradient-waves-bg w-full h-full"></div>
      </div>
      
      {/* Decorative Floating Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Large Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-orange-200 to-amber-200 opacity-10 blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 opacity-15 blur-3xl animate-float-delayed"></div>
        
        {/* Gradient Overlays for Depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/20 via-transparent to-amber-50/20"></div>
      </div>
      {/* ===== End Loading State Background Patterns ===== */}
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-96 mb-6" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}