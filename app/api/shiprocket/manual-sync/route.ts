import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { autoCreateShipment } from "@/actions/auto-shipping"

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()
    
    if (!orderId) {
      return NextResponse.json({ 
        success: false,
        error: "Order ID is required" 
      }, { status: 400 })
    }

    console.log(`Manual sync requested for order: ${orderId}`)

    // Fetch order details
    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)

    if (!orderSnap.exists()) {
      return NextResponse.json({ 
        success: false,
        error: "Order not found" 
      }, { status: 404 })
    }

    const order = orderSnap.data()

    // Check if order is eligible for shipment creation
    if (order?.paymentStatus !== "paid") {
      return NextResponse.json({ 
        success: false,
        error: `Order payment status is ${order?.paymentStatus}, not paid` 
      }, { status: 400 })
    }

    // Check if shipment already exists
    if (order?.trackingId) {
      return NextResponse.json({ 
        success: false,
        message: `Shipment already exists with tracking ID: ${order.trackingId}`,
        trackingId: order.trackingId,
        shipmentId: order.shipmentId,
        shiprocketOrderId: order.shiprocketOrderId
      })
    }

    // Attempt to create shipment
    const shipmentResult = await autoCreateShipment(orderId)

    if (shipmentResult.success) {
      console.log(`Manual sync successful for order ${orderId}:`, shipmentResult)
      return NextResponse.json({
        success: true,
        message: "Shipment created successfully via manual sync",
        data: shipmentResult
      })
    } else {
      console.error(`Manual sync failed for order ${orderId}:`, shipmentResult)
      return NextResponse.json({
        success: false,
        error: shipmentResult.message,
        details: shipmentResult
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error("Error in manual sync:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 })
  }
}

// GET endpoint to check failed orders that need manual sync
export async function GET(req: Request) {
  try {
    // Get orders that are paid but don't have tracking IDs
    const ordersRef = collection(db, "orders")
    const failedOrdersQuery = query(
      ordersRef,
      where("paymentStatus", "==", "paid"),
      where("trackingId", "==", null)
    )
    
    const snapshot = await getDocs(failedOrdersQuery)
    const failedOrders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date()
    }))

    return NextResponse.json({
      success: true,
      failedOrders: failedOrders,
      count: failedOrders.length,
      message: `Found ${failedOrders.length} orders that need shipment creation`
    })

  } catch (error: any) {
    console.error("Error fetching failed orders:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 })
  }
}