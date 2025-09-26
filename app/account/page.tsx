"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AccountRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to my-account page
    router.replace("/my-account")
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
        <p className="text-gray-600">Taking you to your account page.</p>
      </div>
    </div>
  )
}
