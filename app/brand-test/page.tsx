"use client"

import { getAllMobileCollectionItems, getMobileCollectionByBrand } from "@/lib/firebase-collections"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"

export default function BrandTestPage() {
  const [mobileData, setMobileData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testBrand, setTestBrand] = useState<string>("")
  const [testResults, setTestResults] = useState<any[]>([])
  const [testLoading, setTestLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getAllMobileCollectionItems()
        setMobileData(data)
        console.log("All mobile collection data:", data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch mobile data")
        console.error("Error fetching mobile data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const testBrandFilter = async (brand: string) => {
    setTestLoading(true)
    try {
      console.log(`Testing brand filter for: "${brand}"`)
      const results = await getMobileCollectionByBrand(brand)
      setTestResults(results)
      console.log(`Test results for brand "${brand}":`, results)
      
      // Also test by fetching all documents and checking brand field specifically
      const allDocsSnapshot = await getDocs(collection(db, "mobile"))
      const allDocs = allDocsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      
      console.log('All documents in mobile collection:')
      allDocs.forEach((doc: any, index) => {
        console.log(`Document ${index + 1}:`, {
          id: doc.id,
          Brand: doc.Brand, // Only checking Brand field now
          name: doc.name || doc.Name,
          availableFields: Object.keys(doc)
        })
      })
      
    } catch (err) {
      console.error(`Error testing brand "${brand}":`, err)
      setTestResults([])
    } finally {
      setTestLoading(false)
    }
  }

  const categories = [...new Set(mobileData.map(item => item.Brand).filter(Boolean))]
  const brandCounts = mobileData.reduce((acc: Record<string, number>, item) => {
    const brand = item.Brand || 'Unknown'
    acc[brand] = (acc[brand] || 0) + 1
    return acc
  }, {})

  if (loading) return <div className="p-8">Loading mobile collection data...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Brand Test Page</h1>
      
      {/* Brand Filter Test */}
      <Card>
        <CardHeader>
          <CardTitle>Test Brand Filtering</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter brand name (e.g., vivo, samsung)"
              value={testBrand}
              onChange={(e) => setTestBrand(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <Button 
              onClick={() => testBrandFilter(testBrand)}
              disabled={testLoading || !testBrand}
            >
              {testLoading ? "Testing..." : "Test Filter"}
            </Button>
          </div>
          
          {testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Test Results for "{testBrand}" ({testResults.length} products):</h4>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {testResults.map((item, index) => (
                  <div key={index} className="text-sm py-1 border-b">
                    <strong>{item.name || item.Name || item.id}:</strong> Category: "{item.Category || item.category}", Brand: "{item.brand || item.Brand}"
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {testBrand && testResults.length === 0 && !testLoading && (
            <div className="text-red-500">No products found for brand "{testBrand}"</div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Brands in Mobile Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4"><strong>Total Documents:</strong> {mobileData.length}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(brandCounts).map(([brand, count]) => {
              const brandSlug = brand.toLowerCase().replace(/\s+/g, '-')
              return (
                <Card key={brand} className="p-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold">{brand}</h3>
                    <p className="text-sm text-gray-600">{count} products</p>
                    <div className="space-y-1">
                      <Link 
                        href={`/brand/${brandSlug}`}
                        className="block text-blue-600 hover:underline text-sm"
                      >
                        View Brand Page
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTestBrand(brand)
                          testBrandFilter(brand)
                        }}
                        className="text-xs"
                      >
                        Test Filter
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Products by Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {categories.slice(0, 10).map((brand) => {
              const productsInBrand = mobileData.filter(item => item.Brand === brand)
              return (
                <div key={brand} className="border-b pb-2">
                  <h4 className="font-semibold text-lg">{brand}</h4>
                  <ul className="ml-4 text-sm">
                    {productsInBrand.slice(0, 3).map((product, index) => (
                      <li key={index}>
                        • {product.name || product.Name || product.id} 
                        <Link 
                          href={`/mobile/${product.id}`}
                          className="ml-2 text-blue-600 hover:underline"
                        >
                          (View Details)
                        </Link>
                      </li>
                    ))}
                    {productsInBrand.length > 3 && (
                      <li className="text-gray-500">
                        ... and {productsInBrand.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}