import { Star } from "lucide-react"
import type { Review } from "@/types"

interface ProductReviewItemProps {
  review: Review
}

export function ProductReviewItem({ review }: ProductReviewItemProps) {
  return (
    <div className="border-b pb-6 last:border-b-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium">{review.userName}</span>
            {review.verifiedPurchase && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-3">{review.comment}</p>
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image || "/placeholder.svg"}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-md"
            />
          ))}
        </div>
      )}
      {/* Helpful votes can be added here if 'helpful' field is added to Review interface */}
      {/* <div className="flex items-center space-x-4 text-sm">
        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
          <ThumbsUp className="h-4 w-4" />
          <span>Helpful ({review.helpful})</span>
        </button>
      </div> */}
    </div>
  )
}
