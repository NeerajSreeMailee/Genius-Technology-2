import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBlogPosts } from "@/actions/blog"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata = {
  title: "Blog - Genius Technology",
  description: "Stay updated with the latest tech news, reviews, and insights from Genius Technology.",
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()
  const publishedPosts = blogPosts.filter((post) => post.isPublished)

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Blog</h1>
        {publishedPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-gray-600">No blog posts published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedPosts.map((post) => (
              <Card key={post.id} className="flex flex-col overflow-hidden">
                {post.featuredImage && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.featuredImage || "/placeholder.svg"}
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl font-semibold line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    By {post.author} on {post.publishedAt ? format(new Date(post.publishedAt), "PPP") : "N/A"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-gray-700 line-clamp-3 mb-4">{post.content.substring(0, 150)}...</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline text-sm font-medium">
                    Read More &rarr;
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
