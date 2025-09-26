"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Package, Truck, CheckCircle, Clock, MapPin, RefreshCw, ExternalLink } from "lucide-react"

interface TrackingEvent {
  timestamp: string
  status: string
  location: string
}

interface TrackingDisplayProps {
  orderId: string
  trackingId?: string
  orderStatus: string
  className?: string
}

export function TrackingDisplay({ orderId, trackingId, orderStatus, className }: TrackingDisplayProps) {
  const [trackingData, setTrackingData] = useState<{
    trackingEvents: TrackingEvent[]
    lastUpdated: string
    orderStatus: string
    paymentStatus: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchTrackingData = async () => {
    if (!orderId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/orders/tracking?orderId=${orderId}`)
      const data = await response.json()
      
      if (data.success) {
        setTrackingData(data)
      } else {
        setError(data.error || "Failed to fetch tracking data")
        if (data.message) {
          toast({
            title: "Tracking Info",
            description: data.message,
            variant: "default",
          })
        }
      }
    } catch (err) {
      console.error("Error fetching tracking data:", err)
      setError("Failed to fetch tracking data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrackingData()
  }, [orderId])

  const getStatusIcon = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes("delivered")) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (lowerStatus.includes("shipped") || lowerStatus.includes("out for delivery") || lowerStatus.includes("dispatched"))
      return <Truck className="h-5 w-5 text-blue-600" />
    if (lowerStatus.includes("picked") || lowerStatus.includes("in transit"))
      return <Package className="h-5 w-5 text-yellow-600" />
    return <Clock className="h-5 w-5 text-gray-600" />
  }

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes("delivered")) return "bg-green-100 text-green-800"
    if (lowerStatus.includes("shipped") || lowerStatus.includes("out for delivery"))
      return "bg-blue-100 text-blue-800"
    if (lowerStatus.includes("picked") || lowerStatus.includes("in transit"))
      return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  if (!trackingId) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Preparing Your Order</h3>
            <p className="text-gray-600">
              Your order is being processed. Tracking information will be available once shipped.
            </p>
            <Badge className="mt-2">
              {orderStatus?.charAt(0).toUpperCase() + orderStatus?.slice(1) || "Processing"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Order Tracking
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTrackingData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {trackingId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://shiprocket.co/tracking/${trackingId}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Track External
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-600">Tracking Unavailable</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-500">Tracking ID:</span>
              <Badge variant="outline">{trackingId}</Badge>
            </div>
          </div>
        ) : isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-16 w-16 text-gray-300 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading tracking information...</p>
          </div>
        ) : trackingData?.trackingEvents.length === 0 ? (
          <div className="text-center py-8">
            <Truck className="h-16 w-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Order Shipped</h3>
            <p className="text-gray-600 mb-4">
              Your order has been shipped but tracking updates are not yet available.
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-500">Tracking ID:</span>
              <Badge variant="outline">{trackingId}</Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(trackingData?.trackingEvents[0]?.status || orderStatus)}
                <div>
                  <p className="font-medium">
                    {trackingData?.trackingEvents[0]?.status || orderStatus}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tracking ID: {trackingId}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(trackingData?.trackingEvents[0]?.status || orderStatus)}>
                {trackingData?.orderStatus || orderStatus}
              </Badge>
            </div>

            {/* Tracking Timeline */}
            {trackingData?.trackingEvents && trackingData.trackingEvents.length > 0 && (
              <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {trackingData.trackingEvents.map((event, index) => (
                  <div key={index} className="mb-6 flex items-start relative">
                    <div className="absolute left-0 -translate-x-1/2 bg-white p-1 rounded-full z-10">
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900">{event.status}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {trackingData?.lastUpdated && (
              <p className="text-xs text-gray-500 text-center">
                Last updated: {new Date(trackingData.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}