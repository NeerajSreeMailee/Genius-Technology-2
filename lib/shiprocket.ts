import type { Order, Product } from "@/types"

// Extended interfaces for actual order structure used in checkout
interface ExtendedCartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
  selectedOptions: Record<string, string>
}

interface ExtendedAddress {
  id: string
  userId: string
  fullName: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  type: string
  isDefault: boolean
  email?: string // For shipping purposes
}

interface ExtendedOrder {
  id: string
  userId: string
  items: ExtendedCartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  shippingAddress: ExtendedAddress
  paymentMethod: string
  specialInstructions?: string
  customerEmail?: string // For shipping purposes
  createdAt: Date
  updatedAt: Date
}

const SHIPROCKET_API_EMAIL = process.env.SHIPROCKET_API_EMAIL || "gsvxass@gmail.com"
const SHIPROCKET_API_PASSWORD = process.env.SHIPROCKET_API_PASSWORD || "6@qLDBwi3%vqn$i*"
const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external" // Production API URL

let shiprocketToken: string | null = null
let tokenExpiry = 0 // Unix timestamp in seconds

/**
 * Authenticates with Shiprocket and obtains an access token.
 * Caches the token and refreshes it if expired.
 * @returns The Shiprocket access token.
 */
export async function getShiprocketToken(): Promise<string> {
  const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds

  if (shiprocketToken && tokenExpiry > currentTime + 60) {
    // Token exists and is valid for at least another 60 seconds
    return shiprocketToken
  }

  console.log("Fetching new Shiprocket token...")
  try {
    const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: SHIPROCKET_API_EMAIL,
        password: SHIPROCKET_API_PASSWORD,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Shiprocket authentication error:", errorData)
      throw new Error(`Failed to authenticate with Shiprocket: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    if (data.token) {
      shiprocketToken = data.token
      tokenExpiry = currentTime + (data.expires_in || 3600) // expires_in is in seconds, default to 1 hour
      console.log("Shiprocket token obtained successfully.")
      return shiprocketToken as string // Type assertion since we know it's not null
    } else {
      throw new Error("Shiprocket token not found in response.")
    }
  } catch (error) {
    console.error("Error getting Shiprocket token:", error)
    throw error
  }
}

/**
 * Creates an order in Shiprocket.
 * @param order The internal order object from Firestore.
 * @param products A map of product IDs to product details.
 * @returns Shiprocket order details including order_id, shipment_id, and awb_code.
 */
export async function createShiprocketOrder(order: ExtendedOrder, products: { [key: string]: Product }) {
  const token = await getShiprocketToken()

  const orderItems = order.items.map((item) => {
    const product = products[item.productId]
    return {
      name: item.productName,
      sku: product?.sku || item.productId, // Assuming product has a SKU, otherwise use productId
      units: item.quantity,
      selling_price: item.price.toFixed(2),
      discount: "0.00", // Assuming no item-level discount for now
      tax: "0.00", // Assuming tax is included in price or handled separately
      hsn: (product as any)?.hsn || "", // HSN code if available (not in base Product interface)
    }
  })

  const payload = {
    order_id: order.id, // Your internal order ID
    order_date: order.createdAt.toISOString().split("T")[0], // YYYY-MM-DD
    pickup_location: "Default Warehouse", // This should be configured in Shiprocket and match a pickup location name
    channel_id: "", // Optional: If you have specific sales channels in Shiprocket
    comment: order.specialInstructions || "E-commerce Order",
    billing_customer_name: order.shippingAddress.fullName,
    billing_last_name: "", // Shiprocket often expects first and last name separately
    billing_address: order.shippingAddress.addressLine1,
    billing_address_2: order.shippingAddress.addressLine2 || "",
    billing_city: order.shippingAddress.city,
    billing_pincode: order.shippingAddress.pincode,
    billing_state: order.shippingAddress.state,
    billing_country: "India", // Assuming India for now
    billing_email: order.customerEmail || order.shippingAddress.email || "customer@geniustech.com", // Try multiple sources for email
    billing_phone: order.shippingAddress.phone,
    shipping_customer_name: order.shippingAddress.fullName,
    shipping_last_name: "",
    shipping_address: order.shippingAddress.addressLine1,
    shipping_address_2: order.shippingAddress.addressLine2 || "",
    shipping_city: order.shippingAddress.city,
    shipping_pincode: order.shippingAddress.pincode,
    shipping_state: order.shippingAddress.state,
    shipping_country: "India",
    shipping_email: order.customerEmail || order.shippingAddress.email || "customer@geniustech.com", // Try multiple sources for email
    shipping_phone: order.shippingAddress.phone,
    order_items: orderItems,
    payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
    shipping_charges: order.total - order.items.reduce((sum, item) => sum + item.price * item.quantity, 0), // Calculate actual shipping charges
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
    length: 10, // Default package dimensions (cm) - crucial for accurate shipping
    breadth: 10,
    height: 10,
    weight: 0.5, // Default package weight (kg) - crucial for accurate shipping
    // You might need to dynamically calculate these based on product data
  }

  console.log("Creating Shiprocket order with payload:", payload)

  try {
    const response = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Shiprocket order creation error:", errorData)
      throw new Error(`Failed to create Shiprocket order: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    console.log("Shiprocket order creation response:", data)

    if (data.order_id && data.shipment_id && data.awb_code) {
      return {
        orderId: data.order_id, // Shiprocket's internal order ID
        shipmentId: data.shipment_id,
        awbCode: data.awb_code, // AWB number for tracking
        labelUrl: data.label_url || null, // Direct label URL if provided
      }
    } else {
      throw new Error("Invalid response from Shiprocket order creation.")
    }
  } catch (error) {
    console.error("Error creating Shiprocket order:", error)
    throw error
  }
}

/**
 * Fetches tracking details from Shiprocket.
 * @param awbCode The AWB number to track.
 * @returns Tracking events.
 */
export async function getShiprocketTrackingDetails(awbCode: string) {
  const token = await getShiprocketToken()

  console.log(`Fetching Shiprocket tracking details for AWB: ${awbCode}`)

  try {
    const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/track?awb=${awbCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Shiprocket tracking error:", errorData)
      throw new Error(`Failed to fetch Shiprocket tracking: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    console.log("Shiprocket tracking response:", data)

    if (data.tracking_data && data.tracking_data.track_status === 1) {
      return data.tracking_data.shipment_track_activities.map((activity: any) => ({
        timestamp: activity.date,
        status: activity.activity,
        location: activity.location,
      }))
    } else {
      return [] // No tracking data or tracking not found
    }
  } catch (error) {
    console.error("Error fetching Shiprocket tracking details:", error)
    throw error
  }
}
