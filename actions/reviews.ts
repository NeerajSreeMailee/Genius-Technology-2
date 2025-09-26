"use server"

import { adminDb, adminAuth } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Review, Product } from "@/types"

export async function submitProductReview(
  productId: string,
  rating: number,
  reviewText: string,
  images: string[] = [],
) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("__session")?.value || cookieStore.get("session")?.value

  if (!sessionCookie) {
    redirect("/login")
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
    const userId = decodedClaims.uid

    const userDoc = await adminDb.collection("users").doc(userId).get()
    if (!userDoc.exists) {
      throw new Error("User not found.")
    }
    
    const userData = userDoc.data()
    const userName =
      userData?.firstName && userData?.lastName
        ? `${userData.firstName} ${userData.lastName}`
        : userData?.email || "Anonymous User"

    // Check if the user has purchased this product to mark as verified
    const hasPurchased = await checkUserPurchase(userId, productId)

    const newReview = {
      productId,
      userId,
      userName,
      rating,
      review: reviewText,
      images,
      verifiedPurchase: hasPurchased,
      createdAt: FieldValue.serverTimestamp(),
    }

    // Use Firestore Admin transaction
    await adminDb.runTransaction(async (transaction) => {
      const productRef = adminDb.collection("products").doc(productId)
      const productDoc = await transaction.get(productRef)

      if (!productDoc.exists) {
        throw new Error("Product does not exist!")
      }

      const productData = productDoc.data() as Product
      const currentRating = productData.rating || 0
      const currentReviews = productData.reviews || 0

      // Add the new review to the subcollection
      const reviewRef = productRef.collection("reviews").doc()
      transaction.set(reviewRef, newReview)

      // Calculate new average rating
      const newTotalRating = currentRating * currentReviews + rating
      const newReviewsCount = currentReviews + 1
      const newAverageRating = newTotalRating / newReviewsCount

      // Update product document with new average rating and review count
      transaction.update(productRef, {
        rating: newAverageRating,
        reviews: newReviewsCount,
        updatedAt: FieldValue.serverTimestamp(),
      })
    })

    return { success: true, message: "Review submitted successfully!" }
  } catch (error) {
    console.error("Error submitting review:", error)
    return { success: false, message: "Failed to submit review. Please try again." }
  }
}

export async function getProductReviews(productId: string, limit = 10) {
  try {
    const reviewsSnapshot = await adminDb
      .collection("products")
      .doc(productId)
      .collection("reviews")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get()

    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return { success: true, reviews }
  } catch (error) {
    console.error("Error getting reviews:", error)
    return { success: false, reviews: [] }
  }
}

// Helper function to check if user has purchased the product
async function checkUserPurchase(userId: string, productId: string): Promise<boolean> {
  try {
    const ordersSnapshot = await adminDb
      .collection("orders")
      .where("userId", "==", userId)
      .where("items.productId", "==", productId)
      .limit(1)
      .get()

    return !ordersSnapshot.empty
  } catch (error) {
    console.error("Error checking user purchase:", error)
    // Return true by default for demo purposes
    return true
  }
}
