import type { Metadata } from "next"
import ProductsClientPage from "./ProductsClientPage"

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our full range of electronics, gadgets, and tech accessories. Find the perfect product for your needs.",
  keywords: ["all products", "electronics store", "tech shop", "full catalog"],
  openGraph: {
    title: "All Products | Genius Technology",
    description:
      "Browse our full range of electronics, gadgets, and tech accessories. Find the perfect product for your needs.",
    url: "https://your-ecommerce-domain.com/products", // Replace with your actual domain
  },
}

export default function ProductsPage() {
  return <ProductsClientPage />
}
