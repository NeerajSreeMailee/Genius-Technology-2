"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Header } from "@/components/layout/header"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/layout/footer"

import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  CreditCard, 
  Calendar, 
  User, 
  Phone, 
  Mail,
  FileText,
  Receipt,
  Download,
  Printer
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    if (user?.id && params.id) {
      fetchOrder()
    }
  }, [user?.id, params.id])

  const fetchOrder = async () => {
    try {
      const orderDoc = await getDoc(doc(db, "orders", params.id))
      if (orderDoc.exists() && orderDoc.data().userId === user!.id) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() })
      } else {
        // Order not found or doesn't belong to user
        router.push("/account/orders")
      }
    } catch (error) {
      console.error("Error fetching order:", error)
      router.push("/account/orders")
    } finally {
      setLoading(false)
    }
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

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "razorpay":
        return "Razorpay"
      case "cod":
        return "Cash on Delivery"
      case "stripe":
        return "Stripe"
      case "payu":
        return "PayU"
      default:
        return "Unknown"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (date: any) => {
    if (!date) return "N/A"
    return new Date(date?.seconds ? date.seconds * 1000 : date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const generateInvoice = () => {
    // In a real implementation, this would generate a PDF invoice
    alert("Invoice generation functionality would be implemented here.")
  }

  const generateReceipt = () => {
    // In a real implementation, this would generate a PDF receipt
    alert("Receipt generation functionality would be implemented here.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <AccountSidebar activeTab="orders" onTabChange={() => {}} />
            <div className="lg:col-span-3">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
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
          <AccountSidebar activeTab="orders" onTabChange={() => {}} />

          <div className="lg:col-span-3">
            <div className="mb-6">
              <Link href="/account/orders" className="text-blue-600 hover:underline flex items-center mb-4">
                ← Back to Orders
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                  <p className="text-gray-600">Order #{order?.id?.slice(-8)}</p>
                </div>
                <Badge className={getStatusColor(order?.orderStatus || order?.status || "pending")}>
                  {getStatusIcon(order?.orderStatus || order?.status || "pending")}
                  <span className="ml-1 capitalize">
                    {order?.orderStatus || order?.status || "pending"}
                  </span>
                </Badge>
              </div>
            </div>

            {/* Order Summary Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Summary</span>
                  <div className="flex space-x-2">
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(order?.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium text-lg">
                      {formatCurrency(order?.total || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      {getPaymentMethodLabel(order?.paymentMethod)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className="font-medium capitalize">
                      {order?.paymentStatus || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Items in this Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order?.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.productName || "Product"}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productName || "Unknown Product"}</h3>
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <p className="text-sm text-gray-600">
                            {Object.entries(item.selectedOptions)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity || 1}
                          </p>
                          <p className="font-medium">
                            {formatCurrency((item.price || 0) * (item.quantity || 1))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total Breakdown */}
                <div className="mt-6 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(order?.subtotal || 0)}</span>
                    </div>
                    {order?.couponDiscountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount</span>
                        <span>-{formatCurrency(order?.couponDiscountAmount || 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span>
                        {order?.deliveryFee === 0 ? "FREE" : formatCurrency(order?.deliveryFee || 0)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(order?.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Billing Address */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order?.shippingAddress?.fullName || order?.shippingAddress?.name}</p>
                    <p>{order?.shippingAddress?.addressLine1}</p>
                    {order?.shippingAddress?.addressLine2 && (
                      <p>{order?.shippingAddress?.addressLine2}</p>
                    )}
                    <p>
                      {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.pincode}
                    </p>
                    <div className="pt-2">
                      <p className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        {order?.shippingAddress?.phone}
                      </p>
                      {order?.customerEmail && (
                        <p className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2" />
                          {order?.customerEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Billing Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order?.shippingAddress?.fullName || order?.shippingAddress?.name}</p>
                    <p>{order?.shippingAddress?.addressLine1}</p>
                    {order?.shippingAddress?.addressLine2 && (
                      <p>{order?.shippingAddress?.addressLine2}</p>
                    )}
                    <p>
                      {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.pincode}
                    </p>
                    <div className="pt-2">
                      <p className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        {order?.shippingAddress?.phone}
                      </p>
                      {order?.customerEmail && (
                        <p className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2" />
                          {order?.customerEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Actions */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}