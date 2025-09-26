import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getShiprocketTrackingDetails } from "@/lib/shiprocket"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')
    const awbCode = searchParams.get('awbCode')
    
    if (!orderId && !awbCode) {
      return NextResponse.json({ 
        success: false,
        error: "Either orderId or awbCode is required" 
      }, { status: 400 })
    }

    let trackingId = awbCode
    let orderData = null

    // If orderId is provided, get tracking ID from order
    if (orderId) {
      const orderRef = doc(db, "orders", orderId)
      const orderSnap = await getDoc(orderRef)

      if (!orderSnap.exists()) {
        return NextResponse.json({ 
          success: false,
          error: "Order not found" 
        }, { status: 404 })
      }

      orderData = orderSnap.data()
      trackingId = orderData?.trackingId

      if (!trackingId) {
        return NextResponse.json({ 
          success: false,
          error: "No tracking ID found for this order",
          orderStatus: orderData?.status,
          paymentStatus: orderData?.paymentStatus
        })
      }
    }

    // Fetch tracking details from Shiprocket
    if (!trackingId) {
      return NextResponse.json({ 
        success: false,
        error: "No tracking ID available"
      })
    }
    
    console.log(`Fetching tracking details for AWB: ${trackingId}`)
    
    try {
      const trackingEvents = await getShiprocketTrackingDetails(trackingId)
      
      // Update order with latest tracking status if we have order data
      if (orderData && trackingEvents.length > 0) {
        const latestEvent = trackingEvents[0] // Most recent event
        const orderRef = doc(db, "orders", orderId!)
        
        // Map Shiprocket status to internal status
        let orderStatus = orderData.status
        const latestStatus = latestEvent.status.toLowerCase()
        
        if (latestStatus.includes('delivered')) {
          orderStatus = 'delivered'
        } else if (latestStatus.includes('out for delivery') || latestStatus.includes('dispatched')) {
          orderStatus = 'shipped'
        } else if (latestStatus.includes('in transit') || latestStatus.includes('picked')) {
          orderStatus = 'shipped'
        }

        await updateDoc(orderRef, {
          status: orderStatus,
          lastTrackingUpdate: new Date(),
          latestTrackingStatus: latestEvent.status,
          updatedAt: new Date()
        })
      }

      return NextResponse.json({
        success: true,
        trackingId: trackingId,
        orderId: orderId || null,
        trackingEvents: trackingEvents,
        orderStatus: orderData?.status,
        paymentStatus: orderData?.paymentStatus,
        shipmentId: orderData?.shipmentId,
        shiprocketOrderId: orderData?.shiprocketOrderId,
        lastUpdated: new Date().toISOString()
      })

    } catch (trackingError) {
      console.error("Error fetching tracking details:", trackingError)
      
      // Return basic order info even if tracking fails
      return NextResponse.json({
        success: false,
        error: "Unable to fetch tracking details from Shiprocket",
        trackingId: trackingId,
        orderId: orderId || null,
        orderStatus: orderData?.status,
        paymentStatus: orderData?.paymentStatus,
        message: "Tracking information temporarily unavailable"
      })
    }

  } catch (error: any) {
    console.error("Error in tracking API:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 })
  }
}