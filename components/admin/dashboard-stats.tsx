import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ShoppingCart, Users, Percent } from "lucide-react"

interface DashboardStatsProps {
  data: {
    totalOrders: number
    revenue: number
    newCustomers: number
    conversionRate: number
  }
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Orders",
      value: data.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Revenue",
      value: `₹${data.revenue.toLocaleString()}`,
      icon: TrendingUp,
      change: "+18%",
      changeType: "positive" as const,
    },
    {
      title: "New Customers",
      value: data.newCustomers.toLocaleString(),
      icon: Users,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Conversion Rate",
      value: `${data.conversionRate}%`,
      icon: Percent,
      change: "+2%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
