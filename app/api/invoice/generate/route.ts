import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()
    
    if (!orderId) {
      return NextResponse.json({ 
        success: false,
        error: "Order ID is required" 
      }, { status: 400 })
    }

    // Fetch order details from Firestore
    const orderRef = db.collection("orders").doc(orderId)
    const orderDoc = await orderRef.get()

    if (!orderDoc.exists) {
      return NextResponse.json({ 
        success: false,
        error: "Order not found" 
      }, { status: 404 })
    }

    const order = orderDoc.data()

    // Check if order is paid
    if (order?.paymentStatus !== "paid") {
      return NextResponse.json({ 
        success: false,
        error: "Invoice can only be generated for paid orders" 
      }, { status: 400 })
    }

    // Check if invoice already exists
    if (order?.invoiceId) {
      return NextResponse.json({ 
        success: true,
        invoiceId: order.invoiceId,
        invoiceUrl: order.invoiceUrl,
        message: "Invoice already exists"
      })
    }

    // Generate invoice data
    const invoiceData = {
      invoiceId: `INV-${Date.now()}`,
      orderId: orderId,
      customerName: order.shippingAddress?.fullName || "Customer",
      customerEmail: order.customerEmail || order.shippingAddress?.email,
      customerPhone: order.shippingAddress?.phone,
      billingAddress: {
        name: order.shippingAddress?.fullName,
        address: order.shippingAddress?.addressLine1,
        city: order.shippingAddress?.city,
        state: order.shippingAddress?.state,
        pincode: order.shippingAddress?.pincode,
        country: "India"
      },
      items: order.items?.map((item: any) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })) || [],
      subtotal: order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0,
      shipping: order.shippingCharges || 0,
      tax: order.tax || 0,
      discount: order.couponDiscountAmount || 0,
      total: order.total,
      paymentMethod: order.paymentMethod || "Razorpay",
      paymentStatus: order.paymentStatus,
      paymentId: order.paymentTransactionId,
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "paid"
    }

    // Generate invoice URL (you can customize this)
    const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invoice/${invoiceData.invoiceId}`

    // Update order with invoice information
    await orderRef.update({
      invoiceId: invoiceData.invoiceId,
      invoiceUrl: invoiceUrl,
      invoiceData: invoiceData,
      invoiceGeneratedAt: new Date(),
      updatedAt: new Date()
    })

    console.log(`Invoice generated for order ${orderId}: ${invoiceData.invoiceId}`)

    return NextResponse.json({
      success: true,
      invoiceId: invoiceData.invoiceId,
      invoiceUrl: invoiceUrl,
      invoiceData: invoiceData,
      message: "Invoice generated successfully"
    })

  } catch (error: any) {
    console.error("Error generating invoice:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to generate invoice"
    }, { status: 500 })
  }
}