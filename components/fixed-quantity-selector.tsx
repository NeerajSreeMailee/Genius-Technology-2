"use client"

import { useState, useEffect } from "react"

interface FixedQuantitySelectorProps {
  initialQuantity?: number
  availableQuantity: number
  onQuantityChange: (quantity: number) => void
  className?: string
}

export default function FixedQuantitySelector({
  initialQuantity = 1,
  availableQuantity,
  onQuantityChange,
  className = ""
}: FixedQuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  // Update local state when initialQuantity changes
  useEffect(() => {
    setQuantity(initialQuantity)
  }, [initialQuantity])

  // Notify parent component of quantity changes
  useEffect(() => {
    onQuantityChange(quantity)
  }, [quantity, onQuantityChange])

  const increment = () => {
    if (quantity < availableQuantity) {
      setQuantity(prev => prev + 1)
    }
  }

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setQuantity(1)
      return
    }
    
    const numValue = parseInt(value, 10)
    if (isNaN(numValue)) return
    
    // Clamp the value between 1 and availableQuantity
    const clampedValue = Math.max(1, Math.min(availableQuantity, numValue))
    setQuantity(clampedValue)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={decrement}
        disabled={quantity <= 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        value={quantity}
        min={1}
        max={availableQuantity}
        onChange={handleInputChange}
        className="w-16 text-center border rounded py-1"
      />
      <button
        onClick={increment}
        disabled={quantity >= availableQuantity}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}