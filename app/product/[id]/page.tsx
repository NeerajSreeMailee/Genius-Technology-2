import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product } from "@/types"
import type { Metadata } from "next"
import ProductClientPage from "./ProductClientPage"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

// Dynamic metadata generation
export async function generateMetadata(props: ProductPageProps): Promise<Metadata> {
  const params = await props.params
  const productId = params.id
  
  try {
    const productRef = doc(db, "products", productId)
    const productSnap = await getDoc(productRef)

    if (!productSnap.exists()) {
      return {
        title: "Product Not Found",
        description: "The product you are looking for does not exist.",
      }
    }

    const product = { id: productSnap.id, ...productSnap.data() } as Product

    // Safely handle description
    const description = product.description 
      ? (product.description.length > 160 
          ? product.description.substring(0, 160) + "..." 
          : product.description)
      : `Buy ${product.name} at best price with fast delivery`

    return {
      title: `${product.name} - Genius Technology`,
      description,
      keywords: [product.name, product.category, product.brand, "electronics", "buy online"].filter(Boolean),
      openGraph: {
        title: product.name + " | Genius Technology",
        description,
        url: `https://genius-technology.com/product/${product.id}`, // Replace with your actual domain
        images: product.images && product.images.length > 0 ? [{ url: product.images[0] }] : [],
        type: "product",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name + " | Genius Technology",
        description,
        images: product.images && product.images.length > 0 ? [product.images[0]] : [],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Product - Genius Technology",
      description: "Premium mobile accessories and electronics",
    }
  }
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params
  return <ProductClientPage params={params} />
}
