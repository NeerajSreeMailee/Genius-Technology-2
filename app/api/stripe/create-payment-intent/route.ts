import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
// This should be stored as an environment variable for security
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "YOUR_STRIPE_SECRET_KEY", {
  apiVersion: "2024-04-10", // Use a recent API version
})

export async function POST(req: Request) {
  try {
    const { amount, currency, receipt_email, metadata } = await req.json()

    if (!amount || !currency) {
      return NextResponse.json({ error: "Amount and currency are required" }, { status: 400 })
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents/smallest currency unit
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email,
      metadata, // Optional: pass your internal order ID or other relevant data
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error("Error creating Stripe Payment Intent:", error)
    return NextResponse.json({ error: error.message || "Failed to create Stripe Payment Intent" }, { status: 500 })
  }
}
