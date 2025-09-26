"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { Coupon } from "@/types"

interface CouponFormProps {
  coupon?: Coupon | null
  onSave: (couponData: Omit<Coupon, "id" | "createdAt" | "updatedAt" | "usedCount">) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}

export function CouponForm({ coupon, onSave, onCancel, isSaving }: CouponFormProps) {
  const [formData, setFormData] = useState<Omit<Coupon, "id" | "createdAt" | "updatedAt" | "usedCount">>({
    code: "",
    type: "percentage",
    value: 0,
    minOrderAmount: undefined,
    maxDiscountAmount: undefined,
    appliesTo: "all",
    appliesToId: undefined,
    usageLimit: undefined,
    expiryDate: undefined,
    isActive: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        appliesTo: coupon.appliesTo,
        appliesToId: coupon.appliesToId,
        usageLimit: coupon.usageLimit,
        expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split("T")[0] : undefined, // Format for input type="date"
        isActive: coupon.isActive,
      })
    } else {
      setFormData({
        code: "",
        type: "percentage",
        value: 0,
        minOrderAmount: undefined,
        maxDiscountAmount: undefined,
        appliesTo: "all",
        appliesToId: undefined,
        usageLimit: undefined,
        expiryDate: undefined,
        isActive: true,
      })
    }
  }, [coupon])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (id: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSave(formData)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save coupon: ${(error as Error).message}`,
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="code">Coupon Code</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={handleChange}
          required
          placeholder="e.g., SUMMER20"
          disabled={!!coupon} // Disable editing code for existing coupons
        />
      </div>

      <div>
        <Label htmlFor="type">Discount Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "percentage" | "fixed") => handleSelectChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select discount type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage (%)</SelectItem>
            <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="value">Discount Value</Label>
        <Input
          id="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          required
          min={0}
          placeholder={formData.type === "percentage" ? "e.g., 10 (for 10%)" : "e.g., 500 (for ₹500)"}
        />
      </div>

      <div>
        <Label htmlFor="minOrderAmount">Minimum Order Amount (Optional)</Label>
        <Input
          id="minOrderAmount"
          type="number"
          value={formData.minOrderAmount || ""}
          onChange={handleChange}
          min={0}
          placeholder="e.g., 1000"
        />
      </div>

      {formData.type === "percentage" && (
        <div>
          <Label htmlFor="maxDiscountAmount">Maximum Discount Amount (Optional)</Label>
          <Input
            id="maxDiscountAmount"
            type="number"
            value={formData.maxDiscountAmount || ""}
            onChange={handleChange}
            min={0}
            placeholder="e.g., 500"
          />
        </div>
      )}

      <div>
        <Label htmlFor="appliesTo">Applies To</Label>
        <Select
          value={formData.appliesTo}
          onValueChange={(value: "all" | "category" | "product") => handleSelectChange("appliesTo", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select where coupon applies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="category">Specific Category</SelectItem>
            <SelectItem value="product">Specific Product</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(formData.appliesTo === "category" || formData.appliesTo === "product") && (
        <div>
          <Label htmlFor="appliesToId">{formData.appliesTo === "category" ? "Category ID" : "Product ID"}</Label>
          <Input
            id="appliesToId"
            value={formData.appliesToId || ""}
            onChange={handleChange}
            placeholder={`Enter ${formData.appliesTo} ID`}
          />
        </div>
      )}

      <div>
        <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
        <Input
          id="usageLimit"
          type="number"
          value={formData.usageLimit || ""}
          onChange={handleChange}
          min={1}
          placeholder="e.g., 100 (total uses)"
        />
      </div>

      <div>
        <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
        <Input id="expiryDate" type="date" value={formData.expiryDate || ""} onChange={handleChange} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: !!checked }))}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Coupon"}
        </Button>
      </div>
    </form>
  )
}
