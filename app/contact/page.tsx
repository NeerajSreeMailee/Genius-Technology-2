"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MessageCircle, User } from "lucide-react"
import { toast } from "sonner"
import { useContactSubmission } from "@/lib/firebase-hooks"
import { BackgroundPatterns } from "@/components/background-patterns"
import { Footer } from "@/components/footer"


export default function ContactPage() {
  // Contact submission hook
  const { submitContactMessage, submitting, error, success, resetState } = useContactSubmission()
  
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
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Reset any previous state
      resetState()
      
      // Submit contact message to Firebase
      await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim() || undefined,
        message: formData.message.trim(),
      })
      
      // Show success toast
      toast.success("Message sent successfully!")
      
      // Reset form
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      
    } catch (error) {
      // Show error toast
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.")
    }
  }

  return (
    <div className="max-h-screen overflow-y-auto">
      <BackgroundPatterns variant="minimal" />
      <div className="relative z-10">
        <Header />

        <section className="pt-32 pb-20">
          <div className="absolute inset-0 opacity-10">
            <div className="floating-dots-bg w-full h-full"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-6">
              Have questions? Our team is here to help.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div>
              <Card className="bg-white/90 backdrop-blur-sm border border-white/80 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl text-amber-600">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" size={20} />
                        <Input 
                          id="name" 
                          placeholder="Enter your name" 
                          value={formData.name} 
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                          required 
                          className="pl-12 pr-4 py-4 rounded-2xl h-auto border-amber-200 focus:border-amber-400 focus:ring-amber-300 text-lg"
                          minLength={2}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" size={20} />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                          required 
                          className="pl-12 pr-4 py-4 rounded-2xl h-auto border-amber-200 focus:border-amber-400 focus:ring-amber-300 text-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Phone (Optional)</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" size={20} />
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="Enter your phone" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                          className="pl-12 pr-4 py-4 rounded-2xl h-auto border-amber-200 focus:border-amber-400 focus:ring-amber-300 text-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 font-bold mb-2">Subject</label>
                      <Input 
                        id="subject" 
                        placeholder="Enter subject" 
                        value={formData.subject} 
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
                        className="pr-4 py-4 rounded-2xl h-auto border-amber-200 focus:border-amber-400 focus:ring-amber-300 text-lg"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Your Message</label>
                      <Textarea 
                        id="message" 
                        placeholder="Enter your message" 
                        rows={5} 
                        value={formData.message} 
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                        required
                        className="pr-4 py-4 rounded-2xl border-amber-200 focus:border-amber-400 focus:ring-amber-300 text-lg"
                        minLength={10}
                      />
                    </div>
                    
                    {/* Display error message if any */}
                    {error && (
                      <Alert className="border-red-200 bg-red-50 rounded-2xl">
                        <AlertDescription className="text-red-700">
                          <strong>Error:</strong> {error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Display success message if any */}
                    {success && (
                      <Alert className="border-green-200 bg-green-50 rounded-2xl">
                        <AlertDescription className="text-green-700">
                          <strong>Success:</strong> Your message has been sent!
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button 
                      type="submit" 
                      disabled={submitting} 
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl px-6 py-4 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg text-lg"
                    >
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right: Info */}
            <div>
              <Card className="bg-white/90 backdrop-blur-sm border border-white/80 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl text-amber-600">Get In Touch</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl hover:bg-amber-100 transition-colors duration-300">
                      <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold">1-800-GENIUS-TECH</div>
                        <div className="text-gray-600">Toll-Free</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl hover:bg-amber-100 transition-colors duration-300">
                      <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold">support@geniustech.com</div>
                        <div className="text-gray-600">Support Email</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl hover:bg-amber-100 transition-colors duration-300">
                      <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold">Chat with us now</div>
                        <div className="text-gray-600">24/7 Live Chat</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-amber-100">
                    <h3 className="text-xl font-bold text-amber-600 mb-4">Working Hours</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span className="font-medium">10:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span className="font-medium">Closed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}