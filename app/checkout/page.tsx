"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product, Address } from "@/types"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Truck, MapPin, Shield, CheckCircle, Clock, Phone, Tag } from "lucide-react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { sendOrderConfirmationNotification } from "@/actions/notifications"
import { applyCoupon as applyCouponAction, incrementCouponUsage } from "@/actions/coupons"
import { Footer } from "@/components/layout/footer"

// Declare global types for payment SDKs if they are loaded dynamically
declare global {
  interface Window {
    Razorpay: any
    Stripe: any
  }
}

export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, getTotalPrice, clearCart, appliedCoupon } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState<{ [key: string]: Product }>({})
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review
  const [formData, setFormData] = useState({
    // Shipping Address
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "home",

    // Payment
    paymentMethod: "razorpay", // Default to Razorpay

    // Additional
    specialInstructions: "",
    saveAddress: true,
    agreeTerms: false,
  })

  const [couponCode, setCouponCode] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [shippingRates, setShippingRates] = useState<any[]>([])
  const [selectedShippingRate, setSelectedShippingRate] = useState<any>(null)
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [pincodeServiceable, setPincodeServiceable] = useState<boolean | null>(null)
  const [pincodeValidating, setPincodeValidating] = useState(false)

  const subtotal = items.reduce((sum, item) => {
    const product = products[item.productId]
    return sum + (product?.price || 0) * item.quantity
  }, 0)
  const deliveryFee = selectedShippingRate ? selectedShippingRate.rate : (subtotal > 499 ? 0 : 49) // Use dynamic rate or fallback
  const couponDiscount = appliedCoupon?.discountAmount || 0
  const total = subtotal - couponDiscount + deliveryFee

  // Add this state to track if all products are loaded
  const [allProductsLoaded, setAllProductsLoaded] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout")
      return
    }

    if (items.length === 0) {
      router.push("/cart")
      return
    }

    fetchProductDetails()
  }, [user, items, router])

  // Add effect to refresh product data when items change
  useEffect(() => {
    if (items.length > 0) {
      // Reset products state when items change to ensure we fetch fresh data
      setProducts({})
      setAllProductsLoaded(false)
      fetchProductDetails()
    }
  }, [JSON.stringify(items)]) // Use JSON.stringify to detect changes in items array

  // Add effect to check if all products are loaded
  useEffect(() => {
    if (items.length === 0) {
      setAllProductsLoaded(false)
      return
    }
    
    // Check if we have product data for all items in the cart
    const allItemsHaveProducts = items.every(item => products[item.productId])
    setAllProductsLoaded(allItemsHaveProducts)
  }, [items, products])

  useEffect(() => {
    // Dynamically load Razorpay and Stripe scripts
    if (step === 2) {
      if (formData.paymentMethod === "razorpay" && !window.Razorpay) {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        script.onload = () => {
          console.log('Razorpay script loaded successfully')
        }
        script.onerror = () => {
          console.error('Failed to load Razorpay script')
        }
        document.body.appendChild(script)
      }
      if (formData.paymentMethod === "stripe" && !window.Stripe) {
        const script = document.createElement("script")
        script.src = "https://js.stripe.com/v3/"
        script.async = true
        script.onload = () => {
          console.log('Stripe script loaded successfully')
        }
        script.onerror = () => {
          console.error('Failed to load Stripe script')
        }
        document.body.appendChild(script)
      }
    }
  }, [step, formData.paymentMethod])

  // Fetch shipping rates when pincode changes
  useEffect(() => {
    if (formData.pincode && formData.pincode.length === 6) {
      const timer = setTimeout(async () => {
        // First validate pincode serviceability
        await validatePincodeServiceability(formData.pincode)
        // Then fetch shipping rates
        await fetchShippingRates(formData.pincode)
      }, 500) // Debounce API calls
      
      return () => clearTimeout(timer)
    } else {
      setShippingRates([])
      setSelectedShippingRate(null)
    }
  }, [formData.pincode])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const productPromises = items.map(async (item) => {
        const productDoc = await getDoc(doc(db, "products", item.productId))
        if (productDoc.exists()) {
          return { id: productDoc.id, ...productDoc.data() } as Product
        }
        // If product doesn't exist, create a minimal product object from cart item
        return {
          id: item.productId,
          name: item.name,
          price: item.price,
          images: [item.image],
        } as Product
      })

      const productResults = await Promise.all(productPromises)
      const productMap: { [key: string]: Product } = {}

      productResults.forEach((product) => {
        if (product) {
          productMap[product.id] = product
        }
      })

      setProducts(productMap)
    } catch (error) {
      console.error("Error fetching product details:", error)
      toast({
        title: "Error",
        description: "Failed to load product details. Some product information may be incomplete.",
        variant: "destructive",
      })
      
      // Create fallback products from cart items
      const fallbackProducts: { [key: string]: Product } = {}
      items.forEach(item => {
        fallbackProducts[item.productId] = {
          id: item.productId,
          name: item.name,
          price: item.price,
          images: [item.image],
        } as Product
      })
      setProducts(fallbackProducts)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleRadioChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateShippingAddress = () => {
    const requiredFields = ["fullName", "phone", "email", "addressLine1", "city", "state", "pincode"]
    const isValid = requiredFields.every((field) => formData[field as keyof typeof formData])
    
    // Additional validations
    const phoneValid = /^[6-9]\d{9}$/.test(formData.phone)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    const pincodeValid = /^\d{6}$/.test(formData.pincode)
    
    if (!isValid) {
      toast({
        title: "Incomplete Address",
        description: "Please fill in all required shipping address fields.",
        variant: "destructive",
      })
      return false
    }
    
    if (!phoneValid) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      })
      return false
    }
    
    if (!emailValid) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return false
    }
    
    if (!pincodeValid) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive",
      })
      return false
    }
    
    if (pincodeServiceable === false) {
      toast({
        title: "Delivery Not Available",
        description: "Delivery is not available to the entered pincode. Please try a different pincode.",
        variant: "destructive",
      })
      return false
    }
    
    // Allow null (unknown) serviceability to proceed if we have fallback rates
    if (pincodeServiceable === null && shippingRates.length === 0) {
      toast({
        title: "Cannot verify delivery",
        description: "Unable to verify delivery availability. Please contact support or try a different pincode.",
        variant: "destructive",
      })
      return false
    }
    
    return true
  }

  const handleNextStep = async () => {
    if (step === 1) {
      if (!validateShippingAddress()) {
        return
      }
      
      // Check if pincode validation is still pending
      if (pincodeValidating) {
        toast({
          title: "Please wait",
          description: "Validating pincode serviceability...",
        })
        return
      }
      
      // Ensure we have shipping rates
      if (!selectedShippingRate && shippingRates.length === 0) {
        toast({
          title: "No shipping options",
          description: "Please wait for shipping rates to load or try a different pincode.",
          variant: "destructive",
        })
        return
      }
    } else if (step === 2) {
      // Before proceeding to review step, ensure all products are loaded
      if (!allProductsLoaded) {
        toast({
          title: "Loading product details",
          description: "Please wait while we load product information...",
        })
        return
      }
    } else if (step === 3) {
      if (!formData.agreeTerms) {
        toast({
          title: "Terms & Conditions",
          description: "Please agree to the Terms & Conditions and Privacy Policy.",
          variant: "destructive",
        })
        return
      }
    }
    setStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
  }

  const fetchShippingRates = async (pincode: string) => {
    if (!pincode || pincode.length !== 6) return
    
    setLoadingShipping(true)
    try {
      const response = await fetch('/api/shiprocket/shipping-rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickup_postcode: '110001', // Default pickup location
          delivery_postcode: pincode,
          weight: 0.5, // Default weight
          length: 10,
          breadth: 10,
          height: 10
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.couriers.length > 0) {
        setShippingRates(data.couriers)
        // Auto-select cheapest option
        setSelectedShippingRate(data.couriers[0])
        toast({
          title: "Shipping rates updated",
          description: `Found ${data.couriers.length} shipping options for ${pincode}`,
        })
      } else {
        setShippingRates([])
        setSelectedShippingRate(null)
        toast({
          title: "No shipping available",
          description: "No shipping options available for this pincode",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching shipping rates:', error)
      toast({
        title: "Error",
        description: "Failed to fetch shipping rates",
        variant: "destructive",
      })
    } finally {
      setLoadingShipping(false)
    }
  }

  const validatePincodeServiceability = async (pincode: string) => {
    if (!pincode || pincode.length !== 6) {
      setPincodeServiceable(null)
      return
    }
    
    setPincodeValidating(true)
    try {
      const response = await fetch(`/api/shiprocket/serviceability?pincode=${pincode}`)
      const data = await response.json()
      
      if (data.success) {
        setPincodeServiceable(data.serviceable)
        if (!data.serviceable) {
          toast({
            title: "Delivery not available",
            description: data.message || "Delivery is not available to this pincode",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Delivery available",
            description: data.message || "Delivery is available to this pincode",
          })
        }
      } else {
        // For API failures, assume serviceable with warning
        setPincodeServiceable(true)
        toast({
          title: "Delivery check unavailable",
          description: "Cannot verify delivery availability right now, but proceeding with order.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error('Error validating pincode:', error)
      // For network errors, assume serviceable with warning
      setPincodeServiceable(true)
      toast({
          title: "Proceeding with order",
          description: "Cannot verify delivery availability, but order will be processed.",
          variant: "default",
      })
    } finally {
      setPincodeValidating(false)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast({
        title: "No Coupon",
        description: "Please enter a coupon code.",
        variant: "default",
      })
      return
    }
    setCouponLoading(true)
    try {
      const result = await applyCouponAction(couponCode, subtotal)
      if (result.success) {
        // Note: In a real implementation, we would need to update the cart context
        // For now, we're just showing the UI feedback
        toast({
          title: "Coupon Applied",
          description: result.message,
          variant: "default",
        })
      } else {
        toast({
          title: "Coupon Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error applying coupon:", error)
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCouponLoading(false)
      setCouponCode("")
    }
  }

  const handleRazorpayPayment = async () => {
    setPlacing(true) // Set placing to true when payment initiation starts
    let orderDocRef: any = null // To store the Firestore order reference

    try {
      // 1. Create the order in Firestore with 'pending' payment status
      //    and store the Razorpay Order ID (which we'll get from backend)
      //    as paymentTransactionId for later lookup by webhook.
      const orderItems = items.map((item) => {
        const product = products[item.productId]
        return {
          productId: item.productId,
          productName: product?.name || "Unknown Product",
          price: product?.price || 0,
          quantity: item.quantity,
          image: product?.images[0] || "/placeholder.svg",
          selectedOptions: item.selectedOptions || {}, // Ensure it's always an object
        }
      })

      const initialOrderData = {
        userId: user!.id,
        items: orderItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        couponDiscount: couponDiscount,
        total: total,
        status: "pending", // Initial status
        shippingAddress: {
          id: `addr-${Date.now()}`, // Generate temporary ID
          userId: user!.id,
          fullName: formData.fullName,
          name: formData.fullName, // Use fullName as name for Address interface
          phone: formData.phone,
          email: formData.email, // Add email to shipping address
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: "India", // Default country
          type: formData.addressType,
          isDefault: formData.saveAddress,
        } as Address,
        shippingDetails: {
          courierName: selectedShippingRate?.courier_name || "Standard Delivery",
          estimatedDeliveryDays: selectedShippingRate?.estimated_delivery_days || "3-5",
          shippingCost: deliveryFee,
        },
        paymentMethod: formData.paymentMethod,
        paymentStatus: "pending", // Payment status is pending until webhook confirms
        paymentTransactionId: null, // Will be updated with Razorpay Order ID
        specialInstructions: formData.specialInstructions,
        customerEmail: formData.email, // Add customer email for Shiprocket
        customerPhone: formData.phone, // Add customer phone
        appliedCouponCode: appliedCoupon?.code || null, // Store coupon code
        couponDiscountAmount: appliedCoupon?.discountAmount || 0, // Store coupon discount amount
        orderSource: "website", // Track order source
        orderNotes: [], // Initialize empty notes array
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      orderDocRef = await addDoc(collection(db, "orders"), initialOrderData)
      const internalOrderId = orderDocRef.id

      // 2. Call your backend API to create a Razorpay order
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          receipt: internalOrderId, // Use your internal order ID as receipt for linking
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create Razorpay order on backend")
      }

      const { id: razorpayOrderId, amount: razorpayAmount, currency: razorpayCurrency } = await response.json()

      // Update the Firestore order with the Razorpay Order ID
      await updateDoc(orderDocRef, {
        paymentTransactionId: razorpayOrderId,
        updatedAt: new Date(),
      })

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RJ4VdDydsSSIbK", // Fallback to test key
        amount: razorpayAmount,
        currency: razorpayCurrency,
        name: "Genius Technology",
        description: `Order #${internalOrderId.slice(-8)}`,
        image: "https://your-logo-url.com/logo.png", // Add your logo URL
        order_id: razorpayOrderId, // Use the order ID from your backend
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: true,
          paylater: true
        },
        handler: async (response: any) => {
          try {
            // Verify payment on the server side
            const verificationResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                order_id: internalOrderId
              })
            })
            
            const verificationData = await verificationResponse.json()
            
            if (verificationData.success) {
              toast({
                title: "Payment Successful",
                description: "Your payment has been verified and order confirmed.",
              })
              
              // Increment coupon usage if applied
              // Note: In a real implementation, we would need the coupon ID
              // For now, we're just showing the UI feedback
              
              // Clear cart and redirect
              clearCart()
              router.push(`/account/orders/${internalOrderId}`)
              await sendOrderConfirmationNotification(internalOrderId)
            } else {
              throw new Error(verificationData.error || "Payment verification failed")
            }
          } catch (error: any) {
            console.error("Payment verification error:", error)
            toast({
              title: "Payment Verification Failed",
              description: error.message || "Unable to verify payment. Please contact support.",
              variant: "destructive",
            })
            
            // Update order status to failed
            if (orderDocRef) {
              await updateDoc(orderDocRef, {
                paymentStatus: "verification_failed",
                status: "payment_failed",
                updatedAt: new Date(),
              })
            }
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.addressLine1,
          internalOrderId: internalOrderId, // Pass internal order ID to Razorpay notes
        },
        theme: {
          color: "#3B82F6", // Tailwind blue-500
        },
        modal: {
          ondismiss: function() {
            console.log('Razorpay modal dismissed by user')
            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled by user.",
              variant: "default",
            })
            setPlacing(false)
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        },
      }

      // Wait for Razorpay to be loaded if needed
      if (!window.Razorpay) {
        // Wait up to 5 seconds for Razorpay to load
        let attempts = 0
        while (!window.Razorpay && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }
        
        if (!window.Razorpay) {
          throw new Error('Razorpay failed to load. Please refresh and try again.')
        }
      }

      if (window.Razorpay) {
        console.log('Initializing Razorpay with options:', { ...options, key: 'rzp_test_***' }) // Log options without exposing full key
        const rzp1 = new window.Razorpay(options)
        rzp1.on("payment.failed", async (response: any) => {
          console.error('Razorpay payment failed:', response.error)
          toast({
            title: "Payment Failed",
            description: `Error: ${response.error.description}`,
            variant: "destructive",
          })
          // Update order status to failed immediately on client for quick feedback
          if (orderDocRef) {
            await updateDoc(orderDocRef, {
              paymentStatus: "failed",
              status: "cancelled", // Or a specific 'payment_failed' status
              updatedAt: new Date(),
            })
          }
          // No redirect here, user might want to retry
        })
        rzp1.open()
      } else {
        console.error('Razorpay script not loaded')
        toast({
          title: "Payment Gateway Error",
          description: "Razorpay script not loaded. Please try again.",
          variant: "destructive",
        })
        if (orderDocRef) {
          await updateDoc(orderDocRef, {
            paymentStatus: "failed",
            status: "cancelled",
            updatedAt: new Date(),
          })
        }
      }
    } catch (error: any) {
      console.error("Error during Razorpay payment initiation:", error)
      toast({
        title: "Payment Initiation Failed",
        description: error.message || "Could not initiate Razorpay payment. Please try again.",
        variant: "destructive",
      })
      // If order creation failed before Razorpay, clean up or mark as failed
      if (orderDocRef) {
        await updateDoc(orderDocRef, {
          paymentStatus: "failed",
          status: "cancelled",
          updatedAt: new Date(),
        })
      }
    } finally {
      setPlacing(false) // Reset placing state
    }
  }

  // This function is now primarily for COD or for initial order creation
  // before a payment gateway takes over. For Razorpay, the webhook will finalize.
  const finalizeOrder = async (paymentId: string | null, paymentStatus: "pending" | "paid" | "failed") => {
    setPlacing(true)
    try {
      const orderItems = items.map((item) => {
        const product = products[item.productId]
        return {
          productId: item.productId,
          productName: product?.name || "Unknown Product",
          price: product?.price || 0,
          quantity: item.quantity,
          image: product?.images[0] || "/placeholder.svg",
          selectedOptions: item.selectedOptions || {}, // Ensure it's always an object
        }
      })

      const orderData = {
        userId: user!.id,
        items: orderItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        couponDiscount: couponDiscount,
        total: total,
        status: "pending", // Initial status
        shippingAddress: {
          id: `addr-${Date.now()}`, // Generate temporary ID
          userId: user!.id,
          fullName: formData.fullName,
          name: formData.fullName, // Use fullName as name for Address interface
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          type: formData.addressType,
          isDefault: formData.saveAddress,
        } as Address,
        paymentMethod: formData.paymentMethod,
        paymentStatus: paymentStatus, // For COD, this will be 'pending'
        paymentTransactionId: paymentId, // Store payment ID (e.g., simulated for Stripe/PayU)
        specialInstructions: formData.specialInstructions,
        customerEmail: formData.email, // Add customer email for Shiprocket
        appliedCouponCode: appliedCoupon?.code || null, // Store applied coupon code
        couponDiscountAmount: appliedCoupon?.discountAmount || 0, // Store coupon discount amount
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const orderRef = await addDoc(collection(db, "orders"), orderData)

      // Increment coupon usage if applied
      if (appliedCoupon?.code) {
        // Increment coupon usage would require the coupon ID which is not available
        // This would need to be implemented in the backend with the coupon code
      }

      clearCart()

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderRef.id.slice(-8)} has been placed.`,
      })

      router.push(`/account/orders/${orderRef.id}`)
      await sendOrderConfirmationNotification(orderRef.id)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPlacing(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!formData.agreeTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please agree to the Terms & Conditions and Privacy Policy.",
        variant: "destructive",
      })
      return
    }

    try {
      if (formData.paymentMethod === "razorpay") {
        await handleRazorpayPayment()
      } else if (formData.paymentMethod === "cod") {
        setPlacing(true)
        await finalizeOrder(null, "pending") // COD is pending until delivered
      }
    } catch (error) {
      console.error("Error during payment initiation:", error)
      toast({
        title: "Payment Initiation Failed",
        description: "Could not initiate payment. Please try again.",
        variant: "destructive",
      })
      setPlacing(false)
    }
  }

  const paymentMethods = [
    {
      id: "razorpay",
      name: "Razorpay",
      description: "Credit/Debit Cards, UPI, Net Banking, Wallets",
      icon: "💳",
      popular: true,
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when you receive",
      icon: "💵",
      popular: false,
    },
  ]

  const deliveryOptions = [
    {
      id: "standard",
      name: "Standard Delivery",
      time: "3-5 business days",
      price: deliveryFee,
      description: "Via Blue Dart, DTDC",
    },
    {
      id: "express",
      name: "Express Delivery",
      time: "1-2 business days",
      price: 99,
      description: "Via FedEx Express",
    },
    {
      id: "same-day",
      name: "Same Day Delivery",
      time: "Within 6 hours",
      price: 199,
      description: "Available in select cities",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Add a check for product loading state
  if (!allProductsLoaded && items.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading Product Details</h2>
            <p className="text-gray-600">Please wait while we fetch the latest product information...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: "Shipping", icon: MapPin },
              { step: 2, title: "Payment", icon: CreditCard },
              { step: 3, title: "Review", icon: CheckCircle },
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step >= item.step ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-400"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 font-medium ${step >= item.step ? "text-blue-600" : "text-gray-400"}`}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Billing Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="addressLine1">Address Line 1 *</Label>
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        placeholder="House/Flat No., Building Name, Street"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="addressLine2">Address Line 2</Label>
                      <Input
                        id="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Landmark, Area (Optional)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="Pincode"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Address Type</Label>
                      <RadioGroup
                        value={formData.addressType}
                        onValueChange={(value) => handleRadioChange("addressType", value)}
                        className="flex gap-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="home" id="home" />
                          <Label htmlFor="home">Home</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="office" id="office" />
                          <Label htmlFor="office">Office</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saveAddress"
                        checked={formData.saveAddress}
                        onCheckedChange={(checked) => setFormData({ ...formData, saveAddress: checked as boolean })}
                      />
                      <Label htmlFor="saveAddress">Save this address for future orders</Label>
                    </div>

                    <Button type="button" onClick={handleNextStep} className="w-full">
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Delivery Options
                        {loadingShipping && <span className="text-sm font-normal text-gray-500">(Loading rates...)</span>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {shippingRates.length > 0 ? (
                        <RadioGroup 
                          value={selectedShippingRate?.courier_name || ''} 
                          onValueChange={(value) => {
                            const rate = shippingRates.find(r => r.courier_name === value)
                            setSelectedShippingRate(rate)
                          }}
                          className="space-y-4"
                        >
                          {shippingRates.map((rate) => (
                            <div key={rate.courier_name} className="flex items-center space-x-3 p-4 border rounded-lg">
                              <RadioGroupItem value={rate.courier_name} id={rate.courier_name} />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <Label htmlFor={rate.courier_name} className="font-medium">
                                    {rate.courier_name}
                                  </Label>
                                  <span className="font-bold">₹{rate.rate}</span>
                                </div>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {rate.estimated_delivery_days} days delivery
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : formData.pincode && formData.pincode.length === 6 && !loadingShipping ? (
                        <div className="text-center py-4 text-gray-500">
                          <Truck className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p>No shipping options available for {formData.pincode}</p>
                          <p className="text-sm">Please contact support for assistance</p>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <Truck className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p>Enter your pincode above to see shipping options</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleRadioChange("paymentMethod", value)}
                        className="space-y-4"
                      >
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{method.icon}</span>
                                <Label htmlFor={method.id} className="font-medium">
                                  {method.name}
                                </Label>
                                {method.popular && (
                                  <Badge variant="secondary" className="text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  {/* Coupon Code Section (moved to step 2 for visibility) */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Apply Coupon
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          disabled={couponLoading}
                        />
                        <Button onClick={handleApplyCoupon} variant="outline" disabled={couponLoading}>
                          {couponLoading ? "Applying..." : "Apply"}
                        </Button>
                      </div>
                      {appliedCoupon && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 text-sm font-medium">
                            {appliedCoupon.code} applied! You saved ₹{appliedCoupon.discountAmount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      <div className="mt-3 text-xs text-gray-600">
                        <p>Available coupons: SAVE10, FIRST20 (for testing)</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={handlePrevStep} className="flex-1 bg-transparent">
                      Back to Shipping
                    </Button>
                    <Button type="button" onClick={handleNextStep} className="flex-1">
                      Review Order
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Review Your Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Shipping Address Review */}
                      <div>
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium">{formData.fullName}</p>
                          <p>{formData.addressLine1}</p>
                          {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                          <p>
                            {formData.city}, {formData.state} {formData.pincode}
                          </p>
                          <p className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {formData.phone}
                          </p>
                        </div>
                      </div>

                      {/* Payment Method Review */}
                      <div>
                        <h3 className="font-semibold mb-2">Payment Method</h3>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p>{paymentMethods.find((m) => m.id === formData.paymentMethod)?.name}</p>
                        </div>
                      </div>

                      {/* Order Summary Review */}
                      <div>
                        <h3 className="font-semibold mb-2">Order Summary</h3>
                        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                          {/* Order Items */}
                          <div className="space-y-3">
                            {items.map((item) => {
                              const product = products[item.productId]
                              if (!product) return null
                              return (
                                <div key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`} className="flex gap-3">
                                  <div className="relative w-12 h-12 flex-shrink-0">
                                    <Image
                                      src={product.images[0] || "/placeholder.svg"}
                                      alt={product.name}
                                      fill
                                      className="object-cover rounded"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm">{product.name}</h4>
                                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                      <p className="text-gray-500 text-xs">
                                        {Object.entries(item.selectedOptions)
                                          .map(([key, value]) => `${key}: ${value}`)
                                          .join(", ")}
                                      </p>
                                    )}
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600 text-sm">Qty: {item.quantity}</span>
                                      <span className="font-medium">₹{(product.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          <Separator />

                          {/* Price Breakdown */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            {appliedCoupon && (
                              <div className="flex justify-between text-green-600">
                                <span>Coupon discount ({appliedCoupon.code})</span>
                                <span>-₹{couponDiscount.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Delivery Fee {selectedShippingRate ? `(${selectedShippingRate.courier_name})` : ''}</span>
                              <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                              <span>Total</span>
                              <span>₹{total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div>
                        <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                        <Textarea
                          id="specialInstructions"
                          value={formData.specialInstructions}
                          onChange={handleInputChange}
                          placeholder="Any special delivery instructions..."
                          rows={3}
                        />
                      </div>

                      {/* Terms Agreement */}
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                        />
                        <Label htmlFor="agreeTerms" className="text-sm">
                          I agree to the{" "}
                          <a href="/terms" className="text-blue-600 hover:underline">
                            Terms & Conditions
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={handlePrevStep} className="flex-1 bg-transparent">
                      Back to Payment
                    </Button>
                    <Button type="button" onClick={handlePlaceOrder} className="flex-1" disabled={placing}>
                      {placing ? "Placing Order..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const product = products[item.productId]
                    if (!product) return null
                    return (
                      <div key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`} className="flex gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                            <p className="text-gray-500 text-xs">
                              {Object.entries(item.selectedOptions)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                            </p>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Qty: {item.quantity}</span>
                            <span className="font-medium">₹{(product.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon discount ({appliedCoupon.code})</span>
                      <span>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee {selectedShippingRate ? `(${selectedShippingRate.courier_name})` : ''}</span>
                    <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>SSL Secured Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>7-day Return Policy</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-purple-600" />
                    <span>Free Delivery Above ₹499</span>
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
