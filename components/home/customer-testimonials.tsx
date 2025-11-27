"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Play, Heart, MessageCircle, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Testimonial {
  id: string
  type: "text" | "video" | "instagram"
  customerName: string
  customerPhoto: string
  rating: number
  content: string
  productPurchased: string
  date: string
  isVerified: boolean
  videoThumbnail?: string
  videoDuration?: string
  instagramHandle?: string
  instagramLikes?: number
  instagramComments?: number
}

export function CustomerTestimonials() {
  const [testimonials] = useState<Testimonial[]>([
    {
      id: "1",
      type: "text",
      customerName: "Rajesh Kumar",
      customerPhoto: "/placeholder.svg?height=60&width=60&text=RK",
      rating: 5,
      content:
        "Amazing quality headphones! The sound is crystal clear and the battery life is incredible. I use them daily for work calls and music. Highly recommend Genius Technology for their excellent products and fast delivery.",
      productPurchased: "Wireless Bluetooth Headphones Pro",
      date: "2024-01-15",
      isVerified: true,
    },
    {
      id: "2",
      type: "video",
      customerName: "Priya Sharma",
      customerPhoto: "/placeholder.svg?height=60&width=60&text=PS",
      rating: 5,
      content:
        "Watch my detailed review of this amazing power bank! It charges my phone 4 times and the fast charging is incredible.",
      productPurchased: "Fast Charging Power Bank 20000mAh",
      date: "2024-01-12",
      isVerified: true,
      videoThumbnail: "/placeholder.svg?height=300&width=400&text=Video+Review",
      videoDuration: "2:34",
    },
    {
      id: "3",
      type: "instagram",
      customerName: "techreview_india",
      customerPhoto: "/placeholder.svg?height=60&width=60&text=TR",
      rating: 5,
      content:
        "Just got this wireless charger from @geniustechnology and it's a game changer! Fast charging and sleek design. Perfect for my desk setup. #TechReview #WirelessCharging #GeniusTech",
      productPurchased: "Wireless Charging Pad 15W",
      date: "2024-01-10",
      isVerified: true,
      instagramHandle: "@techreview_india",
      instagramLikes: 234,
      instagramComments: 18,
    },
  ])

  return (
    <section className="py-16 bg-gradient-to-b from-[#FFFBEA] to-white">
      <div className="container-custom">
        <div className="flex items-start justify-between">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-[36px] font-bold text-[#004AAD] mb-4">What Our<br/>Customers Say</h2>
            <p className="text-[16px] text-[#333333]-600 mb-8 max-w-[750px]">From students to tech enthusiasts, our customers love the performance, style, and value Genius Technology delivers. See how our products are making a difference in everyday lives.</p>
          </div>

          {/* Button */}
          <button className="hiddle lg:block bg-[#FFCC01] text-white px-6 py-3 rounded-full shadow-lg w-[150px] ">view all</button>        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Customer Stats
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={16} className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
    ))
  }

    if (testimonial.type === "text") {
      return (
        <div className="relative bg-gradient-to-b from-[#F8FAFF] to-[#EAF3FA] rounded-3xl shadow-lg p-8 flex flex-col min-h-[400px] max-w-[400px] mx-auto overflow-hidden border border-[#E0E6EF]">
          {/* Quote Icon */}
          <svg
            className="absolute top-6 right-6 w-8 h-8 text-black/70"
            fill="none"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.5 8.5C12.5 6.01472 10.4853 4 8 4C5.51472 4 3.5 6.01472 3.5 8.5C3.5 10.9853 5.51472 13 8 13C8.82843 13 9.5 13.6716 9.5 14.5V20.5C9.5 21.3284 8.82843 22 8 22C7.17157 22 6.5 21.3284 6.5 20.5V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M28.5 8.5C28.5 6.01472 26.4853 4 24 4C21.5147 4 19.5 6.01472 19.5 8.5C19.5 10.9853 21.5147 13 24 13C24.8284 13 25.5 13.6716 25.5 14.5V20.5C25.5 21.3284 24.8284 22 24 22C23.1716 22 22.5 21.3284 22.5 20.5V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {/* Customer Info */}
          <div className="flex items-center gap-4 mb-2">
            <Image
              src={testimonial.customerPhoto || "/placeholder.svg"}
              alt={testimonial.customerName}
              width={70}
              height={70}
              className="rounded-full border-4 border-white shadow-md"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-black mb-1">{testimonial.customerName}</span>
              <div className="flex items-center">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          </div>
          {/* Review Content */}
          <p className="text-[16px] text-black mb-4 leading-relaxed mt-[50px]">
            {testimonial.content}
          </p>
          {/* Product Info */}
          <div className="mt-[30px]">
            <span className="text-[#004AAD] font-semibold">Product Purchased:</span>
            <span className="text-black font-normal ml-1">{testimonial.productPurchased}</span>
          </div>
        </div>
      )
  }

  if (testimonial.type === "video") {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        {/* Video Thumbnail */}
        <div className="relative h-48 bg-gray-900">
          <Image
            src={testimonial.videoThumbnail! || "/placeholder.svg"}
            alt="Video review thumbnail"
            fill
            className="object-cover"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
              <Play size={24} className="text-gray-900 ml-1" />
            </button>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm">
            {testimonial.videoDuration}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Customer Info */}
          <div className="flex items-center mb-4">
            <Image
              src={testimonial.customerPhoto || "/placeholder.svg"}
              alt={testimonial.customerName}
              width={50}
              height={50}
              className="rounded-full border-2 border-orange-500"
            />
            <div className="ml-3">
              <h4 className="font-semibold text-gray-900">{testimonial.customerName}</h4>
              {testimonial.isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  ✓ Verified Purchase
                </Badge>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">{renderStars(testimonial.rating)}</div>

          {/* Review Content */}
          <p className="text-gray-700 text-sm mb-3">{testimonial.content}</p>

          {/* Product Info */}
          <div className="text-xs text-gray-500 border-t pt-3">
            <p>
              <strong>Product:</strong> {testimonial.productPurchased}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (testimonial.type === "instagram") {
    return (
      <div className="relative bg-white rounded-3xl shadow-lg p-6 max-w-[410px] mx-auto border-4 border-[#2563eb]" style={{ boxShadow: '0 0 0 4px #e0e7ff, 0 4px 24px 0 rgba(0,0,0,0.10)' }}>
        {/* Quote Icon */}
        <svg
          className="absolute top-6 right-6 w-8 h-8 text-black/70"
          fill="none"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.5 8.5C12.5 6.01472 10.4853 4 8 4C5.51472 4 3.5 6.01472 3.5 8.5C3.5 10.9853 5.51472 13 8 13C8.82843 13 9.5 13.6716 9.5 14.5V20.5C9.5 21.3284 8.82843 22 8 22C7.17157 22 6.5 21.3284 6.5 20.5V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M28.5 8.5C28.5 6.01472 26.4853 4 24 4C21.5147 4 19.5 6.01472 19.5 8.5C19.5 10.9853 21.5147 13 24 13C24.8284 13 25.5 13.6716 25.5 14.5V20.5C25.5 21.3284 24.8284 22 24 22C23.1716 22 22.5 21.3284 22.5 20.5V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {/* Header: Avatar and Name */}
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={testimonial.customerPhoto || "/placeholder.svg"}
            alt={testimonial.customerName}
            width={40}
            height={40}
            className="rounded-full border-2 border-white shadow"
          />
          <span className="font-semibold text-black text-base">{testimonial.customerName}</span>
        </div>
        {/* Main Image */}
        <div className="w-full rounded-xl overflow-hidden mb-4">
          <Image
            src={testimonial.videoThumbnail || "/placeholder.svg"}
            alt="Instagram testimonial visual"
            width={340}
            height={180}
            className="object-cover w-full h-[180px]"
          />
        </div>
        {/* Testimonial Text */}
        <p className="text-gray-800 text-[16px] mb-4 leading-relaxed">{testimonial.content}</p>
        {/* Author/Role */}
        <div className="text-gray-700 text-sm font-medium mt-4">
          — <span className="font-semibold">{testimonial.instagramHandle}</span>
          {testimonial.productPurchased && (
            <span className="ml-1">| {testimonial.productPurchased}</span>
          )}
        </div>
      </div>
    )
  }

  return null
}
