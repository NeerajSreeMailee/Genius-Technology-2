"use client"

import { redirect } from "next/navigation"
import { CorporateSidebar } from "@/components/corporate/corporate-sidebar"
import { AdminHeader } from "@/components/admin/admin-header" // Reusing AdminHeader for now
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { CorporateOrder } from "@/types"
import { FileText, ShoppingCart, DollarSign } from "lucide-react" // Importing the missing variables

export default function CorporateDashboardPage() {
  const { user, loading } = useAuth()
  const [corporateOrders, setCorporateOrders] = useState<CorporateOrder[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)

  useEffect(() => {
    if (!loading && user) {
      // In a real app, you'd check for a specific 'corporate' role or company association
      // For now, we'll assume any logged-in user can access this placeholder dashboard
      // and fetch their corporate orders if they have any.
      fetchCorporateOrders(user.id)
    } else if (!loading && !user) {
      redirect("/login") // Redirect if not logged in
    }
  }, [user, loading])

  const fetchCorporateOrders = async (userId: string) => {
    setIsLoadingOrders(true)
    try {
      // In a real scenario, corporate orders might be linked to a company ID,
      // and users would be linked to that company. For simplicity, linking to userId.
      const q = query(collection(db, "corporateOrders"), where("contactPersonId", "==", userId))
      const querySnapshot = await getDocs(q)
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as CorporateOrder[]
      setCorporateOrders(orders)
    } catch (error) {
      console.error("Error fetching corporate orders:", error)
    } finally {
      setIsLoadingOrders(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading corporate dashboard...</div>
  }

  if (!user) {
    return null // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CorporateSidebar />
      <div className="lg:pl-64">
        <AdminHeader /> {/* Reusing AdminHeader for now, could be a CorporateHeader */}
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Corporate Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.firstName}!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{corporateOrders.length}</div>
                <p className="text-xs text-muted-foreground">Your total corporate inquiries</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {corporateOrders.filter((order) => order.status === "approved").length}
                </div>
                <p className="text-xs text-muted-foreground">Orders approved for processing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    corporateOrders.filter(
                      (order) => order.status === "quote_requested" || order.status === "quote_sent",
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Quotes awaiting your action or our response</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Corporate Orders/Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-center py-4">Loading recent orders...</div>
                ) : corporateOrders.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No corporate orders or quotes found.</div>
                ) : (
                  <div className="space-y-4">
                    {corporateOrders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium">Order ID: {order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">Company: {order.companyName}</p>
                          <p className="text-sm text-gray-600">Status: {order.status.replace(/_/g, " ")}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Qty: {order.totalQuantity}</p>
                          <p className="text-sm text-gray-600">
                            Est. Total: ₹{order.estimatedTotal?.toLocaleString() || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
