import type { Metadata } from "next"
import { BackgroundPatterns } from "@/components/shared/background-patterns"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Design Patterns Showcase",
  description: "Showcase of modern background patterns for e-commerce websites",
}

export default function DesignPatternsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 relative overflow-hidden">
        <BackgroundPatterns />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern E-commerce Design Patterns
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A showcase of visually appealing background patterns designed for modern e-commerce websites
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pattern Card 1 */}
            <div className="glass-card rounded-xl p-6 backdrop-blur-sm border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Floating Particles</h2>
              <p className="text-gray-600 mb-4">
                Dynamic floating particles that create a sense of depth and movement.
              </p>
              <div className="h-32 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                <div className="absolute inset-0 floating-particles-bg opacity-30"></div>
              </div>
            </div>
            
            {/* Pattern Card 2 */}
            <div className="glass-card rounded-xl p-6 backdrop-blur-sm border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Liquid Blobs</h2>
              <p className="text-gray-600 mb-4">
                Organic, flowing shapes that create a modern and fluid aesthetic.
              </p>
              <div className="h-32 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 relative overflow-hidden">
                <div className="absolute inset-0 liquid-blobs-bg opacity-40"></div>
              </div>
            </div>
            
            {/* Pattern Card 3 */}
            <div className="glass-card rounded-xl p-6 backdrop-blur-sm border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Hexa Mesh</h2>
              <p className="text-gray-600 mb-4">
                Geometric hexagonal patterns that provide a tech-inspired look.
              </p>
              <div className="h-32 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
                <div className="absolute inset-0 hexa-mesh-bg opacity-20"></div>
              </div>
            </div>
            
            {/* Pattern Card 4 */}
            <div className="glass-card rounded-xl p-6 backdrop-blur-sm border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Organic Flow</h2>
              <p className="text-gray-600 mb-4">
                Smooth, flowing patterns that mimic natural forms and movements.
              </p>
              <div className="h-32 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden">
                <div className="absolute inset-0 organic-flow-bg opacity-30"></div>
              </div>
            </div>
            
            {/* Pattern Card 5 */}
            <div className="glass-card rounded-xl p-6 backdrop-blur-sm border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Crystalline</h2>
              <p className="text-gray-600 mb-4">
                Sharp, geometric patterns inspired by crystal structures.
              </p>
              <div className="h-32 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                <div className="absolute inset-0 crystalline-bg opacity-20"></div>
              </div>
            </div>
            
            {/* Pattern Card 6 */}
            <div className="glass-card rounded-xl p-6 backdrop-blur-sm border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Diamond Grid</h2>
              <p className="text-gray-600 mb-4">
                Elegant diamond-shaped patterns that add sophistication.
              </p>
              <div className="h-32 rounded-lg bg-gradient-to-br from-green-100 to-teal-100 relative overflow-hidden">
                <div className="absolute inset-0 diamond-bg opacity-20"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Layered Design Approach</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Our design system uses multiple layered patterns with varying opacities to create depth 
              while maintaining readability and visual appeal.
            </p>
            
            <div className="max-w-4xl mx-auto glass-card rounded-xl p-8 backdrop-blur-sm border border-white/20 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Pattern Layers</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">1</div>
                  <div>
                    <h4 className="font-semibold">Base Layer (Noise Texture)</h4>
                    <p className="text-gray-600 text-sm">Subtle texture for visual depth</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-4">2</div>
                  <div>
                    <h4 className="font-semibold">Primary Patterns</h4>
                    <p className="text-gray-600 text-sm">Floating particles, liquid blobs, hexa mesh</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold mr-4">3</div>
                  <div>
                    <h4 className="font-semibold">Secondary Patterns</h4>
                    <p className="text-gray-600 text-sm">Organic flow, crystalline, geometric</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-4">4</div>
                  <div>
                    <h4 className="font-semibold">Decorative Elements</h4>
                    <p className="text-gray-600 text-sm">Floating shapes, gradients, animations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}