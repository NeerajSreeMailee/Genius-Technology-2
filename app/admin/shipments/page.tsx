"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Package, Truck, AlertCircle, RefreshCw, Eye, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

interface FailedOrder {
  id: string
  total: number
  paymentStatus: string
  customerEmail: string
  createdAt: Date
  shippingAddress: any
  items: any[]
}

export default function ShipmentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [failedOrders, setFailedOrders] = useState<FailedOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [syncingOrderId, setSyncingOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || (user as any).role !== "admin")) {
      router.push("/login")
      return
    }

    if (user?.role === "admin") {
      fetchFailedOrders()
    }
  }, [user, loading, router])

  const fetchFailedOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/shiprocket/manual-sync')
      const data = await response.json()
      
      if (data.success) {
        setFailedOrders(data.failedOrders)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch failed orders",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching failed orders:", error)
      toast({
        title: "Error",
        description: "Failed to fetch failed orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSync = async (orderId: string) => {
    setSyncingOrderId(orderId)
    try {
      const response = await fetch('/api/shiprocket/manual-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Shipment created successfully!",
        })
        // Remove the order from failed orders list
        setFailedOrders(prev => prev.filter(order => order.id !== orderId))
      } else {
        toast({
          title: "Sync Failed",
          description: data.error || "Failed to create shipment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error syncing order:", error)
      toast({
        title: "Error",
        description: "Failed to sync order",
        variant: "destructive",
      })
    } finally {
      setSyncingOrderId(null)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || (user as any).role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center">Access Denied</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64 flex-1">
        <AdminHeader />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Shipment Management</h1>
            <Button onClick={fetchFailedOrders} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Shipments</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{failedOrders.length}</div>
                <p className="text-xs text-muted-foreground">
                  Orders needing manual sync
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{failedOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  From failed shipments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Required</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {failedOrders.filter(order => order.paymentStatus === 'paid').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Paid orders need shipment
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Orders Requiring Manual Shipment Creation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading failed orders...</div>
              ) : failedOrders.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All orders synced!</h3>
                  <p className="text-gray-600">No orders require manual shipment creation.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {failedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.shippingAddress?.fullName || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{order.customerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>₹{order.total?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              order.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleManualSync(order.id)}
                              disabled={syncingOrderId === order.id || order.paymentStatus !== 'paid'}
                            >
                              {syncingOrderId === order.id ? (
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <Package className="h-3 w-3 mr-1" />
                              )}
                              Create Shipment
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/orders/${order.id}`}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}