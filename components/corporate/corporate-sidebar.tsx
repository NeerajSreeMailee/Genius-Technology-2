"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, ShoppingCart, Settings, Users, Mail } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"

export function CorporateSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const corporateNavItems = [
    {
      title: "Dashboard",
      href: "/corporate/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/corporate/dashboard",
    },
    {
      title: "My Quotes",
      href: "/corporate/quotes",
      icon: FileText,
      isActive: pathname === "/corporate/quotes",
    },
    {
      title: "My Orders",
      href: "/corporate/orders",
      icon: ShoppingCart,
      isActive: pathname === "/corporate/orders",
    },
    {
      title: "Account Settings",
      href: "/corporate/settings",
      icon: Settings,
      isActive: pathname === "/corporate/settings",
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/corporate/dashboard" className="flex items-center gap-2 font-semibold">
          <Users className="h-6 w-6" />
          <span className="group-data-[state=collapsed]:hidden">Corporate Portal</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {corporateNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Contact Us">
                  <Link href="/contact">
                    <Mail className="h-4 w-4" />
                    <span>Contact Us</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
