import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Product, Category, Brand, User, Order } from "@/types"
import { id } from "date-fns/locale"

// Products Collection
export const productsCollection = collection(db, "mobile")

export const getProducts = async () => {
  const snapshot = await getDocs(productsCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[]
}

export const getFeaturedProducts = async () => {
  const q = query(productsCollection, where("featured", "==", true), limit(8))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[]
}

export const getProductsByCategory = async (categorySlug: string) => {
  const q = query(productsCollection, where("category", "==", categorySlug))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[]
}

export const getProductsByBrand = async (brandSlug: string) => {
  const q = query(productsCollection, where("brand", "==", brandSlug))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[]
}

export const getProduct = async (id: string) => {
  const docRef = doc(db, "products", id)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Product
  }
  return null
}

export const addProduct = async (product: Omit<Product, "id">) => {
  return await addDoc(productsCollection, product)
}

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const docRef = doc(db, "products", id)
  return await updateDoc(docRef, product)
}

export const deleteProduct = async (id: string) => {
  const docRef = doc(db, "products", id)
  return await deleteDoc(docRef)
}

//get the mobile collection data with comprehensive error handling and field validation
export const getmobileCollection = async (id: string) => {  
  console.log('getmobileCollection - Fetching mobile with ID:', id)
  
  // Input validation and URL decoding
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    console.error('getmobileCollection - Invalid ID provided:', id)
    throw new Error('Invalid product ID provided')
  }

  // Decode URL-encoded characters (e.g., %20 -> space)
  let decodedId = decodeURIComponent(id.trim())
  console.log('getmobileCollection - Original ID:', id, 'Decoded ID:', decodedId)

  try {
    const docRef = doc(db, "mobile", decodedId)
    console.log('getmobileCollection - Document reference created for collection "mobile" with decoded ID:', decodedId)
    const snapshot = await getDoc(docRef)
    console.log('getmobileCollection - Snapshot exists:', snapshot.exists())
    
    if (snapshot.exists()) {
      const rawData = { id: snapshot.id, ...snapshot.data() } as any
      console.log('getmobileCollection - Raw data:', rawData)
      console.log('getmobileCollection - Available fields:', Object.keys(rawData))
      
      // Validate that we have essential data
      if (!rawData || typeof rawData !== 'object') {
        console.error('getmobileCollection - Invalid document data structure')
        throw new Error('Invalid document data structure')
      }
      
      // Keep ALL original fields and add transformed versions
      // This ensures no data is lost and all fields are available
      const transformedData = {
        // Keep all original data first to preserve everything
        ...rawData,
        
        // Add standardized field mappings for consistent access
        name: rawData.name || rawData.Name || rawData.title || rawData.Title || rawData.productName || rawData.ProductName || rawData.id || 'Unnamed Product',
        description: rawData.description || rawData.Description || rawData.details || rawData.Details || rawData.desc || rawData.Desc || rawData.summary || rawData.Summary || rawData.overview || rawData.Overview || '',
        
        // Price handling with multiple fallbacks
        price: (() => {
          const priceValue = rawData.price || rawData.Price || rawData.salePrice || rawData.SalePrice || rawData.currentPrice || rawData.CurrentPrice || rawData.sellingPrice || rawData.SellingPrice || 0
          return Number(priceValue) || 0
        })(),
        
        originalPrice: (() => {
          const originalValue = rawData.originalPrice || rawData.OriginalPrice || rawData.mrp || rawData.MRP || rawData.listPrice || rawData.ListPrice || rawData.regularPrice || rawData.RegularPrice || 0
          return Number(originalValue) || 0
        })(),
        
        // Enhanced image handling with comprehensive fallbacks
        images: (() => {
          // Handle various image field combinations
          const imageFields = [
            rawData.images, rawData.Images, rawData.imageUrls, rawData.ImageUrls,
            rawData.photos, rawData.Photos, rawData.gallery, rawData.Gallery,
            rawData.productImages, rawData.ProductImages
          ].filter(Boolean)
          
          if (imageFields.length > 0) {
            const firstImageField = imageFields[0]
            if (Array.isArray(firstImageField)) {
              // Filter out empty/invalid URLs
              return firstImageField.filter(img => img && typeof img === 'string' && img.trim().length > 0)
            } else if (typeof firstImageField === 'string' && firstImageField.trim().length > 0) {
              return [firstImageField]
            }
          }
          
          // Single image fields
          const singleImage = rawData.image || rawData.Image || rawData.photo || rawData.Photo || rawData.thumbnail || rawData.Thumbnail || rawData.mainImage || rawData.MainImage
          if (singleImage && typeof singleImage === 'string' && singleImage.trim().length > 0) {
            return [singleImage]
          }
          
          return []
        })(),
        
        rating: (() => {
          const ratingValue = rawData.rating || rawData.Rating || rawData.starRating || rawData.StarRating || rawData.averageRating || rawData.AverageRating || 4.0
          const numRating = Number(ratingValue)
          return (numRating >= 0 && numRating <= 5) ? numRating : 4.0
        })(),
        
        reviewCount: (() => {
          const reviewValue = rawData.reviewCount || rawData.ReviewCount || rawData.reviews || rawData.Reviews || rawData.totalReviews || rawData.TotalReviews || rawData.reviewsCount || rawData.ReviewsCount || 0
          return Math.max(0, Number(reviewValue) || 0)
        })(),
        
        brand: rawData.Brand || rawData.brand || rawData.brandName || rawData.BrandName || rawData.manufacturer || rawData.Manufacturer || rawData.make || rawData.Make || '',
        category: rawData.category || rawData.Category || rawData.categoryName || rawData.CategoryName || rawData.type || rawData.Type || rawData.productType || rawData.ProductType || '',
        
        stock: (() => {
          const stockValue = rawData.stock || rawData.Stock || rawData.quantity || rawData.Quantity || rawData.available || rawData.Available || rawData.inStock || rawData.InStock || rawData.inventory || rawData.Inventory || 1
          return Math.max(0, Number(stockValue) || 1)
        })(),
        
        // Enhanced specifications handling
        specifications: (() => {
          const specs = rawData.specifications || rawData.Specifications || rawData.specs || rawData.Specs || rawData.techSpecs || rawData.TechSpecs || rawData.technicalSpecs || rawData.TechnicalSpecs || {}
          if (typeof specs === 'object' && specs !== null && !Array.isArray(specs)) {
            return specs
          }
          return {}
        })(),
        
        // Enhanced features handling
        features: (() => {
          const featureFields = rawData.features || rawData.Features || rawData.keyFeatures || rawData.KeyFeatures || rawData.highlights || rawData.Highlights || rawData.benefits || rawData.Benefits
          if (Array.isArray(featureFields)) {
            return featureFields.filter(feature => feature && typeof feature === 'string' && feature.trim().length > 0)
          } else if (typeof featureFields === 'string' && featureFields.trim().length > 0) {
            // If features is a string, try to split it
            return featureFields.split(/[,;\n]/).map(f => f.trim()).filter(Boolean)
          }
          return []
        })(),
        
        // Additional fields with multiple variations and validation
        model: rawData.model || rawData.Model || rawData.modelNumber || rawData.ModelNumber || rawData.modelName || rawData.ModelName || rawData.variant || rawData.Variant || '',
        sku: rawData.sku || rawData.SKU || rawData.productCode || rawData.ProductCode || rawData.itemCode || rawData.ItemCode || rawData.partNumber || rawData.PartNumber || rawData.id,
        warranty: rawData.warranty || rawData.Warranty || rawData.warrantyInfo || rawData.WarrantyInfo || rawData.guarantee || rawData.Guarantee || rawData.warrantePeriod || rawData.WarrantyPeriod || '',
        weight: rawData.weight || rawData.Weight || rawData.productWeight || rawData.ProductWeight || rawData.netWeight || rawData.NetWeight || '',
        dimensions: rawData.dimensions || rawData.Dimensions || rawData.size || rawData.Size || rawData.measurements || rawData.Measurements || rawData.productSize || rawData.ProductSize || '',
        support: rawData.support || rawData.Support || rawData.customerSupport || rawData.CustomerSupport || rawData.helpInfo || rawData.HelpInfo || rawData.supportInfo || rawData.SupportInfo || '',
        color: rawData.color || rawData.Color || rawData.colours || rawData.Colours || rawData.colorOptions || rawData.ColorOptions || rawData.colorVariant || rawData.ColorVariant || '',
        storage: rawData.storage || rawData.Storage || rawData.storageCapacity || rawData.StorageCapacity || rawData.memory || rawData.Memory || rawData.internalStorage || rawData.InternalStorage || '',
        display: rawData.display || rawData.Display || rawData.screen || rawData.Screen || rawData.displaySize || rawData.DisplaySize || rawData.screenSize || rawData.ScreenSize || '',
        processor: rawData.processor || rawData.Processor || rawData.cpu || rawData.CPU || rawData.chipset || rawData.Chipset || rawData.soc || rawData.SOC || '',
        camera: rawData.camera || rawData.Camera || rawData.cameraSpecs || rawData.CameraSpecs || rawData.cameraInfo || rawData.CameraInfo || '',
        battery: rawData.battery || rawData.Battery || rawData.batteryLife || rawData.BatteryLife || rawData.batteryCapacity || rawData.BatteryCapacity || rawData.batteryInfo || rawData.BatteryInfo || '',
        
        // Additional metadata with proper handling
        isActive: rawData.isActive !== undefined ? rawData.isActive : (rawData.active !== undefined ? rawData.active : (rawData.status === 'active' || rawData.Status === 'active' || true)),
        isFeatured: !!(rawData.isFeatured || rawData.Featured || rawData.featured || rawData.isPopular || rawData.popular || rawData.recommended || rawData.Recommended),
        
        // Date handling with proper conversion
        createdAt: (() => {
          if (rawData.createdAt?.toDate) {
            return rawData.createdAt.toDate()
          } else if (rawData.createdAt instanceof Date) {
            return rawData.createdAt
          } else if (rawData.dateCreated?.toDate) {
            return rawData.dateCreated.toDate()
          } else if (rawData.dateCreated instanceof Date) {
            return rawData.dateCreated
          } else if (rawData.DateCreated?.toDate) {
            return rawData.DateCreated.toDate()
          } else if (rawData.DateCreated instanceof Date) {
            return rawData.DateCreated
          }
          return new Date()
        })(),
        
        updatedAt: (() => {
          if (rawData.updatedAt?.toDate) {
            return rawData.updatedAt.toDate()
          } else if (rawData.updatedAt instanceof Date) {
            return rawData.updatedAt
          } else if (rawData.dateUpdated?.toDate) {
            return rawData.dateUpdated.toDate()
          } else if (rawData.dateUpdated instanceof Date) {
            return rawData.dateUpdated
          } else if (rawData.DateUpdated?.toDate) {
            return rawData.DateUpdated.toDate()
          } else if (rawData.DateUpdated instanceof Date) {
            return rawData.DateUpdated
          }
          return new Date()
        })(),
        
        // Pricing variations with validation
        discount: (() => {
          const discountValue = rawData.discount || rawData.Discount || rawData.discountPercent || rawData.DiscountPercent || rawData.discountPercentage || rawData.DiscountPercentage || 0
          const numDiscount = Number(discountValue)
          return (numDiscount >= 0 && numDiscount <= 100) ? numDiscount : 0
        })(),
        
        salePrice: (() => {
          const salePriceValue = rawData.salePrice || rawData.SalePrice || rawData.discountedPrice || rawData.DiscountedPrice || rawData.finalPrice || rawData.FinalPrice || rawData.price || rawData.Price || 0
          return Number(salePriceValue) || 0
        })(),
        
        // Availability fields
        availability: rawData.availability || rawData.Availability || rawData.stockStatus || rawData.StockStatus || rawData.availabilityStatus || rawData.AvailabilityStatus || (() => {
          const stockQty = Number(rawData.stock || rawData.Stock || 1)
          return stockQty > 0 ? 'In Stock' : 'Out of Stock'
        })(),
        
        deliveryInfo: rawData.deliveryInfo || rawData.DeliveryInfo || rawData.shipping || rawData.Shipping || rawData.shippingInfo || rawData.ShippingInfo || '',
        
        // SEO and content fields
        tags: (() => {
          const tagsField = rawData.tags || rawData.Tags || rawData.keywords || rawData.Keywords || rawData.searchTags || rawData.SearchTags
          if (Array.isArray(tagsField)) {
            return tagsField.filter(tag => tag && typeof tag === 'string' && tag.trim().length > 0)
          } else if (typeof tagsField === 'string' && tagsField.trim().length > 0) {
            return tagsField.split(/[,;\s]/).map(tag => tag.trim()).filter(Boolean)
          }
          return []
        })(),
        
        metaTitle: rawData.metaTitle || rawData.MetaTitle || rawData.seoTitle || rawData.SeoTitle || rawData.pageTitle || rawData.PageTitle || '',
        metaDescription: rawData.metaDescription || rawData.MetaDescription || rawData.seoDescription || rawData.SeoDescription || rawData.pageDescription || rawData.PageDescription || '',
      }
      
      console.log('getmobileCollection - Transformed data with all fields:', transformedData)
      console.log('getmobileCollection - Total fields after transformation:', Object.keys(transformedData).length)
      
      // Final validation
      if (!transformedData.name || transformedData.name === 'Unnamed Product') {
        console.warn('getmobileCollection - Product has no valid name, using ID as fallback')
        transformedData.name = `Product ${id}`
      }
      
      return transformedData
    } else {
      console.log('getmobileCollection - Document does not exist for decoded ID:', decodedId)
      
      // Try alternative ID formats if the decoded version doesn't work
      const alternativeIds = [
        id.trim(), // Original ID without decoding
        id.replace(/%20/g, ' '), // Manual space replacement
        id.replace(/%20/g, '_'), // Try underscore instead of space
        id.replace(/%20/g, '-'), // Try dash instead of space
        decodedId.replace(/\s+/g, '_'), // Replace spaces with underscores
        decodedId.replace(/\s+/g, '-'), // Replace spaces with dashes
        decodedId.toLowerCase(), // Try lowercase
        decodedId.toUpperCase() // Try uppercase
      ].filter((altId, index, array) => array.indexOf(altId) === index) // Remove duplicates
      
      console.log('getmobileCollection - Trying alternative ID formats:', alternativeIds)
      
      for (const altId of alternativeIds) {
        try {
          console.log('getmobileCollection - Trying alternative ID:', altId)
          const altDocRef = doc(db, "mobile", altId)
          const altSnapshot = await getDoc(altDocRef)
          
          if (altSnapshot.exists()) {
            console.log('getmobileCollection - Found document with alternative ID:', altId)
            const rawData = { id: altSnapshot.id, ...altSnapshot.data() } as any
            console.log('getmobileCollection - Raw data from alternative ID:', rawData)
            
            // Continue with the same transformation logic...
            // (The transformation code remains the same)
            
            // Validate that we have essential data
            if (!rawData || typeof rawData !== 'object') {
              console.error('getmobileCollection - Invalid document data structure')
              continue // Try next alternative ID
            }
            
            // Apply the same transformation logic as before
            const transformedData = {
              // Keep all original data first to preserve everything
              ...rawData,
              
              // Add standardized field mappings for consistent access
              name: rawData.name || rawData.Name || rawData.title || rawData.Title || rawData.productName || rawData.ProductName || rawData.id || 'Unnamed Product',
              description: rawData.description || rawData.Description || rawData.details || rawData.Details || rawData.desc || rawData.Desc || rawData.summary || rawData.Summary || rawData.overview || rawData.Overview || '',
              
              // Price handling with multiple fallbacks
              price: (() => {
                const priceValue = rawData.price || rawData.Price || rawData.salePrice || rawData.SalePrice || rawData.currentPrice || rawData.CurrentPrice || rawData.sellingPrice || rawData.SellingPrice || 0
                return Number(priceValue) || 0
              })(),
              
              originalPrice: (() => {
                const originalValue = rawData.originalPrice || rawData.OriginalPrice || rawData.mrp || rawData.MRP || rawData.listPrice || rawData.ListPrice || rawData.regularPrice || rawData.RegularPrice || 0
                return Number(originalValue) || 0
              })(),
              
              // Enhanced image handling with comprehensive fallbacks
              images: (() => {
                // Handle various image field combinations
                const imageFields = [
                  rawData.images, rawData.Images, rawData.imageUrls, rawData.ImageUrls,
                  rawData.photos, rawData.Photos, rawData.gallery, rawData.Gallery,
                  rawData.productImages, rawData.ProductImages
                ].filter(Boolean)
                
                if (imageFields.length > 0) {
                  const firstImageField = imageFields[0]
                  if (Array.isArray(firstImageField)) {
                    // Filter out empty/invalid URLs
                    return firstImageField.filter(img => img && typeof img === 'string' && img.trim().length > 0)
                  } else if (typeof firstImageField === 'string' && firstImageField.trim().length > 0) {
                    return [firstImageField]
                  }
                }
                
                // Single image fields
                const singleImage = rawData.image || rawData.Image || rawData.photo || rawData.Photo || rawData.thumbnail || rawData.Thumbnail || rawData.mainImage || rawData.MainImage
                if (singleImage && typeof singleImage === 'string' && singleImage.trim().length > 0) {
                  return [singleImage]
                }
                
                return []
              })(),
              
              rating: (() => {
                const ratingValue = rawData.rating || rawData.Rating || rawData.starRating || rawData.StarRating || rawData.averageRating || rawData.AverageRating || 4.0
                const numRating = Number(ratingValue)
                return (numRating >= 0 && numRating <= 5) ? numRating : 4.0
              })(),
              
              reviewCount: (() => {
                const reviewValue = rawData.reviewCount || rawData.ReviewCount || rawData.reviews || rawData.Reviews || rawData.totalReviews || rawData.TotalReviews || rawData.reviewsCount || rawData.ReviewsCount || 0
                return Math.max(0, Number(reviewValue) || 0)
              })(),
              
              brand: rawData.Brand || rawData.brand || rawData.brandName || rawData.BrandName || rawData.manufacturer || rawData.Manufacturer || rawData.make || rawData.Make || '',
              category: rawData.category || rawData.Category || rawData.categoryName || rawData.CategoryName || rawData.type || rawData.Type || rawData.productType || rawData.ProductType || '',
              
              stock: (() => {
                const stockValue = rawData.stock || rawData.Stock || rawData.quantity || rawData.Quantity || rawData.available || rawData.Available || rawData.inStock || rawData.InStock || rawData.inventory || rawData.Inventory || 1
                return Math.max(0, Number(stockValue) || 1)
              })(),
              
              // Enhanced specifications handling
              specifications: (() => {
                const specs = rawData.specifications || rawData.Specifications || rawData.specs || rawData.Specs || rawData.techSpecs || rawData.TechSpecs || rawData.technicalSpecs || rawData.TechnicalSpecs || {}
                if (typeof specs === 'object' && specs !== null && !Array.isArray(specs)) {
                  return specs
                }
                return {}
              })(),
              
              // Enhanced features handling
              features: (() => {
                const featureFields = rawData.features || rawData.Features || rawData.keyFeatures || rawData.KeyFeatures || rawData.highlights || rawData.Highlights || rawData.benefits || rawData.Benefits
                if (Array.isArray(featureFields)) {
                  return featureFields.filter(feature => feature && typeof feature === 'string' && feature.trim().length > 0)
                } else if (typeof featureFields === 'string' && featureFields.trim().length > 0) {
                  // If features is a string, try to split it
                  return featureFields.split(/[,;\n]/).map(f => f.trim()).filter(Boolean)
                }
                return []
              })(),
              
              // Additional fields with multiple variations and validation
              model: rawData.model || rawData.Model || rawData.modelNumber || rawData.ModelNumber || rawData.modelName || rawData.ModelName || rawData.variant || rawData.Variant || '',
              sku: rawData.sku || rawData.SKU || rawData.productCode || rawData.ProductCode || rawData.itemCode || rawData.ItemCode || rawData.partNumber || rawData.PartNumber || rawData.id,
              warranty: rawData.warranty || rawData.Warranty || rawData.warrantyInfo || rawData.WarrantyInfo || rawData.guarantee || rawData.Guarantee || rawData.warrantePeriod || rawData.WarrantyPeriod || '',
              weight: rawData.weight || rawData.Weight || rawData.productWeight || rawData.ProductWeight || rawData.netWeight || rawData.NetWeight || '',
              dimensions: rawData.dimensions || rawData.Dimensions || rawData.size || rawData.Size || rawData.measurements || rawData.Measurements || rawData.productSize || rawData.ProductSize || '',
              support: rawData.support || rawData.Support || rawData.customerSupport || rawData.CustomerSupport || rawData.helpInfo || rawData.HelpInfo || rawData.supportInfo || rawData.SupportInfo || '',
              color: rawData.color || rawData.Color || rawData.colours || rawData.Colours || rawData.colorOptions || rawData.ColorOptions || rawData.colorVariant || rawData.ColorVariant || '',
              storage: rawData.storage || rawData.Storage || rawData.storageCapacity || rawData.StorageCapacity || rawData.memory || rawData.Memory || rawData.internalStorage || rawData.InternalStorage || '',
              display: rawData.display || rawData.Display || rawData.screen || rawData.Screen || rawData.displaySize || rawData.DisplaySize || rawData.screenSize || rawData.ScreenSize || '',
              processor: rawData.processor || rawData.Processor || rawData.cpu || rawData.CPU || rawData.chipset || rawData.Chipset || rawData.soc || rawData.SOC || '',
              camera: rawData.camera || rawData.Camera || rawData.cameraSpecs || rawData.CameraSpecs || rawData.cameraInfo || rawData.CameraInfo || '',
              battery: rawData.battery || rawData.Battery || rawData.batteryLife || rawData.BatteryLife || rawData.batteryCapacity || rawData.BatteryCapacity || rawData.batteryInfo || rawData.BatteryInfo || '',
              
              // Additional metadata with proper handling
              isActive: rawData.isActive !== undefined ? rawData.isActive : (rawData.active !== undefined ? rawData.active : (rawData.status === 'active' || rawData.Status === 'active' || true)),
              isFeatured: !!(rawData.isFeatured || rawData.Featured || rawData.featured || rawData.isPopular || rawData.popular || rawData.recommended || rawData.Recommended),
              
              // Date handling with proper conversion
              createdAt: (() => {
                if (rawData.createdAt?.toDate) {
                  return rawData.createdAt.toDate()
                } else if (rawData.createdAt instanceof Date) {
                  return rawData.createdAt
                } else if (rawData.dateCreated?.toDate) {
                  return rawData.dateCreated.toDate()
                } else if (rawData.dateCreated instanceof Date) {
                  return rawData.dateCreated
                } else if (rawData.DateCreated?.toDate) {
                  return rawData.DateCreated.toDate()
                } else if (rawData.DateCreated instanceof Date) {
                  return rawData.DateCreated
                }
                return new Date()
              })(),
              
              updatedAt: (() => {
                if (rawData.updatedAt?.toDate) {
                  return rawData.updatedAt.toDate()
                } else if (rawData.updatedAt instanceof Date) {
                  return rawData.updatedAt
                } else if (rawData.dateUpdated?.toDate) {
                  return rawData.dateUpdated.toDate()
                } else if (rawData.dateUpdated instanceof Date) {
                  return rawData.dateUpdated
                } else if (rawData.DateUpdated?.toDate) {
                  return rawData.DateUpdated.toDate()
                } else if (rawData.DateUpdated instanceof Date) {
                  return rawData.DateUpdated
                }
                return new Date()
              })(),
              
              // Pricing variations with validation
              discount: (() => {
                const discountValue = rawData.discount || rawData.Discount || rawData.discountPercent || rawData.DiscountPercent || rawData.discountPercentage || rawData.DiscountPercentage || 0
                const numDiscount = Number(discountValue)
                return (numDiscount >= 0 && numDiscount <= 100) ? numDiscount : 0
              })(),
              
              salePrice: (() => {
                const salePriceValue = rawData.salePrice || rawData.SalePrice || rawData.discountedPrice || rawData.DiscountedPrice || rawData.finalPrice || rawData.FinalPrice || rawData.price || rawData.Price || 0
                return Number(salePriceValue) || 0
              })(),
              
              // Availability fields
              availability: rawData.availability || rawData.Availability || rawData.stockStatus || rawData.StockStatus || rawData.availabilityStatus || rawData.AvailabilityStatus || (() => {
                const stockQty = Number(rawData.stock || rawData.Stock || 1)
                return stockQty > 0 ? 'In Stock' : 'Out of Stock'
              })(),
              
              deliveryInfo: rawData.deliveryInfo || rawData.DeliveryInfo || rawData.shipping || rawData.Shipping || rawData.shippingInfo || rawData.ShippingInfo || '',
              
              // SEO and content fields
              tags: (() => {
                const tagsField = rawData.tags || rawData.Tags || rawData.keywords || rawData.Keywords || rawData.searchTags || rawData.SearchTags
                if (Array.isArray(tagsField)) {
                  return tagsField.filter(tag => tag && typeof tag === 'string' && tag.trim().length > 0)
                } else if (typeof tagsField === 'string' && tagsField.trim().length > 0) {
                  return tagsField.split(/[,;\s]/).map(tag => tag.trim()).filter(Boolean)
                }
                return []
              })(),
              
              metaTitle: rawData.metaTitle || rawData.MetaTitle || rawData.seoTitle || rawData.SeoTitle || rawData.pageTitle || rawData.PageTitle || '',
              metaDescription: rawData.metaDescription || rawData.MetaDescription || rawData.seoDescription || rawData.SeoDescription || rawData.pageDescription || rawData.PageDescription || '',
            }
            
            console.log('getmobileCollection - Transformed data with all fields (from alternative ID):', transformedData)
            console.log('getmobileCollection - Total fields after transformation:', Object.keys(transformedData).length)
            
            // Final validation
            if (!transformedData.name || transformedData.name === 'Unnamed Product') {
              console.warn('getmobileCollection - Product has no valid name, using alternative ID as fallback')
              transformedData.name = `Product ${altId}`
            }
            
            return transformedData
          }
        } catch (altError) {
          console.log('getmobileCollection - Error with alternative ID', altId, ':', altError)
          continue // Try next alternative
        }
      }
      
      console.log('getmobileCollection - No document found with any ID variation')
      return null
    }
  } catch (error) {
    console.error('getmobileCollection - Error fetching document:', error)
    console.error('getmobileCollection - Original ID:', id)
    console.error('getmobileCollection - Decoded ID:', decodeURIComponent(id.trim()))
    throw new Error(`Failed to fetch mobile data for ID ${id} (decoded: ${decodeURIComponent(id.trim())}): ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

//get multiple mobile collection items for trending deals
export const getMobileCollectionItems = async (limitCount: number = 6) => {
  console.log('getMobileCollectionItems - Fetching trending deals, limit:', limitCount)
  const mobileCollection = collection(db, "mobile")
  
  try {
    // Get all documents first to filter properly
    const allSnapshot = await getDocs(mobileCollection)
    const allDocs = allSnapshot.docs.map((doc) => {
      const data = { id: doc.id, ...doc.data() } as any
      
      // Transform mobile data to ensure proper field mapping
      const transformedData = {
        ...data,
        name: data.name || data.Name || data.title || data.Title || data.id || 'Unnamed Product',
        price: Number(data.price || data.Price || data.salePrice || data.SalePrice || 0),
        originalPrice: Number(data.originalPrice || data.OriginalPrice || data.mrp || data.MRP || 0),
        images: data.images || data.Images || [data.image, data.Image].filter(Boolean) || [],
        rating: Number(data.rating || data.Rating || 4.0),
        reviewCount: Number(data.reviewCount || data.ReviewCount || data.reviews || 0),
        brand: data.Brand || data.brand || '',
        stock: Number(data.stock || data.Stock || 1),
        isActive: data.isActive !== undefined ? data.isActive : true,
        isFeatured: data.isFeatured || data.Featured || false,
      }
      
      return transformedData
    })
    
    // Filter products that are suitable for trending deals
    const validProducts = allDocs.filter(product => {
      return product.price > 0 && // Must have a valid price
             product.stock > 0 && // Must be in stock
             product.isActive !== false && // Must be active
             product.name !== 'Unnamed Product' && // Must have a proper name
             product.images.length > 0 // Must have at least one image
    })
    
    console.log(`getMobileCollectionItems - Found ${validProducts.length} valid products out of ${allDocs.length} total`)
    
    // Sort by featured first, then by rating, then shuffle for variety
    const sortedProducts = validProducts.sort((a, b) => {
      // Featured products first
      if (a.isFeatured && !b.isFeatured) return -1
      if (!a.isFeatured && b.isFeatured) return 1
      
      // Then by rating
      return b.rating - a.rating
    })
    
    // Take the requested limit
    const limitedProducts = sortedProducts.slice(0, limitCount)
    
    console.log(`getMobileCollectionItems - Returning ${limitedProducts.length} products for trending deals`)
    return limitedProducts
    
  } catch (error) {
    console.error('getMobileCollectionItems - Error:', error)
    return []
  }
}

//get mobile collection items by category with improved filtering
export const getMobileCollectionByCategory = async (category: string) => {
  console.log('getMobileCollectionByCategory - Searching for category:', category)
  const mobileCollection = collection(db, "mobile")
  // Use capital C for Category field as it exists in Firebase
  const q = query(mobileCollection, where("Category", "==", category))
  const snapshot = await getDocs(q)
  console.log('getMobileCollectionByCategory - Found', snapshot.docs.length, 'documents')
  const results = snapshot.docs.map((doc) => {
    const data = { id: doc.id, ...doc.data() } as any
    console.log('Document:', doc.id, 'Category:', data.Category)
    // Transform mobile data to ensure proper field mapping
    return {
      ...data,
      name: data.name || data.Name || data.title || data.Title || data.id || 'Unnamed Product',
      price: Number(data.price || data.Price || data.salePrice || data.SalePrice || 0),
      originalPrice: Number(data.originalPrice || data.OriginalPrice || data.mrp || data.MRP || 0),
      images: data.images || data.Images || [data.image, data.Image].filter(Boolean) || [],
      rating: Number(data.rating || data.Rating || 4.0),
      reviewCount: Number(data.reviewCount || data.ReviewCount || data.reviews || 0),
      brand: data.Brand || data.brand || '',
      stock: Number(data.stock || data.Stock || 1),
    }
  })
  return results
}

//get all mobile collection items with proper field transformation
export const getAllMobileCollectionItems = async () => {
  console.log('getAllMobileCollectionItems - Fetching all mobile items')
  const mobileCollection = collection(db, "mobile")
  const snapshot = await getDocs(mobileCollection)
  console.log('getAllMobileCollectionItems - Found', snapshot.docs.length, 'total documents')
  
  const results = snapshot.docs.map((doc) => {
    const rawData = { id: doc.id, ...doc.data() } as any
    console.log('Document ID:', doc.id, 'Category:', rawData.Category, 'Available fields:', Object.keys(rawData))
    
    // Apply comprehensive field transformation to match Product interface
    const transformedData = {
      // Keep all original data first to preserve everything
      ...rawData,
      
      // Add standardized field mappings for consistent access
      name: rawData.name || rawData.Name || rawData.title || rawData.Title || rawData.productName || rawData.ProductName || rawData.id || 'Unnamed Product',
      description: rawData.description || rawData.Description || rawData.details || rawData.Details || rawData.desc || rawData.Desc || rawData.summary || rawData.Summary || rawData.overview || rawData.Overview || '',
      
      // Price handling with multiple fallbacks
      price: (() => {
        const priceValue = rawData.price || rawData.Price || rawData.salePrice || rawData.SalePrice || rawData.currentPrice || rawData.CurrentPrice || rawData.sellingPrice || rawData.SellingPrice || 0
        return Number(priceValue) || 0
      })(),
      
      originalPrice: (() => {
        const originalValue = rawData.originalPrice || rawData.OriginalPrice || rawData.mrp || rawData.MRP || rawData.listPrice || rawData.ListPrice || rawData.regularPrice || rawData.RegularPrice || 0
        return Number(originalValue) || 0
      })(),
      
      // Enhanced image handling with comprehensive fallbacks
      images: (() => {
        // Handle various image field combinations
        const imageFields = [
          rawData.images, rawData.Images, rawData.imageUrls, rawData.ImageUrls,
          rawData.photos, rawData.Photos, rawData.gallery, rawData.Gallery,
          rawData.productImages, rawData.ProductImages
        ].filter(Boolean)
        
        if (imageFields.length > 0) {
          const firstImageField = imageFields[0]
          if (Array.isArray(firstImageField)) {
            // Filter out gs:// URLs and empty/invalid URLs, keep only https:// URLs
            return firstImageField.filter(img => 
              img && 
              typeof img === 'string' && 
              img.trim().length > 0 && 
              img.startsWith('https://')
            )
          } else if (typeof firstImageField === 'string' && firstImageField.trim().length > 0 && firstImageField.startsWith('https://')) {
            return [firstImageField]
          }
        }
        
        // Single image fields
        const singleImage = rawData.image || rawData.Image || rawData.photo || rawData.Photo || rawData.thumbnail || rawData.Thumbnail || rawData.mainImage || rawData.MainImage
        if (singleImage && typeof singleImage === 'string' && singleImage.trim().length > 0 && singleImage.startsWith('https://')) {
          return [singleImage]
        }
        
        return []
      })(),
      
      rating: (() => {
        const ratingValue = rawData.rating || rawData.Rating || rawData.starRating || rawData.StarRating || rawData.averageRating || rawData.AverageRating || 4.0
        const numRating = Number(ratingValue)
        return (numRating >= 0 && numRating <= 5) ? numRating : 4.0
      })(),
      
      reviewCount: (() => {
        const reviewValue = rawData.reviewCount || rawData.ReviewCount || rawData.reviews || rawData.Reviews || rawData.totalReviews || rawData.TotalReviews || rawData.reviewsCount || rawData.ReviewsCount || 0
        return Math.max(0, Number(reviewValue) || 0)
      })(),
      
      brand: rawData.Brand || rawData.brand || rawData.brandName || rawData.BrandName || rawData.manufacturer || rawData.Manufacturer || rawData.make || rawData.Make || '',
      category: rawData.Category || rawData.category || rawData.categoryName || rawData.CategoryName || rawData.type || rawData.Type || rawData.productType || rawData.ProductType || '',
      
      stock: (() => {
        const stockValue = rawData.stock || rawData.Stock || rawData.quantity || rawData.Quantity || rawData.available || rawData.Available || rawData.inStock || rawData.InStock || rawData.inventory || rawData.Inventory || 1
        return Math.max(0, Number(stockValue) || 1)
      })(),
      
      // Enhanced specifications handling
      specifications: (() => {
        const specs = rawData.specifications || rawData.Specifications || rawData.specs || rawData.Specs || rawData.techSpecs || rawData.TechSpecs || rawData.technicalSpecs || rawData.TechnicalSpecs || {}
        if (typeof specs === 'object' && specs !== null && !Array.isArray(specs)) {
          return specs
        }
        return {}
      })(),
      
      // Enhanced features handling
      features: (() => {
        const featureFields = rawData.features || rawData.Features || rawData.keyFeatures || rawData.KeyFeatures || rawData.highlights || rawData.Highlights || rawData.benefits || rawData.Benefits
        if (Array.isArray(featureFields)) {
          return featureFields.filter(feature => feature && typeof feature === 'string' && feature.trim().length > 0)
        } else if (typeof featureFields === 'string' && featureFields.trim().length > 0) {
          // If features is a string, try to split it
          return featureFields.split(/[,;\n]/).map(f => f.trim()).filter(Boolean)
        }
        return []
      })(),
      
      // Required fields for Product interface
      sku: rawData.sku || rawData.SKU || rawData.productCode || rawData.ProductCode || rawData.itemCode || rawData.ItemCode || rawData.partNumber || rawData.PartNumber || rawData.id,
      
      // Additional metadata with proper handling
      isActive: rawData.isActive !== undefined ? rawData.isActive : (rawData.active !== undefined ? rawData.active : (rawData.status === 'active' || rawData.Status === 'active' || true)),
      isFeatured: !!(rawData.isFeatured || rawData.Featured || rawData.featured || rawData.isPopular || rawData.popular || rawData.recommended || rawData.Recommended),
      
      // Date handling with proper conversion
      createdAt: (() => {
        if (rawData.createdAt?.toDate) {
          return rawData.createdAt.toDate()
        } else if (rawData.createdAt instanceof Date) {
          return rawData.createdAt
        } else if (rawData.dateCreated?.toDate) {
          return rawData.dateCreated.toDate()
        } else if (rawData.dateCreated instanceof Date) {
          return rawData.dateCreated
        } else if (rawData.DateCreated?.toDate) {
          return rawData.DateCreated.toDate()
        } else if (rawData.DateCreated instanceof Date) {
          return rawData.DateCreated
        }
        return new Date()
      })(),
      
      updatedAt: (() => {
        if (rawData.updatedAt?.toDate) {
          return rawData.updatedAt.toDate()
        } else if (rawData.updatedAt instanceof Date) {
          return rawData.updatedAt
        } else if (rawData.dateUpdated?.toDate) {
          return rawData.dateUpdated.toDate()
        } else if (rawData.dateUpdated instanceof Date) {
          return rawData.dateUpdated
        } else if (rawData.DateUpdated?.toDate) {
          return rawData.DateUpdated.toDate()
        } else if (rawData.DateUpdated instanceof Date) {
          return rawData.DateUpdated
        }
        return new Date()
      })(),
    }
    
    console.log('Transformed product:', transformedData.name, 'Price:', transformedData.price, 'Images:', transformedData.images.length)
    return transformedData
  })
  
  console.log('getAllMobileCollectionItems - Returning', results.length, 'transformed products')
  return results
}

//get mobile collection items by brand (using Brand field only)
export const getMobileCollectionByBrand = async (brandSlug: string) => {
  console.log('getMobileCollectionByBrand - Searching for brand:', brandSlug)
  const mobileCollection = collection(db, "mobile")
  
  try {
    // Get ALL documents from mobile collection
    const allDocsSnapshot = await getDocs(mobileCollection)
    const allDocs = allDocsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    console.log('getMobileCollectionByBrand - Total documents in mobile collection:', allDocs.length)
    
    // Log the actual structure of a sample document to understand the data
    if (allDocs.length > 0) {
      console.log('Sample document structure:', allDocs[0])
      console.log('Available fields:', Object.keys(allDocs[0]))
    }
    
    // Log unique brands to see what brands exist (ONLY checking Brand field)
    const uniqueBrands = [...new Set(allDocs.map((doc: any) => doc.Brand).filter(Boolean))]
    console.log('getMobileCollectionByBrand - Available brands in Brand field:', uniqueBrands)
    
    // Prepare brand matching variations
    const normalizedBrandSlug = brandSlug.toLowerCase().trim()
    const formattedBrandName = brandSlug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    const brandVariations = [
      brandSlug, // original slug (e.g., "apple")
      normalizedBrandSlug, // lowercase (e.g., "apple")
      brandSlug.toUpperCase(), // uppercase (e.g., "APPLE")
      formattedBrandName, // formatted (e.g., "Apple")
      formattedBrandName.toLowerCase(), // formatted lowercase
      formattedBrandName.toUpperCase() // formatted uppercase
    ]
    
    console.log('Brand variations to match:', brandVariations)
    
    // Filter products by Brand field ONLY - exact matches only
    const matchingProducts = allDocs.filter((doc: any) => {
      const brand = doc.Brand || '' // Only check Brand field
      
      if (!brand) {
        // Skip documents that don't have a Brand field
        return false
      }
      
      const brandLower = brand.toLowerCase().trim()
      const exactMatch = brandVariations.some(variation => 
        brand === variation || brandLower === variation.toLowerCase()
      )
      
      if (exactMatch) {
        console.log(`EXACT BRAND MATCH found: Document ${doc.id} with Brand "${brand}"`) 
        return true
      }
      
      return false
    })
    
    console.log(`getMobileCollectionByBrand - Found ${matchingProducts.length} matching products for brand "${brandSlug}"`)    
    
    if (matchingProducts.length === 0) {
      console.log('No products found!')
      console.log('Available brands in database:', uniqueBrands)
      console.log('Searched for brand variations:', brandVariations)
    }
    
    // Apply consistent transformation to match Product interface
    const transformedProducts = matchingProducts.map((data: any) => ({
      ...data,
      name: data.name || data.Name || data.title || data.Title || data.id || 'Unnamed Product',
      price: Number(data.price || data.Price || data.salePrice || data.SalePrice || 0),
      originalPrice: Number(data.originalPrice || data.OriginalPrice || data.mrp || data.MRP || 0),
      images: data.images || data.Images || [data.image, data.Image].filter(Boolean) || [],
      rating: Number(data.rating || data.Rating || 4.0),
      reviewCount: Number(data.reviewCount || data.ReviewCount || data.reviews || 0),
      brand: data.Brand || formattedBrandName, // Use Brand field directly
      category: data.category || data.Category || '',
      stock: Number(data.stock || data.Stock || 1),
      specifications: data.specifications || data.Specifications || {},
      features: data.features || data.Features || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      isFeatured: data.isFeatured || data.Featured || false,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt || new Date(),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt || new Date(),
    }))
    
    console.log('Final transformed products:', transformedProducts.length)
    return transformedProducts
  } catch (error) {
    console.error('getMobileCollectionByBrand - Error:', error)
    return []
  }
}
// Categories Collection
export const categoriesCollection = collection(db, "categories")

export const getCategories = async () => {
  const snapshot = await getDocs(categoriesCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Category[]
}

export const getFeaturedCategories = async () => {
  const q = query(categoriesCollection, where("featured", "==", true))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Category[]
}

export const getCategory = async (slug: string) => {
  const q = query(categoriesCollection, where("slug", "==", slug))
  const snapshot = await getDocs(q)
  if (!snapshot.empty) {
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Category
  }
  return null
}

// Brands Collection
export const brandsCollection = collection(db, "brands")

export const getBrands = async () => {
  const snapshot = await getDocs(brandsCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Brand[]
}

export const getFeaturedBrands = async () => {
  const q = query(brandsCollection, where("featured", "==", true))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Brand[]
}

export const getBrand = async (slug: string) => {
  const q = query(brandsCollection, where("slug", "==", slug))
  const snapshot = await getDocs(q)
  if (!snapshot.empty) {
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Brand
  }
  return null
}

// Users Collection
export const usersCollection = collection(db, "users")

export const getUser = async (id: string) => {
  const docRef = doc(db, "users", id)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as User
  }
  return null
}

export const updateUser = async (id: string, user: Partial<User>) => {
  const docRef = doc(db, "users", id)
  return await updateDoc(docRef, user)
}

// Orders Collection
export const ordersCollection = collection(db, "orders")

export const getUserOrders = async (userId: string) => {
  const q = query(ordersCollection, where("userId", "==", userId), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Order[]
}

export const getOrder = async (id: string) => {
  const docRef = doc(db, "orders", id)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Order
  }
  return null
}

export const addOrder = async (order: Omit<Order, "id">) => {
  return await addDoc(ordersCollection, order)
}

export const updateOrder = async (id: string, order: Partial<Order>) => {
  const docRef = doc(db, "orders", id)
  return await updateDoc(docRef, order)
}

// Quotation Collection
export const quotationCollection = collection(db, "quotation")

export interface QuotationData {
  company: string
  fullName: string
  email: string
  phone: string
  budget?: string
  products?: string
  message?: string
  createdAt: Date
  status: 'pending' | 'reviewed' | 'responded'
}

export const addQuotation = async (quotationData: Omit<QuotationData, 'createdAt' | 'status'>) => {
  try {
    console.log('addQuotation - Adding quotation:', quotationData)
    
    const quotationWithMetadata: QuotationData = {
      ...quotationData,
      createdAt: new Date(),
      status: 'pending'
    }
    
    const docRef = await addDoc(quotationCollection, quotationWithMetadata)
    console.log('addQuotation - Quotation added successfully with ID:', docRef.id)
    
    return {
      success: true,
      id: docRef.id,
      message: 'Quotation submitted successfully'
    }
  } catch (error) {
    console.error('addQuotation - Error adding quotation:', error)
    throw new Error(`Failed to submit quotation: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const getQuotations = async () => {
  try {
    const q = query(quotationCollection, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as (QuotationData & { id: string })[]
  } catch (error) {
    console.error('getQuotations - Error fetching quotations:', error)
    throw error
  }
}

export const updateQuotationStatus = async (id: string, status: QuotationData['status']) => {
  try {
    const docRef = doc(db, "quotation", id)
    await updateDoc(docRef, { status, updatedAt: new Date() })
    return { success: true, message: 'Quotation status updated successfully' }
  } catch (error) {
    console.error('updateQuotationStatus - Error updating quotation status:', error)
    throw error
  }
}

// JoinUs Collection
export const joinUsCollection = collection(db, "joinUs")

export interface JoinUsData {
  name: string
  email: string
  message?: string
  createdAt: Date
  status: 'pending' | 'reviewed' | 'responded'
}

export const addJoinUsRequest = async (joinUsData: Omit<JoinUsData, 'createdAt' | 'status'>) => {
  try {
    console.log('addJoinUsRequest - Adding join us request:', joinUsData)
    
    const joinUsWithMetadata: JoinUsData = {
      ...joinUsData,
      createdAt: new Date(),
      status: 'pending'
    }
    
    const docRef = await addDoc(joinUsCollection, joinUsWithMetadata)
    console.log('addJoinUsRequest - Join us request added successfully with ID:', docRef.id)
    
    return {
      success: true,
      id: docRef.id,
      message: 'Join us request submitted successfully'
    }
  } catch (error) {
    console.error('addJoinUsRequest - Error adding join us request:', error)
    throw new Error(`Failed to submit join us request: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const getJoinUsRequests = async () => {
  try {
    const q = query(joinUsCollection, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as (JoinUsData & { id: string })[]
  } catch (error) {
    console.error('getJoinUsRequests - Error fetching join us requests:', error)
    throw error
  }
}

export const updateJoinUsStatus = async (id: string, status: JoinUsData['status']) => {
  try {
    const docRef = doc(db, "joinUs", id)
    await updateDoc(docRef, { status, updatedAt: new Date() })
    return { success: true, message: 'Join us request status updated successfully' }
  } catch (error) {
    console.error('updateJoinUsStatus - Error updating join us request status:', error)
    throw error
  }
}

// Contact Collection
export const contactCollection = collection(db, "contact")

export interface ContactData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  createdAt: Date
  status: 'pending' | 'reviewed' | 'responded'
}

export const addContactMessage = async (contactData: Omit<ContactData, 'createdAt' | 'status'>) => {
  try {
    console.log('addContactMessage - Adding contact message:', contactData)
    
    const contactWithMetadata: ContactData = {
      ...contactData,
      createdAt: new Date(),
      status: 'pending'
    }
    
    const docRef = await addDoc(contactCollection, contactWithMetadata)
    console.log('addContactMessage - Contact message added successfully with ID:', docRef.id)
    
    return {
      success: true,
      id: docRef.id,
      message: 'Contact message submitted successfully'
    }
  } catch (error) {
    console.error('addContactMessage - Error adding contact message:', error)
    throw new Error(`Failed to submit contact message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const getContactMessages = async () => {
  try {
    const q = query(contactCollection, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as (ContactData & { id: string })[]
  } catch (error) {
    console.error('getContactMessages - Error fetching contact messages:', error)
    throw error
  }
}

export const updateContactStatus = async (id: string, status: ContactData['status']) => {
  try {
    const docRef = doc(db, "contact", id)
    await updateDoc(docRef, { status, updatedAt: new Date() })
    return { success: true, message: 'Contact message status updated successfully' }
  } catch (error) {
    console.error('updateContactStatus - Error updating contact message status:', error)
    throw error
  }
}
