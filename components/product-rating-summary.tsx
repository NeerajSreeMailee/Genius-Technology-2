import { Star } from "lucide-react"
import type { Review } from "@/types"

interface ProductRatingSummaryProps {
  averageRating: number
  totalReviews: number
  reviews: Review[]
}

export function ProductRatingSummary({ averageRating, totalReviews, reviews }: ProductRatingSummaryProps) {
  const ratingCounts = reviews.reduce(
    (acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )

  const getPercentage = (star: number) => {
    const count = ratingCounts[star] || 0
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0
  }

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
      <div className="flex flex-col items-center md:items-start">
        <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-6 w-6 ${i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
          ))}
        </div>
        <p className="text-gray-600 text-sm">{totalReviews} Reviews</p>
      </div>

      <div className="flex-1 w-full">
        {Array.from({ length: 5 })
          .reverse()
          .map((_, i) => {
            const star = 5 - i
            const percentage = getPercentage(star)
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-gray-700">
                  {star} <Star className="inline-block h-3 w-3 fill-current text-yellow-400" />
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="w-8 text-right text-gray-600">{percentage.toFixed(0)}%</span>
              </div>
            )
          })}
      </div>
    </div>
  )
}
