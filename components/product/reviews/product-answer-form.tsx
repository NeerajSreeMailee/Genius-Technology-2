"use client"
import { useFormState } from "react-dom"  // Changed from react
import { submitAnswer } from "@/actions/qa"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"  // Added

interface ProductAnswerFormProps {
  productId: string
  questionId: string
  onAnswerSubmitted: () => void
  onClose: () => void
}

export function ProductAnswerForm({ productId, questionId, onAnswerSubmitted, onClose }: ProductAnswerFormProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)  // Added manual pending state
  const [state, formAction] = useFormState(submitAnswer.bind(null, productId, questionId), null)  // Removed isPending from destructure

  const handleSubmit = async (formData: FormData) => {
    if (!user && !loading) {
      toast({
        title: "Login Required",
        description: "Please log in to answer a question.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsPending(true)
    const result = await formAction(formData)
    setIsPending(false)
    
    if (result?.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      onAnswerSubmitted()
      onClose()
    } else if (result?.message) {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <form action={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="answer">Your Answer</Label>
        <Textarea
          id="answer"
          name="answer"
          placeholder="Provide an answer to this question..."
          required
          rows={4}
          disabled={isPending || loading}
        />
      </div>
      <Button type="submit" disabled={isPending || loading}>
        {isPending ? "Submitting..." : "Submit Answer"}
      </Button>
    </form>
  )
}
