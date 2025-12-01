import { getBrands } from "@/lib/firebase-collections"
import { ShopByBrand } from "./shop-by-brand"

export async function ShopByBrandContainer() {
    // Fetch data on the server
    const brands = await getBrands()

    return <ShopByBrand brands={brands} />
}
