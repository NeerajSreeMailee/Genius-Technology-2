import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DesignPatternsDocumentation() {
  const patterns = [
    {
      id: "background",
      title: "Background Patterns",
      description: "Collection of visually appealing background patterns",
      patterns: [
        {
          name: "Floating Dots",
          description: "Animated polka dot pattern with floating animation",
          classes: "floating-dots-bg",
          usage: '<div class="floating-dots-bg"></div>'
        },
        {
          name: "Gradient Waves",
          description: "Smooth wave-like gradient transitions",
          classes: "gradient-waves-bg",
          usage: '<div class="gradient-waves-bg"></div>'
        },
        {
          name: "Hexa Mesh",
          description: "Hexagonal grid pattern",
          classes: "hexa-mesh-bg",
          usage: '<div class="hexa-mesh-bg"></div>'
        },
        {
          name: "Neon Glow Shapes",
          description: "Glowing geometric shapes",
          classes: "neon-glow-bg",
          usage: '<div class="neon-glow-bg"></div>'
        },
        {
          name: "Liquid Blobs",
          description: "Organic blob shapes with gradient",
          classes: "liquid-blobs-bg",
          usage: '<div class="liquid-blobs-bg"></div>'
        },
        {
          name: "Radial Glow",
          description: "Concentric circle glow effect",
          classes: "radial-glow-bg",
          usage: '<div class="radial-glow-bg"></div>'
        },
        {
          name: "Diagonal Stripes",
          description: "Clean diagonal line pattern",
          classes: "diagonal-stripes-bg",
          usage: '<div class="diagonal-stripes-bg"></div>'
        },
        {
          name: "Polygon Mesh",
          description: "Low-poly geometric pattern",
          classes: "polygon-mesh-bg",
          usage: '<div class="polygon-mesh-bg"></div>'
        },
        {
          name: "Subtle Texture",
          description: "Fine grain texture",
          classes: "subtle-texture-bg",
          usage: '<div class="subtle-texture-bg"></div>'
        },
        {
          name: "Floating Particles",
          description: "Animated particle background",
          classes: "floating-particles-bg",
          usage: '<div class="floating-particles-bg"></div>'
        }
      ]
    },
    {
      id: "section",
      title: "Section Design Patterns",
      description: "Modern section styling patterns",
      patterns: [
        {
          name: "Glass Morphism Card",
          description: "Frosted glass effect with backdrop blur",
          classes: "glass-card",
          usage: '<div class="glass-card">Content</div>'
        },
        {
          name: "Gradient Border",
          description: "Animated multicolor gradient border",
          classes: "gradient-border",
          usage: '<div class="gradient-border">Content</div>'
        },
        {
          name: "Floating Card",
          description: "Hover effect with elevation and shadow",
          classes: "floating-card",
          usage: '<div class="floating-card">Content</div>'
        },
        {
          name: "Neon Glow Card",
          description: "Neon glow effect with hover enhancement",
          classes: "neon-glow-card",
          usage: '<div class="neon-glow-card">Content</div>'
        },
        {
          name: "Layered Paper",
          description: "Realistic paper stack shadow effect",
          classes: "layered-paper",
          usage: '<div class="layered-paper">Content</div>'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/design-patterns">
            <Button variant="outline" className="mb-4">← Back to Showcase</Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Design Patterns Documentation</h1>
          <p className="text-lg text-gray-600">
            Comprehensive guide to implementing visually appealing design patterns
          </p>
        </div>

        {patterns.map((category) => (
          <section key={category.id} className="mb-16">
            <h2 className="text-3xl font-semibold mb-4">{category.title}</h2>
            <p className="text-gray-600 mb-8">{category.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.patterns.map((pattern, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xl font-semibold mb-2">{pattern.name}</h3>
                  <p className="text-gray-600 mb-4">{pattern.description}</p>
                  
                  <div className="mb-4 p-4 rounded-lg bg-gray-50">
                    <code className="text-sm">{pattern.usage}</code>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">CSS Class:</span> 
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded">{pattern.classes}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Implementation Tips</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Combine multiple patterns for layered visual effects</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Use opacity modifiers to control pattern intensity</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Apply patterns to pseudo-elements for better performance</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Use z-index to control layering of pattern elements</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Adjust animation durations for smoother transitions</span>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  )
}