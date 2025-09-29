import { Suspense } from "react"
import { notFound } from "next/navigation"
import MobileClientPage from './MobileClientPage'
import { ProductDetailsSkeleton } from "@/components/ui/enhanced-skeleton"
import { getmobileCollection } from "@/lib/firebase-collections"
import { cache } from "react"

// Cache the mobile data fetching for performance
const getCachedMobileData = cache(async (id: string) => {
  try {
    const mobile = await getmobileCollection(id)
    return mobile
  } catch (error) {
    console.error('Failed to fetch mobile data:', error)
    return null
  }
})

interface MobilePageProps {
  params: Promise<{
    id: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: MobilePageProps) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const mobile = await getCachedMobileData(decodedId)
  
  if (!mobile) {
    return {
      title: 'Product Not Found | Genius Technology',
      description: 'The requested mobile product could not be found.'
    }
  }

  const productName = mobile.name || mobile.Name || mobile.title || mobile.Title || 'Mobile Device'
  const productDescription = mobile.description || mobile.Description || `${productName} - Premium mobile device`
  const productImage = mobile.images?.[0] || '/placeholder.svg'

  return {
    title: `${productName} | Genius Technology`,
    description: productDescription,
    openGraph: {
      title: productName,
      description: productDescription,
      images: [productImage],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: productName,
      description: productDescription,
      images: [productImage]
    }
  }
}

// Server component for instant loading
export default async function MobilePage({ params }: MobilePageProps) {
  const { id } = await params
  
  // Decode URL-encoded ID to handle cases like "12%20PRO" -> "12 PRO"
  const decodedId = decodeURIComponent(id)
  console.log('MobilePage - Original ID:', id, 'Decoded ID:', decodedId)
  
  // Pre-fetch data on server for instant loading
  const initialMobileData = await getCachedMobileData(decodedId)
  
  if (!initialMobileData) {
    notFound()
  }

  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <MobileClientPage 
        mobileId={decodedId} 
        initialData={initialMobileData}
      />
    </Suspense>
  )
}