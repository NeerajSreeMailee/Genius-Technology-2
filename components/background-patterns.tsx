"use client"

import React from "react"

interface BackgroundPatternsProps {
  variant?: "default" | "light" | "dark" | "minimal"
}

export function BackgroundPatterns({ variant = "default" }: BackgroundPatternsProps) {
  // Define opacity levels based on variant
  const getOpacities = () => {
    switch (variant) {
      case "light":
        return {
          noise: "opacity-10",
          particles: "opacity-10",
          blobs: "opacity-15",
          organic: "opacity-8",
          crosshatch: "opacity-3",
          dotted: "opacity-5",
          diamond: "opacity-4",
          bubble: "opacity-3",
        }
      case "dark":
        return {
          noise: "opacity-30",
          particles: "opacity-30",
          blobs: "opacity-40",
          organic: "opacity-25",
          crosshatch: "opacity-10",
          dotted: "opacity-15",
          diamond: "opacity-12",
          bubble: "opacity-10",
        }
      case "minimal":
        return {
          noise: "opacity-5",
          particles: "opacity-5",
          blobs: "opacity-8",
          organic: "opacity-4",
          crosshatch: "opacity-2",
          dotted: "opacity-3",
          diamond: "opacity-2",
          bubble: "opacity-2",
        }
      case "default":
      default:
        return {
          noise: "opacity-20",
          particles: "opacity-20",
          blobs: "opacity-30",
          organic: "opacity-15",
          crosshatch: "opacity-5",
          dotted: "opacity-10",
          diamond: "opacity-7",
          bubble: "opacity-6",
        }
    }
  }

  const opacities = getOpacities()

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-50">
      {/* ===== Enhanced Attractive Background with Rich Textures ===== */}

      
      {/* Layer 1: Subtle Noise Texture (Base) */}
      <div className={`absolute inset-0 ${opacities.noise}`}>
        <div className="noise-texture-bg w-full h-full"></div>
      </div>
      
      {/* Layer 2: Floating Particles */}
      <div className={`absolute inset-0 ${opacities.particles}`}>
        <div className="floating-particles-bg w-full h-full"></div>
      </div>
      
      {/* Layer 3: Liquid Blobs Effect with Animation */}
      <div className={`absolute inset-0 ${opacities.blobs}`}>
        <div className="liquid-blobs-bg w-full h-full"></div>
      </div>
      
      {/* Layer 4: Organic Flow */}
      <div className={`absolute inset-0 ${opacities.organic}`}>
        <div className="organic-flow-bg w-full h-full"></div>
      </div>
      
      {/* Additional Textures */}
      <div className={`absolute inset-0 ${opacities.crosshatch}`}>
        <div className="crosshatch-bg w-full h-full"></div>
      </div>
      <div className={`absolute inset-0 ${opacities.dotted}`}>
        <div className="dotted-grid-bg w-full h-full"></div>
      </div>
      <div className={`absolute inset-0 ${opacities.diamond}`}>
        <div className="diamond-bg w-full h-full"></div>
      </div>
      <div className={`absolute inset-0 ${opacities.bubble}`}>
        <div className="bubble-bg w-full h-full"></div>
      </div>
      
      {/* Decorative Floating Elements with Richer Colors */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Large Floating Orbs with vibrant gradients */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-orange-300 to-amber-400 opacity-25 blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 opacity-20 blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-amber-200 to-yellow-300 opacity-15 blur-3xl animate-float-reverse"></div>
        
        {/* Medium Floating Orbs */}
        <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 opacity-25 blur-xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-amber-300 to-orange-300 opacity-20 blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 opacity-20 blur-xl"></div>
        <div className="absolute top-1/4 left-1/2 w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-25 blur-xl"></div>
        
        {/* Small Floating Orbs */}
        <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-orange-300 to-amber-300 opacity-30 blur-lg"></div>
        <div className="absolute bottom-1/2 right-1/3 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-300 to-orange-300 opacity-25 blur-lg"></div>
        
        {/* Additional Textured Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-200/20 via-yellow-100/10 to-amber-200/20"></div>
        
        {/* Subtle diagonal texture overlay */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_transparent,_transparent_10px,_rgba(255,165,0,0.05)_10px,_rgba(255,165,0,0.05)_20px)]"></div>
      </div>
      {/* ===== End Enhanced Background Design Patterns ===== */}
    </div>
  )
}