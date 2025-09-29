import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { ComparisonProvider } from "@/contexts/comparison-context"
import { Toaster } from "@/components/ui/toaster"
import { BackgroundPatterns } from "@/components/background-patterns"
import { OptimizedPerformanceMonitor } from "@/components/performance-monitor"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Genius Technology - Premium Mobile Accessories",
  description:
    "Discover premium mobile accessories, audio devices, charging solutions, and smart gadgets. Quality products with fast delivery across India.",
  keywords: "mobile accessories, headphones, chargers, power banks, phone cases, wireless speakers",
  authors: [{ name: "Genius Technology" }],
  creator: "Genius Technology",
  publisher: "Genius Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://geniustechnology.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Genius Technology - Premium Mobile Accessories",
    description: "Discover premium mobile accessories, audio devices, charging solutions, and smart gadgets.",
    url: "https://geniustechnology.in",
    siteName: "Genius Technology",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Genius Technology - Premium Mobile Accessories",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genius Technology - Premium Mobile Accessories",
    description: "Discover premium mobile accessories, audio devices, charging solutions, and smart gadgets.",
    images: ["/og-image.jpg"],
    creator: "@geniustechnology",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BackgroundPatterns />
        <OptimizedPerformanceMonitor />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ComparisonProvider>
                {children}
                <Toaster />
              </ComparisonProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}