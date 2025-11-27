"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/types"
import { Footer } from "@/components/layout/footer"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice, appliedCoupon, applyCoupon, removeCoupon } = useCart()
  const [products, setProducts] = useState<{ [key: string]: Product }>({})
  const [loadingProducts, setLoadingProducts] = useState(false)

  const [couponCode, setCouponCode] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)

  // Create dummy product data based on cart items
  useEffect(() => {
    const createDummyProducts = () => {
      const productMap: { [key: string]: Product } = {}
      
      items.forEach((item) => {
        if (!productMap[item.productId]) {
          // Create dummy product data based on cart item
          productMap[item.productId] = {
            id: item.productId,
            name: item.name,
            price: item.price,
            originalPrice: Math.round(item.price * 1.2), // 20% higher original price
            images: [item.image || "/placeholder.svg"],
            brand: "Tech Brand", // Default brand
            description: `High-quality ${item.name} with excellent features.`,
            category: "Electronics",
            sku: `SKU-${item.productId}`,
            stock: item.maxQuantity || 10,
            rating: 4.5,
            reviewCount: 128,
            features: ["High Quality", "Latest Technology", "Durable"],
            specifications: {
              "Brand": "Tech Brand",
              "Model": item.name,
              "Warranty": "1 Year"
            },
            isActive: true,
            isFeatured: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }
      })
      
      setProducts(productMap)
    }

    createDummyProducts()
  }, [items])

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
    toast.success("Quantity updated")
  }

  const handleRemoveItem = (productId: string) => {
    removeItem(productId)
    toast.success("Item removed from cart")
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.info("Please enter a coupon code.")
      return
    }
    setCouponLoading(true)
    
    // Simulate coupon validation with dummy data
    setTimeout(() => {
      const validCoupons = {
        "SAVE10": { discount: 0.1, minOrder: 0 }, // 10% off
        "FIRST20": { discount: 0.2, minOrder: 1000 }, // 20% off for orders above ₹1000
        "FLAT500": { discount: 500, minOrder: 2000 }, // ₹500 off for orders above ₹2000
      }
      
      const coupon = validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons]
      
      if (coupon) {
        if (subtotal >= coupon.minOrder) {
          const discountAmount = coupon.discount < 1 
            ? Math.round(subtotal * coupon.discount) 
            : coupon.discount
          
          applyCoupon(couponCode.toUpperCase(), discountAmount)
          toast.success(`Coupon applied! You saved ₹${discountAmount.toLocaleString()}`)
        } else {
          toast.error(`Minimum order value of ₹${coupon.minOrder.toLocaleString()} required for this coupon.`)
        }
      } else {
        toast.error("Invalid coupon code. Try SAVE10, FIRST20, or FLAT500")
      }
      
      setCouponLoading(false)
      setCouponCode("")
    }, 1000)
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    toast.success("Coupon removed")
  }

  const subtotal = items.reduce((sum, item) => {
    const product = products[item.productId]
    return sum + (product?.price || 0) * item.quantity
  }, 0)

  const savings = items.reduce((sum, item) => {
    const product = products[item.productId]
    return sum + ((product?.originalPrice || product?.price || 0) - (product?.price || 0)) * item.quantity
  }, 0)

  const couponDiscount = appliedCoupon?.discountAmount || 0
  const deliveryFee = subtotal > 499 ? 0 : 49
  const total = subtotal - couponDiscount + deliveryFee

  const suggestedProducts = [
    {
      id: "s1",
      name: "Wireless Earbuds Pro",
      price: 4999,
      originalPrice: 6999,
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.5,
    },
    {
      id: "s2",
      name: "Power Bank 20000mAh",
      price: 2499,
      originalPrice: 3499,
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.3,
    },
    {
      id: "s3",
      name: "Car Phone Mount",
      price: 799,
      originalPrice: 1299,
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.7,
    },
  ]

  if (loadingProducts) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 mt-[100px] sm:mt-[120px] lg:mt-[150px]">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Loading Cart...</h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8">Please wait while we fetch your cart items.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto min-h-[50vh] px-4 sm:px-6 py-12 sm:py-16 flex items-center justify-center mt-[100px] sm:mt-[120px] lg:mt-[150px]">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <Button size="lg" className="px-6 sm:px-8 text-sm sm:text-base">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-[100px] sm:mt-[120px] lg:mt-[150px]">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-sm sm:text-base text-gray-600">{getTotalItems()} items in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item) => {
              const product = products[item.productId]
              if (!product) return null // Product details not loaded yet or product doesn't exist
              return (
                <Card key={item.productId}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative w-full sm:w-24 h-32 sm:h-24 flex-shrink-0 mx-auto sm:mx-0">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 space-y-3 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                          <div className="text-center sm:text-left mb-2 sm:mb-0">
                            <h3 className="font-semibold text-base sm:text-lg">{product.name}</h3>
                            <p className="text-gray-600 text-sm">
                              {product.brand}
                            </p>
                            {product.stock === 0 && (
                              <Badge variant="destructive" className="mt-1">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-600 hover:text-red-700 self-center sm:self-start"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-2">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="text-lg sm:text-xl font-bold">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-gray-500 line-through text-sm">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateQuantity(item.productId, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                              className="w-12 sm:w-16 text-center border rounded py-1 text-sm"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateQuantity(item.productId, item.quantity + 1)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Suggested Products */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="h-5 w-5" />
                  You might also like
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {suggestedProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                      <div className="relative w-full h-16 sm:h-20 mb-2 sm:mb-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <h4 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">{product.name}</h4>
                      <div className="flex items-center gap-1 sm:gap-2 mb-2 justify-center sm:justify-start">
                        <span className="font-bold text-sm sm:text-base">₹{product.price.toLocaleString()}</span>
                        <span className="text-gray-500 line-through text-xs">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full bg-transparent text-xs sm:text-sm h-8">
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 sm:space-y-6">
            {/* Coupon Code */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="h-5 w-5" />
                  Apply Coupon
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!appliedCoupon ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponLoading}
                      className="text-sm"
                    />
                    <Button onClick={handleApplyCoupon} variant="outline" disabled={couponLoading} className="text-sm whitespace-nowrap">
                      {couponLoading ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <p className="text-green-800 text-sm font-medium">
                        {appliedCoupon.code} applied! You saved ₹{appliedCoupon.discountAmount.toLocaleString()}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleRemoveCoupon}
                        className="text-green-800 hover:text-green-900 self-end sm:self-auto"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
                <div className="mt-3 text-xs text-gray-600">
                  <p>Available coupons: SAVE10 (10% off), FIRST20 (20% off ₹1000+), FLAT500 (₹500 off ₹2000+)</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600 text-sm sm:text-base">
                    <span>You saved</span>
                    <span>-₹{savings.toLocaleString()}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 text-sm sm:text-base">
                    <span>Coupon discount</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base">
                  <span className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    Delivery Fee
                  </span>
                  <span>{deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee}`}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <div className="space-y-2 sm:space-y-3 pt-2">
                  <Link href="/checkout">
                    <Button className="w-full text-sm sm:text-base" size="lg">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/products">
                    <Button variant="outline" className="w-full bg-transparent text-sm sm:text-base">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Benefits */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span>Free delivery on orders above ₹499</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}