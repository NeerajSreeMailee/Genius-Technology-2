import { Suspense } from "react"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { InventoryAlerts } from "@/components/admin/inventory-alerts"
import { PerformanceCharts } from "@/components/admin/performance-charts"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

// Dynamically import heavy components
import dynamic from "next/dynamic"

const SalesCharts = dynamic(() => import("@/components/admin/sales-charts"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-200 rounded-xl h-80 animate-pulse"></div>
      <div className="bg-gray-200 rounded-xl h-80 animate-pulse"></div>
    </div>
  )
})

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to your admin dashboard</p>
          </div>
          
          <DashboardStats />
          
          <div className="mt-6">
            <Suspense fallback={
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-200 rounded-xl h-80 animate-pulse"></div>
                <div className="bg-gray-200 rounded-xl h-80 animate-pulse"></div>
              </div>
            }>
              <SalesCharts />
            </Suspense>
          </div>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentOrders />
            <InventoryAlerts />
          </div>
          
          <div className="mt-6">
            <PerformanceCharts />
          </div>
        </main>
      </div>
    </div>
  )
}