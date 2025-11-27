"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProductCardDesign } from "../product/cards/product-card-design"
import Category1 from '../../../public/Category1.png'
import Category2 from '../../../public/Category2.png'
import Category3 from '../../../public/Category3.png'
import Category4 from '../../../public/Category4.png'
import { StaticImageData } from "next/image"
import { Cat } from "lucide-react"
import { BackgroundPatterns } from "@/components/shared/background-patterns"

interface Category {
  id: string
  name: string
  slug: string
  image: string | StaticImageData
  productCount: number
  startingPrice: number
  gradient: string
  description: string
}

export function ShopByCategory() {
  const router = useRouter()
  const [categories] = useState<Category[]>([
    {
      id: "1",
      name: "Display",
      slug: "display",
      image: Category1,
      productCount: 28,
      startingPrice: 999,
      gradient: "from-blue-500 to-blue-600",
      description: "High-quality display accessories",
    },
    {
      id: "2",
      name: "Battery",
      slug: "battery",
      image: Category2,
      productCount: 13,
      startingPrice: 299,
      gradient: "from-green-500 to-green-600",
      description: "Reliable power solutions",
    },
    
  ])

  return (
    <section className="py-16 bg-gradient-to-b from-[#FFFBEA] to-white relative overflow-hidden">
      <BackgroundPatterns />
      <div className="container-custom relative z-10">
        <div className="flex items-start justify-between">
          {/* Section Header */}
          <div className="mb-12">
        <h2 className="text-[36px] font-bold text-[#004AAD] mb-4">Shop By Category</h2>
        <p className="text-[16px] text-[#333333]-600 mb-8 max-w-[750px]">Score unbeatable prices on top-rated tech—but hurry, these offers are ticking away fast. With exclusive discounts and a live countdown, now's the time to grab your next gadget before the clock runs out.</p>
          </div>

          {/* Button */}
                  </div>

        {/* Categories Grid using ProductCardDesign */}
        <div className="grid grid-cols-2  mb-8 justify-items-center justify-center">
          {categories.map((category) => (
        <ProductCardDesign
          key={category.id}
          imageSrc={category.image}
          category={category.name}
          price={category.startingPrice}
          soldPercent={Math.min(100, Math.round((category.productCount / 100) * 100))}
          onClick={() => router.push(`/products/${category.slug}`)}
        />
          ))}
        </div>

      </div>
    </section>
  )
}