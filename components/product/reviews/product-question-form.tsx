"use client"
import { useActionState } from "react"
import { submitQuestion } from "@/actions/qa"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface ProductQuestionFormProps {
  productId: string
  onQuestionSubmitted: () => void
  onClose: () => void
}

export function ProductQuestionForm({ productId, onQuestionSubmitted, onClose }: ProductQuestionFormProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [state, formAction, isPending] = useActionState(submitQuestion.bind(null, productId), null)

  const handleSubmit = async (formData: FormData) => {
    if (!user && !loading) {
      toast({
        title: "Login Required",
        description: "Please log in to ask a question.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const result = await formAction(formData)
    if (result?.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      onQuestionSubmitted()
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
        <Label htmlFor="question">Your Question</Label>
        <Textarea
          id="question"
          name="question"
          placeholder="Ask a question about this product..."
          required
          rows={4}
          disabled={isPending || loading}
        />
      </div>
      <Button type="submit" disabled={isPending || loading}>
        {isPending ? "Submitting..." : "Submit Question"}
      </Button>
    </form>
  )
}
