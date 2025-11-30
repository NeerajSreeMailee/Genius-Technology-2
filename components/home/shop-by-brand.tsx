"use client"

import Image from "next/image"
import Link from "next/link"
import { useBrands } from "@/lib/firebase-hooks"
import { BackgroundPatterns } from "@/components/shared/background-patterns"

export function ShopByBrand() {
  const { brands = [], loading } = useBrands()

  // defensive fallback
  const visibleBrands = Array.isArray(brands) ? brands : []

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-inner relative overflow-hidden">
      <BackgroundPatterns />
      <div className="container-custom relative z-10">
        <div className="flex items-start justify-between">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-[36px] font-bold text-[#004AAD] mb-4">Shop By Brand</h2>
            <p className="text-[16px] text-[#333333]-600 mb-8 max-w-[750px]">Score unbeatable prices on top-rated tech—but hurry, these offers are ticking away fast. With exclusive discounts and a live countdown, now's the time to grab your next gadget before the clock runs out.</p>
          </div>

        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {loading ? (
            <div className="col-span-full text-center text-gray-500">Loading brands...</div>
          ) : (
            visibleBrands.slice(0, 15).map((brand: any) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 glass-card floating-card"
              >
                {/* Popular Badge */}
                {brand.featured || brand.isPopular ? (
                  <div className="absolute -top-2 -right-2 bg-[#004AAD] text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </div>
                ) : null}

                {/* Logo Container */}
                <div className="h-16 flex items-center justify-center mb-4 rounded-[15px] relative">
                  <Image
                    src={brand.logo || "/placeholder.svg"}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                  />
                </div>

                {/* Brand Info */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors duration-300">
                    {brand.name}
                  </h3>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}