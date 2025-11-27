"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import useMobileCollection from "@/lib/firebase-hooks"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface MobilePageProps {
  mobileId: string
}

export default function MobileClientPage({ mobileId }: MobilePageProps) {
  console.log('MobileClientPage - Mobile ID from props:', mobileId)
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const { mobile, loading, error } = useMobileCollection(mobileId)
  const { addItem, addToCart } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (mobile) {
      const productName = mobile.name || mobile.Name || mobile.title || mobile.Title || mobile.id || 'Unnamed Product'
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
        <main className="flex-1 container mx-auto px-4 py-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-white/30 rounded-xl glass-card backdrop-blur-sm border border-white/20 animate-pulse"></div>
            <div className="space-y-6">
              <div className="h-8 bg-white/30 rounded w-3/4 glass-card backdrop-blur-sm border border-white/20 animate-pulse"></div>
              <div className="h-4 bg-white/30 rounded w-1/2 glass-card backdrop-blur-sm border border-white/20 animate-pulse"></div>
              <div className="h-6 bg-white/30 rounded w-1/3 glass-card backdrop-blur-sm border border-white/20 animate-pulse"></div>
              <div className="h-24 bg-white/30 rounded glass-card backdrop-blur-sm border border-white/20 animate-pulse"></div>
              <div className="h-12 bg-white/30 rounded glass-card backdrop-blur-sm border border-white/20 animate-pulse"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
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
    return null;
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

        {/* Main Product Section - Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Product Images */}
          <div className="flex flex-col">
            {/* Main Image */}
            <div className="relative w-full h-[500px] bg-gray-50 rounded-xl flex items-center justify-center border floating-card overflow-hidden mb-6">
              {/* Decorative element for main image card */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full opacity-20 blur-2xl"></div>
              <img 
                src={images[selectedImageIndex] || "/placeholder.svg"} 
                alt={mobile.name || mobile.Name || mobile.title || mobile.Title || mobile.id || 'Product'} 
                className="object-contain w-full h-full p-6" 
              />
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 border border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-white floating-card backdrop-blur-sm transition-all duration-300"
                  >
                    <ChevronLeft size={24} className="text-orange-600" />
                  </button>
                  <button 
                    onClick={() => setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 border border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-white floating-card backdrop-blur-sm transition-all duration-300"
                  >
                    <ChevronRight size={24} className="text-orange-600" />
                  </button>
                </>
              )}
            </div>

            {/* Image Gallery Thumbnails */}
            <div className="flex flex-row gap-3 overflow-x-auto pb-2">
              {images.map((image: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 border-2 rounded-md overflow-hidden flex-shrink-0 ${
                    idx === selectedImageIndex ? 'border-blue-500' : 'border-gray-200'
                  } floating-card transition-all duration-300 hover:shadow-lg`}
                >
                  <img src={image || "/placeholder.svg"} alt={`${mobile.name || mobile.Name || mobile.title || mobile.Title || mobile.id} ${idx + 1}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Centered Product Details */}
          <div className="flex flex-col justify-center">
            {/* Combined Hero Section with Key Highlights */}
            <div className="glass-card p-6 rounded-xl backdrop-blur-sm relative overflow-hidden mb-6">
              {/* Decorative element */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-15 blur-xl"></div>
              
              {/* Product Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                {mobile.name || mobile.Name || mobile.title || mobile.Title || mobile.id || 'Unnamed Product'}
              </h1>              
              
              {/* Brand */}
              {(mobile.Brand || mobile.brand || mobile.Category) && (
                <p className="text-lg text-gray-700 font-semibold mb-1 text-center">
                  Brand: <span className="text-orange-600">{mobile.Brand || mobile.brand || mobile.Category}</span>
                </p>
              )}
              
              {/* Model / SKU */}
              {(mobile.model || mobile.Model || mobile.sku || mobile.SKU) && (
                <p className="text-base text-gray-600 mb-1 text-center">
                  Model: {mobile.model || mobile.Model || mobile.sku || mobile.SKU}
                </p>
              )}
              
              {/* Category */}
              {(mobile.category || mobile.Category) && (
                <p className="text-base text-gray-600 mb-4 text-center">
                  Category: {mobile.category || mobile.Category}
                </p>
              )}
              
              {/* Price */}
              <div className="flex flex-wrap items-center justify-center gap-4 my-4">
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

              {/* Hero Content */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700 mb-4 text-center">
                  Restore your phone's screen quality with the premium {mobile.name || mobile.Name || mobile.title || mobile.Title || 'Product'}, designed to perform like the original. 
                  Enjoy high brightness, crystal-clear pixels, and smooth touch response — trusted by technicians nationwide.
                </p>
                
                {/* Key Highlights */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  {[
                    "Performs as Original",
                    "Superfine Display Pixel",
                    "High Brightness Screen",
                    "Smooth Touch Response"
                  ].map((highlight, index) => (
                    <div key={index} className="flex items-center justify-center">
                      <span className="text-orange-500 mr-2">•</span>
                      <span className="text-sm text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 justify-center">
                  <Button 
                    size="lg" 
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white floating-card transition-all duration-300 transform hover:-translate-y-0.5"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2" size={18} />
                    Add to Cart
                  </Button>
                  <div className="flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-green-600 font-medium">Free Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections - Full width */}
        <div className="w-full mt-12">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <Button 
              size="lg" 
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white floating-card transition-all duration-300 transform hover:-translate-y-0.5 max-w-xs"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2" size={18} />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleAddToWishlist}
              className="floating-card transition-all duration-300 border-orange-300 hover:bg-orange-50 max-w-xs"
            >
              <Heart className={`mr-2 ${isInWishlist(mobile.id) ? "fill-red-500 text-red-500" : "text-orange-500"}`} size={18} />
              {isInWishlist(mobile.id) ? "In Wishlist" : "Add to Wishlist"}
            </Button>
          </div>

          {/* Features */}
          {(mobile.features || mobile.Features) && (mobile.features || mobile.Features).length > 0 && (
            <div className="p-5 rounded-xl mb-6 bg-white/80 backdrop-blur-sm border border-gray-200">
              <span className="text-lg font-semibold block mb-3 text-center">Key Features</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mx-auto">
                {(mobile.features || mobile.Features || []).map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 py-2">
                    <span className="text-orange-500 mt-1 flex-shrink-0">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(mobile.warranty || mobile.Warranty || mobile.support || mobile.Support || mobile.weight || mobile.Weight || mobile.dimensions || mobile.Dimensions) && (
            <div className="p-5 rounded-xl mb-6 bg-white/80 backdrop-blur-sm border border-gray-200">
              <span className="text-lg font-semibold block mb-3 text-center">Additional Information</span>
              <div className="space-y-2 max-w-4xl mx-auto">
                {(mobile.warranty || mobile.Warranty) && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-sm">Warranty:</span>
                    <span className="text-sm">{mobile.warranty || mobile.Warranty}</span>
                  </div>
                )}
                {(mobile.weight || mobile.Weight) && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-sm">Weight:</span>
                    <span className="text-sm">{mobile.weight || mobile.Weight}</span>
                  </div>
                )}
                {(mobile.dimensions || mobile.Dimensions) && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-sm">Dimensions:</span>
                    <span className="text-sm">{mobile.dimensions || mobile.Dimensions}</span>
                  </div>
                )}
                {(mobile.support || mobile.Support) && (
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-sm">Support:</span>
                    <span className="text-sm">{mobile.support || mobile.Support}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Specifications */}
          {(mobile.specifications || mobile.Specifications) && Object.keys(mobile.specifications || mobile.Specifications || {}).length > 0 && (
            <div className="floating-card p-5 rounded-xl relative overflow-hidden mb-6 bg-white/80 backdrop-blur-sm border border-gray-200">
              {/* Decorative element */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 blur-xl"></div>
              <span className="text-lg font-semibold block mb-3 relative z-10 text-center">Specifications</span>
              <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 max-w-4xl mx-auto">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(mobile.specifications || mobile.Specifications || {}).map(([key, value]) => (
                        <tr key={key} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {key}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 break-words">
                            {String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* About the Product */}
          <div className="p-6 rounded-xl mt-8 mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 w-full">
            <h3 className="text-2xl font-semibold block mb-6 text-center">About the {mobile.name || mobile.Name || mobile.title || mobile.Title || 'Product'}</h3>
            <div className="text-gray-700 max-w-4xl mx-auto">
              <p className="mb-4 text-lg">
                The <span className="font-semibold">{mobile.name || mobile.Name || mobile.title || mobile.Title || 'Product'}</span> is a premium mobile spare part designed to restore your device's functionality and performance. Engineered with precision and built to last, this product ensures seamless integration with your device, providing an experience that closely mirrors the original equipment.
              </p>
              <p className="text-lg">
                Whether you're a professional technician or a DIY enthusiast, the <span className="font-semibold">{mobile.name || mobile.Name || mobile.title || mobile.Title || 'Product'}</span> offers the reliability and quality you need for successful mobile repairs.
              </p>
            </div>
          </div>

          {/* Superior Craftsmanship */}
          <div className="p-6 rounded-xl mt-8 mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 w-full">
            <h3 className="text-2xl font-semibold block mb-6 text-center">Superior Craftsmanship</h3>
            <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-4xl mx-auto">
              <p className="text-gray-700 mb-4 text-lg">The <span className="font-semibold">{mobile.name || mobile.Name || mobile.title || mobile.Title || 'Product'}</span> is:</p>
              <ul className="list-disc list-inside space-y-3 mt-2 text-lg">
                <li className="text-gray-700">Built with high-grade materials for long life</li>
                <li className="text-gray-700">Compatible with original fit & size</li>
                <li className="text-gray-700">Designed for easy installation to save repair time</li>
              </ul>
            </div>
          </div>

          {/* Why Choose GENIUS */}
          <div className="p-6 rounded-xl mt-8 mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 w-full">
            <h3 className="text-2xl font-semibold block mb-6 text-center">Why Choose GENIUS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {[
                "National Distribution Network since 2005",
                "Quality Products in Catalogue",
                "Free Shipping + Safe Packaging",
                "Quality Tested & Technician Trusted"
              ].map((item, index) => (
                <div key={index} className="flex items-center p-4 bg-orange-50 rounded-lg">
                  <span className="text-orange-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-800 text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Trust & Quality Assurance */}
          <div className="p-6 rounded-xl mt-8 mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 w-full">
            <h3 className="text-2xl font-semibold block mb-6 text-center">Customer Trust & Quality Assurance</h3>
            <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">
              <p className="text-gray-700 mb-6 text-lg">
                Each product undergoes strict quality testing before dispatch. With Genius, you can confidently offer your customers:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold text-gray-900 text-xl mb-2">Assured Performance</h4>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold text-gray-900 text-xl mb-2">Long-lasting Durability</h4>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <h4 className="font-semibold text-gray-900 text-xl mb-2">Quick Replacement Support</h4>
                </div>
              </div>
            </div>
          </div>

          {/* GENIUS Guarantee */}
          <div className="p-6 rounded-xl mt-8 mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 w-full">
            <h3 className="text-2xl font-semibold block mb-6 text-center">GENIUS Guarantee</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: "🔒", title: "Secure Payments", description: "100% payment protection" },
                { icon: "🔄", title: "Replacement Policy", description: "Within 3 Days of Delivery (No Refund, Replacement Only)" },
                { icon: "📦", title: "Free Shipping", description: "Across India" },
                { icon: "🛠", title: "Trusted Quality", description: "Tested Before Dispatch" }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Product Information */}
          <div className="p-6 rounded-xl mt-8 mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 w-full">
            <span className="text-2xl font-semibold block mb-6 text-center">Complete Product Information</span>
          
            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 max-w-6xl mx-auto">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
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
                        <tr key={key} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formattedKey}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 break-words">
                            {displayValue}
                          </td>
                        </tr>
                      )
                    }).filter(Boolean)}
                    
                    {/* Show message if no additional fields */}
                    {Object.entries(mobile || {}).filter(([key, value]) => 
                      !['id', 'images', 'specifications', 'features', 'name', 'description', 'price', 'originalPrice', 'rating', 'reviewCount'].includes(key) &&
                      value !== null && value !== undefined && value !== ''
                    ).length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                          No additional product information available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="glass-card p-8 rounded-xl backdrop-blur-sm relative overflow-hidden mt-8 mb-8 w-full">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-15 blur-xl"></div>
            <h3 className="text-2xl font-semibold block mb-6 text-center">Upgrade your repairs with the <span className="font-semibold">{mobile.name || mobile.Name || mobile.title || mobile.Title || 'Product'}</span> today.</h3>
            <div className="flex flex-wrap gap-6 justify-center max-w-2xl mx-auto">
              <Button 
                size="lg" 
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white floating-card transition-all duration-300 transform hover:-translate-y-0.5"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2" size={20} />
                Order Now
              </Button>
              <div className="flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-green-600 font-medium text-lg">Free Shipping</span>
              </div>
            </div>
            <p className="text-center mt-6 text-gray-700 text-lg">
              <span className="font-semibold">Genius Technology</span> – Empowering Mobile Repairs Since 2005
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}