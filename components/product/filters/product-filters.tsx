"use client"
import type { Category } from "@/types"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Star, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ProductFiltersProps {
  filters: {
    category: string
    brand: string
    priceRange: number[]
    rating: number
    inStock: boolean
    specifications: Record<string, string[]> // New: for dynamic specifications
  }
  onFiltersChange: (filters: any) => void
  categories: Category[]
  availableSpecifications: Record<string, string[]> // New: dynamically extracted specs
  searchQuery: string
  onSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const brands = [
  "Apple",
  "Samsung",
  "Mi",
  "OPPO",
  "Vivo",
  "Infinix",
]

export function ProductFilters({
  filters,
  onFiltersChange,
  categories,
  availableSpecifications,
  searchQuery,
  onSearchQueryChange,
}: ProductFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  // Extract unique brands from products or use default list
  const allBrands = Array.from(
    new Set(
      Object.values(availableSpecifications)
        .flat()
        .filter(spec => spec && typeof spec === 'string')
    )
  ).slice(0, 20);
  
  const brands = allBrands.length > 0 ? allBrands : [
    "Apple",
  "Samsung",
  "Mi",
  "OPPO",
  "Vivo",
  "Infinix",
  ];

  const handleSpecificationChange = (specKey: string, specValue: string, checked: boolean) => {
    const currentSelected = filters.specifications[specKey] || []
    let newSelected: string[]

    if (checked) {
      newSelected = [...currentSelected, specValue]
    } else {
      newSelected = currentSelected.filter((val) => val !== specValue)
    }

    onFiltersChange({
      ...filters,
      specifications: {
        ...filters.specifications,
        [specKey]: newSelected,
      },
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      category: "",
      brand: "",
      priceRange: [0, 10000],
      rating: 0,
      inStock: false,
      specifications: {},
    })
  }

  return (
    <div className="space-y-6 relative">
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-15 blur-xl"></div>
      
      {/* Additional textures */}
      <div className="absolute inset-0 opacity-3">
        <div className="crosshatch-bg w-full h-full"></div>
      </div>
      <div className="absolute inset-0 opacity-5">
        <div className="dotted-grid-bg w-full h-full"></div>
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="floating-card">
          Clear All
        </Button>
      </div>

      {/* Search Input with Glass Morphism */}
      <div className="glass-card p-4 rounded-lg relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-20"></div>
        {/* Additional shape */}
        <div className="absolute top-2 left-2 w-6 h-6 border-2 border-amber-300 opacity-20 transform rotate-45"></div>
        <h4 className="font-medium mb-3 relative z-10">Search</h4>
        <div className="relative z-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={onSearchQueryChange}
            className="pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full glass-card"
          />
        </div>
      </div>

      <Separator />

      {/* Price Range with Gradient Border */}
      <div className="n">
        {/* Decorative element */}
        <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-full opacity-20"></div>
        {/* Additional shape */}
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gradient-to-r from-orange-200 to-amber-200 opacity-25"></div>
        <h4 className="font-medium mb-3 relative z-10">Price Range</h4>
        <div className="px-2 relative z-10">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange("priceRange", value)}
            max={10000}
            min={0}
            step={100}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Brands with Floating Card Effect */}
      <div className="floating-card p-4 rounded-lg relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20"></div>
        {/* Additional shape */}
        <div className="absolute top-2 left-2 w-6 h-6 border-2 border-yellow-300 opacity-20 transform rotate-12"></div>
        <h4 className="font-medium mb-3 relative z-10">Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto relative z-10">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={filters.brand === brand}
                onCheckedChange={(checked) => handleFilterChange("brand", checked ? brand : "")}
              />
              <Label htmlFor={brand} className="text-sm">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Specifications with Gradient Border */}
      {Object.keys(availableSpecifications).map((specKey) => (
        <div key={specKey} className="gradient-border p-4 rounded-lg relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-full opacity-20"></div>
          {/* Additional texture */}
          <div className="absolute inset-0 opacity-3">
            <div className="zigzag-bg w-full h-full"></div>
          </div>
          <Separator />
          <h4 className="font-medium mb-3 capitalize relative z-10">{specKey}</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto relative z-10">
            {availableSpecifications[specKey].map((specValue) => (
              <div key={specValue} className="flex items-center space-x-2">
                <Checkbox
                  id={`${specKey}-${specValue}`}
                  checked={(filters.specifications[specKey] || []).includes(specValue)}
                  onCheckedChange={(checked) => handleSpecificationChange(specKey, specValue, !!checked)}
                />
                <Label htmlFor={`${specKey}-${specValue}`} className="text-sm">
                  {specValue}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
