"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { StaticPage } from "@/types"

interface StaticPageFormProps {
  page?: StaticPage | null
  onSave: (pageData: Omit<StaticPage, "id" | "lastModifiedAt">) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}

export function StaticPageForm({ page, onSave, onCancel, isSaving }: StaticPageFormProps) {
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    content: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (page) {
      setFormData({
        slug: page.slug,
        title: page.title,
        content: page.content,
      })
    } else {
      setFormData({
        slug: "",
        title: "",
        content: "",
      })
    }
  }, [page])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.slug || !formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      })
      return
    }
    await onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Page Title</Label>
        <Input id="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="slug">Page Slug (e.g., about-us, privacy-policy)</Label>
        <Input id="slug" value={formData.slug} onChange={handleChange} required disabled={!!page?.id} />
        {page?.id && <p className="text-sm text-gray-500 mt-1">Slug cannot be changed for existing pages.</p>}
      </div>
      <div>
        <Label htmlFor="content">Content (HTML or Markdown)</Label>
        <Textarea id="content" value={formData.content} onChange={handleChange} rows={15} required />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Page"}
        </Button>
      </div>
    </form>
  )
}
