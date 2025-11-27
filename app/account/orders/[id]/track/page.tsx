"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Header } from "@/components/layout/header"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin } from "lucide-react"
import { getTrackingDetails } from "@/actions/shipping"
import type { Order, TrackingEvent } from "@/types"
import Link from "next/link"
import { Footer } from "@/components/layout/footer"

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderAndTracking = async () => {
      if (!orderId) return

      setLoading(true)
      setError(null)
      try {
        // Fetch order details
        const orderRef = doc(db, "orders", orderId)
        const orderSnap = await getDoc(orderRef)

        if (!orderSnap.exists()) {
          setError("Order not found.")
          setLoading(false)
          return
        }
        const orderData = { id: orderSnap.id, ...orderSnap.data() } as Order
        setOrder(orderData)

        // Fetch tracking details if trackingId exists
        if (orderData.shippingTrackingId) {
          const trackingResult = await getTrackingDetails(orderData.shippingTrackingId)
          if (trackingResult.success) {
            setTrackingEvents(trackingResult.events)
          } else {
            setError(trackingResult.message)
          }
        } else {
          setError("No tracking ID available for this order yet.")
        }
      } catch (err) {
        console.error("Error fetching order or tracking:", err)
        setError("Failed to load order or tracking details.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderAndTracking()
  }, [orderId])

  const getStatusIcon = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes("delivered")) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (lowerStatus.includes("shipped") || lowerStatus.includes("out for delivery"))
      return <Truck className="h-5 w-5 text-blue-600" />
    if (lowerStatus.includes("pending") || lowerStatus.includes("processing") || lowerStatus.includes("confirmed"))
      return <Package className="h-5 w-5 text-yellow-600" />
    if (lowerStatus.includes("cancelled")) return <XCircle className="h-5 w-5 text-red-600" />
    return <Clock className="h-5 w-5 text-gray-600" />
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
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <AccountSidebar activeTab="orders" onTabChange={() => {}} />
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Tracking Details</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <Link href={`/account/orders/${orderId}`}>
                    <Button>Back to Order Details</Button>
                  </Link>
                </CardContent>
              </Card>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
          <p className="text-gray-600">
            Order ID: <span className="font-medium">#{order?.id.slice(-8)}</span>
          </p>
          {order?.shippingTrackingId && (
            <p className="text-gray-600">
              Tracking ID: <span className="font-medium">{order.shippingTrackingId}</span>
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <AccountSidebar activeTab="orders" onTabChange={() => {}} />


          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Progress</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {trackingEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tracking updates yet</h3>
                    <p className="text-gray-600">Please check back later for updates on your shipment.</p>
                  </div>
                ) : (
                  <div className="relative pl-8">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    {trackingEvents.map((event, index) => (
                      <div key={index} className="mb-8 flex items-start relative">
                        <div className="absolute left-0 -translate-x-1/2 bg-white p-1 rounded-full z-10">
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="ml-6 flex-1">
                          <p className="font-semibold text-gray-900">{event.status}</p>
                          <p className="text-sm text-gray-600">{new Date(event.timestamp).toLocaleString()}</p>
                          <p className="text-sm text-gray-700 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {event.location}
                          </p>
                          {event.description && <p className="text-xs text-gray-500 mt-1">{event.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {order?.shippingLabelUrl && (
                  <div className="mt-8 text-center">
                    <Link href={order.shippingLabelUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline">View Shipping Label</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
