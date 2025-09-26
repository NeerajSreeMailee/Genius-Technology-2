import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "./firebase"

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  const timestamp = Date.now()
  const path = `products/${productId}/${timestamp}_${file.name}`
  return uploadImage(file, path)
}

export const uploadUserAvatar = async (file: File, userId: string): Promise<string> => {
  const path = `users/${userId}/avatar_${Date.now()}_${file.name}`
  return uploadImage(file, path)
}

export const uploadBrandLogo = async (file: File, brandId: string): Promise<string> => {
  const path = `brands/${brandId}/logo_${Date.now()}_${file.name}`
  return uploadImage(file, path)
}

export const uploadCategoryImage = async (file: File, categoryId: string): Promise<string> => {
  const path = `categories/${categoryId}/image_${Date.now()}_${file.name}`
  return uploadImage(file, path)
}

export const deleteImage = async (url: string): Promise<void> => {
  try {
    const imageRef = ref(storage, url)
    await deleteObject(imageRef)
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}

export const getDownloadURLFromPath = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error("Error getting download URL:", error)
    throw error
  }
}

export const convertFirebaseStorageURL = async (gsUrl: string): Promise<string> => {
  try {
    // Extract path from gs:// URL
    const path = gsUrl.replace('gs://genius-technology-21eca.firebasestorage.app/', '')
    return await getDownloadURLFromPath(path)
  } catch (error) {
    console.error("Error converting Firebase Storage URL:", error)
    return "/placeholder.svg" // Return placeholder on error
  }
}
