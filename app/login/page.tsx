"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const { signIn, signInWithGoogle } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      await signIn(email, password)
      router.push("/")
    } catch (error: any) {
      setErrors({ general: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setErrors({})

    try {
      await signInWithGoogle()
      router.push("/")
    } catch (error: any) {
      setErrors({ general: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue shopping</p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 h-12 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 h-12 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="bg-white/0 border-[#333333] text-[#000000]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#333333]">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-[#333333] hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#004AAD] text-white font-semibold rounded-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 bg-white text-[#333333] font-semibold rounded-lg"
            >
              <Chrome size={20} className="mr-2" />
              Sign in with Google
            </Button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-[#004AAD]">
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

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

            {/* Customer Testimonial
            <div className="mt-12 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <p className="text-orange-100 italic mb-4">
                "Amazing products and excellent service! I've been shopping here for over a year and never
                disappointed."
              </p>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=40&width=40&text=RK"
                  alt="Customer"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div className="text-left">
                  <p className="font-semibold">Rajesh Kumar</p>
                  <p className="text-sm text-orange-200">Verified Customer</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
