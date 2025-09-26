import { OfferBanner } from "@/components/offer-banner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { TrendingDeals } from "@/components/trending-deals"
import { ShopByBrand } from "@/components/shop-by-brand"
import { ShopByCategory } from "@/components/shop-by-category"
import { FeaturedProducts } from "@/components/featured-products"
import { CustomerTestimonials } from "@/components/customer-testimonials"
import { NewsletterSection } from "@/components/newsletter-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <OfferBanner />
      <Header />
      <main>
        <HeroSection />
        <TrendingDeals />
        <ShopByBrand />
        <ShopByCategory />
        <CustomerTestimonials />
        {/* <NewsletterSection /> */}
      </main>
      <Footer />
    </div>
  )
}