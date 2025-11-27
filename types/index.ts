export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  userId: string
  type: "home" | "office" | "other"
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  landmark?: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: string
  type: "card" | "upi" | "netbanking" | "wallet"
  provider: string
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  brand: string
  sku: string
  stock: number
  rating: number
  reviewCount: number
  features: string[]
  specifications: Record<string, string>
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  parentId?: string
  isActive: boolean
  productCount: number
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo: string
  description: string
  isActive: boolean
  productCount: number
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  maxQuantity: number
  selectedOptions?: Record<string, string> // Optional product options like color, size, etc.
}

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  addedAt: Date
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  shippingAddress: Address
  billingAddress: Address
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  total: number
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  isVerified: boolean
  createdAt: Date
}

export interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrderValue: number
  maxDiscount?: number
  usageLimit: number
  usedCount: number
  isActive: boolean
  validFrom: Date
  validTo: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  authorId: string      // Changed from 'author'
  authorName: string    // Added
  imageUrl?: string     // Changed from 'featuredImage', made optional
  tags: string[]
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}


export interface CorporateInquiry {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  industry: string
  companySize: string
  requirements: string
  budget: string
  timeline: string
  status: "pending" | "contacted" | "quoted" | "closed"
  createdAt: Date
  updatedAt: Date
}

export interface PartnershipApplication {
  id: string
  partnershipType: "retail" | "distribution" | "affiliate" | "supplier"
  companyName: string
  contactPerson: string
  email: string
  phone: string
  businessType: string
  yearsInBusiness: string
  currentBusiness: string
  investmentCapacity?: string
  coverageArea?: string
  websiteTraffic?: string
  status: "pending" | "under_review" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}
