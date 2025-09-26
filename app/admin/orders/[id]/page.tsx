"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore" // Import updateDoc
import { db } from "@/lib/firebase"
import type { Order, OrderItem, Product } from "@/types"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  Truck,
  Download,
  LocateFixed,
  CheckCircle2,
  FileText,
} from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { createShipment, getTrackingDetails } from "@/actions/shipping"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createZohoInvoice } from "@/lib/zoho-books" // Import Zoho Books function
import { ZOHO_BOOKS_ORGANIZATION_ID } from "@/constants" // Declare ZOHO_BOOKS_ORGANIZATION_ID

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [order, setOrder] = useState<Order | null>(null)
  const [products, setProducts] = useState<{ [key: string]: Product }>({})
  const [loading, setLoading] = useState(true)
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false) // New state for invoice generation
  const [trackingData, setTrackingData] = useState<{ trackingId: string | null; events: any[] } | null>(null)
  const [showTrackingDialog, setShowTrackingDialog] = useState(false)

  const orderStatuses: Order["status"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled"]

  useEffect(() => {
    if (!id) return

    const orderDocRef = doc(db, "orders", id as string)
    const unsubscribe = onSnapshot(
      orderDocRef,
      async (docSnap) => {
        if (docSnap.exists()) {
          const orderData = { id: docSnap.id, ...docSnap.data() } as Order
          setOrder(orderData)
          await fetchProductDetails(orderData.items)
        } else {
          toast({
            title: "Order Not Found",
            description: "The requested order does not exist.",
            variant: "destructive",
          })
          router.push("/admin/orders")
        }
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching order in real-time:", error)
        toast({
          title: "Error",
          description: "Failed to load order details.",
          variant: "destructive",
        })
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [id, router, toast])

  const fetchProductDetails = async (items: OrderItem[]) => {
    const productMap: { [key: string]: Product } = {}
    for (const item of items) {
      if (!productMap[item.productId]) {
        const productDoc = await getDoc(doc(db, "products", item.productId))
        if (productDoc.exists()) {
          productMap[productDoc.id] = { id: productDoc.id, ...productDoc.data() } as Product
        }
      }
    }
    setProducts(productMap)
  }

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "confirmed":
        return "default"
      case "shipped":
        return "outline"
      case "delivered":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleGenerateShippingLabel = async () => {
    if (!order) return

    setIsGeneratingLabel(true)
    const result = await createShipment(order.id)
    setIsGeneratingLabel(false)

    if (result.success) {
      toast({
        title: "Shipping Label Generated",
        description: `Tracking ID: ${result.trackingId}`,
      })
      // Optionally, open the label in a new tab
      if (result.shippingLabelUrl) {
        window.open(result.shippingLabelUrl, "_blank")
      }
    } else {
      toast({
        title: "Failed to Generate Label",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleTrackShipment = async () => {
    if (!order?.trackingId) {
      toast({
        title: "No Tracking ID",
        description: "This order does not have a tracking ID yet.",
        variant: "info",
      })
      return
    }

    setIsTracking(true)
    const result = await getTrackingDetails(order.trackingId)
    setIsTracking(false)

    if (result.success) {
      setTrackingData(result)
      setShowTrackingDialog(true)
    } else {
      toast({
        title: "Failed to Fetch Tracking",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleUpdateOrderStatus = async (newStatus: Order["status"]) => {
    if (!order || isUpdatingStatus) return

    setIsUpdatingStatus(true)
    try {
      const orderDocRef = doc(db, "orders", order.id)
      await updateDoc(orderDocRef, {
        status: newStatus,
        updatedAt: new Date(),
      })
      toast({
        title: "Order Status Updated",
        description: `Order #${order.id.slice(-8)} status changed to ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Failed to Update Status",
        description: "There was an error updating the order status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleGenerateInvoice = async () => {
    if (!order) return

    setIsGeneratingInvoice(true)
    const result = await createZohoInvoice(order.id)
    setIsGeneratingInvoice(false)

    if (result.success && result.invoiceId) {
      // Update the order in Firestore with the Zoho Invoice ID
      const orderDocRef = doc(db, "orders", order.id)
      await updateDoc(orderDocRef, {
        zohoInvoiceId: result.invoiceId,
        updatedAt: new Date(),
      })
      toast({
        title: "Invoice Generated",
        description: `Zoho Books Invoice ID: ${result.invoiceId}`,
      })
      if (result.invoiceUrl) {
        window.open(result.invoiceUrl, "_blank")
      }
    } else {
      toast({
        title: "Failed to Generate Invoice",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold">Order Not Found</h2>
          <Button onClick={() => router.push("/admin/orders")} className="mt-4">
            Back to Orders
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/admin/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Order Details #{order.id.slice(-8)}</h1>
          <Badge variant={getStatusBadgeVariant(order.status)} className="text-lg px-4 py-2">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Order Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const product = products[item.productId]
                    return (
                      <div key={item.productId} className="flex items-center space-x-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={product?.images[0] || "/placeholder.svg"}
                            alt={item.productName}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{item.productName}</h3>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                          <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Separator className="my-6" />
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium">₹{order.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tax</span>
                    <span className="font-medium">₹0</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>₹{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
                <p>Email: {order.shippingAddress.email}</p> {/* Assuming email is now in shippingAddress */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <span className="font-medium">Method:</span> {order.paymentMethod}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge variant={order.paymentStatus === "paid" ? "success" : "secondary"}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Badge>
                </p>
                {order.paymentTransactionId && (
                  <p>
                    <span className="font-medium">Transaction ID:</span> {order.paymentTransactionId}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Actions & Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Order Date:</span>
                    <span className="font-medium">
                      {order.createdAt ? format(order.createdAt.toDate(), "PPP") : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Last Updated:</span>
                    <span className="font-medium">
                      {order.updatedAt ? format(order.updatedAt.toDate(), "PPP") : "N/A"}
                    </span>
                  </div>
                  {order.trackingId && (
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Tracking ID:</span>
                      <span className="font-medium">{order.trackingId}</span>
                    </div>
                  )}
                  {order.zohoInvoiceId && (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Zoho Invoice ID:</span>
                      <a
                        href={`https://books.zoho.com/app/${ZOHO_BOOKS_ORGANIZATION_ID}/invoices/${order.zohoInvoiceId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {order.zohoInvoiceId}
                      </a>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-gray-600" />
                    <Label htmlFor="order-status-select" className="flex-shrink-0">
                      Update Status:
                    </Label>
                    <Select value={order.status} onValueChange={handleUpdateOrderStatus} disabled={isUpdatingStatus}>
                      <SelectTrigger id="order-status-select" className="flex-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleGenerateShippingLabel}
                    disabled={
                      isGeneratingLabel ||
                      order.status === "shipped" ||
                      order.status === "delivered" ||
                      order.status === "cancelled"
                    }
                  >
                    {isGeneratingLabel ? "Generating Label..." : "Generate Shipping Label"}
                    <Download className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={handleTrackShipment}
                    disabled={isTracking || !order.trackingId}
                  >
                    {isTracking ? "Tracking..." : "Track Shipment"}
                    <LocateFixed className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    className="w-full"
                    onClick={handleGenerateInvoice}
                    disabled={isGeneratingInvoice || !!order.zohoInvoiceId}
                  >
                    {isGeneratingInvoice ? "Generating Invoice..." : "Generate Zoho Invoice"}
                    <FileText className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* Tracking Details Dialog */}
      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tracking Details</DialogTitle>
            <DialogDescription>Tracking ID: {trackingData?.trackingId || "N/A"}</DialogDescription>
          </DialogHeader>
          {trackingData?.events && trackingData.events.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trackingData.events.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(event.timestamp), "MMM dd, yyyy HH:mm")}</TableCell>
                    <TableCell>{event.status}</TableCell>
                    <TableCell>{event.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500">No tracking events found.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
