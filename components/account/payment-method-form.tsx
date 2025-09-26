"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PaymentMethod } from "@/types"

interface PaymentMethodFormProps {
  paymentMethod: PaymentMethod | null
  onSave: (data: PaymentMethod) => void
  onCancel: () => void
  isSaving: boolean
}

export function PaymentMethodForm({ paymentMethod, onSave, onCancel, isSaving }: PaymentMethodFormProps) {
  const [formData, setFormData] = useState<Omit<PaymentMethod, "id" | "createdAt">>(
    paymentMethod || {
      cardType: "Visa",
      last4: "",
      expiryMonth: "",
      expiryYear: "",
      cardHolderName: "",
      isDefault: false,
    },
  )

  useEffect(() => {
    if (paymentMethod) {
      setFormData(paymentMethod)
    }
  }, [paymentMethod])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (id: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...formData, createdAt: paymentMethod?.createdAt || new Date() })
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear + i))
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cardHolderName">Cardholder Name</Label>
        <Input
          id="cardHolderName"
          value={formData.cardHolderName}
          onChange={handleChange}
          required
          placeholder="John Doe"
        />
      </div>
      <div>
        <Label htmlFor="cardType">Card Type</Label>
        <Select
          value={formData.cardType}
          onValueChange={(value) => handleSelectChange("cardType", value as PaymentMethod["cardType"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select card type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Visa">Visa</SelectItem>
            <SelectItem value="Mastercard">Mastercard</SelectItem>
            <SelectItem value="Amex">American Express</SelectItem>
            <SelectItem value="Discover">Discover</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="last4">Last 4 Digits</Label>
        <Input
          id="last4"
          value={formData.last4}
          onChange={handleChange}
          maxLength={4}
          pattern="\d{4}"
          required
          placeholder="XXXX"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryMonth">Expiry Month</Label>
          <Select value={formData.expiryMonth} onValueChange={(value) => handleSelectChange("expiryMonth", value)}>
            <SelectTrigger>
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="expiryYear">Expiry Year</Label>
          <Select value={formData.expiryYear} onValueChange={(value) => handleSelectChange("expiryYear", value)}>
            <SelectTrigger>
              <SelectValue placeholder="YYYY" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <Label htmlFor="isDefault">Set as default payment method</Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Payment Method"}
        </Button>
      </div>
    </form>
  )
}
