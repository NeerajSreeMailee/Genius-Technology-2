"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  Shield,
  Gift,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useWishlist } from "@/contexts/wishlist-context" // Import useWishlist

interface AccountSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AccountSidebar({ activeTab, onTabChange }: AccountSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { items: wishlistItems } = useWishlist() // Get wishlist items

  const menuItems = [
    { id: "profile", label: "Profile", icon: User, type: "internal", badge: null },
    { id: "orders", label: "Orders", icon: Package, type: "internal", badge: null },

  ]

  return (
    <Card>
      <CardContent className="p-6">
        {/* User Info */}
        <div className="text-center mb-6 pb-6 border-b">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h3 className="font-semibold">
            {user?.name || 'User'}
          </h3>
          <p className="text-gray-600 text-sm">{user?.email}</p>
          <Badge variant="secondary" className="mt-2">
            {user?.role === "admin" ? "Admin" : "Customer"}
          </Badge>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isExternalActive = item.type === "external" && pathname === (item as any).href
            const isInternalActive = item.type === "internal" && activeTab === item.id

            if (item.type === "external") {
              return (
                <Link
                  key={item.id}
                  href={(item as any).href!}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors rounded-md ${
                    isExternalActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            } else {
              return (
                <Button
                  key={item.id}
                  variant={isInternalActive ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onTabChange(item.id)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              )
            }
          })}
        </nav>

        {/* Logout */}
        <div className="mt-6 pt-6 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
