"use client"

import { useState, useEffect } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { useMobileCollectionByCategory, useAllMobileCollectionItems } from "@/lib/firebase-hooks"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackgroundPatterns } from "@/components/background-patterns"

interface CategoryClientPageProps {
  params: {
    category: string
  }
}

export default function CategoryClientPage({ params }: CategoryClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])

  // Capitalize the category to match Firebase field values (Display, Battery)
  const categoryForQuery = params.category.charAt(0).toUpperCase() + params.category.slice(1)
  
  const { mobiles, loading, error } = useMobileCollectionByCategory(categoryForQuery)
  
  // Debug: fetch all items to see what's available
  const { mobiles: allMobiles } = useAllMobileCollectionItems()
  
  useEffect(() => {
    console.log('CategoryClientPage - Category param:', params.category)
    console.log('CategoryClientPage - Category for query:', categoryForQuery)
    console.log('CategoryClientPage - All mobiles:', allMobiles?.length || 0)
    console.log('CategoryClientPage - Filtered mobiles:', mobiles?.length || 0)
    if (allMobiles?.length > 0) {
      console.log('Available categories in data:', [...new Set(allMobiles.map(item => item.Category))])
    }
  }, [params.category, categoryForQuery, allMobiles, mobiles])

  // Filter and sort products
  useEffect(() => {
    if (mobiles.length > 0) {
      let filtered = mobiles

      // Apply search filter - check common field names and document ID
      if (searchQuery) {
        filtered = filtered.filter(product =>
          product.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.Brand?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return (a.price || a.Price || 0) - (b.price || b.Price || 0)
          case "price-high":
            return (b.price || b.Price || 0) - (a.price || a.Price || 0)
          case "name":
            const aName = a.id || a.title || a.Title || a.name || a.Name || ""
            const bName = b.id || b.title || b.Title || b.name || b.Name || ""
            return aName.localeCompare(bName)
          case "newest":
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          default:
            return 0
        }
      })

      setFilteredProducts(filtered)
    }
  }, [mobiles, searchQuery, sortBy])

  const categoryName = params.category.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: categoryName, href: `/products/${params.category}` },
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 relative overflow-hidden">
        <BackgroundPatterns variant="minimal" />
        <div className="mb-8 relative z-10">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full glass-card" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 relative overflow-hidden">
        <BackgroundPatterns variant="minimal" />
        <div className="text-center relative z-10">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
    <Header />
    <div className="container mx-auto px-4 py-8 pt-32 relative overflow-hidden">
      <BackgroundPatterns />
      <div className="mb-8 relative z-10 glass-card p-6 rounded-xl">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName} Products</h1>
        <p className="text-gray-600">
          Discover our collection of {categoryName.toLowerCase()} products ({filteredProducts.length} items)
        </p>
      </div>

      {/* Filter and Search Bar with Gradient Border */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between gradient-border rounded-xl p-4 bg-white relative z-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">Sort by:</span>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 glass-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid with Floating Card Effect */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 relative z-10">
          <div className="neon-glow-card rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? "No products found" : "No products available"}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `No products match your search "${searchQuery}" in the ${categoryName.toLowerCase()} category.`
                : `No products available in the ${categoryName.toLowerCase()} category at the moment.`
              }
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4 floating-card">
                Clear Search
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {filteredProducts.map((product) => (
            <div key={product.id} className="floating-card">
              <ProductCard 
                product={{
                  id: product.id,
                  // Use document ID as the product name since there's no title field
                  name: product.id || 'Unknown Product',
                  price: product.price || product.Price || 0,
                  originalPrice: product.originalPrice || product.OriginalPrice,
                  images: product.images || product.Images || [product.image || product.Image],
                  rating: product.rating || product.Rating || 4.5,
                  reviewCount: product.reviews || product.Reviews || 0,
                  category: product.category || product.Category || '',
                  brand: product.brand || product.Brand || '',
                  sku: product.sku || product.SKU || product.id,
                  stock: product.stock || product.Stock || 1,
                  isActive: product.isActive !== false,
                  isFeatured: product.featured || product.Featured || false,
                  description: product.description || product.Description || "",
                  features: product.features || product.Features || [],
                  specifications: product.specifications || product.Specifications || {},
                  createdAt: product.createdAt || new Date(),
                  updatedAt: product.updatedAt || new Date()
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer />
    </>
  )
}