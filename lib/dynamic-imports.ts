import dynamic from 'next/dynamic'

// Heavy UI Components
export const Dialog = dynamic(
  () => import('@radix-ui/react-dialog').then(mod => mod.Root),
  { 
    ssr: false 
  }
)

export const Sheet = dynamic(
  () => import('@/components/ui/sheet').then(mod => mod.Sheet),
  { ssr: false }
)

export const Carousel = dynamic(
  () => import('embla-carousel-react'),
  { ssr: false }
)

// Heavy feature components
export const PDFGenerator = dynamic(
  () => import('jspdf'),
  { ssr: false }
)

export const Html2Canvas = dynamic(
  () => import('html2canvas'),
  { ssr: false }
)

export const Recharts = dynamic(
  () => import('recharts'),
  { ssr: false }
)

// Payment components
export const StripeCheckout = dynamic(
  () => import('@stripe/react-stripe-js'),
  { ssr: false }
)

export const RazorpayCheckout = dynamic(
  () => import('razorpay'),
  { ssr: false }
)