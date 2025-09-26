import { NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import type { Order } from "@/types"
import { recordInvoicePayment } from "@/lib/zoho-books"

const PAYU_SALT = process.env.PAYU_SALT || "YOUR_PAYU_SALT" // Must match the salt used for hash generation

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const data: { [key: string]: string } = {}
    for (const [key, value] of formData.entries()) {
      data[key] = value.toString()
    }

    const {
      status,
      txnid, // PayU Transaction ID
      amount,
      productinfo,
      firstname,
      email,
      phone,
      hash, // Hash received from PayU
      udf1: internalOrderId, // Our internal order ID passed as udf1
      // ... other fields from PayU IPN
    } = data

    if (!status || !txnid || !amount || !internalOrderId || !hash) {
      return NextResponse.json({ error: "Missing required IPN fields" }, { status: 400 })
    }

    // 1. Verify the hash to ensure the request is from PayU
    // The hash string for verification is typically:
    // status|salt|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||
    // Note: The order of parameters is crucial and must match PayU's documentation for IPN.
    // The salt is appended at the end for IPN verification.
    const hashString = `${status}|${PAYU_SALT}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${internalOrderId}||||||||||`
    const calculatedHash = crypto.createHash("sha512").update(hashString).digest("hex")

    if (calculatedHash !== hash) {
      console.error("PayU Webhook: Hash verification failed for transaction:", txnid)
      return NextResponse.json({ error: "Hash verification failed" }, { status: 403 })
    }

    // 2. Find the corresponding order in Firestore using the internalOrderId
    const ordersRef = collection(db, "orders")
    const q = query(ordersRef, where("paymentTransactionId", "==", txnid)) // Assuming txnid is stored as paymentTransactionId
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.warn("PayU Webhook: Order not found for transaction ID:", txnid, "Internal Order ID:", internalOrderId)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const orderDoc = querySnapshot.docs[0]
    const orderRef = doc(db, "orders", orderDoc.id)
    const orderData = orderDoc.data() as Order

    let newPaymentStatus: "pending" | "paid" | "failed" = "pending"
    let newOrderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" = "pending"

    if (status === "success") {
      newPaymentStatus = "paid"
      newOrderStatus = "confirmed" // Or 'processing', depending on your workflow
      console.log(`PayU Webhook: Payment successful for order ${orderDoc.id}, Txn ID: ${txnid}`)
    } else if (status === "failure") {
      newPaymentStatus = "failed"
      newOrderStatus = "cancelled"
      console.log(`PayU Webhook: Payment failed for order ${orderDoc.id}, Txn ID: ${txnid}`)
    } else {
      // Handle other statuses like 'pending', 'dropped', etc.
      console.log(`PayU Webhook: Payment status ${status} for order ${orderDoc.id}, Txn ID: ${txnid}`)
      newPaymentStatus = status as any // Cast to handle other potential statuses if needed
    }

    // 3. Update the order status in Firestore
    await updateDoc(orderRef, {
      paymentStatus: newPaymentStatus,
      status: newOrderStatus,
      updatedAt: new Date(),
      // You might want to store more details from the IPN here
      payuResponse: data, // Store the full PayU response for debugging
    })

    // Record payment in Zoho Books if an invoice exists and payment was successful
    if (newPaymentStatus === "paid" && orderData.zohoInvoiceId) {
      await recordInvoicePayment(orderData.zohoInvoiceId, Number.parseFloat(amount), "PayU", txnid)
      console.log(`Payment recorded in Zoho Books for invoice ${orderData.zohoInvoiceId}.`)
    } else if (newPaymentStatus === "paid" && !orderData.zohoInvoiceId) {
      console.warn(`Order ${orderDoc.id} has no Zoho Invoice ID. Payment not recorded in Zoho Books.`)
    }

    return NextResponse.json({ success: true, message: "Webhook processed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error processing PayU webhook:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
