"use server"

import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import type { Order, Product } from "@/types"
import { createShiprocketOrder, getShiprocketTrackingDetails } from "@/lib/shiprocket" // Import Shiprocket functions

/**
 * Creates a shipment and generates a shipping label using Shiprocket.
 * @param orderId The ID of the order to ship.
 * @returns A promise that resolves with tracking details or rejects with an error.
 */
export async function createShipment(orderId: string) {
  try {
    // Fetch order details from Firestore
    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)

    if (!orderSnap.exists()) {
      throw new Error("Order not found.")
    }

    const order = orderSnap.data() as any // Use any to handle extended order structure from checkout

    // Fetch product details for the order items
    const productMap: { [key: string]: Product } = {}
    for (const item of order.items) {
      const productDoc = await getDoc(doc(db, "products", item.productId))
      if (productDoc.exists()) {
        productMap[productDoc.id] = { id: productDoc.id, ...productDoc.data() } as Product
      }
    }

    // Call Shiprocket API to create the order
    const shiprocketResult = await createShiprocketOrder(order, productMap)

    // Update order status in Firestore with real tracking details
    await updateDoc(orderRef, {
      status: "shipped", // Or 'ready_for_pickup' depending on your workflow
      trackingId: shiprocketResult.awbCode,
      shipmentId: shiprocketResult.shipmentId, // Store Shiprocket's shipment ID
      shippingLabelUrl:
        shiprocketResult.labelUrl || `/placeholder.svg?height=200&width=400&text=Shipping%20Label%20for%20${orderId}`, // Use real label URL if available
      updatedAt: new Date(),
    })

    return {
      success: true,
      message: "Shipment created and label generated successfully!",
      trackingId: shiprocketResult.awbCode,
      shippingLabelUrl:
        shiprocketResult.labelUrl || `/placeholder.svg?height=200&width=400&text=Shipping%20Label%20for%20${orderId}`,
    }
  } catch (error) {
    console.error("Error creating shipment:", error)
    return {
      success: false,
      message: `Failed to create shipment: ${(error as Error).message}`,
      trackingId: null,
      shippingLabelUrl: null,
    }
  }
}

/**
 * Fetches tracking details for a given tracking ID using Shiprocket.
 * @param trackingId The AWB number to query.
 * @returns A promise that resolves with tracking events or rejects with an error.
 */
export async function getTrackingDetails(trackingId: string) {
  try {
    const trackingEvents = await getShiprocketTrackingDetails(trackingId)

    return {
      success: true,
      message: "Tracking details fetched successfully!",
      trackingId: trackingId,
      events: trackingEvents,
    }
  } catch (error) {
    console.error("Error fetching tracking details:", error)
    return {
      success: false,
      message: `Failed to fetch tracking details: ${(error as Error).message}`,
      trackingId: null,
      events: [],
    }
  }
}
