"use client"
import { getMobileCollectionByBrand } from "@/lib/firebase-collections"
import type { Product } from "@/types"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Search, ListFilter, Grid3X3, List, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ProductFilters } from "@/components/product-filters"
import { useCategories } from "@/lib/firebase-hooks"
import { Card } from "@/components/ui/card"
import { useMemo, useState, useEffect } from "react"
import { BackgroundPatterns } from "@/components/background-patterns"

interface BrandPageProps {
  params: {
    slug: string
  }
}

export default function BrandPageClient({ params }: BrandPageProps) {
  const brandSlug = params.slug
  const brandName = brandSlug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState({
    category: "",
    brand: "", // Remove pre-set brand filter since we're already filtering by brand via the collection query
    priceRange: [0, 100000],
    rating: 0,
    inStock: false,
    specifications: {} as Record<string, string[]>,
  })
  const [sortBy, setSortBy] = useState("relevance")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { categories = [] } = useCategories()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products for brand:', brandName, 'slug:', brandSlug)
        const productsDataRaw = await getMobileCollectionByBrand(brandSlug)
        console.log('Raw mobile data:', productsDataRaw)
        
        // Transform the mobile collection data to match Product interface
        const productsData = productsDataRaw.map((item: any) => ({
          id: item.id,
          // Try multiple field variations for name - Firebase mobile collection might use id as name
          name: item.name || item.Name || item.title || item.Title || item.id || 'Unnamed Product',
          description: item.description || item.Description || item.details || item.Details || '',
          price: Number(item.price || item.Price || item.salePrice || item.SalePrice || 0),
          originalPrice: Number(item.originalPrice || item.OriginalPrice || item.mrp || item.MRP),
          images: item.images || item.Images || [item.image, item.Image].filter(Boolean) || [],
          category: item.category || item.Category || '',
          brand: item.brand || item.Brand || item.Category || brandName,
          sku: item.sku || item.SKU || item.id,
          stock: Number(item.stock || item.Stock || 1),
          rating: Number(item.rating || item.Rating || 4.0),
          reviewCount: Number(item.reviewCount || item.ReviewCount || item.reviews || 0),
          features: item.features || item.Features || [],
          specifications: item.specifications || item.Specifications || {},
          isActive: item.isActive !== undefined ? item.isActive : true,
          isFeatured: item.isFeatured || item.Featured || false,
          createdAt: item.createdAt?.toDate ? item.createdAt.toDate() : item.createdAt || new Date(),
          updatedAt: item.updatedAt?.toDate ? item.updatedAt.toDate() : item.updatedAt || new Date(),
        })) as Product[]
        
        console.log('Transformed products data:', productsData)
        console.log(`Brand filtering: Found ${productsData.length} products for brand "${brandName}"`)        
        setAllProducts(productsData)
      } catch (error) {
        console.error("Error fetching mobile products for brand:", error)
      }
    }
    fetchProducts()
  }, [brandName, brandSlug])

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
    // Since getMobileCollectionByBrand should return only brand-specific products,
    // we should trust the Firebase results and apply minimal additional filtering
    console.log(`Client-side filtering: Starting with ${allProducts.length} products from Firebase`)
    
    // Only filter out products that clearly don't belong (empty brand/category)
    // or apply search/filter criteria
    const validProducts = allProducts.filter((product) => {
      // Basic validation - product should have some brand/category info
      const hasValidBrandInfo = product.brand || product.category || product.name
      
      if (!hasValidBrandInfo) {
        console.log(`Excluding product ${product.id} - no valid brand/category information`)
        return false
      }
      
      return true
    })
    
    console.log(`After validation: ${validProducts.length} products remain`)    
    
    // Then apply additional filters
    const filtered = validProducts.filter((product) => {
      const matchesSearch =
        (product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      const matchesCategory = filters.category ? product.category === filters.category : true
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      const matchesRating = product.rating >= filters.rating
      const matchesStock = filters.inStock ? (product.stock > 0) : true

      const matchesSpecs = Object.keys(filters.specifications).every((specKey) => {
        const selectedValues = filters.specifications[specKey]
        if (selectedValues.length === 0) return true
        return selectedValues.includes(product.specifications?.[specKey])
      })

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock && matchesSpecs
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.price || 0) - (b.price || 0)
        case "price-desc":
          return (b.price || 0) - (a.price || 0)
        case "newest":
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "relevance":
        default:
          return 0
      }
    })

    return filtered
  }, [allProducts, filters, sortBy, searchQuery, brandName, brandSlug])

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: brandName, href: `/brand/${brandSlug}` },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-inner relative overflow-hidden pt-16">
      <BackgroundPatterns />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-3xl font-bold mb-6">
          {brandName} Products 
          {allProducts.length > 0 && (
            <span className="text-lg font-normal text-gray-600">({allProducts.length} total, {filteredAndSortedProducts.length} filtered)</span>
          )}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block lg:w-1/4">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              availableSpecifications={availableSpecifications}
              searchQuery={searchQuery}
              onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <div className="relative w-full sm:w-auto flex-grow">
                <Input
                  placeholder={`Search ${brandName} products...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
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
                  <DropdownMenuContent align="end">
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
                >
                  {viewMode === "grid" ? <List /> : <Grid3X3 />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden bg-transparent"
                  onClick={() => setIsFilterPanelOpen(true)}
                >
                  <ListFilter />
                </Button>
              </div>
            </div>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-6 text-center text-gray-500">
                  <div className="space-y-4">
                    <p className="text-lg font-medium">No products found for {brandName}</p>
                    <div className="text-sm text-gray-400">
                      <p>We searched for products with the following brand variations:</p>
                      <ul className="mt-2 space-y-1">
                        <li>• {brandSlug} (original)</li>
                        <li>• {brandName} (formatted)</li>
                        <li>• {brandSlug.toUpperCase()} (uppercase)</li>
                        <li>• {brandSlug.toLowerCase()} (lowercase)</li>
                      </ul>
                      <p className="mt-4">Total products loaded from database: {allProducts.length}</p>
                      {allProducts.length === 0 && (
                        <p className="text-red-500 mt-2">No products were loaded from the mobile collection. Please check your Firebase connection.</p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    : "grid grid-cols-1 gap-6"
                }
              >
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>

        {isFilterPanelOpen && (
          <div className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsFilterPanelOpen(false)}>
                <X className="h-6 w-6" />
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
            <div className="p-4 border-t">
              <Button className="w-full" onClick={() => setIsFilterPanelOpen(false)}>
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