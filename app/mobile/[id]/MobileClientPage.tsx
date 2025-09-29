"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useFastMobileCollection } from "@/lib/fast-firebase-hooks"
import { FastImage, ImagePreloader } from "@/components/optimized-image"
import { ProductDetailsSkeleton } from "@/components/ui/enhanced-skeleton"
import dynamic from "next/dynamic"

// Dynamic imports for heavy components
const Header = dynamic(() => import("@/components/header").then(mod => ({ default: mod.Header })), {
  loading: () => <div className="h-20 bg-primary animate-pulse" />,
  ssr: true
})

const Footer = dynamic(() => import("@/components/footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse" />,
  ssr: false // Footer can be loaded after main content
})

interface MobilePageProps {
  mobileId: string
  initialData?: any
}

export default function MobileClientPage({ mobileId, initialData }: MobilePageProps) {
  console.log('MobileClientPage - Mobile ID from props:', mobileId)
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  // Removed quantity state since we're removing the quantity selector

  const { mobile, loading, error } = useFastMobileCollection(mobileId, initialData)
  const { addItem, addToCart } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  // Image preloading effect for better performance
  useEffect(() => {
    if (mobile?.images && mobile.images.length > 0) {
      // Preload all product images
      ImagePreloader.preloadMultiple(mobile.images)
        .catch(error => console.warn('Image preloading failed:', error))
    }
  }, [mobile?.images])

  const handleAddToCart = () => {
    if (mobile) {
      // Add to cart without quantity limit check
      const productName = mobile.name || mobile.Name || mobile.title || mobile.Title || mobile.id || 'Unnamed Product'
      // Use addToCart with quantity of 1 (or any default quantity)
      addToCart(mobile.id, 1, mobile.price || mobile.Price || mobile.salePrice || mobile.SalePrice || 0)
      toast({
        title: "Added to Cart",
        description: `${productName} has been added to your cart.`,
      })
    }
  }

  const handleAddToWishlist = () => {
    if (mobile) {
      const productName = mobile.name || mobile.Name || mobile.title || mobile.Title || mobile.id || 'Unnamed Product'
      const productPrice = mobile.price || mobile.Price || mobile.salePrice || mobile.SalePrice || 0
      const productImage = mobile.images?.[0] || mobile.image || mobile.Image || "/placeholder.svg"
      
      console.log('Adding to wishlist:', {
        id: mobile.id,
        name: productName,
        price: productPrice,
        image: productImage
      })
      
      addToWishlist({
        id: mobile.id,
        productId: mobile.id,
        name: productName,
        price: productPrice,
        image: productImage,
      })
      toast({
        title: isInWishlist(mobile.id) ? "Removed from Wishlist" : "Added to Wishlist",
        description: `${productName} has been ${isInWishlist(mobile.id) ? "removed from" : "added to"} your wishlist.`,
      })
    } else {
      console.error('Cannot add to wishlist: mobile data is null')
      toast({
        title: "Error",
        description: "Unable to add product to wishlist. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <ProductDetailsSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-inner relative overflow-hidden pt-24">
        {/* Mobile-optimized minimal background */}
        <div className="absolute inset-0 opacity-10">
          <div className="noise-texture-bg w-full h-full"></div>
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="liquid-blobs-bg w-full h-full"></div>
        </div>
        
        {/* Layer 7: Organic Flow */}
        <div className="absolute inset-0 opacity-8">
          <div className="organic-flow-bg w-full h-full"></div>
        </div>
        
        {/* Layer 8: Neon Highlights */}
        <div className="absolute inset-0 opacity-5">
          <div className="neon-highlights-bg w-full h-full"></div>
        </div>
        
        {/* Decorative Floating Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Large Floating Orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-orange-200 to-amber-200 opacity-10 blur-3xl animate-float"></div>
          <div className="absolute top-1/3 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 opacity-15 blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-40 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 opacity-8 blur-3xl animate-float-reverse"></div>
          
          {/* Medium Geometric Shapes */}
          <div className="absolute top-10 right-10 w-24 h-24 border-2 border-amber-300 rotate-45 opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-orange-300 rounded-full opacity-15 animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-orange-200 to-amber-200 opacity-15 transform rotate-12"></div>
          
          {/* Small Decorative Elements */}
          <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-gradient-to-r from-amber-300 to-orange-300 opacity-20 transform rotate-45"></div>
          <div className="absolute bottom-1/3 left-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-300 to-amber-300 opacity-20"></div>
          <div className="absolute top-3/4 right-1/3 w-8 h-8 border-2 border-orange-400 opacity-15 transform rotate-30"></div>
          
          {/* Gradient Overlays for Depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/20 via-transparent to-amber-50/20"></div>
        </div>
        {/* ===== End Background Design Patterns ===== */}
        
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center relative">
          <div className="max-w-md mx-auto glass-card backdrop-blur-sm border border-white/20 rounded-xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Product</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white floating-card">
                Go Back Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!mobile && !loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-inner relative overflow-hidden pt-24">
        {/* Mobile-optimized minimal background */}
        <div className="absolute inset-0 opacity-10">
          <div className="noise-texture-bg w-full h-full"></div>
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="liquid-blobs-bg w-full h-full"></div>
        </div>
        
        {/* Layer 7: Organic Flow */}
        <div className="absolute inset-0 opacity-8">
          <div className="organic-flow-bg w-full h-full"></div>
        </div>
        
        {/* Layer 8: Neon Highlights */}
        <div className="absolute inset-0 opacity-5">
          <div className="neon-highlights-bg w-full h-full"></div>
        </div>
        
        {/* Decorative Floating Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Large Floating Orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-orange-200 to-amber-200 opacity-10 blur-3xl animate-float"></div>
          <div className="absolute top-1/3 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 opacity-15 blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-40 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 opacity-8 blur-3xl animate-float-reverse"></div>
          
          {/* Medium Geometric Shapes */}
          <div className="absolute top-10 right-10 w-24 h-24 border-2 border-amber-300 rotate-45 opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-orange-300 rounded-full opacity-15 animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-orange-200 to-amber-200 opacity-15 transform rotate-12"></div>
          
          {/* Small Decorative Elements */}
          <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-gradient-to-r from-amber-300 to-orange-300 opacity-20 transform rotate-45"></div>
          <div className="absolute bottom-1/3 left-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-300 to-amber-300 opacity-20"></div>
          <div className="absolute top-3/4 right-1/3 w-8 h-8 border-2 border-orange-400 opacity-15 transform rotate-30"></div>
          
          {/* Gradient Overlays for Depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/20 via-transparent to-amber-50/20"></div>
        </div>
        {/* ===== End Background Design Patterns ===== */}
        
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center relative">
          <div className="max-w-md mx-auto glass-card backdrop-blur-sm border border-white/20 rounded-xl p-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Product Not Found</h1>
            <p className="text-gray-600 mb-6">
              The mobile device you are looking for does not exist or has been removed.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white floating-card">
                Go Back Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!mobile) {
    return null; // This will only happen during loading
  }

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: mobile.Brand || mobile.Category || mobile.category || "Mobile", href: `/brand/${(mobile.Brand || mobile.Category || mobile.category || '').toLowerCase().replace(/\s+/g, '-')}` },
    { name: mobile.name || mobile.Name || mobile.title || mobile.Title || mobile.id || 'Product', href: `/mobile/${mobile.id}` },
  ]

  // Get images array - handle both single image and array of images with better fallbacks
  const images = (() => {
    if (mobile.images && Array.isArray(mobile.images) && mobile.images.length > 0) {
      return mobile.images
    } else if (mobile.images && !Array.isArray(mobile.images)) {
      return [mobile.images]
    } else if (mobile.image) {
      return [mobile.image]
    } else if (mobile.Image) {
      return [mobile.Image]
    } else if (mobile.photo) {
      return [mobile.photo]
    } else if (mobile.thumbnail) {
      return [mobile.thumbnail]
    }
    return ["/placeholder.svg"]
  })()

  // Calculate prices with better fallbacks
  const salePrice = mobile.price || mobile.Price || mobile.salePrice || mobile.SalePrice || mobile.currentPrice || 0
  const originalPrice = mobile.originalPrice || mobile.OriginalPrice || mobile.mrp || mobile.MRP || mobile.listPrice || (salePrice > 0 ? Math.round(salePrice * 1.4) : 0)
  const discount = originalPrice > salePrice && salePrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-inner relative overflow-hidden pt-24">
      {/* ===== Optimized Modern Background Design Patterns ===== */}
      
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
      
      {/* Layer 5: Polygon Mesh */}
      <div className="absolute inset-0 opacity-3">
        <div className="polygon-mesh-bg w-full h-full"></div>
      </div>
      
      {/* Layer 6: Hexagonal Grid */}
      <div className="absolute inset-0 opacity-4">
        <div className="hex-grid-bg w-full h-full"></div>
      </div>
      
      {/* Layer 7: Organic Flow */}
      <div className="absolute inset-0 opacity-8">
        <div className="organic-flow-bg w-full h-full"></div>
      </div>
      
      {/* Mobile-optimized minimal background */}
      <div className="absolute inset-0 opacity-10">
        <div className="noise-texture-bg w-full h-full"></div>
      </div>
      <div className="absolute inset-0 opacity-5">
        <div className="liquid-blobs-bg w-full h-full"></div>
      </div>
      
      {/* Minimal decorative elements for mobile */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-orange-300 to-amber-400 opacity-10 blur-2xl"></div>
        <div className="absolute bottom-40 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 opacity-10 blur-2xl"></div>
      </div>
      
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 glass-card p-3 rounded-lg backdrop-blur-sm">
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              <Link href={item.href} className={index === breadcrumbs.length - 1 ? "text-gray-900 font-medium" : "hover:text-blue-600"}>
                {item.name}
              </Link>
            </div>
          ))}
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side - Image Gallery */}
          <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2">
            {images.map((image: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-16 h-16 lg:w-12 lg:h-12 border-2 rounded-md overflow-hidden flex-shrink-0 ${
                  idx === selectedImageIndex ? 'border-blue-500' : 'border-gray-200'
                } floating-card transition-all duration-300 hover:shadow-lg`}
              >
                <FastImage 
                  src={image || "/placeholder.svg"} 
                  alt={`${mobile.name || mobile.Name || mobile.title || mobile.Title || mobile.id} ${idx + 1}`} 
                  className="w-full h-full" 
                  width={64}
                  height={64}
                />
              </button>
            ))}
          </div>

          {/* Center - Main Image */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-[400px] lg:h-[500px] bg-gray-50 rounded-xl flex items-center justify-center border floating-card overflow-hidden">
              {/* Decorative element for main image card */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full opacity-20 blur-2xl"></div>
              <FastImage 
                src={images[selectedImageIndex] || "/placeholder.svg"} 
                alt={mobile.name || mobile.Name || mobile.title || mobile.Title || mobile.id || 'Product'} 
                className="w-full h-full p-4" 
                width={400}
                height={400}
              />
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white floating-card backdrop-blur-sm transition-all duration-300"
                  >
                    <ChevronLeft size={20} className="text-orange-600" />
                  </button>
                  <button 
                    onClick={() => setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white floating-card backdrop-blur-sm transition-all duration-300"
                  >
                    <ChevronRight size={20} className="text-orange-600" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Centered Product Details */}
          <div className="lg:col-span-6 flex justify-center">
            {/* Centered Product Details Container */}
            <div className="w-full max-w-2xl">
            {/* Product Title and Pricing */}
            <div className="glass-card p-6 rounded-xl backdrop-blur-sm relative overflow-hidden">
              {/* Decorative element */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-15 blur-xl"></div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {mobile.name || mobile.Name || mobile.title || mobile.Title || mobile.id || 'Unnamed Product'}
              </h1>              
              {/* Brand */}
              {(mobile.Brand || mobile.brand || mobile.Category) && (
                <p className="text-lg text-gray-700 font-semibold mt-2">
                  Brand: <span className="text-orange-600">{mobile.Brand || mobile.brand || mobile.Category}</span>
                </p>
              )}
              
              {/* Model / SKU */}
              {(mobile.model || mobile.Model || mobile.sku || mobile.SKU) && (
                <p className="text-sm text-gray-600 mt-1">
                  Model: {mobile.model || mobile.Model || mobile.sku || mobile.SKU}
                </p>
              )}
              
              {/* Category */}
              {(mobile.category || mobile.Category) && (
                <p className="text-sm text-gray-600 mt-1">
                  Category: {mobile.category || mobile.Category}
                </p>
              )}
              
              {/* Price */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="text-3xl font-bold text-orange-600">₹{salePrice.toLocaleString()}</span>
                {originalPrice > salePrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                    <span className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 rounded-full floating-card">
                      {discount}% Off
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity Selector - REMOVED as per requirements */}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white floating-card transition-all duration-300 transform hover:-translate-y-0.5"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2" size={18} />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleAddToWishlist}
                className="floating-card transition-all duration-300 border-orange-300 hover:bg-orange-50"
              >
                <Heart className={`mr-2 ${isInWishlist(mobile.id) ? "fill-red-500 text-red-500" : "text-orange-500"}`} size={18} />
                {isInWishlist(mobile.id) ? "In Wishlist" : "Add to Wishlist"}
              </Button>
            </div>

            {/* Features */}
            {(mobile.features || mobile.Features) && (mobile.features || mobile.Features).length > 0 && (
              <div className="p-5 rounded-xl">
                <span className="text-lg font-semibold block mb-3">Key Features</span>
                <div className="text-gray-700 bg-white p-4 rounded-lg">
                  <ul className="space-y-2">
                    {(mobile.features || mobile.Features || []).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-orange-500 mt-1 flex-shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Additional Information */}
            {(mobile.warranty || mobile.Warranty || mobile.support || mobile.Support || mobile.weight || mobile.Weight || mobile.dimensions || mobile.Dimensions) && (
              <div className="p-5 rounded-xl">
                <span className="text-lg font-semibold block mb-3">Additional Information</span>
                <div className="text-gray-700 bg-white p-4 rounded-lg">
                  {(mobile.warranty || mobile.Warranty) && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">Warranty:</span>
                      <span>{mobile.warranty || mobile.Warranty}</span>
                    </div>
                  )}
                  {(mobile.weight || mobile.Weight) && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">Weight:</span>
                      <span>{mobile.weight || mobile.Weight}</span>
                    </div>
                  )}
                  {(mobile.dimensions || mobile.Dimensions) && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">Dimensions:</span>
                      <span>{mobile.dimensions || mobile.Dimensions}</span>
                    </div>
                  )}
                  {(mobile.support || mobile.Support) && (
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Support:</span>
                      <span>{mobile.support || mobile.Support}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Specifications */}
            {(mobile.specifications || mobile.Specifications) && Object.keys(mobile.specifications || mobile.Specifications || {}).length > 0 && (
              <div className="floating-card p-5 rounded-xl relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 blur-xl"></div>
                <span className="text-lg font-semibold block mb-3 relative z-10">Specifications</span>
                <div className="text-gray-700 bg-white/50 p-4 rounded-lg backdrop-blur-sm relative z-10">
                  {Object.entries(mobile.specifications || mobile.Specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <span className="font-medium text-gray-600">{key}:</span>
                      <span className="text-gray-800">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </main>
      
      {/* Complete Product Information - Moved to bottom of page */}
      <div className="p-8 rounded-xl mx-auto max-w-4xl text-center mt-12">
        <span className="text-lg font-semibold block mb-3 text-center">Complete Product Information</span>
      
        <div className="text-gray-700 bg-white p-4 rounded-lg">
          {Object.entries(mobile || {}).map(([key, value]) => {
            // Skip certain fields that are already displayed prominently or are internal
            if (['id', 'images', 'specifications', 'features', 'name', 'description', 'price', 'originalPrice', 'rating', 'reviewCount'].includes(key)) {
              return null
            }
            
            // Handle different types of values
            let displayValue = ''
            if (value === null || value === undefined || value === '') {
              return null // Skip empty fields
            } else if (typeof value === 'object') {
              if (Array.isArray(value)) {
                if (value.length === 0) return null // Skip empty arrays
                displayValue = value.join(', ')
              } else if (value instanceof Date) {
                displayValue = value.toLocaleDateString()
              } else {
                try {
                  displayValue = JSON.stringify(value, null, 2)
                } catch {
                  displayValue = '[Object]'
                }
              }
            } else if (typeof value === 'boolean') {
              displayValue = value ? 'Yes' : 'No'
            } else if (typeof value === 'number') {
              displayValue = value.toString()
            } else {
              displayValue = String(value)
            }
            
            // Format field name nicely
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1') // Add space before capital letters
              .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
              .replace(/\b\w/g, str => str.toUpperCase()) // Capitalize each word
            
            return (
              <div key={key} className="flex flex-col py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 w-1/3">
                    {formattedKey}:
                  </span>
                  <span className="text-gray-800 break-words w-2/3 text-right">
                    {displayValue}
                  </span>
                </div>
              </div>
            )
          }).filter(Boolean)}
          
          {/* Show message if no additional fields */}
          {Object.entries(mobile || {}).filter(([key, value]) => 
            !['id', 'images', 'specifications', 'features', 'name', 'description', 'price', 'originalPrice', 'rating', 'reviewCount'].includes(key) &&
            value !== null && value !== undefined && value !== ''
          ).length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No additional product information available
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
