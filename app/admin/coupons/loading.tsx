import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AdminCouponsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <AdminSidebar />

          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
                <Skeleton className="h-9 w-36" />
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          <Skeleton className="h-4 w-16" />
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          <Skeleton className="h-4 w-16" />
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          <Skeleton className="h-4 w-16" />
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          <Skeleton className="h-4 w-20" />
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          <Skeleton className="h-4 w-16" />
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          <Skeleton className="h-4 w-16" />
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          <Skeleton className="h-4 w-16" />
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                          <Skeleton className="h-4 w-16" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-20" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-16" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-28" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-20" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Skeleton className="h-8 w-8 rounded-md" />
                              <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
