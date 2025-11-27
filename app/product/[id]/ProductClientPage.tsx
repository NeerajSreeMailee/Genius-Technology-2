"use client"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { useState, useEffect } from "react"

import { db } from "@/lib/firebase"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button" // Fixed import path
import { ProductImageGallery } from "@/components/product/gallery/product-image-gallery"
import { ProductInfo } from "@/components/product/details/product-info"
import { ProductTabs } from "@/components/product/details/product-tabs"
import { RecentlyViewedProducts } from "@/components/product/recently-viewed-products"
import { RecommendedProducts } from "@/components/product/recommended-products"
import { RelatedProducts } from "@/components/product/related-products"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import { useComparison } from "@/contexts/comparison-context"
import { ProductComparisonTable } from "@/components/product/product-comparison-table"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductClientPage({ params }: ProductPageProps) {
  const productId = params.id
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const { comparisonProductIds, setComparisonProducts, clearComparison } = useComparison()
  const [comparisonProductsData, setComparisonProductsData] = useState<Product[]>([])
  const { recentlyViewed, addRecentlyViewed } = useRecentlyViewed()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const productRef = doc(db, "products", productId)
        const productSnap = await getDoc(productRef)

        if (!productSnap.exists()) {
          toast({
            title: "Product Not Found",
            description: "The product you are looking for does not exist.",
            variant: "destructive",
          })
          setError("Product not found")
          return
        }

        const fetchedProduct = {
          id: productSnap.id,
          ...productSnap.data(),
          createdAt: productSnap.data().createdAt?.toDate(),
          updatedAt: productSnap.data().updatedAt?.toDate(),
        } as Product
        setProduct(fetchedProduct)
        addRecentlyViewed(fetchedProduct)

        // Fetch related products
        const relatedProductsQuery = query(
          collection(db, "products"),
          where("category", "==", fetchedProduct.category),
          where("id", "!=", fetchedProduct.id),
        )
        const relatedProductsSnap = await getDocs(relatedProductsQuery)
        const fetchedRelatedProducts = relatedProductsSnap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
          }))
          .filter((p) => p.id !== fetchedProduct.id) as Product[]
        setRelatedProducts(fetchedRelatedProducts)
      } catch (err) {
        console.error("Error fetching product data:", err)
        setError("Failed to load product data.")
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [productId, addRecentlyViewed, toast])

  useEffect(() => {
    const fetchComparisonProducts = async () => {
      if (comparisonProductIds.length === 0) {
        setComparisonProductsData([])
        setComparisonProducts([])
        return
      }

      const fetchedProducts: Product[] = []
      for (const id of comparisonProductIds) {
        const productRef = doc(db, "products", id)
        const productSnap = await getDoc(productRef)
        if (productSnap.exists()) {
          fetchedProducts.push({
            id: productSnap.id,
            ...productSnap.data(),
            createdAt: productSnap.data().createdAt?.toDate(),
            updatedAt: productSnap.data().updatedAt?.toDate(),
          } as Product)
        }
      }
      setComparisonProductsData(fetchedProducts)
      setComparisonProducts(fetchedProducts)
    }

    fetchComparisonProducts()
  }, [comparisonProductIds, setComparisonProducts])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="h-96 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl animate-pulse shadow-lg"></div>
            
            {/* Details skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gradient-to-r from-orange-100 to-yellow-100 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded w-1/2 animate-pulse"></div>
              <div className="h-6 bg-gradient-to-r from-orange-100 to-yellow-100 rounded w-1/3 animate-pulse"></div>
              
              {/* Price skeleton */}
              <div className="flex gap-4">
                <div className="h-10 w-32 bg-gradient-to-r from-orange-100 to-yellow-100 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gradient-to-r from-orange-100 to-yellow-100 rounded animate-pulse"></div>
              </div>
              
              {/* Action buttons skeleton */}
              <div className="flex gap-4">
                <div className="h-12 flex-1 bg-gradient-to-r from-orange-100 to-yellow-100 rounded animate-pulse"></div>
                <div className="h-12 w-32 bg-gradient-to-r from-orange-100 to-yellow-100 rounded animate-pulse"></div>
              </div>
              
              {/* Description skeleton */}
              <div className="h-24 bg-gradient-to-r from-orange-100 to-yellow-100 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Tabs skeleton */}
          <div className="mt-12 h-96 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl animate-pulse shadow-lg"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-orange-100">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              The product you are looking for does not exist or has been removed.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: product.category, href: `/products?category=${product.category}` },
    { name: product.name, href: `/product/${product.id}` },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 relative overflow-hidden">
      {/* ===== Background Design Patterns ===== */}
      
      {/* Liquid Blobs Effect as main background pattern */}
      <div className="absolute inset-0 liquid-blobs-bg"></div>
      
      {/* Floating Particles Animation for subtle movement */}
      <div className="absolute inset-0 floating-particles-bg opacity-20"></div>
      
      {/* Radial Glow for depth */}
      <div className="absolute inset-0 radial-glow-bg opacity-30"></div>
      
      {/* ===== Section Design Patterns ===== */}
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Floating Elements with Glass Morphism effect */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 opacity-20 blur-xl glass-card"></div>
        <div className="absolute top-40 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-orange-200 to-yellow-200 opacity-15 blur-xl glass-card"></div>
        
        {/* Geometric Patterns with Gradient Border effect */}
        <div className="absolute top-10 right-10 w-24 h-24 border-2 border-yellow-300 rotate-45 opacity-10 gradient-border"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-orange-300 opacity-15 gradient-border"></div>
        
        {/* Floating Card elements */}
        <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-white rounded-lg opacity-20 floating-card"></div>
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-white rounded-full opacity-15 floating-card"></div>
      </div>
      
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 relative z-10">
        {/* Breadcrumb with Layered Paper effect */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 layered-paper p-4 rounded-lg">
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              <Link href={item.href} className={index === breadcrumbs.length - 1 ? "text-gray-900 font-medium" : "hover:text-blue-600"}>
                {item.name}
              </Link>
            </div>
          ))}
        </nav>

        {/* Main Product Section with Glass Morphism */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side - Image Gallery */}
          <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2">
            {product.images?.map((img, idx) => (
              <button
                key={img}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-16 h-16 lg:w-12 lg:h-12 border-2 rounded-md overflow-hidden flex-shrink-0 transition-all duration-200 glass-card ${
                  idx === selectedImageIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>

          {/* Center - Main Image with Neon Glow effect */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-[400px] lg:h-[500px] bg-gradient-to-br from-white via-orange-50 to-yellow-50 rounded-xl flex items-center justify-center neon-glow-card overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-orange-50 to-white rounded-xl opacity-30"></div>
              <img 
                src={product.images?.[selectedImageIndex] || product.images?.[0]} 
                alt={product.name} 
                className="object-contain w-full h-full p-4 relative z-10" 
              />
              {product.images && product.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : product.images!.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 z-20 floating-card"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedImageIndex(prev => prev < product.images!.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 z-20 floating-card"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Side - Product Details with Glass Morphism */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 glass-card">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-2">{product.name}</h1>              
                {/* Price */}
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-3xl font-bold text-blue-900">₹{product.price?.toLocaleString()}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      <span className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                      </span>
                    </>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={`fill-current ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.rating}) {product.reviewCount} reviews</span>
                </div>
              </div>

              {/* Action Buttons with Floating Card effect */}
              <div className="flex gap-4 mt-6">
                <Button size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-300 floating-card">
                  <ShoppingCart className="mr-2" size={18} />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="border-2 hover:bg-gray-50 transition-all duration-300 floating-card">
                  <Heart className="mr-2" size={18} />
                  Wishlist
                </Button>
              </div>

              {/* Delivery */}
              <div className="mt-6">
                <span className="text-sm font-semibold block mb-2">Delivery</span>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Pincode" 
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200 glass-card"
                  />
                  <Button variant="outline" size="sm" className="border-2 hover:bg-gray-50">Check</Button>
                </div>
              </div>

              {/* Available Offers with Gradient Border */}
              <div className="mt-6">
                <span className="text-sm font-semibold block mb-2">Available Offers</span>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 gradient-border">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span className="text-sm"><span className="font-semibold">No Cost EMI:</span> available on select cards</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 gradient-border">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span className="text-sm"><span className="font-semibold">Bank Offer:</span> 10% off on HDFC Bank cards</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 gradient-border">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span className="text-sm"><span className="font-semibold">Exchange Offer:</span> Get extra ₹5000 off on exchange</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 gradient-border">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span className="text-sm"><span className="font-semibold">Corporate Discounts:</span> Available for bulk purchases</span>
                  </li>
                </ul>
              </div>

              {/* Product Highlights with Layered Paper effect */}
              <div className="mt-6">
                <span className="text-sm font-semibold block mb-2">Product Highlights</span>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 layered-paper">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-sm">6.7" AMOLED Display with 120Hz refresh rate</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 layered-paper">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-sm">Snapdragon 8 Gen 2 Processor</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 layered-paper">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-sm">5000mAh Battery with 67W fast charging</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 layered-paper">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-sm">256GB Storage | 8GB RAM</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Product Tabs with Glass Morphism */}
          <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden glass-card">
            <ProductTabs product={product} />
          </div>

          {/* Product Sections with Floating Card effect */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden floating-card">
              <RelatedProducts products={relatedProducts} />
            </div>
          )}

          <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden floating-card">
            <RecommendedProducts currentProductId={product.id} category={product.category} />
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden floating-card">
            <RecentlyViewedProducts products={recentlyViewed.filter(p => p.id !== product.id)} />
          </div>

          {/* Comparison Table with Neon Glow effect */}
          {comparisonProductIds.length > 0 && (
            <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden neon-glow-card">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Product Comparison ({comparisonProductIds.length} selected)
                  </h2>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={clearComparison} className="border-2 hover:bg-gray-50">
                      Clear All
                    </Button>
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <Link href="/compare">View Full Comparison</Link>
                    </Button>
                  </div>
                </div>
              </div>
              <ProductComparisonTable products={comparisonProductsData} />
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  )
}
