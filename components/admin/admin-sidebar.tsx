"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  CreditCard,
  Settings,
  FileText,
  Tag,
  Building2,
  Truck,
} from "lucide-react"

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/admin",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/admin/products",
      icon: Package,
      label: "Products",
    },
    {
      href: "/admin/categories",
      icon: Tag,
      label: "Categories",
    },
    {
      href: "/admin/orders",
      icon: ShoppingCart,
      label: "Orders",
    },
    {
      href: "/admin/shipments",
      icon: Truck,
      label: "Shipments",
    },
    {
      href: "/admin/customers",
      icon: Users,
      label: "Customers",
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Users & Roles",
    },
    {
      href: "/admin/payments",
      icon: CreditCard,
      label: "Payments",
    },
    {
      href: "/admin/payment-test",
      icon: CreditCard,
      label: "Payment Testing",
    },
    {
      href: "/admin/corporate-orders", // Link to corporate orders
      icon: Building2,
      label: "Corporate Orders",
    },
    {
      href: "/admin/blog",
      icon: FileText,
      label: "Blog",
    },
    {
      href: "/admin/cms",
      icon: FileText,
      label: "CMS Pages",
    },
    {
      href: "/admin/coupons", // New link for coupons
      icon: Tag,
      label: "Coupons",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
    },
  ]

  return (
    <nav
      className={cn(
        "flex flex-col space-y-1 p-4 border-r bg-card text-card-foreground rounded-lg shadow-sm",
        className,
      )}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
            {
              "bg-gray-100 font-semibold dark:bg-gray-800": pathname === item.href,
            },
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
