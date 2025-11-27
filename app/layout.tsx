import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutClient } from "@/components/shared/layout-client"
import { Suspense } from 'react'
import { SkipLink } from '@/components/shared/skip-link'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap', // Important for performance
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: {
    template: "%s | Genius Technology - Premium Mobile Accessories",
    default: "Genius Technology - Premium Mobile Accessories"
  },
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
    google: process.env.GOOGLE_VERIFICATION_CODE || "your-google-verification-code",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Genius Technology",
              "url": "https://geniustechnology.in",
              "logo": "https://geniustechnology.in/logo.png",
              "sameAs": [
                "https://www.facebook.com/geniustechnology",
                "https://twitter.com/geniustechnology",
                "https://www.instagram.com/geniustechnology",
                "https://www.linkedin.com/company/geniustechnology"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SkipLink />
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
          <LayoutClient>{children}</LayoutClient>
        </Suspense>
      </body>
    </html>
  )
}