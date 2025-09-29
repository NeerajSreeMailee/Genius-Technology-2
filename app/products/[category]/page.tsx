import { Suspense } from "react"
import type { Metadata } from "next"
import CategoryClientPage from "./CategoryClientPage"
import { ProductDetailsSkeleton } from "@/components/ui/enhanced-skeleton"
import { cache } from "react"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

// Cache category data fetching
const getCachedCategoryProducts = cache(async (category: string) => {
  try {
    // Import Firebase functions dynamically
    const { getMobileCollectionByCategory } = await import('@/lib/firebase-collections')
    return await getMobileCollectionByCategory(category)
  } catch (error) {
    console.error('Failed to fetch category products:', error)
    return []
  }
})

// Dynamic metadata generation for mobile category pages
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categorySlug = category
  const categoryName = categorySlug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  const categoryDescription = `Explore all ${categoryName} products at Genius Technology. Find the latest ${categoryName} electronics and accessories.`

  return {
    title: `${categoryName} Products | Genius Technology`,
    description: categoryDescription,
    keywords: [categoryName, "electronics", "gadgets", "tech", "mobile", "online shop"],
    openGraph: {
      title: `${categoryName} Products | Genius Technology`,
      description: categoryDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} Products | Genius Technology`,
      description: categoryDescription
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  
  // Pre-fetch category products on server for instant loading
  const categoryForQuery = resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1)
  const initialProducts = await getCachedCategoryProducts(categoryForQuery)
  
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <CategoryClientPage 
        params={resolvedParams} 
        initialData={initialProducts}
      />
    </Suspense>
  )
}