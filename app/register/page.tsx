"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { sendWelcomeNotification } from "@/actions/notifications"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (!agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the Terms & Conditions.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: "user",
        subscribeNewsletter,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await sendWelcomeNotification(user.uid)

      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <Card className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-[36px] text-[#004AAD] font-bold">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Form starts here */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                  I agree to{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms & Conditions
                  </Link>
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="subscribe-newsletter"
                  type="checkbox"
                  checked={subscribeNewsletter}
                  onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="subscribe-newsletter" className="ml-2 block text-sm text-gray-900">
                  Subscribe to newsletter
                </label>
              </div>
            </div>
            {/* The corrected button placement */}
            <Button type="submit" className="w-full bg-[#004AAD] text-white mt-[50px]" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          {/* Form ends here */}

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-[#FFCC01]">
        <div className="flex flex-col justify-center items-center px-[150px] text-white">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6">Welcome to Genius Technology</h2>
            <p className="text-xl text-orange-100 mb-8">
              Discover premium mobile accessories and smart devices with fast delivery across India.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center text-orange-100">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>Premium Quality Products</span>
              </div>
              <div className="flex items-center text-orange-100">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>Fast & Free Delivery</span>
              </div>
              <div className="flex items-center text-orange-100">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center text-orange-100">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>Easy Returns & Exchanges</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}