"use client"

import { useState, useEffect, useCallback } from "react"
import type { Product, Review } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProductReviewForm } from "../reviews/product-review-form"
import { ProductQuestionForm } from "../reviews/product-question-form"
import { ProductAnswerForm } from "../reviews/product-answer-form"
import { collection, query, orderBy, getDocs, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ProductRatingSummary } from "../reviews/product-rating-summary" // New import
import { ProductReviewItem } from "../reviews/product-review-item" // New import

interface Question {
  id: string
  question: string
  userName: string
  createdAt: Date
  answers: Answer[]
}

interface Answer {
  id: string
  answer: string
  userName: string
  isOfficial: boolean
  createdAt: Date
}

interface Question {
  id: string
  question: string
  userName: string
  createdAt: Date
  answers: Answer[]
}

interface Answer {
  id: string
  answer: string
  userName: string
  isOfficial: boolean
  createdAt: Date
}

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [reviewSort, setReviewSort] = useState("recent")
  const [reviews, setReviews] = useState<Review[]>([])
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState(true)

  const [questions, setQuestions] = useState<Question[]>([])
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false)
  const [isAnswerFormOpen, setIsAnswerFormOpen] = useState<string | null>(null) // Stores questionId being answered
  const [loadingQuestions, setLoadingQuestions] = useState(true)

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true)
    try {
      const reviewsRef = collection(doc(db, "products", product.id), "reviews")
      let q = query(reviewsRef)

      if (reviewSort === "recent") {
        q = query(reviewsRef, orderBy("createdAt", "desc"))
      } else if (reviewSort === "helpful") {
        // This would require a 'helpful' count field on reviews
        // For now, we'll just sort by recent if helpful is not implemented
        q = query(reviewsRef, orderBy("createdAt", "desc"))
      } else if (reviewSort === "rating") {
        q = query(reviewsRef, orderBy("rating", "desc"))
      }

      const querySnapshot = await getDocs(q)
      const fetchedReviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(), // Convert Firebase Timestamp to Date
      })) as Review[]
      setReviews(fetchedReviews)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setReviews([])
    } finally {
      setLoadingReviews(false)
    }
  }, [product.id, reviewSort])

  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true)
    try {
      const questionsRef = collection(doc(db, "products", product.id), "questions")
      const q = query(questionsRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const fetchedQuestions: Question[] = []
      for (const questionDoc of querySnapshot.docs) {
        const questionData = {
          id: questionDoc.id,
          ...questionDoc.data(),
          createdAt: questionDoc.data().createdAt?.toDate(),
        } as Question

        // Fetch answers for each question
        const answersRef = collection(doc(db, "products", product.id, "questions", questionDoc.id), "answers")
        const answersQuery = query(answersRef, orderBy("createdAt", "asc"))
        const answersSnapshot = await getDocs(answersQuery)
        questionData.answers = answersSnapshot.docs.map((answerDoc) => ({
          id: answerDoc.id,
          ...answerDoc.data(),
          createdAt: answerDoc.data().createdAt?.toDate(),
        })) as Answer[]

        fetchedQuestions.push(questionData)
      }
      setQuestions(fetchedQuestions)
    } catch (error) {
      console.error("Error fetching questions:", error)
      setQuestions([])
    } finally {
      setLoadingQuestions(false)
    }
  }, [product.id])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  return (
    <div className="mt-12">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          <TabsTrigger value="qa">Q&A ({questions.length})</TabsTrigger>
          <TabsTrigger value="warranty">Warranty</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                <h3 className="text-lg font-semibold mb-3">Key Features and Benefits</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Advanced technology for optimal performance</li>
                  <li>• Durable construction for long-lasting use</li>
                  <li>• User-friendly design for easy operation</li>
                  <li>• Compatible with multiple devices</li>
                  <li>• Energy efficient and environmentally friendly</li>
                </ul>
                <h3 className="lg:text-lg font-semibold mb-3 mt-6">Usage Instructions</h3>
                <p className="text-gray-700">
                  Simply connect the device to your compatible smartphone or tablet. The product will automatically
                  detect and optimize charging speed. For best results, use the included cable and ensure proper
                  ventilation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                  <table className="w-full text-sm">
                    <tbody className="space-y-2">
                      {Object.entries(product.specifications || {}).map(([key, value]) => (
                        <tr key={key} className="border-b">
                          <td className="py-2 font-medium text-gray-600">{key}</td>
                          <td className="py-2 text-gray-900">{value}</td>
                        </tr>
                      ))}
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-600">Brand</td>
                        <td className="py-2 text-gray-900">{product.brand}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-600">Category</td>
                        <td className="py-2 text-gray-900">{product.category}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dimensions & Weight</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-600">Dimensions</td>
                        <td className="py-2 text-gray-900">10 x 5 x 2 cm</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-600">Weight</td>
                        <td className="py-2 text-gray-900">150g</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-600">Material</td>
                        <td className="py-2 text-gray-900">Premium ABS Plastic</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-600">Color Options</td>
                        <td className="py-2 text-gray-900">Black, White, Blue</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <p className="text-gray-600">Based on {product.reviewCount} reviews</p>
                </div>
                <div className="flex space-x-4">
                  <select
                    className="border rounded px-3 py-1 text-sm"
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="rating">Highest Rating</option>
                  </select>
                  <Dialog open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">Write a Review</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Write a Review for {product.name}</DialogTitle>
                      </DialogHeader>
                      <ProductReviewForm
                        productId={product.id}
                        onReviewSubmitted={fetchReviews}
                        onClose={() => setIsReviewFormOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Product Rating Summary */}
              {product.reviewCount > 0 && (
                <ProductRatingSummary averageRating={product.rating} totalReviews={product.reviewCount} reviews={reviews} />
              )}

              {loadingReviews ? (
                <div className="text-center text-gray-500">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center text-gray-500">No reviews yet. Be the first to review this product!</div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ProductReviewItem key={review.id} review={review} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Questions & Answers</h3>
                <Dialog open={isQuestionFormOpen} onOpenChange={setIsQuestionFormOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">Ask a Question</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Ask a Question about {product.name}</DialogTitle>
                    </DialogHeader>
                    <ProductQuestionForm
                      productId={product.id}
                      onQuestionSubmitted={fetchQuestions}
                      onClose={() => setIsQuestionFormOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {loadingQuestions ? (
                <div className="text-center text-gray-500">Loading questions...</div>
              ) : questions.length === 0 ? (
                <div className="text-center text-gray-500">No questions yet. Be the first to ask!</div>
              ) : (
                <div className="space-y-6">
                  {questions.map((qa) => (
                    <div key={qa.id} className="border-b pb-6 last:border-b-0">
                      <div className="mb-3">
                        <p className="font-medium text-gray-900 mb-2">Q: {qa.question}</p>
                        <p className="text-sm text-gray-600">
                          Asked by {qa.userName} on {qa.createdAt ? new Date(qa.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-4 mt-4">
                        {qa.answers && qa.answers.length > 0 ? (
                          qa.answers.map((answer: any) => (
                            <div key={answer.id} className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-gray-900 mb-2">A: {answer.answer}</p>
                              <p className="text-sm text-blue-600">
                                Answered by {answer.userName}{" "}
                                {answer.isOfficial && (
                                  <span className="font-semibold text-blue-800">(Official Store)</span>
                                )}{" "}
                                on {answer.createdAt ? new Date(answer.createdAt).toLocaleDateString() : "N/A"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm italic">No answers yet.</p>
                        )}
                      </div>
                      <div className="mt-3">
                        <Dialog
                          open={isAnswerFormOpen === qa.id}
                          onOpenChange={(open) => setIsAnswerFormOpen(open ? qa.id : null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Answer Question
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Answer Question</DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-gray-700 mb-2">**Q: {qa.question}**</p>
                            <ProductAnswerForm
                              productId={product.id}
                              questionId={qa.id}
                              onAnswerSubmitted={fetchQuestions}
                              onClose={() => setIsAnswerFormOpen(null)}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Warranty Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Warranty Coverage</h4>
                  <p className="text-gray-700">
                    This product comes with a comprehensive 1-year manufacturer warranty that covers all manufacturing
                    defects and component failures under normal usage conditions.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">What's Covered</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Manufacturing defects</li>
                    <li>• Component failures</li>
                    <li>• Performance issues</li>
                    <li>• Charging problems</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">What's Not Covered</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Physical damage due to misuse</li>
                    <li>• Water damage</li>
                    <li>• Normal wear and tear</li>
                    <li>• Damage due to unauthorized repairs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">How to Claim Warranty</h4>
                  <p className="text-gray-700">
                    Contact our customer support team with your order number and description of the issue. We'll guide
                    you through the warranty claim process and arrange for repair or replacement as needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
