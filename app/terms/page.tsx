import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, ShoppingCart, CreditCard, Truck, RotateCcw } from "lucide-react"
import { BackgroundPatterns } from "@/components/shared/background-patterns"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: ShoppingCart,
      title: "Product Information",
      content: [
        "We strive for accurate product descriptions",
        "Prices may change without notice",
        "Quantities are limited and orders subject to acceptance",
      ],
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      content: [
        "Payment required at order placement",
        "We accept major payment methods",
        "Processed securely through certified gateways",
      ],
    },
    
    {
      icon: RotateCcw,
      title: "Returns & Refunds",
      content: [
        "Returns within 7 days for unopened items",
        "Items must be in original condition",
        "Refunds processed within 7-10 business days",
      ],
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-6">
              Please read these terms carefully before using our services.
            </p>
            <p className="text-amber-100 text-lg"></p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-20">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border border-white/80 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome to Genius Technology</h2>
                <p className="text-gray-700 text-lg text-center">
                  These Terms govern your use of our website and services. By accessing our services, you agree to these Terms.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Terms Sections */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section, index) => (
                <Card
                  key={index}
                  className="bg-white/90 backdrop-blur-sm border border-white/80 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex flex-col items-center space-y-3 text-lg">
                      <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                        <section.icon className="h-6 w-6" />
                      </div>
                      <span className="text-gray-900 text-xl font-bold">{section.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}