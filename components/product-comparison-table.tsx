"use client"

import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import Link from "next/link"
import { X, Star } from "lucide-react"
import { useComparison } from "@/contexts/comparison-context"

interface ProductComparisonTableProps {
  products: Product[]
}

export function ProductComparisonTable({ products }: ProductComparisonTableProps) {
  const { removeFromComparison } = useComparison()

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No products selected for comparison. Add products from their detail pages or product listings.
      </div>
    )
  }

  // Define common specifications to compare
  const commonSpecs = [
    { key: "price", label: "Price", render: (p: Product) => `₹${p.price.toLocaleString()}` },
    {
      key: "originalPrice",
      label: "Original Price",
      render: (p: Product) => (p.originalPrice ? `₹${p.originalPrice.toLocaleString()}` : "N/A"),
    },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    {
      key: "rating",
      label: "Rating",
      render: (p: Product) => (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.floor(p.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
          ))}
          <span className="ml-1 text-sm">({p.rating})</span>
        </div>
      ),
    },
    { key: "reviews", label: "Reviews", render: (p: Product) => `${p.reviews} reviews` },
    { key: "stock", label: "Stock", render: (p: Product) => (p.stock > 0 ? `${p.stock} in stock` : "Out of Stock") },
    { key: "warranty", label: "Warranty", render: (p: Product) => p.specifications?.warranty || "N/A" },
    { key: "connectivity", label: "Connectivity", render: (p: Product) => p.specifications?.connectivity || "N/A" },
    { key: "batteryLife", label: "Battery Life", render: (p: Product) => p.specifications?.batteryLife || "N/A" },
    { key: "color", label: "Color", render: (p: Product) => p.specifications?.color || "N/A" },
  ]

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] sticky left-0 bg-white z-10 border-r">Feature</TableHead>
            {products.map((product) => (
              <TableHead key={product.id} className="text-center relative border-l">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-red-500"
                  onClick={() => removeFromComparison(product.id)}
                  aria-label={`Remove ${product.name} from comparison`}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Link href={`/product/${product.id}`} className="flex flex-col items-center p-2">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="object-contain mb-2"
                  />
                  <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                </Link>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {commonSpecs.map((spec) => (
            <TableRow key={spec.key}>
              <TableCell className="font-medium sticky left-0 bg-white z-10 border-r">{spec.label}</TableCell>
              {products.map((product) => (
                <TableCell key={`${product.id}-${spec.key}`} className="text-center border-l">
                  {spec.render ? spec.render(product) : product.specifications?.[spec.key] || "N/A"}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-medium sticky left-0 bg-white z-10 border-r">Actions</TableCell>
            {products.map((product) => (
              <TableCell key={`${product.id}-actions`} className="text-center border-l">
                <Button asChild className="w-full">
                  <Link href={`/product/${product.id}`}>View Product</Link>
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
