"use client"

import { useState } from "react"
import type { Product } from "@/types"
import { useCart } from "@/contexts/cart-context"
import { useComparison } from "@/contexts/comparison-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, Minus, Plus, Truck, RotateCcw, Shield, CreditCard, GitCompare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initialOptions: Record<string, string> = {}
    if (product.options) {
      for (const optionType in product.options) {
        if (product.options[optionType].length > 0) {
          initialOptions[optionType] = product.options[optionType][0] // Select first option by default
        }
      }
    }
    return initialOptions
  })
  const [pincode, setPincode] = useState("")
  const { addToCart } = useCart()
  const { addToComparison, isInComparison } = useComparison()
  const { toast } = useToast()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    addToCart(product.id, quantity, product.price, selectedOptions)
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    })
  }

  const handleBuyNow = () => {
    addToCart(product.id, quantity, product.price, selectedOptions)
    // Redirect to checkout
    window.location.href = "/checkout"
  }

  const handleAddToCompare = () => {
    addToComparison(product)
  }

  const handleOptionChange = (optionType: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionType]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Product Title & Brand */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="font-medium">{product.brand}</span>
          <span>SKU: {product.id.slice(-8).toUpperCase()}</span>
        </div>
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
          ))}
          <span className="font-medium">{product.rating}</span>
        </div>
        <span className="text-blue-600">({product.reviews} Reviews)</span>
        <Button variant="link" className="p-0 h-auto text-blue-600">
          Ask a Question
        </Button>
      </div>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-green-600">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <>
              <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              <Badge className="bg-red-600">{discount}% OFF</Badge>
            </>
          )}
        </div>
        <p className="text-sm text-gray-600">EMI from ₹{Math.round(product.price / 12)}/month</p>
        <div className="flex space-x-2">
          <Badge variant="outline">Price Drop Alert</Badge>
          <Badge variant="outline">Best Price Guarantee</Badge>
        </div>
      </div>

      {/* Variants */}
      {product.options && Object.keys(product.options).length > 0 && (
        <div className="space-y-4">
          {Object.entries(product.options).map(([optionType, optionValues]) => (
            <div key={optionType}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {optionType.charAt(0).toUpperCase() + optionType.slice(1)}
              </label>
              <Select
                value={selectedOptions[optionType] || ""}
                onValueChange={(value) => handleOptionChange(optionType, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${optionType}`} />
                </SelectTrigger>
                <SelectContent>
                  {optionValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">In Stock: {product.stock} items</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex space-x-3">
          <Button className="flex-1 bg-orange-600 hover:bg-orange-700" size="lg" onClick={handleAddToCart}>
            ADD TO CART
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleBuyNow}>
            BUY NOW
          </Button>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1 bg-transparent">
            <Heart className="h-4 w-4 mr-2" />
            ADD TO WISHLIST
          </Button>
          <Button
            variant="outline"
            className={`flex-1 bg-transparent ${isInComparison(product.id) ? "bg-gray-100 text-gray-700" : ""}`}
            onClick={handleAddToCompare}
            disabled={isInComparison(product.id)}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            {isInComparison(product.id) ? "ADDED TO COMPARE" : "ADD TO COMPARE"}
          </Button>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-medium">Delivery Information</h3>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline">Check</Button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4 text-green-600" />
            <span>Free Delivery by Tomorrow</span>
          </div>
          <div className="flex items-center space-x-2">
            <RotateCcw className="h-4 w-4 text-blue-600" />
            <span>7-day Return Policy</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-purple-600" />
            <span>1 Year Warranty</span>
          </div>
        </div>
      </div>

      {/* Offers & Deals */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-medium">Offers & Deals</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span>Bank Offers: 10% off with HDFC cards</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-green-600 rounded text-white text-xs flex items-center justify-center">%</span>
            <span>Bundle Deals: Buy 2 Get 1 Free</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-orange-600 rounded text-white text-xs flex items-center justify-center">₹</span>
            <span>Cashback: ₹50 cashback on first order</span>
          </div>
        </div>
      </div>

      {/* Product Highlights */}
      <div className="space-y-3">
        <h3 className="font-medium">Product Highlights</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span>Premium build quality</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span>Fast charging technology</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span>Wireless connectivity</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span>Long battery life</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span>Universal compatibility</span>
          </li>
        </ul>
      </div>

      {/* What's in the Box */}
      <div className="space-y-3">
        <h3 className="font-medium">What's in the Box</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• Charging Cable</li>
          <li>• User Manual</li>
          <li>• Warranty Card</li>
          <li>• Carry Pouch</li>
        </ul>
      </div>
    </div>
  )
}
