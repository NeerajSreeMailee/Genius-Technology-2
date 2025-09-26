"use server"

import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage"
import { storage } from "@/lib/firebase"
import type { BlogPost } from "@/types"
import { revalidatePath } from "next/cache"

// Helper to generate a slug from a title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .trim() // Trim leading/trailing whitespace
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
}

export async function createBlogPost(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const authorId = formData.get("authorId") as string
  const authorName = formData.get("authorName") as string
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
  const isPublished = formData.get("isPublished") === "true"
  const imageFile = formData.get("image") as File | null

  if (!title || !content || !authorId || !authorName) {
    return { success: false, message: "Missing required fields." }
  }

  try {
    let imageUrl: string | undefined
    if (imageFile && imageFile.size > 0) {
      const imageRef = ref(storage, `blog_images/${Date.now()}-${imageFile.name}`)
      await uploadBytes(imageRef, imageFile)
      imageUrl = await getDownloadURL(imageRef)
    }

    const slug = generateSlug(title)
    const newPost: Omit<BlogPost, "id"> = {
      title,
      slug,
      content,
      authorId,
      authorName,
      imageUrl,
      tags,
      isPublished,
      publishedAt: isPublished ? new Date() : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await addDoc(collection(db, "blogPosts"), newPost)
    revalidatePath("/blog")
    revalidatePath("/admin/blog")
    return { success: true, message: "Blog post created successfully!" }
  } catch (error) {
    console.error("Error creating blog post:", error)
    return { success: false, message: "Failed to create blog post." }
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
  const isPublished = formData.get("isPublished") === "true"
  const existingImageUrl = formData.get("existingImageUrl") as string | undefined
  const imageFile = formData.get("image") as File | null
  const removeImage = formData.get("removeImage") === "true"

  if (!title || !content) {
    return { success: false, message: "Missing required fields." }
  }

  try {
    let imageUrl: string | undefined = existingImageUrl

    if (removeImage && existingImageUrl) {
      const imageRef = ref(storage, existingImageUrl)
      await deleteObject(imageRef)
      imageUrl = undefined
    } else if (imageFile && imageFile.size > 0) {
      // If new image is uploaded, delete old one if exists
      if (existingImageUrl) {
        const oldImageRef = ref(storage, existingImageUrl)
        await deleteObject(oldImageRef)
      }
      const imageRef = ref(storage, `blog_images/${Date.now()}-${imageFile.name}`)
      await uploadBytes(imageRef, imageFile)
      imageUrl = await getDownloadURL(imageRef)
    }

    const slug = generateSlug(title)
    const updatedFields: Partial<BlogPost> = {
      title,
      slug,
      content,
      imageUrl,
      tags,
      isPublished,
      updatedAt: new Date(),
    }

    // Only update publishedAt if it's being published now and wasn't before
    if (isPublished && !formData.get("originalIsPublished")) {
      updatedFields.publishedAt = new Date()
    } else if (!isPublished) {
      updatedFields.publishedAt = undefined // Unpublish
    }

    await updateDoc(doc(db, "blogPosts", id), updatedFields)
    revalidatePath("/blog")
    revalidatePath(`/blog/${slug}`)
    revalidatePath("/admin/blog")
    return { success: true, message: "Blog post updated successfully!" }
  } catch (error) {
    console.error("Error updating blog post:", error)
    return { success: false, message: "Failed to update blog post." }
  }
}

export async function deleteBlogPost(id: string, imageUrl?: string) {
  try {
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl)
      await deleteObject(imageRef)
    }
    await deleteDoc(doc(db, "blogPosts", id))
    revalidatePath("/blog")
    revalidatePath("/admin/blog")
    return { success: true, message: "Blog post deleted successfully!" }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, message: "Failed to delete blog post." }
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const q = query(collection(db, "blogPosts"), orderBy("publishedAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as BlogPost[]
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const q = query(collection(db, "blogPosts"), where("slug", "==", slug))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return null
    }
    const docData = querySnapshot.docs[0].data()
    return {
      id: querySnapshot.docs[0].id,
      ...docData,
      publishedAt: docData.publishedAt?.toDate(),
      createdAt: docData.createdAt?.toDate(),
      updatedAt: docData.updatedAt?.toDate(),
    } as BlogPost
  } catch (error) {
    console.error("Error fetching blog post by slug:", error)
    return null
  }
}
