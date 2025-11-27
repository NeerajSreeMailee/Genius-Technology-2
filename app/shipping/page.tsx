import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, Package, CreditCard, Shield, Phone, Mail } from "lucide-react"
import { BackgroundPatterns } from "@/components/shared/background-patterns"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ShippingPolicyPage() {
  const deliveryOptions = [
    {
      name: "Standard",
      time: "3-5 Days",
      cost: "₹49 (Free above ₹499)",
      icon: Truck,
    },
    {
      name: "Express",
      time: "1-2 Days",
      cost: "₹99 (Free above ₹999)",
      icon: Clock,
    },
    {
      name: "Same Day",
      time: "Within 24 Hours",
      cost: "₹149",
      icon: Package,
    },
    {
      name: "Cash on Delivery",
      time: "3-7 Days",
      cost: "₹49 + COD charges",
      icon: CreditCard,
    },
  ]

  return (
    <div className="max-h-screen overflow-y-auto">
      <BackgroundPatterns variant="minimal" />
      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="absolute inset-0 opacity-10">
            <div className="floating-dots-bg w-full h-full"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Shipping Policy</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Fast, reliable delivery across India with multiple options.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Delivery Options */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Delivery Options</h2>
              <p className="text-lg text-gray-600">
                Choose the option that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {deliveryOptions.map((option, index) => (
                <Card key={index} className="text-center bg-white/90 backdrop-blur-sm border border-white/80 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                      <option.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{option.name}</h3>
                    <Badge variant="outline" className="mb-3 text-sm py-1">
                      {option.time}
                    </Badge>
                    <p className="text-green-600 font-bold text-lg">{option.cost}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Shipping Process */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How Shipping Works</h2>
              <p className="text-lg text-gray-600">
                Simple process from order to delivery
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { step: "1", title: "Order Placed", desc: "You place an order" },
                  { step: "2", title: "Processing", desc: "We prepare your order" },
                  { step: "3", title: "Shipped", desc: "Picked up by delivery partner" },
                  { step: "4", title: "In Transit", desc: "Track your order" },
                  { step: "5", title: "Delivered", desc: "Arrives at your doorstep" },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                      {item.step}
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        <Footer />
      </div>
    </div>
  )
}