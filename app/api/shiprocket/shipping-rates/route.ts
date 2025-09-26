import { NextResponse } from "next/server"
import { getShiprocketToken } from "@/lib/shiprocket"
import { calculateFallbackShipping } from "@/lib/shipping-fallback"

export async function POST(req: Request) {
  let delivery_postcode = "";
  
  try {
    const { pickup_postcode, delivery_postcode: inputPincode, weight, length, breadth, height } = await req.json()
    delivery_postcode = inputPincode; // Store for use in catch block

    if (!pickup_postcode || !delivery_postcode || !weight) {
      return NextResponse.json({ 
        error: "pickup_postcode, delivery_postcode, and weight are required" 
      }, { status: 400 })
    }

    const token = await getShiprocketToken()

    // Shiprocket serviceability API uses GET with query parameters
    const params = new URLSearchParams({
      pickup_postcode: pickup_postcode || "110001",
      delivery_postcode,
      weight: (weight || 0.5).toString(),
      length: (length || 10).toString(),
      breadth: (breadth || 10).toString(),
      height: (height || 10).toString(),
      declared_value: "1000",
      cod: "0" // 0 for prepaid, 1 for COD
    })

    console.log("Shiprocket shipping rate request URL:", `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params}`)
    console.log("Request headers:", {
      "Content-Type": "application/json",
      "Authorization": `Bearer [HIDDEN]`,
    })

    const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Shiprocket shipping rate error:", errorData)
      throw new Error(`Failed to get shipping rates: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    console.log("Shiprocket shipping rate response:", {
      status: data.status,
      dataStructure: {
        hasData: !!data.data,
        hasAvailableCouriers: !!data.data?.available_courier_companies,
        couriersCount: data.data?.available_courier_companies?.length || 0,
        dataType: Array.isArray(data.data) ? 'array' : typeof data.data
      }
    })

    // Handle different response structures from Shiprocket
    if (data.status === 200) {
      // Get couriers from the new nested structure
      const couriers = data.data?.available_courier_companies || data.data || []
      
      if (!Array.isArray(couriers) || couriers.length === 0) {
        return NextResponse.json({
          success: false,
          message: "No shipping options available for this pincode",
          couriers: []
        })
      }

      // Filter and sort by rate (cheapest first)
      const availableCouriers = couriers
        .filter((courier: any) => courier.rate && courier.rate > 0)
        .sort((a: any, b: any) => Number(a.rate) - Number(b.rate))
        .map((courier: any) => ({
          courier_name: courier.courier_name || courier.courier_company_id || 'Unknown Courier',
          rate: Number(courier.rate),
          estimated_delivery_days: courier.estimated_delivery_days || 'N/A',
          description: `${courier.courier_name || 'Courier'} - ${courier.estimated_delivery_days || 'N/A'} days`
        }))

      if (availableCouriers.length === 0) {
        return NextResponse.json({
          success: false,
          message: "No valid shipping options found for this pincode",
          couriers: []
        })
      }

      return NextResponse.json({
        success: true,
        couriers: availableCouriers,
        cheapest_rate: availableCouriers[0]?.rate || 0,
        fastest_courier: availableCouriers.reduce((prev: any, current: any) => {
          const prevDays = Number(prev.estimated_delivery_days) || 999
          const currentDays = Number(current.estimated_delivery_days) || 999
          return prevDays < currentDays ? prev : current
        })
      })
    } else {
      console.warn("Unexpected Shiprocket response structure:", data)
      return NextResponse.json({
        success: false,
        message: data.message || "No shipping options available for this location",
        couriers: [],
        debug: data // For debugging
      })
    }
  } catch (error: any) {
    console.error("Error getting shipping rates from Shiprocket:", error)
    console.log("Using fallback shipping calculation for pincode:", delivery_postcode)
    
    // Use fallback shipping calculation
    const fallbackRates = calculateFallbackShipping(delivery_postcode)
    
    return NextResponse.json({ 
      success: true,
      couriers: fallbackRates,
      cheapest_rate: fallbackRates[0]?.rate || 79,
      fastest_courier: fallbackRates.reduce((prev: any, current: any) => {
        const prevDays = Number(prev.estimated_delivery_days) || 999
        const currentDays = Number(current.estimated_delivery_days) || 999
        return prevDays < currentDays ? prev : current
      }),
      fallback: true,
      message: "Using standard shipping rates (Shiprocket temporarily unavailable)"
    })
  }
}