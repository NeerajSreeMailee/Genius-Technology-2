"use client"

import { useState, useEffect } from "react"
import { collection, query, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PerformanceCharts() {
  const [salesData, setSalesData] = useState<any[]>([])
  const [loadingSales, setLoadingSales] = useState(true)

  // Mock data for traffic - in a real app, you'd fetch this from your analytics
  const trafficData = [
    { source: "Direct", visitors: 4500, percentage: 35 },
    { source: "Search", visitors: 3200, percentage: 25 },
    { source: "Social", visitors: 2600, percentage: 20 },
    { source: "Email", visitors: 1300, percentage: 10 },
    { source: "Referral", visitors: 1300, percentage: 10 },
  ]

  useEffect(() => {
    const q = query(collection(db, "orders"))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

        // Aggregate sales data by month (mocking for simplicity, real aggregation would be more complex)
        const monthlySales: { [key: string]: number } = {}
        orders.forEach((order: any) => {
          if (order.createdAt && order.total) {
            const date = order.createdAt.toDate()
            const month = date.toLocaleString("default", { month: "short" })
            const year = date.getFullYear()
            const monthYear = `${month} ${year}`
            monthlySales[monthYear] = (monthlySales[monthYear] || 0) + order.total
          }
        })

        // Convert to array format for charting, sorting by month
        const sortedSalesData = Object.keys(monthlySales)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map((monthYear) => ({
            month: monthYear.split(" ")[0], // Just month name for display
            sales: monthlySales[monthYear],
          }))
          .slice(-6) // Show last 6 months

        setSalesData(sortedSalesData)
        setLoadingSales(false)
      },
      (error) => {
        console.error("Error fetching real-time sales data:", error)
        setLoadingSales(false)
      },
    )

    return () => unsubscribe() // Cleanup listener on unmount
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSales ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : salesData.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No sales data available.</p>
          ) : (
            <div className="space-y-4">
              {salesData.map((data) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(data.sales / Math.max(...salesData.map((s) => s.sales))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">₹{data.sales.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficData.map((data) => (
              <div key={data.source} className="flex items-center justify-between">
                <span className="text-sm font-medium">{data.source}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-600">{data.visitors.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
