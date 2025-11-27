"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/layout/footer"

import { 
  Printer, 
  Download,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CheckCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function OrderReceiptPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const receiptRef = useRef<HTMLDivElement>(null)

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

  const formatDateTime = (date: any) => {
    if (!date) return "N/A"
    return new Date(date?.seconds ? date.seconds * 1000 : date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const printReceipt = () => {
    window.print()
  }

  const downloadReceipt = async () => {
    if (!receiptRef.current) return

    try {
      // Show loading state
      const downloadBtn = document.getElementById('download-receipt-btn')
      if (downloadBtn) {
        downloadBtn.innerHTML = '<svg class="h-4 w-4 mr-2 animate-spin" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...'
      }

      // Capture the receipt element
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false
      })

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add new pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Save the PDF
      pdf.save(`receipt-${order?.id?.slice(-8)}.pdf`)

      // Reset button text
      if (downloadBtn) {
        downloadBtn.innerHTML = '<svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Download Receipt'
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
      
      // Reset button text
      const downloadBtn = document.getElementById('download-receipt-btn')
      if (downloadBtn) {
        downloadBtn.innerHTML = '<svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Download Receipt'
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 print:p-0">
        {/* Print/Download Actions - Hidden when printing */}
        <div className="mb-6 flex justify-end print:hidden">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={printReceipt}>
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
            <Button id="download-receipt-btn" variant="outline" onClick={downloadReceipt}>
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </div>

        {/* Receipt Content */}
        <div ref={receiptRef} className="bg-white p-8 rounded-lg shadow-sm print:shadow-none print:p-0 max-w-2xl mx-auto">
          {/* Receipt Header */}
          <div className="text-center border-b pb-6 mb-6 print:border-b-0 print:pb-4 print:mb-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">PAYMENT RECEIPT</h1>
            <p className="text-gray-600">Thank you for your purchase!</p>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-2 gap-6 mb-6 print:gap-4 print:mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Business Details:</h3>
              <p className="font-bold">Genius Technology</p>
              <p>123 Business Street</p>
              <p>Mumbai, Maharashtra 400001</p>
              <p>India</p>
              <p className="mt-2">support@geniustechnology.com</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Receipt Details:</h3>
              <div className="space-y-1">
                <p className="flex justify-between">
                  <span>Receipt Date:</span>
                  <span>{formatDateTime(order?.createdAt)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Order ID:</span>
                  <span>#{order?.id?.slice(-8)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{order?.paymentMethod}</span>
                </p>
                <p className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="capitalize font-medium">{order?.paymentStatus}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-6 print:mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Customer:</h3>
            <p className="font-medium">{order?.shippingAddress?.fullName || order?.shippingAddress?.name}</p>
            <p>{order?.shippingAddress?.addressLine1}</p>
            {order?.shippingAddress?.addressLine2 && (
              <p>{order?.shippingAddress?.addressLine2}</p>
            )}
            <p>
              {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.pincode}
            </p>
            <p className="mt-1">{order?.shippingAddress?.phone}</p>
            {order?.customerEmail && (
              <p>{order?.customerEmail}</p>
            )}
          </div>

          {/* Order Items Summary */}
          <div className="mb-6 print:mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 p-3 font-semibold text-sm">
                <div className="col-span-8">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              {order?.items?.map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-12 p-3 border-t text-sm">
                  <div className="col-span-8">
                    <p className="font-medium">{item.productName || "Unknown Product"}</p>
                  </div>
                  <div className="col-span-2 text-center">{item.quantity || 1}</div>
                  <div className="col-span-2 text-right font-medium">
                    {formatCurrency((item.price || 0) * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="ml-auto max-w-xs">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(order?.subtotal || 0)}</span>
              </div>
              {order?.couponDiscountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(order?.couponDiscountAmount || 0)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {order?.deliveryFee === 0 ? "FREE" : formatCurrency(order?.deliveryFee || 0)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Amount Paid:</span>
                <span>{formatCurrency(order?.total || 0)}</span>
              </div>
            </div>
          </div>

          {/* Payment Confirmation */}
          <div className="mt-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful</h2>
            <p className="text-gray-600">
              Your payment of {formatCurrency(order?.total || 0)} has been processed successfully.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t print:border-t-0 print:pt-4 print:mt-4">
            <p className="text-sm text-gray-600 text-center">
              This is an electronically generated receipt. If you have any questions, please contact us at 
              support@geniustechnology.com
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}