import { NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_RJ4VdDydsSSIbK",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "BfQ5F7dTJ52dulyvh99dsfNm",
})

export async function GET(req: Request) {
  try {
    // Test Razorpay connection and fetch payment methods
    const response = await fetch('https://api.razorpay.com/v1/methods', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID || "rzp_test_RJ4VdDydsSSIbK"}:${process.env.RAZORPAY_KEY_SECRET || "BfQ5F7dTJ52dulyvh99dsfNm"}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Razorpay API error: ${response.statusText}`)
    }

    const methods = await response.json()

    return NextResponse.json({
      success: true,
      razorpay_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RJ4VdDydsSSIbK",
      available_methods: methods,
      configuration: {
        upi_enabled: methods.upi || true,
        cards_enabled: methods.card || true,
        netbanking_enabled: methods.netbanking || true,
        wallets_enabled: methods.wallet || true,
        emi_enabled: methods.emi || true,
        paylater_enabled: methods.paylater || true
      },
      message: "Razorpay configuration is working correctly"
    })

  } catch (error: any) {
    console.error("Error checking Razorpay configuration:", error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      fallback_config: {
        razorpay_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RJ4VdDydsSSIbK",
        upi_enabled: true,
        cards_enabled: true,
        netbanking_enabled: true,
        wallets_enabled: true,
        emi_enabled: true,
        paylater_enabled: true
      },
      message: "Using fallback configuration - all payment methods enabled"
    })
  }
}