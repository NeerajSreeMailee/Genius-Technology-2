import { NextResponse } from "next/server"
import { getShiprocketToken } from "@/lib/shiprocket"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const pincode = searchParams.get('pincode')
    
    if (!pincode) {
      return NextResponse.json({ 
        success: false,
        error: "Pincode is required" 
      }, { status: 400 })
    }

    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ 
        success: false,
        serviceable: false,
        message: "Invalid pincode format. Please enter a 6-digit pincode." 
      })
    }

    const token = await getShiprocketToken()

    // Check serviceability using Shiprocket's check API
    const params = new URLSearchParams({
      pickup_postcode: "110001", // Default pickup location
      delivery_postcode: pincode,
      weight: "0.5",
      declared_value: "1000",
      cod: "0"
    })

    const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error("Shiprocket serviceability error:", await response.text())
      // Fallback to basic validation for common metro areas
      const metroPincodes = /^(1[0-2]\d{4}|2[0-8]\d{4}|3[0-7]\d{4}|4[0-6]\d{4}|5[0-6]\d{4}|6[0-8]\d{4}|7[0-8]\d{4}|8[0-5]\d{4}|9[0-4]\d{4})$/
      const isServiceable = metroPincodes.test(pincode)
      
      return NextResponse.json({
        success: true,
        serviceable: isServiceable,
        message: isServiceable 
          ? "Delivery available to this pincode" 
          : "Delivery may not be available to this pincode. Please contact support.",
        fallback: true
      })
    }

    const data = await response.json()
    console.log("Shiprocket serviceability response for", pincode, ":", {
      status: data.status,
      hasData: !!data.data,
      hasAvailableCouriers: !!data.data?.available_courier_companies,
      couriersCount: data.data?.available_courier_companies?.length || 0
    })
    
    if (data.status === 200 && data.data) {
      // Handle new response structure with available_courier_companies
      const couriers = data.data.available_courier_companies || data.data || []
      
      if (Array.isArray(couriers)) {
        const availableCouriers = couriers.filter((courier: any) => 
          courier.rate && courier.rate > 0
        )
        
        return NextResponse.json({
          success: true,
          serviceable: availableCouriers.length > 0,
          message: availableCouriers.length > 0 
            ? `Delivery available to ${pincode}` 
            : `Delivery not available to ${pincode}`,
          couriers: availableCouriers.length,
          estimatedDays: availableCouriers.length > 0 
            ? Math.min(...availableCouriers.map((c: any) => Number(c.estimated_delivery_days) || 7))
            : null
        })
      }
    } else {
      return NextResponse.json({
        success: true,
        serviceable: false,
        message: `Delivery not available to ${pincode}`,
        couriers: 0
      })
    }
  } catch (error: any) {
    console.error("Error checking pincode serviceability:", error)
    
    // Basic fallback validation for common areas
    const pincode = new URL(req.url).searchParams.get('pincode')
    if (pincode && /^[1-9]\d{5}$/.test(pincode)) {
      return NextResponse.json({
        success: true,
        serviceable: true,
        message: "Delivery available (estimated)",
        fallback: true,
        estimatedDays: 5
      })
    }
    
    return NextResponse.json({ 
      success: false,
      serviceable: false,
      error: "Unable to check serviceability at the moment. Please try again."
    }, { status: 500 })
  }
}