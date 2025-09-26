"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase" // Assuming you have firebase auth initialized
import { sendPasswordResetNotification } from "@/actions/notifications" // Import the new action

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")
    setIsError(false)

    try {
      await sendPasswordResetEmail(auth, email) // Firebase Auth handles sending the actual email
      await sendPasswordResetNotification(email) // Simulate sending our custom notification

      setMessage("If an account with that email exists, a password reset link has been sent to your inbox.")
      setIsError(false)
      setEmail("") // Clear email input
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for instructions.",
      })
    } catch (error: any) {
      console.error("Error sending password reset email:", error)
      setIsError(true)
      if (error.code === "auth/user-not-found") {
        setMessage("If an account with that email exists, a password reset link has been sent to your inbox.")
      } else {
        setMessage("Failed to send password reset email. Please try again later.")
      }
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Forgot Password?</CardTitle>
          <CardDescription>Enter your email to receive a password reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
            {message && (
              <p className={`text-center text-sm ${isError ? "text-red-500" : "text-green-600"}`}>{message}</p>
            )}
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
