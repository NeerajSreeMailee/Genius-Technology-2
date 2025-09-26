"use client"

import type { BlogPost } from "@/types"
import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BlogPostForm } from "@/components/admin/blog-post-form"
import { getBlogPosts, deleteBlogPost, updateBlogPost } from "@/actions/blog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default function AdminBlogPage() {
  const { user, loading: authLoading } = useAuth()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const { toast } = useToast()

  const fetchPosts = async () => {
    setIsLoading(true)
    const posts = await getBlogPosts()
    setBlogPosts(posts)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      fetchPosts()
    }
  }, [authLoading, user])

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingPost(null)
    fetchPosts()
  }

  const handleDelete = async (postId: string, imageUrl?: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return
    const result = await deleteBlogPost(postId, imageUrl)
    if (result.success) {
      toast({ title: result.message })
      fetchPosts()
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" })
    }
  }

  const handleTogglePublish = async (post: BlogPost) => {
    const formData = new FormData()
    formData.append("title", post.title)
    formData.append("content", post.content)
    formData.append("tags", post.tags.join(", "))
    formData.append("isPublished", String(!post.isPublished))
    formData.append("existingImageUrl", post.imageUrl || "")
    formData.append("originalIsPublished", String(post.isPublished)) // Pass original status

    const result = await updateBlogPost(post.id, formData)
    if (result.success) {
      toast({ title: `Blog post ${!post.isPublished ? "published" : "unpublished"} successfully!` })
      fetchPosts()
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" })
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar activeTab="blog" />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 bg-gray-100">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card className="p-8 text-center">
          <CardTitle className="mb-4">Access Denied</CardTitle>
          <CardContent>
            <p className="mb-4">You do not have permission to view this page.</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar activeTab="blog" />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 bg-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingPost(null)
                    setShowForm(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>{editingPost ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle>
                </DialogHeader>
                <BlogPostForm
                  post={editingPost}
                  onSuccess={handleFormSuccess}
                  onCancel={() => setShowForm(false)}
                  authorId={user.id}
                  authorName={`${user.firstName} ${user.lastName}`}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">Loading blog posts...</div>
              ) : blogPosts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No blog posts found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Published At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          {post.imageUrl ? (
                            <Image
                              src={post.imageUrl || "/placeholder.svg"}
                              alt={post.title}
                              width={60}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-[60px] h-[40px] bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                              No Img
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.authorName}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={post.isPublished ? "default" : "outline"}>
                            {post.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleTogglePublish(post)}
                              title={post.isPublished ? "Unpublish" : "Publish"}
                            >
                              {post.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Dialog open={showForm && editingPost?.id === post.id} onOpenChange={setShowForm}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    setEditingPost(post)
                                    setShowForm(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[800px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Blog Post</DialogTitle>
                                </DialogHeader>
                                <BlogPostForm
                                  post={editingPost}
                                  onSuccess={handleFormSuccess}
                                  onCancel={() => setShowForm(false)}
                                  authorId={user.id}
                                  authorName={`${user.firstName} ${user.lastName}`}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(post.id, post.imageUrl)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
