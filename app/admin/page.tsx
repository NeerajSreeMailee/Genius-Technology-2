"use client"

"use client"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { InventoryAlerts } from "@/components/admin/inventory-alerts"
import { collection, query, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context" // Client-side auth context for user details
import { SalesCharts } from "@/components/admin/sales-charts" // Import SalesCharts
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    revenue: 0,
    newCustomers: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    if (!loading && (!user || (user as any).role !== "admin")) {
      router.push("/login")
      return
    }

    if (user?.role === "admin") {
      const q = query(collection(db, "orders"))
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

          const totalOrders = orders.length
          const revenue = orders.reduce((sum, order: any) => sum + (order.total || 0), 0)
          const newCustomers = new Set(orders.map((order: any) => order.userId)).size
          const conversionRate = 3.2 // Mock data, would be calculated from actual analytics

          setDashboardData({
            totalOrders,
            revenue,
            newCustomers,
            conversionRate,
          })
        },
        (error) => {
          console.error("Error fetching real-time dashboard data:", error)
        },
      )

      return () => unsubscribe()
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || (user as any).role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center">Access Denied</div>
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <DashboardStats data={dashboardData} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <RecentOrders />
            <InventoryAlerts />
          </div>
          <div className="mt-6">
            <SalesCharts /> {/* Integrate SalesCharts */}
          </div>
        </main>
      </div>
    </div>
  )
}
