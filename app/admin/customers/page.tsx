"use client"

import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { User } from "@/types"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function AdminCustomersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<User[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!loading && (!user || (user as any).role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === "admin") {
      fetchCustomers()
    }
  }, [user])

  const fetchCustomers = async () => {
    try {
      const usersCollection = collection(db, "users")
      const usersSnapshot = await getDocs(query(usersCollection, orderBy("createdAt", "desc")))
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[]
      setCustomers(usersData)
    } catch (error) {
      console.error("Error fetching customers:", error)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, { role: newRole })
      fetchCustomers()
      if (selectedCustomer && selectedCustomer.id === userId) {
        setSelectedCustomer((prev) => (prev ? { ...prev, role: newRole } : null))
      }
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  const openCustomerDetails = (customer: User) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
            <div className="relative w-64">
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        No customers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          {customer.firstName} {customer.lastName}
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.role}</TableCell>
                        <TableCell>{customer.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => openCustomerDetails(customer)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Customer Details</DialogTitle>
                <DialogDescription>
                  {selectedCustomer?.firstName} {selectedCustomer?.lastName} ({selectedCustomer?.email})
                </DialogDescription>
              </DialogHeader>
              {selectedCustomer && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">User ID:</p>
                      <p>{selectedCustomer.id}</p>
                    </div>
                    <div>
                      <p className="font-medium">Phone:</p>
                      <p>{selectedCustomer.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Joined On:</p>
                      <p>{selectedCustomer.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Login:</p>
                      <p>
                        {selectedCustomer.lastLoginAt
                          ? new Date(selectedCustomer.lastLoginAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="userRole" className="shrink-0">
                      Update Role:
                    </Label>
                    <Select
                      value={selectedCustomer.role}
                      onValueChange={(value) => handleRoleChange(selectedCustomer.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Change Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}