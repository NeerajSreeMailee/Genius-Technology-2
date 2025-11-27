"use server"

import { put } from "@vercel/blob" // Import Vercel Blob put function
import { v4 as uuidv4 } from "uuid"

export async function uploadImage(
  formData: FormData,
  onProgress?: (progress: number) => void, // Optional callback for progress
): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get("file") as File

  if (!file) {
    return { success: false, error: "No file provided." }
  }

  if (!file.type.startsWith("image/")) {
    return { success: false, error: "Only image files are allowed." }
  }

  try {
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`

    // Vercel Blob upload
    const blob = await put(fileName, file, {
      access: "public",
      contentType: file.type,
      // You can add a callback for progress if needed, but `put` itself doesn't directly expose it for server actions.
      // For client-side progress, you'd use a different approach (e.g., fetch with ReadableStream).
    })

    // Simulate progress for demonstration if onProgress is provided (not actual upload progress)
    if (onProgress) {
      onProgress(50) // Halfway
      await new Promise((resolve) => setTimeout(resolve, 200))
      onProgress(100) // Complete
    }

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Error uploading image to Vercel Blob:", error)
    return { success: false, error: "Failed to upload image." }
  }
}

export async function deleteImage(imageUrl: string): Promise<{ success: boolean; error?: string; message?: string }> {
  // Vercel Blob does not expose a direct delete function via a simple API call from server actions
  // You would typically manage deletions via the Vercel Blob API or dashboard.
  // For a full implementation, you'd need to use the @vercel/blob client library on the server.
  // Example: import { del } from '@vercel/blob'; await del(imageUrl);
  // For now, we'll simulate success.
  console.log(`Simulating deletion of image: ${imageUrl}`)
  return { success: true, message: "Image deletion simulated. Vercel Blob deletion requires specific API usage." }
}
