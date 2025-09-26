"use client"

import { useState } from "react"
import FixedQuantitySelector from "@/components/fixed-quantity-selector"

export default function TestQuantityPage() {
  // Mock product data with different stock levels
  const products = [
    { id: 1, name: "iPhone 14", stock: 5 },
    { id: 2, name: "Samsung Galaxy S23", stock: 10 },
    { id: 3, name: "Google Pixel 7", stock: 3 },
  ]

  // State to track quantities for each product
  const [quantities, setQuantities] = useState<Record<number, number>>({
    1: 1,
    2: 1,
    3: 1,
  })

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }))
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Quantity Selector Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
            <p className="text-gray-600 mb-4">Available stock: {product.stock}</p>
            
            <div className="mb-4">
              <FixedQuantitySelector
                initialQuantity={quantities[product.id]}
                availableQuantity={product.stock}
                onQuantityChange={(quantity) => handleQuantityChange(product.id, quantity)}
              />
            </div>
            
            <p className="text-sm text-gray-500">
              Current selection: {quantities[product.id]}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Selected Quantities:</h2>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.name}: {quantities[product.id]} (of {product.stock} available)
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}