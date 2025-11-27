"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { useQuotationSubmission } from "@/lib/firebase-hooks"
import { DollarSign, Package, Phone, Truck } from "lucide-react"
import { StaticImageData } from "next/image"
import Category1 from '../../public/Category1.png'
import Category2 from '../../public/Category2.png'
import Category3 from '../../public/Category3.png'
import Category4 from '../../public/Category4.png'
import Corporate from '../../public/Corporate.png'
import { ShopByBrand } from "@/components/home/shop-by-brand"
import { ShopByCategory } from "@/components/home/shop-by-category"

// ProductCardDesign must accept imageSrc, category, price, soldPercent.
import { ProductCardDesign } from "@/components/product/product-card-design"
import { BackgroundPatterns } from "@/components/shared/background-patterns"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function CorporatePage() {
  // Quotation submission hook
  const { submitQuotation, submitting, error, success, resetState } = useQuotationSubmission()
  
  // Reset success state after showing for 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        resetState()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [success, resetState])
  
  // Form state
  
  const [categories] = useState([
    {
      id: "1",
      name: "Laptops",
      image: Category1,
      startingPrice: 59999,
      productCount: 75,
    },
    {
      id: "2",
      name: "Smart Phone",
      image: Category2,
      startingPrice: 9999,
      productCount: 75,
    },
    {
      id: "3",
      name: "Smart Tv",
      image: Category3,
      startingPrice: 35999,
      productCount: 75,
    },
    {
      id: "4",
      name: "Tablet",
      image: Category4,
      startingPrice: 59999,
      productCount: 75,
    },
  ])

  const [formData, setFormData] = useState({
    company: "",
    fullName: "",
    email: "",
    phone: "",
    budget: "",
    products: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      console.log('Corporate Form - Submitting quotation:', formData)
      
      // Reset any previous state
      resetState()
      
      // Submit quotation to Firebase
      const result = await submitQuotation({
        company: formData.company.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        budget: formData.budget.trim() || undefined,
        products: formData.products.trim() || undefined,
        message: formData.message.trim() || undefined,
      })
      
      console.log('Corporate Form - Quotation submitted successfully:', result)
      
      // Show success toast
      toast({ 
        title: "Quotation Submitted Successfully!", 
        description: "We'll review your request and contact you shortly with a customized quote.",
        variant: "default"
      })
      
      // Reset form
      setFormData({ 
        company: "", 
        fullName: "", 
        email: "", 
        phone: "", 
        budget: "", 
        products: "", 
        message: "" 
      })
      
    } catch (error) {
      console.error('Corporate Form - Error submitting quotation:', error)
      
      // Show error toast
      toast({ 
        title: "Submission Failed", 
        description: error instanceof Error ? error.message : "Failed to submit quotation. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-h-screen overflow-y-auto">
      <BackgroundPatterns variant="minimal" />
      <div className="relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e0e7ff_1px,transparent_0)] [background-size:24px_24px]"></div>
        <div className="relative z-10">
          <Header />
          
          <main className="relative z-10">
            <section className="container mx-auto px-4 sm:px-6 lg:px-[50px] mt-[100px] sm:mt-[120px] lg:mt-[150px]">
              <div className="mt-4 lg:mt-[16px] w-full rounded-lg overflow-hidden">
                <img src="Corporate.png" alt="Corporate Banner" className="w-full h-[180px] sm:h-[220px] lg:h-[250px] object-cover" />
              </div>
              <p className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground w-full leading-relaxed">
                Genius Technology offers tailored solutions for businesses, educational institutions, and government agencies across India. Whether you're outfitting a team, upgrading infrastructure, or sourcing tech for large-scale deployment, we provide:
              </p>
              <ul className="list-disc pl-6 sm:pl-8 text-sm sm:text-base text-muted-foreground my-3 sm:my-4 space-y-1">
                <li>Competitive Bulk Pricing for high-volume orders</li>
                <li>Customized Product Bundles to match your operational needs</li>
                <li>Dedicated Account Managers for personalized support</li>
                <li>Streamlined Logistics ensuring timely, reliable delivery</li>
              </ul>
              <p className="text-sm sm:text-base text-muted-foreground w-full leading-relaxed">
                From laptops and smart devices to accessories and IT infrastructure, our corporate program is built to simplify procurement and maximize value. Let us help you power your organization with technology that performs.
              </p>
            </section>

            {/* Product Catalog Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-[50px] mt-8 sm:mt-10 lg:mt-12">
              <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-[#004AAD] mb-3 sm:mb-4">Product Catalog</h2>
              <ShopByBrand />
              <ShopByCategory />
            </section>

            {/* Offers Banner */}
            <section className="px-4 sm:px-6 lg:px-[50px] container mx-auto mt-8 sm:mt-10 lg:mt-12">
              <div className="w-full rounded-[8px] sm:rounded-[12px] overflow-hidden relative h-[200px] sm:h-[250px] lg:h-[300px] mb-2">
                <img src="Corporate.png" alt="Exclusive Deals" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
                  <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">Unlock Exclusive Deals – Limited Time Only!</h2>
                  <p className="text-white mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">Enjoy unbeatable discounts on premium mobile accessories and electronics. Shop now and save big on top-rated tech—only while stocks last!</p>
                  <Button className="w-fit bg-white text-[#004AAD] font-semibold px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base">Shop Now & Save</Button>
                </div>
              </div>
            </section>

            {/* Why Choose Us & Quote Form */}
            <section className="px-4 sm:px-6 lg:px-[50px] container mx-auto my-8 sm:my-10 lg:my-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="flex-1">
                <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-[#004AAD] mb-4 sm:mb-6">Why Choose Us For B2B</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="rounded-lg border p-4 sm:p-5 lg:p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-[#004AAD] mb-2 sm:mb-3" />
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Competitive Bulk Pricing</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Benefit from significant discounts on large orders, ensuring cost-effectiveness for your business needs.</p>
                  </div>
                  <div className="rounded-lg border p-4 sm:p-5 lg:p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-[#004AAD] mb-2 sm:mb-3" />
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Customized Product Bundles</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Tailor your orders with specific product combinations to meet the unique demands of your business.</p>
                  </div>
                  <div className="rounded-lg border p-4 sm:p-5 lg:p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-[#004AAD] mb-2 sm:mb-3" />
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Dedicated Account Manager</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Receive personalized support from a dedicated manager who understands your business and provides tailored solutions.</p>
                  </div>
                  <div className="rounded-lg border p-4 sm:p-5 lg:p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-[#004AAD] mb-2 sm:mb-3" />
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Efficient Logistics & Delivery</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Experience streamlined order processing and reliable delivery, ensuring your products arrive on time and in perfect condition.</p>
                  </div>
                </div>
              </div>
              {/* Quote Form */}
              <div className="flex-1 justify-center items-center mt-8 lg:mt-0">
                <h2 className="font-bold text-[#004AAD] text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6">Quote Form</h2>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <Input 
                    id="company" 
                    value={formData.company} 
                    onChange={handleChange} 
                    placeholder="Company Name" 
                    required 
                    className="rounded-md h-10 sm:h-11 text-sm sm:text-base"
                    minLength={2}
                    maxLength={100}
                  />
                  <Input 
                    id="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    placeholder="Full Name" 
                    required 
                    className="rounded-md h-10 sm:h-11 text-sm sm:text-base"
                    minLength={2}
                    maxLength={50}
                  />
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Email" 
                    required 
                    className="rounded-md h-10 sm:h-11 text-sm sm:text-base"
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  />
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="Phone (e.g., +91 9876543210)" 
                    required 
                    className="rounded-md h-10 sm:h-11 text-sm sm:text-base"
                    pattern="[+]?[\d\s\-\(\)]{10,}"
                  />
                  <Input 
                    id="budget" 
                    value={formData.budget} 
                    onChange={handleChange} 
                    placeholder="Estimated Budget (Optional)" 
                    className="rounded-md h-10 sm:h-11 text-sm sm:text-base"
                    maxLength={50}
                  />
                  <Textarea 
                    id="products" 
                    value={formData.products} 
                    onChange={handleChange} 
                    placeholder="Required Products (Optional)" 
                    className="rounded-md min-h-[40px] sm:min-h-[44px] text-sm sm:text-base"
                    maxLength={200}
                  />
                  <Textarea 
                    id="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Additional Message (Optional)" 
                    rows={3} 
                    className="rounded-md text-sm sm:text-base"
                    maxLength={500}
                  />
                  <div className="pt-2 sm:pt-3">
                    <Button 
                      type="submit" 
                      className="w-full sm:w-[250px] bg-[#004AAD] text-white rounded-full font-semibold h-11 sm:h-12 text-sm sm:text-base"
                      disabled={submitting}
                    >
                      {submitting ? "SUBMITTING..." : "SUBMIT QUOTE"}
                    </Button>
                    
                    {/* Display error message if any */}
                    {error && (
                      <Alert className="mt-3 border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">
                          <strong>Error:</strong> {error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Display success message if any */}
                    {success && (
                      <Alert className="mt-3 border-green-200 bg-green-50">
                        <AlertDescription className="text-green-700">
                          <strong>Success:</strong> Quotation submitted successfully! We'll contact you shortly.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </form>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  )
}