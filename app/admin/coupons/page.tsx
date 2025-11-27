"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash, Search, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/actions/coupons"
import { CouponForm } from "@/components/admin/coupon-form"
import type { Coupon } from "@/types"

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const fetchCoupons = useCallback(async () => {
    setLoading(true)
    try {
      const fetchedCoupons = await getCoupons()
      setCoupons(fetchedCoupons)
    } catch (error) {
      console.error("Error fetching coupons:", error)
      toast({
        title: "Error",
        description: "Failed to load coupons. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  const handleSaveCoupon = async (couponData: Omit<Coupon, "id" | "createdAt" | "updatedAt" | "usedCount">) => {
    setIsSaving(true)
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, couponData)
        toast({ title: "Coupon Updated", description: "Coupon has been updated successfully." })
      } else {
        await createCoupon(couponData)
        toast({ title: "Coupon Created", description: "New coupon has been created successfully." })
      }
      setIsFormOpen(false)
      setEditingCoupon(null)
      await fetchCoupons()
    } catch (error) {
      console.error("Error saving coupon:", error)
      toast({
        title: "Error",
        description: `Failed to save coupon: ${(error as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) {
      return
    }
    try {
      await deleteCoupon(couponId)
      toast({ title: "Coupon Deleted", description: "Coupon has been deleted successfully." })
      await fetchCoupons()
    } catch (error) {
      console.error("Error deleting coupon:", error)
      toast({
        title: "Error",
        description: `Failed to delete coupon: ${(error as Error).message}`,
        variant: "destructive",
      })
    }
  }

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.appliesToId && coupon.appliesToId.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>
          <p className="text-gray-600">Manage discount codes and promotions for your store.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <AdminSidebar />

          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  All Coupons
                </CardTitle>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingCoupon(null)
                        setIsFormOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add New Coupon
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle>
                    </DialogHeader>
                    <CouponForm
                      coupon={editingCoupon}
                      onSave={handleSaveCoupon}
                      onCancel={() => setIsFormOpen(false)}
                      isSaving={isSaving}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search coupons by code, type, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">Loading coupons...</div>
                ) : coupons.length === 0 ? (
                  <div className="text-center py-8">
                    <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No coupons found</h3>
                    <p className="text-gray-600 mb-4">Create your first coupon to start offering discounts.</p>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setEditingCoupon(null)
                            setIsFormOpen(true)
                          }}
                        >
                          Add New Coupon
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Add New Coupon</DialogTitle>
                        </DialogHeader>
                        <CouponForm
                          coupon={null}
                          onSave={handleSaveCoupon}
                          onCancel={() => setIsFormOpen(false)}
                          isSaving={isSaving}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Applies To</TableHead>
                          <TableHead>Usage</TableHead>
                          <TableHead>Expiry</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCoupons.map((coupon) => (
                          <TableRow key={coupon.id}>
                            <TableCell className="font-medium">{coupon.code}</TableCell>
                            <TableCell className="capitalize">{coupon.type}</TableCell>
                            <TableCell>
                              {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value.toLocaleString()}`}
                            </TableCell>
                            <TableCell>
                              <span className="capitalize">{coupon.appliesTo}</span>
                              {coupon.appliesToId && (
                                <span className="block text-xs text-gray-500">{coupon.appliesToId}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {coupon.usedCount} / {coupon.usageLimit || "Unlimited"}
                            </TableCell>
                            <TableCell>
                              {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={coupon.isActive ? "default" : "secondary"}>
                                {coupon.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog
                                  open={isFormOpen && editingCoupon?.id === coupon.id}
                                  onOpenChange={setIsFormOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditingCoupon(coupon)
                                        setIsFormOpen(true)
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                      <DialogTitle>Edit Coupon</DialogTitle>
                                    </DialogHeader>
                                    <CouponForm
                                      coupon={editingCoupon}
                                      onSave={handleSaveCoupon}
                                      onCancel={() => setIsFormOpen(false)}
                                      isSaving={isSaving}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteCoupon(coupon.id)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
