import type { Metadata } from "next"
import CategoryClientPage from "./CategoryClientPage"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

// Dynamic metadata generation for mobile category pages
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categorySlug = category
  const categoryName = categorySlug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

  return {
    title: `${categoryName} Products`,
    description: `Explore all ${categoryName} products at Genius Technology. Find the latest ${categoryName} electronics and accessories.`,
    keywords: [categoryName, "electronics", "gadgets", "tech", "mobile", "online shop"],
    openGraph: {
      title: `${categoryName} Products | Genius Technology`,
      description: `Explore all ${categoryName} products at Genius Technology. Find the latest ${categoryName} electronics and accessories.`,
      url: `https://your-ecommerce-domain.com/products/${categorySlug}`,
      type: "website",
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  return <CategoryClientPage params={resolvedParams} />
}