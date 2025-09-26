"use client"

import { redirect } from "next/navigation"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Order } from "@/types"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function AdminPaymentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [payments, setPayments] = useState<Order[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterGateway, setFilterGateway] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!loading && (!user || (user as any).role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPayments()
    }
  }, [user])

  const fetchPayments = async () => {
    try {
      const paymentsCollection = collection(db, "orders")
      const paymentsSnapshot = await getDocs(query(paymentsCollection, orderBy("createdAt", "desc")))
      const paymentsData = paymentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[]
      setPayments(paymentsData.filter((p) => p.paymentMethod))
    } catch (error) {
      console.error("Error fetching payments:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filterStatus === "all" || payment.paymentStatus === filterStatus
    const matchesGateway = filterGateway === "all" || payment.paymentMethod === filterGateway
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesGateway && matchesSearch
  })

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || (user as any).role !== "admin") {
    return null // or redirect to login page
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment Transactions</h1>
            <div className="flex space-x-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="succeeded">Succeeded</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterGateway} onValueChange={setFilterGateway}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Gateways</SelectItem>
                  <SelectItem value="Razorpay">Razorpay</SelectItem>
                  <SelectItem value="PayU">PayU</SelectItem>
                  <SelectItem value="Stripe">Stripe</SelectItem>
                  <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-64">
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        No payments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.transactionId || "N/A"}</TableCell>
                        <TableCell>#{payment.id.slice(-8)}</TableCell>
                        <TableCell>{payment.customerName || "N/A"}</TableCell>
                        <TableCell>₹{payment.total?.toLocaleString() || 0}</TableCell>
                        <TableCell>{payment.paymentMethod || "N/A"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.paymentStatus || "pending")}>
                            {payment.paymentStatus || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}