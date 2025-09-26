import { NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('payment_id')
    
    if (!paymentId) {
      return NextResponse.json({ 
        success: false,
        error: "Payment ID is required" 
      }, { status: 400 })
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId)
    
    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        bank: payment.bank,
        wallet: payment.wallet,
        vpa: payment.vpa,
        email: payment.email,
        contact: payment.contact,
        fee: payment.fee,
        tax: payment.tax,
        created_at: payment.created_at,
        invoice_url: `https://dashboard.razorpay.com/app/payments/${payment.id}`, // Invoice/receipt URL
        receipt_url: `https://api.razorpay.com/v1/payments/${payment.id}/receipt` // Direct receipt URL
      }
    })
  } catch (error: any) {
    console.error("Error fetching Razorpay payment details:", error)
    return NextResponse.json({ 
      success: false,
      error: error.message || "Failed to fetch payment details"
    }, { status: 500 })
  }
}