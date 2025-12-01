"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useJoinUsSubmission } from "@/lib/firebase-hooks"
import { OfferBanner } from "@/components/layout/offer-banner"
import { FeaturedProducts } from "@/components/home/featured-products"

import BrandPage from "../brand/[slug]/page"

import { BackgroundPatterns } from "@/components/shared/background-patterns"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function JoinPage() {
  // Join us submission hook
  const { submitJoinUsRequest, submitting, error, success, resetState } = useJoinUsSubmission()

  // Reset success state after showing for 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        resetState()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [success, resetState])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      console.log('Join Us Form - Submitting request:', formData)

      // Reset any previous state
      resetState()

      // Submit join us request to Firebase
      const result = await submitJoinUsRequest({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim() || undefined,
      })

      console.log('Join Us Form - Request submitted successfully:', result)

      // Show success toast
      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your interest in joining us. We'll review your application and get back to you soon.",
        variant: "default"
      })

      // Reset form
      setFormData({ name: "", email: "", message: "" })

    } catch (error) {
      console.error('Join Us Form - Error submitting request:', error)

      // Show error toast
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit your application. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-h-screen overflow-y-auto">
      <BackgroundPatterns variant="minimal" />
      <div className="relative z-10">
        <Header />
        <OfferBanner />

        {/* Hero banner with image and overlay text */}
        <section className="container mx-auto px-4 mt-6">
          <div className="relative h-[280px] md:h-[360px] mt-[150px] w-full overflow-hidden rounded-lg">
            <img src="/Hero.png" alt="Join Us Banner" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative h-full w-full flex items-center">
              <div className="px-6 md:px-10 text-white max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold mb-3">Build the Future With Us</h1>
                <p className="text-sm md:text-base leading-relaxed opacity-90 mb-5">
                  Enjoy unbeatable discounts on premium mobile accessories and electronics.
                  Shop now and save big on top-rated tech—only while stocks last!
                </p>
                <Button variant="secondary" className="bg-white text-gray-900 hover:bg-white/90">
                  Explore Opportunities
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Intro paragraph */}
        <section className="container mx-auto px-4">
          <p className="text-sm md:text-base text-muted-foreground mt-6 max-w-5xl">
            At Genius Technology, we’re more than a tech company—we’re a community of innovators, creators,
            and problem-solvers. Whether you’re looking to grow your career or collaborate as a partner, we offer
            a space where ideas thrive and impact is real. Join us in shaping smarter, more connected lives across India.
          </p>
        </section>

        {/* Join Us form */}
        <section className="container mx-auto px-4 py-10">
          <h2 className="text-[#004AAD] text-center text-2xl font-bold mb-6">Join Us</h2>
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4">
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="rounded-full h-11"
              minLength={2}
              maxLength={50}
            />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="rounded-full h-11"
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            />
            <div className="relative">
              <Textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about yourself and why you'd like to join us (Optional)"
                rows={6}
                className="rounded-xl"
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formData.message.length}/1000 characters
              </div>
            </div>

            {/* Display error message if any */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Display success message if any */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  <strong>Success:</strong> Your application has been submitted successfully! We'll get back to you soon.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                className="bg-[#004AAD] text-white rounded-full px-8"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Join Us"}
              </Button>
            </div>
          </form>
        </section>

        <Footer />
      </div>
    </div>
  )
}
