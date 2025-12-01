import { getMobileCollectionItems } from "@/lib/firebase-collections"
import { TrendingDeals, Deal } from "./trending-deals"

export async function TrendingDealsContainer() {
    // Fetch data on the server
    const data = await getMobileCollectionItems(6)

    // Transform data
    const deals: Deal[] = (data || []).map((mobile: any) => {
        const originalPrice = mobile.originalPrice || mobile.price * 1.2 || 0
        const salePrice = mobile.price || mobile.salePrice || 0
        const discount = originalPrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0

        return {
            id: mobile.id,
            name: mobile.name || 'Unnamed Product',
            brand: mobile.brand || mobile.Brand || '',
            image: (mobile.images && mobile.images[0]) || mobile.image || '/placeholder.svg',
            originalPrice: originalPrice,
            salePrice: salePrice,
            discount: discount,
            // Generate random values on the server - these will be stable for the initial render
            timeLeft: Math.floor(Math.random() * 86400) + 3600,
            stock: mobile.stock || 1,
            sold: Math.floor(Math.random() * 50) + 10,
            rating: mobile.rating || 0,
            reviewCount: mobile.reviewCount || 0
        }
    }).filter((deal: Deal) => deal.salePrice > 0)

    return <TrendingDeals deals={deals} />
}
