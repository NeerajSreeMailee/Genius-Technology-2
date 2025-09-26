"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DesignPatternsShowcase() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Design Patterns Showcase</h1>
      
      {/* Background Patterns Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Background Patterns</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Floating Dots */}
          <Card className="overflow-hidden">
            <div className="h-40 floating-dots-bg"></div>
            <CardHeader>
              <CardTitle>Floating Dots</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Animated polka dot pattern with floating animation</p>
              <code className="text-xs bg-gray-100 p-2 rounded">class="floating-dots-bg"</code>
            </CardContent>
          </Card>
          
          {/* Gradient Waves */}
          <Card className="overflow-hidden">
            <div className="h-40 gradient-waves-bg"></div>
            <CardHeader>
              <CardTitle>Gradient Waves</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Smooth wave-like gradient transitions</p>
              <code className="text-xs bg-gray-100 p-2 rounded">class="gradient-waves-bg"</code>
            </CardContent>
          </Card>
          
          {/* Hexa Mesh */}
          <Card className="overflow-hidden">
            <div className="h-40 hexa-mesh-bg"></div>
            <CardHeader>
              <CardTitle>Hexa Mesh</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Hexagonal grid pattern</p>
              <code className="text-xs bg-gray-100 p-2 rounded">class="hexa-mesh-bg"</code>
            </CardContent>
          </Card>
          
          {/* Neon Glow Shapes */}
          <Card className="overflow-hidden">
            <div className="h-40 neon-glow-bg"></div>
            <CardHeader>
              <CardTitle>Neon Glow Shapes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Glowing geometric shapes</p>
              <code className="text-xs bg-gray-100 p-2 rounded">class="neon-glow-bg"</code>
            </CardContent>
          </Card>
          
          {/* Liquid Blobs */}
          <Card className="overflow-hidden">
            <div className="h-40 liquid-blobs-bg"></div>
            <CardHeader>
              <CardTitle>Liquid Blobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Organic blob shapes with gradient</p>
              <code className="text-xs bg-gray-100 p-2 rounded">class="liquid-blobs-bg"</code>
            </CardContent>
          </Card>
          
          {/* Radial Glow */}
          <Card className="overflow-hidden">
            <div className="h-40 radial-glow-bg"></div>
            <CardHeader>
              <CardTitle>Radial Glow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Concentric circle glow effect</p>
              <code className="text-xs bg-gray-100 p-2 rounded">class="radial-glow-bg"</code>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Section Patterns Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Section Design Patterns</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Glass Morphism Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Glass Morphism</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Frosted glass effect with backdrop blur</p>
              <code className="text-xs bg-gray-100 p-2 rounded">class="glass-card"</code>
            </CardContent>
          </Card>
          
          {/* Gradient Border */}
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle>Gradient Border</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Animated multicolor gradient border</p>
              <code className="text-xs bg-gray-100 p-2 rounded">class="gradient-border"</code>
            </CardContent>
          </Card>
          
          {/* Floating Card */}
          <Card className="floating-card">
            <CardHeader>
              <CardTitle>Floating Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Hover effect with elevation and shadow</p>
              <code className="text-xs bg-gray-100 p-2 rounded">class="floating-card"</code>
            </CardContent>
          </Card>
          
          {/* Neon Glow Card */}
          <Card className="neon-glow-card">
            <CardHeader>
              <CardTitle>Neon Glow Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Neon glow effect with hover enhancement</p>
              <code className="text-xs bg-gray-100 p-2 rounded">class="neon-glow-card"</code>
            </CardContent>
          </Card>
          
          {/* Layered Paper */}
          <Card className="layered-paper">
            <CardHeader>
              <CardTitle>Layered Paper</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Realistic paper stack shadow effect</p>
              <code className="text-xs bg-gray-100 p-2 rounded">class="layered-paper"</code>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Usage Examples */}
      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center">Usage Examples</h2>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Background Pattern Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Apply directly to any element as a background
<div className="floating-dots-bg"></div>
<div className="gradient-waves-bg"></div>
<div className="hexa-mesh-bg"></div>
<div className="neon-glow-bg"></div>
<div className="liquid-blobs-bg"></div>
<div className="radial-glow-bg"></div>
<div className="diagonal-stripes-bg"></div>
<div className="polygon-mesh-bg"></div>
<div className="subtle-texture-bg"></div>
<div className="floating-particles-bg"></div>`}
            </pre>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Section Pattern Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Apply to cards, sections, or containers
<Card className="glass-card">...</Card>
<Card className="gradient-border">...</Card>
<Card className="floating-card">...</Card>
<Card className="neon-glow-card">...</Card>
<Card className="layered-paper">...</Card>`}
            </pre>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button asChild>
            <a href="https://github.com/your-repo/design-patterns" target="_blank" rel="noopener noreferrer">
              View Full Documentation
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}