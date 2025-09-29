"use client"

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
import { Card } from "@/components/ui/card"
import { useMemo, useState, useEffect } from "react"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { BackgroundPatterns } from "@/components/background-patterns"

interface CategoryPageProps {
  params: {
    slug: string
  }
  initialData?: any
}

export default function CategoryClientPage({ params, initialData }: CategoryPageProps) {
  const categorySlug = params.slug
  const categoryName = categorySlug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState({
    category: categoryName, // Pre-set category filter
    brand: "",
    priceRange: [0, 100000],
    rating: 0,
    inStock: false,
    specifications: {} as Record<string, string[]>,
  })
  const [sortBy, setSortBy] = useState("relevance")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products")
        const q = query(productsCollection, where("category", "==", categoryName), orderBy("name"))
        const productsSnapshot = await getDocs(q)
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Product[]
        setAllProducts(productsData)
      } catch (error) {
        console.error("Error fetching products for category:", error)
      }
    }
    fetchProducts()
  }, [categoryName])

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
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesBrand = filters.brand ? product.brand === filters.brand : true
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      const matchesRating = product.rating >= filters.rating
      const matchesStock = filters.inStock ? product.stock > 0 : true

      const matchesSpecs = Object.keys(filters.specifications).every((specKey) => {
        const selectedValues = filters.specifications[specKey]
        if (selectedValues.length === 0) return true
        return selectedValues.includes(product.specifications?.[specKey])
      })

      return matchesSearch && matchesBrand && matchesPrice && matchesRating && matchesStock && matchesSpecs
    })

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
          return 0
      }
    })

    return filtered
  }, [allProducts, filters, sortBy, searchQuery])

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: categoryName, href: `/category/${categorySlug}` },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-inner relative overflow-hidden">
      <BackgroundPatterns />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block lg:w-1/4">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={[]}
              availableSpecifications={availableSpecifications}
              searchQuery={searchQuery}
              onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <div className="relative w-full sm:w-auto flex-grow">
                <Input
                  placeholder={`Search ${categoryName} products...`}
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
              <Card className="p-6 text-center text-gray-500">
                No products found in this category matching your criteria. Try adjusting your filters or search query.
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
                categories={[]}
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