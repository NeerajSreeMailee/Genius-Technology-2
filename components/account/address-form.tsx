"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { Address } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface AddressFormProps {
  address?: Address | null
  onSave: (address: Address) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}

export function AddressForm({ address, onSave, onCancel, isSaving }: AddressFormProps) {
  const [formData, setFormData] = useState<Address>({
    type: "home",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
    ...(address || {}), // Pre-fill if editing
  })
  const { toast } = useToast()

  useEffect(() => {
    if (address) {
      setFormData(address)
    } else {
      setFormData({
        type: "home",
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      })
    }
  }, [address])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [id]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required address fields.",
        variant: "destructive",
      })
      return
    }
    await onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" value={formData.phone} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input id="addressLine1" value={formData.addressLine1} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
        <Input id="addressLine2" value={formData.addressLine2} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" value={formData.state} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <Input id="pincode" value={formData.pincode} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="type">Address Type</Label>
        <select
          id="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="home">Home</option>
          <option value="office">Office</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDefault: !!checked }))}
        />
        <Label htmlFor="isDefault">Set as default address</Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  )
}
