import type { Metadata } from "next"
import BrandPageClient from "./BrandPageClient"

interface BrandPageProps {
  params: Promise<{
    slug: string
  }>
}

// Dynamic metadata generation for brand pages
export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const brandSlug = resolvedParams.slug
  const brandName = brandSlug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

  // You might fetch brand details from a 'brands' collection if you have one
  // For now, we'll just use the name from the slug
  return {
    title: brandName,
    description: `Explore all products from ${brandName} at Genius Technology. Find the latest ${brandName} electronics and accessories.`,
    keywords: [brandName, "electronics", "gadgets", "tech", "brand", "online shop"],
    openGraph: {
      title: brandName + " | Genius Technology",
      description: `Explore all products from ${brandName} at Genius Technology. Find the latest ${brandName} electronics and accessories.`,
      url: `https://your-ecommerce-domain.com/brand/${brandSlug}`, // Replace with your actual domain
      // images: brand.logo ? [{ url: brand.logo }] : [], // If you have brand logos
      type: "website",
    },
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const resolvedParams = await params
  return <BrandPageClient params={resolvedParams} />
}
