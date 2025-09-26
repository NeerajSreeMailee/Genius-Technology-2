"use client"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { getAllMobileCollectionItems, getMobileCollectionByBrand } from "@/lib/firebase-collections"
import { Footer } from "@/components/footer"

export default function MobileTestPage() {
  const [allMobiles, setAllMobiles] = useState<any[]>([])
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState('')

  useEffect(() => {
    const fetchAllMobiles = async () => {
      try {
        setLoading(true)
        const mobiles = await getAllMobileCollectionItems()
        setAllMobiles(mobiles)
        console.log('Fetched all mobiles:', mobiles.length)
        
        // Get unique brands
        const uniqueBrands = [...new Set(mobiles.map((mobile: any) => mobile.Brand).filter(Boolean))]
        console.log('Available brands:', uniqueBrands)
      } catch (error) {
        console.error('Error fetching mobiles:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAllMobiles()
  }, [])

  const testBrandProducts = async (brand: string) => {
    try {
      setLoading(true)
      setSelectedBrand(brand)
      
      const brandProducts = await getMobileCollectionByBrand(brand.toLowerCase().replace(/\s+/g, '-'))
      console.log(`Testing brand ${brand}:`, brandProducts)
      
      const results = brandProducts.map((product: any) => ({
        id: product.id,
        name: product.name || product.Name || product.id,
        brand: product.Brand || product.brand,
        hasName: !!(product.name || product.Name),
        hasPrice: !!(product.price || product.Price),
        hasImages: !!(product.images && product.images.length > 0),
        hasDescription: !!(product.description || product.Description),
        totalFields: Object.keys(product).length,
        dataCompleteness: Math.round((Object.entries(product).filter(([key, value]) => 
          value !== null && value !== undefined && value !== ''
        ).length / Object.keys(product).length) * 100)
      }))
      
      setTestResults(results)
    } catch (error) {
      console.error('Error testing brand products:', error)
    } finally {
      setLoading(false)
    }
  }

  const uniqueBrands = [...new Set(allMobiles.map((mobile: any) => mobile.Brand).filter(Boolean))]

  return (
    <div className="flex flex-col min-h-screen bg-background pt-24">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Mobile Collection Test Page</h1>
          <p className="text-gray-600 mb-4">
            This page helps test the mobile detail functionality and data completeness across different brands.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* All Products Overview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Collection Overview</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-3">
                <p>Total Products: <span className="font-semibold">{allMobiles.length}</span></p>
                <p>Available Brands: <span className="font-semibold">{uniqueBrands.length}</span></p>
                
                <div>
                  <h3 className="font-semibold mb-2">Brands List:</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueBrands.map((brand: string) => (
                      <Button
                        key={brand}
                        variant={selectedBrand === brand ? "default" : "outline"}
                        size="sm"
                        onClick={() => testBrandProducts(brand)}
                      >
                        {brand}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Quick Stats:</h3>
                  <div className="text-sm space-y-1">
                    <p>Products with names: {allMobiles.filter(m => m.name || m.Name).length}</p>
                    <p>Products with prices: {allMobiles.filter(m => m.price || m.Price).length}</p>
                    <p>Products with images: {allMobiles.filter(m => m.images || m.image).length}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Brand Test Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Brand Test Results {selectedBrand && `- ${selectedBrand}`}
            </h2>
            {testResults.length > 0 ? (
              <div className="space-y-3">
                <p>Products Found: <span className="font-semibold">{testResults.length}</span></p>
                
                <div className="max-h-64 overflow-y-auto">
                  {testResults.map((result: any, index: number) => (
                    <div key={result.id} className="border-b pb-2 mb-2 last:border-b-0">
                      <div className="flex justify-between items-start mb-1">
                        <Link 
                          href={`/mobile/${result.id}`}
                          className="text-blue-600 hover:underline font-medium text-sm"
                        >
                          {result.name || `Product ${index + 1}`}
                        </Link>
                        <span className="text-xs text-gray-500">{result.dataCompleteness}%</span>
                      </div>
                      
                      <div className="flex gap-2 text-xs">
                        <span className={result.hasName ? 'text-green-600' : 'text-red-600'}>
                          Name: {result.hasName ? '✓' : '✗'}
                        </span>
                        <span className={result.hasPrice ? 'text-green-600' : 'text-red-600'}>
                          Price: {result.hasPrice ? '✓' : '✗'}
                        </span>
                        <span className={result.hasImages ? 'text-green-600' : 'text-red-600'}>
                          Images: {result.hasImages ? '✓' : '✗'}
                        </span>
                        <span className={result.hasDescription ? 'text-green-600' : 'text-red-600'}>
                          Desc: {result.hasDescription ? '✓' : '✗'}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {result.id} | Fields: {result.totalFields}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-sm">
                  <h4 className="font-semibold">Summary:</h4>
                  <p>Complete products: {testResults.filter(r => r.hasName && r.hasPrice && r.hasImages).length}/{testResults.length}</p>
                  <p>Average completeness: {Math.round(testResults.reduce((sum, r) => sum + r.dataCompleteness, 0) / testResults.length)}%</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Select a brand to test its products</p>
            )}
          </Card>
        </div>

        {/* Test Actions */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/firebase-test">
              <Button variant="outline">Firebase Connection Test</Button>
            </Link>
            <Link href="/brand-test">
              <Button variant="outline">Brand Filtering Test</Button>
            </Link>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Refresh Data
            </Button>
          </div>
        </Card>

        {/* Development Info */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="p-6 mt-6 bg-yellow-50 border-yellow-200">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">Development Information</h2>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>This test page helps verify that:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All products from the mobile collection are accessible</li>
                <li>Brand filtering works correctly</li>
                <li>Product detail pages load with complete information</li>
                <li>Data transformation preserves all available fields</li>
                <li>Products have adequate data completeness for proper display</li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-yellow-300">
                <p className="font-semibold">Testing Workflow:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Select a brand to test its products</li>
                  <li>Review the data completeness percentages</li>
                  <li>Click on individual product links to test detail pages</li>
                  <li>Verify that ALL details are displayed on each product page</li>
                  <li>Check the debug information on product pages in development mode</li>
                </ol>
              </div>
            </div>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}