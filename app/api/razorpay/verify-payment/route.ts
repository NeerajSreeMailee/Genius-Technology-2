import { NextResponse } from "next/server"
import crypto from "crypto"
import Razorpay from "razorpay"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_RJ4VdDydsSSIbK",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "BfQ5F7dTJ52dulyvh99dsfNm",
})

export async function POST(req: Request) {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      order_id // Internal order ID
    } = await req.json()

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !order_id) {
      return NextResponse.json({ 
        success: false,
        error: "Missing required payment verification parameters" 
      }, { status: 400 })
    }

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "BfQ5F7dTJ52dulyvh99dsfNm")
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      console.error("Payment signature verification failed")
      return NextResponse.json({ 
        success: false,
        error: "Payment signature verification failed" 
      }, { status: 400 })
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id)
    
    if (!payment) {
      return NextResponse.json({ 
        success: false,
        error: "Payment not found" 
      }, { status: 404 })
    }

    // Verify payment status
    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return NextResponse.json({ 
        success: false,
        error: `Payment status is ${payment.status}` 
      }, { status: 400 })
    }

    // Update order in Firestore
    const orderRef = doc(db, "orders", order_id)
    const orderSnap = await getDoc(orderRef)

    if (!orderSnap.exists()) {
      return NextResponse.json({ 
        success: false,
        error: "Order not found" 
      }, { status: 404 })
    }

    await updateDoc(orderRef, {
      paymentStatus: "paid",
      status: "confirmed",
      paymentTransactionId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      paymentSignature: razorpay_signature,
      paymentDetails: {
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        bank: payment.bank || null,
        card_id: payment.card_id || null,
        wallet: payment.wallet || null,
        vpa: payment.vpa || null,
        email: payment.email,
        contact: payment.contact,
        fee: payment.fee || 0,
        tax: payment.tax || 0,
        created_at: new Date(payment.created_at * 1000),
      },
      updatedAt: new Date(),
    })

    console.log(`Payment verified and order ${order_id} updated successfully`)

    // Generate invoice after successful payment
    try {
      const invoiceResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/invoice/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: order_id })
      })
      
      const invoiceData = await invoiceResponse.json()
      if (invoiceData.success) {
        console.log(`Invoice generated for order ${order_id}: ${invoiceData.invoice.invoiceId}`)
      } else {
        console.warn(`Failed to generate invoice for order ${order_id}:`, invoiceData.error)
      }
    } catch (invoiceError) {
      console.error(`Error generating invoice for order ${order_id}:`, invoiceError)
      // Don't fail the payment verification if invoice generation fails
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      payment: {
        id: payment.id,
        amount: Number(payment.amount) / 100, // Convert back to rupees
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        created_at: payment.created_at
      }
    })

  } catch (error: any) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ 
      success: false,
      error: error.message || "Payment verification failed" 
    }, { status: 500 })
  }
}