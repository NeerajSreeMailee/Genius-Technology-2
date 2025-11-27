"use server"

import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import type { Order, User } from "@/types"

// Twilio SMS integration
async function sendSMS(to: string, message: string) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      console.log("Twilio credentials not configured, skipping SMS")
      return
    }

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: to,
        Body: message,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Twilio SMS error:", error)
    } else {
      console.log(`SMS sent successfully to ${to}`)
    }
  } catch (error) {
    console.error("Error sending SMS:", error)
  }
}

// Email integration (using Resend or similar service)
async function sendEmail(to: string, subject: string, html: string) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      console.log("Resend API key not configured, skipping email")
      return
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Genius Technology <noreply@geniustech.com>",
        to: [to],
        subject: subject,
        html: html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Email sending error:", error)
    } else {
      console.log(`Email sent successfully to ${to}`)
    }
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

export async function sendOrderConfirmationNotification(orderId: string) {
  try {
    const orderDoc = await getDoc(doc(db, "orders", orderId))
    if (!orderDoc.exists()) {
      console.error(`Order ${orderId} not found for confirmation notification.`)
      return { success: false, message: "Order not found." }
    }
    const order = orderDoc.data() as Order

    const userDoc = await getDoc(doc(db, "users", order.userId))
    const user = userDoc.exists() ? (userDoc.data() as User) : null

    if (!user || !user.email) {
      console.error(`User or user email not found for order ${orderId}.`)
      return { success: false, message: "User email not found." }
    }

    const subject = `Order #${orderId.slice(-8)} Confirmed - Genius Technology`
    const emailBody = `
      <h1>Thank you for your order, ${user.name}!</h1>
      <p>Your order #${orderId.slice(-8)} has been successfully placed and is being processed.</p>
      <p><strong>Order Total:</strong> ₹${order.total.toLocaleString()}</p>
      <p>You can view your order details here: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account/orders/${orderId}">View Order</a></p>
      <p>We will notify you once your order has been shipped.</p>
      <br/>
      <p>Thanks,</p>
      <p>The Genius Technology Team</p>
    `
    await sendEmail(user.email, subject, emailBody)

    if (user.phone) {
      const smsMessage = `Hi ${user.name}, your Genius Technology order #${orderId.slice(-8)} for ₹${order.total.toLocaleString()} has been confirmed. Track it at ${process.env.NEXT_PUBLIC_BASE_URL}/account/orders/${orderId}`
      await sendSMS(user.phone, smsMessage)
    }

    return { success: true, message: "Order confirmation sent." }
  } catch (error) {
    console.error("Error sending order confirmation:", error)
    return { success: false, message: "Failed to send order confirmation." }
  }
}

export async function sendShipmentUpdateNotification(orderId: string, newStatus: string, trackingId?: string) {
  try {
    const orderDoc = await getDoc(doc(db, "orders", orderId))
    if (!orderDoc.exists()) {
      console.error(`Order ${orderId} not found for shipment update notification.`)
      return { success: false, message: "Order not found." }
    }
    const order = orderDoc.data() as Order

    const userDoc = await getDoc(doc(db, "users", order.userId))
    const user = userDoc.exists() ? (userDoc.data() as User) : null

    if (!user || !user.email) {
      console.error(`User or user email not found for order ${orderId}.`)
      return { success: false, message: "User email not found." }
    }

    let subject = `Your Genius Technology Order #${orderId.slice(-8)} Status Update`
    let emailBody = `<h1>Order #${orderId.slice(-8)} Status: ${newStatus}</h1>`
    let smsMessage = `Genius Tech Order #${orderId.slice(-8)} status: ${newStatus}.`

    if (newStatus === "shipped") {
      subject = `Your Genius Technology Order #${orderId.slice(-8)} Has Shipped!`
      emailBody += `<p>Great news! Your order has been shipped and is on its way.</p>`
      smsMessage += ` It's on its way!`
      if (trackingId) {
        emailBody += `<p><strong>Tracking ID:</strong> ${trackingId}</p>`
        emailBody += `<p>Track your order here: <a href="https://www.shiprocket.in/tracking/${trackingId}">Track Shipment</a></p>`
        smsMessage += ` Tracking: ${trackingId}`
      }
    } else if (newStatus === "delivered") {
      subject = `Your Genius Technology Order #${orderId.slice(-8)} Has Been Delivered!`
      emailBody += `<p>Your order has been successfully delivered. We hope you enjoy your products!</p>`
      smsMessage += ` It has been delivered!`
    } else if (newStatus === "out for delivery") {
      subject = `Your Genius Technology Order #${orderId.slice(-8)} is Out for Delivery!`
      emailBody += `<p>Your order is out for delivery and will reach you soon.</p>`
      smsMessage += ` It's out for delivery!`
    }

    emailBody += `<p>View your order details: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account/orders/${orderId}">View Order</a></p>`
    emailBody += `<br/><p>Thanks,</p><p>The Genius Technology Team</p>`

    await sendEmail(user.email, subject, emailBody)

    if (user.phone) {
      await sendSMS(user.phone, smsMessage)
    }

    return { success: true, message: "Shipment update notification sent." }
  } catch (error) {
    console.error("Error sending shipment update notification:", error)
    return { success: false, message: "Failed to send shipment update notification." }
  }
}

export async function sendWelcomeNotification(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (!userDoc.exists()) {
      console.error(`User ${userId} not found for welcome notification.`)
      return { success: false, message: "User not found." }
    }
    const user = userDoc.data() as User

    if (!user.email) {
      console.error(`User email not found for user ${userId}.`)
      return { success: false, message: "User email not found." }
    }

    const subject = `Welcome to Genius Technology, ${user.name}!`
    const emailBody = `
      <h1>Welcome to Genius Technology!</h1>
      <p>Dear ${user.name},</p>
      <p>Thank you for creating an account with Genius Technology. We're excited to have you join our community.</p>
      <p>Explore our wide range of electronics, gadgets, and tech accessories. We're sure you'll find something you love!</p>
      <p>Start shopping now: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/products">Browse Products</a></p>
      <br/>
      <p>If you have any questions, feel free to contact our support team.</p>
      <br/>
      <p>Happy Shopping!</p>
      <p>The Genius Technology Team</p>
    `
    await sendEmail(user.email, subject, emailBody)

    if (user.phone) {
      const smsMessage = `Welcome to Genius Technology, ${user.name}! Explore our products: ${process.env.NEXT_PUBLIC_BASE_URL}/products`
      await sendSMS(user.phone, smsMessage)
    }

    return { success: true, message: "Welcome notification sent." }
  } catch (error) {
    console.error("Error sending welcome notification:", error)
    return { success: false, message: "Failed to send welcome notification." }
  }
}

export async function sendPasswordResetNotification(email: string) {
  try {
    const subject = `Password Reset Request for Genius Technology Account`
    const emailBody = `
      <h1>Password Reset Request</h1>
      <p>Dear User,</p>
      <p>We received a request to reset the password for your Genius Technology account associated with this email address (${email}).</p>
      <p>If you initiated this request, please click on the link below to reset your password:</p>
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?email=${encodeURIComponent(email)}&token=YOUR_RESET_TOKEN">Reset Password</a></p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <br/>
      <p>Thanks,</p>
      <p>The Genius Technology Team</p>
    `
    await sendEmail(email, subject, emailBody)

    return { success: true, message: "Password reset notification sent." }
  } catch (error) {
    console.error("Error sending password reset notification:", error)
    return { success: false, message: "Failed to send password reset notification." }
  }
}

export async function sendCorporateInquiryConfirmation(
  inquiryId: string,
  contactEmail: string,
  contactPerson: string,
  companyName: string
) {
  try {
    const subject = `Corporate Inquiry Received - Genius Technology`
    const emailBody = `
      <h1>Thank you for your corporate inquiry!</h1>
      <p>Dear ${contactPerson},</p>
      <p>Thank you for submitting a corporate inquiry on behalf of ${companyName}.</p>
      <p>We have received your inquiry (Reference ID: ${inquiryId}) and our team will review it shortly. We typically respond to corporate inquiries within 1-2 business days.</p>
      <p>If you have any urgent questions, please feel free to contact us at corporate@geniustech.com.</p>
      <br/>
      <p>Best regards,</p>
      <p>The Genius Technology Corporate Team</p>
    `
    await sendEmail(contactEmail, subject, emailBody)

    return { success: true, message: "Corporate inquiry confirmation sent." }
  } catch (error) {
    console.error("Error sending corporate inquiry confirmation:", error)
    return { success: false, message: "Failed to send corporate inquiry confirmation." }
  }
}
