import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import crypto from "crypto"
import type { Order } from "@/types"
import { recordInvoicePayment } from "@/lib/zoho-books"
import { autoCreateShipment } from "@/actions/auto-shipping"

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("x-razorpay-signature")

  if (!signature) {
    return new NextResponse("No x-razorpay-signature header found", { status: 400 })
  }

  // Verify webhook signature
  const expectedSignature = crypto.createHmac("sha256", RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex")

  if (expectedSignature !== signature) {
    console.error("Razorpay Webhook: Signature verification failed.")
    return new NextResponse("Signature verification failed", { status: 403 })
  }

  const event = JSON.parse(body)
  console.log(`Received Razorpay event: ${event.event}`)

  try {
    switch (event.event) {
      case "payment.captured":
      case "order.paid":
        const payment = event.payload.payment.entity
        const orderEntity = event.payload.order.entity // This is Razorpay's order entity
        const internalOrderId = orderEntity.receipt // Our internal order ID passed as receipt

        if (!internalOrderId) {
          console.warn("Razorpay Webhook: Missing internalOrderId in payload.")
          return new NextResponse("Missing internalOrderId", { status: 400 })
        }

        const orderRef = doc(db, "orders", internalOrderId)
        const orderSnap = await getDoc(orderRef)

        if (!orderSnap.exists()) {
          console.warn(`Razorpay Webhook: Order ${internalOrderId} not found in Firestore.`)
          return new NextResponse("Order not found", { status: 404 })
        }

        const orderData = orderSnap.data() as any // Extended order structure

        await updateDoc(orderRef, {
          paymentStatus: "paid",
          status: "confirmed", // Or 'processing'
          paymentTransactionId: payment.id, // Update with actual Razorpay payment ID
          updatedAt: new Date(),
        })
        console.log(`Order ${internalOrderId} updated to paid/confirmed by Razorpay webhook.`)

        // Automatically create Shiprocket shipment after payment confirmation
        try {
          const shipmentResult = await autoCreateShipment(internalOrderId)
          if (shipmentResult.success) {
            console.log(`Shiprocket shipment auto-created for order ${internalOrderId}:`, shipmentResult)
          } else {
            console.warn(`Failed to auto-create Shiprocket shipment for order ${internalOrderId}:`, shipmentResult.message)
          }
        } catch (shipmentError) {
          console.error(`Error auto-creating Shiprocket shipment for order ${internalOrderId}:`, shipmentError)
          // Don't fail the webhook if shipment creation fails
        }

        // Record payment in Zoho Books if an invoice exists
        if (orderData.zohoInvoiceId) {
          await recordInvoicePayment(orderData.zohoInvoiceId, orderData.total, "Razorpay", payment.id)
          console.log(`Payment recorded in Zoho Books for invoice ${orderData.zohoInvoiceId}.`)
        } else {
          console.warn(`Order ${internalOrderId} has no Zoho Invoice ID. Payment not recorded in Zoho Books.`)
        }
        break
      case "payment.failed":
        const failedPayment = event.payload.payment.entity
        const failedOrderEntity = event.payload.order.entity
        const failedInternalOrderId = failedOrderEntity.receipt

        if (failedInternalOrderId) {
          const failedOrderRef = doc(db, "orders", failedInternalOrderId)
          await updateDoc(failedOrderRef, {
            paymentStatus: "failed",
            status: "cancelled", // Or 'payment_failed'
            paymentTransactionId: failedPayment.id,
            updatedAt: new Date(),
          })
          console.log(`Order ${failedInternalOrderId} updated to failed/cancelled by Razorpay webhook.`)
        } else {
          console.warn("Razorpay Webhook: Missing internalOrderId for failed payment.")
        }
        break
      // ... handle other event types as needed
      default:
        console.log(`Unhandled Razorpay event type ${event.event}`)
    }
  } catch (error) {
    console.error("Error processing Razorpay webhook event:", error)
    return new NextResponse(`Webhook handler failed: ${error}`, { status: 500 })
  }

  return new NextResponse(JSON.stringify({ received: true }), { status: 200 })
}
