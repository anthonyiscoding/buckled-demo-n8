"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExpandableText } from "@/components/ui/expandable-text"
import { useCustomerReviews } from "@/hooks/use-service-center-data"
import Link from "next/link"
import { ArrowLeft, Search, Filter, Star, TrendingUp, MessageSquare } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export default function CustomerReviewsPage() {
  const { reviews } = useCustomerReviews()
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [serviceFilter, setServiceFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    const filtered = reviews.filter((review) => {
      const matchesSearch =
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.carInfo.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter
      const matchesService = serviceFilter === "all" || review.serviceType === serviceFilter

      return matchesSearch && matchesRating && matchesService
    })

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
        case "oldest":
          return new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime()
        case "rating-high":
          return b.rating - a.rating
        case "rating-low":
          return a.rating - b.rating
        case "customer":
          return a.customerName.localeCompare(b.customerName)
        default:
          return 0
      }
    })

    return filtered
  }, [reviews, searchTerm, ratingFilter, serviceFilter, sortBy])

  // Chart data calculations
  const ratingDistribution = useMemo(() => {
    const distribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating: `${rating} Star${rating !== 1 ? "s" : ""}`,
      count: reviews.filter((r) => r.rating === rating).length,
      percentage: Math.round((reviews.filter((r) => r.rating === rating).length / reviews.length) * 100),
    }))
    return distribution
  }, [reviews])

  const serviceTypeRatings = useMemo(() => {
    const serviceTypes = [...new Set(reviews.map((r) => r.serviceType))]
    return serviceTypes.map((serviceType) => {
      const serviceReviews = reviews.filter((r) => r.serviceType === serviceType)
      const avgRating = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length
      return {
        serviceType,
        avgRating: Math.round(avgRating * 10) / 10,
        count: serviceReviews.length,
      }
    })
  }, [reviews])

  const monthlyTrend = useMemo(() => {
    const last6Months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthReviews = reviews.filter((r) => {
        const reviewDate = new Date(r.reviewDate)
        return reviewDate.getMonth() === date.getMonth() && reviewDate.getFullYear() === date.getFullYear()
      })

      const avgRating =
        monthReviews.length > 0 ? monthReviews.reduce((sum, r) => sum + r.rating, 0) / monthReviews.length : 0

      last6Months.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        avgRating: Math.round(avgRating * 10) / 10,
        count: monthReviews.length,
      })
    }

    return last6Months
  }, [reviews])

  const overallStats = useMemo(() => {
    const totalReviews = reviews.length
    const avgRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0
    const fiveStarCount = reviews.filter((r) => r.rating === 5).length
    const fiveStarPercentage = totalReviews > 0 ? (fiveStarCount / totalReviews) * 100 : 0

    return {
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      fiveStarPercentage: Math.round(fiveStarPercentage),
    }
  }, [reviews])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/service-center">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Reviews</h1>
                <p className="text-gray-600 text-sm sm:text-base">Monitor customer feedback and ratings</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-bold text-gray-900">{overallStats.avgRating}</span>
                  <div className="flex">{renderStars(Math.round(overallStats.avgRating))}</div>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{overallStats.totalReviews}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">5-Star Reviews</p>
                <p className="text-3xl font-bold text-green-600">{overallStats.fiveStarPercentage}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Rating Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Service Type Ratings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Rating by Service</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceTypeRatings} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="serviceType" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="avgRating" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card className="p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Trend (Last 6 Months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="avgRating" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reviews by customer, comment, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {[...new Set(reviews.map((r) => r.serviceType))].map((serviceType) => (
                    <SelectItem key={serviceType} value={serviceType}>
                      {serviceType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="rating-high">Highest Rating</SelectItem>
                  <SelectItem value="rating-low">Lowest Rating</SelectItem>
                  <SelectItem value="customer">By Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Reviews Table */}
        <Card className="hidden lg:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service & Vehicle</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-gray-50">
                    <TableCell>
                      <ExpandableText text={review.customerName} className="font-medium text-gray-900" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <ExpandableText text={review.serviceType} className="font-medium" />
                        <ExpandableText text={review.carInfo} className="text-sm text-gray-600 block mt-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <ExpandableText text={review.comment} className="text-sm text-gray-900" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">{formatDate(review.reviewDate)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No reviews found</div>
              <div className="text-sm text-gray-400">
                {searchTerm || ratingFilter !== "all" || serviceFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Customer reviews will appear here after completed services"}
              </div>
            </div>
          )}
        </Card>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{review.customerName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm font-medium">{review.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{formatDate(review.reviewDate)}</div>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <span className="text-sm text-gray-600">Service:</span>
                  <p className="font-medium">{review.serviceType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Vehicle:</span>
                  <p className="text-sm text-gray-600">{review.carInfo}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Review:</span>
                  <p className="text-sm text-gray-900 mt-1">{review.comment}</p>
                </div>
              </div>
            </Card>
          ))}

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No reviews found</div>
              <div className="text-sm text-gray-400">
                {searchTerm || ratingFilter !== "all" || serviceFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Customer reviews will appear here after completed services"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
