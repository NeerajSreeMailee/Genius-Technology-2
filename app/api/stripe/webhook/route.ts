import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/lib/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import type { Order } from "@/types"
import { recordInvoicePayment } from "@/lib/zoho-books"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10", // Use a recent API version
})

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new NextResponse("No stripe-signature header found", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  console.log(`Received Stripe event: ${event.type}`)

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent for ${paymentIntentSucceeded.amount} was successful!`)

        // Retrieve your internal order ID from metadata
        const internalOrderIdSucceeded = paymentIntentSucceeded.metadata?.internalOrderId

        if (internalOrderIdSucceeded) {
          const orderRef = doc(db, "orders", internalOrderIdSucceeded)
          const orderSnap = await getDoc(orderRef)

          if (!orderSnap.exists()) {
            console.warn(`Stripe Webhook: Order ${internalOrderIdSucceeded} not found in Firestore.`)
            return new NextResponse("Order not found", { status: 404 })
          }

          const orderData = orderSnap.data() as Order

          await updateDoc(orderRef, {
            paymentStatus: "paid",
            status: "confirmed", // Or 'processing'
            updatedAt: new Date(),
          })
          console.log(`Order ${internalOrderIdSucceeded} updated to paid/confirmed.`)

          // Record payment in Zoho Books if an invoice exists
          if (orderData.zohoInvoiceId) {
            // Stripe amounts are in cents, convert to INR
            const amountInINR = paymentIntentSucceeded.amount / 100
            await recordInvoicePayment(orderData.zohoInvoiceId, amountInINR, "Stripe", paymentIntentSucceeded.id)
            console.log(`Payment recorded in Zoho Books for invoice ${orderData.zohoInvoiceId}.`)
          } else {
            console.warn(
              `Order ${internalOrderIdSucceeded} has no Zoho Invoice ID. Payment not recorded in Zoho Books.`,
            )
          }
        } else {
          console.warn("No internalOrderId found in payment_intent.succeeded metadata.")
        }
        break
      case "payment_intent.payment_failed":
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent
        console.log(
          `PaymentIntent for ${paymentIntentFailed.amount} failed! Reason: ${paymentIntentFailed.last_payment_error?.message}`,
        )

        const internalOrderIdFailed = paymentIntentFailed.metadata?.internalOrderId

        if (internalOrderIdFailed) {
          const orderRef = doc(db, "orders", internalOrderIdFailed)
          await updateDoc(orderRef, {
            paymentStatus: "failed",
            status: "cancelled", // Or 'payment_failed'
            updatedAt: new Date(),
          })
          console.log(`Order ${internalOrderIdFailed} updated to failed/cancelled.`)
        } else {
          console.warn("No internalOrderId found in payment_intent.payment_failed metadata.")
        }
        break
      case "checkout.session.completed":
        // This event is relevant if you use Stripe Checkout (hosted pages)
        const checkoutSessionCompleted = event.data.object as Stripe.Checkout.Session
        console.log(`Checkout Session completed: ${checkoutSessionCompleted.id}`)
        // You would typically retrieve the PaymentIntent ID from checkoutSessionCompleted.payment_intent
        // and then update your order based on that.
        break
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`)
    }
  } catch (error) {
    console.error("Error processing Stripe webhook event:", error)
    return new NextResponse(`Webhook handler failed: ${error}`, { status: 500 })
  }

  return new NextResponse(JSON.stringify({ received: true }), { status: 200 })
}
