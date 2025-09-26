"use server"

import { db } from "@/lib/firebase"
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore"
import type { CorporateInquiry } from "@/types"
import { sendCorporateInquiryConfirmation } from "./notifications"

export async function submitCorporateInquiry(formData: FormData): Promise<{ success: boolean; message: string }> {
  const companyName = formData.get("companyName") as string
  const contactPerson = formData.get("contactPerson") as string
  const contactEmail = formData.get("contactEmail") as string
  const contactPhone = formData.get("contactPhone") as string
  const inquiryDetails = formData.get("inquiryDetails") as string
  const estimatedBudget = formData.get("estimatedBudget") as string
  const requiredProducts = formData.get("requiredProducts") as string

  if (!companyName || !contactPerson || !contactEmail || !inquiryDetails) {
    return { success: false, message: "Missing required fields." }
  }

  try {
    const newInquiry: Omit<CorporateInquiry, "id"> = {
      companyName,
      contactPerson,
      contactEmail,
      contactPhone,
      inquiryDetails,
      estimatedBudget,
      requiredProducts,
      status: "pending", // Initial status
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "corporateInquiries"), newInquiry)

    // Send confirmation notification to the client
    await sendCorporateInquiryConfirmation(docRef.id, contactEmail, contactPerson, companyName)

    return { success: true, message: "Your corporate inquiry has been submitted successfully!" }
  } catch (error) {
    console.error("Error submitting corporate inquiry:", error)
    return { success: false, message: "Failed to submit inquiry. Please try again." }
  }
}

export async function updateCorporateInquiryStatus(
  inquiryId: string,
  newStatus: CorporateInquiry["status"],
): Promise<{ success: boolean; message: string }> {
  try {
    const inquiryRef = doc(db, "corporateInquiries", inquiryId)
    await updateDoc(inquiryRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    })
    return { success: true, message: `Inquiry status updated to ${newStatus}.` }
  } catch (error) {
    console.error("Error updating corporate inquiry status:", error)
    return { success: false, message: "Failed to update inquiry status." }
  }
}

export async function assignSpecialPricing(
  inquiryId: string,
  pricingDetails: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const inquiryRef = doc(db, "corporateInquiries", inquiryId)
    await updateDoc(inquiryRef, {
      specialPricing: pricingDetails,
      updatedAt: serverTimestamp(),
    })
    return { success: true, message: "Special pricing assigned successfully." }
  } catch (error) {
    console.error("Error assigning special pricing:", error)
    return { success: false, message: "Failed to assign special pricing." }
  }
}
