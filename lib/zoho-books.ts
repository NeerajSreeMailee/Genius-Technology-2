import type { Order, User, Product } from "@/types"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

const ZOHO_BOOKS_CLIENT_ID = process.env.ZOHO_BOOKS_CLIENT_ID!
const ZOHO_BOOKS_CLIENT_SECRET = process.env.ZOHO_BOOKS_CLIENT_SECRET!
const ZOHO_BOOKS_REFRESH_TOKEN = process.env.ZOHO_BOOKS_REFRESH_TOKEN!
const ZOHO_BOOKS_ORGANIZATION_ID = process.env.ZOHO_BOOKS_ORGANIZATION_ID!
const ZOHO_BOOKS_ACCOUNTS_URL = "https://accounts.zoho.com" // Or your specific Zoho Accounts URL
const ZOHO_BOOKS_API_URL = "https://books.zoho.com/api/v3" // Or your specific Zoho Books API URL

let accessToken: string | null = null
let tokenExpiry: Date | null = null

async function refreshAccessToken(): Promise<string> {
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken
  }

  console.log("Refreshing Zoho Books access token...")
  const params = new URLSearchParams()
  params.append("client_id", ZOHO_BOOKS_CLIENT_ID)
  params.append("client_secret", ZOHO_BOOKS_CLIENT_SECRET)
  params.append("refresh_token", ZOHO_BOOKS_REFRESH_TOKEN)
  params.append("grant_type", "refresh_token")

  try {
    const response = await fetch(`${ZOHO_BOOKS_ACCOUNTS_URL}/oauth/v2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Failed to refresh Zoho Books access token:", errorData)
      throw new Error(`Failed to refresh Zoho Books access token: ${errorData.error}`)
    }

    const data = await response.json()
    accessToken = data.access_token
    tokenExpiry = new Date(Date.now() + data.expires_in * 1000 - 60000) // 1 minute buffer
    console.log("Zoho Books access token refreshed successfully.")
    return accessToken
  } catch (error) {
    console.error("Error refreshing Zoho Books access token:", error)
    throw error
  }
}

async function zohoBooksApiCall(endpoint: string, method: string, body?: any): Promise<any> {
  const token = await refreshAccessToken()
  const url = `${ZOHO_BOOKS_API_URL}/${endpoint}?organization_id=${ZOHO_BOOKS_ORGANIZATION_ID}`

  const headers: HeadersInit = {
    Authorization: `Zoho-oauthtoken ${token}`,
    "Content-Type": "application/json",
  }

  const options: RequestInit = {
    method,
    headers,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    const errorData = await response.json()
    console.error(`Zoho Books API Error (${endpoint}):`, errorData)
    throw new Error(`Zoho Books API Error: ${errorData.message || response.statusText}`)
  }

  return response.json()
}

async function getOrCreateContact(user: User, shippingAddress: Order["shippingAddress"]): Promise<string> {
  try {
    // Try to find contact by email
    const contactsResponse = await zohoBooksApiCall(`contacts?email=${user.email}`, "GET")
    if (contactsResponse.contacts && contactsResponse.contacts.length > 0) {
      console.log(`Found existing Zoho Books contact for ${user.email}: ${contactsResponse.contacts[0].contact_id}`)
      return contactsResponse.contacts[0].contact_id
    }
  } catch (error) {
    console.warn(`Could not find Zoho Books contact by email, attempting to create. Error: ${error}`)
    // Continue to create if not found or error occurred
  }

  // If not found, create a new contact
  console.log(`Creating new Zoho Books contact for ${user.email}...`)
  const newContact = {
    contact_name: `${user.firstName} ${user.lastName}`,
    contact_type: "customer",
    customer_sub_type: "individual",
    email: user.email,
    phone: user.phone || shippingAddress.phone,
    billing_address: {
      address: shippingAddress.addressLine1 + (shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""),
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.pincode,
      country: "India", // Assuming India, adjust if needed
      phone: shippingAddress.phone,
    },
    shipping_address: {
      address: shippingAddress.addressLine1 + (shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""),
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.pincode,
      country: "India", // Assuming India, adjust if needed
      phone: shippingAddress.phone,
    },
  }

  const createContactResponse = await zohoBooksApiCall("contacts", "POST", { JSONString: JSON.stringify(newContact) })
  console.log(`New Zoho Books contact created: ${createContactResponse.contact.contact_id}`)
  return createContactResponse.contact.contact_id
}

export async function createZohoInvoice(
  orderId: string,
): Promise<{ success: boolean; invoiceId?: string; invoiceUrl?: string; message: string }> {
  try {
    const orderDoc = await getDoc(doc(db, "orders", orderId))
    if (!orderDoc.exists()) {
      return { success: false, message: "Order not found." }
    }
    const order = orderDoc.data() as Order

    const userDoc = await getDoc(doc(db, "users", order.userId))
    if (!userDoc.exists()) {
      return { success: false, message: "User not found for order." }
    }
    const user = userDoc.data() as User

    const contactId = await getOrCreateContact(user, order.shippingAddress)

    const lineItems = await Promise.all(
      order.items.map(async (item) => {
        const productDoc = await getDoc(doc(db, "products", item.productId))
        const product = productDoc.exists() ? (productDoc.data() as Product) : null

        // In a real scenario, you might need to create/lookup items in Zoho Books
        // For simplicity, we'll just use the product name and price.
        return {
          item_id: "", // If you have Zoho Books items, populate this
          name: item.productName,
          description: product?.description || item.productName,
          rate: item.price,
          quantity: item.quantity,
        }
      }),
    )

    const invoicePayload = {
      customer_id: contactId,
      date: new Date().toISOString().split("T")[0], // Current date
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      line_items: lineItems,
      shipping_charge: order.total - order.items.reduce((sum, i) => sum + i.price * i.quantity, 0), // Calculate shipping if any
      notes: order.specialInstructions || `Order ID: ${order.id}`,
      terms: "Thank you for your business!",
      // You can add more fields like custom fields, salesperson, etc.
    }

    console.log("Creating Zoho Books invoice with payload:", JSON.stringify(invoicePayload, null, 2))

    const createInvoiceResponse = await zohoBooksApiCall("invoices", "POST", {
      JSONString: JSON.stringify(invoicePayload),
    })

    const invoiceId = createInvoiceResponse.invoice.invoice_id
    const invoiceNumber = createInvoiceResponse.invoice.invoice_number
    const invoiceUrl = `https://books.zoho.com/app/${ZOHO_BOOKS_ORGANIZATION_ID}/invoices/${invoiceId}` // Replace 123456789 with your organization ID

    console.log(`Zoho Books invoice created: ${invoiceNumber} (ID: ${invoiceId})`)

    return { success: true, invoiceId, invoiceUrl, message: "Invoice generated successfully." }
  } catch (error: any) {
    console.error("Error creating Zoho Books invoice:", error)
    return { success: false, message: error.message || "Failed to generate invoice in Zoho Books." }
  }
}

export async function recordInvoicePayment(
  invoiceId: string,
  amount: number,
  paymentMode: string,
  transactionId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const paymentPayload = {
      invoice_id: invoiceId,
      amount: amount,
      payment_mode: paymentMode, // e.g., "Cash", "Bank Transfer", "Razorpay", "Stripe"
      date: new Date().toISOString().split("T")[0],
      reference_number: transactionId,
      description: `Payment for invoice ${invoiceId} via ${paymentMode}`,
    }

    console.log("Recording Zoho Books invoice payment with payload:", JSON.stringify(paymentPayload, null, 2))

    const recordPaymentResponse = await zohoBooksApiCall("customerpayments", "POST", {
      JSONString: JSON.stringify(paymentPayload),
    })

    console.log(`Zoho Books payment recorded for invoice ${invoiceId}: ${recordPaymentResponse.payment.payment_id}`)
    return { success: true, message: "Payment recorded successfully in Zoho Books." }
  } catch (error: any) {
    console.error("Error recording Zoho Books invoice payment:", error)
    return { success: false, message: error.message || "Failed to record payment in Zoho Books." }
  }
}
