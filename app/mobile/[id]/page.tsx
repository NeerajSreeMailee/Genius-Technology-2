import MobileClientPage from './MobileClientPage'

interface MobilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MobilePage({ params }: MobilePageProps) {
  const { id } = await params
  
  // Decode URL-encoded ID to handle cases like "12%20PRO" -> "12 PRO"
  const decodedId = decodeURIComponent(id)
  console.log('MobilePage - Original ID:', id, 'Decoded ID:', decodedId)
  
  return <MobileClientPage mobileId={decodedId} />
}