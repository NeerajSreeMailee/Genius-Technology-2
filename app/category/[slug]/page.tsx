import { cache } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Category } from "@/types"
import type { Metadata } from "next"
import CategoryClientPage from "./CategoryClientPage"
import { ProductDetailsSkeleton } from "@/components/ui/enhanced-skeleton"
import { Suspense } from "react"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

// Cache the category data fetching for performance
const getCachedCategoryData = cache(async (slug: string) => {
  try {
    const categoriesCollection = collection(db, "categories")
    const categoryName = slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    const q = query(categoriesCollection, where("name", "==", categoryName))
    const categorySnap = await getDocs(q)
    
    if (categorySnap.empty) {
      return null
    }
    
    return categorySnap.docs[0].data() as Category
  } catch (error) {
    console.error('Failed to fetch category data:', error)
    return null
  }
})

// Dynamic metadata generation for category pages
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categorySlug = params.slug
  const category = await getCachedCategoryData(categorySlug)

  if (!category) {
    return {
      title: "Category Not Found | Genius Technology",
      description: "The product category you are looking for does not exist.",
      openGraph: {
        title: "Category Not Found | Genius Technology",
        description: "The product category you are looking for does not exist.",
        type: "website"
      }
    }
  }

  const categoryName = category.name
  const categoryDescription = category.description || `Browse ${categoryName} electronics and gadgets at Genius Technology.`

  return {
    title: `${categoryName} | Genius Technology`,
    description: categoryDescription,
    keywords: [categoryName, "electronics", "gadgets", "tech", "category", "online shop"],
    openGraph: {
      title: `${categoryName} | Genius Technology`,
      description: categoryDescription,
      images: category.image ? [{ url: category.image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} | Genius Technology`,
      description: categoryDescription,
      images: category.image ? [category.image] : []
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Pre-fetch category data on server for instant loading
  const initialCategoryData = await getCachedCategoryData(params.slug)
  
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <CategoryClientPage 
        params={params} 
        initialData={initialCategoryData}
      />
    </Suspense>
  )
}
