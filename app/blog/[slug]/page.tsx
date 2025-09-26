import { Header } from "@/components/header"
import { getBlogPostBySlug } from "@/actions/blog"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Breadcrumb } from "@/components/breadcrumb"
import { Separator } from "@/components/ui/separator"
import Markdown from "react-markdown" // For rendering markdown content

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post || !post.isPublished) {
    return {
      title: "Blog Post Not Found - Genius Technology",
      description: "The blog post you are looking for does not exist or is not published.",
    }
  }

  return {
    title: `${post.title} - Genius Technology Blog`,
    description: post.content.substring(0, 160), // Use first 160 chars of content as description
    openGraph: {
      title: `${post.title} - Genius Technology Blog`,
      description: post.content.substring(0, 160),
      images: post.imageUrl ? [post.imageUrl] : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} - Genius Technology Blog`,
      description: post.content.substring(0, 160),
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post || !post.isPublished) {
    notFound()
  }

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbs} />
        <article className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {post.imageUrl && (
            <div className="relative w-full h-80 mb-6 rounded-lg overflow-hidden">
              <Image
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 text-sm mb-6">
            <span>By {post.authorName}</span>
            <Separator orientation="vertical" className="h-4 mx-2" />
            <span>{post.publishedAt ? format(new Date(post.publishedAt), "PPP") : "N/A"}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            <Markdown>{post.content}</Markdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
