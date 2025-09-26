"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, CheckCircle, AlertCircle, RefreshCw, Smartphone, Wallet, Building } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PaymentConfig {
  success: boolean
  razorpay_key_id: string
  available_methods?: any
  configuration?: {
    upi_enabled: boolean
    cards_enabled: boolean
    netbanking_enabled: boolean
    wallets_enabled: boolean
    emi_enabled: boolean
    paylater_enabled: boolean
  }
  fallback_config?: any
  error?: string
  message: string
}

export default function PaymentTestPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [config, setConfig] = useState<PaymentConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    if (!loading && (!user || (user as any).role !== "admin")) {
      router.push("/login")
      return
    }

    if (user?.role === "admin") {
      fetchPaymentConfig()
    }
  }, [user, loading, router])

  const fetchPaymentConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/razorpay/config')
      const data = await response.json()
      setConfig(data)
      
      if (!data.success) {
        toast({
          title: "Payment Configuration Warning",
          description: data.error || "Using fallback configuration",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching payment config:", error)
      toast({
        title: "Error",
        description: "Failed to fetch payment configuration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testRazorpayConnection = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1, // ₹1 for testing
          currency: 'INR',
          receipt: `test_${Date.now()}`
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Test Successful",
          description: "Razorpay order creation test passed!",
        })
      } else {
        toast({
          title: "Test Failed",
          description: data.error || "Razorpay test failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error testing Razorpay:", error)
      toast({
        title: "Test Failed",
        description: "Failed to test Razorpay connection",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || (user as any).role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center">Access Denied</div>
  }

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: <Smartphone className="h-5 w-5" />, enabled: config?.configuration?.upi_enabled || config?.fallback_config?.upi_enabled },
    { id: 'card', name: 'Cards', icon: <CreditCard className="h-5 w-5" />, enabled: config?.configuration?.cards_enabled || config?.fallback_config?.cards_enabled },
    { id: 'netbanking', name: 'Net Banking', icon: <Building className="h-5 w-5" />, enabled: config?.configuration?.netbanking_enabled || config?.fallback_config?.netbanking_enabled },
    { id: 'wallet', name: 'Wallets', icon: <Wallet className="h-5 w-5" />, enabled: config?.configuration?.wallets_enabled || config?.fallback_config?.wallets_enabled },
    { id: 'emi', name: 'EMI', icon: <CreditCard className="h-5 w-5" />, enabled: config?.configuration?.emi_enabled || config?.fallback_config?.emi_enabled },
    { id: 'paylater', name: 'Pay Later', icon: <CreditCard className="h-5 w-5" />, enabled: config?.configuration?.paylater_enabled || config?.fallback_config?.paylater_enabled },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64 flex-1">
        <AdminHeader />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment System Testing</h1>
            <div className="flex gap-2">
              <Button onClick={fetchPaymentConfig} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Config
              </Button>
              <Button onClick={testRazorpayConnection} disabled={testing}>
                <CreditCard className={`h-4 w-4 mr-2`} />
                {testing ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Razorpay Status</CardTitle>
                {config?.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {config?.success ? 'Connected' : 'Issues Detected'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {config?.message || 'Loading...'}
                </p>
                {config?.razorpay_key_id && (
                  <p className="text-xs text-gray-500 mt-2">
                    Key ID: {config.razorpay_key_id}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Methods</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {paymentMethods.filter(method => method.enabled).length}/{paymentMethods.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Payment methods enabled
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading payment methods...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell className="flex items-center gap-2">
                          {method.icon}
                          {method.name}
                        </TableCell>
                        <TableCell>
                          <Badge className={method.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {method.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {method.id === 'upi' && 'UPI, Google Pay, PhonePe, Paytm UPI'}
                          {method.id === 'card' && 'Credit/Debit Cards (Visa, Mastercard, RuPay, Amex)'}
                          {method.id === 'netbanking' && 'All major banks internet banking'}
                          {method.id === 'wallet' && 'Paytm, Mobikwik, Freecharge, etc.'}
                          {method.id === 'emi' && 'EMI options for eligible cards'}
                          {method.id === 'paylater' && 'Simpl, LazyPay, etc.'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {config && !config.success && (
            <Card className="mt-6 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Configuration Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Error:</strong> {config.error}</p>
                  <p><strong>Resolution:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Check if Razorpay API credentials are correct in .env.local</li>
                    <li>Verify that RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set</li>
                    <li>Ensure your Razorpay account is activated</li>
                    <li>Check if your IP is whitelisted in Razorpay dashboard</li>
                    <li>Try regenerating API keys if the issue persists</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}