"use client"

import { useState, useEffect, useMemo } from "react"
import { useAllMobileCollectionItems } from "@/lib/firebase-hooks"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product/filters/product-filters"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Product, Category } from "@/types" // Import Category
import { Button } from "@/components/ui/button"
import { ListFilter, Grid3X3, List } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react" // Import X for mobile filter panel
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton for loading states
import { BackgroundPatterns } from "@/components/shared/background-patterns"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumb } from "@/components/layout/breadcrumb"

export default function ProductsClientPage() {
  const { mobiles: allProducts, loading, error } = useAllMobileCollectionItems()
  const [categories, setCategories] = useState<Category[]>([]) // State for categories
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceRange: [0, 10000], // Default max price, adjust as needed
    rating: 0,
    inStock: false,
    specifications: {} as Record<string, string[]>, // For dynamic specifications
  })
  const [sortBy, setSortBy] = useState("relevance") // relevance, price-asc, price-desc, newest, rating
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid") // 'grid' or 'list'

  // Extract unique categories from products
  useEffect(() => {
    if (allProducts.length > 0) {
      const uniqueCategories = Array.from(
        new Set(allProducts.map(product => product.category).filter(Boolean))
      ).map((category, index) => ({
        id: `cat-${index}`,
        name: category as string,
        slug: category as string,
        description: ``,
        image: "",
        isActive: true,
        productCount: allProducts.filter(p => p.category === category).length
      }));
      
      setCategories(uniqueCategories as Category[]);
    }
  }, [allProducts]);

  useEffect(() => {
    // Update max price for slider when products are loaded
    if (allProducts.length > 0) {
      const maxPrice = allProducts.reduce((max, p) => Math.max(max, p.price || 0), 0)
      setFilters((prev) => ({ ...prev, priceRange: [0, maxPrice > 0 ? maxPrice : 10000] }))
    }
  }, [allProducts])

  const availableSpecifications = useMemo(() => {
    const specs: Record<string, Set<string>> = {}
    allProducts.forEach((product) => {
      if (product.specifications) {
        for (const key in product.specifications) {
          if (product.specifications.hasOwnProperty(key)) {
            if (!specs[key]) {
              specs[key] = new Set()
            }
            specs[key].add(product.specifications[key])
          }
        }
      }
    })
    const result: Record<string, string[]> = {}
    for (const key in specs) {
      result[key] = Array.from(specs[key]).sort()
    }
    return result
  }, [allProducts])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesSearch =
        (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = filters.category ? (product.category || "") === filters.category : true
      const matchesBrand = filters.brand ? (product.brand || "") === filters.brand : true
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      const matchesRating = product.rating >= filters.rating
      const matchesStock = filters.inStock ? product.stock > 0 : true

      const matchesSpecs = Object.keys(filters.specifications).every((specKey) => {
        const selectedValues = filters.specifications[specKey]
        if (selectedValues.length === 0) return true // No filter applied for this spec
        return selectedValues.includes(product.specifications?.[specKey])
      })

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesPrice &&
        matchesRating &&
        matchesStock &&
        matchesSpecs
      )
    })

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "newest":
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
        case "rating":
          return b.rating - a.rating
        case "relevance":
        default:
          return 0 // No specific sorting for relevance, maintain original order or default
      }
    })

    return filtered
  }, [allProducts, filters, sortBy, searchQuery])

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ]

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-inner relative overflow-hidden pt-16">
        <BackgroundPatterns variant="minimal" />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-inner relative overflow-hidden pt-16">
        <BackgroundPatterns variant="minimal" />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-inner relative overflow-hidden pt-16">
      <BackgroundPatterns />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-gray-600">
            Showing {filteredAndSortedProducts.length} of {allProducts.length} products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Filter Panel for larger screens with Glass Morphism */}
          <div className="hidden lg:block lg:w-1/4">
            <Card className="p-6 glass-card border border-orange-100 shadow-lg rounded-xl">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
                availableSpecifications={availableSpecifications}
                searchQuery={searchQuery}
                onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
              />
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <div className="relative w-full sm:w-auto flex-grow">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full border-2 border-orange-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 rounded-lg glass-card"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-orange-200 hover:bg-amber-50 floating-card">
                      Sort By:{" "}
                      {sortBy === "relevance"
                        ? "Relevance"
                        : sortBy === "price-asc"
                          ? "Price: Low to High"
                          : sortBy === "price-desc"
                            ? "Price: High to Low"
                            : sortBy === "newest"
                              ? "Newest"
                              : "Rating"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-orange-100 shadow-lg">
                    <DropdownMenuItem onClick={() => setSortBy("relevance")}>Relevance</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price-asc")}>Price: Low to High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price-desc")}>Price: High to Low</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("rating")}>Rating</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="bg-white/80 backdrop-blur-sm border-orange-200 hover:bg-amber-50 floating-card"
                >
                  {viewMode === "grid" ? <List className="text-amber-600" /> : <Grid3X3 className="text-amber-600" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden bg-white/80 backdrop-blur-sm border-orange-200 hover:bg-amber-50 floating-card"
                  onClick={() => setIsFilterPanelOpen(true)}
                >
                  <ListFilter className="text-amber-600" />
                </Button>
              </div>
            </div>

            {!loading && !error && filteredAndSortedProducts.length === 0 ? (
              <Card className="p-6 text-center text-gray-500 glass-card border border-orange-100 shadow-lg rounded-xl">
                No products found matching your criteria. Try adjusting your filters or search query.
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    : "grid grid-cols-1 gap-6"
                }
              >
                {filteredAndSortedProducts.map((product) => (
                  <div key={product.id} className="floating-card">
                    <ProductCard product={product} viewMode={viewMode} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {isFilterPanelOpen && (
          <div className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-orange-100">
              <h2 className="text-xl font-bold text-amber-700">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsFilterPanelOpen(false)}>
                <X className="h-6 w-6 text-amber-600" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
                availableSpecifications={availableSpecifications}
                searchQuery={searchQuery}
                onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="p-4 border-t border-orange-100">
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white floating-card"
                onClick={() => setIsFilterPanelOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}