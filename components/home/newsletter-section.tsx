"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Gift, Truck, Bell, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Successfully subscribed!",
      description: "Welcome to the Genius Technology family. Check your email for a special welcome offer!",
    })

    setEmail("")
    setIsLoading(false)
  }

  const benefits = [
    {
      icon: Gift,
      title: "Exclusive Offers",
      description: "Get access to subscriber-only deals and early bird discounts",
    },
    {
      icon: Bell,
      title: "New Product Alerts",
      description: "Be the first to know about our latest product launches",
    },
    {
      icon: Truck,
      title: "Free Shipping Updates",
      description: "Get notified about free shipping promotions and deals",
    },
    {
      icon: Star,
      title: "VIP Treatment",
      description: "Enjoy priority customer support and exclusive content",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Stay Updated with Genius Technology</h2>
            <p className="text-xl text-orange-100 mb-8">
              Join over 100,000 subscribers and get exclusive deals, product updates, and tech tips delivered to your
              inbox.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <benefit.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                    <p className="text-sm text-orange-100">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Newsletter Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get 10% OFF Your First Order</h3>
              <p className="text-gray-600">Subscribe to our newsletter and receive an instant discount code</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-4 pr-4 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-0"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Subscribing...
                  </div>
                ) : (
                  "Subscribe & Get 10% OFF"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By subscribing, you agree to our{" "}
                <a href="/privacy" className="text-orange-500 hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms" className="text-orange-500 hover:underline">
                  Terms of Service
                </a>
              </p>
            </div>

            {/* Social Proof */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span>100K+ subscribers</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 fill-current mr-1" />
                  <span>4.9/5 rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <div className="text-3xl font-bold mb-2">100K+</div>
            <div className="text-orange-100">Newsletter Subscribers</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">50K+</div>
            <div className="text-orange-100">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-orange-100">Products Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-orange-100">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}
