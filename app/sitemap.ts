import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geniustechnology.in'
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/products',
    '/categories',
    '/brands',
    '/blog',
    '/faq',
    '/privacy',
    '/terms',
    '/shipping',
    '/returns',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // TODO: Add dynamic product pages
  // Fetch from your database/CMS
  // const products = await fetchProducts()
  // const productPages = products.map(product => ({
  //   url: `${baseUrl}/product/${product.slug}`,
  //   lastModified: product.updatedAt,
  //   changeFrequency: 'daily',
  //   priority: 0.7,
  // }))

  return [...staticPages]
}