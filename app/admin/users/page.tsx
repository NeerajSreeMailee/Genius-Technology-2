"use client"

import { useState, useEffect } from "react"
import { collection, query, getDocs, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "@/types"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserTable } from "@/components/admin/user-table"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const fetchedUsers: User[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as User[]
      setUsers(fetchedUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = async (updatedUser: User) => {
    try {
      const userRef = doc(db, "users", updatedUser.id)
      await updateDoc(userRef, {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        role: updatedUser.role,
        updatedAt: new Date(),
      })
      toast({ title: "User Updated", description: `${updatedUser.firstName}'s profile has been updated.` })
      fetchUsers() // Re-fetch to update UI
    } catch (error) {
      console.error("Error updating user:", error)
      toast({ title: "Error", description: "Failed to update user.", variant: "destructive" })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }
    try {
      await deleteDoc(doc(db, "users", userId))
      toast({ title: "User Deleted", description: "User has been successfully deleted." })
      fetchUsers() // Re-fetch to update UI
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" })
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: User["role"]) => {
    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date(),
      })
      toast({ title: "Role Updated", description: `User role updated to ${newRole}.` })
      fetchUsers() // Re-fetch to update UI
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({ title: "Error", description: "Failed to update user role.", variant: "destructive" })
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">User Management</h1>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No users found.</div>
              ) : (
                <UserTable
                  users={users}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                  onUpdateUserRole={handleUpdateUserRole}
                />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
