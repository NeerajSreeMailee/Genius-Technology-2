import { Organization, Product, WithContext } from 'schema-dts'

export function generateOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Genius Technology',
    url: 'https://geniustechnology.in',
    logo: 'https://geniustechnology.in/logo.png',
    description: 'Premium mobile accessories and electronics',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXX-XXX-XXXX', // Add your phone
      contactType: 'Customer Service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://facebook.com/geniustech', // Add your socials
      'https://instagram.com/geniustech',
      'https://twitter.com/geniustech',
    ],
  }
}

export function generateProductSchema(product: {
  name: string
  description: string
  image: string
  price: number
  currency: string
  availability: string
  rating?: number
  reviewCount?: number
}): WithContext<Product> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: window.location.href,
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 0,
    } : undefined,
  }
}