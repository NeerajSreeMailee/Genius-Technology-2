"use client"

import { Separator } from "@/components/ui/separator"

import { useState, useEffect } from "react"
import { collection, query, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { CorporateInquiry } from "@/types"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle, XCircle, DollarSign, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { updateCorporateInquiryStatus, assignSpecialPricing } from "@/actions/corporate-orders"

export default function AdminCorporateOrdersPage() {
  const [inquiries, setInquiries] = useState<CorporateInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<CorporateInquiry | null>(null)
  const [pricingDetails, setPricingDetails] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "corporateInquiries"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const fetchedInquiries: CorporateInquiry[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as CorporateInquiry[]
      setInquiries(fetchedInquiries)
    } catch (error) {
      console.error("Error fetching corporate inquiries:", error)
      toast({
        title: "Error",
        description: "Failed to load corporate inquiries.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (inquiryId: string, newStatus: CorporateInquiry["status"]) => {
    setIsUpdating(true)
    try {
      const result = await updateCorporateInquiryStatus(inquiryId, newStatus)
      if (result.success) {
        toast({ title: "Success", description: result.message })
        fetchInquiries() // Re-fetch to update UI
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAssignPricing = async () => {
    if (!selectedInquiry || !pricingDetails) {
      toast({ title: "Warning", description: "Pricing details cannot be empty.", variant: "destructive" })
      return
    }
    setIsUpdating(true)
    try {
      const result = await assignSpecialPricing(selectedInquiry.id, pricingDetails)
      if (result.success) {
        toast({ title: "Success", description: result.message })
        fetchInquiries() // Re-fetch to update UI
        setSelectedInquiry(null) // Close dialog
        setPricingDetails("")
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" })
      }
    } catch (error) {
      console.error("Error assigning pricing:", error)
      toast({ title: "Error", description: "Failed to assign pricing.", variant: "destructive" })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadgeVariant = (status: CorporateInquiry["status"]) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "contacted":
        return "default"
      case "quoted":
        return "outline"
      case "closed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Corporate Orders Management</h1>

          {/* Shop by Category and Brand Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Shop by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Shop by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Electronics</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Clothing</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Home & Kitchen</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Beauty</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Sports</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Books</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shop by Brand */}
            <Card>
              <CardHeader>
                <CardTitle>Shop by Brand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Apple</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Samsung</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Nike</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Sony</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Adidas</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">LG</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Corporate Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading inquiries...</div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No corporate inquiries found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="font-medium">{inquiry.companyName}</TableCell>
                          <TableCell>{inquiry.contactPerson}</TableCell>
                          <TableCell>{inquiry.email}</TableCell>
                          <TableCell>{inquiry.phone || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(inquiry.status)}>{inquiry.status}</Badge>
                          </TableCell>
                          <TableCell>{inquiry.budget || "N/A"}</TableCell>
                          <TableCell>{inquiry.createdAt?.toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => {
                                        e.preventDefault()
                                        setSelectedInquiry(inquiry)
                                        setPricingDetails("") // Reset pricing details
                                      }}
                                    >
                                      <MessageSquare className="mr-2 h-4 w-4" /> View Details / Quote
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                      <DialogTitle>Inquiry Details for {selectedInquiry?.companyName}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <p>
                                        <strong>Contact:</strong> {selectedInquiry?.contactPerson} (
                                        {selectedInquiry?.email}, {selectedInquiry?.phone})
                                      </p>
                                      <p>
                                        <strong>Budget:</strong> {selectedInquiry?.budget || "N/A"}
                                      </p>
                                      <p>
                                        <strong>Requirements:</strong> {selectedInquiry?.requirements || "N/A"}
                                      </p>
                                      <p>
                                        <strong>Details:</strong> {selectedInquiry?.requirements}
                                      </p>
                                      <p>
                                        <strong>Status:</strong>{" "}
                                        <Badge variant={getStatusBadgeVariant(selectedInquiry?.status || "pending")}>
                                          {selectedInquiry?.status}
                                        </Badge>
                                      </p>
                                      <Separator />
                                      <div>
                                        <Label htmlFor="pricingDetails" className="mb-2 block">
                                          Special Pricing / Quote Details
                                        </Label>
                                        <Textarea
                                          id="pricingDetails"
                                          value={pricingDetails}
                                          onChange={(e) => setPricingDetails(e.target.value)}
                                          placeholder="Enter pricing details or a custom quote here..."
                                          rows={5}
                                        />
                                        <Button onClick={handleAssignPricing} className="mt-2" disabled={isUpdating}>
                                          <DollarSign className="mr-2 h-4 w-4" />{" "}
                                          {isUpdating ? "Saving..." : "Save Pricing"}
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(inquiry.id, "contacted")}
                                  disabled={isUpdating || inquiry.status === "contacted"}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" /> Mark as Contacted
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(inquiry.id, "quoted")}
                                  disabled={isUpdating || inquiry.status === "quoted"}
                                >
                                  <DollarSign className="mr-2 h-4 w-4" /> Mark as Quoted
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(inquiry.id, "closed")}
                                  disabled={isUpdating || inquiry.status === "closed"}
                                >
                                  <XCircle className="mr-2 h-4 w-4" /> Mark as Closed
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}