"use client"

import Image from "next/image"
import Link from "next/link"
import { useBrands } from "@/lib/firebase-hooks"
import { BackgroundPatterns } from "@/components/background-patterns"

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
                <div className="h-16 flex items-center justify-center mb-4 rounded-[15px]">
                  <Image
                    src={brand.logo || "/placeholder.svg"}
                    alt={brand.name}
                    width={120}
                    height={60}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
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

          {/* View All Brands Card
          <Link
            href="/brands"
            className="group bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-xl p-6 hover:from-orange-50 hover:to-orange-100 hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 bg-gray-400 group-hover:bg-orange-500 rounded-full flex items-center justify-center mb-4 transition-colors duration-300">
              <span className="text-white text-2xl font-bold">+</span>
            </div>
            <h3 className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-300">
              View All Brands
            </h3>
            <p className="text-sm text-gray-500 group-hover:text-orange-500 transition-colors duration-300">
              Explore More
            </p>
          </Link> */}
        </div>

        {/* Featured Brands Showcase
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Featured Brand Partners</h3>
            <p className="text-gray-600">Trusted by millions of customers worldwide</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {brands
              .filter((brand) => brand.isPopular)
              .map((brand) => (
                <div key={brand.id} className="text-center">
                  <Image
                    src={brand.logo || "/placeholder.svg"}
                    alt={brand.name}
                    width={100}
                    height={50}
                    className="mx-auto filter grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
                  />
                </div>
              ))}
          </div>
        </div> */}
      </div>
    </section>
  )
}