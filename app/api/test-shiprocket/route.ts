import { NextResponse } from "next/server"
import { getShiprocketToken } from "@/lib/shiprocket"

export async function GET() {
  try {
    console.log("Testing Shiprocket authentication...")
    const token = await getShiprocketToken()
    
    return NextResponse.json({
      success: true,
      message: "Shiprocket authentication successful!",
      tokenLength: token.length,
      tokenPreview: token.slice(0, 10) + "...", // Show first 10 chars for verification
    })
  } catch (error: any) {
    console.error("Shiprocket test failed:", error)
    return NextResponse.json({
      success: false,
      message: "Shiprocket authentication failed",
      error: error.message,
    }, { status: 500 })
  }
}