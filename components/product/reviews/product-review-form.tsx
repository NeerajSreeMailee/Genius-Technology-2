"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { submitProductReview } from "@/actions/reviews"
import { useAuth } from "@/contexts/auth-context"
import { DialogFooter } from "@/components/ui/dialog"

interface ProductReviewFormProps {
  productId: string
  onReviewSubmitted: () => void
  onClose: () => void
}

export function ProductReviewForm({ productId, onReviewSubmitted, onClose }: ProductReviewFormProps) {
  const { user, loading: authLoading } = useAuth()
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      })
      return
    }
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating.",
        variant: "destructive",
      })
      return
    }
    if (reviewText.trim() === "") {
      toast({
        title: "Review Required",
        description: "Please write your review.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const result = await submitProductReview(productId, rating, reviewText)
    setIsSubmitting(false)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      setRating(0)
      setReviewText("")
      onReviewSubmitted()
      onClose()
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="rating">Your Rating</Label>
        <div className="flex space-x-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="review">Your Review</Label>
        <Textarea
          id="review"
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={5}
          className="mt-1"
        />
      </div>
      {/* Image upload functionality can be added here */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || authLoading}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogFooter>
    </form>
  )
}
