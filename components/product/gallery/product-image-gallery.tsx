"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Expand, Play } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ProductImageGalleryProps {
  images: string[]
  videoUrl?: string // Optional video URL
}

export function ProductImageGallery({ images, videoUrl }: ProductImageGalleryProps) {
  // Initialize mainImage with the first image or the videoUrl if images array is empty
  const [mainMedia, setMainMedia] = useState<string>(videoUrl || images[0] || "/placeholder.svg")
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !isZoomed ||
      (mainMedia.startsWith("http") &&
        (mainMedia.endsWith(".mp4") || mainMedia.endsWith(".webm") || mainMedia.endsWith(".ogg")))
    )
      return // No zoom for videos

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomPosition({ x, y })
  }

  const isMainMediaVideo =
    (mainMedia.startsWith("http") &&
      (mainMedia.endsWith(".mp4") || mainMedia.endsWith(".webm") || mainMedia.endsWith(".ogg"))) ||
    mainMedia === videoUrl

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image / Video */}
      <div
        className="relative w-full aspect-square overflow-hidden rounded-lg border"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {isMainMediaVideo ? (
          <video src={mainMedia} controls className="w-full h-full object-contain">
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            <Image
              src={mainMedia || "/placeholder.svg"}
              alt="Product main image"
              fill
              className={`object-contain transition-transform duration-100 ease-out ${isZoomed ? "scale-[2.5]" : "scale-100"}`}
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <div className="absolute bottom-2 right-2 p-2 bg-black/50 text-white rounded-full cursor-pointer hover:bg-black/70 transition-colors">
                  <Expand className="h-5 w-5" />
                  <span className="sr-only">Full screen image</span>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh] p-0">
                <Image
                  src={mainMedia || "/placeholder.svg"}
                  alt="Product full screen image"
                  fill
                  className="object-contain"
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative w-20 h-20 shrink-0 rounded-lg border cursor-pointer ${mainMedia === image ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-200"}`}
            onClick={() => setMainMedia(image)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-contain"
            />
          </div>
        ))}
        {videoUrl && (
          <div
            className={`relative w-20 h-20 shrink-0 rounded-lg border cursor-pointer flex items-center justify-center bg-gray-100 ${mainMedia === videoUrl ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-200"}`}
            onClick={() => setMainMedia(videoUrl)}
          >
            <Play className="h-8 w-8 text-gray-500" />
            <span className="sr-only">Product video thumbnail</span>
          </div>
        )}
      </div>
    </div>
  )
}
