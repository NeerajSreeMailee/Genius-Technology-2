"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CreditCard, Heart, Gift, TrendingUp } from "lucide-react"
import Image from "next/image"

export function AccountDashboard() {
  const stats = [
    { label: "Total Orders", value: "12", icon: Package, color: "text-blue-600" },
    { label: "Active Orders", value: "2", icon: Truck, color: "text-green-600" },
    { label: "Wishlist Items", value: "5", icon: Heart, color: "text-red-600" },
    
  ]

  const recentOrders = [
    {
      id: "GT1234567",
      date: "Dec 15, 2024",
      status: "Delivered",
      total: 2999,
      items: 2,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "GT1234568",
      date: "Dec 12, 2024",
      status: "Shipped",
      total: 1899,
      items: 1,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "GT1234569",
      date: "Dec 10, 2024",
      status: "Processing",
      total: 4599,
      items: 3,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const recommendations = [
    {
      id: "1",
      name: "iPhone 15 Pro Max Case",
      price: 2999,
      originalPrice: 3999,
      image: "/placeholder.svg?height=80&width=80",
      discount: 25,
    },
    {
      id: "2",
      name: "Wireless Charging Pad",
      price: 1999,
      originalPrice: 2999,
      image: "/placeholder.svg?height=80&width=80",
      discount: 33,
    },
    {
      id: "3",
      name: "Bluetooth Earbuds Pro",
      price: 4999,
      originalPrice: 7999,
      image: "/placeholder.svg?height=80&width=80",
      discount: 37,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">Welcome  ghvghv!</h2>
          
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {/* center the list horizontally */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 text-center">
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image src={order.image || "/placeholder.svg"} alt="Order" fill className="object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">#{order.id}</h4>
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "default"
                            : order.status === "Shipped"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-xs">
                      {order.date} • {order.items} items
                    </p>
                    <p className="font-bold text-sm">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">₹{product.price.toLocaleString()}</span>
                      <span className="text-gray-500 line-through text-xs">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Add
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Package className="h-6 w-6 mb-2" />
              <span className="text-sm">Track Order</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="text-sm">Payment Methods</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Heart className="h-6 w-6 mb-2" />
              <span className="text-sm">Wishlist</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Gift className="h-6 w-6 mb-2" />
              <span className="text-sm">Rewards</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
