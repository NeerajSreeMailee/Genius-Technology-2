"use server"

import { db } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore"
import { getAuth } from "firebase-admin/auth"
import { initFirebaseAdmin } from "@/lib/firebase-admin"
import { cookies } from "next/headers"
import type { Coupon } from "@/types"

initFirebaseAdmin()

// Helper to verify admin role
async function verifyAdmin() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("__session")?.value

  if (!sessionCookie) {
    throw new Error("Authentication required.")
  }

  try {
    const decodedClaims = await getAuth().verifySessionCookie(sessionCookie, true)
    if (decodedClaims.role !== "admin") {
      throw new Error("Unauthorized: Admin access required.")
    }
    return decodedClaims.uid
  } catch (error) {
    console.error("Admin verification failed:", error)
    throw new Error("Authentication failed or unauthorized access.")
  }
}

/**
 * Fetches all coupons.
 */
export async function getCoupons(): Promise<Coupon[]> {
  try {
    await verifyAdmin() // Ensure only admins can fetch coupons

    const q = query(collection(db, "coupons"))
    const querySnapshot = await getDocs(q)
    const coupons: Coupon[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      expiryDate: doc.data().expiryDate?.toDate(), // Convert Timestamp to Date
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Coupon[]
    return coupons
  } catch (error) {
    console.error("Error fetching coupons:", error)
    throw new Error(`Failed to fetch coupons: ${(error as Error).message}`)
  }
}

/**
 * Creates a new coupon.
 */
export async function createCoupon(couponData: Omit<Coupon, "id" | "createdAt" | "updatedAt" | "usedCount">) {
  try {
    await verifyAdmin()

    const newCoupon: Omit<Coupon, "id"> = {
      ...couponData,
      usedCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiryDate: couponData.expiryDate ? new Date(couponData.expiryDate) : undefined,
    }

    const docRef = await addDoc(collection(db, "coupons"), newCoupon)
    return { success: true, message: "Coupon created successfully!", couponId: docRef.id }
  } catch (error) {
    console.error("Error creating coupon:", error)
    return { success: false, message: `Failed to create coupon: ${(error as Error).message}` }
  }
}

/**
 * Updates an existing coupon.
 */
export async function updateCoupon(couponId: string, updates: Partial<Omit<Coupon, "id" | "createdAt" | "usedCount">>) {
  try {
    await verifyAdmin()

    const couponRef = doc(db, "coupons", couponId)
    await updateDoc(couponRef, {
      ...updates,
      expiryDate: updates.expiryDate ? new Date(updates.expiryDate) : undefined,
      updatedAt: new Date(),
    })
    return { success: true, message: "Coupon updated successfully!" }
  } catch (error) {
    console.error("Error updating coupon:", error)
    return { success: false, message: `Failed to update coupon: ${(error as Error).message}` }
  }
}

/**
 * Deletes a coupon.
 */
export async function deleteCoupon(couponId: string) {
  try {
    await verifyAdmin()

    await deleteDoc(doc(db, "coupons", couponId))
    return { success: true, message: "Coupon deleted successfully!" }
  } catch (error) {
    console.error("Error deleting coupon:", error)
    return { success: false, message: `Failed to delete coupon: ${(error as Error).message}` }
  }
}

/**
 * Applies a coupon code to a given total amount.
 * This is a client-callable function for checkout.
 */
export async function applyCoupon(couponCode: string, totalAmount: number) {
  try {
    const q = query(
      collection(db, "coupons"),
      where("code", "==", couponCode.toUpperCase()),
      where("isActive", "==", true),
    )
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return { success: false, message: "Invalid or inactive coupon code." }
    }

    const couponDoc = querySnapshot.docs[0]
    const coupon = { id: couponDoc.id, ...couponDoc.data() } as Coupon

    // Check expiry date
    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return { success: false, message: "Coupon has expired." }
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { success: false, message: "Coupon usage limit reached." }
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && totalAmount < coupon.minOrderAmount) {
      return { success: false, message: `Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString()} required.` }
    }

    let discountAmount = 0
    if (coupon.type === "percentage") {
      discountAmount = totalAmount * (coupon.value / 100)
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount
      }
    } else if (coupon.type === "fixed") {
      discountAmount = coupon.value
    }

    if (discountAmount > totalAmount) {
      discountAmount = totalAmount // Cannot discount more than total amount
    }

    return {
      success: true,
      message: "Coupon applied successfully!",
      discountAmount: discountAmount,
      couponId: coupon.id,
    }
  } catch (error) {
    console.error("Error applying coupon:", error)
    return { success: false, message: `Failed to apply coupon: ${(error as Error).message}` }
  }
}

/**
 * Increments the usedCount of a coupon after successful order.
 */
export async function incrementCouponUsage(couponId: string) {
  try {
    const couponRef = doc(db, "coupons", couponId)
    const couponSnap = await getDoc(couponRef)

    if (couponSnap.exists()) {
      const currentUsedCount = couponSnap.data().usedCount || 0
      await updateDoc(couponRef, {
        usedCount: currentUsedCount + 1,
        updatedAt: new Date(),
      })
      return { success: true }
    }
    return { success: false, message: "Coupon not found." }
  } catch (error) {
    console.error("Error incrementing coupon usage:", error)
    return { success: false, message: `Failed to increment coupon usage: ${(error as Error).message}` }
  }
}
