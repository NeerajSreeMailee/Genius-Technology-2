"use client"

import { useState, useEffect } from "react"
import { collection, query, getDocs, doc, setDoc, deleteDoc, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { StaticPage } from "@/types"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash } from "lucide-react"
import { StaticPageForm } from "@/components/admin/static-page-form"
import { useToast } from "@/hooks/use-toast"

export default function AdminCMSPage() {
  const [pages, setPages] = useState<StaticPage[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "staticPages"), orderBy("slug"))
      const querySnapshot = await getDocs(q)
      const fetchedPages: StaticPage[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lastModifiedAt: doc.data().lastModifiedAt?.toDate(),
      })) as StaticPage[]
      setPages(fetchedPages)
    } catch (error) {
      console.error("Error fetching static pages:", error)
      toast({
        title: "Error",
        description: "Failed to load static pages.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSavePage = async (pageData: Omit<StaticPage, "id" | "lastModifiedAt">) => {
    setIsSaving(true)
    try {
      if (editingPage) {
        // Update existing page
        const pageRef = doc(db, "staticPages", editingPage.id)
        await setDoc(pageRef, { ...pageData, lastModifiedAt: new Date() }, { merge: true })
        toast({ title: "Page Updated", description: `Page "${pageData.title}" has been updated.` })
      } else {
        // Add new page
        const newDocRef = doc(collection(db, "staticPages")) // Let Firestore generate ID
        await setDoc(newDocRef, { ...pageData, id: newDocRef.id, lastModifiedAt: new Date() })
        toast({ title: "Page Added", description: `Page "${pageData.title}" has been added.` })
      }
      setShowForm(false)
      setEditingPage(null)
      await fetchPages() // Re-fetch to update UI
    } catch (error) {
      console.error("Error saving page:", error)
      toast({
        title: "Error",
        description: "Failed to save page. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePage = async (pageId: string, pageTitle: string) => {
    if (!confirm(`Are you sure you want to delete the page "${pageTitle}"? This action cannot be undone.`)) {
      return
    }
    try {
      await deleteDoc(doc(db, "staticPages", pageId))
      toast({ title: "Page Deleted", description: `Page "${pageTitle}" has been successfully deleted.` })
      fetchPages() // Re-fetch to update UI
    } catch (error) {
      console.error("Error deleting page:", error)
      toast({ title: "Error", description: "Failed to delete page.", variant: "destructive" })
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Content Management (CMS)</h1>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingPage(null)
                    setShowForm(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add New Page
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>{editingPage ? "Edit Static Page" : "Add New Static Page"}</DialogTitle>
                </DialogHeader>
                <StaticPageForm
                  page={editingPage}
                  onSave={handleSavePage}
                  onCancel={() => setShowForm(false)}
                  isSaving={isSaving}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Static Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading pages...</div>
              ) : pages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No static pages found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">{page.title}</TableCell>
                          <TableCell>/pages/{page.slug}</TableCell>
                          <TableCell>{page.lastModifiedAt?.toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2 bg-transparent"
                              onClick={() => {
                                setEditingPage(page)
                                setShowForm(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePage(page.id, page.title)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
