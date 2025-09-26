import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw, Clock, CheckCircle, XCircle, Package, CreditCard, Phone, Mail } from "lucide-react"
import { BackgroundPatterns } from "@/components/background-patterns"

export default function ReturnsPage() {
  const returnProcess = [
    {
      step: "1",
      title: "Initiate Return",
      description: "Login and select item to return",
      icon: RotateCcw,
    },
    {
      step: "2",
      title: "Package Item",
      description: "Pack in original packaging",
      icon: Package,
    },
    {
      step: "3",
      title: "Schedule Pickup",
      description: "We'll collect from your address",
      icon: Clock,
    },
    {
      step: "4",
      title: "Quality Check",
      description: "We inspect for eligibility",
      icon: CheckCircle,
    },
    {
      step: "5",
      title: "Refund Processed",
      description: "Refund to original payment method",
      icon: CreditCard,
    },
  ]

  return (
       <div className="max-h-screen overflow-y-auto">
      <BackgroundPatterns variant="minimal" />
      <div className="relative z-10">
        <Header />

        <section className="pt-32 pb-20 ">
          <div className="absolute inset-0 opacity-10">
            <div className="floating-dots-bg w-full h-full"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Returns & Refunds</h1>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Return Policy Overview */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/90 backdrop-blur-sm border border-white/80 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-amber-50 rounded-2xl">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RotateCcw className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="font-bold mb-2">7-Day Window</h3>
                      <p className="text-gray-600 text-sm">
                        Return within 7 days of delivery
                      </p>
                    </div>
                    <div className="text-center p-6 bg-amber-50 rounded-2xl">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="font-bold mb-2">Eligible Items</h3>
                      <p className="text-gray-600 text-sm">
                        Unused, original packaging, all tags
                      </p>
                    </div>
                    <div className="text-center p-6 bg-amber-50 rounded-2xl">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="font-bold mb-2">Quick Refunds</h3>
                      <p className="text-gray-600 text-sm">
                        7-10 business days to original payment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How to Initiate a Return */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Return</h2>
              <p className="text-lg text-gray-600">
                Simple steps to return your product
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {returnProcess.map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-6 bg-white/90 backdrop-blur-sm border border-white/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative w-12 h-12 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-amber-600" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center text-sm font-bold text-white bg-amber-500 rounded-full">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Button size="lg" asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 text-lg">
                  <Link href="/contact">Contact Us to Initiate return</Link>
                </Button>
              </div>
            </div>
          </section>

      
        </div>

        <Footer />
      </div>
    </div>
  )
}