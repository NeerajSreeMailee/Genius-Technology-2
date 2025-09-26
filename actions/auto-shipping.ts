"use server"

import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { createShiprocketOrder } from "@/lib/shiprocket"
import type { Product } from "@/types"

/**
 * Automatically creates a Shiprocket order after payment confirmation
 * @param orderId The Firebase order ID
 * @returns Success status and tracking details
 */
export async function autoCreateShipment(orderId: string) {
  try {
    console.log(`Auto-creating Shiprocket shipment for order: ${orderId}`)
    
    // Fetch order details from Firestore
    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)

    if (!orderSnap.exists()) {
      throw new Error("Order not found.")
    }

    const order = orderSnap.data() as any // Extended order structure

    // Only create shipment for paid orders
    if (order.paymentStatus !== "paid") {
      console.log(`Order ${orderId} payment status is ${order.paymentStatus}, skipping shipment creation`)
      return {
        success: false,
        message: "Order payment not confirmed yet",
        skipReason: "payment_not_confirmed"
      }
    }

    // Check if shipment already created
    if (order.trackingId) {
      console.log(`Order ${orderId} already has tracking ID: ${order.trackingId}`)
      return {
        success: true,
        message: "Shipment already exists",
        trackingId: order.trackingId,
        skipReason: "already_exists"
      }
    }

    // Fetch product details for the order items
    const productMap: { [key: string]: Product } = {}
    for (const item of order.items) {
      const productDoc = await getDoc(doc(db, "products", item.productId))
      if (productDoc.exists()) {
        productMap[productDoc.id] = { id: productDoc.id, ...productDoc.data() } as Product
      }
    }

    // Add customer email to order for Shiprocket
    const extendedOrder = {
      ...order,
      customerEmail: order.customerEmail || order.shippingAddress?.email || "customer@genius-tech.com"
    }

    // Call Shiprocket API to create the order
    const shiprocketResult = await createShiprocketOrder(extendedOrder, productMap)

    // Update order status in Firestore with tracking details
    await updateDoc(orderRef, {
      status: "processing", // Update to processing after shipment creation
      trackingId: shiprocketResult.awbCode,
      shipmentId: shiprocketResult.shipmentId,
      shiprocketOrderId: shiprocketResult.orderId,
      shippingLabelUrl: shiprocketResult.labelUrl || null,
      shiprocketCreatedAt: new Date(),
      updatedAt: new Date(),
    })

    console.log(`Shiprocket order created successfully for ${orderId}:`, {
      awbCode: shiprocketResult.awbCode,
      shipmentId: shiprocketResult.shipmentId,
      orderId: shiprocketResult.orderId
    })

    return {
      success: true,
      message: "Shipment created successfully!",
      trackingId: shiprocketResult.awbCode,
      shipmentId: shiprocketResult.shipmentId,
      shiprocketOrderId: shiprocketResult.orderId,
      shippingLabelUrl: shiprocketResult.labelUrl,
    }
  } catch (error) {
    console.error("Error auto-creating shipment:", error)
    return {
      success: false,
      message: `Failed to create shipment: ${(error as Error).message}`,
      error: error
    }
  }
}