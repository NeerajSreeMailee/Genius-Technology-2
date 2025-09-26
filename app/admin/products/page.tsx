"use client"

import type React from "react"

import { redirect } from "next/navigation"

import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash, Search, XCircle } from "lucide-react"
import type { Product } from "@/types"
import { uploadImage, deleteImage } from "@/actions/image-upload" // Import image upload actions
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function AdminProductsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    images: [] as string[],
    videoUrl: "", // Added videoUrl
    category: "",
    brand: "",
    originalPrice: 0,
    specifications: {} as Record<string, string>,
    options: {} as Record<string, string[]>, // Added options
    rating: 0,
    reviews: 0,
    featured: false,
    trending: false,
    minStockThreshold: 10, // Added minStockThreshold with a default
  })
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && (!user || (user as any).role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === "admin") {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "products")
      const productsSnapshot = await getDocs(query(productsCollection, orderBy("name")))
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(), // Convert Firestore Timestamp to Date
        updatedAt: doc.data().updatedAt?.toDate(), // Convert Firestore Timestamp to Date
      })) as Product[]
      setProducts(productsData)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products.",
        variant: "destructive",
      })
    }
  }

  const handleAddProduct = async () => {
    try {
      await addDoc(collection(db, "products"), {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        originalPrice: Number(form.originalPrice),
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        minStockThreshold: Number(form.minStockThreshold),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      setIsModalOpen(false)
      resetForm()
      fetchProducts()
      toast({
        title: "Success",
        description: "Product added successfully.",
      })
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "Failed to add product.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProduct = async () => {
    if (!currentProduct?.id) return
    try {
      const productRef = doc(db, "products", currentProduct.id)
      await updateDoc(productRef, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        originalPrice: Number(form.originalPrice),
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        minStockThreshold: Number(form.minStockThreshold),
        updatedAt: new Date(),
      })
      setIsModalOpen(false)
      resetForm()
      fetchProducts()
      toast({
        title: "Success",
        description: "Product updated successfully.",
      })
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (id: string, imageUrls: string[]) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Delete images from storage first
        for (const url of imageUrls) {
          await deleteImage(url)
        }
        await deleteDoc(doc(db, "products", id))
        fetchProducts()
        toast({
          title: "Success",
          description: "Product deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: "Failed to delete product.",
          variant: "destructive",
        })
      }
    }
  }

  const openEditModal = (product: Product) => {
    setCurrentProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images || [],
      videoUrl: product.videoUrl || "",
      category: product.category,
      brand: product.brand,
      originalPrice: product.originalPrice || 0,
      specifications: product.specifications || {},
      options: product.options || {},
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      featured: product.featured || false,
      trending: product.trending || false,
      minStockThreshold: product.minStockThreshold || 10,
    })
    setIsModalOpen(true)
  }

  const openAddModal = () => {
    setCurrentProduct(null)
    resetForm()
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      images: [],
      videoUrl: "",
      category: "",
      brand: "",
      originalPrice: 0,
      specifications: {},
      options: {},
      rating: 0,
      reviews: 0,
      featured: false,
      trending: false,
      minStockThreshold: 10,
    })
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadImage(formData)
    if (result.success && result.url) {
      setForm((prevForm) => ({
        ...prevForm,
        images: [...prevForm.images, result.url!],
      }))
      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to upload image.",
        variant: "destructive",
      })
    }
    setIsUploading(false)
    event.target.value = "" // Clear the input
  }

  const handleRemoveImage = async (imageUrl: string) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      try {
        await deleteImage(imageUrl)
        setForm((prevForm) => ({
          ...prevForm,
          images: prevForm.images.filter((url) => url !== imageUrl),
        }))
        toast({
          title: "Success",
          description: "Image removed successfully.",
        })
      } catch (error) {
        console.error("Error removing image:", error)
        toast({
          title: "Error",
          description: "Failed to remove image.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSpecificationChange = (key: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      specifications: {
        ...prevForm.specifications,
        [key]: value,
      },
    }))
  }

  const handleAddSpecificationField = () => {
    setForm((prevForm) => ({
      ...prevForm,
      specifications: {
        ...prevForm.specifications,
        [`New Spec ${Object.keys(prevForm.specifications).length + 1}`]: "",
      },
    }))
  }

  const handleRemoveSpecificationField = (keyToRemove: string) => {
    setForm((prevForm) => {
      const newSpecs = { ...prevForm.specifications }
      delete newSpecs[keyToRemove]
      return {
        ...prevForm,
        specifications: newSpecs,
      }
    })
  }

  const handleOptionTypeChange = (oldType: string, newType: string) => {
    setForm((prevForm) => {
      const newOptions = { ...prevForm.options }
      if (oldType !== newType) {
        newOptions[newType] = newOptions[oldType]
        delete newOptions[oldType]
      }
      return { ...prevForm, options: newOptions }
    })
  }

  const handleOptionValuesChange = (optionType: string, values: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      options: {
        ...prevForm.options,
        [optionType]: values.split(",").map((v) => v.trim()),
      },
    }))
  }

  const handleAddOptionType = () => {
    setForm((prevForm) => ({
      ...prevForm,
      options: {
        ...prevForm.options,
        [`option${Object.keys(prevForm.options).length + 1}`]: [],
      },
    }))
  }

  const handleRemoveOptionType = (optionTypeToRemove: string) => {
    setForm((prevForm) => {
      const newOptions = { ...prevForm.options }
      delete newOptions[optionTypeToRemove]
      return {
        ...prevForm,
        options: newOptions,
      }
    })
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || (user as any).role !== "admin") {
    return null // or redirect to login page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <Button onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                All Products
                <div className="relative w-64">
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>₹{product.price.toLocaleString()}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id, product.images || [])}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{currentProduct ? "Edit Product" : "Add Product"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number.parseFloat(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="originalPrice" className="text-right">
                    Original Price
                  </Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: Number.parseFloat(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number.parseInt(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minStockThreshold" className="text-right">
                    Min Stock Threshold
                  </Label>
                  <Input
                    id="minStockThreshold"
                    type="number"
                    value={form.minStockThreshold}
                    onChange={(e) => setForm({ ...form, minStockThreshold: Number.parseInt(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="brand" className="text-right">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rating" className="text-right">
                    Rating
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number.parseFloat(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>
               
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="featured" className="text-right">
                    Featured
                  </Label>
                  <input
                    id="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="col-span-3 h-4 w-4"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="trending" className="text-right">
                    Trending
                  </Label>
                  <input
                    id="trending"
                    type="checkbox"
                    checked={form.trending}
                    onChange={(e) => setForm({ ...form, trending: e.target.checked })}
                    className="col-span-3 h-4 w-4"
                  />
                </div>

                {/* Image Upload Section */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="imageUpload" className="text-right pt-2">
                    Images
                  </Label>
                  <div className="col-span-3 flex flex-col gap-2">
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="col-span-3"
                    />
                    {isUploading && <p className="text-sm text-gray-500">Uploading image...</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.images.map((imageUrl, index) => (
                        <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={`Product Image ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-0 right-0 h-6 w-6 rounded-full p-0"
                            onClick={() => handleRemoveImage(imageUrl)}
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Remove image</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Video URL Section */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="videoUrl" className="text-right">
                    Video URL
                  </Label>
                  <Input
                    id="videoUrl"
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    placeholder="e.g., https://www.youtube.com/watch?v=..."
                    className="col-span-3"
                  />
                </div>

                {/* Specifications Section */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Specifications</Label>
                  <div className="col-span-3 flex flex-col gap-2">
                    {Object.entries(form.specifications).map(([key, value], index) => (
                      <div key={key} className="flex gap-2 items-center">
                        <Input
                          placeholder="Key"
                          value={key}
                          onChange={(e) => {
                            const newKey = e.target.value
                            setForm((prevForm) => {
                              const newSpecs = { ...prevForm.specifications }
                              if (key !== newKey) {
                                newSpecs[newKey] = newSpecs[key]
                                delete newSpecs[key]
                              }
                              return { ...prevForm, specifications: newSpecs }
                            })
                          }}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value"
                          value={value as string}
                          onChange={(e) => handleSpecificationChange(key, e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="destructive" size="icon" onClick={() => handleRemoveSpecificationField(key)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={handleAddSpecificationField}>
                      Add Specification
                    </Button>
                  </div>
                </div>

                {/* Options Section */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Options</Label>
                  <div className="col-span-3 flex flex-col gap-2">
                    {Object.entries(form.options).map(([optionType, optionValues]) => (
                      <div key={optionType} className="flex flex-col gap-2 border p-3 rounded-md">
                        <div className="flex gap-2 items-center">
                          <Input
                            placeholder="Option Type (e.g., color, size)"
                            value={optionType}
                            onChange={(e) => handleOptionTypeChange(optionType, e.target.value)}
                            className="flex-1"
                          />
                          <Button variant="destructive" size="icon" onClick={() => handleRemoveOptionType(optionType)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Values (comma-separated, e.g., Red, Blue, Green)"
                          value={optionValues.join(", ")}
                          onChange={(e) => handleOptionValuesChange(optionType, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                    <Button variant="outline" onClick={handleAddOptionType}>
                      Add Option Type
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={currentProduct ? handleUpdateProduct : handleAddProduct} disabled={isUploading}>
                  {currentProduct ? "Save Changes" : "Add Product"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}