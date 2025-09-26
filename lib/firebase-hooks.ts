"use client"

import { useState, useEffect } from "react"
import {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getFeaturedCategories,
  getBrands,
  getFeaturedBrands,
  getProductsByCategory,
  getProductsByBrand,
  getmobileCollection,
  getMobileCollectionItems,
  getMobileCollectionByCategory,
  getAllMobileCollectionItems,
  getMobileCollectionByBrand,
  addQuotation,
  type QuotationData,
  addJoinUsRequest,
  type JoinUsData,
  addContactMessage,
  type ContactData
} from "./firebase-collections"
import type { Product, Category, Brand } from "@/types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getFeaturedProducts()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch featured products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

export function useFeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await getFeaturedCategories()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch featured categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        const data = await getBrands()
        setBrands(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch brands")
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  return { brands, loading, error }
}

export function useFeaturedBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        const data = await getFeaturedBrands()
        setBrands(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch featured brands")
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  return { brands, loading, error }
}

export function useProductsByCategory(categorySlug: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getProductsByCategory(categorySlug)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    if (categorySlug) {
      fetchProducts()
    }
  }, [categorySlug])

  return { products, loading, error }
}

export function useProductsByBrand(brandSlug: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getProductsByBrand(brandSlug)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    if (brandSlug) {
      fetchProducts()
    }
  }, [brandSlug])

  return { products, loading, error }
}

export default function useMobileCollection(id: string) {
  const [mobile, setMobile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMobile = async () => {
      try {
        console.log('useMobileCollection - Starting fetch for ID:', id)
        
        // Reset state for new fetch
        setError(null)
        setLoading(true)
        setMobile(null)
        
        // Validate ID
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
          throw new Error('Invalid product ID provided')
        }
        
        const data = await getmobileCollection(id)
        console.log('useMobileCollection - Received data:', data)
        
        if (data) {
          setMobile(data)
          console.log('useMobileCollection - Mobile set successfully, total fields:', Object.keys(data).length)
        } else {
          console.log('useMobileCollection - No data returned from getmobileCollection')
          setError('Product not found in database')
        }
      } catch (err) {
        console.error('useMobileCollection - Error:', err)
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch mobile data"
        setError(errorMessage)
        setMobile(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      console.log('useMobileCollection - ID provided, fetching:', id)
      fetchMobile()
    } else {
      console.log('useMobileCollection - No ID provided')
      setLoading(false)
      setError('No product ID provided')
    }
  }, [id])

  // Add a retry function
  const retry = () => {
    if (id) {
      console.log('useMobileCollection - Retrying fetch for ID:', id)
      setError(null)
      setLoading(true)
      setMobile(null)
      // The useEffect will trigger the fetch
    }
  }

  return { mobile, loading, error, retry }
}

export function useMobileCollectionItems(limitCount: number = 6) {
  const [mobiles, setMobiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        setLoading(true)
        const data = await getMobileCollectionItems(limitCount)
        setMobiles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch mobile items")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMobiles()
  }, [limitCount])

  return { mobiles, loading, error }
}

export function useMobileCollectionByCategory(category: string) {
  const [mobiles, setMobiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        setLoading(true)
        const data = await getMobileCollectionByCategory(category)
        setMobiles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch mobile items by category")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchMobiles()
    }
  }, [category])

  return { mobiles, loading, error }
}

export function useMobileCollectionByBrand(brandSlug: string) {
  const [mobiles, setMobiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        setLoading(true)
        const data = await getMobileCollectionByBrand(brandSlug)
        console.log(`useMobileCollectionByBrand - Brand: ${brandSlug}, Found: ${data.length} items`)
        setMobiles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch mobile items by brand")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (brandSlug) {
      fetchMobiles()
    }
  }, [brandSlug])

  return { mobiles, loading, error }
}

export function useAllMobileCollectionItems() {
  const [mobiles, setMobiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllMobiles = async () => {
      try {
        setLoading(true)
        const data = await getAllMobileCollectionItems()
        setMobiles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch all mobile items")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllMobiles()
  }, [])

  return { mobiles, loading, error }
}

// Custom hook for quotation submission
export function useQuotationSubmission() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submitQuotation = async (quotationData: Omit<QuotationData, 'createdAt' | 'status'>) => {
    try {
      setSubmitting(true)
      setError(null)
      setSuccess(false)
      
      console.log('useQuotationSubmission - Submitting quotation:', quotationData)
      
      // Validate required fields
      if (!quotationData.company || !quotationData.fullName || !quotationData.email || !quotationData.phone) {
        throw new Error('Please fill in all required fields')
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(quotationData.email)) {
        throw new Error('Please enter a valid email address')
      }
      
      // Validate phone format (basic validation)
      const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/
      if (!phoneRegex.test(quotationData.phone)) {
        throw new Error('Please enter a valid phone number')
      }
      
      const result = await addQuotation(quotationData)
      console.log('useQuotationSubmission - Quotation submitted successfully:', result)
      
      setSuccess(true)
      return result
    } catch (err) {
      console.error('useQuotationSubmission - Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit quotation'
      setError(errorMessage)
      throw err
    } finally {
      setSubmitting(false)
    }
  }
  
  const resetState = () => {
    setError(null)
    setSuccess(false)
    setSubmitting(false)
  }

  return {
    submitQuotation,
    submitting,
    error,
    success,
    resetState
  }
}

// Custom hook for join us submission
export function useJoinUsSubmission() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submitJoinUsRequest = async (joinUsData: Omit<JoinUsData, 'createdAt' | 'status'>) => {
    try {
      setSubmitting(true)
      setError(null)
      setSuccess(false)
      
      console.log('useJoinUsSubmission - Submitting join us request:', joinUsData)
      
      // Validate required fields
      if (!joinUsData.name || !joinUsData.email) {
        throw new Error('Please fill in all required fields')
      }
      
      // Validate name length
      if (joinUsData.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long')
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(joinUsData.email)) {
        throw new Error('Please enter a valid email address')
      }
      
      // Validate message length if provided
      if (joinUsData.message && joinUsData.message.trim().length > 1000) {
        throw new Error('Message must be less than 1000 characters')
      }
      
      const result = await addJoinUsRequest(joinUsData)
      console.log('useJoinUsSubmission - Join us request submitted successfully:', result)
      
      setSuccess(true)
      return result
    } catch (err) {
      console.error('useJoinUsSubmission - Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit join us request'
      setError(errorMessage)
      throw err
    } finally {
      setSubmitting(false)
    }
  }
  
  const resetState = () => {
    setError(null)
    setSuccess(false)
    setSubmitting(false)
  }

  return {
    submitJoinUsRequest,
    submitting,
    error,
    success,
    resetState
  }
}

// Custom hook for contact form submission
export function useContactSubmission() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submitContactMessage = async (contactData: Omit<ContactData, 'createdAt' | 'status'>) => {
    try {
      setSubmitting(true)
      setError(null)
      setSuccess(false)
      
      console.log('useContactSubmission - Submitting contact message:', contactData)
      
      // Validate required fields
      if (!contactData.name || !contactData.email || !contactData.message) {
        throw new Error('Please fill in all required fields')
      }
      
      // Validate name length
      if (contactData.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long')
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(contactData.email)) {
        throw new Error('Please enter a valid email address')
      }
      
      // Validate phone format if provided
      if (contactData.phone && contactData.phone.trim().length > 0) {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/
        if (!phoneRegex.test(contactData.phone)) {
          throw new Error('Please enter a valid phone number')
        }
      }
      
      // Validate message length
      if (contactData.message.trim().length < 10) {
        throw new Error('Message must be at least 10 characters long')
      }
      
      if (contactData.message.trim().length > 1000) {
        throw new Error('Message must be less than 1000 characters')
      }
      
      const result = await addContactMessage(contactData)
      console.log('useContactSubmission - Contact message submitted successfully:', result)
      
      setSuccess(true)
      return result
    } catch (err) {
      console.error('useContactSubmission - Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit contact message'
      setError(errorMessage)
      throw err
    } finally {
      setSubmitting(false)
    }
  }
  
  const resetState = () => {
    setError(null)
    setSuccess(false)
    setSubmitting(false)
  }

  return {
    submitContactMessage,
    submitting,
    error,
    success,
    resetState
  }
}