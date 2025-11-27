"use client"

import Link from "next/link"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Mail, Phone, MessageCircle, ChevronDown } from "lucide-react"
import { BackgroundPatterns } from "@/components/shared/background-patterns"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const faqData = [
  {
    category: "General",
    questions: [
      {
        q: "What is Genius Technology?",
        a: "We're an e-commerce platform specializing in tech accessories and gadgets.",
      },
      {
        q: "How can I contact customer support?",
        a: "Email support@geniustech.com or call +91 98765 43210.",
      },
      {
        q: "Do you have a physical store?",
        a: "We operate exclusively online for best prices and selection.",
      },
    ],
  },
  {
    category: "Orders & Payments",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse products, add to cart, checkout, and confirm your order.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Credit/debit cards, UPI, Net Banking, digital wallets, and COD.",
      },
      {
        q: "How can I track my order?",
        a: "Receive tracking info via email/SMS. Track from your account dashboard.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "What are your shipping charges?",
        a: "Free above ₹499. Standard delivery: 3-5 days.",
      },
      {
        q: "How long does delivery take?",
        a: "Standard: 3-5 days. Express: 1-2 days. Same Day: within 24 hours.",
      },
      {
        q: "What if I receive a damaged product?",
        a: "Contact support within 24 hours with photos for replacement/refund.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "7-day return policy for unused items in original packaging.",
      },
      {
        q: "How do I return an item?",
        a: "Initiate return from your account dashboard under 'My Orders'.",
      },
      {
        q: "How long does it take to get a refund?",
        a: "Refunds processed within 7-10 business days to original payment method.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFaqs = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchTerm.toLowerCase()) || q.a.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="max-h-screen overflow-y-auto">
      <BackgroundPatterns variant="minimal" />
      <div className="relative z-10">
        <Header />

        {/* FAQ Hero Section */}
        <section className="pt-32 pb-20">
          <div className="absolute inset-0 opacity-10">
            <div className="floating-dots-bg w-full h-full"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Find answers to common questions about our products and services.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="text-amber-700" size={20} />
              </div>
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/95 text-amber-900 placeholder-amber-700 border-0 focus:ring-4 focus:ring-white/30 shadow-lg text-lg"
              />
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <div className="container mx-auto px-4 py-16">
          {filteredFaqs.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              {filteredFaqs.map((category, catIndex) => (
                <section key={catIndex} className="mb-12">
                  <h2 className="text-2xl font-bold text-amber-900 mb-6 pb-2 border-b border-amber-200">
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, qIndex) => (
                        <AccordionItem 
                          key={qIndex} 
                          value={`item-${catIndex}-${qIndex}`}
                          className="bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                          <AccordionTrigger className="px-6 py-4 text-left text-amber-900 hover:bg-amber-50/30 rounded-2xl transition-colors data-[state=open]:rounded-b-none">
                            <div className="flex items-center justify-between w-full">
                              <span className="font-semibold">{faq.q}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 text-gray-700 bg-amber-50/20 rounded-b-2xl">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto shadow-xl border border-amber-100">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-amber-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-4">No results found</h3>
                <p className="text-gray-700 mb-6">
                  We couldn't find any FAQs matching "{searchTerm}".
                </p>
                <Button 
                  onClick={() => setSearchTerm("")}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg"
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}

        </div>

        <Footer />
      </div>
    </div>
  )
}