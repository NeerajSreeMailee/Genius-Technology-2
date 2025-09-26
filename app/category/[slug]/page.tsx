import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Category } from "@/types"
import type { Metadata } from "next"
import CategoryClientPage from "./CategoryClientPage"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

// Dynamic metadata generation for category pages
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categorySlug = params.slug
  const categoriesCollection = collection(db, "categories")
  const q = query(
    categoriesCollection,
    where(
      "name",
      "==",
      categorySlug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    ),
  )
  const categorySnap = await getDocs(q)

  if (categorySnap.empty) {
    return {
      title: "Category Not Found",
      description: "The product category you are looking for does not exist.",
    }
  }

  const category = categorySnap.docs[0].data() as Category

  return {
    title: category.name,
    description: category.description || `Browse ${category.name} electronics and gadgets at Genius Technology.`,
    keywords: [category.name, "electronics", "gadgets", "tech", "category", "online shop"],
    openGraph: {
      title: category.name + " | Genius Technology",
      description: category.description || `Browse ${category.name} electronics and gadgets at Genius Technology.`,
      url: `https://your-ecommerce-domain.com/category/${categorySlug}`, // Replace with your actual domain
      images: category.image ? [{ url: category.image }] : [],
      type: "website",
    },
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryClientPage params={params} />
}
