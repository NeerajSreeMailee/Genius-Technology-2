import { NextRequest, NextResponse } from 'next/server'
import { 
  getProducts, 
  getFeaturedProducts,
  getProductsByCategory,
  getProductsByBrand,
  getAllMobileCollectionItems,
  getMobileCollectionByCategory,
  getMobileCollectionByBrand
} from '@/lib/firebase-collections'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const collection = searchParams.get('collection') // 'mobile' or 'products'

    let data

    // Check if we're working with mobile collection or regular products
    if (collection === 'mobile') {
      if (category) {
        data = await getMobileCollectionByCategory(category)
      } else if (brand) {
        data = await getMobileCollectionByBrand(brand)
      } else {
        data = await getAllMobileCollectionItems()
      }
    } else {
      // Regular products collection
      if (type === 'featured') {
        data = await getFeaturedProducts()
      } else if (category) {
        data = await getProductsByCategory(category)
      } else if (brand) {
        data = await getProductsByBrand(brand)
      } else {
        data = await getProducts()
      }
    }

    return NextResponse.json({
      success: true,
      data,
      count: data.length
    })
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        data: []
      },
      { status: 500 }
    )
  }
}

// Example usage:
// GET /api/products - Get all products
// GET /api/products?type=featured - Get featured products
// GET /api/products?category=smartphones - Get products by category
// GET /api/products?brand=apple - Get products by brand
// GET /api/products?collection=mobile - Get all mobile collection items
// GET /api/products?collection=mobile&category=smartphone - Get mobile items by category
// GET /api/products?collection=mobile&brand=samsung - Get mobile items by brand
