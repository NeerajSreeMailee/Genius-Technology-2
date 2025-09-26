"use client"

import { getAllMobileCollectionItems, getMobileCollectionByBrand } from "@/lib/firebase-collections"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DebugMobilePage() {
  const [mobileData, setMobileData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testBrand, setTestBrand] = useState("vivo")
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

  const testBrandSearch = async () => {
    setTestLoading(true)
    try {
      const results = await getMobileCollectionByBrand(testBrand)
      setTestResults(results)
      console.log(`Brand test results for "${testBrand}":`, results)
    } catch (err) {
      console.error("Error testing brand search:", err)
    } finally {
      setTestLoading(false)
    }
  }

  const categories = [...new Set(mobileData.map(item => item.Category).filter(Boolean))]
  const availableFields = mobileData.length > 0 ? Object.keys(mobileData[0]) : []

  if (loading) return <div className="p-8">Loading mobile collection data...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Mobile Collection Debug Page</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Collection Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Total Documents:</strong> {mobileData.length}</p>
          <p><strong>Available Categories:</strong> {categories.length}</p>
          <p><strong>Sample Fields:</strong> {availableFields.join(", ")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Categories/Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map((category, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded">
                {category}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Documents (First 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mobileData.slice(0, 5).map((item, index) => (
              <div key={index} className="p-4 border rounded">
                <h3 className="font-semibold">Document ID: {item.id}</h3>
                <div className="mt-2 text-sm">
                  <p><strong>Category:</strong> {item.Category || "N/A"}</p>
                  <p><strong>Name:</strong> {item.name || item.Name || "N/A"}</p>
                  <p><strong>Price:</strong> {item.price || item.Price || "N/A"}</p>
                  <p><strong>All Fields:</strong> {Object.keys(item).join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Brand Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input 
              value={testBrand} 
              onChange={(e) => setTestBrand(e.target.value)}
              placeholder="Enter brand name (e.g., vivo, samsung, oppo)"
              className="flex-1"
            />
            <Button onClick={testBrandSearch} disabled={testLoading}>
              {testLoading ? "Testing..." : "Test Brand"}
            </Button>
          </div>
          {testResults.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Found {testResults.length} products for "{testBrand}":</h4>
              <div className="space-y-2">
                {testResults.slice(0, 3).map((item, index) => (
                  <div key={index} className="p-2 bg-green-100 rounded text-sm">
                    <p><strong>ID:</strong> {item.id}</p>
                    <p><strong>Category:</strong> {item.Category}</p>
                    <p><strong>Name:</strong> {item.name || item.Name || "N/A"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {testResults.length === 0 && testBrand && !testLoading && (
            <div className="mt-4 p-3 bg-red-100 rounded text-red-700">
              No products found for "{testBrand}". Check the available categories below.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Complete Data Dump</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
            {JSON.stringify(mobileData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}