import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, UserCheck, Database, Globe } from "lucide-react"
import { BackgroundPatterns } from "@/components/background-patterns"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information (name, email, phone, address)",
        "Payment details (processed securely)",
        "Device and usage data",
        "Location for delivery purposes",
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders",
        "Provide customer support",
        "Improve our services",
        "Personalize your experience",
      ],
    },
    
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access your personal information",
        "Correct inaccurate data",
        "Delete your account",
        "Opt-out of communications",
      ],
    },
  ]

  return (
        <div className="max-h-screen overflow-y-auto">

      <BackgroundPatterns variant="minimal" />
      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-20 ">
          <div className="absolute inset-0 opacity-10">
            <div className="floating-dots-bg w-full h-full"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-6">
              Your privacy matters. Learn how we protect your information.
            </p>
            <p className="text-amber-100 text-lg"></p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-20">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-white/90 backdrop-blur-sm border border-white/80 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Commitment</h2>
                <p className="text-gray-700 text-lg text-center">
                  We protect your personal information and are transparent about how we use it.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Sections */}
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
