"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { doc, updateDoc, collection, query, getDocs, addDoc, deleteDoc, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Address, PaymentMethod, WishlistItem, User as AuthUser } from "@/types"
import { Header } from "@/components/header"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { User, MapPin, Heart, Plus, Edit, Trash, CheckCircle, CreditCard, Bell, Shield, Gift, Package, Search, Truck, XCircle, FileText, LocateFixed, ExternalLink, Eye } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddressForm } from "@/components/account/address-form"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PaymentMethodForm } from "@/components/account/payment-method-form"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"

// A basic placeholder for a Wishlist Product Card component
const WishlistProductCard = ({ item, onDelete }: { item: WishlistItem; onDelete: (id: string) => void }) => (
  <Card className="overflow-hidden">
    <div className="flex">
      <div className="relative h-32 w-32 flex-shrink-0">
        <Image src={(item as any).imageUrl || (item as any).image || "/placeholder.svg"} alt={item.name} fill style={{ objectFit: 'cover' }} />
      </div>
      <div className="p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">Price: ${item.price?.toFixed(2) || "0.00"}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" asChild>
            <Link href={`/products/${item.productId}`}>View Product</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(item.id)}>
            Remove
          </Button>
        </div>
      </div>
    </div>
  </Card>
)

export default function AccountPage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [profileFormData, setProfileFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  })
  const [isProfileSaving, setIsProfileSaving] = useState(false)

  // Address Management States
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddressesLoading, setIsAddressesLoading] = useState(true)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isAddressSaving, setIsAddressSaving] = useState(false)

  // Payment Method Management States
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isPaymentMethodsLoading, setIsPaymentMethodsLoading] = useState(true)
  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false)
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isPaymentMethodSaving, setIsPaymentMethodSaving] = useState(false)

  // Wishlist Management States
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isWishlistLoading, setIsWishlistLoading] = useState(true)

  // Orders Management States
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const { toast } = useToast()

  // --- Data Fetching and Initialization Effect ---
  useEffect(() => {
    if (user?.id) {
      // Initialize profile form with user data
      setProfileFormData({
        firstName: (user as any).firstName || "",
        lastName: (user as any).lastName || "",
        email: user.email || "",
        phone: (user as any).phone || "",
        dateOfBirth: (user as any).dateOfBirth || "",
        gender: (user as any).gender || "",
      });
      fetchAddresses();
      fetchPaymentMethods();
      fetchWishlistItems();
      fetchOrders();
    }
  }, [user?.id]);

  // --- Profile Management Functions ---
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setProfileFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setIsProfileSaving(true)
    try {
      const userRef = doc(db, "users", user.id as string)
      await updateDoc(userRef, {
        firstName: profileFormData.firstName,
        lastName: profileFormData.lastName,
        phone: profileFormData.phone,
        dateOfBirth: profileFormData.dateOfBirth,
        gender: profileFormData.gender,
        updatedAt: new Date(),
      })
      // Instead of refreshUser, we'll just show success message
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProfileSaving(false)
    }
  }

  // --- Address Management Functions ---
  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return
    setIsAddressesLoading(true)
    try {
      const q = query(collection(db, `users/${user.id}/addresses`))
      const querySnapshot = await getDocs(q)
      const fetchedAddresses: Address[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Address[]
      setAddresses(fetchedAddresses)
    } catch (error) {
      console.error("Error fetching addresses:", error)
      toast({
        title: "Error",
        description: "Failed to load addresses.",
        variant: "destructive",
      })
    } finally {
      setIsAddressesLoading(false)
    }
  }, [user?.id, toast])

  const handleSaveAddress = async (addressData: Address) => {
    if (!user?.id) return

    setIsAddressSaving(true)
    try {
      if (addressData.isDefault) {
        const currentDefault = addresses.find((addr) => addr.isDefault && addr.id !== addressData.id)
        if (currentDefault?.id) {
          await updateDoc(doc(db, `users/${user.id}/addresses`, currentDefault.id), { isDefault: false })
        }
      }

      if (editingAddress?.id) {
        const addressRef = doc(db, `users/${user.id}/addresses`, editingAddress.id)
        await updateDoc(addressRef, addressData as any)
        toast({ title: "Address Updated", description: "Address has been updated successfully." })
        // await sendAccountUpdateNotification(user.id as string, "Address Updated")
      } else {
        await addDoc(collection(db, `users/${user.id}/addresses`), addressData)
        toast({ title: "Address Added", description: "New address has been added successfully." })
        // await sendAccountUpdateNotification(user.id as string, "New Address Added")
      }
      setShowAddressForm(false)
      setEditingAddress(null)
      await fetchAddresses()
    } catch (error) {
      console.error("Error saving address:", error)
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddressSaving(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!user?.id || !confirm("Are you sure you want to delete this address?")) return

    try {
      await deleteDoc(doc(db, `users/${user.id}/addresses`, addressId))
      toast({ title: "Address Deleted", description: "Address has been deleted successfully." })
      await fetchAddresses()
      // await sendAccountUpdateNotification(user.id as string, "Address Deleted")
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user?.id) return
    setIsAddressSaving(true)
    try {
      const currentDefault = addresses.find((addr) => addr.isDefault)
      if (currentDefault?.id) {
        await updateDoc(doc(db, `users/${user.id}/addresses`, currentDefault.id), { isDefault: false })
      }
      await updateDoc(doc(db, `users/${user.id}/addresses`, addressId), { isDefault: true })
      toast({ title: "Default Address Set", description: "Your default address has been updated." })
      await fetchAddresses()
      // await sendAccountUpdateNotification(user.id as string, "Default Address Changed")
    } catch (error) {
      console.error("Error setting default address:", error)
      toast({
        title: "Error",
        description: "Failed to set default address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddressSaving(false)
    }
  }

  // --- Payment Method Management Functions ---
  const fetchPaymentMethods = useCallback(async () => {
    if (!user?.id) return
    setIsPaymentMethodsLoading(true)
    try {
      const q = query(collection(db, `users/${user.id}/paymentMethods`))
      const querySnapshot = await getDocs(q)
      const fetchedPaymentMethods = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as any[] as PaymentMethod[]
      setPaymentMethods(fetchedPaymentMethods)
    } catch (error) {
      console.error("Error fetching payment methods:", error)
      toast({
        title: "Error",
        description: "Failed to load payment methods.",
        variant: "destructive",
      })
    } finally {
      setIsPaymentMethodsLoading(false)
    }
  }, [user?.id, toast])

  const handleSavePaymentMethod = async (paymentMethodData: PaymentMethod) => {
    if (!user?.id) return

    setIsPaymentMethodSaving(true)
    try {
      if (paymentMethodData.isDefault) {
        const currentDefault = paymentMethods.find((pm) => pm.isDefault && pm.id !== paymentMethodData.id)
        if (currentDefault?.id) {
          await updateDoc(doc(db, `users/${user.id}/paymentMethods`, currentDefault.id), { isDefault: false })
        }
      }

      if (editingPaymentMethod?.id) {
        const pmRef = doc(db, `users/${user.id}/paymentMethods`, editingPaymentMethod.id)
        await updateDoc(pmRef, paymentMethodData as any)
        toast({ title: "Payment Method Updated", description: "Payment method has been updated successfully." })
        // await sendAccountUpdateNotification(user.id as string, "Payment Method Updated")
      } else {
        await addDoc(collection(db, `users/${user.id}/paymentMethods`), {
          ...paymentMethodData,
          createdAt: new Date(),
        })
        toast({ title: "Payment Method Added", description: "New payment method has been added successfully." })
        // await sendAccountUpdateNotification(user.id as string, "New Payment Method Added")
      }
      setShowPaymentMethodForm(false)
      setEditingPaymentMethod(null)
      await fetchPaymentMethods()
    } catch (error) {
      console.error("Error saving payment method:", error)
      toast({
        title: "Error",
        description: "Failed to save payment method. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPaymentMethodSaving(false)
    }
  }

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    if (!user?.id || !confirm("Are you sure you want to delete this payment method?")) return

    try {
      await deleteDoc(doc(db, `users/${user.id}/paymentMethods`, paymentMethodId))
      toast({ title: "Payment Method Deleted", description: "Payment method has been deleted successfully." })
      await fetchPaymentMethods()
      // await sendAccountUpdateNotification(user.id as string, "Payment Method Deleted")
    } catch (error) {
      console.error("Error deleting payment method:", error)
      toast({
        title: "Error",
        description: "Failed to delete payment method. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    if (!user?.id) return

    setIsPaymentMethodSaving(true)
    try {
      const currentDefault = paymentMethods.find((pm) => pm.isDefault)
      if (currentDefault?.id) {
        await updateDoc(doc(db, `users/${user.id}/paymentMethods`, currentDefault.id), { isDefault: false })
      }
      await updateDoc(doc(db, `users/${user.id}/paymentMethods`, paymentMethodId), { isDefault: true })
      toast({ title: "Default Payment Method Set", description: "Your default payment method has been updated." })
      await fetchPaymentMethods()
      // await sendAccountUpdateNotification(user.id as string, "Default Payment Method Changed")
    } catch (error) {
      console.error("Error setting default payment method:", error)
      toast({
        title: "Error",
        description: "Failed to set default payment method. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPaymentMethodSaving(false)
    }
  }
  
  // --- Wishlist Management Functions ---
  const fetchWishlistItems = useCallback(async () => {
    if (!user?.id) return
    setIsWishlistLoading(true)
    try {
      const q = query(collection(db, `users/${user.id}/wishlist`))
      const querySnapshot = await getDocs(q)
      const fetchedItems: WishlistItem[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WishlistItem[]
      setWishlistItems(fetchedItems)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to load your wishlist.",
        variant: "destructive",
      })
    } finally {
      setIsWishlistLoading(false)
    }
  }, [user?.id, toast])
  
  const handleDeleteWishlistItem = async (itemId: string) => {
    if (!user?.id || !confirm("Are you sure you want to remove this item from your wishlist?")) return

    try {
      await deleteDoc(doc(db, `users/${user.id}/wishlist`, itemId));
      toast({ title: "Item Removed", description: "Item has been removed from your wishlist." });
      await fetchWishlistItems();
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };

  // --- Orders Management Functions ---
  const fetchOrders = useCallback(async () => {
    if (!user?.id) return
    setIsOrdersLoading(true)
    try {
      const ordersQuery = query(
        collection(db, "orders"), 
        where("userId", "==", user.id), 
        orderBy("createdAt", "desc")
      )
      const snapshot = await getDocs(ordersQuery)
      const ordersData = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          // Ensure proper field mapping
          orderStatus: data.status || data.orderStatus || 'pending',
          total: data.total || 0,
          items: data.items || [],
          createdAt: data.createdAt,
          shippingAddress: data.shippingAddress || {},
          paymentStatus: data.paymentStatus || 'pending',
          paymentMethod: data.paymentMethod || 'unknown',
          shippingTrackingId: data.shippingTrackingId || null,
        }
      })
      setOrders(ordersData)
      setFilteredOrders(ordersData)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders.",
        variant: "destructive",
      })
    } finally {
      setIsOrdersLoading(false)
    }
  }, [user?.id, toast])

  const filterOrders = useCallback(() => {
    let filtered = [...orders]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items?.some((item: any) => 
            (item.productName || 'Unknown Product').toLowerCase().includes(searchTerm.toLowerCase())
          ),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "3months":
          filterDate.setMonth(now.getMonth() - 3)
          break
      }

      filtered = filtered.filter((order) => order.createdAt?.toDate?.() >= filterDate)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, dateFilter])

  // Run filter whenever dependencies change
  useEffect(() => {
    filterOrders()
  }, [filterOrders])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />
      case "processing":
        return <Package className="h-4 w-4 text-yellow-600" />
      case "confirmed":
        return <Package className="h-4 w-4 text-yellow-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
      case "confirmed":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // --- Helper Functions ---
  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case "Visa":
        return "/visa.svg"
      case "Mastercard":
        return "/mastercard.svg"
      case "Amex":
        return "/amex.svg"
      case "Discover":
        return "/discover.svg"
      default:
        return "/generic-card.svg"
    }
  }
  
  // --- Loading and Auth Guards ---
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="lg:col-span-3 h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to access your account.</p>
          <Button asChild>
            <Link href="/login">Login Now</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  // --- Render JSX ---
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Welcome back, {(user as any).firstName || user.name || 'User'}!</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileFormData.firstName}
                          onChange={handleProfileChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={profileFormData.lastName} onChange={handleProfileChange} required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={profileFormData.email} disabled />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={profileFormData.phone} onChange={handleProfileChange} />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileFormData.dateOfBirth}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        value={profileFormData.gender}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <Button type="submit" disabled={isProfileSaving}>
                      {isProfileSaving ? "Saving..." : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                  <p className="text-gray-600">{filteredOrders.length} orders found</p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search orders..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="week">Last Week</SelectItem>
                          <SelectItem value="month">Last Month</SelectItem>
                          <SelectItem value="3months">Last 3 Months</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("")
                          setStatusFilter("all")
                          setDateFilter("all")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Orders List */}
                {isOrdersLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-32 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-600 mb-6">
                        {orders.length === 0
                          ? "You haven't placed any orders yet."
                          : "No orders match your current filters."}
                      </p>
                      {orders.length === 0 && (
                        <Button asChild>
                          <Link href="/products">Start Shopping</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(order.orderStatus)}
                              <div>
                                <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                                <p className="text-sm text-gray-600">
                                  {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Date unavailable'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.orderStatus)}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </Badge>
                              <p className="text-lg font-semibold mt-1">
                                ₹{order.total?.toFixed?.(2) || '0.00'}
                              </p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3">
                            {order.items?.slice(0, 2).map((item: any, index: number) => (
                              <div key={index} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.productName || item.name || 'Unknown Product'}</p>
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity || 1} × ₹{item.price?.toFixed?.(2) || '0.00'}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {order.items?.length > 2 && (
                              <p className="text-sm text-gray-600 pl-16">
                                +{order.items.length - 2} more items
                              </p>
                            )}
                          </div>

                          {/* Shipping Address */}
                          {order.shippingAddress && Object.keys(order.shippingAddress).length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                <div className="text-sm text-gray-600">
                                  <p className="font-medium">Shipping Address:</p>
                                  <p>
                                    {order.shippingAddress.addressLine1}
                                    {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                                  </p>
                                  <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Payment & Shipping Information */}
                          <div className="mt-4 pt-4 border-t space-y-3">
                            {/* Payment Information */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Payment: 
                                  <span className={`ml-1 font-medium ${
                                    order.paymentStatus === 'paid' ? 'text-green-600' : 
                                    order.paymentStatus === 'failed' ? 'text-red-600' : 
                                    'text-yellow-600'
                                  }`}>
                                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                                  </span>
                                </span>
                              </div>
                              {order.paymentStatus === 'paid' && order.paymentTransactionId && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => window.open(
                                    `https://dashboard.razorpay.com/app/payments/${order.paymentTransactionId.replace('pay_', '')}/details`, 
                                    '_blank'
                                  )}
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  Invoice
                                </Button>
                              )}
                            </div>

                            {/* Enhanced Tracking Section */}
                            {order.trackingId && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Truck className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium">Shipment Tracking</span>
                                  </div>
                                  <Badge className="bg-blue-100 text-blue-800">
                                    {order.shiprocketStatus || order.orderStatus}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">AWB Number:</span>
                                    <span className="font-mono">{order.trackingId}</span>
                                  </div>
                                  {order.shipmentId && (
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600">Shipment ID:</span>
                                      <span className="font-mono">{order.shipmentId}</span>
                                    </div>
                                  )}
                                  <div className="flex gap-2 mt-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => window.open(
                                        `https://shiprocket.co/tracking/${order.trackingId}`, 
                                        '_blank'
                                      )}
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Track Live
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      asChild
                                    >
                                      <Link href={`/account/orders/${order.id}/track`}>
                                        <Eye className="h-3 w-3 mr-1" />
                                        View Details
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Shiprocket Status */}
                            {order.shiprocketStatus && (
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Shipment Status: 
                                  <span className="ml-1 font-medium text-blue-600">
                                    {order.shiprocketStatus}
                                  </span>
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Order Actions */}
                          <div className="flex gap-2 mt-4 pt-4 border-t">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/account/orders/${order.id}`}>View Details</Link>
                            </Button>
                            {(order.orderStatus === 'shipped' || order.orderStatus === 'delivered') && order.trackingId && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/account/orders/${order.id}/track`}>Track Order</Link>
                              </Button>
                            )}
                            {order.orderStatus === 'pending' && (
                              <Button variant="outline" size="sm">Cancel Order</Button>
                            )}
                            {order.paymentStatus === 'paid' && order.paymentTransactionId && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(
                                  `https://dashboard.razorpay.com/app/payments/${order.paymentTransactionId.replace('pay_', '')}/details`, 
                                  '_blank'
                                )}
                              >
                                View Receipt
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Saved Addresses
                  </CardTitle>
                  <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingAddress(null)
                          setShowAddressForm(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                      </DialogHeader>
                      <AddressForm
                        address={editingAddress}
                        onSave={handleSaveAddress}
                        onCancel={() => setShowAddressForm(false)}
                        isSaving={isAddressSaving}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isAddressesLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-24 bg-gray-100 rounded-lg"></div>
                      <div className="h-24 bg-gray-100 rounded-lg"></div>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No addresses found</h3>
                      <p className="text-gray-600 mb-4">Add your first address to get started.</p>
                      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => {
                              setEditingAddress(null)
                              setShowAddressForm(true)
                            }}
                          >
                            Add New Address
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                          </DialogHeader>
                          <AddressForm
                            address={null}
                            onSave={handleSaveAddress}
                            onCancel={() => setShowAddressForm(false)}
                            isSaving={isAddressSaving}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((addr) => (
                        <Card key={addr.id} className={addr.isDefault ? "border-blue-500 border-2" : ""}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold capitalize">
                                {addr.type} Address
                                {addr.isDefault && (
                                  <Badge variant="secondary" className="ml-2">
                                    Default
                                  </Badge>
                                )}
                              </h3>
                              <div className="flex gap-2">
                                {!addr.isDefault && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetDefaultAddress(addr.id!)}
                                    disabled={isAddressSaving}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> Set Default
                                  </Button>
                                )}
                                <Dialog
                                  open={showAddressForm && editingAddress?.id === addr.id}
                                  onOpenChange={(open) => {
                                    setShowAddressForm(open)
                                    if (!open) setEditingAddress(null)
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditingAddress(addr)
                                        setShowAddressForm(true)
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                      <DialogTitle>Edit Address</DialogTitle>
                                    </DialogHeader>
                                    <AddressForm
                                      address={editingAddress}
                                      onSave={handleSaveAddress}
                                      onCancel={() => setShowAddressForm(false)}
                                      isSaving={isAddressSaving}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteAddress(addr.id!)}
                                  disabled={isAddressSaving}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                              {(addr as any).fullName || (addr as any).name} <br />
                              {addr.addressLine1}
                              {addr.addressLine2 && (
                                <>
                                  <br />
                                  {addr.addressLine2}
                                </>
                              )}
                              <br />
                              {addr.city}, {addr.state} {addr.pincode}
                              <br />
                              Phone: {addr.phone}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "wishlist" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    My Wishlist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isWishlistLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-32 bg-gray-100 rounded-lg"></div>
                      <div className="h-32 bg-gray-100 rounded-lg"></div>
                    </div>
                  ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-4">Save items you love for later</p>
                      <Button asChild>
                        <Link href="/products">Start Shopping</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {wishlistItems.map((item) => (
                        <WishlistProductCard key={item.id} item={item} onDelete={handleDeleteWishlistItem} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === "payment" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods
                  </CardTitle>
                  <Dialog open={showPaymentMethodForm} onOpenChange={setShowPaymentMethodForm}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPaymentMethod(null)
                          setShowPaymentMethodForm(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingPaymentMethod ? "Edit Payment Method" : "Add New Payment Method"}
                        </DialogTitle>
                      </DialogHeader>
                      <PaymentMethodForm
                        paymentMethod={editingPaymentMethod}
                        onSave={handleSavePaymentMethod}
                        onCancel={() => setShowPaymentMethodForm(false)}
                        isSaving={isPaymentMethodSaving}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isPaymentMethodsLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-24 bg-gray-100 rounded-lg"></div>
                      <div className="h-24 bg-gray-100 rounded-lg"></div>
                    </div>
                  ) : paymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No payment methods saved</h3>
                      <p className="text-gray-600 mb-4">Add your credit/debit cards for faster checkout.</p>
                      <Dialog open={showPaymentMethodForm} onOpenChange={setShowPaymentMethodForm}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => {
                              setEditingPaymentMethod(null)
                              setShowPaymentMethodForm(true)
                            }}
                          >
                            Add New Payment Method
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Add New Payment Method</DialogTitle>
                          </DialogHeader>
                          <PaymentMethodForm
                            paymentMethod={null}
                            onSave={handleSavePaymentMethod}
                            onCancel={() => setShowPaymentMethodForm(false)}
                            isSaving={isPaymentMethodSaving}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map((pm) => (
                        <Card key={pm.id} className={pm.isDefault ? "border-blue-500 border-2" : ""}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={getCardIcon((pm as any).cardType || (pm as any).provider) || "/placeholder.svg"}
                                  alt={(pm as any).cardType || (pm as any).provider}
                                  width={40}
                                  height={24}
                                  className="object-contain"
                                />
                                <h3 className="font-semibold">
                                  {(pm as any).cardType || (pm as any).provider} ending in {pm.last4}
                                  {pm.isDefault && (
                                    <Badge variant="secondary" className="ml-2">
                                      Default
                                    </Badge>
                                  )}
                                </h3>
                              </div>
                              <div className="flex gap-2">
                                {!pm.isDefault && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetDefaultPaymentMethod(pm.id!)}
                                    disabled={isPaymentMethodSaving}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> Set Default
                                  </Button>
                                )}
                                <Dialog
                                  open={showPaymentMethodForm && editingPaymentMethod?.id === pm.id}
                                  onOpenChange={(open) => {
                                    setShowPaymentMethodForm(open)
                                    if (!open) setEditingPaymentMethod(null)
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditingPaymentMethod(pm)
                                        setShowPaymentMethodForm(true)
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                      <DialogTitle>Edit Payment Method</DialogTitle>
                                    </DialogHeader>
                                    <PaymentMethodForm
                                      paymentMethod={editingPaymentMethod}
                                      onSave={handleSavePaymentMethod}
                                      onCancel={() => setShowPaymentMethodForm(false)}
                                      isSaving={isPaymentMethodSaving}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeletePaymentMethod(pm.id!)}
                                  disabled={isPaymentMethodSaving}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Cardholder: {(pm as any).cardHolderName || 'N/A'} <br />
                              Expires: {pm.expiryMonth}/{pm.expiryYear}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No new notifications</h3>
                    <p className="text-gray-600 mb-4">You're all caught up!</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Change Password</h3>
                      <form className="space-y-3">
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                        <Button type="submit">Update Password</Button>
                      </form>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
                      <p className="text-gray-600 text-sm mb-4">Add an extra layer of security to your account.</p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "rewards" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    My Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">You have 1,250 Reward Points!</h3>
                    <p className="text-gray-600 mb-4">Redeem them for discounts on your next purchase.</p>
                    <Button>Redeem Rewards</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}