"use client"

import type { BlogPost } from "@/types"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useFormState } from "react-dom"
import { createBlogPost, updateBlogPost } from "@/actions/blog"
import Image from "next/image"
import { XCircle } from "lucide-react"

interface BlogPostFormProps {
  post?: BlogPost // Optional, for editing existing posts
  onSuccess: () => void
  onCancel: () => void
  authorId: string
  authorName: string
}

export function BlogPostForm({ post, onSuccess, onCancel, authorId, authorName }: BlogPostFormProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(post?.imageUrl || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [removeExistingImage, setRemoveExistingImage] = useState(false)

  const [state, formAction] = useFormState(async (prevState: any, formData: FormData) => {
    setIsSaving(true)
    let result
    if (post) {
      // For update, append existing image URL and remove flag
      formData.append("existingImageUrl", post.imageUrl || "")
      formData.append("removeImage", String(removeExistingImage))
      formData.append("originalIsPublished", String(post.isPublished)) // Pass original published status
      result = await updateBlogPost(post.id, formData)
    } else {
      formData.append("authorId", authorId)
      formData.append("authorName", authorName)
      result = await createBlogPost(formData)
    }
    setIsSaving(false)
    if (result.success) {
      toast({ title: result.message })
      onSuccess()
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" })
    }
    return result
  }, null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setRemoveExistingImage(false) // If new image is selected, don't remove existing
    } else {
      setImageFile(null)
      setImagePreview(post?.imageUrl || null) // Revert to existing if no new file
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setRemoveExistingImage(true)
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={post?.title || ""} required />
      </div>
      <div>
        <Label htmlFor="content">Content (Markdown/HTML)</Label>
        <Textarea id="content" name="content" defaultValue={post?.content || ""} rows={10} required />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={post?.tags.join(", ") || ""}
          placeholder="e.g., tech, reviews, news"
        />
      </div>
      <div>
        <Label htmlFor="image">Featured Image</Label>
        <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div className="relative mt-2 w-48 h-32 border rounded-md overflow-hidden">
            <Image src={imagePreview || "/placeholder.svg"} alt="Image Preview" layout="fill" objectFit="cover" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 bg-white rounded-full p-1"
              onClick={handleRemoveImage}
            >
              <XCircle className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        )}
        {post?.imageUrl && !imagePreview && !removeExistingImage && (
          <p className="text-sm text-gray-500 mt-1">
            Existing image will be kept unless a new one is uploaded or removed.
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="isPublished" name="isPublished" defaultChecked={post?.isPublished || false} value="true" />
        <Label htmlFor="isPublished">Publish Post</Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  )
}
