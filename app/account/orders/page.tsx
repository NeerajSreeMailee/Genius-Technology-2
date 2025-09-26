"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Header } from "@/components/header"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Truck, CheckCircle, XCircle, MapPin } from "lucide-react" // Removed FileText and Receipt imports
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/footer"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("orders")

  useEffect(() => {
    if (user?.id) {
      fetchOrders()
    }
  }, [user?.id])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter, dateFilter])

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders for user:', user?.id)
      const ordersQuery = query(
        collection(db, "orders"), 
        where("userId", "==", user!.id), 
        orderBy("createdAt", "desc")
      )
      const snapshot = await getDocs(ordersQuery)
      const ordersData = snapshot.docs.map((doc) => {
        const data = doc.data()
        console.log('Order data:', data)
        return {
          id: doc.id,
          ...data,
          // Ensure proper field mapping
          orderStatus: data.status || data.orderStatus || 'pending',
          total: data.total || 0,
          items: data.items || [],
          createdAt: data.createdAt,
          shippingAddress: data.shippingAddress || {},
          paymentStatus: data.paymentStatus || 'pending',
          paymentMethod: data.paymentMethod || 'unknown',
          shippingTrackingId: data.shippingTrackingId || null,
        }
      })
      console.log('Processed orders:', ordersData)
      setOrders(ordersData)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items?.some((item: any) => 
            (item.productName || 'Unknown Product').toLowerCase().includes(searchTerm.toLowerCase())
          ),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "3months":
          filterDate.setMonth(now.getMonth() - 3)
          break
      }

      filtered = filtered.filter((order) => order.createdAt?.toDate?.() >= filterDate)
    }

    setFilteredOrders(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />
      case "processing":
        return <Package className="h-4 w-4 text-yellow-600" />
      case "confirmed":
        return <Package className="h-4 w-4 text-yellow-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
      case "confirmed":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="lg:col-span-3">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600">{filteredOrders.length} orders found</p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setDateFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-6">
                    {orders.length === 0
                      ? "You haven't placed any orders yet."
                      : "No orders match your current filters."}
                  </p>
                  <Link href="/products">
                    <Button>Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                          <p className="text-sm text-gray-600">
                            Placed on {order.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(order.orderStatus)}>
                            {getStatusIcon(order.orderStatus)}
                            <span className="ml-1 capitalize">{order.orderStatus || "pending"}</span>
                          </Badge>
                          <Link href={`/account/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                          {order.items?.slice(0, 3).map((item: any, index: number) => (
                            <div key={index} className="flex items-center space-x-3 flex-shrink-0">
                              <div className="relative w-16 h-16">
                                <Image
                                  src={item.image || item.imageUrl || "/placeholder.svg"}
                                  alt={item.productName || 'Unknown Product'}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{item.productName || 'Unknown Product'}</p>
                                <p className="text-xs text-gray-600">Qty: {item.quantity || 1}</p>
                                <p className="text-xs font-medium">₹{(item.price || 0).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded text-sm font-medium text-gray-600">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>

                        {/* Order Summary */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            <span>{order.items?.length || 0} items</span>
                            <span className="mx-2">•</span>
                            <span>Total: ₹{(order.total || 0).toLocaleString()}</span>
                            {order.paymentStatus && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="capitalize">Payment: {order.paymentStatus}</span>
                              </>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {order.orderStatus === "delivered" && (
                              <Button variant="outline" size="sm">
                                Rate & Review
                              </Button>
                            )}
                            {(order.orderStatus === "shipped" || order.orderStatus === "confirmed") && order.shippingTrackingId && (
                              <Link href={`/account/orders/${order.id}/track`}>
                                <Button variant="outline" size="sm">
                                  <MapPin className="h-4 w-4 mr-1" /> Track Order
                                </Button>
                              </Link>
                            )}
                          </div>

                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
