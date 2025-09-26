/**
 * Fallback shipping rate calculation when Shiprocket API is unavailable
 * This provides basic shipping rates based on pincode zones
 */

interface ShippingZone {
  name: string
  pincodeRanges: { start: string, end: string }[]
  rate: number
  estimatedDays: number
}

// Define shipping zones based on major Indian regions
const SHIPPING_ZONES: ShippingZone[] = [
  {
    name: "Metro Cities",
    pincodeRanges: [
      { start: "110001", end: "110096" }, // Delhi
      { start: "400001", end: "400104" }, // Mumbai  
      { start: "560001", end: "560103" }, // Bangalore
      { start: "600001", end: "600123" }, // Chennai
      { start: "500001", end: "500100" }, // Hyderabad
      { start: "700001", end: "700150" }, // Kolkata
      { start: "411001", end: "411062" }, // Pune
      { start: "380001", end: "380061" }, // Ahmedabad
    ],
    rate: 49,
    estimatedDays: 2
  },
  {
    name: "Tier 1 Cities", 
    pincodeRanges: [
      { start: "201001", end: "201310" }, // Ghaziabad
      { start: "302001", end: "302042" }, // Jaipur
      { start: "226001", end: "226030" }, // Lucknow
      { start: "208001", end: "208027" }, // Kanpur
      { start: "440001", end: "440035" }, // Nagpur
      { start: "462001", end: "462050" }, // Bhopal
    ],
    rate: 69,
    estimatedDays: 3
  },
  {
    name: "Tier 2 Cities",
    pincodeRanges: [
      { start: "180001", end: "194301" }, // J&K
      { start: "171001", end: "177601" }, // Himachal Pradesh
      { start: "248001", end: "263680" }, // Uttarakhand
    ],
    rate: 89,
    estimatedDays: 4
  },
  {
    name: "Remote Areas",
    pincodeRanges: [
      { start: "790001", end: "798612" }, // North East
      { start: "744101", end: "744301" }, // Andaman & Nicobar
    ],
    rate: 149,
    estimatedDays: 7
  }
]

export function calculateFallbackShipping(pincode: string) {
  const pincodeNum = pincode.padStart(6, '0')
  
  // Find matching zone
  for (const zone of SHIPPING_ZONES) {
    for (const range of zone.pincodeRanges) {
      if (pincodeNum >= range.start && pincodeNum <= range.end) {
        return [
          {
            courier_name: "Standard Delivery",
            rate: zone.rate,
            estimated_delivery_days: zone.estimatedDays,
            description: `${zone.name} - ${zone.estimatedDays} days`
          },
          {
            courier_name: "Express Delivery", 
            rate: zone.rate + 50,
            estimated_delivery_days: Math.max(1, zone.estimatedDays - 1),
            description: `${zone.name} Express - ${Math.max(1, zone.estimatedDays - 1)} days`
          }
        ]
      }
    }
  }
  
  // Default fallback for unmatched pincodes
  return [
    {
      courier_name: "Standard Delivery",
      rate: 79,
      estimated_delivery_days: 5,
      description: "Standard - 5 days"
    },
    {
      courier_name: "Express Delivery",
      rate: 129, 
      estimated_delivery_days: 3,
      description: "Express - 3 days"
    }
  ]
}