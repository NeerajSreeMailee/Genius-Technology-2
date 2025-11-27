"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"


export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const slides = [
    {
      id: 1,
      title: "Power Meets Price Unmissable Laptop Deals",
      subtitle: "Upgrade your tech game with top-rated laptops at unbeatable prices. From sleek ultrabooks to powerhouse machines, these limited-time deals are built to impress—and disappear fast.",
      image: '/Hero.png',
      cta: "Shop Laptops Now",
      link: "/category/iphone-accessories",
      position: "left",
    },
    {
      id: 2,
      title: "Wireless Audio Revolution",
      subtitle: "Experience freedom of sound with our wireless collection",
      image: "/placeholder.svg?height=600&width=1200&text=Wireless+Audio",
      cta: "Explore Audio",
      link: "/category/audio-accessories",
      position: "right",
    },
    {
      id: 3,
      title: "Lightning Fast Charging",
      subtitle: "Power up in minutes with our fast charging solutions",
      image: "/placeholder.svg?height=600&width=1200&text=Fast+Charging",
      cta: "Shop Chargers",
      link: "/category/chargers",
      position: "center",
    },
    {
      id: 4,
      title: "Smart Watches Collection",
      subtitle: "Stay connected, stay smart with our latest wearables",
      image: "/placeholder.svg?height=600&width=1200&text=Smart+Watches",
      cta: "View Watches",
      link: "/category/smart-watches",
      position: "left",
    },
    {
      id: 5,
      title: "New Arrivals Daily",
      subtitle: "Discover the latest tech innovations every day",
      image: "/placeholder.svg?height=600&width=1200&text=New+Arrivals",
      cta: "See What's New",
      link: "/products/new-arrivals",
      position: "center",
    },
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section
      className="relative h-[685px] overflow-hidden mt-[50px]"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-800 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container-custom">
                <div
                  className={`max-w-[1140px] ${
                    slide.position === "center"
                      ? "mx-auto"
                      : slide.position === "right"
                        ? "ml-auto"
                        : ""
                  }`}
                >
                  <h1 className="text-5xl md:text-[96px] font-bold text-white mb-6 animate-fade-in">{slide.title}</h1>
                  <p className="text-xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    {slide.subtitle}
                  </p>
                  <Link href={slide.link}>
                    <Button
                      size="lg"
                      className="bg-[#FFCC01] text-white px-8 py-4 text-lg font-semibold rounded-[30px] transform hover:scale-105 transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: "0.4s" }}
                    >
                      {slide.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button> */}

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Indicator
      <div className="absolute top-6 right-6 bg-black/30 text-white px-3 py-1 rounded-full text-sm">
        {currentSlide + 1} / {slides.length}
      </div> */}
    </section>
  )
}
