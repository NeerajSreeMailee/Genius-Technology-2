import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { StaticPage } from "@/types"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { Footer } from "@/components/footer"

interface StaticPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: StaticPageProps) {
  const pageRef = doc(db, "staticPages", params.slug) // Assuming slug is also the document ID
  const pageSnap = await getDoc(pageRef)

  if (!pageSnap.exists()) {
    return {
      title: "Page Not Found",
      description: "The requested page does not exist.",
    }
  }

  const pageData = pageSnap.data() as StaticPage
  return {
    title: pageData.title,
    description: pageData.content.substring(0, 160), // Use first 160 chars of content as description
  }
}

export default async function Page({ params }: StaticPageProps) {
  const pageRef = doc(db, "staticPages", params.slug)
  const pageSnap = await getDoc(pageRef)

  if (!pageSnap.exists()) {
    notFound()
  }

  const pageData = pageSnap.data() as StaticPage

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: pageData.title, href: `/pages/${pageData.slug}` },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{pageData.title}</h1>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: pageData.content }} />
      </main>
      <Footer />
    </div>
  )
}
