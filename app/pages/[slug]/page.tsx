import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { notFound } from "next/navigation"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface StaticPageProps {
  params: {
    slug: string
  }
}

interface StaticPageData {
  title: string;
  content: string;
  slug: string;
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

  const pageData = pageSnap.data() as StaticPageData
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

  const pageData = pageSnap.data() as StaticPageData

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: pageData.title, href: `/pages/${params.slug}` },
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
