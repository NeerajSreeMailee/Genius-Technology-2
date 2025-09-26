import { NextResponse } from "next/server"
import crypto from "crypto"

// PayU Test/Sandbox Credentials (replace with production ones)
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || "YOUR_PAYU_MERCHANT_KEY"
const PAYU_SALT = process.env.PAYU_SALT || "YOUR_PAYU_SALT"
const PAYU_BASE_URL = process.env.PAYU_BASE_URL || "https://test.payu.in" // Use "https://secure.payu.in" for production

export async function POST(req: Request) {
  try {
    const { amount, email, phone, productInfo, firstName, userRef, sUrl, fUrl } = await req.json()

    if (!amount || !email || !phone || !productInfo || !firstName || !userRef || !sUrl || !fUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const txnid = `TXN${Date.now()}` // Unique transaction ID

    // Construct the string for hash calculation
    // Format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productInfo}|${firstName}|${email}|${userRef}||||||||||${PAYU_SALT}`

    // Calculate SHA512 hash
    const hash = crypto.createHash("sha512").update(hashString).digest("hex")

    const paymentData = {
      key: PAYU_MERCHANT_KEY,
      txnid: txnid,
      amount: amount.toFixed(2), // Ensure 2 decimal places
      productinfo: productInfo,
      firstname: firstName,
      email: email,
      phone: phone,
      surl: sUrl, // Success URL
      furl: fUrl, // Failure URL
      hash: hash,
      udf1: userRef, // Custom field to store internal user ID or order ID
      // Add other required PayU parameters as needed
    }

    return NextResponse.json({
      success: true,
      payuUrl: `${PAYU_BASE_URL}/_payment`,
      paymentData,
    })
  } catch (error) {
    console.error("Error initiating PayU payment:", error)
    return NextResponse.json({ error: "Failed to initiate PayU payment" }, { status: 500 })
  }
}
